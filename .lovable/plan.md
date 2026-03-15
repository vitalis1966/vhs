

# Audience Expansion & Tone Update Plan

This is a large copy and structural update across the site. Here is the full scope of changes organized by file.

---

## Technical Summary

**Files to modify (15+ files):**

### 1. HeroSection.tsx — Section 1 & 2
- Replace headline: "Your practice is a blank canvas..." → "Clinic Strategy for Medical, Dental, and Veterinary Practices — at Every Stage of Your Journey."
- Replace subheadline paragraph with the new copy about medical, dental, and veterinary practices
- Change primary CTA: "Book a Consultation" → "Explore a Free Practice Assessment" (link to `/strategic-assessment/intake`)
- Change secondary CTA: "Strategic Assessment" → "Planning a New Facility? Start Here →" (link to `/solutions/new-clinics`)
- Update `heroStats` array to 4 items with new metric text:
  - "200+ Practices Supported Across Canada"
  - "$40M+ in Revenue Gaps Identified Across Client Assessments"
  - "15+ New Facilities Guided from Concept to Opening"
  - "Medical · Dental · Veterinary | Every Stage, One Team"
- Update stats grid from 3-col to 4-col

### 2. CredibilitySection.tsx — Section 3 (Authority Block)
- This section doesn't have the exact text from the user's "from" copy, but the credibility cards contain "clinic" references. Update:
  - Card 3: "from their first clinic build" → "from their first practice build"
  - Card 4: "clinics, surgical centers, physician groups" → "medical, dental, and veterinary practices, surgical centers, and healthcare organizations"
- Add a new authority paragraph or update existing intro text to match: "Vitalis was founded by clinicians and healthcare executives who have built, run, and grown private practices — not just advised them. Our team includes experience across medical, dental, and veterinary operations. We understand the day-to-day realities of running a practice because we have lived them."

### 3. HealthcarePathwaysSection.tsx — Section 4
- Change section heading: "Where are you in your journey?" → "Where is your practice right now?"
- Update subheading paragraph: replace "physicians" → "practitioners", "clinic" → "practice"
- Card 1: eyebrow → "Planning & Building", title → "Planning & Building", body text per spec, CTA → "See How We Support New Builds →", href → `/solutions/new-clinics`
- Card 2: eyebrow → "Operating & Growing", title → "Operating & Growing", body text per spec, CTA → "Learn About Our Practice Assessment →", href → `/strategic-assessment/intake`
- Card 3: eyebrow → "Scaling or Transitioning", title → "Scaling or Transitioning", body text per spec, CTA → "Explore Advisory Services →", href → `/contact`
- Update services bullet lists accordingly

### 4. SolutionsNewClinics.tsx — Section 5
- Change page headline: "Planning a new clinic? Start here." → "Opening a new practice involves a lot of moving parts. We help you plan, structure, and prepare for each one."
- Update intro paragraph with new copy about medical, dental, veterinary
- Update hero eyebrow: "Solutions for New Clinics" → "Solutions for New Practices"
- Update CTA button text to use invitational tone: "Talk to Us About Your Build →"
- Replace all "physician" → "practitioner" where appropriate
- Replace "clinic" → "practice" in body text (keeping "medical clinic" where contextually correct)

### 5. SolutionsExistingClinics.tsx — Section 6
- Change page headline: "Optimize and grow your practice." → "Most practices are running well. There is almost always room to run better."
- Update intro paragraph with new copy (no percentages)
- Update eyebrow: "Solutions for Existing Clinics" → "Solutions for Existing Practices"
- Replace "clinic leaders" → "practice leaders"
- Update closing CTA: "Learn About the Practice Assessment →"
- Update services/bullet descriptions per spec

### 6. Navbar.tsx — Section 7 (Solutions Dropdown)
- Restructure Solutions dropdown from flat list to two grouped tracks:
  - **Track A — Planning & Building a Practice**: 5 items linking to `/solutions/new-clinics`
  - **Track B — Operating, Growing & Advising**: 7 items linking to existing pages (`/strategic-assessment/intake`, `/solutions/existing-clinics`, `/contact`, etc.)
