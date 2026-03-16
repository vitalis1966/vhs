import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const assessmentType = formData.get("assessment_type") as string || "general";

    if (!file) throw new Error("No file provided");

    // Read file content as base64 for AI processing (chunked to avoid stack overflow)
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const chunkSize = 8192;
    let binary = "";
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      for (let j = 0; j < chunk.length; j++) {
        binary += String.fromCharCode(chunk[j]);
      }
    }
    const base64 = btoa(binary);

    const systemPrompt = `You are an expert at extracting structured questionnaire data from PDF documents.

Extract ALL sections and questions from this PDF questionnaire. For each question, determine the best field type.

Return a JSON object with this exact structure:
{
  "sections": [
    {
      "title": "Section Title",
      "description": "Optional section description or null",
      "questions": [
        {
          "question_text": "The full question text",
          "helper_text": "Any helper/guidance text or null",
          "field_type": "short_text|long_text|dropdown|single_select|multi_select|yes_no|number|date|file_upload",
          "options": ["Option 1", "Option 2"] or null,
          "is_required": true or false
        }
      ]
    }
  ]
}

Field type rules:
- yes_no: For yes/no questions
- single_select: When choosing ONE option from a list
- multi_select: When choosing MULTIPLE options
- dropdown: For selection from a longer list
- short_text: For brief text answers (name, title, etc.)
- long_text: For detailed/paragraph answers
- number: For numeric values
- date: For date entries
- file_upload: When asking for document/file attachments

Be thorough — extract EVERY question. Preserve the original section groupings from the PDF.
Return ONLY valid JSON, no markdown fences.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract all sections and questions from this ${assessmentType} questionnaire PDF. Return structured JSON.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:application/pdf;base64,${base64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI returned ${aiResponse.status}`);
    }

    const result = await aiResponse.json();
    const rawContent = result.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const cleaned = rawContent.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Parse error:", rawContent);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: rawContent }), {
        status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-questionnaire error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
