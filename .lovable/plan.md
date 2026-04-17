
## Plan: Add srcset to Navbar Logo

### Investigation needed
- Confirm Navbar logo usage and current dimensions
- Check `index.html` static shell logo too (also uses `/vitalis-logo.webp`)
- Note: I can't generate a real resized WebP image in plan mode, but in default mode I can create a 1x version using image tools

### Changes

**1. `public/vitalis-logo-1x.webp`** — Generate a 215×48px (1x density) version of the existing logo using ImageMagick/cwebp from the source `/public/vitalis-logo.webp`. The current file will serve as the 2x asset.

**2. `src/components/Navbar.tsx`** — Update the `<img>` tag to add `srcset`:
```tsx
<img
  src="/vitalis-logo.webp"
  srcset="/vitalis-logo.webp 2x, /vitalis-logo-1x.webp 1x"
  alt="Vitalis Health Strategies"
  width="120"
  height="48"
/>
```

**3. `index.html`** (static shell + preload) — Apply the same `srcset` to the shell `<img>` so the FCP logo also benefits, and update the `<link rel="preload">` to use `imagesrcset`/`imagesizes` so the browser preloads the correct density:
```html
<link rel="preload" as="image"
  imagesrcset="/vitalis-logo.webp 2x, /vitalis-logo-1x.webp 1x"
  href="/vitalis-logo-1x.webp"
  fetchpriority="high" type="image/webp" />
```

### Out of scope
- Footer logo (`brightness-0 invert`, different context) — not requested
- Other pages referencing the logo

### Risk
Low. If the 1x file generation fails, fallback `src` still loads the existing 2x asset.
