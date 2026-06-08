
-- RLS for storage.objects on email-attachments
CREATE POLICY "email-attachments read for workspace members"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'email-attachments'
    AND EXISTS (
      SELECT 1 FROM public.inbox_email_attachments a
      JOIN public.inbound_emails e ON e.id = a.email_id
      WHERE a.storage_path = name
        AND public.is_workspace_member(e.workspace_id)
    )
  );

CREATE POLICY "email-attachments delete for admins/managers"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'email-attachments'
    AND EXISTS (
      SELECT 1 FROM public.inbox_email_attachments a
      JOIN public.inbound_emails e ON e.id = a.email_id
      WHERE a.storage_path = name
        AND public.is_workspace_admin_or_manager(e.workspace_id)
    )
  );
