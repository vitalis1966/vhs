
ALTER TABLE public.task_follow_ups
  ADD COLUMN IF NOT EXISTS resource_kind text NOT NULL DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS resource_contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS resource_external_name text,
  ADD COLUMN IF NOT EXISTS resource_external_email text;

ALTER TABLE public.task_follow_ups
  DROP CONSTRAINT IF EXISTS task_follow_ups_resource_kind_check;
ALTER TABLE public.task_follow_ups
  ADD CONSTRAINT task_follow_ups_resource_kind_check
  CHECK (resource_kind IN ('member','contact','external'));
