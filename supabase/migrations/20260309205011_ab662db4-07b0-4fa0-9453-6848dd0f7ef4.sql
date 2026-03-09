
-- Allow authenticated users to SELECT on tables used by the admin submissions dashboard

CREATE POLICY "authenticated_select_sessions"
ON public.assessment_sessions FOR SELECT TO authenticated
USING (true);

CREATE POLICY "authenticated_select_assessments"
ON public.assessments FOR SELECT TO authenticated
USING (true);

CREATE POLICY "authenticated_select_intakes"
ON public.assessment_intakes FOR SELECT TO authenticated
USING (true);

CREATE POLICY "authenticated_select_internal_reports"
ON public.internal_assessment_reports FOR SELECT TO authenticated
USING (true);

CREATE POLICY "authenticated_select_email_events"
ON public.email_events FOR SELECT TO authenticated
USING (true);
