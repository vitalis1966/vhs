

## Plan: Add Healthcare IT Assessment Tile + Routing

### Changes

**1. `src/pages/StrategicAssessment.tsx`** — Add 3rd tile in the "Which assessment fits your situation?" section

- Change grid from `md:grid-cols-2` to `md:grid-cols-3`
- Add a 3rd card styled consistently with the other two:
  - Eyebrow tag: "NEW OR EXISTING PRACTICE" (similar style to existing tags, using a distinct color like `sky` or reusing `primary`)
  - Icon: `Monitor` (from lucide-react) in matching icon container
  - Title: "Healthcare IT Assessment"
  - Description: Focused on IT infrastructure, cybersecurity, EMR, and technology operations for healthcare practices — whether establishing new systems or improving existing ones.
  - "What you will receive" list with 3 relevant items (IT infrastructure review, cybersecurity posture, EMR/software optimization guidance)
  - Ideal for line: practices needing IT infrastructure, cybersecurity, or EMR advisory
  - Button: "Start Your Healthcare IT Assessment →" linking to `/strategic-assessment/intake?path=healthcare-it`
- Import `Monitor` from lucide-react

**2. `src/pages/StrategicAssessmentIntake.tsx`** — Route Healthcare IT selections to the correct assessment

- Update `determineTrack` to return a new track value `"healthcare_it"` when `assessment_purpose` is `"healthcare_it_new"` or `"healthcare_it_existing"`
- Update the slug determination logic (line 218): add a condition so when `track === "healthcare_it"`, the slug is `"healthcare-it-assessment"` (matching the DB record created earlier)
- Change from simple ternary to if/else or mapping: `new_clinic_build` → `"new-clinic"`, `existing_clinic` → `"existing-clinic"`, `healthcare_it` → `"healthcare-it-assessment"`

### Data flow
- `assessmentPurposeOptions` already has `healthcare_it_new` and `healthcare_it_existing` entries but both map to generic `"new"` / `"existing"` tracks
- Change their `track` values to `"healthcare_it"` so `determineTrack` returns the dedicated track
- This ensures the intake creates a session linked to the Healthcare IT Assessment in the DB

