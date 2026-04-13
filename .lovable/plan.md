

## Plan: Static Site Generation with `vite-react-ssg`

### What this achieves
Every static page will have its full HTML (content + meta tags) baked into the build output. Crawlers receive rendered HTML without executing JavaScript.

### Correction to the original request
- `vite-ssg` is **Vue-only**. The correct React package is **`vite-react-ssg`** (same concept, React Router v6 compatible).
- The route format uses React Router v6 data route objects, not Vue Router's `RouteRecordRaw`.

### Important caveat: Supabase data at build time
The current SEO system fetches meta tags from Supabase (`seo_pages`, `seo_global`) at runtime. During SSG build, these queries will execute server-side against the live database. This means the pre-rendered HTML will contain whatever SEO data exists in the database at build time. This is actually ideal -- the meta tags will be baked into the static HTML.

---

### Step 1 -- Install `vite-react-ssg`
Add `vite-react-ssg` as a dev dependency.

### Step 2 -- Create `src/routes.tsx` with route definitions as a data array
Convert all routes from JSX `<Route>` elements to React Router v6 data route objects. Static routes get `lazy` imports. Dynamic routes (`:token`, `:slug`, `:id`) and admin routes are included but will only be client-side rendered (no `getStaticPaths`).

Static routes to pre-render (~30 pages):
```
/, /about, /team, /about/mission-vision, /how-we-work, /solutions,
/solutions/new-clinics, /solutions/existing-clinics, /solutions/medical,
/solutions/dental, /solutions/veterinary, /solutions/nhsf, /contact,
/clinic-audit, /strategic-assessment, /strategic-assessment/intake,
/strategic-assessment/confirmation, /portfolio, /partners, /engagement,
/healthcare-it, /insights, /terms, /privacy, /disclaimer, /cookies,
/unsubscribe
```

Admin and dynamic routes remain but are not pre-rendered.

### Step 3 -- Create a root layout component
Extract the providers (HelmetProvider, QueryClientProvider, TooltipProvider, Toaster, Sonner, GlobalScripts, RedirectHandler, SEOLayout) into a layout component that wraps all routes via an `<Outlet />`.

### Step 4 -- Update `src/main.tsx`
Replace `createRoot` with `ViteReactSSG`:
```ts
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'

export const createRoot = ViteReactSSG({ routes })
```

### Step 5 -- Update `src/App.tsx`
Simplify to re-export routes or remove entirely (the layout + routes array replaces it).

### Step 6 -- Update `package.json` build script
Change `"build": "vite build"` to `"build": "vite-react-ssg build"`. Keep `"dev": "vite"` for CSR during development.

### Step 7 -- Update `vite.config.ts`
Add `ssgOptions` if needed (formatting, script async). No Puppeteer config.

### Step 8 -- Update `public/robots.txt`
Replace with the expanded version covering Googlebot, GPTBot, ClaudeBot, PerplexityBot, LinkedInBot.

### Step 9 -- Create `public/llms.txt`
Add the AI crawler guidance file with site structure.

### Step 10 -- Verify build
Run `vite-react-ssg build` and confirm `dist/` contains per-route `index.html` files with rendered content and meta tags.

---

### Risks and mitigations
- **Supabase at build time**: The SSG build will call Supabase to fetch SEO data. If the Supabase project is unreachable during build, pages will use hardcoded fallback meta tags (which already exist in each page via `usePageMeta`).
- **`react-helmet-async` compatibility**: `vite-react-ssg` supports `react-helmet-async` for injecting `<head>` content during SSR. The existing SEOHead component should work without changes.
- **framer-motion**: May need minor handling for SSR (it generally works, but animations are skipped server-side).

### Files changed
- **Install**: `vite-react-ssg` (dev dependency)
- **Create**: `src/routes.tsx`, `src/components/RootLayout.tsx`, `public/llms.txt`
- **Modify**: `src/main.tsx`, `src/App.tsx`, `package.json` (build script), `vite.config.ts`, `public/robots.txt`

