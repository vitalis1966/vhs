

## Plan: Fix Identical Meta Descriptions and OG Fields

### Root Cause

The database has `og_title`, `og_description`, `twitter_title`, and `twitter_description` set to NULL for every page. While the fallback chain in `useSEO.ts` *should* resolve to `pageSEO?.title` and `pageSEO?.description`, there are two issues:

1. **`.single()` can silently fail** — if PostgREST returns a 406 (no matching row), the entire `pageSEO` object becomes null, causing all fields to fall through to global defaults. Using `.maybeSingle()` is safer.

2. **NULL OG/Twitter fields** — all 18 pages have `og_title`, `og_description`, `twitter_title`, and `twitter_description` as NULL. Populating these directly makes the DB the explicit source of truth and eliminates any fallback chain ambiguity.

### Changes

**1. Database migration — populate OG and Twitter fields from existing Title/Description**

```sql
UPDATE seo_pages
SET og_title = title
WHERE og_title IS NULL AND title IS NOT NULL;

UPDATE seo_pages
SET og_description = description
WHERE og_description IS NULL AND description IS NOT NULL;

UPDATE seo_pages
SET twitter_title = title
WHERE twitter_title IS NULL AND title IS NOT NULL;

UPDATE seo_pages
SET twitter_description = description
WHERE twitter_description IS NULL AND description IS NOT NULL;
```

This seeds all 18 pages with explicit values.

**2. `src/hooks/useSEO.ts` — change `.single()` to `.maybeSingle()`**

On the `seo_pages` query (line 20), replace `.single()` with `.maybeSingle()` to prevent silent 406 errors when a page has no DB record. This ensures `pageSEO` is `null` (not an error) for unregistered routes, and correctly returns data for registered routes.

**3. No other file changes needed**

The fallback chain logic, `SEOHead` component, and `PagesTab` auto-sync (already implemented) are all correct. The issue is purely data + query method.

