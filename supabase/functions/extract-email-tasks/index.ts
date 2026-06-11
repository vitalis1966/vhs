// Extract tasks from a forwarded inbound email using the shared extraction module.
// Aligned to the Paste Email path — same prompt, model, tool schema, and post-processing.
import { createClient } from "npm:@supabase/supabase-js@2";
import { composeEmailForExtraction, extractEmailViaGateway, GatewayError } from "../_shared/extract-email-tasks.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: claims } = await userClient.auth.getClaims(authHeader.replace("Bearer ", ""));
  if (!claims?.claims) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let body: { email_id?: string; reuse?: boolean };
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (!body.email_id) {
    return new Response(JSON.stringify({ error: "email_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  if (body.reuse) {
    const { data: existing } = await admin
      .from("email_extracted_tasks")
      .select("id, title, description, priority, position, status, task_id")
      .eq("email_id", body.email_id)
      .order("position", { ascending: true });
    if (existing && existing.length) {
      return new Response(JSON.stringify({ tasks: existing, reused: true }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }

  const { data: email, error: loadErr } = await admin
    .from("inbound_emails")
    .select("id, subject, from_name, from_email, received_at, body_text, body_html")
    .eq("id", body.email_id)
    .maybeSingle();
  if (loadErr || !email) {
    console.error("extract-email-tasks: email load failed", { id: body.email_id, loadErr });
    return new Response(JSON.stringify({ error: "email not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  /*const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {*/
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const composed = composeEmailForExtraction({
    subject: (email as any).subject ?? null,
    from_name: (email as any).from_name ?? null,
    from_email: (email as any).from_email ?? null,
    sent_at: (email as any).received_at ?? null,
    body_text: (email as any).body_text ?? null,
    body_html: (email as any).body_html ?? null,
  });

  let parsed: any;
  try {
    // parsed = await extractEmailViaGateway(LOVABLE_API_KEY, composed);
    parsed = await extractEmailViaGateway(ANTHROPIC_API_KEY, composed);
  } catch (e) {
    if (e instanceof GatewayError) {
      return new Response(JSON.stringify({ error: e.message }), { status: e.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    console.error("extract error", e);
    return new Response(JSON.stringify({ error: "AI request failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const actionItems: any[] = Array.isArray(parsed?.action_items) ? parsed.action_items.slice(0, 5) : [];

  // Persist: replace any existing extracted tasks for this email
  await admin.from("email_extracted_tasks").delete().eq("email_id", body.email_id);

  let stored: any[] = [];
  if (actionItems.length) {
    const rows = actionItems.map((a, i) => {
      const pr = String(a?.priority ?? "Medium").toLowerCase();
      const priority = pr === "high" ? "high" : pr === "low" ? "low" : pr === "normal" ? "medium" : pr === "medium" ? "medium" : "medium";
      return {
        email_id: body.email_id!,
        position: i,
        title: String(a?.title ?? "").slice(0, 500) || "Untitled task",
        description: a?.context ?? "",
        priority,
        status: "pending",
      };
    });
    const { data: inserted, error: insErr } = await admin
      .from("email_extracted_tasks")
      .insert(rows)
      .select("id, title, description, priority, position, status, task_id");
    if (insErr) {
      console.error("persist error", insErr);
    } else {
      stored = inserted ?? [];
    }
    await admin.from("inbound_emails").update({ extraction_state: "extracted" }).eq("id", body.email_id);
  }

  return new Response(JSON.stringify({ tasks: stored }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
