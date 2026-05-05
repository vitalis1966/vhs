## Add Bundle Analyzer

Add `rollup-plugin-visualizer` to diagnose unused JavaScript in production bundles.

### Changes

**1. `package.json`**
- Add to `devDependencies`: `"rollup-plugin-visualizer": "^5.12.0"`
- Add to `scripts`: `"analyze": "ANALYZE=true vite build"`

**2. `vite.config.ts`**
- Add import at top: `import { visualizer } from 'rollup-plugin-visualizer';`
- Inside the `plugins` array (after existing entries, before `.filter(Boolean)`), conditionally spread the visualizer plugin when `process.env.ANALYZE === 'true'`, outputting to `dist/stats.html` with gzip and brotli sizes enabled.

No other config, plugins, or build settings will be touched. `manualChunks`, `nonBlockingCSS`, SWC react plugin, and `componentTagger` remain unchanged.

### Usage

After approval, run `npm run analyze` (or `bun run analyze`) locally to generate `dist/stats.html` — open it in a browser to inspect chunk composition and identify unused JS.
