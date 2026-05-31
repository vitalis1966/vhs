// Extracts a structured meeting record from a transcript using Lovable AI.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Body {
  transcript?: string;
  // For PDFs: base64-encoded file data + mime, sent as inline_data to Gemini
  file_base64?: string;
  file_mime?: string;
  workspace_members?: Array<{ id: string; full_name: string | null; email: string | null }>;
  default_date?: string;
}

const SYSTEM = `You are an expert meeting analyst. Read the provided meeting transcript and extract a complete structured record. Be faithful to the transcript — do not invent facts. Use professional, neutral business language. Always call the return_meeting tool with the extracted data; never reply in plain text.`;

const TOOL = {
  type: "function",
  function: {
    name: "return_meeting",
    description: "Return the fully extracted meeting record.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Concise meeting title (max 80 chars)." },
        meeting_date: { type: "string", description: "ISO 8601 date/time if mentioned, else empty string." },
        attendees: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              role: { type: "string", description: "Role / title as described, or empty." },
            },
            required: ["name", "role"],
            additionalProperties: false,
          },
        },
        summary: { type: "string", description: "3-5 paragraph professional summary of what was discussed and decided. Use \\n\\n between paragraphs." },
        decisions: { type: "array", items: { type: "string" } },
        action_items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              owner: { type: "string", description: "Owner name from transcript, or empty." },
              due_date: { type: "string", description: "ISO date (YYYY-MM-DD) if mentioned, else empty." },
              priority: { type: "string", enum: ["Low", "Medium", "High", "Urgent"] },
            },
            required: ["description", "owner", "due_date", "priority"],
            additionalProperties: false,
          },
        },
        topics: { type: "array", items: { type: "string" }, description: "Main topics discussed (3-8 short tags)." },
        next_meeting_date: { type: "string", description: "ISO datetime of next meeting if scheduled, else empty." },
      },
      required: ["title", "meeting_date", "attendees", "summary", "decisions", "action_items", "topics", "next_meeting_date"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const body = (await req.json()) as Body;
    if (!body.transcript && !body.file_base64) {
      return new Response(JSON.stringify({ error: "transcript or file_base64 required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const memberHint = (body.workspace_members ?? [])
      .map((m) => `- ${m.full_name ?? "(no name)"} <${m.email ?? ""}>`)
      .join("\n");

    const userContent: any[] = [];
    const instructions = `Extract the meeting record.

Known workspace members (use these names when an attendee matches):
${memberHint || "(none)"}

${body.default_date ? `If no explicit date in transcript, use: ${body.default_date}` : ""}`;
    userContent.push({ type: "text", text: instructions });

    if (body.transcript) {
      userContent.push({ type: "text", text: `Transcript:\n\n${body.transcript}` });
    }
    if (body.file_base64 && body.file_mime) {
      // Gemini accepts inline file data via OpenAI-compat image_url with data URL
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${body.file_mime};base64,${body.file_base64}` },
      });
    }

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userContent },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "return_meeting" } },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Workspace settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI extraction failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await aiResp.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      console.error("No tool call returned", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "No structured output returned" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let extracted: any;
    try { extracted = JSON.parse(call.function.arguments); }
    catch { return new Response(JSON.stringify({ error: "Malformed AI response" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }

    return new Response(JSON.stringify({ extracted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("extract-meeting-transcript error", e);
    return new Response(JSON.stringify({ error: e?.message ?? "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
