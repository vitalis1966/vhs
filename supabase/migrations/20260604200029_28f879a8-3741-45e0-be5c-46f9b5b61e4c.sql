
-- 1. assessment_intakes: validate anon inserts
DROP POLICY IF EXISTS "Allow public inserts on assessment_intakes" ON public.assessment_intakes;
CREATE POLICY "Allow public inserts on assessment_intakes"
ON public.assessment_intakes
FOR INSERT
TO anon, authenticated
WITH CHECK (
  full_name IS NOT NULL AND length(btrim(full_name)) BETWEEN 1 AND 200
  AND email IS NOT NULL AND length(email) BETWEEN 3 AND 320 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (organization_name IS NULL OR length(organization_name) <= 300)
  AND (phone IS NULL OR length(phone) <= 50)
  AND (assessment_purpose IS NULL OR assessment_purpose IN ('new_clinic','existing_clinic','expansion','acquisition','other','dental','medical','veterinary','nhsf','surgical'))
);

-- 2. platform_documents: restrict DELETE to admins/managers or uploader; keep insert/update for members
DROP POLICY IF EXISTS pdocs_write ON public.platform_documents;
CREATE POLICY pdocs_insert ON public.platform_documents
  FOR INSERT TO authenticated
  WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY pdocs_update ON public.platform_documents
  FOR UPDATE TO authenticated
  USING (is_workspace_member(workspace_id) AND (is_workspace_admin_or_manager(workspace_id) OR uploaded_by = auth.uid()))
  WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY pdocs_delete ON public.platform_documents
  FOR DELETE TO authenticated
  USING (is_workspace_admin_or_manager(workspace_id) OR uploaded_by = auth.uid());

-- 3. workspace-logos storage: restrict write/update/delete to admin/manager
DROP POLICY IF EXISTS workspace_logos_insert ON storage.objects;
DROP POLICY IF EXISTS workspace_logos_update ON storage.objects;
DROP POLICY IF EXISTS workspace_logos_delete ON storage.objects;

CREATE POLICY workspace_logos_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'workspace-logos'
    AND is_workspace_admin_or_manager(((storage.foldername(name))[1])::uuid)
  );

CREATE POLICY workspace_logos_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'workspace-logos'
    AND is_workspace_admin_or_manager(((storage.foldername(name))[1])::uuid)
  )
  WITH CHECK (
    bucket_id = 'workspace-logos'
    AND is_workspace_admin_or_manager(((storage.foldername(name))[1])::uuid)
  );

CREATE POLICY workspace_logos_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'workspace-logos'
    AND is_workspace_admin_or_manager(((storage.foldername(name))[1])::uuid)
  );
