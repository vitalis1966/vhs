DROP POLICY IF EXISTS pdocs_storage_update ON storage.objects;

CREATE POLICY pdocs_storage_update ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'platform-documents'
  AND is_workspace_member(((storage.foldername(name))[1])::uuid)
  AND (
    is_workspace_admin_or_manager(((storage.foldername(name))[1])::uuid)
    OR EXISTS (
      SELECT 1 FROM public.platform_documents pd
      WHERE pd.storage_path = objects.name AND pd.uploaded_by = auth.uid()
    )
  )
)
WITH CHECK (
  bucket_id = 'platform-documents'
  AND is_workspace_member(((storage.foldername(name))[1])::uuid)
  AND (
    is_workspace_admin_or_manager(((storage.foldername(name))[1])::uuid)
    OR EXISTS (
      SELECT 1 FROM public.platform_documents pd
      WHERE pd.storage_path = objects.name AND pd.uploaded_by = auth.uid()
    )
  )
);