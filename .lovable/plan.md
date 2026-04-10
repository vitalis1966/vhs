

## Plan: Per-Page Open Graph Meta Tags

### Current State
- `SEOHead` (in `SEOLayout`, wrapping all routes) already renders all OG and Twitter meta tags via `react-helmet-async`
- `usePageMeta(title, description)` sets fallback values via context, used when no DB record exists in `seo_pages`
- **Gap 1**: `usePageMeta` only accepts `title` and `description` — no `ogImage` or `ogUrl` support
- **Gap 2**: The Homepage (`Index.tsx`) never calls `usePageMeta`, so it has no hardcoded fallback
- All other pages already call `usePageMeta` with unique title/description — OG title/description already derive from those

### Changes

**1. Extend `PageSEOContext` to include `ogImage`**
- Add optional `ogImage` field to the `PageSEOFallback` interface
- Update `setFallback` comparison to include `ogImage`

**2. Update `usePageMeta` to accept optional `ogImage`**
- Change signature to `usePageMeta(title, description, ogImage?)`
- Pass `ogImage` into context

**3. Update `useSEO.ts` resolved values**
- Use `fallback.ogImage` in the ogImage/twitterImage resolution chain (after DB value, before global default)

**4. Add `usePageMeta` to Index.tsx**
- Add the call with homepage-specific title, description, and default OG image

**5. Add `ogImage` to Medical Solutions page**
- Pass `/og-medical.jpg` as the third argument to `usePageMeta`

**6. Add unique `ogImage` placeholders to all other pages**
- Each page gets a distinct placeholder path (e.g. `/og-about.jpg`, `/og-contact.jpg`, etc.)
- Pages: About, HowWeWork, Solutions, SolutionsNewClinics, SolutionsExistingClinics, Contact, ClinicAudit, StrategicAssessment, Engagement, HealthcareIT, Partners, Portfolio, MissionVision, Insights, Dental, Veterinary, NHSF, Terms, Privacy, Disclaimer, Cookies

### Files Modified
- `src/contexts/PageSEOContext.tsx` — add `ogImage` to interface
- `src/lib/seo.ts` — accept optional third param
- `src/hooks/useSEO.ts` — use `fallback.ogImage` in resolution
- `src/pages/Index.tsx` — add `usePageMeta` call
- `src/pages/solutions/Medical.tsx` — add ogImage param
- ~20 other page files — add ogImage param to existing `usePageMeta` calls

### No structural changes needed
- `HelmetProvider` already wraps the app in `App.tsx`
- `SEOHead` already renders all OG/Twitter tags
- DB values from admin panel will continue to take priority over these hardcoded fallbacks

