

## Solutions Pages Consolidation Plan

### Summary
Three changes: (1) Update Navbar link targets with anchor hashes, (2) Full rewrite of SolutionsNewClinics.tsx as "Practice Planning & Development" with 11 sections and anchor IDs, (3) Full rewrite of SolutionsExistingClinics.tsx as "Operating, Growing & Advising" with 9 sections and anchor IDs. Routes stay the same (`/solutions/new-clinics` and `/solutions/existing-clinics`). No new files or route changes needed.

### Part A — Navbar Updates

Update the `planningItems` array to add anchor hashes:
```
#feasibility, #facility-design, #regulatory, #people, #technology
```

Update `operatingItems` array:
- "Billing & Revenue Review" → `/solutions/existing-clinics#billing` (currently points to `/solutions/existing-clinics`)
- "Growth Strategy & Expansion Planning" → `/solutions/existing-clinics#growth` (currently points to `/solutions/existing-clinics`)
- "Mergers, Acquisitions & Transitions" → `/solutions/existing-clinics#transitions` (currently `/contact` — fix)

All other items in operatingItems keep their current targets.

### Part B — SolutionsNewClinics.tsx (Full Rewrite, 11 Sections)

File stays at `src/pages/SolutionsNewClinics.tsx`, route stays `/solutions/new-clinics`.

Updated SEO via `usePageMeta`. All content exactly as specified in the prompt.

**Sections with anchor IDs:**
1. Hero (bg-gradient-hero) — stats strip + 2 CTAs
2. The Planning Challenge (bg-background) — 3 cards (Clock, DollarSign, Settings)
3. `id="feasibility"` — Practice Feasibility & Financial Planning — 2-column layout with stat callout
4. `id="facility-design"` — Facility Development Support — 6-step numbered process flow
5. `id="regulatory"` — Regulatory & Compliance Guidance — 3-card grid + teal disclaimer note
6. `id="people"` — People Strategy — 2-column layout (Recruitment + Culture) with stat callout below, bg-muted/40
7. `id="technology"` — Technology & Software Setup — 2-column feature layout with callout box
8. Development Timeline — keep existing 8-step grid (reuse `developmentStages` data)
9. Coordinated Advisory — keep existing partners section (reuse `partners` data)
10. NHSF Callout — teal card with CTA to /solutions/nhsf
11. Final CTA — dark section

**Design patterns:** Same card styles, section backgrounds (bg-background / bg-muted/30 / bg-gradient-section alternating), and framer-motion fadeUp animations as other pages. Stats strip uses the same 4-glass-card pattern from practice-type pages. People section gets bg-muted/40 for warmth.

### Part C — SolutionsExistingClinics.tsx (Full Rewrite, 9 Sections)

File stays at `src/pages/SolutionsExistingClinics.tsx`, route stays `/solutions/existing-clinics`.

**Sections with anchor IDs:**
1. Hero (bg-gradient-hero) — stats strip + 2 CTAs
2. What Practices Find (bg-background) — 4 cards (DollarSign, Clock, Users, TrendingUp)
3. `id="operations"` — Operations & Workflow — 2-column layout
4. `id="billing"` — Billing & Revenue Review — 3-column (Medical/Dental/Veterinary) with practice-specific billing items + stat callouts + disclaimer
5. `id="people"` — People section — 2-column (Behavioural Profiling + Culture/Performance) with stat callout, bg-muted/40
6. `id="growth"` — Growth Strategy — 2×2 grid (Adding Practitioners, New Service Lines, Additional Locations, Corporate Structuring)
7. `id="transitions"` — Mergers, Acquisitions & Transitions — 3-column feature grid + additional note below
8. Engagement Models — keep existing 3-model cards (Diagnostic Assessment / Implementation Support / Ongoing Advisory)
9. Final CTA

### Technical Details

- **Files modified:** `Navbar.tsx`, `SolutionsNewClinics.tsx`, `SolutionsExistingClinics.tsx`
- **No route changes** in App.tsx
- **Anchor scrolling:** React Router's `<Link to="/solutions/new-clinics#feasibility">` combined with `id="feasibility"` on section divs. May need a `useEffect` with `useLocation` to scroll to hash on page load if navigating from another page.
- **Icons needed:** Clock, DollarSign, Settings, Shield, Building2, FileText, Users, MapPin, TrendingUp, Stethoscope, Smile (lucide), PawPrint, ArrowRight, CheckCircle, Landmark, Scale, Home, Laptop2, Lightbulb, Target, Monitor, Cog, Rocket, ShieldCheck
- **Existing data reused:** `developmentStages` and `partners` arrays from current SolutionsNewClinics.tsx
- **Engagement models reused:** `engagementTypes` array from current SolutionsExistingClinics.tsx

