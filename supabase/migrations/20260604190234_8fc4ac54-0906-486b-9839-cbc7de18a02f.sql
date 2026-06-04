
CREATE POLICY "cbas_insert_admin_manager" ON public.client_budget_alerts_sent
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = client_budget_alerts_sent.client_id
      AND public.is_workspace_admin_or_manager(c.workspace_id)
  ));

CREATE POLICY "cbas_delete_admin_manager" ON public.client_budget_alerts_sent
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = client_budget_alerts_sent.client_id
      AND public.is_workspace_admin_or_manager(c.workspace_id)
  ));

CREATE POLICY "seo_global_restrict_select_to_admins" ON public.seo_global
  AS RESTRICTIVE
  FOR SELECT TO authenticated, anon
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "workspace_logos_select_members" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'workspace-logos'
    AND public.is_workspace_member(((storage.foldername(name))[1])::uuid)
  );
