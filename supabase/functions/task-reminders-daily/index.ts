// Daily job: fires task_overdue (due_date = yesterday) and due_soon (due_date = tomorrow).
// Scheduled via pg_cron at 14:00 UTC (08:00 Mountain Daylight Time).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function ymd(d: Date) {
  const y = d.getUTCFullYear(), m = String(d.getUTCMonth() + 1).padStart(2, "0"), day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
  const today = new Date();
  const yesterday = new Date(today); yesterday.setUTCDate(today.getUTCDate() - 1);
  const tomorrow = new Date(today); tomorrow.setUTCDate(today.getUTCDate() + 1);

  // Allow override for manual testing
  let overdueDate = ymd(yesterday);
  let dueSoonDate = ymd(tomorrow);
  try {
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (body?.overdue_date) overdueDate = body.overdue_date;
      if (body?.due_soon_date) dueSoonDate = body.due_soon_date;
    }
  } catch {}

  const dispatch = async (payload: Record<string, unknown>) => {
    await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_ROLE}` },
      body: JSON.stringify(payload),
    });
  };

  const handle = async (dateStr: string, kind: "task_overdue" | "due_soon") => {
    const { data: tasks } = await admin
      .from("tasks")
      .select("id, title, client_id, workspace_id, due_date, completed_at, clients(name)")
      .eq("due_date", dateStr)
      .is("completed_at", null);
    let dispatched = 0;
    for (const t of (tasks ?? []) as any[]) {
      const { data: asn } = await admin.from("task_assignees").select("user_id").eq("task_id", t.id);
      const clientName = t.clients?.name ?? "client";
      const title = kind === "task_overdue" ? `Overdue task: ${t.title}` : `Task due tomorrow: ${t.title}`;
      const body = kind === "task_overdue"
        ? `This task on ${clientName} was due ${dateStr} and isn't marked complete.`
        : `This task on ${clientName} is due tomorrow (${dateStr}).`;
      for (const a of (asn ?? []) as any[]) {
        await dispatch({
          user_id: a.user_id, type: kind, title, body,
          link_url: `/app/tasks?task=${t.id}`,
          entity_type: "task", entity_id: t.id, workspace_id: t.workspace_id,
          email_subject: title,
        });
        dispatched++;
      }
    }
    return dispatched;
  };

  const overdue_sent = await handle(overdueDate, "task_overdue");
  const due_soon_sent = await handle(dueSoonDate, "due_soon");

  return new Response(JSON.stringify({ ok: true, overdueDate, dueSoonDate, overdue_sent, due_soon_sent }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
