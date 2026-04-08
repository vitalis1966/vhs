import { SEOHead } from "@/components/SEOHead";
import { PageSEOProvider } from "@/contexts/PageSEOContext";

/**
 * Wraps all routes to inject database-backed SEO meta tags on every page.
 * PageSEOProvider allows individual pages to register fallback values
 * via usePageMeta, which SEOHead uses when no DB record exists.
 */
export function SEOLayout({ children }: { children?: React.ReactNode }) {
  return (
    <PageSEOProvider>
      <SEOHead />
      {children}
    </PageSEOProvider>
  );
}
