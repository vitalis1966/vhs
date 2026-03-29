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
    const { session_id } = await req.json();
    if (!session_id) throw new Error("session_id is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load session
    const { data: session, error: sessErr } = await supabase
      .from("assessment_sessions")
      .select("*")
      .eq("id", session_id)
      .single();
    if (sessErr || !session) throw new Error("Session not found");

    // Load assessment
    const { data: assessment } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", session.assessment_id)
      .single();

    // Load intake
    let intake = null;
    if (session.intake_id) {
      const { data } = await supabase
        .from("assessment_intakes")
        .select("*")
        .eq("id", session.intake_id)
        .single();
      intake = data;
    }

    // Load sections with questions
    const { data: sections } = await supabase
      .from("assessment_sections")
      .select("*")
      .eq("assessment_id", session.assessment_id)
      .order("sort_order");

    const sectionsWithQuestions = [];
    for (const sec of sections || []) {
      const { data: questions } = await supabase
        .from("assessment_questions")
        .select("*")
        .eq("section_id", sec.id)
        .order("sort_order");
      sectionsWithQuestions.push({ ...sec, questions: questions || [] });
    }

    // Load responses
    const { data: responses } = await supabase
      .from("assessment_responses")
      .select("*")
      .eq("session_id", session_id);

    const responseMap: Record<string, any> = {};
    for (const r of responses || []) {
      responseMap[r.question_id] = r.response_value || (r.response_json ? JSON.stringify(r.response_json) : "");
    }

    // Build the analysis prompt
    const assessmentType = assessment?.slug === "new-clinic-build"
      ? "New Clinic / Build Assessment"
      : "Existing Clinic Assessment";

    let responsesText = "";
    for (const sec of sectionsWithQuestions) {
      responsesText += `\n\n## Section: ${sec.title}\n`;
      if (sec.description) responsesText += `${sec.description}\n`;
      for (const q of sec.questions) {
        const answer = responseMap[q.id] || "(No response)";
        responsesText += `\n**Q: ${q.question_text}**\nA: ${answer}\n`;
      }
    }

    const clientInfo = intake
      ? `Client: ${intake.full_name || "Unknown"}\nOrganization: ${intake.organization_name || "N/A"}\nSpecialty: ${intake.specialty || "N/A"}\nPractice Type: ${intake.practice_type || "N/A"}\nLocation: ${[intake.city, intake.province_state, intake.country].filter(Boolean).join(", ") || "N/A"}`
      : "Client information not available.";

    const systemPrompt = `You are a senior healthcare strategy consultant at Vitalis Health Strategies. You are analyzing a submitted ${assessmentType} to prepare an internal strategic advisory report.

This report is STRICTLY INTERNAL — it will never be shown to the client. Be candid, analytical, and thorough.

Your analysis must be structured as a JSON object with these exact keys:

{
  "executive_summary": "A concise 2-3 paragraph overview of the overall situation, key themes, readiness indicators, and critical signals.",
  "overall_readiness_score": <number 1-100>,
  "readiness_category": "strong|stable|needs_attention|critical",
  "section_analyses": [
    {
      "section_title": "...",
      "section_id": "...",
      "summary": "Brief summary of responses in this section",
      "score": <number 1-100>,
      "severity": "strong|stable|needs_attention|critical",
      "operational_gaps": ["..."],
      "strategic_gaps": ["..."],
      "notable_signals": ["..."],
      "improvement_opportunities": ["..."]
    }
  ],
  "concerns": [
    { "type": "operational|strategic|compliance|infrastructure|staffing", "description": "...", "severity": "high|medium|low" }
  ],
  "focus_areas": [
    { "area": "...", "priority": "immediate|short_term|long_term", "rationale": "..." }
  ],
  "missing_information": [
    { "description": "...", "impact": "..." }
  ],
  "contradictions": [
    { "description": "...", "details": "..." }
  ],
  "opportunities": [
    { "description": "...", "potential_impact": "high|medium|low", "category": "growth|optimization|expansion|workflow|patient_experience" }
  ],
  "follow_up_questions": [
    { "question": "...", "context": "..." }
  ],
  "recommended_next_steps": [
    { "recommendation": "...", "category": "advisory|diagnostic|operational|facility|staffing|growth" }
  ]
}

Be specific and reference the client's actual responses. Do not be generic.`;

    const userPrompt = `Analyze this submitted assessment for internal strategic review.

CLIENT INFORMATION:
${clientInfo}

ASSESSMENT TYPE: ${assessmentType}
SUBMITTED: ${session.submitted_at || "Unknown"}

RESPONSES:
${responsesText}

Provide your analysis as the JSON object described. Return ONLY valid JSON, no markdown code blocks.`;

    // Call AI
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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway returned ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content || "";

    // Parse JSON from AI response — robust multi-strategy approach
    let analysisData;
    try {
      // Strategy 1: Strip markdown code block fences
      let cleaned = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      analysisData = JSON.parse(cleaned);
    } catch {
      try {
        // Strategy 2: Extract first { to last }
        const first = rawContent.indexOf("{");
        const last = rawContent.lastIndexOf("}");
        if (first !== -1 && last > first) {
          analysisData = JSON.parse(rawContent.substring(first, last + 1));
          console.log("Parsed AI response using brace extraction strategy");
        } else {
          throw new Error("No JSON object found in response");
        }
      } catch (e2) {
        console.error("Failed to parse AI response with all strategies:", e2);
        console.error("Raw content (first 500 chars):", rawContent.substring(0, 500));
        analysisData = { executive_summary: "Analysis could not be parsed. Please rerun the analysis.", parse_error: true };
      }
    }

    // Check for existing report
    const { data: existingReport } = await supabase
      .from("internal_assessment_reports")
      .select("id, analysis_version")
      .eq("session_id", session_id)
      .single();

    const reportPayload = {
      session_id,
      assessment_id: session.assessment_id,
      executive_summary: analysisData.executive_summary || null,
      overall_score: analysisData.overall_readiness_score || null,
      readiness_category: analysisData.readiness_category || null,
      analysis_status: "complete",
      analysis_data: analysisData,
      last_analysis_run: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingReport) {
      await supabase
        .from("internal_assessment_reports")
        .update({ ...reportPayload, analysis_version: (existingReport.analysis_version || 1) + 1 })
        .eq("id", existingReport.id);
    } else {
      await supabase
        .from("internal_assessment_reports")
        .insert(reportPayload);
    }

    return new Response(JSON.stringify({ success: true, analysis: analysisData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-assessment error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
