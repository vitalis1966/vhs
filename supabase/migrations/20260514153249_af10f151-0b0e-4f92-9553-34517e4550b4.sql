-- Restrict seo_global to admin role only (was: any authenticated user)
DROP POLICY IF EXISTS "Authenticated can delete seo_global" ON public.seo_global;
DROP POLICY IF EXISTS "Authenticated can insert seo_global" ON public.seo_global;
DROP POLICY IF EXISTS "Authenticated can update seo_global" ON public.seo_global;

CREATE POLICY "Admins manage seo_global"
ON public.seo_global
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict assessment_responses access to admin role only
-- (Anonymous submitters write via SECURITY DEFINER RPC upsert_response_by_token;
--  reads/edits go through admin UI and the get_report_by_token RPC.)
DROP POLICY IF EXISTS "authenticated_select_responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "authenticated_insert_responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "authenticated_update_responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "authenticated_delete_responses" ON public.assessment_responses;

CREATE POLICY "Admins manage assessment_responses"
ON public.assessment_responses
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));