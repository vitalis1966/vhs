
Goal: stop the public report page from showing “Report Not Available” while a valid report token exists but the report payload is still being generated.

What I found
- The real submit flow is:
```text
/assessment/:accessToken/report
  -> AssessmentReport.tsx calls prepare-assessment-report
  -> redirects to /report/:reportToken
  -> ClientReportView.tsx loads the report
```
- The regression is mainly in `src/pages/ClientReportView.tsx`, not the route config.
- `ClientReportView` already has an initial loading spinner, but after the first RPC completes it treats `valid token + no report row yet` as a terminal error:
  - `get_report_by_token` returns session/intake data even when `report` is null
  - the component then hits `if (!report || !session) -> "Report Not Available"`
- There is also a backend analytics issue: `get_report_by_token` currently increments `access_count` before confirming the report exists, so naive polling would falsely count retries as real opens.

Implementation plan
1. Update `public.get_report_by_token` in one SQL migration
   - Keep invalid / expired / revoked behavior as-is.
   - Treat `valid token but no report yet` as an explicit pending state instead of a generic empty payload.
   - Move access tracking so `access_count` / `accessed_at` only update when a real report is returned, not during pending retries.
   - Add a clear log for the pending case to help diagnose slow report generation.

2. Update `src/pages/ClientReportView.tsx`
   - Replace the current one-shot load with mount-safe polling.
   - Poll every 5 seconds for up to 2 minutes.
   - State model:
     - `loading`: first fetch
     - `preparing`: valid token, report still pending
     - `ready`: render report
     - terminal errors: invalid / expired / revoked / timeout / unexpected failure
   - Retry only for the explicit pending state.
   - Stop immediately for invalid, expired, revoked, or unexpected RPC/network errors.
   - On timeout, show the existing “Report Not Available” UI unchanged.

3. Keep the UI minimal and branded
   - Reuse the current spinner/logo layout.
   - Initial copy: “Loading your report…”
   - Pending copy after first pending response: “Your report is being prepared, please wait…”
   - Do not change the existing error screen design.

4. Add a regression-prevention comment in `ClientReportView.tsx`
   - Explain that a valid report token can exist before the report row is ready.
   - Explain that this route must poll instead of falling through to the error screen immediately.
   - Explain that polling is intentionally tied to route mount so it also works after page refresh.

5. Validation
   - Submit an assessment and open the report immediately: page should stay in loading/preparing, then render once ready.
   - Refresh `/report/:token` during preparation: it should resume polling and still recover.
   - Test invalid, expired, and revoked tokens: they should still show their current error screens immediately.
   - Verify link activity remains accurate: pending retries should not inflate access counts.

Files to change
- `src/pages/ClientReportView.tsx`
- `supabase/migrations/...sql` (update `public.get_report_by_token`)

What I would not change
- `prepare-assessment-report`
- `AssessmentReport.tsx` unless testing reveals a separate pre-redirect failure
- report layout/content
- email templates
- admin pages
