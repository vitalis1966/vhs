
-- ============================================
-- TIME TRACKING SYSTEM — PHASE 1: SCHEMA
-- ============================================

-- Helper: admin OR manager
CREATE OR REPLACE FUNCTION public.is_workspace_admin_or_manager(wid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = wid AND user_id = auth.uid()
      AND status = 'active' AND role IN ('admin','manager')
  );
$$;

-- ============================================
-- time_activity_types
-- ============================================
CREATE TABLE public.time_activity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, name)
);
CREATE INDEX idx_tat_workspace ON public.time_activity_types(workspace_id, position);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_activity_types TO authenticated;
GRANT ALL ON public.time_activity_types TO service_role;

ALTER TABLE public.time_activity_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tat_select" ON public.time_activity_types FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));
CREATE POLICY "tat_write" ON public.time_activity_types FOR ALL TO authenticated
  USING (public.is_workspace_admin_or_manager(workspace_id))
  WITH CHECK (public.is_workspace_admin_or_manager(workspace_id));

CREATE TRIGGER trg_tat_updated BEFORE UPDATE ON public.time_activity_types
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed defaults for existing workspaces
INSERT INTO public.time_activity_types (workspace_id, name, position, is_default)
SELECT w.id, t.name, t.pos, (t.name = 'Strategy & Advisory')
FROM public.workspaces w
CROSS JOIN (VALUES
  ('Strategy & Advisory', 0),
  ('Operations', 1),
  ('People & HR', 2),
  ('Finance & Revenue', 3),
  ('Facility & Build', 4),
  ('Digital & Technology', 5),
  ('M&A & Transactions', 6),
  ('Admin & Coordination', 7),
  ('Meeting', 8),
  ('Travel', 9)
) AS t(name, pos);

-- Seed defaults when a new workspace is created
CREATE OR REPLACE FUNCTION public.seed_time_activity_types()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.time_activity_types (workspace_id, name, position, is_default)
  VALUES
    (NEW.id, 'Strategy & Advisory', 0, true),
    (NEW.id, 'Operations', 1, false),
    (NEW.id, 'People & HR', 2, false),
    (NEW.id, 'Finance & Revenue', 3, false),
    (NEW.id, 'Facility & Build', 4, false),
    (NEW.id, 'Digital & Technology', 5, false),
    (NEW.id, 'M&A & Transactions', 6, false),
    (NEW.id, 'Admin & Coordination', 7, false),
    (NEW.id, 'Meeting', 8, false),
    (NEW.id, 'Travel', 9, false);
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_seed_tat AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.seed_time_activity_types();

-- ============================================
-- time_entries
-- ============================================
CREATE TABLE public.time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  activity_type_id uuid NOT NULL REFERENCES public.time_activity_types(id) ON DELETE RESTRICT,
  description text,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  duration_seconds integer NOT NULL DEFAULT 0,
  is_manual boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_te_workspace_started ON public.time_entries(workspace_id, started_at DESC);
CREATE INDEX idx_te_user_started ON public.time_entries(user_id, started_at DESC);
CREATE INDEX idx_te_client_started ON public.time_entries(client_id, started_at DESC);
CREATE INDEX idx_te_activity ON public.time_entries(activity_type_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_entries TO authenticated;
GRANT ALL ON public.time_entries TO service_role;

ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "te_select" ON public.time_entries FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_workspace_admin_or_manager(workspace_id)
  );
CREATE POLICY "te_insert" ON public.time_entries FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.is_workspace_member(workspace_id)
  );
CREATE POLICY "te_update" ON public.time_entries FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_workspace_admin_or_manager(workspace_id))
  WITH CHECK (user_id = auth.uid() OR public.is_workspace_admin_or_manager(workspace_id));
CREATE POLICY "te_delete" ON public.time_entries FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_workspace_admin_or_manager(workspace_id));

CREATE TRIGGER trg_te_updated BEFORE UPDATE ON public.time_entries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-compute duration_seconds from start/end
CREATE OR REPLACE FUNCTION public.te_compute_duration()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.duration_seconds := GREATEST(0, EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::int);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_te_duration BEFORE INSERT OR UPDATE ON public.time_entries
  FOR EACH ROW EXECUTE FUNCTION public.te_compute_duration();

