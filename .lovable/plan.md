
## Goal
Refine the Email Inbox so emails are never auto-removed, extracted tasks are tracked per-email with a clear lifecycle (Extract → View → Completed), and surface email/task counts in both the Inbox and My Tasks via consistent badge styling. Add a richer extraction UX with progress, post-extraction prompt, and back/next navigation.

## Changes

### 1. Inbox row lifecycle (no deletions)
- Add an `extraction_state` to `inbound_emails`:
  - `none` (default) — shows **Extract to Task**
  - `extracted` — tasks generated and stored, not yet reviewed. Shows **View Extracted Tasks**
  - `completed` — user has reviewed extracted tasks. Shows **Completed** (disabled/non-clickable)
- Emails are never auto-deleted. The existing manual Delete option in the row menu stays.
- When extraction yields ≥1 saved tasks, email status auto-flips to **Assigned** (already partially in place; verified).

### 2. Inbox table updates
- New **Tasks** column after Status: shows the count of tasks linked via `email_task_extractions` for that email (0 if none).
- Slightly widen the Status column so "Not Assigned" no longer wraps/clips.
- 3-dots menu items become state-aware:
  - `none` → "Extract to Task"
  - `extracted` → "View Extracted Tasks"
  - `completed` → "Completed" (disabled)
  - Delete remains available in all states.

### 3. Extraction flow UX
- Clicking **Extract to Task** opens an in-row/overlay progress indicator ("Extracting…" with a progress bar) so users see activity while Gemini runs.
- On completion, show a confirmation dialog: **"Tasks extracted. Do you want to review them now?"** with **Yes** / **Later** buttons.
  - **Yes** → opens the stepper immediately.
  - **Later** → stays in inbox; email enters `extracted` state and tasks are stored for later.
- Extracted tasks are persisted (new table) so "View Extracted Tasks" can re-open the stepper without re-calling AI.

### 4. Stepper navigation
- Replace existing Back/Skip with three buttons: **Back**, **Next**, **Skip**.
  - Back: previous task (disabled on first).
  - Next: forward without saving (disabled on last unreviewed; allows moving across already-seen tasks).
  - Skip: marks task as skipped and advances.
- Save Task still creates the task (existing behavior).
- Once user finishes the stepper (all tasks saved or skipped), email moves to `completed` state; menu shows "Completed".

### 5. My Tasks: Source column + badge
- New **Source** column with values **Extracted** (task linked in `email_task_extractions`) or **Manual** (everything else).
- Sidebar badge for **My Tasks**: same logic as Inbox — solid primary-coloured pill when there are *new* assignments since last visit; once no new items remain, show the count as a plain number (no filled circle) representing total open tasks.

### 6. Sidebar badge logic (Inbox + My Tasks)
- "New" = unread/unseen. Track per-user last-visited timestamp in `localStorage` (per user id) for both Inbox and My Tasks. When user opens the page, reset the marker.
- Display rules:
  - `newCount > 0` → solid filled badge with `newCount`.
  - `newCount === 0` → outline/plain text badge with `totalOpenCount` (no filled circle).
- Inbox total = all emails. My Tasks total = open (non-done/cancelled) tasks assigned to user.

## Technical Details

### Database (single migration)
- `ALTER TABLE public.inbound_emails ADD COLUMN extraction_state text NOT NULL DEFAULT 'none' CHECK (extraction_state IN ('none','extracted','completed'));`
- New table `public.email_extracted_tasks` to persist AI output for "Later" review:
  - `id uuid pk`, `email_id uuid fk inbound_emails`, `title text`, `description text`, `priority text`, `position int`, `status text default 'pending' check in ('pending','saved','skipped')`, `task_id uuid null`, `created_at`, `updated_at`.
  - GRANTs to authenticated + service_role; RLS mirroring `inbound_emails` (workspace member visibility; admins see all).
- Existing `email_task_extractions` (email_id → task_id) continues to power the Tasks count column and the My Tasks Source column.

### Edge function
- `extract-email-tasks`: after AI returns, **persist** tasks into `email_extracted_tasks` (status `pending`) and set `inbound_emails.extraction_state = 'extracted'`. Return the inserted rows.

### Frontend
- `StatusDropdown.tsx`: widen trigger from `w-[150px]` to `w-[170px]`.
- `Inbox.tsx`:
  - Add Tasks column (count from `email_task_extractions`, fetched alongside emails or via a view).
  - Replace single "Extract to Task" menu item with state-aware item.
  - Add progress overlay while extracting; show confirm dialog on success.
  - Load persisted `email_extracted_tasks` when user picks "View Extracted Tasks".
- `ExtractTasksPanel.tsx`:
  - Add **Next** button; track per-task review state (`pending|saved|skipped`); persist updates to `email_extracted_tasks` on each action.
  - On finish: set email `extraction_state = 'completed'` and (if any saved) `status = 'assigned'`.
- `MyTasks.tsx`: add Source column; query `email_task_extractions` for the displayed task ids to label rows.
- `useInboxUnreadCount.ts`: extend to return `{ newCount, totalCount }`; add `useMyTasksBadge.ts` analogue.
- `AppSidebar.tsx`: render filled vs plain badge based on `newCount` for both items.

### Out of scope
- No changes to existing manual task creation flows, no design-system token changes, no auth changes.
