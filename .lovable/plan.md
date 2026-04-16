
## Plan: Reduce Render-Blocking CSS

### Changes

**1. `vite.config.ts`** — Add CSS code splitting and asset naming to the existing `build` config:
```ts
build: {
  target: 'es2020',
  cssMinify: true,
  cssCodeSplit: true,              // NEW
  modulePreload: { polyfill: false },
  rollupOptions: {
    output: {
      assetFileNames: 'assets/[name]-[hash][extname]',  // NEW
      manualChunks: { /* unchanged */ },
    },
  },
},
```

**2. `index.html`** — Replace the current two-link Google Fonts pattern (preload + print-media stylesheet swap) with the simpler non-blocking preload + onload swap pattern:
```html
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" onload="this.onload=null;this.rel='stylesheet'" />
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" /></noscript>
```

The existing `<noscript>` fallback is preserved. No other changes.

### Why this works
- `cssCodeSplit: true` allows route-level CSS to be split out of the main bundle, shrinking the critical CSS path.
- The fonts swap from `media="print"` trick → `onload` swap is functionally equivalent but matches the requested pattern exactly.
- All app logic, providers, and SEO behavior are untouched.
