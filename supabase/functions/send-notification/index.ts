// Unified notification dispatcher: writes in-app notification + sends branded email via Resend.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_API_KEY = Deno.env.get("VHS_Website");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FROM_ADDR = "Vitalis Health Strategies <noreply@mail.vitalisstrategies.com>";
const REPLY_TO = "info@vitalisstrategies.com";
const APP_BASE_URL = Deno.env.get("APP_BASE_URL") ?? "https://vitalis-website-new.lovable.app";

type Payload = {
  user_id: string;
  type: string;
  title: string;
  body?: string | null;
  link_url?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  actor_id?: string | null;
  workspace_id: string;
  email_subject?: string | null;
};

function emailHtml(title: string, body: string, ctaUrl: string, ctaLabel = "Open in Vitalis") {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f5f3ee;font-family:Helvetica,Arial,sans-serif;color:#1f2937;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e1d6;">
    <div style="background:#ffffff;border-bottom:2px solid #4a6741;padding:20px 28px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:#1C3D2E;letter-spacing:0.5px;">Vitalis Health Strategies</div>
    </div>
    <div style="height:4px;background:#c9a84c;"></div>
    <div style="padding:32px 28px;">
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;margin:0 0 12px;color:#1C3D2E;">${escapeHtml(title)}</h1>
      <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 24px;white-space:pre-wrap;">${escapeHtml(body)}</p>
      ${ctaUrl ? `<a href="${ctaUrl}" style="display:inline-block;background:#1C3D2E;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:4px;font-weight:600;font-size:14px;">${escapeHtml(ctaLabel)}</a>` : ""}
    </div>
    <div style="padding:20px 28px;border-top:1px solid #e6e1d6;font-size:11px;color:#9ca3af;">
      You're receiving this because notifications are enabled on your Vitalis account. Manage preferences in the app.
    </div>
  </div></body></html>`;
}
function escapeHtml(s: string) { return (s ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!)); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const p = (await req.json()) as Payload;
    if (!p?.user_id || !p?.type || !p?.title || !p?.workspace_id) {
      return new Response(JSON.stringify({ error: "user_id, type, title, workspace_id are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 1) Load recipient prefs + email
    const { data: profile } = await admin
      .from("profiles")
      .select("email, full_name, notification_preferences, notification_channels")
      .eq("id", p.user_id)
      .maybeSingle();

    const prefs = (profile?.notification_preferences ?? {}) as Record<string, { in_app?: boolean; email?: boolean }>;
    const channels = (profile?.notification_channels ?? { email: true, in_app: true }) as { email?: boolean; in_app?: boolean };
    const typePref = prefs[p.type] ?? {};
    const inAppEnabled = (typePref.in_app ?? true) && (channels.in_app ?? true);
    const emailEnabled = (typePref.email ?? true) && (channels.email ?? true);

    let notification_id: string | null = null;

    // 2) Insert in-app row
    if (inAppEnabled) {
      const { data: row, error } = await admin.from("notifications").insert({
        workspace_id: p.workspace_id, user_id: p.user_id, actor_id: p.actor_id ?? null,
        type: p.type, title: p.title, body: p.body ?? null,
        entity_type: p.entity_type ?? null, entity_id: p.entity_id ?? null,
        link_url: p.link_url ?? null,
      }).select("id").single();
      if (error) console.error("notifications insert error", error);
      else notification_id = row?.id ?? null;
    }

    // 3) Send email
    let email_status: string = "skipped";
    if (emailEnabled && profile?.email) {
      if (!RESEND_API_KEY) {
        email_status = "missing_api_key";
        console.warn("RESEND_API_KEY not configured");
      } else {
        const ctaUrl = p.link_url
          ? (p.link_url.startsWith("http") ? p.link_url : `${APP_BASE_URL}${p.link_url}`)
          : APP_BASE_URL;
        const subject = p.email_subject ?? p.title;
        const html = emailHtml(p.title, p.body ?? "", ctaUrl);
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({ from: FROM_ADDR, to: [profile.email], reply_to: REPLY_TO, subject, html }),
        });
        email_status = res.ok ? "sent" : `error_${res.status}`;
        if (!res.ok) console.error("resend error", res.status, await res.text());
      }
    } else if (!emailEnabled) {
      email_status = "disabled";
    }

    // Persist email_status on the in-app row so the bell can show the channel icon
    if (notification_id) {
      await admin.from("notifications").update({ email_status }).eq("id", notification_id);
    }

    return new Response(JSON.stringify({ ok: true, notification_id, email_status, in_app: inAppEnabled }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-notification error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
