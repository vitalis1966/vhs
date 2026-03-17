import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Email templates
const templates: Record<string, (data: any) => { subject: string; html: string }> = {
  intake_confirmation: (data) => ({
    subject: "Your Strategic Assessment Request Has Been Received",
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #1a3a2a; font-size: 24px; margin: 0;">Vitalis Health Strategies</h2>
          <div style="width: 60px; height: 2px; background: #c8a951; margin: 12px auto;"></div>
        </div>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${data.client_name},</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Thank you for requesting a Strategic Assessment with Vitalis Health Strategies.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          We are preparing the most relevant assessment for your situation. You will receive secure access shortly to begin the assessment process.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          If you have any questions in the meantime, please feel free to reach out.
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 40px;">
          Warm regards,<br/>
          <strong>Vitalis Health Strategies</strong>
        </p>
      </div>
    `,
  }),

  assessment_access: (data) => ({
    subject: "Your Strategic Assessment Is Ready",
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #1a3a2a; font-size: 24px; margin: 0;">Vitalis Health Strategies</h2>
          <div style="width: 60px; height: 2px; background: #c8a951; margin: 12px auto;"></div>
        </div>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${data.client_name},</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Your Strategic Assessment is ready to begin.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          You may start the assessment using the secure link below. Your progress will be saved automatically, and you may return at any time to continue.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.assessment_url}" style="display: inline-block; background: #1a3a2a; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            Start Assessment
          </a>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          This is a secure, private link. Please do not share it with others.
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 40px;">
          Warm regards,<br/>
          <strong>Vitalis Health Strategies</strong>
        </p>
      </div>
    `,
  }),

  incomplete_reminder: (data) => ({
    subject: "Continue Your Strategic Assessment",
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #1a3a2a; font-size: 24px; margin: 0;">Vitalis Health Strategies</h2>
          <div style="width: 60px; height: 2px; background: #c8a951; margin: 12px auto;"></div>
        </div>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${data.client_name},</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          We noticed that your Strategic Assessment is still in progress.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          You can continue where you left off using the secure link below. All of your previous responses have been saved.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.assessment_url}" style="display: inline-block; background: #1a3a2a; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            Resume Assessment
          </a>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 40px;">
          Warm regards,<br/>
          <strong>Vitalis Health Strategies</strong>
        </p>
      </div>
    `,
  }),

  completion_confirmation: (data) => ({
    subject: "Your Strategic Assessment Has Been Submitted",
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #1a3a2a; font-size: 24px; margin: 0;">Vitalis Health Strategies</h2>
          <div style="width: 60px; height: 2px; background: #c8a951; margin: 12px auto;"></div>
        </div>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${data.client_name},</p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Thank you for completing your Strategic Assessment.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Our team will review your submission and prepare the next step in the process. You may be contacted for follow-up discussion or additional clarification if needed.
        </p>
        ${data.report_url ? `
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.report_url}" style="display: inline-block; background: #1a3a2a; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            View Response Summary
          </a>
        </div>
        ` : ""}
        <p style="color: #666; font-size: 14px; margin-top: 40px;">
          Warm regards,<br/>
          <strong>Vitalis Health Strategies</strong>
        </p>
      </div>
    `,
  }),

  client_report: (data) => ({
    subject: data.subject_line || `Your Strategic Assessment Report — ${data.organization || data.client_name}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #1a3a2a; font-size: 24px; margin: 0;">Vitalis Health Strategies</h2>
          <div style="width: 60px; height: 2px; background: #c8a951; margin: 12px auto;"></div>
        </div>
        <div style="color: #333; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${data.message_body || `Dear ${data.client_name},\n\nPlease find your strategic assessment report ready for review.`}</div>
        ${data.report_url ? `
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.report_url}" style="display: inline-block; background: #1a3a2a; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            View Your Report
          </a>
        </div>
        ` : ""}
        <p style="color: #666; font-size: 12px; margin-top: 40px; text-align: center;">
          This report is confidential and prepared exclusively for ${data.organization || data.client_name}.
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          Warm regards,<br/>
          <strong>Vitalis Health Strategies</strong>
        </p>
      </div>
    `,
  }),

  admin_notification: (data) => ({
    subject: `New Strategic Assessment Submitted — ${data.client_name}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #1a3a2a; font-size: 24px; margin: 0;">Vitalis Health Strategies</h2>
          <div style="width: 60px; height: 2px; background: #c8a951; margin: 12px auto;"></div>
          <p style="color: #c8a951; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Internal Notification</p>
        </div>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          A Strategic Assessment has been submitted and is ready for review.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Client</td><td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${data.client_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Organization</td><td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${data.organization || "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Assessment Type</td><td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${data.assessment_type}</td></tr>
          <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Submitted</td><td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 600;">${data.submitted_at}</td></tr>
        </table>
        ${data.admin_url ? `
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.admin_url}" style="display: inline-block; background: #1a3a2a; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            View Submission
          </a>
        </div>
        ` : ""}
      </div>
    `,
  }),
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { email_type, recipient_email, template_data, session_id, intake_id } = await req.json();

    if (!email_type || !recipient_email) {
      throw new Error("email_type and recipient_email are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate email content
    const templateFn = templates[email_type];
    if (!templateFn) throw new Error(`Unknown email_type: ${email_type}`);

    const { subject, html } = templateFn(template_data || {});

    // Check for duplicate sends (same type + session within last hour)
    if (session_id) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: existing } = await supabase
        .from("email_events")
        .select("id")
        .eq("session_id", session_id)
        .eq("email_type", email_type)
        .eq("status", "sent")
        .gte("sent_at", oneHourAgo)
        .limit(1);

      if (existing && existing.length > 0) {
        return new Response(JSON.stringify({ success: true, skipped: true, reason: "duplicate_prevention" }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Log the email event
    const eventPayload: any = {
      email_type,
      recipient_email,
      subject,
      status: "logged",
      session_id: session_id || null,
      intake_id: intake_id || null,
    };

    // Attempt to send via configured provider
    const notificationEmail = Deno.env.get("NOTIFICATION_EMAIL");
    let sent = false;

    // For now, log all emails. When an email provider is configured,
    // actual sending will happen here. The system is provider-ready.
    // TODO: Integrate with SendGrid/Postmark/SES when configured
    console.log(`[EMAIL] type=${email_type} to=${recipient_email} subject="${subject}"`);
    console.log(`[EMAIL] HTML length: ${html.length}`);

    eventPayload.status = "logged";
    eventPayload.sent_at = new Date().toISOString();

    const { data: event } = await supabase
      .from("email_events")
      .insert(eventPayload)
      .select()
      .single();

    // Update lifecycle status if applicable
    if (intake_id && email_type === "intake_confirmation") {
      await supabase
        .from("assessment_intakes")
        .update({ lifecycle_status: "intake_submitted", last_activity_at: new Date().toISOString() })
        .eq("id", intake_id);
    }

    if (intake_id && email_type === "assessment_access") {
      await supabase
        .from("assessment_intakes")
        .update({ lifecycle_status: "assessment_assigned", last_activity_at: new Date().toISOString() })
        .eq("id", intake_id);
    }

    if (intake_id && email_type === "completion_confirmation") {
      await supabase
        .from("assessment_intakes")
        .update({
          lifecycle_status: "assessment_completed",
          assessment_completion_date: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        })
        .eq("id", intake_id);
    }

    return new Response(JSON.stringify({ success: true, event_id: event?.id, sent }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-assessment-email error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
