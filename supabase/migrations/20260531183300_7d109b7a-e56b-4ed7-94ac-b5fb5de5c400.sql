
-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- WORKSPACES
CREATE TABLE IF NOT EXISTS public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT ALL ON public.workspaces TO service_role;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- WORKSPACE MEMBERS
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email text,
  role text NOT NULL DEFAULT 'team_member' CHECK (role IN ('admin','manager','team_member','client')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('pending','active')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_members TO authenticated;
GRANT ALL ON public.workspace_members TO service_role;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Helpers (workspace-only, before clients)
CREATE OR REPLACE FUNCTION public.is_workspace_member(wid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = wid AND user_id = auth.uid() AND status = 'active');
$$;
CREATE OR REPLACE FUNCTION public.is_workspace_admin(wid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = wid AND user_id = auth.uid() AND status = 'active' AND role = 'admin');
$$;
CREATE OR REPLACE FUNCTION public.workspace_role(wid uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.workspace_members WHERE workspace_id = wid AND user_id = auth.uid() AND status = 'active' LIMIT 1;
$$;

DROP POLICY IF EXISTS "workspaces_select_member" ON public.workspaces;
CREATE POLICY "workspaces_select_member" ON public.workspaces FOR SELECT TO authenticated USING (public.is_workspace_member(id));
DROP POLICY IF EXISTS "wm_select_member" ON public.workspace_members;
CREATE POLICY "wm_select_member" ON public.workspace_members FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));
DROP POLICY IF EXISTS "wm_admin_all" ON public.workspace_members;
CREATE POLICY "wm_admin_all" ON public.workspace_members FOR ALL TO authenticated USING (public.is_workspace_admin(workspace_id)) WITH CHECK (public.is_workspace_admin(workspace_id));

-- CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text DEFAULT 'Active',
  industry text,
  account_owner_id uuid REFERENCES public.profiles(id),
  start_date date,
  website text,
  summary text,
  health_score int,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- CLIENT MEMBERS (before can_access_client)
CREATE TABLE IF NOT EXISTS public.client_members (
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_on_account text NOT NULL DEFAULT 'contributor' CHECK (role_on_account IN ('owner','contributor','viewer')),
  PRIMARY KEY (client_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_members TO authenticated;
GRANT ALL ON public.client_members TO service_role;
ALTER TABLE public.client_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_client(cid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = cid AND (
      public.is_workspace_admin(c.workspace_id)
      OR c.account_owner_id = auth.uid()
      OR EXISTS (SELECT 1 FROM public.client_members cm WHERE cm.client_id = cid AND cm.user_id = auth.uid())
    )
  );
$$;

DROP POLICY IF EXISTS "clients_select" ON public.clients;
CREATE POLICY "clients_select" ON public.clients FOR SELECT TO authenticated USING (public.can_access_client(id));
DROP POLICY IF EXISTS "clients_write" ON public.clients;
CREATE POLICY "clients_write" ON public.clients FOR ALL TO authenticated
  USING (public.workspace_role(workspace_id) IN ('admin','manager'))
  WITH CHECK (public.workspace_role(workspace_id) IN ('admin','manager'));

DROP POLICY IF EXISTS "cm_all" ON public.client_members;
CREATE POLICY "cm_all" ON public.client_members FOR ALL TO authenticated USING (public.can_access_client(client_id)) WITH CHECK (public.can_access_client(client_id));

-- CONTACTS
CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  title text,
  email text,
  phone text,
  is_primary boolean DEFAULT false
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contacts_all" ON public.contacts;
CREATE POLICY "contacts_all" ON public.contacts FOR ALL TO authenticated USING (public.can_access_client(client_id)) WITH CHECK (public.can_access_client(client_id));

-- PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text DEFAULT 'Active',
  start_date date,
  target_date date,
  owner_id uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projects_select" ON public.projects;
CREATE POLICY "projects_select" ON public.projects FOR SELECT TO authenticated USING (public.can_access_client(client_id));
DROP POLICY IF EXISTS "projects_write" ON public.projects;
CREATE POLICY "projects_write" ON public.projects FOR ALL TO authenticated
  USING (public.workspace_role(workspace_id) IN ('admin','manager'))
  WITH CHECK (public.workspace_role(workspace_id) IN ('admin','manager'));

-- MILESTONES
CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  due_date date,
  completed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.milestones TO authenticated;
GRANT ALL ON public.milestones TO service_role;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "milestones_select" ON public.milestones;
CREATE POLICY "milestones_select" ON public.milestones FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.can_access_client(p.client_id)));
DROP POLICY IF EXISTS "milestones_write" ON public.milestones;
CREATE POLICY "milestones_write" ON public.milestones FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.workspace_role(p.workspace_id) IN ('admin','manager')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.workspace_role(p.workspace_id) IN ('admin','manager')));

-- TASK STATUSES
CREATE TABLE IF NOT EXISTS public.task_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('todo','active','waiting','done','cancelled')),
  color text,
  position int NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_statuses TO authenticated;
