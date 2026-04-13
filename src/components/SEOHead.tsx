import { Head } from "vite-react-ssg";
import { usePageSEO } from "@/hooks/useSEO";

export function SEOHead() {
  const { resolved, route } = usePageSEO();
  const r = resolved;

  // Build page-specific schema
  const buildPageSchema = () => {
    if (r.schemaJson) return r.schemaJson; // Custom JSON from DB
    // Auto-generate based on schema_type
    const base: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": r.schemaType,
      url: `${r.siteUrl}${route === "/" ? "" : route}`,
      name: r.title,
      description: r.description,
      isPartOf: { "@id": `${r.siteUrl}/#website` },
      inLanguage: "en-CA",
    };
    if (r.schemaType === "Service") {
      base.provider = { "@id": `${r.siteUrl}/#organization` };
      base.areaServed = { "@type": "Country", name: "Canada" };
      base.offers = { "@type": "Offer", availability: "https://schema.org/InStock" };
    }
    if (r.breadcrumbs && Array.isArray(r.breadcrumbs) && r.breadcrumbs.length > 0) {
      base.breadcrumb = {
        "@type": "BreadcrumbList",
        itemListElement: (r.breadcrumbs as Array<{ position: number; name: string; item: string }>).map((b) => ({
          "@type": "ListItem",
          position: b.position,
          name: b.name,
          item: `${r.siteUrl}${b.item}`,
        })),
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

  return (
    <Head>
      {/* CHARSET & COMPAT */}
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* VIEWPORT */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* THEME */}
      <meta name="theme-color" content={r.themeColor} />
      <meta name="color-scheme" content="light" />
      <meta name="msapplication-TileColor" content={r.themeColor} />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* TITLE */}
      <title>{r.title}</title>

      {/* BASIC META */}
      <meta name="description" content={r.description} />
      {r.keywords && <meta name="keywords" content={r.keywords} />}
      <meta name="author" content={r.siteName} />
      <meta name="robots" content={r.robots} />
      <meta name="language" content="en-CA" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />

      {/* GEO (Calgary) */}
      <meta name="geo.region" content="CA-AB" />
      <meta name="geo.placename" content="Calgary, Alberta, Canada" />
      <meta name="geo.position" content="51.0447;-114.0719" />
      <meta name="ICBM" content="51.0447, -114.0719" />

      {/* CANONICAL */}
      <link rel="canonical" href={r.canonical} />

      {/* HREFLANG */}
      <link rel="alternate" hrefLang="en-ca" href={r.canonical} />
      <link rel="alternate" hrefLang="en" href={r.canonical} />
      <link rel="alternate" hrefLang="x-default" href={r.canonical} />

      {/* OPEN GRAPH */}
      <meta property="og:site_name" content={r.siteName} />
      <meta property="og:locale" content={r.siteLocale} />
      <meta property="og:type" content={r.ogType} />
      <meta property="og:title" content={r.ogTitle} />
      <meta property="og:description" content={r.ogDescription} />
      <meta property="og:url" content={r.canonical} />
      <meta property="og:image" content={r.ogImage} />
      <meta property="og:image:secure_url" content={r.ogImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content={r.ogImageWidth} />
      <meta property="og:image:height" content={r.ogImageHeight} />
      <meta property="og:image:alt" content={r.ogImageAlt} />

      {/* FACEBOOK */}
      {r.facebookAppId && <meta property="fb:app_id" content={r.facebookAppId} />}

      {/* ARTICLE TAGS (when ogType = article) */}
      {r.ogType === "article" && r.articlePublished && (
        <meta property="article:published_time" content={r.articlePublished} />
      )}
      {r.ogType === "article" && r.articleModified && (
        <meta property="article:modified_time" content={r.articleModified} />
      )}
      {r.ogType === "article" && r.articleSection && (
        <meta property="article:section" content={r.articleSection} />
      )}
      {r.ogType === "article" &&
        r.articleTags?.map((tag: string) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* TWITTER / X */}
      <meta name="twitter:card" content={r.twitterCard} />
      <meta name="twitter:domain" content="vitalisstrategies.com" />
      <meta name="twitter:url" content={r.canonical} />
      <meta name="twitter:title" content={r.twitterTitle} />
      <meta name="twitter:description" content={r.twitterDescription} />
      <meta name="twitter:image" content={r.twitterImage} />
      <meta name="twitter:image:alt" content={r.twitterImageAlt} />
      {r.twitterHandle && <meta name="twitter:site" content={r.twitterHandle} />}
      {r.twitterHandle && <meta name="twitter:creator" content={r.twitterHandle} />}

      {/* SEARCH ENGINE VERIFICATION */}
      {r.googleSearchConsole && (
        <meta name="google-site-verification" content={r.googleSearchConsole} />
      )}
      {r.bingVerification && (
        <meta name="msvalidate.01" content={r.bingVerification} />
      )}
      {r.pinterestVerification && (
        <meta name="p:domain_verify" content={r.pinterestVerification} />
      )}

      {/* FAVICONS */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1C3D2E" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* PRECONNECT */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://ilbhphreyvaoomhpvaxi.supabase.co" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://connect.facebook.net" />
      <link rel="dns-prefetch" href="https://snap.licdn.com" />

      {/* PRELOAD */}
      <link rel="preload" href="/vitalis-logo.webp" as="image" type="image/webp" />

      {/* GLOBAL SCHEMA — Organization & Website */}
      {r.globalSchemas.map((schema: { id: string; schema_json: unknown }) => (
        <script key={schema.id} type="application/ld+json">
          {JSON.stringify(schema.schema_json)}
        </script>
      ))}

      {/* PAGE-SPECIFIC SCHEMA */}
      <script type="application/ld+json">
        {JSON.stringify(buildPageSchema())}
      </script>
    </Head>
  );
}
