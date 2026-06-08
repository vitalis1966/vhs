## VITALIS OS — Inbox, Timer, Tables & Follow-Ups

Confirmed components to reuse (no rebuilds):
- Task side panel: `src/components/app/TaskDetailPanel.tsx` — extended in place.
- Notifications panel: `src/components/app/NotificationsBell.tsx` — tabs added inside the existing PopoverContent.
- Start Timer UI: `src/components/app/time/TimerWidget.tsx` (`StartPanel`) — converted from Popover to Dialog, same fields/logic.
- Column header filter/sort: `src/components/app/columns/ColumnHeader.tsx` + `useTableFilters` (reused for the new Follow Up column).
- "Show completed" slider in `src/pages/app/MyTasks.tsx` — reused for Inbox.

---

### 1. Inbox — "Show Completed" toggle
- Add a `Switch` + label in the `Inbox.tsx` header, matching the My Tasks styling/position.
- State persisted in `sessionStorage` under `inbox:show-completed`, default OFF.
- Client-side filter only: when OFF, hide rows where `status = 'assigned' AND extraction_state = 'completed'`. Query unchanged.

### 2. Inbox — Bulk actions
- When the existing select-all checkbox selects all currently-visible rows, render a bulk action bar above the table using the same pattern as other bulk-action bars in the app (sticky bar with count + actions).
- Actions: Mark Assigned, Mark Waiting, Mark Not Assigned, Delete (existing `AlertDialog` confirm).
- Operates on visible (filtered) rows; after success → clear selection + refetch.
- Single-row actions untouched.

### 3. Inbox — Attachments from forwarded emails
Migration `inbox_email_attachments`:
- Cols: `id`, `email_id` (FK `inbound_emails` ON DELETE CASCADE), `file_name`, `storage_path`, `mime_type`, `file_size`, `created_at`.
- `GRANT SELECT,INSERT,DELETE` to `authenticated`; `GRANT ALL` to `service_role`.
- RLS: SELECT allowed if `EXISTS` matching `inbound_emails` accessible via existing `can_manage_inbound_email` / `is_workspace_member`; service_role bypasses.
- Create private Storage bucket `email-attachments` via `storage_create_bucket` + RLS on `storage.objects` keyed off workspace membership.

Edge function `supabase/functions/email-inbound/index.ts`:
- After inserting the email row, detect attachments across Resend/Mailgun/Postmark shapes (`data.attachments`, `data.email.attachments`, `attachment-N` + `attachment-count`, `data.Attachments`).
- For each: fetch/decode content → upload to `email-attachments/{workspace_id}/{email_id}/{filename}` → insert row.
- Wrap in try/catch; log + continue on failure (never block email insert).

`EmailViewerSheet.tsx`:
- Query `inbox_email_attachments` by `email_id` when sheet opens.
- Render Attachments section under body with name, size (existing `formatBytes`), and Download via `supabase.storage.from('email-attachments').createSignedUrl()` (existing pattern in `clientDocuments.ts`).

### 4. Start Timer popup → Dialog
- In `TimerWidget.tsx`, replace the `Popover`/`PopoverContent` wrapping `StartPanel` with `Dialog`/`DialogContent` (`sm:max-w-[480px]`, min-width 480px).
- Keep trigger button, all fields, order, and `startTimer()` logic identical.
- Move "Add hours manually" link inside the dialog footer area.
- `RunningPanel` edit popover untouched (works fine).

### 5. Full-width tables (My Tasks, Tasks table, Clients, Projects, Inbox, Time Tracking)
- Root cause: pages wrap content in `space-y-4` inside `AppLayout`'s constrained container, and tables use `table-layout: fixed` with cumulative column widths smaller than viewport.
- Fix: wrap each table in `<div class="w-full overflow-x-auto">` and set `<table className="w-full min-w-full">`; ensure last column (actions/3-dots) uses `w-12` fixed width and `sticky right-0 bg-background` so it stays visible on narrow viewports. Audit `AppLayout` main container to remove any max-width narrower than viewport.
- Apply uniformly across: `MyTasks.tsx`, `TaskTable.tsx`, `Clients.tsx`, `Projects.tsx`, `Inbox.tsx`, `TimeTracking.tsx`.
- Do not adjust relative column widths.

