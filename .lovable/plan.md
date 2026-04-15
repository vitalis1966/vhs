

## Plan: Fix Duplicate Static Meta Tags in index.html

### Root Cause
`index.html` contains hardcoded meta tags (lines 30-52) that duplicate what `react-helmet-async` injects dynamically. SEO crawlers see the static tags first, which are identical on every page. The dynamic Helmet tags are added alongside (not replacing) the static ones because Helmet only manages tags it created (tracked via `data-rh` attributes).

### Changes

**File: `index.html`**
Remove lines 30-52 (the hardcoded SEO meta tags):
- Line 30: `<title>Healthcare Consulting...</title>`
- Line 31: `<meta name="description" ...>`
- Line 32: `<meta name="author" ...>`
- Lines 36-52: All `og:type`, `og:title`, `og:description`, `og:image`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` tags

Keep only the structural tags (charset, viewport, preconnects, fonts, critical CSS). Helmet will inject all SEO tags dynamically with proper per-page values.

Add a minimal fallback `<title>` tag (e.g., just "Vitalis Health Strategies") so the HTML shell isn't titleless during the brief period before React hydrates.

### Why this works
- `SEOHead` via `react-helmet-async` already renders all these tags with correct per-page data from the database
- Removing the static duplicates ensures crawlers see only the Helmet-managed tags
- The DB query and fallback chain in `useSEO.ts` are confirmed working correctly (verified via network requests and direct DB query)

### No other file changes needed
The `useSEO.ts` hook, `SEOHead` component, and database data are all correct. This is purely a static HTML duplication issue.

