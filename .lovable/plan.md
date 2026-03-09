

## Phase 1 Enhancements — Close Gaps in Existing Implementation

Phase 1 is already built and working. These are targeted refinements to match the updated spec.

### 1. Database Migration
Add `assignment_reason` column (text, nullable) to `assessment_intakes`.

### 2. Update `StrategicAssessmentIntake.tsx`

**Enhanced routing logic** — Replace `determineTrack()` with a smarter function that:
- Uses `assessment_purpose` as primary signal
- Falls back to `planning_new_facility` and `currently_operating` when purpose is "not_sure"
- Returns `{ track, reason }` tuple (e.g. `{ track: "new_clinic_build", reason: "planning_new_facility:yes" }`)
- Uses "needs_review" instead of "unknown" for ambiguous cases

**Updated radio options:**
- "Are you currently operating?" → Yes / No / In Planning
- "Planning a new facility or expansion?" → Yes / No / Exploring Options

**Track value rename:** `new_clinic` → `new_clinic_build`, `unknown` → `needs_review`

**Store `assignment_reason`** in the insert payload.

### 3. Update `StrategicAssessmentConfirmation.tsx`
- Update `trackContent` keys from `new_clinic` → `new_clinic_build` and `unknown` → `needs_review`

### Files Changed
- `src/pages/StrategicAssessmentIntake.tsx` — routing logic, radio options, track naming, assignment_reason
- `src/pages/StrategicAssessmentConfirmation.tsx` — track key rename
- New migration — add `assignment_reason` column

