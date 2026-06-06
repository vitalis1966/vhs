DROP POLICY IF EXISTS pdocs_storage_delete ON storage.objects;
CREATE POLICY pdocs_storage_delete ON storage.objects FOR DELETE
USING (
  bucket_id = 'platform-documents'
  AND public.is_workspace_member(((storage.foldername(name))[1])::uuid)
  AND (
    public.is_workspace_admin_or_manager(((storage.foldername(name))[1])::uuid)
    OR EXISTS (
      SELECT 1 FROM public.platform_documents pd
      WHERE pd.storage_path = storage.objects.name
        AND pd.uploaded_by = auth.uid()
    )
  )
);