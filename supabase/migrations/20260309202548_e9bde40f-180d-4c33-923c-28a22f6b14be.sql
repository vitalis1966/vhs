
-- Email events table
CREATE TABLE public.email_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.assessment_sessions(id) ON DELETE SET NULL,
  intake_id uuid REFERENCES public.assessment_intakes(id) ON DELETE SET NULL,
  email_type text NOT NULL,
  recipient_email text NOT NULL,
  subject text,
  status text NOT NULL DEFAULT 'logged',
  provider_response jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sent_at timestamp with time zone
);

ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_email_events" ON public.email_events FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_email_events" ON public.email_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_email_events" ON public.email_events FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Assessment reminders table
CREATE TABLE public.assessment_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  reminder_type text NOT NULL DEFAULT 'incomplete_assessment',
  reminder_number integer NOT NULL DEFAULT 1,
  scheduled_at timestamp with time zone NOT NULL,
  sent_at timestamp with time zone,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.assessment_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_reminders" ON public.assessment_reminders FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_reminders" ON public.assessment_reminders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_reminders" ON public.assessment_reminders FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Add lifecycle tracking columns to assessment_intakes
ALTER TABLE public.assessment_intakes
  ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'intake_submitted',
  ADD COLUMN IF NOT EXISTS assessment_start_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS assessment_completion_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS last_activity_at timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS session_id uuid REFERENCES public.assessment_sessions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS internal_report_id uuid REFERENCES public.internal_assessment_reports(id) ON DELETE SET NULL;

-- Index for reminder processing
CREATE INDEX idx_reminders_pending ON public.assessment_reminders (status, scheduled_at) WHERE status = 'pending';
CREATE INDEX idx_email_events_session ON public.email_events (session_id);
CREATE INDEX idx_email_events_intake ON public.email_events (intake_id);
