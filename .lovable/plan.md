

## Performance Optimization Plan

### 1. Font Loading — Eliminate Render Blocking (~1,730ms savings)

**index.html**: Add `preconnect` hints before any other resource loads.

**src/index.css**: Remove the `@import url(...)` for Google Fonts — it is render-blocking. Instead, load the fonts via a `<link>` tag in `index.html` with `media="print" onload="this.media='all'"` pattern (non-blocking), plus a `<noscript>` fallback. The Google Fonts URL already includes `&display=swap`, which handles `font-display: swap`.

```html
<!-- index.html <head> additions -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?..." media="print" onload="this.media='all'" />
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?..." /></noscript>
```

### 2. Route-Level Code Splitting — Reduce Unused JS (~306KB savings)

**src/App.tsx**: Convert all page imports (except `Index`) to `React.lazy()`. Wrap `<Routes>` in `<Suspense>`. This splits every page into its own chunk, so only the homepage JS loads on initial visit.

Pages to lazy-load (30+ routes):
- All `/about`, `/solutions/*`, `/contact`, `/clinic-audit`, `/strategic-assessment/*`, `/assessment/*`, `/admin/*`, `/portfolio`, `/partners`, `/engagement`, `/healthcare-it`, `/insights/*`, `/not-found`

Keep eagerly loaded: `Index` (homepage) — it's the landing page.

### 3. Vendor Chunk Splitting — Separate Large Dependencies

**vite.config.ts**: Add `build.rollupOptions.output.manualChunks` to split vendor code:

```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-query': ['@tanstack/react-query'],
        'vendor-ui': ['framer-motion', 'lucide-react'],
      }
    }
  }
}
```

This creates smaller, cacheable vendor chunks instead of one monolithic bundle.

### 4. LCP Improvement

The font fixes in step 1 directly address the 2.5s element render delay. Moving fonts from a blocking CSS `@import` to a non-blocking `<link>` with preload allows text to paint immediately with fallback fonts, then swap when the web font arrives.

### 5. Cache Headers

Cache headers are set at the hosting/CDN layer, not in application code. Lovable's hosting already serves hashed assets (e.g., `index-CsHPxJdZ.js`) with appropriate cache headers. No code change is needed — this is handled by the platform. If a custom domain with a CDN (e.g., Cloudflare) is in use, cache rules should be configured there.

---

### Files to edit

| File | Change |
|------|--------|
| `index.html` | Add preconnect + non-blocking font link |
| `src/index.css` | Remove line 1 (`@import url(...)`) |
| `src/App.tsx` | Convert 30+ imports to `React.lazy()`, add `Suspense` wrapper |
| `vite.config.ts` | Add `build.rollupOptions.output.manualChunks` for vendor splitting |

### Expected impact
- Eliminates ~1,730ms render-blocking time (fonts)
- Reduces initial JS from ~465KB to ~150-200KB (lazy routes + vendor splitting)
- LCP should drop from 5.5s to ~2-3s range

