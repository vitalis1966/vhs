
-- Fix infinite recursion between tasks <-> task_comments policies
CREATE OR REPLACE FUNCTION public.user_mentioned_in_task(_task_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.task_comments c
    WHERE c.task_id = _task_id AND _user_id = ANY (c.mentioned_user_ids)
  );
$$;

DROP POLICY IF EXISTS tasks_select ON public.tasks;
CREATE POLICY "tasks_select" ON public.tasks FOR SELECT TO authenticated
USING (
  public.can_access_client(client_id)
  OR public.is_task_assignee(id, auth.uid())
  OR public.user_mentioned_in_task(id, auth.uid())
);