### 6. Task Follow-Up system

#### 6a. Migration `task_follow_ups`
Columns as specified plus `last_reminder_sent_at timestamptz`. FKs: `task_id` → `tasks(id)` cascade, `resource_id` → `profiles(id)` SET NULL. Unique `(task_id)`.
GRANTs to `authenticated` (SELECT/INSERT/UPDATE/DELETE) + `service_role` ALL. RLS: allow when `task_workspace_id(task_id)` is a workspace the user is an active member of (reuse `is_workspace_member`). `updated_at` trigger via existing `touch_updated_at`.

#### 6b. Side-panel Follow Up section (`TaskDetailPanel.tsx`)
- New collapsible block under existing fields, gated by a `Switch` ("Follow Up").
- Fields (only visible when ON): follow_up_date (date+time), follow_up_due_date (date+time), remind_before (number input + Select unit hours/days/months), `is_recurring` Switch → reveals recurrence Select, resource_id Select populated from workspace `profiles`.
- On save, upsert into `task_follow_ups` keyed by `task_id`.
- When task status changes to a `done`/`cancelled` category status → set `follow_up_status='completed'` and clear `last_reminder_sent_at` (no new reminders).

#### 6c. Status computation
Implemented as a Postgres function `compute_follow_up_status(row)` + trigger on insert/update of `task_follow_ups` and on `tasks.status_id` change (existing `notify_task_status_change` pattern). Logic exactly per spec.

#### 6d. Follow Up column in My Tasks + Tasks table
- Add column after Assignee using `ColumnHeader` with multi-select filter (Not Started / Recurring / Completed) and sort.
- Badge variants: neutral / blue / green using existing badge classes.
- Persist widths in existing `useColumnWidths` keys.

#### 6e. Notifications panel — Follow Ups tab
- Inside `NotificationsBell.tsx` PopoverContent (width unchanged), wrap content in `Tabs` with `TabsList` (Notifications | Follow Ups).
- Follow Ups tab: query `task_follow_ups` joined to `tasks` + `clients` for current user where `follow_up_status != 'completed'` AND (`follow_up_date <= now() + 30 days` OR remind-before threshold reached) AND user is assignee or resource.
- Each item: task title, client, follow-up date, due date, "View Task" link → `/app/tasks?task={id}` (existing deep-link pattern).

#### 6f. Reminder edge function + cron
- New function `send-follow-up-reminders` (verify_jwt=false). Query candidates (`enabled`, status != completed, `follow_up_date - remind_before <= now()`, `last_reminder_sent_at` null or older than current period).
- Send via Resend using existing transactional template pattern. Recipient: resource email, else first task assignee email.
- Update `last_reminder_sent_at = now()`. If `is_recurring`, advance `follow_up_date` by recurrence_frequency.
- Schedule via `pg_cron` hourly using `net.http_post` (project already uses pg_cron for other jobs — confirmed compatible). Inserted via `supabase--insert` (project-specific URL/anon key).

---

### Design / constraints
- Reuse design tokens, Switch, Dialog, Tabs, Badge, AlertDialog from existing components — no new deps.
- No VHS Administration changes. No schema changes outside listed tables/columns.
- All new public tables include explicit GRANTs in their migrations.

### Order of execution (build mode)
1. Migrations: `task_follow_ups` (+ trigger), `inbox_email_attachments`, storage bucket.
2. Edge: `email-inbound` attachments, new `send-follow-up-reminders` + cron insert.
3. Frontend: TimerWidget dialog → Inbox toggle/bulk/attachments → Table width audit → TaskDetailPanel follow-up → Follow Up column in MyTasks/TaskTable → NotificationsBell tabs.
4. Verify: build passes; smoke-check Inbox toggle, bulk delete confirm, timer dialog width, follow-up save round-trip.
