# Manual Email Paste Intake — Implementation Plan

A temporary workflow that lets a Vitalis OS user paste a raw email, have AI parse it, then save it as a Communications record with linked tasks, an optional meeting, and an optional new contact — until the Outlook integration is built.

## 1. Backend (Lovable Cloud)

### New database tables
- `pasted_emails` — workspace_id, client_id (nullable), project_id (nullable), imported_by (user), from_name, from_email, to_addresses (jsonb), subject, sent_at, raw_body, ai_summary, ai_category, ai_payload (jsonb full parse), source = `'manual_paste'`, created_at.
- Extend `tasks` with optional `source_email_id` (FK → pasted_emails) and `source_kind` text (e.g. `'email_manual_paste'`).
- Extend `meetings` with optional `source_email_id` (FK → pasted_emails).
- Extend `contacts` with optional `needs_review` boolean + `created_from` text.

RLS: workspace-scoped via existing `is_workspace_member` pattern. Grants for `authenticated` + `service_role`.

### New edge function: `parse-pasted-email`
- Auth: validates JWT, resolves caller's workspace.
- Input: `{ raw_email: string, workspace_id, client_id? }`.
- Calls Lovable AI Gateway (`google/gemini-3-flash-preview`) with a structured tool-calling schema returning:
  - headers (from name/email, to[], subject, sent_at)
  - summary, category (enum)
  - action_items[] (title, suggested_assignee_hint, due_date_iso?, priority)
  - meeting? (title, starts_at, ends_at?, location, attendees[], agenda)
  - mentioned_people[] (name, role)
  - financials[] (amount, currency, reference)
  - detected_dates[]
- Server also runs contact/client matching against `contacts` (by email, then domain) and `clients` (by domain or name) and returns suggested matches.
- Returns parsed JSON to the client — does NOT persist yet (review step happens in UI).

### New edge function: `save-pasted-email`
- Input: confirmed payload from review panel (email fields + selected client/project + chosen action items + meeting flag + contact-create flag).
- Inserts: pasted_email row, optional new contact, tasks (with assignees via `task_assignees`), optional meeting + attendees. All in one transaction-style sequence with rollback on failure.

## 2. Frontend

### New component: `PasteEmailDialog`
Path: `src/components/app/email/PasteEmailDialog.tsx`. Two-step modal:

**Step 1 — Input**
- Optional Client select (uses workspace clients).
- Optional Project select (filtered to chosen client).
- Large `Textarea` for raw email.
- "Parse & Import" button → calls `parse-pasted-email`, shows loading spinner.

**Step 2 — Review panel**
- Parsed email summary card (From/Date/Subject/Category/Summary).
- Suggested Client & Project with Change buttons (open inline pickers).
- New-contact callout if sender unmatched, with checkbox "Create new contact".
- Action items list with checkbox + editable title, assignee picker (workspace members), date picker, priority select. Default: checked, assignee = current user, due = +3 business days if AI didn't supply one.
- Meeting card (if detected) with editable title/date/attendees + "Create meeting record" checkbox.
- Footer: "Save all", "Save email only", "Cancel".

### Access points
- `CommunicationsSection.tsx` — add "Paste Email" button in card header.
- `AppTopBar.tsx` — add "Paste Email" button (prominent dashboard placement).
- Inside a client record's Communications/Emails tab (`EmailsTab.tsx`) — header button that opens the dialog with `clientId` pre-selected.
- Global keyboard shortcut `Ctrl/Cmd+Shift+V` registered in `AppLayout.tsx` (only when an input isn't focused, to avoid hijacking paste).

### History / list view
- `EmailsTab.tsx` shows pasted emails alongside sent emails (union query). Pasted rows show a "Manual import" badge, category badge, task count chip linking to filtered tasks, and an expandable body view.

## 3. AI prompt & schema
System prompt anchors on Vitalis OS terminology, asks the model to be conservative (no invented dates/people). Tool schema kept small per AI Gateway guidance — short enums, no regex/format constraints, flat structure.

## 4. Out of scope (called out)
- Outlook OAuth/sync — intentionally deferred; this is the manual fallback.
- Calendar integration — checkbox shown but inert unless calendar integration already exists; will simply create the meeting record.
- @mention rendering in task descriptions is text-only (uses workspace members' display names); no notification fan-out beyond existing task-assignment notifications.

## Technical notes
- Tables: `pasted_emails` + extension columns on `tasks`, `meetings`, `contacts`.
- Edge functions: `parse-pasted-email`, `save-pasted-email` (both `verify_jwt = true`).
- AI model: `google/gemini-3-flash-preview` via Lovable AI Gateway, tool-calling mode for structured output, with `tryParseJSON` fallback.
- UI files added: `PasteEmailDialog.tsx`, `PasteEmailReview.tsx` (sub-component), and a small `usePasteEmailHotkey` hook.
- Touched UI files: `CommunicationsSection.tsx`, `AppTopBar.tsx`, `AppLayout.tsx`, `EmailsTab.tsx`.

```text
[Paste Email button] → PasteEmailDialog
        │
        ├─ Step 1: textarea + client/project
        │      └─ POST /parse-pasted-email ──► Lovable AI Gateway
        │
        └─ Step 2: review panel
               └─ POST /save-pasted-email
                       ├─ insert pasted_emails
                       ├─ insert contact (if flagged)
                       ├─ insert tasks (+ assignees)
                       └─ insert meeting (+ attendees)
```
