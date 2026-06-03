## Plan: Admin Dashboard — VHS Management Grouping

### Goal
Restructure the Admin Dashboard by introducing a **"VHS Management"** grouped container card that houses 8 existing admin cards, while leaving **Vitalis OS** and **Client Management** as untouched standalone top-level cards.

### What Changes (single file)
**`src/pages/admin/AdminDashboard.tsx`**

### Data Split
Split the existing `adminPages` array into three parts:

1. **`standaloneTop`** — cards that remain outside any group (unchanged render logic)
   - Vitalis OS

2. **`vhsManagementPages`** — cards moved into the new VHS Management container
   - Assessment Builder
   - Submissions Review
   - Insights
   - Portfolio
   - Contact Submissions
   - SEO Settings
   - Administrators
   - Logging

3. **`standaloneBottom`** — cards that remain outside any group
   - Client Management

### Layout Structure
Replace the current single `grid` block with a `space-y-6` container holding three sections:

```
space-y-6
├── grid (2 cols) — Vitalis OS standalone card
├── VHS Management card (full width)
│   ├── Header: "VHS Management" title + subtitle
│   └── Inner grid (1 / 2 / 4 cols) — 8 compact cards
└── grid (2 cols) — Client Management standalone card
```

### VHS Management Container Styling
- Same outer shell as existing cards: `bg-card rounded-2xl shadow-soft border border-border/40 p-6 md:p-8`
- Header section with:
  - Title: "VHS Management" (`font-display text-xl font-bold text-foreground`)
  - Subtitle: "Manage and administer the Vitalis Health Strategies website platform" (`text-sm text-muted-foreground`)
- No expand/collapse — static grouped panel (simpler, no new component dependencies)

### Inner Card Grid (8 cards)
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
- Each inner card uses the **exact same card style** as today but with slightly more compact padding (`p-6` instead of `p-8`):
  - `bg-background rounded-xl border border-border/40 p-6 hover:shadow-elevated hover:border-primary/20 transition-all group cursor-pointer`
  - Same icon container (`h-10 w-10 rounded-lg bg-primary/10`)
  - Same icon size (`h-5 w-5 text-primary`)
  - Same title and description pattern, just scaled down slightly for density
- `motion.div` with existing `initial/animate` props preserved on each inner card
- All `<Link>` wrappers and `href` values remain identical — zero routing changes

### Standalone Cards (Vitalis OS + Client Management)
- Rendered in their own `grid grid-cols-1 md:grid-cols-2 gap-6` wrappers
- **Zero changes** to markup, styling, icons, descriptions, or routing
- Preserved exactly as they exist today

### What Does NOT Change
- All card data objects (titles, descriptions, hrefs, icons)
- All routing paths
- All data fetching, Supabase calls, auth guards
- The `Navbar`, `Footer`, `handleLogout`, hero section styling
- Any other file in the codebase

### Implementation Complexity
Small — purely presentational refactor of a single component. No new dependencies, no new files, no state changes.