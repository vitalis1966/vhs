import { Helmet } from "react-helmet-async";
import { usePageSEO } from "@/hooks/useSEO";

interface SEOHeadProps {
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function SEOHead({ fallbackTitle, fallbackDescription }: SEOHeadProps) {
  const { resolved, pageSEO } = usePageSEO();

  const title = resolved.title || fallbackTitle || "Vitalis Health Strategies";
  const description = resolved.description || fallbackDescription || "";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {resolved.keywords && <meta name="keywords" content={resolved.keywords} />}
      <meta name="robots" content={resolved.robots} />
      <link rel="canonical" href={resolved.canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={resolved.ogTitle || title} />
      <meta property="og:description" content={resolved.ogDescription || description} />
      <meta property="og:type" content={resolved.ogType} />
      <meta property="og:url" content={resolved.canonical} />
      <meta property="og:site_name" content={resolved.siteName} />
      <meta property="og:locale" content={resolved.siteLocale} />
      <meta property="og:image" content={resolved.ogImage} />
      {resolved.ogImageAlt && <meta property="og:image:alt" content={resolved.ogImageAlt} />}
      <meta property="og:image:width" content={resolved.ogImageWidth} />
      <meta property="og:image:height" content={resolved.ogImageHeight} />

      {/* Twitter */}
      <meta name="twitter:card" content={resolved.twitterCard} />
      {resolved.twitterHandle && <meta name="twitter:site" content={resolved.twitterHandle} />}
      <meta name="twitter:title" content={resolved.twitterTitle || title} />
      <meta name="twitter:description" content={resolved.twitterDescription || description} />
      <meta name="twitter:image" content={resolved.twitterImage} />
      {resolved.twitterImageAlt && <meta name="twitter:image:alt" content={resolved.twitterImageAlt} />}

      {/* Article meta */}
      {resolved.articleAuthor && <meta property="article:author" content={resolved.articleAuthor} />}
      {resolved.articlePublished && <meta property="article:published_time" content={resolved.articlePublished} />}
      {resolved.articleModified && <meta property="article:modified_time" content={resolved.articleModified} />}
      {resolved.articleSection && <meta property="article:section" content={resolved.articleSection} />}
      {resolved.articleTags?.map((tag: string) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Verification tags */}
      {resolved.googleSearchConsole && <meta name="google-site-verification" content={resolved.googleSearchConsole} />}
      {resolved.bingVerification && <meta name="msvalidate.01" content={resolved.bingVerification} />}
      {resolved.pinterestVerification && <meta name="p:domain_verify" content={resolved.pinterestVerification} />}

      {/* Facebook */}
      {resolved.facebookAppId && <meta property="fb:app_id" content={resolved.facebookAppId} />}

      {/* Theme color */}
      <meta name="theme-color" content={resolved.themeColor} />

      {/* Global schemas */}
      {resolved.globalSchemas?.map((s: { id: string; schema_json: Record<string, unknown> }) => (
        <script key={s.id} type="application/ld+json">
          {JSON.stringify(s.schema_json)}
        </script>
      ))}

      {/* Page schema */}
      {resolved.schemaJson ? (
        <script type="application/ld+json">
          {JSON.stringify(resolved.schemaJson)}
        </script>
      ) : resolved.schemaType ? (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": resolved.schemaType,
            name: title,
            description,
            url: resolved.canonical,
          })}
        </script>
      ) : null}

      {/* Breadcrumb schema */}
      {resolved.breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: (resolved.breadcrumbs as Array<{ position: number; name: string; item: string }>).map((b) => ({
              "@type": "ListItem",
              position: b.position,
              name: b.name,
              item: `${resolved.siteUrl}${b.item}`,
            })),
          })}
        </script>
      )}
    </Helmet>
  );
}
