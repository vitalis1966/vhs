import { jsxs, jsx } from "react/jsx-runtime";
import { Head } from "vite-react-ssg";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-B5yO-kwf.js";
import { u as usePageSEOFallback } from "./PageSEOContext-DZ23I7UH.js";
import { useLocation } from "react-router";
function usePageSEO() {
  const { fallback } = usePageSEOFallback();
  const { pathname } = useLocation();
  const route = pathname.replace(/\/$/, "").toLowerCase() || "/";
  const { data: pageSEO } = useQuery({
    queryKey: ["seo-page", route],
    queryFn: async () => {
      const { data } = await supabase.from("seo_pages").select("*").eq("route", route).eq("is_active", true).single();
      return data;
    },
    staleTime: 5 * 60 * 1e3,
    gcTime: 10 * 60 * 1e3
  });
  const { data: globalSEO } = useQuery({
    queryKey: ["seo-global"],
    queryFn: async () => {
      const { data } = await supabase.from("seo_global").select("*").eq("id", 1).single();
      return data;
    },
    staleTime: 5 * 60 * 1e3,
    gcTime: 10 * 60 * 1e3
  });
  const { data: globalSchemas } = useQuery({
    queryKey: ["seo-schema-global"],
    queryFn: async () => {
      const { data } = await supabase.from("seo_schema_global").select("*").eq("is_active", true);
      return data || [];
    },
    staleTime: 5 * 60 * 1e3,
    gcTime: 10 * 60 * 1e3
  });
  const SITE_URL = globalSEO?.site_url || "https://www.vitalisstrategies.com";
  const canonicalPath = route === "/" ? "" : route;
  const canonical = pageSEO?.canonical_override || `${SITE_URL}${canonicalPath}`;
  const resolved = {
    title: pageSEO?.title || fallback.title || globalSEO?.default_title || "Vitalis Health Strategies",
    description: pageSEO?.description || fallback.description || globalSEO?.default_description || "",
    keywords: pageSEO?.keywords || "",
    robots: pageSEO?.noindex ? "noindex, follow" : pageSEO?.robots || globalSEO?.default_robots || "index, follow",
    canonical,
    ogTitle: pageSEO?.og_title || pageSEO?.title || fallback.title || globalSEO?.default_title || "",
    ogDescription: pageSEO?.og_description || pageSEO?.description || fallback.description || "",
    ogImage: `${SITE_URL}${pageSEO?.og_image || fallback.ogImage || globalSEO?.default_og_image || "/og-default.jpg"}`,
    ogImageAlt: pageSEO?.og_image_alt || pageSEO?.title || "",
    ogImageWidth: pageSEO?.og_image_width || "1200",
    ogImageHeight: pageSEO?.og_image_height || "630",
    ogType: pageSEO?.og_type || "website",
    twitterCard: pageSEO?.twitter_card || "summary_large_image",
    twitterTitle: pageSEO?.twitter_title || pageSEO?.og_title || pageSEO?.title || fallback.title || "",
    twitterDescription: pageSEO?.twitter_description || pageSEO?.og_description || pageSEO?.description || fallback.description || "",
    twitterImage: `${SITE_URL}${pageSEO?.twitter_image || pageSEO?.og_image || fallback.ogImage || globalSEO?.default_og_image || "/og-default.jpg"}`,
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
    pinterestVerification: globalSEO?.pinterest_verification || ""
  };
  return { resolved, pageSEO, globalSEO, globalSchemas, route };
}
function useGlobalScripts() {
  const { data } = useQuery({
    queryKey: ["seo-global-scripts"],
    queryFn: async () => {
      const { data: data2 } = await supabase.from("seo_global").select("google_analytics_id, google_tag_manager_id, google_tag_manager_head, google_tag_manager_body, google_ads_id, google_ads_conversion_label, meta_pixel_id, linkedin_partner_id, hotjar_id, intercom_app_id, crisp_website_id, custom_head_script, custom_body_script").eq("id", 1).single();
      return data2;
    },
    staleTime: 10 * 60 * 1e3
  });
  return data;
}
function SEOHead() {
  const { resolved, route } = usePageSEO();
  const r = resolved;
  const buildPageSchema = () => {
    if (r.schemaJson) return r.schemaJson;
    const base = {
      "@context": "https://schema.org",
      "@type": r.schemaType,
      url: `${r.siteUrl}${route === "/" ? "" : route}`,
      name: r.title,
      description: r.description,
      isPartOf: { "@id": `${r.siteUrl}/#website` },
      inLanguage: "en-CA"
    };
    if (r.schemaType === "Service") {
      base.provider = { "@id": `${r.siteUrl}/#organization` };
      base.areaServed = { "@type": "Country", name: "Canada" };
      base.offers = { "@type": "Offer", availability: "https://schema.org/InStock" };
    }
    if (r.breadcrumbs && Array.isArray(r.breadcrumbs) && r.breadcrumbs.length > 0) {
      base.breadcrumb = {
        "@type": "BreadcrumbList",
        itemListElement: r.breadcrumbs.map((b) => ({
          "@type": "ListItem",
          position: b.position,
          name: b.name,
          item: `${r.siteUrl}${b.item}`
        }))
      };
    }
    if (r.ogType === "article") {
      base["@type"] = "Article";
      base.author = { "@type": "Organization", name: r.articleAuthor || r.siteName };
      base.publisher = { "@id": `${r.siteUrl}/#organization` };
      if (r.articlePublished) base.datePublished = r.articlePublished;
      if (r.articleModified) base.dateModified = r.articleModified;
      if (r.articleSection) base.articleSection = r.articleSection;
      if (r.articleTags?.length) base.keywords = r.articleTags.join(", ");
    }
    return base;
  };
  return /* @__PURE__ */ jsxs(Head, { children: [
    /* @__PURE__ */ jsx("meta", { charSet: "UTF-8" }),
    /* @__PURE__ */ jsx("meta", { httpEquiv: "X-UA-Compatible", content: "IE=edge" }),
    /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
    /* @__PURE__ */ jsx("meta", { name: "theme-color", content: r.themeColor }),
    /* @__PURE__ */ jsx("meta", { name: "color-scheme", content: "light" }),
    /* @__PURE__ */ jsx("meta", { name: "msapplication-TileColor", content: r.themeColor }),
    /* @__PURE__ */ jsx("meta", { name: "msapplication-config", content: "/browserconfig.xml" }),
    /* @__PURE__ */ jsx("title", { children: r.title }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: r.description }),
    r.keywords && /* @__PURE__ */ jsx("meta", { name: "keywords", content: r.keywords }),
    /* @__PURE__ */ jsx("meta", { name: "author", content: r.siteName }),
    /* @__PURE__ */ jsx("meta", { name: "robots", content: r.robots }),
    /* @__PURE__ */ jsx("meta", { name: "language", content: "en-CA" }),
    /* @__PURE__ */ jsx("meta", { name: "revisit-after", content: "7 days" }),
    /* @__PURE__ */ jsx("meta", { name: "rating", content: "general" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.region", content: "CA-AB" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.placename", content: "Calgary, Alberta, Canada" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.position", content: "51.0447;-114.0719" }),
    /* @__PURE__ */ jsx("meta", { name: "ICBM", content: "51.0447, -114.0719" }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: r.canonical }),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "en-ca", href: r.canonical }),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "en", href: r.canonical }),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "x-default", href: r.canonical }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: r.siteName }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: r.siteLocale }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: r.ogType }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: r.ogTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: r.ogDescription }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: r.canonical }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: r.ogImage }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:secure_url", content: r.ogImage }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:type", content: "image/jpeg" }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: r.ogImageWidth }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: r.ogImageHeight }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:alt", content: r.ogImageAlt }),
    r.facebookAppId && /* @__PURE__ */ jsx("meta", { property: "fb:app_id", content: r.facebookAppId }),
    r.ogType === "article" && r.articlePublished && /* @__PURE__ */ jsx("meta", { property: "article:published_time", content: r.articlePublished }),
    r.ogType === "article" && r.articleModified && /* @__PURE__ */ jsx("meta", { property: "article:modified_time", content: r.articleModified }),
    r.ogType === "article" && r.articleSection && /* @__PURE__ */ jsx("meta", { property: "article:section", content: r.articleSection }),
    r.ogType === "article" && r.articleTags?.map((tag) => /* @__PURE__ */ jsx("meta", { property: "article:tag", content: tag }, tag)),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: r.twitterCard }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:domain", content: "vitalisstrategies.com" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:url", content: r.canonical }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: r.twitterTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: r.twitterDescription }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: r.twitterImage }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image:alt", content: r.twitterImageAlt }),
    r.twitterHandle && /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: r.twitterHandle }),
    r.twitterHandle && /* @__PURE__ */ jsx("meta", { name: "twitter:creator", content: r.twitterHandle }),
    r.googleSearchConsole && /* @__PURE__ */ jsx("meta", { name: "google-site-verification", content: r.googleSearchConsole }),
    r.bingVerification && /* @__PURE__ */ jsx("meta", { name: "msvalidate.01", content: r.bingVerification }),
    r.pinterestVerification && /* @__PURE__ */ jsx("meta", { name: "p:domain_verify", content: r.pinterestVerification }),
    /* @__PURE__ */ jsx("link", { rel: "icon", href: "/favicon.ico", sizes: "any" }),
    /* @__PURE__ */ jsx("link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }),
    /* @__PURE__ */ jsx("link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" }),
    /* @__PURE__ */ jsx("link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" }),
    /* @__PURE__ */ jsx("link", { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" }),
    /* @__PURE__ */ jsx("link", { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }),
    /* @__PURE__ */ jsx("link", { rel: "apple-touch-icon", sizes: "152x152", href: "/apple-touch-icon-152x152.png" }),
    /* @__PURE__ */ jsx("link", { rel: "apple-touch-icon", sizes: "120x120", href: "/apple-touch-icon-120x120.png" }),
    /* @__PURE__ */ jsx("link", { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#1C3D2E" }),
    /* @__PURE__ */ jsx("link", { rel: "shortcut icon", href: "/favicon.ico" }),
    /* @__PURE__ */ jsx("link", { rel: "manifest", href: "/site.webmanifest" }),
    /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
    /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }),
    /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://ilbhphreyvaoomhpvaxi.supabase.co", crossOrigin: "anonymous" }),
    /* @__PURE__ */ jsx("link", { rel: "dns-prefetch", href: "https://www.google-analytics.com" }),
    /* @__PURE__ */ jsx("link", { rel: "dns-prefetch", href: "https://www.googletagmanager.com" }),
    /* @__PURE__ */ jsx("link", { rel: "dns-prefetch", href: "https://connect.facebook.net" }),
    /* @__PURE__ */ jsx("link", { rel: "dns-prefetch", href: "https://snap.licdn.com" }),
    /* @__PURE__ */ jsx("link", { rel: "preload", href: "/vitalis-logo.webp", as: "image", type: "image/webp" }),
    r.globalSchemas.map((schema) => /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(schema.schema_json) }, schema.id)),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(buildPageSchema()) })
  ] });
}
export {
  SEOHead as S,
  useGlobalScripts as u
};
