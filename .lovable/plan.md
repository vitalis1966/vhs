

## Plan: Fix Report Link Validation

### Root Cause

Two separate issues cause "This Link Is Not Valid":

1. **Token format**: `send-assessment-email` generates composite tokens (`UUID-UUID_no_dashes`). These are stored and emailed correctly, but the format is unnecessarily fragile. Simplify to a single UUID.

2. **Legacy redirect is broken**: `/assessment/:token/report` blindly redirects the assessment `access_token` into `/report/:token`, but `/report/:token` expects a `client_report_tokens.token` — a completely different token system. This always fails.

### Changes

**1. Simplify token generation** (`supabase/functions/send-assessment-email/index.ts`)
- Replace `crypto.randomUUID() + '-' + crypto.randomUUID().replace(/-/g, '')` with `crypto.randomUUID()`
- Make token insert mandatory: if it fails, return an error instead of sending a broken link
- Existing composite tokens already stored in the database remain valid (no backfill needed)

**2. Create edge function `resolve-assessment-report`** (new file: `supabase/functions/resolve-assessment-report/index.ts`)
- Accepts POST `{ access_token: string }`
- Uses service role to look up `assessment_sessions` by `access_token` → get `session_id`
- Queries `client_report_tokens` for that `session_id` where `is_revoked = false` and `expires_at > now()`, ordered by `created_at desc`, limit 1
- Returns `{ report_token: "..." }` or `{ error: "no_report" }`
- No JWT required (public endpoint, same as the report page itself)
- No token join logic exposed to the browser

**3. Update `AssessmentReport.tsx`** — replace the blind `<Navigate to="/report/:token">` redirect with:
- Call the `resolve-assessment-report` edge function with the assessment access token
- If a valid report token is returned, redirect to `/report/<report_token>`
- If not, show an error state ("Report not available yet")

**4. Add server-side diagnostics to `get_report_by_token`** (SQL migration)
- Add `RAISE LOG` statements for: token not found, token revoked, token expired, session not found, report not found
- No behavior change; just logging for future debugging

**5. Update `EmailAutomationService.ts`** — fix `sendCompletionConfirmation` so it no longer builds `/assessment/:token/report` URLs (these are broken). Remove the `report_url` from completion confirmation template data, since the actual report link is sent separately via `client_report` email type.

### Files to change
- `supabase/functions/send-assessment-email/index.ts` — simplify token format, mandatory insert
- `supabase/functions/resolve-assessment-report/index.ts` — new edge function
- `supabase/config.toml` — register new function with `verify_jwt = false`
- `src/pages/assessment/AssessmentReport.tsx` — call edge function instead of blind redirect
- `src/services/EmailAutomationService.ts` — remove broken report URL construction
- One SQL migration — add RAISE LOG to `get_report_by_token`

### What does NOT change
- Report content, PDF generation, admin pages
- `/report/:token` public page (ClientReportView.tsx)
- Email HTML templates
- Any other edge functions

