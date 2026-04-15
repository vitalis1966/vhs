

## Plan: Connect SEO Admin Data to Page Meta Tags

### Current State (already working)

After reviewing the full codebase, the SEO system is **already mostly wired up**:

- `SEOLayout` wraps all routes in `App.tsx` (line 71-127)
- `SEOHead` renders all meta tags using data from `usePageSEO()` hook
- `usePageSEO()` in `useSEO.ts` fetches from `seo_pages` (matched by route) and `seo_global` (fallback defaults)
- The fallback chain is: DB page data → component fallback (via `usePageMeta`) → global defaults → hardcoded defaults
- Schema JSON is already injected as `<script type="application/ld+json">`
- `RedirectHandler` already reads `seo_redirects` and handles redirects via React Router
- Global scripts (GA4, GTM, Meta Pixel, etc.) are already injected via `SEOScripts` / `GlobalScripts`

The database has data for all 18 pages with titles and descriptions populated.

### What actually needs fixing

There are only a few small gaps:

**1. `is_active = false` should force noindex** 
Currently, when `is_active` is false, `useSEO.ts` filters it out (`eq("is_active", true)`), so no page record is found and the page falls back to global defaults. Instead, when `is_active` is OFF, the robots tag should be set to `noindex, follow`.

**2. Auto-sync OG Title/Description into DB on save**
Currently, if `og_title` is null in the DB, the fallback chain fills it from `title` at render time — functionally correct. But the user wants: when saving in PagesTab, if `og_title` is empty, auto-populate it with `title` in the saved record. This makes the DB the explicit source of truth.

**3. Verify no stale cache issues**
The `staleTime` is 5 minutes — changes in admin won't reflect for up to 5 min on the live site. The save mutation already invalidates the `seo-page` query key, which is correct for the admin preview but worth noting.

### Changes

**File 1: `src/hooks/useSEO.ts`**
- Add a secondary query for pages where `is_active = false` to detect disabled pages
- OR: remove the `is_active` filter and handle it in the resolved logic: if `is_active` is false, force `robots` to `noindex, follow`

**File 2: `src/components/admin/seo/PagesTab.tsx`**
- In the `saveMutation`, before saving: if `og_title` is empty, set it to `title`; if `og_description` is empty, set it to `description`. Same for `twitter_title` and `twitter_description`.

No other files need changes. The SEO system is already connected and functioning. The meta tags, OG tags, Twitter cards, schema, redirects, and global defaults all work through the existing `SEOHead` → `usePageSEO` → database pipeline.

### Technical details
- Modify `useSEO.ts` query to remove `.eq("is_active", true)` and handle `is_active` in the resolved object
- Add auto-fill logic in PagesTab save handler (4-6 lines)
- No new dependencies, no database changes, no new components

