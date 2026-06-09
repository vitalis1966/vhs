
-- Enum for gantt item types
DO $$ BEGIN
  CREATE TYPE public.gantt_item_type AS ENUM ('section','task','milestone','sub_item');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.gantt_item_status AS ENUM ('not_started','in_progress','complete','blocked','on_hold');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.gantt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.gantt_items(id) ON DELETE CASCADE,
  type public.gantt_item_type NOT NULL DEFAULT 'task',
  title text NOT NULL DEFAULT 'Untitled',
  description text,
  start_date date,
  end_date date,
  duration_days integer GENERATED ALWAYS AS (
    CASE
      WHEN start_date IS NOT NULL AND end_date IS NOT NULL
      THEN (end_date - start_date) + 1
      ELSE NULL
    END
  ) STORED,
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status public.gantt_item_status NOT NULL DEFAULT 'not_started',
  assignee_id uuid,
  colour text,
  is_critical_path boolean NOT NULL DEFAULT false,
  is_collapsed boolean NOT NULL DEFAULT false,
  is_complete boolean NOT NULL DEFAULT false,
  dependencies jsonb NOT NULL DEFAULT '[]'::jsonb,
  linked_task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  position integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gantt_items_project ON public.gantt_items(project_id, position);
CREATE INDEX IF NOT EXISTS idx_gantt_items_parent ON public.gantt_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_gantt_items_client ON public.gantt_items(client_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gantt_items TO authenticated;
GRANT ALL ON public.gantt_items TO service_role;

ALTER TABLE public.gantt_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can read gantt items"
  ON public.gantt_items FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id) AND public.can_access_client(client_id));

CREATE POLICY "Workspace members can insert gantt items"
  ON public.gantt_items FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id) AND public.can_access_client(client_id));

CREATE POLICY "Workspace members can update gantt items"
  ON public.gantt_items FOR UPDATE TO authenticated
  USING (public.is_workspace_member(workspace_id) AND public.can_access_client(client_id))
  WITH CHECK (public.is_workspace_member(workspace_id) AND public.can_access_client(client_id));

CREATE POLICY "Workspace members can delete gantt items"
  ON public.gantt_items FOR DELETE TO authenticated
  USING (public.is_workspace_member(workspace_id) AND public.can_access_client(client_id));

CREATE TRIGGER gantt_items_touch
  BEFORE UPDATE ON public.gantt_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Activity log for gantt items
CREATE TABLE IF NOT EXISTS public.gantt_item_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gantt_item_id uuid NOT NULL REFERENCES public.gantt_items(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL,
  actor_id uuid,
  action text NOT NULL,
  changes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gantt_activity_item ON public.gantt_item_activity(gantt_item_id, created_at DESC);

GRANT SELECT, INSERT ON public.gantt_item_activity TO authenticated;
GRANT ALL ON public.gantt_item_activity TO service_role;

ALTER TABLE public.gantt_item_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read gantt activity"
  ON public.gantt_item_activity FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Members can insert gantt activity"
  ON public.gantt_item_activity FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id));

-- Comments on gantt items
CREATE TABLE IF NOT EXISTS public.gantt_item_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gantt_item_id uuid NOT NULL REFERENCES public.gantt_items(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL,
  author_id uuid NOT NULL,
  body text NOT NULL,
  mentioned_user_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gantt_comments_item ON public.gantt_item_comments(gantt_item_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gantt_item_comments TO authenticated;
GRANT ALL ON public.gantt_item_comments TO service_role;

ALTER TABLE public.gantt_item_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read gantt comments"
  ON public.gantt_item_comments FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Members can insert gantt comments"
  ON public.gantt_item_comments FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id) AND author_id = auth.uid());

CREATE POLICY "Authors can update own gantt comments"
  ON public.gantt_item_comments FOR UPDATE TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors or admins can delete gantt comments"
  ON public.gantt_item_comments FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_workspace_admin_or_manager(workspace_id));

CREATE TRIGGER gantt_comments_touch
  BEFORE UPDATE ON public.gantt_item_comments
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
