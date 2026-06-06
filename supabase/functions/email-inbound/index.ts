import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret, svix-id, svix-timestamp, svix-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function parseFrom(raw: string): { email: string; name: string | null } {
  if (!raw) return { email: "", name: null };
  const m = raw.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (m) return { email: m[2].trim().toLowerCase(), name: m[1].trim() || null };
  return { email: raw.trim().toLowerCase(), name: null };
}

function firstNonEmpty(...vals: any[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v;
  }
  return null;
}

// Walk known body locations across inbound providers (Resend, CF Email Workers,
// Postmark, Mailgun, SendGrid, generic parsers). Returns first non-empty match.
function pickBody(data: any): { text: string | null; html: string | null } {
  const d = data || {};
  const email = d.email || {};
  const parsed = d.parsedEmail || d.parsed_email || {};
  const message = d.message || {};

  const text = firstNonEmpty(
    d.text,
    d.body_text,
    d.bodyText,
    d.TextBody,
    d.plain,
    d["body-plain"],
    d.text_body,
    email.text,
    email.body_text,
    email.TextBody,
    parsed.text,
    parsed.body_text,
    message.text,
    message.body_text,
  );

  const html = firstNonEmpty(
    d.html,
    d.body_html,
    d.bodyHtml,
    d.HtmlBody,
    d.html_content,
    d["body-html"],
    d.html_body,
    email.html,
    email.body_html,
    email.HtmlBody,
    parsed.html,
    parsed.body_html,
    message.html,
    message.body_html,
  );

  return { text, html };
}

async function verifySvix(secret: string, req: Request, body: string): Promise<boolean> {
  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const sigHeader = req.headers.get("svix-signature");
  if (!id || !timestamp || !sigHeader) return false;
  const secretBytes = secret.startsWith("whsec_")
    ? Uint8Array.from(atob(secret.slice(6)), (c) => c.charCodeAt(0))
    : new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    "raw", secretBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const toSign = new TextEncoder().encode(`${id}.${timestamp}.${body}`);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, toSign));
  const expected = btoa(String.fromCharCode(...sig));
  const provided = sigHeader.split(" ").map((s) => s.split(",")[1]).filter(Boolean);
  return provided.includes(expected);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  console.log("[email-inbound] incoming request", {
    has_svix: !!req.headers.get("svix-signature"),
    has_custom_secret: !!req.headers.get("x-webhook-secret"),
  });

  const rawBody = await req.text();
  const secret = Deno.env.get("RESEND_WEBHOOK_SECRET");

  if (secret) {
    const providedCustom = req.headers.get("x-webhook-secret");
    const customOk = providedCustom && providedCustom === secret;
    const svixOk = req.headers.get("svix-signature") ? await verifySvix(secret, req, rawBody) : false;
    if (!customOk && !svixOk) {
      console.warn("[email-inbound] unauthorized: secret mismatch");
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  } else {
    console.warn("[email-inbound] RESEND_WEBHOOK_SECRET not set — accepting unsigned request");
  }

  let payload: any;
  try { payload = JSON.parse(rawBody); } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Payload may be wrapped in { type, data: {...} }
  const data = payload?.data ?? payload;
  const nestedEmail = data?.email && typeof data.email === "object" ? data.email : null;

  // Log top-level keys (no content) for diagnosing unknown shapes
  try {
    console.log("[email-inbound] payload keys", {
      root: Object.keys(payload ?? {}),
      data: Object.keys(data ?? {}),
      nested_email: nestedEmail ? Object.keys(nestedEmail) : null,
    });
  } catch (_) { /* ignore */ }

  const fromRaw = data?.from ?? data?.from_email ?? nestedEmail?.from ?? nestedEmail?.from_email ?? "";
  const fromObj = typeof fromRaw === "object" ? fromRaw : parseFrom(String(fromRaw));
  let from_email = (fromObj.email || data?.from_email || nestedEmail?.from_email || "").toLowerCase();
  let from_name = fromObj.name || data?.from_name || nestedEmail?.from_name || null;
  let subject = firstNonEmpty(data?.subject, nestedEmail?.subject, data?.Subject);
  let { text: body_text, html: body_html } = pickBody(data);
  const resend_email_id = data?.email_id ?? data?.id ?? data?.message_id ?? nestedEmail?.id ?? null;

  // Fallback: if webhook payload lacks body (Resend sends metadata-only events
  // for some event types), fetch the full email from Resend's API.
  if ((!body_text && !body_html) && resend_email_id) {
    const resendKey = Deno.env.get("VHS_Website");
    if (resendKey) {
      try {
        const r = await fetch(`https://api.resend.com/emails/${resend_email_id}`, {
          headers: { Authorization: `Bearer ${resendKey}` },
        });
        if (r.ok) {
          const ed: any = await r.json();
          if (!body_text && typeof ed.text === "string") body_text = ed.text;
          if (!body_html && typeof ed.html === "string") body_html = ed.html;
          if (!subject && typeof ed.subject === "string") subject = ed.subject;
          if (!from_email && typeof ed.from === "string") {
            const p = parseFrom(ed.from);
            from_email = p.email.toLowerCase();
            from_name = from_name || p.name;
          }
          console.log("[email-inbound] fetched from Resend API", { id: resend_email_id, has_text: !!body_text, has_html: !!body_html });
        } else {
          console.warn("[email-inbound] Resend API fetch failed", { status: r.status, body: await r.text() });
        }
      } catch (e) {
        console.error("[email-inbound] Resend API fetch error", e);
      }
    } else {
      console.warn("[email-inbound] no Resend API key available for body fetch");
    }
  }

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

  console.log("[email-inbound] inserting", {
    from_email,
    subject,
    workspace_id,
    assigned_to,
    resend_email_id,
    has_text: !!body_text,
    has_html: !!body_html,
  });

  // Check for an existing row by resend_email_id so we can backfill empty bodies
  // on retry without changing already-populated rows.
  if (resend_email_id) {
    const { data: existing } = await supabase
      .from("inbound_emails")
      .select("id, body_text, body_html")
      .eq("resend_email_id", resend_email_id)
      .maybeSingle();

    if (existing?.id) {
      const patch: Record<string, any> = {};
      if (!existing.body_text && body_text) patch.body_text = body_text;
      if (!existing.body_html && body_html) patch.body_html = body_html;
      if (Object.keys(patch).length > 0) {
        const { error: upErr } = await supabase
          .from("inbound_emails")
          .update(patch)
          .eq("id", existing.id);
        if (upErr) {
          console.error("[email-inbound] backfill error", upErr);
          return new Response(JSON.stringify({ error: upErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        console.log("[email-inbound] backfilled body on existing row", { id: existing.id, patched: Object.keys(patch) });
      } else {
        console.log("[email-inbound] duplicate ignored", { id: existing.id });
      }
      return new Response(JSON.stringify({ ok: true, deduped: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }

  const { error } = await supabase
    .from("inbound_emails")
    .insert(insertPayload);

  if (error) {
    console.error("[email-inbound] insert error", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  console.log("[email-inbound] stored ok");
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
