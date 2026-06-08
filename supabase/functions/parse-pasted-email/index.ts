// Manual email paste parser - calls Lovable AI Gateway to extract structured data
// then matches against existing clients/contacts. Does NOT persist anything.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function tryParseJSON<T = any>(s: string | null | undefined): T | null {
  if (!s) return null;
  let t = s.trim();
  if (t.startsWith("```")) t = t.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try { return JSON.parse(t) as T; } catch { return null; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const raw_email: string = body?.raw_email ?? "";
    const workspace_id: string | null = body?.workspace_id ?? null;
    const client_id_hint: string | null = body?.client_id ?? null;
    if (!raw_email || raw_email.length < 10) return json({ error: "raw_email is required" }, 400);
    if (!workspace_id) return json({ error: "workspace_id is required" }, 400);
    if (raw_email.length > 200000) return json({ error: "Email too large" }, 400);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY not configured" }, 500);

    const systemPrompt = `You parse pasted business emails for Vitalis OS, a healthcare advisory CRM.
Extract headers and structured details. Be conservative: never invent dates, names, amounts, or commitments.
If a field is not present, omit it or return an empty array.
Categories: "Action required", "FYI / document", "Meeting request", "Invoice / finance", "New enquiry", "Legal / contract", "Urgent".
Priorities: "High", "Medium", "Normal". Use ISO 8601 for dates when possible.

For action_items, populate every field you can from the email — do not be sparse:
- title: short imperative action.
- priority + due_date if present.
- requester: who is asking (name + role/company if visible).
- what: 1-2 sentences plainly describing the action.
- why: 1-2 sentences with the business reason / context from the email.
- acceptance_criteria: 1-4 concrete "done when" bullets.
- key_details: supporting facts from the email — figures, names, dates, documents, links.
- relevant_quote: ONE short verbatim quote (<=240 chars) from the email body, or empty.
- suggested_next_step: one sentence on how to start.
Never invent facts.`;

    const tool = {
      type: "function",
      function: {
        name: "extract_email",
        description: "Extract structured fields from a pasted business email.",
        parameters: {
          type: "object",
          properties: {
            from_name: { type: "string" },
            from_email: { type: "string" },
            to: { type: "array", items: { type: "string" } },
            cc: { type: "array", items: { type: "string" } },
            subject: { type: "string" },
            sent_at: { type: "string", description: "ISO 8601 datetime if extractable" },
            summary: { type: "string", description: "2-3 sentence summary" },
            category: { type: "string", enum: ["Action required", "FYI / document", "Meeting request", "Invoice / finance", "New enquiry", "Legal / contract", "Urgent"] },
            action_items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  due_date: { type: "string", description: "ISO date if mentioned" },
                  priority: { type: "string", enum: ["High", "Medium", "Normal"] },
                  requester: { type: "string" },
                  what: { type: "string" },
                  why: { type: "string" },
                  acceptance_criteria: { type: "array", items: { type: "string" } },
                  key_details: { type: "array", items: { type: "string" } },
                  relevant_quote: { type: "string" },
                  suggested_next_step: { type: "string" },
                },
                required: ["title"],
              },
            },
            meeting: {
              type: "object",
              properties: {
                title: { type: "string" },
                starts_at: { type: "string" },
                location: { type: "string" },
                attendees: { type: "array", items: { type: "string" } },
                agenda: { type: "string" },
              },
            },
            mentioned_people: {
              type: "array",
              items: {
                type: "object",
                properties: { name: { type: "string" }, role: { type: "string" } },
                required: ["name"],
              },
            },
            financials: {
              type: "array",
              items: {
                type: "object",
                properties: { amount: { type: "string" }, currency: { type: "string" }, reference: { type: "string" } },
              },
            },
            sender_signature: {
              type: "object",
              properties: { title: { type: "string" }, phone: { type: "string" }, company: { type: "string" } },
            },
          },
          required: ["summary", "category"],
        },
      },
    };

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Parse this email:\n\n${raw_email}` },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "extract_email" } },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      if (aiRes.status === 429) return json({ error: "AI rate limit exceeded, please retry shortly." }, 429);
      if (aiRes.status === 402) return json({ error: "AI credits exhausted. Add credits in workspace settings." }, 402);
      console.error("AI gateway error", aiRes.status, txt);
      return json({ error: "AI parsing failed" }, 500);
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    const parsed = tryParseJSON<any>(toolCall?.function?.arguments) ?? {};

    // Synthesize a rich `context` string for each action item so downstream
    // task creation gets a fully-populated description by default.
    function buildContext(a: any): string {
      const lines: string[] = [];
      if (a?.what) lines.push(`**What to do**\n${String(a.what).trim()}`);
      if (a?.why) lines.push(`**Why it matters**\n${String(a.why).trim()}`);
      const meta: string[] = [];
      if (a?.requester) meta.push(`- Requested by: ${String(a.requester).trim()}`);
      if (a?.due_date) meta.push(`- Due: ${String(a.due_date).trim()}`);
      if (meta.length) lines.push(`**Context**\n${meta.join("\n")}`);
      if (Array.isArray(a?.acceptance_criteria) && a.acceptance_criteria.length) {
        lines.push(`**Done when**\n${a.acceptance_criteria.map((c: string) => `- ${String(c).trim()}`).join("\n")}`);
      }
      if (Array.isArray(a?.key_details) && a.key_details.length) {
        lines.push(`**Key details from email**\n${a.key_details.map((c: string) => `- ${String(c).trim()}`).join("\n")}`);
      }
      if (a?.suggested_next_step) lines.push(`**Suggested next step**\n${String(a.suggested_next_step).trim()}`);
      if (a?.relevant_quote) lines.push(`**From the email**\n> ${String(a.relevant_quote).trim().replace(/\n+/g, " ")}`);
      return lines.join("\n\n");
    }
    if (Array.isArray(parsed?.action_items)) {
      parsed.action_items = parsed.action_items.map((a: any) => ({
        ...a,
        context: buildContext(a) || a?.context || "",
      }));
    }

    // Service-role client for matching across workspace data (RLS bypass for read)
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Match contact by email
    let matchedContact: any = null;
    let matchedClient: any = null;
    if (client_id_hint) {
      const { data: c } = await admin.from("clients").select("id, name, workspace_id").eq("id", client_id_hint).eq("workspace_id", workspace_id).maybeSingle();
      matchedClient = c;
    } else if (parsed.from_email) {
      const { data: contacts } = await admin
        .from("contacts")
        .select("id, name, email, client_id, clients!inner(id, name, workspace_id)")
        .ilike("email", parsed.from_email)
        .limit(5);
      const hit = (contacts ?? []).find((c: any) => c.clients?.workspace_id === workspace_id);
      if (hit) {
        matchedContact = { id: hit.id, name: hit.name, email: hit.email };
        matchedClient = { id: hit.client_id, name: hit.clients.name };
      } else if (parsed.from_email.includes("@")) {
        const domain = parsed.from_email.split("@")[1].toLowerCase();
        const { data: clients } = await admin
          .from("clients")
          .select("id, name, website")
          .eq("workspace_id", workspace_id);
        const domainMatch = (clients ?? []).find((c: any) => c.website && c.website.toLowerCase().includes(domain));
        if (domainMatch) matchedClient = { id: domainMatch.id, name: domainMatch.name };
      }
    }

    return json({
      parsed,
      matched_contact: matchedContact,
      matched_client: matchedClient,
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
