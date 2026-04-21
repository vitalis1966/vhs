
-- Restrict seo_global table reads to authenticated users (admins) only.
-- Public site reads happen via a SECURITY DEFINER RPC that returns only safe public fields.

DROP POLICY IF EXISTS "Public can read seo_global" ON public.seo_global;

-- Public-safe read RPC: returns only fields needed for rendering meta tags + tracking on the public site.
-- Note: GA/GTM/Pixel IDs are public by nature (they render in HTML head); this RPC formalizes the surface area.
CREATE OR REPLACE FUNCTION public.get_public_seo_global()
RETURNS TABLE (
  id integer,
  site_name text,
  site_url text,
  site_locale text,
  default_title text,
  default_description text,
  default_robots text,
  default_og_image text,
  theme_color text,
  twitter_handle text,
  facebook_app_id text,
  facebook_page_url text,
  linkedin_url text,
  instagram_url text,
  google_analytics_id text,
  google_tag_manager_id text,
  google_tag_manager_head text,
  google_tag_manager_body text,
  google_ads_id text,
  google_ads_conversion_label text,
  google_search_console text,
  bing_verification text,
  pinterest_verification text,
  meta_pixel_id text,
  linkedin_partner_id text,
  hotjar_id text,
  intercom_app_id text,
  crisp_website_id text,
  custom_head_script text,
  custom_body_script text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    id, site_name, site_url, site_locale,
    default_title, default_description, default_robots, default_og_image, theme_color,
    twitter_handle, facebook_app_id, facebook_page_url, linkedin_url, instagram_url,
    google_analytics_id, google_tag_manager_id, google_tag_manager_head, google_tag_manager_body,
    google_ads_id, google_ads_conversion_label,
    google_search_console, bing_verification, pinterest_verification,
    meta_pixel_id, linkedin_partner_id, hotjar_id, intercom_app_id, crisp_website_id,
    custom_head_script, custom_body_script
  FROM public.seo_global
  WHERE id = 1
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_seo_global() TO anon, authenticated;
