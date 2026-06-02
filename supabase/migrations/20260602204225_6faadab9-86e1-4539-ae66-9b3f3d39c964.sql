CREATE OR REPLACE FUNCTION public.is_task_assignee(_task_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.task_assignees
    WHERE task_id = _task_id AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.task_workspace_id(_task_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT workspace_id FROM public.tasks WHERE id = _task_id;
$$;

DROP POLICY IF EXISTS tasks_select ON public.tasks;
CREATE POLICY tasks_select ON public.tasks
FOR SELECT TO authenticated
USING (
  can_access_client(client_id)
  OR public.is_task_assignee(id, auth.uid())
);

DROP POLICY IF EXISTS ta_all ON public.task_assignees;
CREATE POLICY ta_self ON public.task_assignees
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY ta_workspace ON public.task_assignees
FOR ALL TO authenticated
USING (is_workspace_member(public.task_workspace_id(task_id)))
WITH CHECK (is_workspace_member(public.task_workspace_id(task_id)));