GRANT ALL ON public.task_statuses TO service_role;
ALTER TABLE public.task_statuses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ts_select" ON public.task_statuses;
CREATE POLICY "ts_select" ON public.task_statuses FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));
DROP POLICY IF EXISTS "ts_write" ON public.task_statuses;
CREATE POLICY "ts_write" ON public.task_statuses FOR ALL TO authenticated USING (public.is_workspace_admin(workspace_id)) WITH CHECK (public.is_workspace_admin(workspace_id));

-- TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  description jsonb,
  description_text text,
  status_id uuid REFERENCES public.task_statuses(id),
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Urgent')),
  due_date date,
  created_by uuid REFERENCES public.profiles(id),
  completed_at timestamptz,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.task_assignees (
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_assignees TO authenticated;
GRANT ALL ON public.task_assignees TO service_role;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_select" ON public.tasks;
CREATE POLICY "tasks_select" ON public.tasks FOR SELECT TO authenticated
  USING (public.can_access_client(client_id)
         OR EXISTS (SELECT 1 FROM public.task_assignees ta WHERE ta.task_id = tasks.id AND ta.user_id = auth.uid()));
DROP POLICY IF EXISTS "tasks_write" ON public.tasks;
CREATE POLICY "tasks_write" ON public.tasks FOR ALL TO authenticated
  USING (public.is_workspace_member(workspace_id))
  WITH CHECK (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "ta_all" ON public.task_assignees;
CREATE POLICY "ta_all" ON public.task_assignees FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id AND (public.can_access_client(t.client_id) OR user_id = auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id AND public.is_workspace_member(t.workspace_id)));

-- TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "teams_select" ON public.teams;
CREATE POLICY "teams_select" ON public.teams FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));
DROP POLICY IF EXISTS "teams_write" ON public.teams;
CREATE POLICY "teams_write" ON public.teams FOR ALL TO authenticated USING (public.is_workspace_admin(workspace_id)) WITH CHECK (public.is_workspace_admin(workspace_id));

CREATE TABLE IF NOT EXISTS public.team_members (
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tm_select" ON public.team_members;
CREATE POLICY "tm_select" ON public.team_members FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND public.is_workspace_member(t.workspace_id)));
DROP POLICY IF EXISTS "tm_write" ON public.team_members;
CREATE POLICY "tm_write" ON public.team_members FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND public.is_workspace_admin(t.workspace_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND public.is_workspace_admin(t.workspace_id)));

-- NOTES
CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  title text,
  body jsonb,
  body_text text,
  created_by uuid REFERENCES public.profiles(id),
  updated_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notes_select" ON public.notes;
CREATE POLICY "notes_select" ON public.notes FOR SELECT TO authenticated USING (public.can_access_client(client_id));
DROP POLICY IF EXISTS "notes_write" ON public.notes;
CREATE POLICY "notes_write" ON public.notes FOR ALL TO authenticated USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));

-- TAGS / TAGGINGS
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'topic',
  color text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tags_select" ON public.tags;
CREATE POLICY "tags_select" ON public.tags FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));
DROP POLICY IF EXISTS "tags_write" ON public.tags;
CREATE POLICY "tags_write" ON public.tags FOR ALL TO authenticated
  USING (public.workspace_role(workspace_id) IN ('admin','manager'))
  WITH CHECK (public.workspace_role(workspace_id) IN ('admin','manager'));

CREATE TABLE IF NOT EXISTS public.taggings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  taggable_type text NOT NULL,
  taggable_id uuid NOT NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.taggings TO authenticated;
GRANT ALL ON public.taggings TO service_role;
ALTER TABLE public.taggings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "taggings_select" ON public.taggings;
CREATE POLICY "taggings_select" ON public.taggings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tags t WHERE t.id = tag_id AND public.is_workspace_member(t.workspace_id)));
DROP POLICY IF EXISTS "taggings_write" ON public.taggings;
CREATE POLICY "taggings_write" ON public.taggings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tags t WHERE t.id = tag_id AND public.workspace_role(t.workspace_id) IN ('admin','manager')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tags t WHERE t.id = tag_id AND public.workspace_role(t.workspace_id) IN ('admin','manager')));

-- PLATFORM DOCUMENTS / ATTACHMENTS
CREATE TABLE IF NOT EXISTS public.platform_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_documents TO authenticated;
GRANT ALL ON public.platform_documents TO service_role;
ALTER TABLE public.platform_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pdocs_select" ON public.platform_documents;
CREATE POLICY "pdocs_select" ON public.platform_documents FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));
DROP POLICY IF EXISTS "pdocs_write" ON public.platform_documents;
CREATE POLICY "pdocs_write" ON public.platform_documents FOR ALL TO authenticated USING (public.is_workspace_member(workspace_id)) WITH CHECK (public.is_workspace_member(workspace_id));

CREATE TABLE IF NOT EXISTS public.attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.platform_documents(id) ON DELETE CASCADE,
  attachable_type text NOT NULL,
  attachable_id uuid NOT NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attachments TO authenticated;
