import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You extract distinct, actionable tasks from emails for a healthcare advisory firm.
Rules:
- Identify ONLY distinct, actionable tasks. Each task must have a clear action required.
- Ignore background context, FYI content, greetings, sign-offs, and pleasantries.
- Prefer fewer, meaningful tasks over many small ones. Maximum 5 tasks.
- Each task needs a concise title, a fuller description, and a priority of "high", "medium", or "low".
- If there are no actionable tasks, return an empty array.`;

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

  // Service client for persistence (bypass RLS — we already verified user above)
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // If extraction has already been done and reuse=true, just return existing
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
    .select("id, subject, body_text, body_html")
    .eq("id", body.email_id)
    .maybeSingle();
  if (loadErr || !email) {
    return new Response(JSON.stringify({ error: "email not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const bodyContent = (email.body_text || email.body_html || "").slice(0, 16000);
  const userPrompt = `Subject: ${email.subject ?? "(no subject)"}\n\n${bodyContent}`;

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      tools: [{
        type: "function",
        function: {
          name: "return_tasks",
          description: "Return extracted tasks",
          parameters: {
            type: "object",
            properties: {
              tasks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    priority: { type: "string", enum: ["high", "medium", "low"] },
                  },
                  required: ["title", "description", "priority"],
                  additionalProperties: false,
                },
              },
            },
            required: ["tasks"],
            additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "return_tasks" } },
    }),
  });

  if (aiRes.status === 429) {
    return new Response(JSON.stringify({ error: "Rate limit reached. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (aiRes.status === 402) {
    return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (!aiRes.ok) {
    const t = await aiRes.text();
    console.error("ai error", aiRes.status, t);
    return new Response(JSON.stringify({ error: "AI request failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const aiJson = await aiRes.json();
  const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
  let aiTasks: Array<{ title: string; description: string; priority: string }> = [];
  if (toolCall?.function?.arguments) {
    try {
      const parsed = JSON.parse(toolCall.function.arguments);
      if (Array.isArray(parsed?.tasks)) aiTasks = parsed.tasks.slice(0, 5);
    } catch (e) {
      console.error("parse error", e);
    }
  }

  // Persist: replace any existing extracted tasks for this email
  await admin.from("email_extracted_tasks").delete().eq("email_id", body.email_id);

  let stored: any[] = [];
  if (aiTasks.length) {
    const rows = aiTasks.map((t, i) => ({
      email_id: body.email_id!,
      position: i,
      title: t.title,
      description: t.description,
      priority: (t.priority || "medium").toLowerCase(),
      status: "pending",
    }));
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
