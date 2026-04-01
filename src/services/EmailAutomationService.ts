import { supabase } from "@/integrations/supabase/client";

const BASE_URL = window.location.origin;

export interface EmailPayload {
  email_type: string;
  recipient_email: string;
  template_data: Record<string, any>;
  session_id?: string;
  intake_id?: string;
}

export const EmailAutomationService = {
  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; event_id?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke("send-assessment-email", {
        body: payload,
      });
      if (error) {
        console.error("Email send error:", error);
        return { success: false };
      }
      return { success: true, event_id: data?.event_id };
    } catch (err) {
      console.error("Email service error:", err);
      return { success: false };
    }
  },

  async sendIntakeConfirmation(intakeId: string, clientName: string, email: string) {
    return this.sendEmail({
      email_type: "intake_confirmation",
      recipient_email: email,
      intake_id: intakeId,
      template_data: { client_name: clientName },
    });
  },

  async sendAssessmentAccess(
    intakeId: string,
    sessionId: string,
    clientName: string,
    email: string,
    accessToken: string
  ) {
    return this.sendEmail({
      email_type: "assessment_access",
      recipient_email: email,
      session_id: sessionId,
      intake_id: intakeId,
      template_data: {
        client_name: clientName,
        assessment_url: `${BASE_URL}/assessment/${accessToken}`,
      },
    });
  },

  async sendCompletionConfirmation(
    sessionId: string,
    intakeId: string | null,
    clientName: string,
    email: string,
    _accessToken: string
  ) {
    return this.sendEmail({
      email_type: "completion_confirmation",
      recipient_email: email,
      session_id: sessionId,
      intake_id: intakeId || undefined,
      template_data: {
        client_name: clientName,
      },
    });
  },

  async sendAdminNotification(
    sessionId: string,
    clientName: string,
    organization: string,
    assessmentType: string,
    submittedAt: string,
    adminEmail: string
  ) {
    return this.sendEmail({
      email_type: "admin_notification",
      recipient_email: adminEmail,
      session_id: sessionId,
      template_data: {
        client_name: clientName,
        organization,
        assessment_type: assessmentType,
        submitted_at: new Date(submittedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        admin_url: `${BASE_URL}/admin/submissions/${sessionId}`,
      },
    });
  },

  async scheduleReminders(accessToken: string) {
    const now = Date.now();
    const reminders = [
      { number: 1, delay: 24 * 60 * 60 * 1000 },       // 24 hours
      { number: 2, delay: 4 * 24 * 60 * 60 * 1000 },    // 4 days
      { number: 3, delay: 8 * 24 * 60 * 60 * 1000 },    // 8 days
    ];

    for (const r of reminders) {
      await supabase.rpc("schedule_reminder_by_token" as any, {
        p_token: accessToken,
        p_reminder_number: r.number,
        p_scheduled_at: new Date(now + r.delay).toISOString(),
      });
    }
  },

  async cancelPendingReminders(accessToken: string) {
    await supabase.rpc("cancel_reminders_by_token" as any, { p_token: accessToken });
  },

  async getEmailHistory(sessionId?: string, intakeId?: string): Promise<any[]> {
    let query = supabase.from("email_events" as any).select("*").order("created_at", { ascending: false });
    if (sessionId) query = query.eq("session_id", sessionId) as any;
    if (intakeId) query = query.eq("intake_id", intakeId) as any;
    const { data } = await (query as any);
    return data || [];
  },
};
