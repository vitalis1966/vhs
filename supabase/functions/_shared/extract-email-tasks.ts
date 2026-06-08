// Shared email extraction logic used by:
//   - supabase/functions/parse-pasted-email (Paste Email flow)
//   - supabase/functions/extract-email-tasks (Forwarded Inbox flow)
// Keep prompt, tool schema, model, and post-processing identical across both paths.

export const EXTRACTION_MODEL = "google/gemini-3-flash-preview";

export const EXTRACTION_SYSTEM_PROMPT = `You parse pasted business emails for Vitalis OS, a healthcare advisory CRM.
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

export const EXTRACTION_TOOL = {
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

export function tryParseJSON<T = any>(s: string | null | undefined): T | null {
  if (!s) return null;
  let t = s.trim();
  if (t.startsWith("```")) t = t.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try { return JSON.parse(t) as T; } catch { return null; }
}

export function buildActionContext(a: any): string {
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

export function stripHtmlToText(html: string): string {
  if (!html) return "";
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<\s*br\s*\/?\s*>/gi, "\n");
  s = s.replace(/<\s*\/\s*p\s*>/gi, "\n\n");
  s = s.replace(/<\s*\/\s*div\s*>/gi, "\n");
  s = s.replace(/<\s*li[^>]*>/gi, "- ");
  s = s.replace(/<\s*\/\s*li\s*>/gi, "\n");
  s = s.replace(/<[^>]+>/g, "");
  s = s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'");
  s = s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ");
  return s.trim();
}

const MAX_INPUT_CHARS = 200_000;

export function composeEmailForExtraction(input: {
  subject?: string | null;
  from_name?: string | null;
  from_email?: string | null;
  to?: string[] | null;
  cc?: string[] | null;
  sent_at?: string | null;
  body_text?: string | null;
  body_html?: string | null;
}): string {
  const headerLines: string[] = [];
  const fromBits = [input.from_name, input.from_email ? `<${input.from_email}>` : ""].filter(Boolean).join(" ").trim();
  if (fromBits) headerLines.push(`From: ${fromBits}`);
  if (input.to?.length) headerLines.push(`To: ${input.to.join(", ")}`);
  if (input.cc?.length) headerLines.push(`Cc: ${input.cc.join(", ")}`);
  if (input.sent_at) headerLines.push(`Date: ${input.sent_at}`);
  if (input.subject) headerLines.push(`Subject: ${input.subject}`);

  const body = (input.body_text && input.body_text.trim())
    ? input.body_text
    : stripHtmlToText(input.body_html ?? "");

  const composed = `${headerLines.join("\n")}\n\n${body}`.trim();
  return composed.length > MAX_INPUT_CHARS ? composed.slice(0, MAX_INPUT_CHARS) : composed;
}

export class GatewayError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function extractEmailViaGateway(apiKey: string, composedEmail: string): Promise<any> {
  const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: EXTRACTION_MODEL,
      messages: [
        { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
        { role: "user", content: `Parse this email:\n\n${composedEmail}` },
      ],
      tools: [EXTRACTION_TOOL],
      tool_choice: { type: "function", function: { name: "extract_email" } },
    }),
  });

  if (!aiRes.ok) {
    const txt = await aiRes.text().catch(() => "");
    if (aiRes.status === 429) throw new GatewayError(429, "AI rate limit exceeded, please retry shortly.");
    if (aiRes.status === 402) throw new GatewayError(402, "AI credits exhausted. Add credits in workspace settings.");
    console.error("AI gateway error", aiRes.status, txt);
    throw new GatewayError(500, "AI parsing failed");
  }

  const aiJson = await aiRes.json();
  const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
  const parsed = tryParseJSON<any>(toolCall?.function?.arguments) ?? {};

  if (Array.isArray(parsed?.action_items)) {
    parsed.action_items = parsed.action_items.map((a: any) => ({
      ...a,
      context: buildActionContext(a) || a?.context || "",
    }));
  }

  return parsed;
}
