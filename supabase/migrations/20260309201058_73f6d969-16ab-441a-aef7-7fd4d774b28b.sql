
-- Internal assessment reports table
CREATE TABLE public.internal_assessment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  executive_summary text,
  overall_score numeric,
  readiness_category text,
  analysis_status text NOT NULL DEFAULT 'pending',
  analysis_data jsonb DEFAULT '{}'::jsonb,
  analysis_version integer NOT NULL DEFAULT 1,
  last_analysis_run timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(session_id)
);

ALTER TABLE public.internal_assessment_reports ENABLE ROW LEVEL SECURITY;

-- Admin-only policies (using anon for now since no auth system yet, but scoped)
CREATE POLICY "anon_select_internal_reports" ON public.internal_assessment_reports FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_internal_reports" ON public.internal_assessment_reports FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_internal_reports" ON public.internal_assessment_reports FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_internal_reports" ON public.internal_assessment_reports FOR DELETE TO anon USING (true);
