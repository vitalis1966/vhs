
## Plan: Reduce Render-Blocking CSS Further

### Current state
- `index.html` already has critical CSS inlined (nav, hero, hero gradient, container, animate-fade-in)
- `vite.config.ts` already has `cssCodeSplit: true`, `cssMinify: true`, `target: 'es2020'`
- Main `assets/index.css` (~16 KiB) is still render-blocking because Vite's build emits `<link rel="stylesheet">` for the entry CSS

### Root cause
Vite injects the entry CSS as a synchronous `<link rel="stylesheet">` and there's no built-in flag to make it non-blocking. We need a small Vite plugin that, in the `transformIndexHtml` hook, rewrites the emitted stylesheet link to use the `media="print"` → `onload` swap pattern (same trick already used for Google Fonts).

### Changes

**1. `vite.config.ts`** — Add a tiny inline plugin that post-processes the built `index.html`:

```ts
const nonBlockingCSS = (): Plugin => ({
  name: 'non-blocking-css',
  apply: 'build',
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet"([^>]*?)href="(\/assets\/[^"]+\.css)"([^>]*)>/g,
      (_m, before, href, after) =>
        `<link rel="preload" as="style"${before}href="${href}"${after} onload="this.onload=null;this.rel='stylesheet'">` +
        `<noscript><link rel="stylesheet"${before}href="${href}"${after}></noscript>`
    );
  },
});
```

Add it to the `plugins` array (build-only, won't affect dev HMR).

Also add `cssTarget: 'chrome61'` to the existing `build` block as requested.

**2. `index.html`** — No changes needed. Critical CSS is already inlined for nav + hero. The `transformIndexHtml` plugin handles the rewrite at build time.

### Why this works
- Only runs at build (`apply: 'build'`), so dev mode and HMR are untouched.
- Regex targets only Vite-emitted `/assets/*.css` links, leaving any other stylesheets alone.
- Browser fetches the CSS in parallel without blocking render; `onload` swaps it to `rel="stylesheet"` once loaded.
- `<noscript>` fallback preserves accessibility for non-JS environments.
- Inlined critical CSS in `index.html` already covers above-the-fold paint, so users see the hero immediately.

### Files modified
- `vite.config.ts` (add plugin + `cssTarget`)

### Risk
Low. The plugin is build-only, scoped to `/assets/*.css`, and the swap pattern is identical to the one already in use for Google Fonts.
