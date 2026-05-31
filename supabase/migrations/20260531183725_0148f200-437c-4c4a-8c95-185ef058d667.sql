-- Allow workspace members to insert their own activities rows
CREATE POLICY activities_insert ON public.activities
  FOR INSERT TO authenticated
  WITH CHECK (is_workspace_member(workspace_id) AND actor_id = auth.uid());