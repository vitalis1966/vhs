import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SEOPageData {
  id: string;
  route: string;
  page_label: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  robots: string | null;
  noindex: boolean | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_image_alt: string | null;
  og_image_width: string | null;
  og_image_height: string | null;
  og_type: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  twitter_image_alt: string | null;
  twitter_card: string | null;
  canonical_override: string | null;
  article_author: string | null;
  article_published: string | null;
  article_modified: string | null;
  article_section: string | null;
  article_tags: string[] | null;
  schema_type: string | null;
  schema_json: Record<string, unknown> | null;
  breadcrumbs: Array<{ position: number; name: string; item: string }> | null;
  is_active: boolean | null;
}

export interface SEOGlobalData {
  site_name: string | null;
  site_url: string | null;
  site_locale: string | null;
  default_og_image: string | null;
  theme_color: string | null;
  default_title: string | null;
  default_description: string | null;
  default_robots: string | null;
  twitter_handle: string | null;
  facebook_page_url: string | null;
  facebook_app_id: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  google_analytics_id: string | null;
  google_tag_manager_id: string | null;
  google_search_console: string | null;
  google_ads_id: string | null;
  google_ads_conversion_label: string | null;
  bing_verification: string | null;
  pinterest_verification: string | null;
  meta_pixel_id: string | null;
  linkedin_partner_id: string | null;
  hotjar_id: string | null;
  intercom_app_id: string | null;
  crisp_website_id: string | null;
  custom_head_script: string | null;
  custom_body_script: string | null;
}

export interface SEOSchemaGlobal {
  id: string;
  label: string;
  schema_json: Record<string, unknown>;
  is_active: boolean | null;
}

export function useSEOPage(route: string) {
  return useQuery({
    queryKey: ["seo-page", route],
    queryFn: async (): Promise<SEOPageData | null> => {
      const { data, error } = await supabase
        .from("seo_pages")
        .select("*")
        .eq("route", route)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data as SEOPageData | null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSEOGlobal() {
  return useQuery({
    queryKey: ["seo-global"],
    queryFn: async (): Promise<SEOGlobalData | null> => {
      const { data, error } = await supabase
        .from("seo_global")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data as SEOGlobalData | null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSEOSchemas() {
  return useQuery({
    queryKey: ["seo-schemas-global"],
    queryFn: async (): Promise<SEOSchemaGlobal[]> => {
      const { data, error } = await supabase
        .from("seo_schema_global")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return (data ?? []) as SEOSchemaGlobal[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
