

## Ecosystem Page Redesign + Nav Rename + Nav Spacing Fix

Three parts across 3 files, no database changes needed.

### Part A -- Nav Spacing Fix (`src/components/Navbar.tsx`)

- Line 120: Change `gap-2 2xl:gap-4` to `gap-6 2xl:gap-8` on the desktop nav container
- Add `px-1` to each nav link button/element for hover buffer (the `renderDesktopLink` function elements and the Solutions mega-menu trigger)

### Part B -- Rename "Partners" to "Ecosystem"

1. **Navbar.tsx** -- In `simpleNavLinks` array, change `{ label: "Partners", href: "/partners" }` to `{ label: "Ecosystem", href: "/partners" }` (route stays same)
2. **Footer.tsx** -- In `footerLinks.Company`, change `{ label: "Partners", href: "/partners" }` to `{ label: "Ecosystem", href: "/partners" }`
3. **Partners.tsx** -- Update `usePageMeta` title and description as specified

### Part C -- Full Page Redesign (`src/pages/Partners.tsx`)

Complete rewrite preserving the hub-and-spoke diagram logic (refs, SVG lines, `recalcLines`). New section order:

1. **Hero** -- Updated eyebrow ("THE VITALIS ECOSYSTEM"), headline, subheadline, 4-item stats strip, two CTA buttons
2. **The Coordination Problem** -- 3 amber AlertTriangle cards describing real misalignment problems, plus italic coordinator statement
3. **Hub Visual** -- Existing SVG hub-and-spoke diagram preserved exactly (desktop + mobile), updated heading/subheading
4. **Featured Partners** -- 3 horizontal partner cards (ATB with logo placeholder `id="atb-logo-container"`, Holland with `id="holland-logo-container"`, Field Law keeps icon). Two-column layout on desktop (35/65 split)
5. **Additional Categories** -- 3-column icon card grid (Real Estate, Technology, Operational) with updated copy
6. **Why This Model Works** -- Side-by-side comparison: "A referral" (muted) vs "The Vitalis ecosystem" (teal/positive), 5 points each
7. **Final CTA** -- Updated heading and body copy, two buttons

All existing partner data preserved. New icons added: `AlertTriangle`, `Settings`, `MapPin`. Logo placeholder containers use empty `src=""` with "Logo to be uploaded" text beneath.

### Files Modified

| File | Change |
|------|--------|
| `src/pages/Partners.tsx` | Full rewrite |
| `src/components/Navbar.tsx` | Rename + gap spacing |
| `src/components/Footer.tsx` | Rename link label |

