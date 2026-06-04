
CREATE TABLE public.inbound_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  from_email text NOT NULL,
  from_name text,
  subject text,
  body_text text,
  body_html text,
  received_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'not_assigned' CHECK (status IN ('not_assigned','assigned','waiting')),
  resend_email_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_inbound_emails_workspace_received ON public.inbound_emails(workspace_id, received_at DESC);
CREATE INDEX idx_inbound_emails_assigned_status ON public.inbound_emails(assigned_to, status);

GRANT SELECT, UPDATE, DELETE ON public.inbound_emails TO authenticated;
GRANT ALL ON public.inbound_emails TO service_role;

ALTER TABLE public.inbound_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inbound_emails_select" ON public.inbound_emails FOR SELECT TO authenticated
  USING (assigned_to = auth.uid() OR public.is_workspace_admin_or_manager(workspace_id));
CREATE POLICY "inbound_emails_update" ON public.inbound_emails FOR UPDATE TO authenticated
  USING (assigned_to = auth.uid() OR public.is_workspace_admin_or_manager(workspace_id))
  WITH CHECK (assigned_to = auth.uid() OR public.is_workspace_admin_or_manager(workspace_id));
CREATE POLICY "inbound_emails_delete" ON public.inbound_emails FOR DELETE TO authenticated
  USING (assigned_to = auth.uid() OR public.is_workspace_admin_or_manager(workspace_id));

CREATE TRIGGER trg_inbound_emails_updated_at BEFORE UPDATE ON public.inbound_emails
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


CREATE TABLE public.email_task_extractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid NOT NULL REFERENCES public.inbound_emails(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_email_task_extractions_email ON public.email_task_extractions(email_id);

GRANT SELECT, INSERT, DELETE ON public.email_task_extractions TO authenticated;
GRANT ALL ON public.email_task_extractions TO service_role;

ALTER TABLE public.email_task_extractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_extractions_select" ON public.email_task_extractions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.inbound_emails e
    WHERE e.id = email_id
      AND (e.assigned_to = auth.uid() OR public.is_workspace_admin_or_manager(e.workspace_id))
  ));
CREATE POLICY "email_extractions_insert" ON public.email_task_extractions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.inbound_emails e
    WHERE e.id = email_id
      AND (e.assigned_to = auth.uid() OR public.is_workspace_admin_or_manager(e.workspace_id))
  ));
