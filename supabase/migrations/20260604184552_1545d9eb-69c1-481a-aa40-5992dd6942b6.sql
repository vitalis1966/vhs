
ALTER TABLE public.inbound_emails
  ADD COLUMN IF NOT EXISTS extraction_state text NOT NULL DEFAULT 'none'
  CHECK (extraction_state IN ('none','extracted','completed'));

CREATE TABLE IF NOT EXISTS public.email_extracted_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid NOT NULL REFERENCES public.inbound_emails(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','saved','skipped')),
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_extracted_tasks_email_id_idx
  ON public.email_extracted_tasks(email_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_extracted_tasks TO authenticated;
GRANT ALL ON public.email_extracted_tasks TO service_role;

ALTER TABLE public.email_extracted_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view extracted tasks for their emails"
ON public.email_extracted_tasks FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.inbound_emails e
    WHERE e.id = email_extracted_tasks.email_id
      AND (
        public.has_role(auth.uid(), 'admin')
        OR (e.workspace_id IS NOT NULL AND public.is_workspace_member(e.workspace_id))
      )
  )
);

CREATE POLICY "Members can insert extracted tasks for their emails"
ON public.email_extracted_tasks FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.inbound_emails e
    WHERE e.id = email_extracted_tasks.email_id
      AND (
        public.has_role(auth.uid(), 'admin')
        OR (e.workspace_id IS NOT NULL AND public.is_workspace_member(e.workspace_id))
      )
  )
);

CREATE POLICY "Members can update extracted tasks for their emails"
ON public.email_extracted_tasks FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.inbound_emails e
    WHERE e.id = email_extracted_tasks.email_id
      AND (
        public.has_role(auth.uid(), 'admin')
        OR (e.workspace_id IS NOT NULL AND public.is_workspace_member(e.workspace_id))
      )
  )
);

CREATE POLICY "Members can delete extracted tasks for their emails"
ON public.email_extracted_tasks FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.inbound_emails e
    WHERE e.id = email_extracted_tasks.email_id
      AND (
        public.has_role(auth.uid(), 'admin')
        OR (e.workspace_id IS NOT NULL AND public.is_workspace_member(e.workspace_id))
      )
  )
);

CREATE TRIGGER update_email_extracted_tasks_updated_at
  BEFORE UPDATE ON public.email_extracted_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
