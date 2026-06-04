# Email Inbox for Vitalis OS

A new, self-contained feature. No existing functionality changes. All UI reuses Vitalis OS tokens, fonts, and the existing TaskFormDialog side panel.

## Decisions confirmed
- **AI provider**: Lovable AI Gateway, model `google/gemini-2.5-pro` (no extra API key).
- **Webhook auth**: shared secret header `X-Webhook-Secret` matched against a new secret `RESEND_WEBHOOK_SECRET`.
- **Admin visibility**: workspace admins/managers see all inbound emails; everyone else only sees their own.
- **Inbound address**: I'll use a placeholder `inbox@inbound.vitalisstrategies.com` in the empty state — you can swap it once Resend is configured.

## 1. Database (single migration)

**`inbound_emails`** as specified, plus:
- index on `(workspace_id, received_at desc)` and `(assigned_to, status)`.
- trigger to keep `updated_at` fresh.

**`email_task_extractions`** as specified, plus index on `email_id`.

**RLS / GRANTs**
- `GRANT SELECT, UPDATE, DELETE` on `inbound_emails` to `authenticated`; `GRANT ALL` to `service_role`. No `anon`.
- `inbound_emails` policies:
  - SELECT/UPDATE/DELETE: `assigned_to = auth.uid()` OR `is_workspace_admin_or_manager(workspace_id)`.
  - No INSERT policy → only `service_role` (edge function) can insert.
- `email_task_extractions`:
  - SELECT: visible if parent email is visible (subquery against `inbound_emails`).
  - INSERT: `authenticated` users who can see the parent email (so "Extract to Task" works from the client).
  - DELETE cascades via FK.

## 2. Edge function — `email-inbound`

- POST only, CORS headers, public (no JWT — Resend won't send one).
- Validate `X-Webhook-Secret` header against `Deno.env.get('RESEND_WEBHOOK_SECRET')`. 401 on mismatch.
- Parse Resend inbound payload (`from`, `subject`, `text`, `html`, `email_id`, optional `from_name`).
- Use service role client to:
  1. Look up `workspace_members` (joined to `profiles.email`) where `email = from_email` and `status='active'` → take first match.
  2. If no match: look up `auth.users` by email `admin@vitalisstrategies.com` via admin API → assign to that user, use their primary workspace.
  3. If still no match: leave `assigned_to` null and pick the oldest workspace as default.
  4. Insert into `inbound_emails` with `on conflict (resend_email_id) do nothing`.
- Strip attachments entirely (never read or store).
- Returns 200 `{ok:true}`; 400 on missing required fields; 401 on bad secret.
- Add `secrets--add_secret` request for `RESEND_WEBHOOK_SECRET` so you can paste the value Resend gives you.

## 3. Frontend

### Routing & sidebar
- New route `/app/inbox` → `src/pages/app/Inbox.tsx` (lazy).
- Add **Inbox** item to `AppSidebar` between Home and My Tasks, using the `Inbox` Lucide icon, with a small badge showing count of `status='not_assigned'` rows visible to the user (live via a polled query, every 60s).

### Inbox page
- Header: title "Inbox" + subtitle "Emails forwarded to Vitalis OS for task extraction".
- Table built with existing `Table` primitives (matches `TaskTable` look): From / Subject / Received / Status / Actions.
  - From: display name + email beneath in `text-xs text-muted-foreground`.
  - Subject: truncated with title tooltip.
  - Received: `formatDistanceToNow` from date-fns, full date in title.
  - Status: inline dropdown (Popover + colored dot) — red/green/orange dots matching existing Tasks status pattern.
  - Actions: existing `DropdownMenu` with **Extract to Task** and **Delete** (confirm via `AlertDialog`).
- Row click (outside status/menu) opens a `Sheet` showing full email (subject, from, received, body — prefer `body_text`, fall back to sanitized `body_html` rendered as `<pre>` or via `dangerouslySetInnerHTML` only after `DOMPurify`-style basic stripping; use a simple text-first render to keep dependencies untouched).
- Empty state: centred Inbox icon + copy referencing the inbound address.
- Default sort: `received_at desc`.

### Extract to Task flow
- New edge function `extract-email-tasks` (verify JWT, takes `{ email_id }`):
  - Loads email (RLS protects access), calls Lovable AI `google/gemini-2.5-pro` with the specified system prompt and the subject + body_text.
  - Uses tool calling with a small schema `{ tasks: [{ title, description, priority enum[low,medium,high] }] }` (max 5).
  - Returns parsed array; surfaces 429/402 errors clearly.
- New component `src/components/app/inbox/ExtractTasksPanel.tsx`:
  - Wraps the existing `TaskFormDialog` (the same side panel used everywhere else) — no rebuild.
  - If 1 task: open `TaskFormDialog` pre-filled with title/description/priority/assignee (= email's `assigned_to`).
  - If 2–5: render a stepper "Task N of M" with Back/Next inside the same dialog frame; each step uses `TaskFormDialog`'s form preset; **Save Task** writes via existing task-create flow then inserts `email_task_extractions(email_id, task_id)`; **Skip** advances without saving.
  - On finish: if ≥1 task saved, update email `status='assigned'`; close panel; toast.
- Empty/parse failure: inline error "No actionable tasks found in this email."

## 4. Files to add / touch

**New**
- `supabase/migrations/<ts>_email_inbox.sql`
- `supabase/functions/email-inbound/index.ts`
- `supabase/functions/extract-email-tasks/index.ts`
- `src/pages/app/Inbox.tsx`
- `src/components/app/inbox/InboxTable.tsx`
- `src/components/app/inbox/EmailViewerSheet.tsx`
- `src/components/app/inbox/StatusDropdown.tsx`
- `src/components/app/inbox/ExtractTasksPanel.tsx`
- `src/hooks/useInboxUnreadCount.ts`

**Edited (additive only)**
- `src/App.tsx` — add lazy import + route.
- `src/components/app/AppSidebar.tsx` — add Inbox nav item + badge.

No edits to TaskFormDialog internals, tasks table, or any other existing feature.

## 5. Secrets requested
- `RESEND_WEBHOOK_SECRET` (you'll paste the value Resend gives when configuring the inbound webhook).

## 6. Out of scope (per your spec)
- Attachments, reply threading, auto-forwarding rules, automation, VHS Administration changes.
