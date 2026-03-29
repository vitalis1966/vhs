
-- Add meeting tracking columns to assessment_sessions
ALTER TABLE public.assessment_sessions
  ADD COLUMN IF NOT EXISTS meeting_booked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS meeting_booked_by text;

-- DELETE RLS policies for tables that currently lack them
CREATE POLICY "authenticated_delete_sessions"
  ON public.assessment_sessions FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "authenticated_delete_responses"
  ON public.assessment_responses FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "authenticated_delete_email_events"
  ON public.email_events FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "authenticated_delete_intakes"
  ON public.assessment_intakes FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "authenticated_delete_reminders"
  ON public.assessment_reminders FOR DELETE TO authenticated
  USING (true);

-- Allow anon to update assessment_sessions (for client booking widget)
-- Already exists per RLS listing, so skip.