-- ============================================
-- time_entries_running (one per user)
-- ============================================
CREATE TABLE public.time_entries_running (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  activity_type_id uuid NOT NULL REFERENCES public.time_activity_types(id) ON DELETE RESTRICT,
  description text,
  started_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_entries_running TO authenticated;
GRANT ALL ON public.time_entries_running TO service_role;

ALTER TABLE public.time_entries_running ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ter_own" ON public.time_entries_running FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TRIGGER trg_ter_updated BEFORE UPDATE ON public.time_entries_running
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================
-- contracted_hours
-- ============================================
CREATE TABLE public.contracted_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  total_hours numeric(10,2) NOT NULL DEFAULT 0,
  period_start date,
  period_end date,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ch_client ON public.contracted_hours(client_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracted_hours TO authenticated;
GRANT ALL ON public.contracted_hours TO service_role;

ALTER TABLE public.contracted_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ch_select" ON public.contracted_hours FOR SELECT TO authenticated
  USING (public.can_access_client(client_id));
CREATE POLICY "ch_write" ON public.contracted_hours FOR ALL TO authenticated
  USING (public.is_workspace_admin_or_manager(workspace_id))
  WITH CHECK (public.is_workspace_admin_or_manager(workspace_id));

CREATE TRIGGER trg_ch_updated BEFORE UPDATE ON public.contracted_hours
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================
-- contracted_hours_by_activity
-- ============================================
CREATE TABLE public.contracted_hours_by_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contracted_hours_id uuid NOT NULL REFERENCES public.contracted_hours(id) ON DELETE CASCADE,
  activity_type_id uuid NOT NULL REFERENCES public.time_activity_types(id) ON DELETE CASCADE,
  allocated_hours numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contracted_hours_id, activity_type_id)
);
CREATE INDEX idx_cha_ch ON public.contracted_hours_by_activity(contracted_hours_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracted_hours_by_activity TO authenticated;
GRANT ALL ON public.contracted_hours_by_activity TO service_role;

ALTER TABLE public.contracted_hours_by_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cha_select" ON public.contracted_hours_by_activity FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.contracted_hours ch
    WHERE ch.id = contracted_hours_id AND public.can_access_client(ch.client_id)
  ));
CREATE POLICY "cha_write" ON public.contracted_hours_by_activity FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.contracted_hours ch
    WHERE ch.id = contracted_hours_id AND public.is_workspace_admin_or_manager(ch.workspace_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.contracted_hours ch
    WHERE ch.id = contracted_hours_id AND public.is_workspace_admin_or_manager(ch.workspace_id)
  ));

-- ============================================
-- time_tracking_settings (per user, per workspace)
-- ============================================
CREATE TABLE public.time_tracking_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  rounding_minutes integer NOT NULL DEFAULT 0,
  reminder_time time,
  reminder_enabled boolean NOT NULL DEFAULT false,
  show_widget boolean NOT NULL DEFAULT true,
  show_decimal boolean NOT NULL DEFAULT true,
  default_activity_type_id uuid REFERENCES public.time_activity_types(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, workspace_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_tracking_settings TO authenticated;
GRANT ALL ON public.time_tracking_settings TO service_role;

ALTER TABLE public.time_tracking_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tts_own" ON public.time_tracking_settings FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TRIGGER trg_tts_updated BEFORE UPDATE ON public.time_tracking_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================
-- client_budget_alerts_sent (dedupe)
-- ============================================
CREATE TABLE public.client_budget_alerts_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  contracted_hours_id uuid NOT NULL REFERENCES public.contracted_hours(id) ON DELETE CASCADE,
  activity_type_id uuid REFERENCES public.time_activity_types(id) ON DELETE CASCADE,
  threshold integer NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contracted_hours_id, activity_type_id, threshold)
);
CREATE INDEX idx_cbas_client ON public.client_budget_alerts_sent(client_id);

GRANT SELECT ON public.client_budget_alerts_sent TO authenticated;
GRANT ALL ON public.client_budget_alerts_sent TO service_role;

ALTER TABLE public.client_budget_alerts_sent ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cbas_select" ON public.client_budget_alerts_sent FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.contracted_hours ch
    WHERE ch.id = contracted_hours_id AND public.is_workspace_admin_or_manager(ch.workspace_id)
  ));

-- ============================================
-- Helper RPC: workspace + activity summary for client
-- ============================================
CREATE OR REPLACE FUNCTION public.get_client_time_summary(p_client_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_total_used numeric;
  v_by_activity jsonb;
BEGIN
  IF NOT public.can_access_client(p_client_id) THEN
    RETURN NULL;
  END IF;
  SELECT COALESCE(SUM(duration_seconds),0)/3600.0 INTO v_total_used
  FROM public.time_entries WHERE client_id = p_client_id;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'activity_type_id', activity_type_id,
    'used_hours', used
  )), '[]'::jsonb) INTO v_by_activity
  FROM (
    SELECT activity_type_id, SUM(duration_seconds)/3600.0 AS used
    FROM public.time_entries WHERE client_id = p_client_id
    GROUP BY activity_type_id
  ) s;

  RETURN jsonb_build_object('total_used_hours', v_total_used, 'by_activity', v_by_activity);
END; $$;
