

## Plan: Add `_redirects` for Cloudflare Pages & Verify Image Paths

### Context
Lovable's built-in hosting already handles SPA routing automatically, so this file has no effect on Lovable previews or published sites. However, if you're deploying to **Cloudflare Pages**, this file is needed for client-side routing to work on page refresh/deep links.

### Changes

**1. Create `public/_redirects`**
- Single line: `/* /index.html 200`
- This tells Cloudflare Pages to serve `index.html` for all non-file routes

**2. Verify image references**
I searched the codebase — image references already use relative paths starting with `/`:
- `/vitalis-logo.webp` — used in Footer, AssessmentReport, BookingWidget, index.html, etc.
- `/favicon.ico`, `/placeholder.svg` — already relative
- The only absolute image URLs are the Open Graph social images hosted on Google Cloud Storage (`https://storage.googleapis.com/...`) in `index.html` meta tags — these must stay absolute since they need to be reachable by social media crawlers

No image path changes needed.

### Files
- **Create**: `public/_redirects`

