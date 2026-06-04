
-- Comment count column on tasks
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS comment_count integer NOT NULL DEFAULT 0;

-- task_comments
CREATE TABLE public.task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id),
  body_html text NOT NULL,
  body_text text NOT NULL DEFAULT '',
  mentioned_user_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_task_comments_task ON public.task_comments(task_id, created_at);
CREATE INDEX idx_task_comments_mentions ON public.task_comments USING gin (mentioned_user_ids);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_comments TO authenticated;
GRANT ALL ON public.task_comments TO service_role;

ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_comments_select" ON public.task_comments FOR SELECT TO authenticated
USING (
  public.is_workspace_member(workspace_id)
  AND (
    EXISTS (
      SELECT 1 FROM public.tasks t
      WHERE t.id = task_comments.task_id
        AND (public.can_access_client(t.client_id) OR public.is_task_assignee(t.id, auth.uid()))
    )
    OR auth.uid() = ANY (mentioned_user_ids)
    OR author_id = auth.uid()
  )
);

CREATE POLICY "task_comments_insert" ON public.task_comments FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND public.is_workspace_member(workspace_id)
);

CREATE POLICY "task_comments_update" ON public.task_comments FOR UPDATE TO authenticated
USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

CREATE POLICY "task_comments_delete" ON public.task_comments FOR DELETE TO authenticated
USING (author_id = auth.uid() OR public.is_workspace_admin(workspace_id));

-- task_mutes
CREATE TABLE public.task_mutes (
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.task_mutes TO authenticated;
GRANT ALL ON public.task_mutes TO service_role;
ALTER TABLE public.task_mutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "task_mutes_select_own" ON public.task_mutes FOR SELECT TO authenticated
USING (user_id = auth.uid());
CREATE POLICY "task_mutes_insert_own" ON public.task_mutes FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());
CREATE POLICY "task_mutes_delete_own" ON public.task_mutes FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Comment count trigger
CREATE OR REPLACE FUNCTION public.tasks_bump_comment_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tasks SET comment_count = comment_count + 1 WHERE id = NEW.task_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tasks SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.task_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_task_comments_count_ins
AFTER INSERT ON public.task_comments
FOR EACH ROW EXECUTE FUNCTION public.tasks_bump_comment_count();

CREATE TRIGGER trg_task_comments_count_del
AFTER DELETE ON public.task_comments
FOR EACH ROW EXECUTE FUNCTION public.tasks_bump_comment_count();

-- Extend tasks_select so mentioned users can also see the task itself
DROP POLICY IF EXISTS tasks_select ON public.tasks;
CREATE POLICY "tasks_select" ON public.tasks FOR SELECT TO authenticated
USING (
  public.can_access_client(client_id)
  OR public.is_task_assignee(id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.task_comments c
    WHERE c.task_id = tasks.id AND auth.uid() = ANY (c.mentioned_user_ids)
  )
);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_comments;
