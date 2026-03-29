import { Outlet } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

/**
 * Wraps all routes to inject database-backed SEO meta tags on every page.
 * Falls back to existing usePageMeta values set by individual pages.
 */
export function SEOLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <SEOHead />
      {children}
    </>
  );
}
