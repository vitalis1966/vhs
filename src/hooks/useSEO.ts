import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function usePageSEO() {
  const { pathname } = useLocation();

  // Normalize path: strip trailing slash, lowercase
  const route = pathname.replace(/\/$/, "").toLowerCase() || "/";

  const { data: pageSEO } = useQuery({
    queryKey: ["seo-page", route],
    queryFn: async () => {
      const { data } = await supabase
        .from("seo_pages")
        .select("*")
        .eq("route", route)
        .eq("is_active", true)
        .single();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: globalSEO } = useQuery({
    queryKey: ["seo-global"],
    queryFn: async () => {
      const { data } = await supabase
        .from("seo_global")
        .select("*")
        .eq("id", 1)
        .single();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: globalSchemas } = useQuery({
    queryKey: ["seo-schema-global"],
    queryFn: async () => {
      const { data } = await supabase
        .from("seo_schema_global")
        .select("*")
        .eq("is_active", true);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const SITE_URL = globalSEO?.site_url || "https://www.vitalisstrategies.com";
  const canonicalPath = route === "/" ? "" : route;
  const canonical = pageSEO?.canonical_override || `${SITE_URL}${canonicalPath}`;

  // Resolve with fallbacks: page → global → hardcoded default
  const resolved = {
    title: pageSEO?.title || globalSEO?.default_title || "Vitalis Health Strategies",
    description: pageSEO?.description || globalSEO?.default_description || "",
    keywords: pageSEO?.keywords || "",
    robots: pageSEO?.noindex ? "noindex, follow" : (pageSEO?.robots || globalSEO?.default_robots || "index, follow"),
    canonical,
    ogTitle: pageSEO?.og_title || pageSEO?.title || globalSEO?.default_title || "",
    ogDescription: pageSEO?.og_description || pageSEO?.description || "",
    ogImage: `${SITE_URL}${pageSEO?.og_image || globalSEO?.default_og_image || "/og-default.jpg"}`,
    ogImageAlt: pageSEO?.og_image_alt || pageSEO?.title || "",
    ogImageWidth: pageSEO?.og_image_width || "1200",
    ogImageHeight: pageSEO?.og_image_height || "630",
    ogType: pageSEO?.og_type || "website",
    twitterCard: pageSEO?.twitter_card || "summary_large_image",
    twitterTitle: pageSEO?.twitter_title || pageSEO?.og_title || pageSEO?.title || "",
    twitterDescription: pageSEO?.twitter_description || pageSEO?.og_description || pageSEO?.description || "",
    twitterImage: `${SITE_URL}${pageSEO?.twitter_image || pageSEO?.og_image || globalSEO?.default_og_image || "/og-default.jpg"}`,
    twitterImageAlt: pageSEO?.twitter_image_alt || pageSEO?.og_image_alt || "",
    twitterHandle: globalSEO?.twitter_handle || "",
    facebookAppId: globalSEO?.facebook_app_id || "",
    siteName: globalSEO?.site_name || "Vitalis Health Strategies",
    siteLocale: globalSEO?.site_locale || "en_CA",
    themeColor: globalSEO?.theme_color || "#1C3D2E",
    siteUrl: SITE_URL,
    schemaType: pageSEO?.schema_type || "WebPage",
    schemaJson: pageSEO?.schema_json || null,
    breadcrumbs: pageSEO?.breadcrumbs || null,
    articleAuthor: pageSEO?.article_author || "",
    articlePublished: pageSEO?.article_published || "",
    articleModified: pageSEO?.article_modified || "",
    articleSection: pageSEO?.article_section || "",
    articleTags: pageSEO?.article_tags || [],
    globalSchemas: globalSchemas || [],
    // Verifications
    googleSearchConsole: globalSEO?.google_search_console || "",
    bingVerification: globalSEO?.bing_verification || "",
    pinterestVerification: globalSEO?.pinterest_verification || "",
  };

  return { resolved, pageSEO, globalSEO, globalSchemas, route };
}

export function useGlobalScripts() {
  const { data } = useQuery({
    queryKey: ["seo-global-scripts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("seo_global")
        .select("google_analytics_id, google_tag_manager_id, google_tag_manager_head, google_tag_manager_body, google_ads_id, google_ads_conversion_label, meta_pixel_id, linkedin_partner_id, hotjar_id, intercom_app_id, crisp_website_id, custom_head_script, custom_body_script")
        .eq("id", 1)
        .single();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
  return data;
}
