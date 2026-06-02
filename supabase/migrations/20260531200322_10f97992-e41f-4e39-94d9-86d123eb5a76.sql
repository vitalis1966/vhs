
-- Workspaces: settings/config columns
ALTER TABLE public.workspaces
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#1C3D2E',
  ADD COLUMN IF NOT EXISTS date_format text DEFAULT 'MM/DD/YYYY',
  ADD COLUMN IF NOT EXISTS time_zone text DEFAULT 'America/Edmonton',
  ADD COLUMN IF NOT EXISTS default_industry text,
  ADD COLUMN IF NOT EXISTS default_account_owner_id uuid,
  ADD COLUMN IF NOT EXISTS role_permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS notification_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS workspace_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS security_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Allow admins to update their workspace row
DROP POLICY IF EXISTS workspaces_admin_update ON public.workspaces;
CREATE POLICY workspaces_admin_update ON public.workspaces
  FOR UPDATE TO authenticated
  USING (is_workspace_admin(id))
  WITH CHECK (is_workspace_admin(id));

-- workspace_members: invite metadata
ALTER TABLE public.workspace_members
  ADD COLUMN IF NOT EXISTS invited_name text,
  ADD COLUMN IF NOT EXISTS invited_at timestamptz,
  ADD COLUMN IF NOT EXISTS invited_by uuid;

-- Allow 'inactive' as a status
ALTER TABLE public.workspace_members DROP CONSTRAINT IF EXISTS workspace_members_status_check;
ALTER TABLE public.workspace_members
  ADD CONSTRAINT workspace_members_status_check
  CHECK (status = ANY (ARRAY['pending'::text, 'active'::text, 'inactive'::text]));

-- profiles: last_active_at
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_active_at timestamptz;

-- Workspace logo storage bucket (public read so the sidebar image loads anywhere)
INSERT INTO storage.buckets (id, name, public)
VALUES ('workspace-logos', 'workspace-logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "workspace-logos read" ON storage.objects;
CREATE POLICY "workspace-logos read" ON storage.objects
  FOR SELECT USING (bucket_id = 'workspace-logos');

DROP POLICY IF EXISTS "workspace-logos write" ON storage.objects;
CREATE POLICY "workspace-logos write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'workspace-logos');

DROP POLICY IF EXISTS "workspace-logos update" ON storage.objects;
CREATE POLICY "workspace-logos update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'workspace-logos');

DROP POLICY IF EXISTS "workspace-logos delete" ON storage.objects;
CREATE POLICY "workspace-logos delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'workspace-logos');
