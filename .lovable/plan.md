

## Changes to `src/pages/Partners.tsx`

Two targeted edits, no other files touched.

### Change 1 — Remove Coordination Problem section (lines 154–194)
Delete the entire "SECTION 2 — The Coordination Problem" block including the `coordinationProblems` data array (lines 35–48). Also remove the `AlertTriangle` import since it will no longer be used.

### Change 2 — Replace "The difference between coordination and referral" section (lines 369–403)
Replace Section 6 with the new "ONE ECOSYSTEM" section containing:
- Eyebrow: "ONE ECOSYSTEM"
- Heading: "Built together. Aligned from the start."
- Subheading describing the ecosystem model
- 2×2 card grid with 4 cards (Users, Target, Layers, Shield icons)
- Card style: `bg-card rounded-2xl shadow-sm border border-border/40 p-7` — matching the featured partner card aesthetic

New imports needed: `Users`, `Target`, `Layers`, `Shield` from lucide-react. Remove unused `AlertTriangle`, `X`, `Check`. Remove unused `coordinationProblems`, `referralPoints`, `ecosystemPoints` data arrays.

