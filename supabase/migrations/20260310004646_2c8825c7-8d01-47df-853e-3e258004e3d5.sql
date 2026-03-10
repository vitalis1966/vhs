-- Allow authenticated users to INSERT/UPDATE on tables used by the assessment flow

CREATE POLICY "authenticated_insert_intakes"
ON public.assessment_intakes FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_intakes"
ON public.assessment_intakes FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_insert_sessions"
ON public.assessment_sessions FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_sessions"
ON public.assessment_sessions FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_insert_responses"
ON public.assessment_responses FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_responses"
ON public.assessment_responses FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_select_responses"
ON public.assessment_responses FOR SELECT TO authenticated
USING (true);

CREATE POLICY "authenticated_select_questions"
ON public.assessment_questions FOR SELECT TO authenticated
USING (true);

CREATE POLICY "authenticated_select_sections"
ON public.assessment_sections FOR SELECT TO authenticated
USING (true);

CREATE POLICY "authenticated_insert_reminders"
ON public.assessment_reminders FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_reminders"
ON public.assessment_reminders FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_select_reminders"
ON public.assessment_reminders FOR SELECT TO authenticated
USING (true);

CREATE POLICY "authenticated_insert_email_events"
ON public.email_events FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_email_events"
ON public.email_events FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_insert_internal_reports"
ON public.internal_assessment_reports FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_internal_reports"
ON public.internal_assessment_reports FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_internal_reports"
ON public.internal_assessment_reports FOR DELETE TO authenticated
USING (true);

CREATE POLICY "authenticated_manage_assessments_insert"
ON public.assessments FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_assessments"
ON public.assessments FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_assessments"
ON public.assessments FOR DELETE TO authenticated
USING (true);

CREATE POLICY "authenticated_manage_questions_insert"
ON public.assessment_questions FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_questions"
ON public.assessment_questions FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_questions"
ON public.assessment_questions FOR DELETE TO authenticated
USING (true);

CREATE POLICY "authenticated_manage_sections_insert"
ON public.assessment_sections FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update_sections"
ON public.assessment_sections FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_sections"
ON public.assessment_sections FOR DELETE TO authenticated
USING (true);