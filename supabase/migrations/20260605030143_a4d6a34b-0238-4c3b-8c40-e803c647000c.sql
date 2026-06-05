
-- Activities: restrict UPDATE/DELETE to workspace admins to protect audit trail
CREATE POLICY "Only admins can update activities"
  ON public.activities
  FOR UPDATE
  TO authenticated
  USING (public.is_workspace_admin(workspace_id))
  WITH CHECK (public.is_workspace_admin(workspace_id));

CREATE POLICY "Only admins can delete activities"
  ON public.activities
  FOR DELETE
  TO authenticated
  USING (public.is_workspace_admin(workspace_id));

-- Inbound emails: add explicit INSERT policy scoped to workspace membership.
-- Service role bypasses RLS, so the edge function ingestion path is unaffected.
CREATE POLICY "Workspace members can insert inbound emails for their workspace"
  ON public.inbound_emails
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id));
