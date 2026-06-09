
ALTER TABLE public.gantt_items
  ADD COLUMN IF NOT EXISTS is_internal boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS linked_meeting_id uuid REFERENCES public.meetings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS linked_milestone_id uuid REFERENCES public.milestones(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS estimated_hours numeric,
  ADD COLUMN IF NOT EXISTS attachment_document_ids uuid[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS due_reminder_3d_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS due_reminder_1d_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS due_reminder_0d_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS overdue_notified_at timestamptz;

CREATE TABLE IF NOT EXISTS public.gantt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_builtin boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gantt_templates TO authenticated;
GRANT ALL ON public.gantt_templates TO service_role;
ALTER TABLE public.gantt_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members read gantt templates" ON public.gantt_templates
  FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));
CREATE POLICY "ws members write gantt templates" ON public.gantt_templates
  FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY "ws admins update gantt templates" ON public.gantt_templates
  FOR UPDATE TO authenticated USING (public.is_workspace_admin_or_manager(workspace_id));
CREATE POLICY "ws admins delete gantt templates" ON public.gantt_templates
  FOR DELETE TO authenticated USING (public.is_workspace_admin_or_manager(workspace_id));

CREATE TABLE IF NOT EXISTS public.gantt_template_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.gantt_templates(id) ON DELETE CASCADE,
  parent_key text,
  item_key text NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  start_offset_days int NOT NULL DEFAULT 0,
  duration_days int NOT NULL DEFAULT 1,
  colour text,
  position int NOT NULL DEFAULT 0,
  is_internal boolean NOT NULL DEFAULT false,
  dependencies_keys text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gantt_template_items TO authenticated;
GRANT ALL ON public.gantt_template_items TO service_role;
ALTER TABLE public.gantt_template_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws members read template items" ON public.gantt_template_items
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.gantt_templates t WHERE t.id = template_id AND public.is_workspace_member(t.workspace_id))
  );
CREATE POLICY "ws members write template items" ON public.gantt_template_items
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.gantt_templates t WHERE t.id = template_id AND public.is_workspace_member(t.workspace_id))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.gantt_templates t WHERE t.id = template_id AND public.is_workspace_member(t.workspace_id))
  );

CREATE OR REPLACE FUNCTION public.sync_gantt_from_task()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_done boolean;
BEGIN
  IF NEW.completed_at IS DISTINCT FROM OLD.completed_at THEN
    v_done := NEW.completed_at IS NOT NULL;
    UPDATE public.gantt_items
       SET progress = CASE WHEN v_done THEN 100 ELSE LEAST(progress, 99) END,
           is_complete = v_done,
           status = CASE WHEN v_done THEN 'complete' ELSE status END
     WHERE linked_task_id = NEW.id;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_sync_gantt_from_task ON public.tasks;
CREATE TRIGGER trg_sync_gantt_from_task AFTER UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.sync_gantt_from_task();

CREATE OR REPLACE FUNCTION public.sync_task_from_gantt()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_done_status uuid;
BEGIN
  IF NEW.linked_task_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.progress IS DISTINCT FROM OLD.progress OR NEW.is_complete IS DISTINCT FROM OLD.is_complete THEN
    IF (NEW.progress >= 100 OR NEW.is_complete = true) THEN
      SELECT id INTO v_done_status FROM public.task_statuses
        WHERE workspace_id = NEW.workspace_id AND category = 'done' ORDER BY position LIMIT 1;
      UPDATE public.tasks
         SET completed_at = COALESCE(completed_at, now()),
             status_id = COALESCE(v_done_status, status_id)
       WHERE id = NEW.linked_task_id AND completed_at IS NULL;
    END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_sync_task_from_gantt ON public.gantt_items;
CREATE TRIGGER trg_sync_task_from_gantt AFTER UPDATE ON public.gantt_items
FOR EACH ROW EXECUTE FUNCTION public.sync_task_from_gantt();

CREATE OR REPLACE FUNCTION public.sync_gantt_from_milestone()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.completed_at IS DISTINCT FROM OLD.completed_at THEN
    UPDATE public.gantt_items
       SET is_complete = (NEW.completed_at IS NOT NULL),
           progress = CASE WHEN NEW.completed_at IS NOT NULL THEN 100 ELSE 0 END,
           status = CASE WHEN NEW.completed_at IS NOT NULL THEN 'complete' ELSE status END
     WHERE linked_milestone_id = NEW.id;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_sync_gantt_from_milestone ON public.milestones;
CREATE TRIGGER trg_sync_gantt_from_milestone AFTER UPDATE ON public.milestones
FOR EACH ROW EXECUTE FUNCTION public.sync_gantt_from_milestone();

CREATE OR REPLACE FUNCTION public.sync_milestone_from_gantt()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.linked_milestone_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.is_complete IS DISTINCT FROM OLD.is_complete THEN
    UPDATE public.milestones
       SET completed_at = CASE WHEN NEW.is_complete THEN COALESCE(completed_at, now()) ELSE NULL END
     WHERE id = NEW.linked_milestone_id;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_sync_milestone_from_gantt ON public.gantt_items;
CREATE TRIGGER trg_sync_milestone_from_gantt AFTER UPDATE ON public.gantt_items
FOR EACH ROW EXECUTE FUNCTION public.sync_milestone_from_gantt();

CREATE OR REPLACE FUNCTION public.sync_gantt_from_meeting()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'completed' THEN
    UPDATE public.gantt_items
       SET is_complete = true, progress = 100, status = 'complete'
     WHERE linked_meeting_id = NEW.id;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_sync_gantt_from_meeting ON public.meetings;
CREATE TRIGGER trg_sync_gantt_from_meeting AFTER UPDATE ON public.meetings
FOR EACH ROW EXECUTE FUNCTION public.sync_gantt_from_meeting();

CREATE OR REPLACE FUNCTION public.get_client_gantt_for_project(p_project_id uuid)
RETURNS TABLE(
  id uuid, type text, title text, parent_id uuid, "position" int,
  start_date date, end_date date, progress int, is_complete boolean
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT g.id, g.type::text, g.title, g.parent_id, g.position,
         g.start_date, g.end_date, g.progress, g.is_complete
    FROM public.gantt_items g
    JOIN public.projects p ON p.id = g.project_id
   WHERE g.project_id = p_project_id
     AND g.is_internal = false
     AND public.can_access_client(p.client_id)
   ORDER BY g.position;
$$;
GRANT EXECUTE ON FUNCTION public.get_client_gantt_for_project(uuid) TO authenticated, anon;
