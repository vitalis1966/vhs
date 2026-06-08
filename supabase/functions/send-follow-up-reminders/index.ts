import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = Deno.env.get("APP_URL") ?? "https://vitalisstrategies.com";

function addInterval(date: Date, value: number, unit: "hours" | "days" | "months"): Date {
  const d = new Date(date);
  if (unit === "hours") d.setHours(d.getHours() + value);
  else if (unit === "days") d.setDate(d.getDate() + value);
  else if (unit === "months") d.setMonth(d.getMonth() + value);
  return d;
}

function advance(date: Date, freq: string): Date {
  const d = new Date(date);
  switch (freq) {
    case "daily": d.setDate(d.getDate() + 1); break;
    case "weekly": d.setDate(d.getDate() + 7); break;
    case "biweekly": d.setDate(d.getDate() + 14); break;
    case "monthly": d.setMonth(d.getMonth() + 1); break;
    case "quarterly": d.setMonth(d.getMonth() + 3); break;
  }
  return d;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const resendKey = Deno.env.get("VHS_Website");
  if (!resendKey) {
    console.warn("[send-follow-up-reminders] missing VHS_Website key");
  }

  const now = new Date();
  const { data: rows, error } = await supabase
    .from("task_follow_ups")
    .select("id, task_id, follow_up_date, follow_up_due_date, remind_before_value, remind_before_unit, is_recurring, recurrence_frequency, resource_kind, resource_id, resource_contact_id, resource_external_email, last_reminder_sent_at, enabled, follow_up_status")
    .eq("enabled", true)
    .neq("follow_up_status", "completed");

  if (error) {
    console.error("[send-follow-up-reminders] query error", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let sent = 0; let failed = 0;
  for (const r of (rows ?? [])) {
    try {
      if (!r.follow_up_date) continue;
      const triggerAt = (r.remind_before_value && r.remind_before_unit)
        ? addInterval(new Date(r.follow_up_date), -Number(r.remind_before_value), r.remind_before_unit)
        : new Date(r.follow_up_date);
      if (triggerAt > now) continue;
      // Skip if already sent for this scheduled date
      if (r.last_reminder_sent_at && new Date(r.last_reminder_sent_at) >= new Date(r.follow_up_date)) continue;

      // Load task + client + recipient
      const { data: task } = await supabase
        .from("tasks").select("id, title, client_id").eq("id", r.task_id).maybeSingle();
      if (!task) continue;
      const { data: client } = task.client_id
        ? await supabase.from("clients").select("name").eq("id", task.client_id).maybeSingle()
        : { data: null } as any;

      let recipientEmail: string | null = null;
      if (r.resource_id) {
        const { data: prof } = await supabase.from("profiles").select("email").eq("id", r.resource_id).maybeSingle();
        recipientEmail = prof?.email ?? null;
      }
      if (!recipientEmail) {
        const { data: ta } = await supabase.from("task_assignees").select("user_id").eq("task_id", r.task_id).limit(1).maybeSingle();
        if (ta?.user_id) {
          const { data: prof } = await supabase.from("profiles").select("email").eq("id", ta.user_id).maybeSingle();
          recipientEmail = prof?.email ?? null;
        }
      }
      if (!recipientEmail) { console.warn("[send-follow-up-reminders] no recipient for", r.id); continue; }

      const taskUrl = `${APP_URL}/app/tasks?task=${r.task_id}`;
      const subject = `Follow Up Reminder: ${task.title}`;
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px">
          <h2 style="margin:0 0 12px">Follow Up Reminder</h2>
          <p><strong>${task.title}</strong>${client?.name ? ` — ${client.name}` : ""}</p>
          <p>
            ${r.follow_up_date ? `<div>Follow up date: ${new Date(r.follow_up_date).toLocaleString()}</div>` : ""}
            ${r.follow_up_due_date ? `<div>Due date: ${new Date(r.follow_up_due_date).toLocaleString()}</div>` : ""}
          </p>
          <p><a href="${taskUrl}" style="background:#1f6b3a;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;display:inline-block">Open task in Vitalis OS</a></p>
        </div>`;

      if (resendKey) {
        const r2 = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Vitalis OS <notify@mail.vitalisstrategies.com>",
            to: [recipientEmail], subject, html,
          }),
        });
        if (!r2.ok) {
          const text = await r2.text();
          console.error("[send-follow-up-reminders] resend error", r2.status, text);
          failed++; continue;
        }
      }
      sent++;

      // Update follow-up record
      const update: any = { last_reminder_sent_at: new Date().toISOString() };
      if (r.is_recurring && r.recurrence_frequency) {
        update.follow_up_date = advance(new Date(r.follow_up_date), r.recurrence_frequency).toISOString();
      }
      await supabase.from("task_follow_ups").update(update).eq("id", r.id);
    } catch (e) {
      console.error("[send-follow-up-reminders] row error", e);
      failed++;
    }
  }

  return new Response(JSON.stringify({ ok: true, sent, failed, total: rows?.length ?? 0 }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
