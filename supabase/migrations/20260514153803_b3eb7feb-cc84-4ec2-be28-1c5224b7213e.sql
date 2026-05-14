-- assessment_intakes: keep anon INSERT, lock authenticated to admin
DROP POLICY IF EXISTS "authenticated_select_intakes" ON public.assessment_intakes;
DROP POLICY IF EXISTS "authenticated_insert_intakes" ON public.assessment_intakes;
DROP POLICY IF EXISTS "authenticated_update_intakes" ON public.assessment_intakes;
DROP POLICY IF EXISTS "authenticated_delete_intakes" ON public.assessment_intakes;
CREATE POLICY "Admins manage assessment_intakes"
ON public.assessment_intakes FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- assessment_sessions: keep anon_insert_sessions, lock authenticated to admin
DROP POLICY IF EXISTS "authenticated_select_sessions" ON public.assessment_sessions;
DROP POLICY IF EXISTS "authenticated_insert_sessions" ON public.assessment_sessions;
DROP POLICY IF EXISTS "authenticated_update_sessions" ON public.assessment_sessions;
DROP POLICY IF EXISTS "authenticated_delete_sessions" ON public.assessment_sessions;
CREATE POLICY "Admins manage assessment_sessions"
ON public.assessment_sessions FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- internal_assessment_reports: admin only
DROP POLICY IF EXISTS "authenticated_select_internal_reports" ON public.internal_assessment_reports;
DROP POLICY IF EXISTS "authenticated_insert_internal_reports" ON public.internal_assessment_reports;
DROP POLICY IF EXISTS "authenticated_update_internal_reports" ON public.internal_assessment_reports;
DROP POLICY IF EXISTS "authenticated_delete_internal_reports" ON public.internal_assessment_reports;
CREATE POLICY "Admins manage internal_assessment_reports"
ON public.internal_assessment_reports FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- client_report_edits: admin only
DROP POLICY IF EXISTS "authenticated_select_client_report_edits" ON public.client_report_edits;
DROP POLICY IF EXISTS "authenticated_insert_client_report_edits" ON public.client_report_edits;
DROP POLICY IF EXISTS "authenticated_update_client_report_edits" ON public.client_report_edits;
DROP POLICY IF EXISTS "authenticated_delete_client_report_edits" ON public.client_report_edits;
CREATE POLICY "Admins manage client_report_edits"
ON public.client_report_edits FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- client_report_tokens: keep service_role, lock authenticated to admin.
-- Public read of reports continues via get_report_by_token() SECURITY DEFINER RPC.
DROP POLICY IF EXISTS "Authenticated can manage tokens" ON public.client_report_tokens;
CREATE POLICY "Admins manage client_report_tokens"
ON public.client_report_tokens FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- email_events: admin only
DROP POLICY IF EXISTS "authenticated_select_email_events" ON public.email_events;
DROP POLICY IF EXISTS "authenticated_insert_email_events" ON public.email_events;
DROP POLICY IF EXISTS "authenticated_update_email_events" ON public.email_events;
DROP POLICY IF EXISTS "authenticated_delete_email_events" ON public.email_events;
CREATE POLICY "Admins manage email_events"
ON public.email_events FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- contact_submissions: keep anon INSERT, lock authenticated to admin
DROP POLICY IF EXISTS "Authenticated can read contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated can delete contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins manage contact_submissions"
ON public.contact_submissions FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));