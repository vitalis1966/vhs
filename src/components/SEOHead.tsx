import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useSEOPage, useSEOGlobal, useSEOSchemas } from "@/hooks/useSEO";

interface SEOHeadProps {
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function SEOHead({ fallbackTitle, fallbackDescription }: SEOHeadProps) {
  const { pathname } = useLocation();
  const { data: page } = useSEOPage(pathname);
  const { data: global } = useSEOGlobal();
  const { data: schemas } = useSEOSchemas();

  const siteUrl = global?.site_url || "https://www.vitalisstrategies.com";
  const siteName = global?.site_name || "Vitalis Health Strategies";

  const title = page?.title || fallbackTitle || global?.default_title || siteName;
  const description = page?.description || fallbackDescription || global?.default_description || "";
  const keywords = page?.keywords || "";
  const robots = page?.noindex ? "noindex, follow" : (page?.robots || global?.default_robots || "index, follow");
  const canonical = page?.canonical_override || `${siteUrl}${pathname}`;

  const ogTitle = page?.og_title || title;
  const ogDescription = page?.og_description || description;
  const ogImage = page?.og_image
    ? (page.og_image.startsWith("http") ? page.og_image : `${siteUrl}${page.og_image}`)
    : global?.default_og_image
      ? (global.default_og_image.startsWith("http") ? global.default_og_image : `${siteUrl}${global.default_og_image}`)
      : undefined;
  const ogType = page?.og_type || "website";

  const twitterCard = page?.twitter_card || "summary_large_image";
  const twitterTitle = page?.twitter_title || ogTitle;
  const twitterDescription = page?.twitter_description || ogDescription;
  const twitterImage = page?.twitter_image
    ? (page.twitter_image.startsWith("http") ? page.twitter_image : `${siteUrl}${page.twitter_image}`)
    : ogImage;

  // Build breadcrumb schema
  const breadcrumbSchema = page?.breadcrumbs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: page.breadcrumbs.map((b) => ({
          "@type": "ListItem",
          position: b.position,
          name: b.name,
          item: `${siteUrl}${b.item}`,
        })),
      }
    : null;

  // Build page-level schema
  const pageSchema = page?.schema_json || (page?.schema_type ? {
    "@context": "https://schema.org",
    "@type": page.schema_type,
    name: title,
    description,
    url: canonical,
  } : null);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={global?.site_locale || "en_CA"} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {page?.og_image_alt && <meta property="og:image:alt" content={page.og_image_alt} />}
      {page?.og_image_width && <meta property="og:image:width" content={page.og_image_width} />}
      {page?.og_image_height && <meta property="og:image:height" content={page.og_image_height} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      {global?.twitter_handle && <meta name="twitter:site" content={global.twitter_handle} />}
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      {page?.twitter_image_alt && <meta name="twitter:image:alt" content={page.twitter_image_alt} />}

      {/* Article meta */}
      {page?.article_author && <meta property="article:author" content={page.article_author} />}
      {page?.article_published && <meta property="article:published_time" content={page.article_published} />}
      {page?.article_modified && <meta property="article:modified_time" content={page.article_modified} />}
      {page?.article_section && <meta property="article:section" content={page.article_section} />}
      {page?.article_tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Verification tags */}
      {global?.google_search_console && <meta name="google-site-verification" content={global.google_search_console} />}
      {global?.bing_verification && <meta name="msvalidate.01" content={global.bing_verification} />}
      {global?.pinterest_verification && <meta name="p:domain_verify" content={global.pinterest_verification} />}

      {/* Facebook */}
      {global?.facebook_app_id && <meta property="fb:app_id" content={global.facebook_app_id} />}

      {/* Theme color */}
      {global?.theme_color && <meta name="theme-color" content={global.theme_color} />}

      {/* Global schemas */}
      {schemas?.map((s) => (
        <script key={s.id} type="application/ld+json">
          {JSON.stringify(s.schema_json)}
        </script>
      ))}

      {/* Page schema */}
      {pageSchema && (
        <script type="application/ld+json">
          {JSON.stringify(pageSchema)}
        </script>
      )}

      {/* Breadcrumb schema */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
}
