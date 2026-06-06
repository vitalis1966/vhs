## Root cause (confirmed)

Investigated all four checkpoints:

1. **List query** (`src/pages/app/Inbox.tsx` line 85) already SELECTs `body_text, body_html`. ✅ Not the cause.
2. **Body column names** in `inbound_emails` are `body_text` (text) and `body_html` (text). The viewer reads these correctly. ✅ Not the cause.
3. **Viewer panel** (`src/components/app/inbox/EmailViewerSheet.tsx`) reads `body_text`/`body_html` from the passed row, prefers HTML, falls back to text, then shows "No body content". ✅ Correct.
4. **Webhook handler** (`supabase/functions/email-inbound/index.ts`) — root cause. Database check confirms the one existing inbound row has `body_text = NULL` and `body_html = NULL`. The handler only checks `data.text` / `data.html` / `data.body_text` / `data.body_html` on the root payload, but inbound email providers (Resend, Cloudflare Email Routing, Postmark, Mailgun, SendGrid) nest the body under various keys.

## Fix — single file: `supabase/functions/email-inbound/index.ts`

Make body extraction tolerant of all common inbound payload shapes. No schema change, no frontend change, no other features touched.

### Changes

1. Add a `pickBody(payload)` helper that walks known body locations in order and returns `{ text, html }`:
   - `data.text` / `data.html` (Resend, generic)
   - `data.body_text` / `data.body_html`
   - `data.email.text` / `data.email.html` (nested Resend variant)
   - `data.parsedEmail.text` / `data.parsedEmail.html` (CF Email Workers + parsers)
   - `data['body-plain']` / `data['body-html']` (Mailgun)
   - `data.TextBody` / `data.HtmlBody` (Postmark)
   - `data.plain` / `data.html_content`
2. Apply the same fallback for `subject` (also check `data.email.subject`, etc.) and `from` so nested payloads still produce a valid row.
3. Log the **top-level keys** of the received payload (not the content) on insert so future malformed payloads are diagnosable without leaking PII.
4. Keep the `upsert ... ignoreDuplicates: true` behaviour. If a duplicate `resend_email_id` already exists with NULL bodies, switch to a conditional update so the body backfills on retry (only when current row has null body).

### Out of scope

- No changes to Inbox list query, viewer panel layout/header, row layout, or any other UI.
- No schema changes (columns already exist).
- No new dependencies.
- No changes to VHS Administration or other Vitalis OS features.
- No changes to webhook auth, signature verification, or routing.

### Verification

- Redeploy `email-inbound`; send a test inbound email; confirm `body_text` and/or `body_html` are non-null in `inbound_emails`; open in Inbox viewer and confirm content renders.
- Existing row with NULL body stays as-is (genuinely empty after fix attempts) — viewer's "No body content" is then accurate.