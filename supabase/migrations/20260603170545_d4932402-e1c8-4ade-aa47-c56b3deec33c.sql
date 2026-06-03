
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS meeting_id uuid REFERENCES public.meetings(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_meeting_id ON public.tasks(meeting_id);

ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS summary_sent_at timestamptz;
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS summary_sent_by uuid REFERENCES public.profiles(id);
