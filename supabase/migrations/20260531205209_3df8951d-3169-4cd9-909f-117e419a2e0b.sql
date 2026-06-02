
-- sent_emails table
CREATE TABLE public.sent_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  client_id uuid,
  subject text NOT NULL,
  body_html text,
  body_text text,
  from_address text NOT NULL,
  to_addresses jsonb NOT NULL DEFAULT '[]'::jsonb,
  cc_addresses jsonb NOT NULL DEFAULT '[]'::jsonb,
  bcc_addresses jsonb NOT NULL DEFAULT '[]'::jsonb,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  sent_by uuid,
  sent_at timestamptz NOT NULL DEFAULT now(),
  resend_message_id text,
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  is_broadcast boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sent_emails_workspace ON public.sent_emails(workspace_id, sent_at DESC);
CREATE INDEX idx_sent_emails_client ON public.sent_emails(client_id, sent_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.sent_emails TO authenticated;
GRANT ALL ON public.sent_emails TO service_role;

ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY sent_emails_select ON public.sent_emails
  FOR SELECT TO authenticated
  USING (is_workspace_member(workspace_id));

CREATE POLICY sent_emails_insert ON public.sent_emails
  FOR INSERT TO authenticated
  WITH CHECK (is_workspace_member(workspace_id));

CREATE POLICY sent_emails_update ON public.sent_emails
  FOR UPDATE TO authenticated
  USING (is_workspace_member(workspace_id))
  WITH CHECK (is_workspace_member(workspace_id));

-- email_templates table
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  subject text NOT NULL DEFAULT '',
  body_html text NOT NULL DEFAULT '',
  body_text text NOT NULL DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_templates_workspace ON public.email_templates(workspace_id, name);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY email_templates_select ON public.email_templates
  FOR SELECT TO authenticated
  USING (is_workspace_member(workspace_id));

CREATE POLICY email_templates_write ON public.email_templates
  FOR ALL TO authenticated
  USING (workspace_role(workspace_id) = ANY (ARRAY['admin'::text, 'manager'::text]))
  WITH CHECK (workspace_role(workspace_id) = ANY (ARRAY['admin'::text, 'manager'::text]));
