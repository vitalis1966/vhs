
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS checklist jsonb NOT NULL DEFAULT '[]'::jsonb;

DROP POLICY IF EXISTS notif_insert_workspace ON public.notifications;
CREATE POLICY notif_insert_workspace ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (is_workspace_member(workspace_id) AND (actor_id = auth.uid() OR actor_id IS NULL));
