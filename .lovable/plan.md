

## Practice-Type Pages — Full Redesign Plan

### Summary
Full rewrite of Medical.tsx, Dental.tsx, and Veterinary.tsx. The content is fully specified in the prompt. The previous versions had complex custom layouts (interactive explorers, alternating rows, stacked panels) that rendered poorly. This rewrite uses clean, proven component patterns with creative visual variety across pages.

### Design Approach — Consistent Foundations, Varied Sections

**Shared across all three pages** (visual consistency):
- Hero: centered text, stats strip as 4 glass cards, two CTAs — identical layout
- Two Paths (Section 4): identical card component — two rounded-2xl cards side by side with eyebrow badge, heading, body, checklist with CheckCircle icons, full-width CTA button
- NHSF Callout: identical teal card treatment (bg-primary/5, border-primary/20)
- Case Studies: identical 3-column card grid with accent tag, bold headline, body
- Final CTA: identical dark teal section with centered heading + two buttons
- All entrance animations: `framer-motion` fadeUp, consistent with HowWeWork/About pages

**Visual variety per page** (different section treatments):

#### Medical — "Clean Professional"
- **Challenges (S2)**: 4-card grid with large teal icon in a rounded square, bold heading, body text. Simple, clean cards on bg-background.
- **Services (S3)**: 3×3 icon card grid. Each card: icon in secondary circle, heading, description, optional link. Standard card treatment, no color-coded borders or interactive explorer.
- **Practice Types (S5)**: 4×2 icon grid on bg-muted/30 — compact cards with centered icon + label + short description.
- **Regulatory (S6)**: 3 feature cards with large centered icon, heading, body. National note italic below.
- **Geography (S7)**: 3 location cards with MapPin icon.
- **Process (S9)**: Horizontal 4-step with numbered circles connected by a line (keep existing implementation — it works well).

#### Dental — "Numbers-Forward"
- **Challenges (S2)**: 4 large stat callout cards — keep the existing large-number treatment (56px accent stat + heading + body). It looks good and differentiates from Medical.
- **Services (S3)**: 3×3 card grid — clean white cards with icon, heading, description. No color-coded top borders (per prompt). Simple shadow-sm rounded-xl.
- **Practice Types (S5)**: 6-item grid as compact cards with icon + label + description (2×3 on desktop).
- **Regulatory (S6)**: 3 clean feature cards (same pattern as Medical S6).
- **Financial Snapshot (S7)**: 3 large stat numbers on a light amber-tinted strip — keep existing treatment, it renders well.

#### Veterinary — "Warm & Approachable"
- **Challenges (S2)**: 4-card grid with amber-tinted left border accent (4px border-l) — warm, attention-getting without complexity.
- **Services (S3)**: 3×3 icon card grid — same clean pattern as Medical/Dental but with slightly warmer card treatment (bg-card with subtle shadow).
- **Practice Types (S5)**: 6-item grid as cards with large icon circles + heading + description.
- **Corporate Acquisition (S6)**: 4-card 2×2 grid with colored left borders — keep existing treatment, it works.
- **Geography (S7)**: 3 location cards with MapPin — same as Medical.

### Technical Details

**Files modified:**
- `src/pages/solutions/Medical.tsx` — full rewrite (~380 lines)
- `src/pages/solutions/Dental.tsx` — full rewrite (~340 lines)
- `src/pages/solutions/Veterinary.tsx` — full rewrite (~370 lines)

**Key simplifications from previous version:**
- Medical: Remove `useState` for interactive service explorer and accordion. Replace with static 3×3 grid + mobile-friendly layout.
- Dental: Remove color-coded top borders on service cards. Remove 2-column split regulatory layout. Use simple card grids.
- Veterinary: Remove alternating full-width rows for challenges and practice types. Remove stacked editorial panels for two-path. Use standard card grids and the shared two-path card component.

**Content**: All content exactly as specified in the prompt — headings, body copy, stats, services, practice types, regulatory features, geographic cards, NHSF callout, case studies, and final CTA. SEO metadata via `usePageMeta`.

**No new dependencies needed.** All using existing: framer-motion, lucide-react icons, Button component, Link from react-router-dom, Tailwind classes, CSS variables.

