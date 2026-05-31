ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS notification_channels jsonb NOT NULL DEFAULT '{"email": true, "in_app": true}'::jsonb;