DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;

CREATE OR REPLACE FUNCTION public.shares_workspace_with(_other_user uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members me
    JOIN public.workspace_members them
      ON them.workspace_id = me.workspace_id
    WHERE me.user_id = auth.uid()
      AND me.status = 'active'
      AND them.user_id = _other_user
      AND them.status = 'active'
  );
$$;

GRANT EXECUTE ON FUNCTION public.shares_workspace_with(uuid) TO authenticated;

CREATE POLICY "profiles_select_self" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "profiles_select_shared_workspace" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.shares_workspace_with(id));

DROP POLICY IF EXISTS "authenticated_read_assessment_pdfs"   ON storage.objects;
DROP POLICY IF EXISTS "authenticated_upload_assessment_pdfs" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_assessment_pdfs" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_assessment_pdfs" ON storage.objects;

CREATE POLICY "admin_read_assessment_pdfs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'assessment-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_insert_assessment_pdfs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assessment-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_update_assessment_pdfs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'assessment-uploads' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'assessment-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_delete_assessment_pdfs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'assessment-uploads' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "workspace-logos read"   ON storage.objects;
DROP POLICY IF EXISTS "workspace-logos write"  ON storage.objects;
DROP POLICY IF EXISTS "workspace-logos update" ON storage.objects;
DROP POLICY IF EXISTS "workspace-logos delete" ON storage.objects;

CREATE POLICY "workspace_logos_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'workspace-logos'
    AND public.is_workspace_member(((storage.foldername(name))[1])::uuid)
  );

CREATE POLICY "workspace_logos_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'workspace-logos'
    AND public.is_workspace_member(((storage.foldername(name))[1])::uuid)
  )
  WITH CHECK (
    bucket_id = 'workspace-logos'
    AND public.is_workspace_member(((storage.foldername(name))[1])::uuid)
  );

CREATE POLICY "workspace_logos_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'workspace-logos'
    AND public.is_workspace_member(((storage.foldername(name))[1])::uuid)
  );