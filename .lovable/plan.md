

## Mobile Performance Optimization

### Changes to implement

1. **Delete `src/App.css`** — unused Vite scaffold file, dead CSS

2. **Update `vite.config.ts`**
   - Add `build.target: 'es2020'`
   - Add `build.cssMinify: true`
   - Add `build.modulePreload: { polyfill: false }` (~2KB savings)
   - Keep `framer-motion` in `manualChunks` as-is (no change)

3. **Update `index.html`**
   - Trim Google Fonts URL: remove Playfair Display weights 500 and italic variants (500i, 400i); remove Montserrat weight 300
   - Add `<link rel="dns-prefetch" href="https://ilbhphreyvaoomhpvaxi.supabase.co">` for faster Supabase connections on lazy-loaded pages

### Not changing
- `framer-motion` chunking strategy stays as-is per user request
- Cache-Control headers (CDN-level, not in code)

