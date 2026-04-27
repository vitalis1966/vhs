## Add "Social Media" Tab to SEO Settings + Footer Integration (revised)

A new tab under Admin → SEO Settings to manage all social platforms in one place, plus dynamic rendering of the configured icons in the site footer.

---

### 1. Database (new table)

Create `seo_social_links` so we can support drag-to-reorder, per-platform settings, and future-proof additions (Bluesky, etc.) without bloating `seo_global`.

```sql
create table public.seo_social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique,        -- 'facebook' | 'instagram' | 'linkedin' | 'x' | 'youtube' | 'tiktok' | 'pinterest' | 'bluesky'
  is_active boolean not null default false,
  profile_url text,
  display_label text,
  icon_style text not null default 'filled',  -- 'filled' | 'outline' | 'monochrome'
  open_in_new_tab boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.seo_social_links enable row level security;

-- Public read so the Footer (anon) can render configured icons
create policy "Public can read seo_social_links"
  on public.seo_social_links for select to public using (true);

-- Authenticated full management (matches other seo_* tables)
create policy "Authenticated manage seo_social_links"
  on public.seo_social_links for all to authenticated
  using (true) with check (true);
```

Seed the 8 platforms (all `is_active = false`, `sort_order` 0–7) so the admin UI renders the cards immediately on first load.

The 4 legacy social fields on `seo_global` (`facebook_page_url`, `linkedin_url`, `instagram_url`, `twitter_handle`) are left in place untouched (consumed by SEOHead/JSON-LD). The "Social Profiles" fieldset in the Global tab stays as-is for backward compatibility.

---

### 2. New Admin Tab — `src/components/admin/seo/SocialMediaTab.tsx`

Layout per spec:

- One card per platform with a left border accent in that brand's color (Facebook `#1877F2`, Instagram `#E4405F`, LinkedIn `#0A66C2`, X `#000000`, YouTube `#FF0000`, TikTok `#000000`, Pinterest `#E60023`, Bluesky `#0085FF`).
- Top-right `Switch` (Active toggle). Card collapses to platform name + toggle when off (grayed `opacity-60`).
- When active, expands to:
  - **Profile URL** — `Input` with platform-specific placeholder. **Validated with zod on save: must start with `https://` and be a parseable URL; otherwise an inline red error appears under the field and Save is blocked for that card.** Empty URL is allowed at the row level (the footer guard below silently skips it).
  - **Display Label** — `Input` (optional).
  - **Icon Style** — `Select`: Filled / Outline / Monochrome.
  - **Open in new tab** — `Checkbox` (default checked).
- Drag-to-reorder using `@dnd-kit/core` + `@dnd-kit/sortable` (install if absent). Drag handle icon (lucide `GripVertical`) on the card.
- **Live Preview strip** at the bottom: a sage-bg footer mock showing exactly the icons that will render (same order, same icon style, only the active **and** non-empty-URL ones — matches actual footer behavior).
- **Save Changes** button at the bottom — bulk upserts all rows in one mutation (only fires if all active rows pass validation), then `toast.success("Social media settings saved.")`.
- React Query keys: `["seo-admin-social"]` for admin, `["seo-social"]` for public footer — both invalidated on save so the footer updates immediately.

---

### 3. Wire tab into `src/pages/admin/SEOAdmin.tsx`

Add a new `<TabsTrigger value="social">` (lucide `Share2` icon) **as the last tab, after "Favicons & OG Images"** — Social Media is a content/presence setting, not a technical one, so it sits at the end of the nav rather than between Global and Schema. Corresponding `<TabsContent value="social"><SocialMediaTab /></TabsContent>`.

---

### 4. Footer Integration — `src/components/Footer.tsx`

- New hook `useSocialLinks()` (in `src/hooks/useSocialLinks.ts`) — React Query against `seo_social_links` filtered to `is_active = true`, ordered by `sort_order`.
- **Footer-side guard:** filter out any row where `profile_url` is null, empty, or whitespace-only — even if `is_active = true`. No broken `<a href="">` ever renders.
- Render an icon row above the existing copyright bar, using lucide-react brand icons (`Facebook`, `Instagram`, `Linkedin`, `Youtube`). For X / TikTok / Pinterest / Bluesky — lucide doesn't ship these as brand glyphs (or ships only the legacy Twitter bird), so add minimal inline SVG components in `src/components/icons/SocialIcons.tsx`.
- Each icon:
  - `<a href={profile_url}>` with `target="_blank" rel="noopener noreferrer"` only when `open_in_new_tab === true`.
  - `title={display_label || defaultLabel}` and matching `aria-label` for hover/screen-reader.
  - Icon variant driven by `icon_style`:
    - **Filled** — solid fill in the platform's brand color (Instagram falls back to a flat brand pink `#E4405F`, not a true gradient — gradient SVG fills would clash with the dark footer; this is a documented limitation noted inline in the admin UI helper text).
    - **Outline** — stroke only, `currentColor`.
    - **Monochrome** — fill in `currentColor` only.
- If no platform is active **or has a valid URL** → render nothing (no row, no extra spacing).
- Icons inherit footer text color (`text-white/80 hover:text-white`) so they fit the existing dark sage footer.

---

### 5. Files Touched

| File | Change |
|---|---|
| **migration** | Create `seo_social_links` + RLS + seed 8 platforms |
| `src/components/admin/seo/SocialMediaTab.tsx` | **NEW** — full admin UI with zod URL validation |
| `src/components/icons/SocialIcons.tsx` | **NEW** — X / TikTok / Pinterest / Bluesky SVG components |
| `src/hooks/useSocialLinks.ts` | **NEW** — public footer query hook |
| `src/pages/admin/SEOAdmin.tsx` | Add Social Media tab (last position) |
| `src/components/Footer.tsx` | Render dynamic social icon row with empty-URL guard |

No edge functions, no changes to `seo_global` schema, no breaking changes to existing SEO tabs. `types.ts` regenerates after the migration.

---

### 6. Notes

- "Trigger a rebuild/deploy" is not needed — the footer reads from the DB on every load, so changes are live the moment the user clicks Save.
- Brand left-border accent is purely decorative (`border-l-4 border-[#1877F2]` style), not a full color flood — per "subtly".
- Instagram gradient note: a small inline helper text on the Instagram card explains that Filled renders as flat brand pink (gradient fills don't read cleanly against the dark sage footer). Users wanting a clean look can pick Monochrome.
