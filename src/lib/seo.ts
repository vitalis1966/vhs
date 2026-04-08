import { useEffect } from "react";
import { usePageSEOFallback } from "@/contexts/PageSEOContext";

/**
 * Sets per-page SEO fallback values via context.
 * These are used by SEOHead as fallbacks when no DB record exists.
 * Does NOT directly manipulate the DOM — SEOHead (react-helmet-async) handles all meta tags.
 */
export function usePageMeta(title: string, description: string) {
  const { setFallback } = usePageSEOFallback();

  useEffect(() => {
    setFallback({ title, description });
  }, [title, description, setFallback]);
}
