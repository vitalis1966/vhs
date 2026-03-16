

## Portfolio Page — Full Redesign Plan

### Summary
Full rewrite of `src/pages/Portfolio.tsx` with 9 detailed case studies, filter bar, mixed-size card grid with gradient backgrounds, and a right-side Sheet drawer for case study detail view. Single file change.

### Approach

**Data:** Define a `caseStudies` array with all 9 cases containing id, title, tagline, location, type (string[]), specialty, size, duration, cardGradient (inline style object), overview, challenge, approach, outcome, services (string[]), and metrics (array of {label, value, sublabel}).

**Card Grid:** CSS Grid with named column spans:
- Row 1: 1 card spanning full width (col-span-3)
- Row 2: 2 cards (each col-span-1, but in a 2-col context — use responsive `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Actually simpler: use a single grid with `lg:grid-cols-3` and assign specific cards `lg:col-span-3`, `lg:col-span-2`, `lg:col-span-1` etc. to create the mixed layout.

Specific grid spans (on lg):
- Case 1: col-span-3 (full width, min-h-[360px])
- Cases 2-3: col-span-1 each (but only 2 cards = use a nested 2-col row, or make grid-cols-2 for that row)

Simpler approach: Don't use complex grid spans. Use separate row containers:
- Row 1: single full-width card
- Row 2: 2-col grid, 2 cards
- Row 3: 3-col grid, 3 cards
- Row 4: 2-col grid, 2 cards
- Row 5: 2-col grid, 2 cards

This is cleaner and avoids grid complexity. Filter just shows/hides cards, so filtering will flatten to a simple responsive grid when filtered.

**Revised approach for filtering compatibility:** Use a single `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` grid. Assign Case 1 `md:col-span-2 lg:col-span-3` (full width). All others are single column. When "All" is selected, Case 1 is always prominent. When filtered, all matching cards display in the standard grid. This is simple and filter-compatible.

**Card Design:**
- Each card gets an inline `style={{ background: 'linear-gradient(135deg, ...)' }}` using CSS color values from the site's palette mapped to each case's gradient spec
- ArrowUpRight icon top-right in a white/20 circle
- Bottom overlay with dark gradient scrim, tag pills, title, location
- `hover:scale-[1.02]` transition, cursor-pointer
- `role="button"`, `tabIndex={0}`, keyboard handler

**Filter Bar:**
- `useState<string>('All')` for active filter
- Horizontal pill row with overflow-x-auto on mobile
- Filter against case `type` array with `.some(t => t === filter)`

**Drawer:**
- Use the existing `Sheet` component from `src/components/ui/sheet.tsx` with `side="right"`
- Override max-width to 640px via className on SheetContent
- `useState<string | null>(null)` for open case ID
- Sheet open = `!!selectedCase`, onOpenChange sets to null
- Scrollable body with sections: eyebrow, title, tagline, metadata strip, overview, challenge, approach, outcome, metrics cards, services pills, footer CTA

**Gradients:** Since Tailwind JIT won't have all gradient combos, use inline styles:
```ts
{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(170, 40%, 25%) 100%)' }
```
Map each case to specific HSL values derived from the site's palette.

### Technical Details

- **File:** `src/pages/Portfolio.tsx` — full rewrite (~500 lines)
- **Components used:** Sheet/SheetContent/SheetHeader/SheetTitle/SheetDescription from existing UI, Button, Link, motion from framer-motion, ArrowUpRight/ArrowRight/X/Clock/MapPin/Briefcase from lucide-react
- **State:** `activeFilter: string`, `selectedCaseId: string | null`
- **No new dependencies or files**
- **SEO:** Keep existing usePageMeta call with updated title/description

