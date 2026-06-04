// Persists a reviewed/edited pasted-email payload: email record + tasks + meeting + optional new contact.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Unauthorized" }, 401);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });

    const { data: userData } = await client.auth.getUser();
    if (!userData?.user) return json({ error: "Unauthorized" }, 401);
    const uid = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const {
      workspace_id,
      client_id,
      project_id,
      raw_body,
      from_name, from_email, to_addresses, cc_addresses, subject, sent_at,
      ai_summary, ai_category, ai_payload,
      tasks = [], // [{title, due_date, priority, assignee_user_id, description}]
      meeting = null, // {title, starts_at, location, attendees:[user_ids], external_attendees:[strings]}
      create_contact = false,
      contact_name,
      attachments = [], // [{storage_path, file_name, mime_type, size_bytes}]
      mode = "all", // "all" | "email_only"
    } = body ?? {};

    if (!workspace_id) return json({ error: "workspace_id required" }, 400);
    if (!raw_body) return json({ error: "raw_body required" }, 400);

    // Verify workspace membership
    const { data: member } = await client
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", workspace_id)
      .eq("user_id", uid)
      .eq("status", "active")
      .maybeSingle();
    if (!member) return json({ error: "Not a workspace member" }, 403);

    // Optionally create a new contact
    let new_contact_id: string | null = null;
    if (mode === "all" && create_contact && client_id && from_email) {
      const { data: c, error: cErr } = await client
        .from("contacts")
        .insert({
          client_id,
          name: contact_name || from_name || from_email,
          email: from_email,
          needs_review: true,
          created_from: "email_manual_paste",
        })
        .select("id")
        .single();
      if (!cErr) new_contact_id = c?.id ?? null;
    }

    // Insert pasted_email
    const { data: emailRow, error: emErr } = await client
      .from("pasted_emails")
      .insert({
        workspace_id,
        client_id: client_id ?? null,
        project_id: project_id ?? null,
        imported_by: uid,
        from_name, from_email,
        to_addresses: to_addresses ?? [],
        cc_addresses: cc_addresses ?? [],
        subject, sent_at,
        raw_body,
        ai_summary, ai_category,
        ai_payload: ai_payload ?? null,
      })
      .select("id")
      .single();
    if (emErr || !emailRow) return json({ error: emErr?.message ?? "Insert failed" }, 500);
    const emailId = emailRow.id;

    // Persist attachments: create platform_documents rows + attachments linking to this email
    const created_attachment_ids: string[] = [];
    if (Array.isArray(attachments) && attachments.length > 0) {
      for (const a of attachments) {
        if (!a?.storage_path || !a?.file_name) continue;
        const { data: doc, error: docErr } = await client
          .from("platform_documents")
          .insert({
            workspace_id,
            storage_path: a.storage_path,
            file_name: a.file_name,
            mime_type: a.mime_type ?? null,
            size_bytes: a.size_bytes ?? null,
            uploaded_by: uid,
          })
          .select("id")
          .single();
        if (docErr || !doc) continue;
        const { data: att } = await client
          .from("attachments")
          .insert({
            document_id: doc.id,
            attachable_type: "pasted_email",
            attachable_id: emailId,
          })
          .select("id")
          .single();
        if (att) created_attachment_ids.push(att.id);
      }
    }

    const created_task_ids: string[] = [];
    let created_meeting_id: string | null = null;

    if (mode === "all" && client_id) {
      // Resolve default "todo" status
      const { data: status } = await client
        .from("task_statuses")
        .select("id")
        .eq("workspace_id", workspace_id)
        .eq("category", "todo")
        .order("position", { ascending: true })
        .limit(1)
        .maybeSingle();

      for (const t of tasks) {
        if (!t?.title) continue;
        const { data: taskRow, error: tErr } = await client
          .from("tasks")
          .insert({
            workspace_id,
            client_id,
            project_id: project_id ?? null,
            title: t.title,
            description_text: t.description ?? `From email: "${subject ?? ""}" (sender: ${from_name ?? from_email ?? "unknown"})`,
            priority: ["Low", "Medium", "High", "Urgent"].includes(t.priority) ? t.priority : (t.priority === "Normal" ? "Medium" : "Medium"),
            due_date: t.due_date ?? null,
            status_id: status?.id ?? null,
            created_by: uid,
            source_email_id: emailId,
            source_kind: "email_manual_paste",
          })
          .select("id")
          .single();
        if (tErr || !taskRow) continue;
        created_task_ids.push(taskRow.id);
        const assigneeId = t.assignee_user_id || uid;
        if (assigneeId) {
          await client.from("task_assignees").insert({ task_id: taskRow.id, user_id: assigneeId });
        }
      }

      // Meeting
      if (meeting && meeting.create !== false && (meeting.title || meeting.starts_at)) {
        const { data: mRow, error: mErr } = await client
          .from("meetings")
          .insert({
            workspace_id,
            client_id,
            project_id: project_id ?? null,
            title: meeting.title ?? subject ?? "Meeting from email",
            meeting_date: meeting.starts_at ?? new Date().toISOString(),
            external_attendees: Array.isArray(meeting.external_attendees) ? meeting.external_attendees : [],
            created_by: uid,
            source_email_id: emailId,
          })
          .select("id")
          .single();
        if (!mErr && mRow) {
          created_meeting_id = mRow.id;
          const attendeeIds: string[] = Array.isArray(meeting.attendees) ? meeting.attendees : [];
          for (const userId of attendeeIds) {
            await client.from("meeting_attendees").insert({ meeting_id: mRow.id, user_id: userId });
          }
        }
      }
    }

    return json({
      email_id: emailId,
      contact_id: new_contact_id,
      task_ids: created_task_ids,
      meeting_id: created_meeting_id,
      attachment_ids: created_attachment_ids,
    });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }

  function json(payload: unknown, status = 200) {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