- Dropdown will render with visible group headers and items below each
- Update dropdown width to accommodate the two-column layout
- Mobile menu: show both tracks with headers

### 7. MnASection.tsx — Tone/terminology update
- Change eyebrow: "Mergers, Acquisitions & Exits" → "Mergers, Acquisitions & Transitions"
- Remove "exit" from prominent position
- Change headline: "Curious about a potential sale?" → "Considering a transition or partnership change?"
- Soften language: remove "ensure you receive the maximum value", replace with factual framing
- Replace "clinic" → "practice", "physician" → "clinician/practitioner"

### 8. Footer.tsx — Global terminology
- "New Clinic Builds" → "New Practice Builds"
- "Clinic Audit" → "Practice Assessment"
- Footer brand description: replace "clinics" → "practices", remove "inception-to-exit"

### 9. SolutionsPreview.tsx — Terminology
- "New Clinic Track" → "New Practice Track"
- "Solutions for New Clinics" → "Solutions for New Practices"
- "Solutions for Existing Clinics" → "Solutions for Existing Practices"
- "Planning a Clinic?" → "Planning a Practice?"
- "Improve Your Practice" → "Learn About Our Assessment" (softer CTA)
- Replace "clinic" → "practice" in descriptions

### 10. LifecycleSection.tsx — Terminology
- "new clinic" → "new practice" in stage descriptions
- "physicians" → "practitioners" in descriptions

### 11. ThreePsSection.tsx — Terminology
- "Physician" pillar label: keep as-is (it's the framework name)
- But update "Physician" description slightly to be more inclusive

### 12. StrategicEcosystemSection.tsx — Terminology
- "Physicians launching or growing clinics" → "Practitioners launching or growing practices"

### 13. Additional pages (global find/replace scope):
- **ClinicAudit.tsx**: "Clinic Build Readiness" → "Practice Build Readiness", "clinic" → "practice", CTAs softened
- **Contact.tsx**: "New Clinic Build" → "New Practice Build", "Physician Recruitment" → "Practitioner Recruitment", "Clinic Audit" → "Practice Assessment", "Start a Clinic Audit" → "Explore a Practice Assessment"
- **HowWeWork.tsx**: "Start a Clinic Audit" → "Explore a Practice Assessment", "clinics" → "practices"
- **Engagement.tsx**: "Physicians and clinic leaders" → "Practitioners and practice leaders", "clinic" → "practice"
- **Solutions.tsx**: "New Clinic" → "New Practice", "clinic" → "practice" in descriptions, "physicians" → "practitioners"
- **Portfolio.tsx**: "Clinic" → "Practice" in project titles/descriptions
- **About.tsx**: Keep "physician" where it refers to actual professional titles; update "clinic" → "practice" in general copy
- **Partners.tsx**: "clinics" → "practices" in general copy
- **HealthcareIT.tsx**: "clinic" → "practice" in most places
- **MissionVision.tsx**: "physicians" → "practitioners" except in proper/legal contexts, "clinic" → "practice"

### 14. ProcessSection.tsx — No major changes needed (generic language already)

### 15. AuditCtaSection.tsx & FinalCtaSection.tsx — CTA softening
- Already updated to point to `/strategic-assessment/intake`; soften any remaining command-style CTAs

---

## Key Principles Applied Throughout
- **"clinic" → "practice"** everywhere except "medical clinic" in specific context
- **"physician" → "clinician" or "practitioner"** except About/Team page professional titles and legal/regulatory contexts
- **CTAs**: "Learn", "Explore", "See", "Talk to us" instead of "Get", "Start", "Book", "Request"
- **Metrics**: framed as factual ("identified", "guided", "supported") not promises
- **No "exit"** in prominent positions
- **No implication** of underperformance

