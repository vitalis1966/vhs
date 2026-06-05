
-- 1) Extend client-level contracted_hours with cadence + rollover
ALTER TABLE public.contracted_hours
  ADD COLUMN IF NOT EXISTS cadence text NOT NULL DEFAULT 'one_time',
  ADD COLUMN IF NOT EXISTS rollover_unused boolean NOT NULL DEFAULT false;

ALTER TABLE public.contracted_hours
  DROP CONSTRAINT IF EXISTS contracted_hours_cadence_check;
ALTER TABLE public.contracted_hours
  ADD CONSTRAINT contracted_hours_cadence_check CHECK (cadence IN ('monthly','one_time'));

-- 2) Project-level contracted hours
CREATE TABLE IF NOT EXISTS public.project_contracted_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  project_id uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  total_hours numeric NOT NULL DEFAULT 0,
  cadence text NOT NULL DEFAULT 'one_time' CHECK (cadence IN ('monthly','one_time')),
  rollover_unused boolean NOT NULL DEFAULT false,
  period_start date,
  period_end date,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_contracted_hours TO authenticated;
GRANT ALL ON public.project_contracted_hours TO service_role;
ALTER TABLE public.project_contracted_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pch_read" ON public.project_contracted_hours FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.can_access_client(p.client_id)));
CREATE POLICY "pch_write" ON public.project_contracted_hours FOR ALL TO authenticated
  USING (public.is_workspace_admin_or_manager(workspace_id))
  WITH CHECK (public.is_workspace_admin_or_manager(workspace_id));

CREATE TRIGGER project_contracted_hours_touch BEFORE UPDATE ON public.project_contracted_hours
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE IF NOT EXISTS public.project_contracted_hours_by_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_contracted_hours_id uuid NOT NULL REFERENCES public.project_contracted_hours(id) ON DELETE CASCADE,
  activity_type_id uuid NOT NULL,
  allocated_hours numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_contracted_hours_id, activity_type_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_contracted_hours_by_activity TO authenticated;
GRANT ALL ON public.project_contracted_hours_by_activity TO service_role;
ALTER TABLE public.project_contracted_hours_by_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pcha_read" ON public.project_contracted_hours_by_activity FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.project_contracted_hours pch JOIN public.projects p ON p.id = pch.project_id
    WHERE pch.id = project_contracted_hours_id AND public.can_access_client(p.client_id)
  ));
CREATE POLICY "pcha_write" ON public.project_contracted_hours_by_activity FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.project_contracted_hours pch
    WHERE pch.id = project_contracted_hours_id AND public.is_workspace_admin_or_manager(pch.workspace_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.project_contracted_hours pch
    WHERE pch.id = project_contracted_hours_id AND public.is_workspace_admin_or_manager(pch.workspace_id)
  ));

-- 3) Windowed usage RPCs
CREATE OR REPLACE FUNCTION public.get_client_time_summary_window(
  p_client_id uuid, p_start timestamptz, p_end timestamptz
) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_total numeric; v_by jsonb;
BEGIN
  IF NOT public.can_access_client(p_client_id) THEN RETURN NULL; END IF;
  SELECT COALESCE(SUM(duration_seconds),0)/3600.0 INTO v_total
  FROM public.time_entries
  WHERE client_id = p_client_id
    AND (p_start IS NULL OR started_at >= p_start)
    AND (p_end IS NULL OR started_at < p_end);
  SELECT COALESCE(jsonb_agg(jsonb_build_object('activity_type_id', activity_type_id, 'used_hours', used)), '[]'::jsonb)
  INTO v_by FROM (
    SELECT activity_type_id, SUM(duration_seconds)/3600.0 AS used
    FROM public.time_entries
    WHERE client_id = p_client_id
      AND (p_start IS NULL OR started_at >= p_start)
      AND (p_end IS NULL OR started_at < p_end)
    GROUP BY activity_type_id
  ) s;
  RETURN jsonb_build_object('total_used_hours', v_total, 'by_activity', v_by);
END; $$;

CREATE OR REPLACE FUNCTION public.get_project_time_summary_window(
  p_project_id uuid, p_start timestamptz, p_end timestamptz
) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_cid uuid; v_total numeric; v_by jsonb;
BEGIN
  SELECT client_id INTO v_cid FROM public.projects WHERE id = p_project_id;
  IF v_cid IS NULL OR NOT public.can_access_client(v_cid) THEN RETURN NULL; END IF;
  SELECT COALESCE(SUM(duration_seconds),0)/3600.0 INTO v_total
  FROM public.time_entries
  WHERE project_id = p_project_id
    AND (p_start IS NULL OR started_at >= p_start)
    AND (p_end IS NULL OR started_at < p_end);
  SELECT COALESCE(jsonb_agg(jsonb_build_object('activity_type_id', activity_type_id, 'used_hours', used)), '[]'::jsonb)
  INTO v_by FROM (
    SELECT activity_type_id, SUM(duration_seconds)/3600.0 AS used
    FROM public.time_entries
    WHERE project_id = p_project_id
      AND (p_start IS NULL OR started_at >= p_start)
      AND (p_end IS NULL OR started_at < p_end)
    GROUP BY activity_type_id
  ) s;
  RETURN jsonb_build_object('total_used_hours', v_total, 'by_activity', v_by);
END; $$;