GRANT ALL ON public.attachments TO service_role;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "att_select" ON public.attachments;
CREATE POLICY "att_select" ON public.attachments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.platform_documents d WHERE d.id = document_id AND public.is_workspace_member(d.workspace_id)));
DROP POLICY IF EXISTS "att_write" ON public.attachments;
CREATE POLICY "att_write" ON public.attachments FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.platform_documents d WHERE d.id = document_id AND public.is_workspace_member(d.workspace_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.platform_documents d WHERE d.id = document_id AND public.is_workspace_member(d.workspace_id)));

-- ACTIVITIES
CREATE TABLE IF NOT EXISTS public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id),
  verb text NOT NULL,
  target_type text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activities_select" ON public.activities;
CREATE POLICY "activities_select" ON public.activities FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text,
  body text,
  link_url text,
  entity_type text,
  entity_id uuid,
  actor_id uuid REFERENCES public.profiles(id),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notif_select_own" ON public.notifications;
CREATE POLICY "notif_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() AND public.is_workspace_member(workspace_id));
DROP POLICY IF EXISTS "notif_update_own" ON public.notifications;
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON public.tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status_id ON public.tasks(status_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_task_assignees_user_id ON public.task_assignees(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_client_created ON public.activities(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_taggings_taggable ON public.taggings(taggable_type, taggable_id);
CREATE INDEX IF NOT EXISTS idx_attachments_attachable ON public.attachments(attachable_type, attachable_id);

-- FUNCTIONS
CREATE OR REPLACE FUNCTION public.create_workspace_for_user(
  p_workspace_name text, p_user_id uuid, p_full_name text, p_email text
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_workspace_id uuid; v_slug text;
BEGIN
  v_slug := trim(both '-' from lower(regexp_replace(p_workspace_name, '[^a-zA-Z0-9]+', '-', 'g')));
  IF EXISTS (SELECT 1 FROM public.workspaces WHERE slug = v_slug) THEN
    v_slug := v_slug || '-' || substr(gen_random_uuid()::text, 1, 6);
  END IF;
  INSERT INTO public.workspaces (name, slug) VALUES (p_workspace_name, v_slug) RETURNING id INTO v_workspace_id;
  INSERT INTO public.profiles (id, full_name, email) VALUES (p_user_id, p_full_name, p_email) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.workspace_members (workspace_id, user_id, role, status) VALUES (v_workspace_id, p_user_id, 'admin', 'active');
  INSERT INTO public.task_statuses (workspace_id, name, category, color, position) VALUES
    (v_workspace_id, 'Not Started', 'todo', '#94a3b8', 0),
    (v_workspace_id, 'In Progress', 'active', '#3b82f6', 1),
    (v_workspace_id, 'Waiting', 'waiting', '#f59e0b', 2),
    (v_workspace_id, 'Completed', 'done', '#22c55e', 3),
    (v_workspace_id, 'Cancelled', 'cancelled', '#ef4444', 4);
  INSERT INTO public.tags (workspace_id, name, category, color) VALUES
    (v_workspace_id, 'Operations', 'service_line', '#6366f1'),
    (v_workspace_id, 'Recruitment', 'service_line', '#8b5cf6'),
    (v_workspace_id, 'Finance', 'service_line', '#06b6d4'),
    (v_workspace_id, 'M&A', 'service_line', '#f97316'),
    (v_workspace_id, 'Technology', 'service_line', '#84cc16'),
    (v_workspace_id, 'Accreditation', 'service_line', '#ec4899'),
    (v_workspace_id, 'Digital', 'service_line', '#14b8a6'),
    (v_workspace_id, 'Clinic Build', 'service_line', '#a855f7'),
    (v_workspace_id, 'Revenue Cycle', 'service_line', '#f43f5e');
  RETURN v_workspace_id;
END; $$;

CREATE OR REPLACE FUNCTION public.accept_pending_invites(p_user_id uuid, p_email text)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count integer;
BEGIN
  UPDATE public.workspace_members SET user_id = p_user_id, status = 'active'
  WHERE invited_email = p_email AND user_id IS NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END; $$;

GRANT EXECUTE ON FUNCTION public.create_workspace_for_user(text, uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_pending_invites(uuid, text) TO authenticated;

-- STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('platform-documents', 'platform-documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "pdocs_storage_select" ON storage.objects;
CREATE POLICY "pdocs_storage_select" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'platform-documents' AND public.is_workspace_member(((storage.foldername(name))[1])::uuid));
DROP POLICY IF EXISTS "pdocs_storage_insert" ON storage.objects;
CREATE POLICY "pdocs_storage_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'platform-documents' AND public.is_workspace_member(((storage.foldername(name))[1])::uuid));
DROP POLICY IF EXISTS "pdocs_storage_update" ON storage.objects;
CREATE POLICY "pdocs_storage_update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'platform-documents' AND public.is_workspace_member(((storage.foldername(name))[1])::uuid));
DROP POLICY IF EXISTS "pdocs_storage_delete" ON storage.objects;
CREATE POLICY "pdocs_storage_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'platform-documents' AND public.is_workspace_member(((storage.foldername(name))[1])::uuid));
