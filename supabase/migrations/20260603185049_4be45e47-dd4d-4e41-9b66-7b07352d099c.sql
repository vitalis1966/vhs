
-- activity_logs: drop broad authenticated INSERT
DROP POLICY IF EXISTS "Anyone authenticated can insert activity_logs" ON public.activity_logs;
CREATE POLICY "Admins insert activity_logs"
  ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- assessments
DROP POLICY IF EXISTS authenticated_delete_assessments ON public.assessments;
DROP POLICY IF EXISTS authenticated_manage_assessments_insert ON public.assessments;
DROP POLICY IF EXISTS authenticated_update_assessments ON public.assessments;
DROP POLICY IF EXISTS authenticated_select_assessments ON public.assessments;
CREATE POLICY admins_select_assessments ON public.assessments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_insert_assessments ON public.assessments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_update_assessments ON public.assessments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_delete_assessments ON public.assessments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- assessment_sections
DROP POLICY IF EXISTS authenticated_delete_sections ON public.assessment_sections;
DROP POLICY IF EXISTS authenticated_manage_sections_insert ON public.assessment_sections;
DROP POLICY IF EXISTS authenticated_update_sections ON public.assessment_sections;
DROP POLICY IF EXISTS authenticated_select_sections ON public.assessment_sections;
CREATE POLICY admins_select_sections ON public.assessment_sections FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_insert_sections ON public.assessment_sections FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_update_sections ON public.assessment_sections FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_delete_sections ON public.assessment_sections FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- assessment_questions
DROP POLICY IF EXISTS authenticated_delete_questions ON public.assessment_questions;
DROP POLICY IF EXISTS authenticated_manage_questions_insert ON public.assessment_questions;
DROP POLICY IF EXISTS authenticated_update_questions ON public.assessment_questions;
DROP POLICY IF EXISTS authenticated_select_questions ON public.assessment_questions;
CREATE POLICY admins_select_questions ON public.assessment_questions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_insert_questions ON public.assessment_questions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_update_questions ON public.assessment_questions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_delete_questions ON public.assessment_questions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- seo_pages
DROP POLICY IF EXISTS "Authenticated can delete seo_pages" ON public.seo_pages;
DROP POLICY IF EXISTS "Authenticated can insert seo_pages" ON public.seo_pages;
DROP POLICY IF EXISTS "Authenticated can update seo_pages" ON public.seo_pages;

-- seo_redirects
DROP POLICY IF EXISTS "Authenticated can delete seo_redirects" ON public.seo_redirects;
DROP POLICY IF EXISTS "Authenticated can insert seo_redirects" ON public.seo_redirects;
DROP POLICY IF EXISTS "Authenticated can update seo_redirects" ON public.seo_redirects;

-- seo_schema_global
DROP POLICY IF EXISTS "Authenticated can delete seo_schema_global" ON public.seo_schema_global;
DROP POLICY IF EXISTS "Authenticated can insert seo_schema_global" ON public.seo_schema_global;
DROP POLICY IF EXISTS "Authenticated can update seo_schema_global" ON public.seo_schema_global;

-- seo_social_links
DROP POLICY IF EXISTS "Authenticated manage seo_social_links" ON public.seo_social_links;
CREATE POLICY admins_insert_seo_social_links ON public.seo_social_links FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_update_seo_social_links ON public.seo_social_links FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_delete_seo_social_links ON public.seo_social_links FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- portfolio_cases
DROP POLICY IF EXISTS "Authenticated full access portfolio_cases" ON public.portfolio_cases;
CREATE POLICY admins_select_portfolio_cases ON public.portfolio_cases FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_insert_portfolio_cases ON public.portfolio_cases FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_update_portfolio_cases ON public.portfolio_cases FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_delete_portfolio_cases ON public.portfolio_cases FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
