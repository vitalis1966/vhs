import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function parseFrom(raw: string): { email: string; name: string | null } {
  if (!raw) return { email: "", name: null };
  const m = raw.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (m) return { email: m[2].trim().toLowerCase(), name: m[1].trim() || null };
  return { email: raw.trim().toLowerCase(), name: null };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const secret = Deno.env.get("RESEND_WEBHOOK_SECRET");
  const provided = req.headers.get("x-webhook-secret");
  if (!secret || provided !== secret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let payload: any;
  try { payload = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Resend inbound payload may be wrapped in { type, data: {...} }
  const data = payload?.data ?? payload;

  const fromRaw = data?.from ?? data?.from_email ?? "";
  const fromObj = typeof fromRaw === "object" ? fromRaw : parseFrom(String(fromRaw));
  const from_email = (fromObj.email || data?.from_email || "").toLowerCase();
  const from_name = fromObj.name || data?.from_name || null;
  const subject = data?.subject ?? null;
  const body_text = data?.text ?? data?.body_text ?? null;
  const body_html = data?.html ?? data?.body_html ?? null;
  const resend_email_id = data?.email_id ?? data?.id ?? data?.message_id ?? null;

  if (!from_email) {
    return new Response(JSON.stringify({ error: "missing from address" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Find user by email through profiles -> workspace_members
  let assigned_to: string | null = null;
  let workspace_id: string | null = null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", from_email)
    .maybeSingle();

  if (profile?.id) {
    const { data: wm } = await supabase
      .from("workspace_members")
      .select("workspace_id, user_id")
      .eq("user_id", profile.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
    if (wm) {
      assigned_to = wm.user_id;
      workspace_id = wm.workspace_id;
    }
  }

  // Fallback: admin@vitalisstrategies.com
  if (!assigned_to) {
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", "admin@vitalisstrategies.com")
      .maybeSingle();
    if (adminProfile?.id) {
      const { data: wm } = await supabase
        .from("workspace_members")
        .select("workspace_id, user_id")
        .eq("user_id", adminProfile.id)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();
      if (wm) {
        assigned_to = wm.user_id;
        workspace_id = wm.workspace_id;
      }
    }
  }

  // Final fallback workspace
  if (!workspace_id) {
    const { data: ws } = await supabase
      .from("workspaces")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    workspace_id = ws?.id ?? null;
  }

  const insertPayload: any = {
    workspace_id,
    assigned_to,
    from_email,
    from_name,
    subject,
    body_text,
    body_html,
    received_at: new Date().toISOString(),
    status: "not_assigned",
    resend_email_id,
  };

  const { error } = await supabase
    .from("inbound_emails")
    .upsert(insertPayload, { onConflict: "resend_email_id", ignoreDuplicates: true });

  if (error) {
    console.error("inbound insert error", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
