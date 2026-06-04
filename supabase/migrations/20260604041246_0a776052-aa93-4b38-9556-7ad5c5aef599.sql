
CREATE TABLE public.pasted_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  imported_by uuid REFERENCES public.profiles(id),
  from_name text,
  from_email text,
  to_addresses jsonb NOT NULL DEFAULT '[]'::jsonb,
  cc_addresses jsonb NOT NULL DEFAULT '[]'::jsonb,
  subject text,
  sent_at timestamptz,
  raw_body text NOT NULL,
  ai_summary text,
  ai_category text,
  ai_payload jsonb,
  source text NOT NULL DEFAULT 'manual_paste',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pasted_emails TO authenticated;
GRANT ALL ON public.pasted_emails TO service_role;

ALTER TABLE public.pasted_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pasted_emails_select" ON public.pasted_emails FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));
CREATE POLICY "pasted_emails_insert" ON public.pasted_emails FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY "pasted_emails_update" ON public.pasted_emails FOR UPDATE TO authenticated
  USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY "pasted_emails_delete" ON public.pasted_emails FOR DELETE TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE INDEX idx_pasted_emails_workspace ON public.pasted_emails(workspace_id, created_at DESC);
CREATE INDEX idx_pasted_emails_client ON public.pasted_emails(client_id, created_at DESC);

CREATE TRIGGER trg_pasted_emails_touch
  BEFORE UPDATE ON public.pasted_emails
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS source_email_id uuid REFERENCES public.pasted_emails(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_kind text;
CREATE INDEX IF NOT EXISTS idx_tasks_source_email_id ON public.tasks(source_email_id);

ALTER TABLE public.meetings
  ADD COLUMN IF NOT EXISTS source_email_id uuid REFERENCES public.pasted_emails(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_meetings_source_email_id ON public.meetings(source_email_id);

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS needs_review boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_from text;
