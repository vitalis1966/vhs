
ALTER TABLE public.meetings
  ADD COLUMN IF NOT EXISTS topics TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS next_meeting_date TIMESTAMPTZ;

ALTER TABLE public.meeting_action_items
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'Medium';
