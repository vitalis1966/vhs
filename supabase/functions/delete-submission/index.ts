import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify the JWT is valid
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } =
      await supabaseAdmin.auth.getUser(token);
    if (authError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(
        JSON.stringify({ error: "session_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify session exists
    const { data: session } = await supabaseAdmin
      .from("assessment_sessions")
      .select("id")
      .eq("id", session_id)
      .single();

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Session not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Use the direct DB connection for a true transaction
    const dbUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!dbUrl) {
      // Fallback: sequential deletes via service role client (not truly transactional)
      const deletes = [
        supabaseAdmin.from("client_report_edits").delete().eq("session_id", session_id),
        supabaseAdmin.from("email_events").delete().eq("session_id", session_id),
        supabaseAdmin.from("internal_assessment_reports").delete().eq("session_id", session_id),
        supabaseAdmin.from("assessment_responses").delete().eq("session_id", session_id),
        supabaseAdmin.from("assessment_reminders").delete().eq("session_id", session_id),
      ];

      for (const del of deletes) {
        const { error } = await del;
        if (error) {
          return new Response(
            JSON.stringify({ error: `Delete failed: ${error.message}` }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      // Get intake_id before deleting session
      const { data: sess } = await supabaseAdmin
        .from("assessment_sessions")
        .select("intake_id")
        .eq("id", session_id)
        .single();

      const { error: sessErr } = await supabaseAdmin
        .from("assessment_sessions")
        .delete()
        .eq("id", session_id);

      if (sessErr) {
        return new Response(
          JSON.stringify({ error: `Session delete failed: ${sessErr.message}` }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Clean up intake if it was linked
      if (sess?.intake_id) {
        await supabaseAdmin
          .from("assessment_intakes")
          .delete()
          .eq("id", sess.intake_id);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use postgres module for true transaction
    const { default: postgres } = await import(
      "https://deno.land/x/postgresjs@v3.4.5/mod.js"
    );
    const sql = postgres(dbUrl, { max: 1 });

    try {
      await sql.begin(async (tx: any) => {
        await tx`DELETE FROM public.client_report_edits WHERE session_id = ${session_id}`;
        await tx`DELETE FROM public.email_events WHERE session_id = ${session_id}`;
        await tx`DELETE FROM public.internal_assessment_reports WHERE session_id = ${session_id}`;
        await tx`DELETE FROM public.assessment_responses WHERE session_id = ${session_id}`;
        await tx`DELETE FROM public.assessment_reminders WHERE session_id = ${session_id}`;

        // Get intake_id before deleting session
        const intakeRows = await tx`SELECT intake_id FROM public.assessment_sessions WHERE id = ${session_id}`;
        const intakeId = intakeRows[0]?.intake_id;

        await tx`DELETE FROM public.assessment_sessions WHERE id = ${session_id}`;

        if (intakeId) {
          await tx`DELETE FROM public.assessment_intakes WHERE id = ${intakeId}`;
        }
      });

      await sql.end();

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (txErr: any) {
      await sql.end();
      return new Response(
        JSON.stringify({ error: `Transaction failed: ${txErr.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
