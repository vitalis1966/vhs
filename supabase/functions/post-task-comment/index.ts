// Persists a task comment and fans out notifications to assignees, creator and mentioned users.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Unauthorized" }, 401);
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) return json({ error: "Unauthorized" }, 401);
    const uid = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const {
      task_id,
      body_html,
      body_text = "",
      mentioned_user_ids = [],
    } = body ?? {};

    if (!task_id || !body_html || typeof body_html !== "string") {
      return json({ error: "task_id and body_html required" }, 400);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Load task
    const { data: task } = await admin
      .from("tasks")
      .select("id, title, workspace_id, client_id, created_by")
      .eq("id", task_id)
      .maybeSingle();
    if (!task) return json({ error: "Task not found" }, 404);

    // Verify author is a workspace member
    const { data: member } = await admin
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", task.workspace_id)
      .eq("user_id", uid)
      .eq("status", "active")
      .maybeSingle();
    if (!member) return json({ error: "Not a workspace member" }, 403);

    // Filter mentions to actual workspace members
    let validMentions: string[] = [];
    if (Array.isArray(mentioned_user_ids) && mentioned_user_ids.length) {
      const { data: ms } = await admin
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", task.workspace_id)
        .eq("status", "active")
        .in("user_id", mentioned_user_ids);
      validMentions = Array.from(new Set((ms ?? []).map((m: any) => m.user_id))) as string[];
    }

    // Insert the comment
    const { data: comment, error: cErr } = await admin
      .from("task_comments")
      .insert({
        task_id,
        workspace_id: task.workspace_id,
        author_id: uid,
        body_html,
        body_text: body_text ?? "",
        mentioned_user_ids: validMentions,
      })
      .select("id, created_at")
      .single();
    if (cErr || !comment) return json({ error: cErr?.message ?? "Insert failed" }, 500);

    // Load context for notifications
    const [{ data: assignees }, { data: muted }, { data: authorProf }, { data: clientRow }] = await Promise.all([
      admin.from("task_assignees").select("user_id").eq("task_id", task_id),
      admin.from("task_mutes").select("user_id").eq("task_id", task_id),
      admin.from("profiles").select("full_name, email").eq("id", uid).maybeSingle(),
      admin.from("clients").select("name").eq("id", task.client_id).maybeSingle(),
    ]);
    const assigneeIds = new Set<string>((assignees ?? []).map((r: any) => r.user_id));
    const mutedIds = new Set<string>((muted ?? []).map((r: any) => r.user_id));
    const authorName = authorProf?.full_name ?? authorProf?.email ?? "Someone";
    const clientName = clientRow?.name ?? "a client";

    // Build recipient list: assignees + creator + mentions, dedupe, skip author + muted
    const recipients = new Set<string>();
    for (const a of assigneeIds) recipients.add(a);
    if (task.created_by) recipients.add(task.created_by);
    for (const m of validMentions) recipients.add(m);
    recipients.delete(uid);

    const linkUrl = `/app/tasks?task=${task_id}`;
    const snippet = (body_text ?? "").slice(0, 240);

    // Dispatch notifications in parallel via send-notification
    const sends: Promise<unknown>[] = [];
    for (const recipient of recipients) {
      if (mutedIds.has(recipient)) continue;
      const isMention = validMentions.includes(recipient);
      const title = isMention
        ? `${authorName} mentioned you in a task: ${task.title}`
        : `${authorName} commented on: ${task.title}`;
      sends.push(
        fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SERVICE_ROLE}`,
          },
          body: JSON.stringify({
            user_id: recipient,
            type: isMention ? "mention" : "task_comment",
            workspace_id: task.workspace_id,
            actor_id: uid,
            title,
            body: snippet,
            link_url: linkUrl,
            entity_type: "task",
            entity_id: task_id,
            email_subject: title,
          }),
        }).catch((e) => console.error("notify fail", e)),
      );
    }
    await Promise.allSettled(sends);

    return json({ id: comment.id, created_at: comment.created_at, mentioned: validMentions });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
