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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();

    // Find pending reminders that are due
    const { data: dueReminders, error: remErr } = await supabase
      .from("assessment_reminders")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_at", now.toISOString())
      .order("scheduled_at")
      .limit(50);

    if (remErr) throw remErr;
    if (!dueReminders || dueReminders.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let processed = 0;
    let skipped = 0;

    for (const reminder of dueReminders) {
      // Check if session is still in_progress (not submitted)
      const { data: session } = await supabase
        .from("assessment_sessions")
        .select("id, status, access_token, intake_id, assessment_id")
        .eq("id", reminder.session_id)
        .single();

      if (!session || session.status === "submitted") {
        // Cancel this reminder — assessment already completed
        await supabase
          .from("assessment_reminders")
          .update({ status: "cancelled" })
          .eq("id", reminder.id);
        skipped++;
        continue;
      }

      // Get client info
      let clientName = "there";
      let clientEmail = "";
      if (session.intake_id) {
        const { data: intake } = await supabase
          .from("assessment_intakes")
          .select("full_name, email")
          .eq("id", session.intake_id)
          .single();
        if (intake) {
          clientName = intake.full_name || "there";
          clientEmail = intake.email;
        }
      }

      if (!clientEmail) {
        await supabase
          .from("assessment_reminders")
          .update({ status: "skipped" })
          .eq("id", reminder.id);
        skipped++;
        continue;
      }

      // Get the base URL for assessment link
      const baseUrl = Deno.env.get("SITE_URL") || `${supabaseUrl.replace('.supabase.co', '')}.lovable.app`;
      const assessmentUrl = `${baseUrl}/assessment/${session.access_token}`;

      // Send reminder email via the send-assessment-email function
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-assessment-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_type: "incomplete_reminder",
          recipient_email: clientEmail,
          session_id: session.id,
          intake_id: session.intake_id,
          template_data: {
            client_name: clientName,
            assessment_url: assessmentUrl,
            reminder_number: reminder.reminder_number,
          },
        }),
      });

      // Mark reminder as sent
      await supabase
        .from("assessment_reminders")
        .update({ status: "sent", sent_at: now.toISOString() })
        .eq("id", reminder.id);

      processed++;
    }

    return new Response(JSON.stringify({ processed, skipped, total: dueReminders.length }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("process-reminders error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
