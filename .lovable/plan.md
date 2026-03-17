

## Plan: Fix Assessment Type Badge Logic in Submissions Dashboard

The current logic on line 235 is a simple binary check:
```
sub.assessment_slug === "new-clinic-build" ? "New Clinic" : "Existing Clinic"
```

This means anything that isn't exactly `"new-clinic-build"` (including Healthcare IT) gets labeled "Existing Clinic".

### Change

In `src/pages/admin/SubmissionsDashboard.tsx` (line 235), replace the ternary with a slug-to-label mapping:

```typescript
const assessmentLabel: Record<string, string> = {
  "new-clinic": "New Clinic",
  "existing-clinic": "Existing Clinic",
  "healthcare-it-assessment": "Healthcare IT",
};
// Usage in the badge:
{assessmentLabel[sub.assessment_slug] || sub.assessment_title}
```

This ensures each assessment type gets its correct label, and any future assessments fall back to their database title.

