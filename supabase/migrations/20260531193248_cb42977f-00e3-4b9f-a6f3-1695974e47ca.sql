ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS email_status text;