

# Phase 2: About Page Rewrite + SEO Foundations

## 1. About Page Full Rewrite (`src/pages/About.tsx`)

**Hero section**: Replace headline "A strategic healthcare advisory partner." with "Built by Clinicians. Focused on Practice Performance." Replace the opening paragraph with the three-paragraph origin story block.

**Remove sections**: Remove the current "What we do" / "How we're different" two-column section (lines 73–105) and the 3Ps Philosophy section (lines 107–131).

**Replace with three new blocks** (How We Work / Who We Work With / What Makes Us Different), each with a heading and body paragraph as specified. Use the same card/section styling as the current page.

**CTA section**: Replace "Ready to work with Vitalis?" with heading "Work With a Team That Has Been There" and button "Talk to a Vitalis Advisor →".

**Keep**: Team section exactly as-is (including "Meet the Team" / "View Our Mission & Vision" link).

## 2. SEO — Page Titles via `useEffect`

Since there's no react-helmet and no per-page title system, add a `useEffect` to each page component that sets `document.title` on mount. This is the standard React SPA approach.

**Files to add `useEffect` with `document.title`:**
- `Index.tsx` — "Healthcare Consulting for Medical, Dental & Veterinary Practices | Vitalis Health Strategies | Calgary, Alberta"
- `About.tsx` — "About Vitalis Health Strategies | Clinician-Led Practice Consulting | Calgary, Alberta"
- `StrategicAssessment.tsx` — "Free Practice Assessment | Operational & Financial Analysis | Vitalis Health Strategies"
- `SolutionsNewClinics.tsx` — "New Medical, Dental & Veterinary Facility Development | Practice Build Consulting | Vitalis"
- `SolutionsExistingClinics.tsx` — "Practice Operations Consulting & Workflow Optimization | Vitalis Health Strategies"
- `HealthcareIT.tsx` — "Digital Transformation for Healthcare Practices | EMR & Technology Consulting | Vitalis"
- `Contact.tsx`, `HowWeWork.tsx`, `Engagement.tsx`, `Portfolio.tsx`, `Partners.tsx`, `MissionVision.tsx`, `ClinicAudit.tsx`, `Solutions.tsx`

Also update `index.html` default title and meta description to match the homepage values.

## 3. SEO — Meta Descriptions

Add a meta description tag dynamically alongside the title in each page's `useEffect`. Create a small helper function (e.g. `setPageMeta(title, description)`) to avoid repetition, placed in `src/lib/utils.ts` or a new `src/lib/seo.ts`.

## 4. Internal Linking Rules

**Rule 1** (every service page links to Strategic Assessment): Add contextual links in the first/second paragraph of:
- `SolutionsNewClinics.tsx` — anchor: "free practice assessment"
- `SolutionsExistingClinics.tsx` — anchor: "Vitalis Practice Assessment"
- `HealthcareIT.tsx` — anchor: "free practice assessment"
- `Engagement.tsx` — anchor: "free practice assessment"
- `HowWeWork.tsx` — already has assessment link
- `Solutions.tsx` — already has assessment link

**Rule 2** (every service page links to About): Add link with anchor "clinician-led team" or "our team" in body copy of the same service pages.

**Rule 3** (Strategic Assessment links to 4 service pages): Add a paragraph in `StrategicAssessment.tsx` below the "Two Assessment Paths" section: "Your assessment results may point toward [Operations & Workflow Optimization], [Billing & Revenue Review], [Growth Strategy & Expansion Planning], or [Fractional & Advisory Leadership]." with links to `/solutions/existing-clinics`, `/solutions/existing-clinics`, `/solutions/existing-clinics`, `/engagement`.

**Rule 5** (New Builds links to Operations page): Add link in `SolutionsNewClinics.tsx` with anchor "as your practice grows" linking to `/solutions/existing-clinics`.

**Rule 6** (Nav track labels not clickable): Already implemented correctly — track names are `<p>` tags, not links.

Rules 4 (blog/insights articles) — no blog/insights pages exist yet, so nothing to do.

## Files Modified

1. `src/pages/About.tsx` — full rewrite
2. `src/lib/seo.ts` — new helper for setting title + meta description
3. `index.html` — update default title and meta description
4. `src/pages/Index.tsx` — add SEO hook
5. `src/pages/StrategicAssessment.tsx` — add SEO hook + Rule 3 links
6. `src/pages/SolutionsNewClinics.tsx` — add SEO hook + Rules 1, 2, 5 links
7. `src/pages/SolutionsExistingClinics.tsx` — add SEO hook + Rules 1, 2 links
8. `src/pages/HealthcareIT.tsx` — add SEO hook + Rules 1, 2 links
9. `src/pages/Solutions.tsx` — add SEO hook + Rules 1, 2 links
10. `src/pages/Contact.tsx` — add SEO hook
11. `src/pages/HowWeWork.tsx` — add SEO hook + Rules 1, 2 links
12. `src/pages/Engagement.tsx` — add SEO hook + Rules 1, 2 links
13. `src/pages/Portfolio.tsx` — add SEO hook
14. `src/pages/Partners.tsx` — add SEO hook
15. `src/pages/MissionVision.tsx` — add SEO hook
16. `src/pages/ClinicAudit.tsx` — add SEO hook

