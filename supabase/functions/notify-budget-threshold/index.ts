// supabase/functions/notify-budget-threshold/index.ts
// Checks contracted-hour usage vs allocation after a time entry is saved,
// inserts in-app notifications, and emails admins at 90% and 100%.
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY = Deno.env.get("VHS_Website")!;
const FROM = "Vitalis Health Strategies <noreply@mail.vitalisstrategies.com>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function fmtH(hours: number) {
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const THRESHOLDS = [75, 90, 100];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { client_id, activity_type_id } = await req.json();
    if (!client_id) {
      return new Response(JSON.stringify({ error: "client_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: client } = await admin.from("clients").select("id, name, workspace_id, account_owner_id").eq("id", client_id).maybeSingle();
    if (!client) return new Response(JSON.stringify({ ok: true, skipped: "no_client" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: contract } = await admin.from("contracted_hours").select("*").eq("client_id", client_id).maybeSingle();
    if (!contract) return new Response(JSON.stringify({ ok: true, skipped: "no_contract" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: allocs } = await admin.from("contracted_hours_by_activity").select("*").eq("contracted_hours_id", contract.id);

    // Aggregate usage
    const { data: entries } = await admin.from("time_entries").select("activity_type_id, duration_seconds").eq("client_id", client_id);
    let totalUsedSec = 0;
    const byActivitySec: Record<string, number> = {};
    (entries ?? []).forEach((e: any) => {
      totalUsedSec += e.duration_seconds || 0;
      byActivitySec[e.activity_type_id] = (byActivitySec[e.activity_type_id] ?? 0) + (e.duration_seconds || 0);
    });

    // Activity-type names
    const { data: actTypes } = await admin.from("time_activity_types").select("id, name").eq("workspace_id", client.workspace_id);
    const actName: Record<string, string> = {};
    (actTypes ?? []).forEach((a: any) => { actName[a.id] = a.name; });

    // Admin / manager recipients
    const { data: admins } = await admin
      .from("workspace_members")
      .select("user_id, role")
      .eq("workspace_id", client.workspace_id)
      .eq("status", "active")
      .in("role", ["admin", "manager"]);
    const adminIds = (admins ?? []).map((a: any) => a.user_id).filter(Boolean);
    const recipientIds = Array.from(new Set([...adminIds, client.account_owner_id].filter(Boolean)));

    let adminEmails: string[] = [];
    if (recipientIds.length) {
      const { data: profs } = await admin.from("profiles").select("id, email, full_name").in("id", recipientIds);
      adminEmails = (profs ?? []).map((p: any) => p.email).filter(Boolean);
    }

    const checks: Array<{ scope: string; threshold: number; allocated: number; used: number; activity_type_id: string | null }> = [];
    // Total
    const totalAllocated = Number(contract.total_hours ?? 0);
    if (totalAllocated > 0) {
      const usedH = totalUsedSec / 3600;
      for (const t of THRESHOLDS) {
        if (usedH >= (totalAllocated * t) / 100) {
          checks.push({ scope: "Total", threshold: t, allocated: totalAllocated, used: usedH, activity_type_id: null });
        }
      }
    }
    // Per-activity
    (allocs ?? []).forEach((a: any) => {
      const alloc = Number(a.allocated_hours ?? 0);
      if (alloc <= 0) return;
      const usedH = (byActivitySec[a.activity_type_id] ?? 0) / 3600;
      for (const t of THRESHOLDS) {
        if (usedH >= (alloc * t) / 100) {
          checks.push({ scope: actName[a.activity_type_id] ?? "Activity", threshold: t, allocated: alloc, used: usedH, activity_type_id: a.activity_type_id });
        }
      }
    });

    // Filter — only "new" crossings (dedupe via client_budget_alerts_sent)
    const fresh: typeof checks = [];
    for (const c of checks) {
      const { data: existing } = await admin
        .from("client_budget_alerts_sent")
        .select("id")
        .eq("contracted_hours_id", contract.id)
        .eq("threshold", c.threshold)
        .is("activity_type_id", c.activity_type_id)
        .maybeSingle();
      // .is(...) doesn't work with non-null; do explicit handling
      let alreadySent = !!existing;
      if (c.activity_type_id !== null) {
        const { data: existing2 } = await admin
          .from("client_budget_alerts_sent")
          .select("id")
          .eq("contracted_hours_id", contract.id)
          .eq("threshold", c.threshold)
          .eq("activity_type_id", c.activity_type_id)
          .maybeSingle();
        alreadySent = !!existing2;
      }
      if (!alreadySent) fresh.push(c);
    }

    // Insert dedupe rows + notifications + send emails
    const breakdown = (allocs ?? []).map((a: any) => {
      const allocated = Number(a.allocated_hours ?? 0);
      const used = (byActivitySec[a.activity_type_id] ?? 0) / 3600;
      const rem = Math.max(0, allocated - used);
      return { activity: actName[a.activity_type_id] ?? "—", allocated: fmtH(allocated), used: fmtH(used), remaining: fmtH(rem) };
    });

    for (const c of fresh) {
      // dedupe row
      await admin.from("client_budget_alerts_sent").insert({
        client_id: client.id,
        contracted_hours_id: contract.id,
        activity_type_id: c.activity_type_id,
        threshold: c.threshold,
      });

      const title = c.threshold >= 100
        ? `Contracted hours reached — ${client.name}`
        : `${client.name} is at ${c.threshold}% of contracted ${c.scope.toLowerCase()} hours`;
      const body = `${fmtH(c.used)} used of ${fmtH(c.allocated)} contracted (${c.scope}).`;
      const link = `/app/clients/${client.id}?tab=hours`;

      // In-app notifications
      for (const uid of recipientIds) {
        await admin.from("notifications").insert({
          user_id: uid,
          workspace_id: client.workspace_id,
          type: "budget_alert",
          title,
          body,
          link_url: link,
          entity_type: "client",
          entity_id: client.id,
          actor_id: null,
        });
      }

      // Email at 90/100%
      if (c.threshold >= 90 && adminEmails.length) {
        const subject = c.threshold >= 100
          ? `Contracted hours reached — ${client.name}`
          : `Heads up — ${client.name} approaching contracted hours limit`;

        // Use the send-transactional-email function (registered template + queue + suppression)
        try {
          await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SERVICE_KEY}` },
            body: JSON.stringify({
              templateName: "budget-alert",
              recipientEmail: adminEmails[0],
              cc: adminEmails.slice(1),
              idempotencyKey: `budget-${contract.id}-${c.activity_type_id ?? "total"}-${c.threshold}`,
              templateData: {
                client_name: client.name,
                threshold: c.threshold,
                scope: c.scope,
                used_hours: fmtH(c.used),
                contracted_hours: fmtH(c.allocated),
                decimal_used: c.used.toFixed(2) + "h",
                decimal_contracted: c.allocated.toFixed(2) + "h",
                breakdown,
              },
            }),
          });
        } catch (e) {
          // fallback: send via Resend directly
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: FROM, to: adminEmails, subject,
                html: `<h2>${subject}</h2><p>${body}</p>`,
              }),
            });
          } catch {}
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, crossings: fresh.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
