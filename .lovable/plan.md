
## Plan: Deduplicate Preconnect Tags

### Current state
- **`index.html`**: Has preconnects for `fonts.googleapis.com`, `fonts.gstatic.com`, and dns-prefetch for `supabase.co`
- **`SEOHead.tsx`**: Has preconnects for `fonts.googleapis.com`, `fonts.gstatic.com`, `supabase.co`, plus dns-prefetch for analytics/marketing origins

### Changes

**1. `index.html`** — Keep only the two font preconnects (already present, no change needed):
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```
Remove the existing `dns-prefetch` for supabase (since SEOHead will own it).

**2. `src/components/SEOHead.tsx`** — Remove the duplicated font preconnects, keep only the Supabase preconnect and the marketing dns-prefetches:
```tsx
{/* PRECONNECT — fonts already preconnected in index.html */}
<link rel="preconnect" href="https://ilbhphreyvaoomhpvaxi.supabase.co" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://connect.facebook.net" />
<link rel="dns-prefetch" href="https://snap.licdn.com" />
```

### Result
Exactly 3 preconnect tags total, each appearing once:
- `fonts.googleapis.com` → index.html
- `fonts.gstatic.com` → index.html  
- `supabase.co` → SEOHead

DNS-prefetch tags for analytics/marketing origins remain in SEOHead unchanged (they are not preconnects and were not flagged).
