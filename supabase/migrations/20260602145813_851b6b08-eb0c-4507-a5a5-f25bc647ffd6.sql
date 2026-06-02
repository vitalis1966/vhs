
-- Restrict assessment_reminders writes to admins
DROP POLICY IF EXISTS authenticated_select_reminders ON public.assessment_reminders;
DROP POLICY IF EXISTS authenticated_insert_reminders ON public.assessment_reminders;
DROP POLICY IF EXISTS authenticated_update_reminders ON public.assessment_reminders;
DROP POLICY IF EXISTS authenticated_delete_reminders ON public.assessment_reminders;
CREATE POLICY admins_manage_reminders ON public.assessment_reminders
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict insights_articles writes to admins (keep authenticated SELECT for preview)
DROP POLICY IF EXISTS authenticated_insert_articles ON public.insights_articles;
DROP POLICY IF EXISTS authenticated_update_articles ON public.insights_articles;
DROP POLICY IF EXISTS authenticated_delete_articles ON public.insights_articles;
CREATE POLICY admins_insert_articles ON public.insights_articles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_update_articles ON public.insights_articles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_delete_articles ON public.insights_articles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict seo_pages writes to admins
DROP POLICY IF EXISTS authenticated_insert_seo_pages ON public.seo_pages;
DROP POLICY IF EXISTS authenticated_update_seo_pages ON public.seo_pages;
DROP POLICY IF EXISTS authenticated_delete_seo_pages ON public.seo_pages;
DROP POLICY IF EXISTS authenticated_manage_seo_pages ON public.seo_pages;
DROP POLICY IF EXISTS "Authenticated full access seo_pages" ON public.seo_pages;
CREATE POLICY admins_insert_seo_pages ON public.seo_pages
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_update_seo_pages ON public.seo_pages
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_delete_seo_pages ON public.seo_pages
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict seo_redirects writes to admins
DROP POLICY IF EXISTS authenticated_insert_seo_redirects ON public.seo_redirects;
DROP POLICY IF EXISTS authenticated_update_seo_redirects ON public.seo_redirects;
DROP POLICY IF EXISTS authenticated_delete_seo_redirects ON public.seo_redirects;
DROP POLICY IF EXISTS authenticated_manage_seo_redirects ON public.seo_redirects;
DROP POLICY IF EXISTS "Authenticated full access seo_redirects" ON public.seo_redirects;
CREATE POLICY admins_insert_seo_redirects ON public.seo_redirects
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_update_seo_redirects ON public.seo_redirects
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_delete_seo_redirects ON public.seo_redirects
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict seo_schema_global writes to admins
DROP POLICY IF EXISTS authenticated_insert_seo_schema_global ON public.seo_schema_global;
DROP POLICY IF EXISTS authenticated_update_seo_schema_global ON public.seo_schema_global;
DROP POLICY IF EXISTS authenticated_delete_seo_schema_global ON public.seo_schema_global;
DROP POLICY IF EXISTS authenticated_manage_seo_schema_global ON public.seo_schema_global;
DROP POLICY IF EXISTS "Authenticated full access seo_schema_global" ON public.seo_schema_global;
CREATE POLICY admins_insert_seo_schema_global ON public.seo_schema_global
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_update_seo_schema_global ON public.seo_schema_global
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY admins_delete_seo_schema_global ON public.seo_schema_global
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Restrict listing of public workspace-logos bucket: allow SELECT only via known paths (no listing).
-- Drop overly-broad list/select policies; signed URLs and direct path reads still work.
DROP POLICY IF EXISTS "Public read workspace-logos" ON storage.objects;
DROP POLICY IF EXISTS "workspace_logos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "Public access workspace-logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view workspace logos" ON storage.objects;
