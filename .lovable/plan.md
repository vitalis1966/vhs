

# Phase 3: Strategic Assessment Page — Complete Rebuild

Full replacement of `src/pages/StrategicAssessment.tsx` with 7 sections.

## File: `src/pages/StrategicAssessment.tsx`

Replace entire file content with the following structure:

**Imports**: Keep `Navbar`, `Footer`, `motion`, `Link`, `Button`, `usePageMeta`. Add icons: `DollarSign`, `Clock`, `TrendingUp`, `ArrowRight`, `ClipboardList`, `FileText`, `MessageSquare`, `Quote`.

**SEO**: Keep existing `usePageMeta` call (title and description already correct).

### Section 1 — Hero (`bg-gradient-hero`)
- H1: "Find Out What Your Practice Assessment Reveals About Your Performance."
- Subheadline paragraph about being too close to operations, seven dimensions, ~15 minutes
- Social proof badge: small muted text "Completed by practices across medical, dental, and veterinary fields in Canada"
- Primary CTA button: "Begin the Free Assessment" → links to `/strategic-assessment/intake`
- Supporting line: "Free. Confidential. Takes approximately 15 minutes."

### Section 2 — Problem Awareness (`bg-background`)
- Heading: "Three patterns we see across almost every practice we assess."
- 3-column grid (`sm:grid-cols-3`) with icon cards:
  - DollarSign / "Billing Gaps" / description
  - Clock / "Workflow Costs" / description
  - TrendingUp / "Blocked Growth" / description

### Section 3 — Seven Dimensions (`bg-gradient-section`)
- Heading + supporting text
- Table with 3 columns: Number | Dimension | What We Look At
- 7 rows as specified, using the site's table styling or a styled grid

### Section 4 — What You Receive (`bg-background`)
- Heading: "What happens after you complete the assessment."
- 3 steps in a horizontal flow (icons + label + text):
  1. ClipboardList / "Complete the Assessment"
  2. FileText / "Receive Your Practice Health Summary"
  3. MessageSquare / "Optional: Review With a Vitalis Consultant"
- Confidentiality note below

### Section 5 — Authority (`bg-gradient-section`)
- Heading: "Built by practitioners. Used by practices across Canada."
- Body paragraph
- Blockquote with quote and attribution, styled with left border + italic

### Section 6 — How It Works (`bg-background`)
- Heading: "Three steps. About 15 minutes."
- Simplified 3-step horizontal row: icon + one-line description each

### Section 7 — Final CTA (`bg-gradient-section`)
- Headline: "The assessment is free. Your results are confidential."
- Body paragraph
- Primary CTA: "Begin the Free Assessment" → `/strategic-assessment/intake`
- Secondary link: "Prefer to speak with someone first? Book a 20-minute call →" → `/contact`

## Files Modified
1. `src/pages/StrategicAssessment.tsx` — full rewrite (single file)

