

## Plan: Create Cloudflare Pages Middleware for Crawler Pre-rendering

### What this does
Creates a Cloudflare Pages middleware file that intercepts requests from search engine and social media crawlers, routing them to a pre-rendering service (via `env.PRERENDER` binding) so they receive fully rendered HTML. Non-crawler requests pass through unchanged.

### Note on runtime error
There is a `react-helmet-async` error ("Cannot read properties of undefined (reading 'add')") indicating a missing `HelmetProvider` wrapper. This is a separate issue from the middleware file -- I will investigate and fix it alongside the file creation.

### Changes

**1. Create `functions/_middleware.js`**
- Place at project root level (next to `package.json`)
- Contains the exact code you provided: crawler detection, static asset bypass, and pre-render proxy logic

**2. Fix HelmetProvider runtime error**
- The `HelmetProvider` appears to be missing from the component tree (likely lost during the SSG revert). Will verify `App.tsx` includes it and restore if needed.

### Important: Prerender service binding required
The middleware references `env.PRERENDER` -- this is a Cloudflare service binding that must be configured in your Cloudflare Pages dashboard (Settings > Functions > Service Bindings). Without it, the middleware will catch the error and fall through to `next()`.

### Files
- **Create**: `functions/_middleware.js`
- **Possibly fix**: `src/App.tsx` (restore HelmetProvider if missing)

