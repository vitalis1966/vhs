import { supabase } from "@/integrations/supabase/client";

export interface NotifyPayload {
  user_id: string;
  type: "task_assigned" | "task_overdue" | "due_soon" | "status_changed" | "mention" | string;
  title: string;
  body?: string | null;
  link_url?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  actor_id?: string | null;
  workspace_id: string;
  email_subject?: string | null;
}

/** Dispatch a notification through the send-notification edge function. */
export async function sendNotification(payload: NotifyPayload): Promise<void> {
  try {
    await supabase.functions.invoke("send-notification", { body: payload });
  } catch (e) {
    console.error("sendNotification failed", e);
  }
}
