
DROP POLICY IF EXISTS cm_all ON public.client_members;

CREATE POLICY cm_select ON public.client_members
  FOR SELECT
  USING (public.can_access_client(client_id));

CREATE POLICY cm_admin_insert ON public.client_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = client_members.client_id
        AND public.is_workspace_admin_or_manager(c.workspace_id)
    )
  );

CREATE POLICY cm_admin_update ON public.client_members
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = client_members.client_id
        AND public.is_workspace_admin_or_manager(c.workspace_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = client_members.client_id
        AND public.is_workspace_admin_or_manager(c.workspace_id)
    )
  );

CREATE POLICY cm_admin_delete ON public.client_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = client_members.client_id
        AND public.is_workspace_admin_or_manager(c.workspace_id)
    )
  );
