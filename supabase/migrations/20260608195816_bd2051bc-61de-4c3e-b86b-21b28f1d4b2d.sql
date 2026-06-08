
-- 1) task_follow_ups
CREATE TABLE public.task_follow_ups (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null unique references public.tasks(id) on delete cascade,
  enabled boolean not null default false,
  follow_up_date timestamptz,
  follow_up_due_date timestamptz,
  remind_before_value integer,
  remind_before_unit text check (remind_before_unit in ('hours','days','months')),
  is_recurring boolean not null default false,
  recurrence_frequency text check (recurrence_frequency in ('daily','weekly','biweekly','monthly','quarterly')),
  resource_id uuid references public.profiles(id) on delete set null,
  follow_up_status text not null default 'not_started' check (follow_up_status in ('not_started','recurring','completed')),
  last_reminder_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_follow_ups TO authenticated;
GRANT ALL ON public.task_follow_ups TO service_role;

ALTER TABLE public.task_follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace members manage follow-ups"
  ON public.task_follow_ups
  FOR ALL
  TO authenticated
  USING (public.is_workspace_member(public.task_workspace_id(task_id)))
  WITH CHECK (public.is_workspace_member(public.task_workspace_id(task_id)));

CREATE TRIGGER trg_task_follow_ups_updated
  BEFORE UPDATE ON public.task_follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- compute follow_up_status
CREATE OR REPLACE FUNCTION public.compute_follow_up_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_task_status_category text;
BEGIN
  SELECT ts.category INTO v_task_status_category
  FROM public.tasks t
  LEFT JOIN public.task_statuses ts ON ts.id = t.status_id
  WHERE t.id = NEW.task_id;

  IF v_task_status_category IN ('done','cancelled') THEN
    NEW.follow_up_status := 'completed';
  ELSIF NEW.follow_up_due_date IS NOT NULL AND NEW.follow_up_due_date < now() THEN
    NEW.follow_up_status := 'completed';
  ELSIF NEW.enabled = false OR NEW.follow_up_date IS NULL THEN
    NEW.follow_up_status := 'not_started';
  ELSIF NEW.is_recurring = true THEN
    NEW.follow_up_status := 'recurring';
  ELSE
    NEW.follow_up_status := 'not_started';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_task_follow_ups_compute
  BEFORE INSERT OR UPDATE ON public.task_follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.compute_follow_up_status();

-- When parent task status changes, sync follow-up status
CREATE OR REPLACE FUNCTION public.sync_follow_up_on_task_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cat text;
BEGIN
  IF NEW.status_id IS NOT DISTINCT FROM OLD.status_id THEN
    RETURN NEW;
  END IF;
  SELECT category INTO v_cat FROM public.task_statuses WHERE id = NEW.status_id;
  IF v_cat IN ('done','cancelled') THEN
    UPDATE public.task_follow_ups
       SET follow_up_status = 'completed', last_reminder_sent_at = NULL, updated_at = now()
     WHERE task_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_tasks_sync_follow_up_status
  AFTER UPDATE OF status_id ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.sync_follow_up_on_task_status();

-- 2) inbox_email_attachments
CREATE TABLE public.inbox_email_attachments (
  id uuid primary key default gen_random_uuid(),
  email_id uuid not null references public.inbound_emails(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  file_size integer,
  created_at timestamptz not null default now()
);

CREATE INDEX idx_inbox_email_attachments_email_id ON public.inbox_email_attachments(email_id);

GRANT SELECT, INSERT, DELETE ON public.inbox_email_attachments TO authenticated;
GRANT ALL ON public.inbox_email_attachments TO service_role;

ALTER TABLE public.inbox_email_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace members read email attachments"
  ON public.inbox_email_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.inbound_emails e
      WHERE e.id = email_id
        AND public.is_workspace_member(e.workspace_id)
    )
  );

CREATE POLICY "workspace admin/manager delete email attachments"
  ON public.inbox_email_attachments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.inbound_emails e
      WHERE e.id = email_id
        AND public.is_workspace_admin_or_manager(e.workspace_id)
    )
  );
