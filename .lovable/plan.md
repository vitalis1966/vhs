## Plan: Fix My Tasks + add unified task actions

### Important schema note (changes the spec slightly)
- The `tasks` table has **no `assignee_id` column**. Assignees live in a many-to-many `task_assignees(task_id, user_id)` table. The "My Tasks" query must use that join — there is no hardcoded user id today; the page just doesn't exist yet.
- `/app/my-tasks` currently renders `AppMyTasks` from `ShellPages.tsx`, which is a **placeholder** ("Your assigned tasks will appear here"). That's why no tasks show. We will build the real panel.
- "Archived" doesn't exist as a concept. We'll treat status categories `done` and `cancelled` as hidden by default, plus a `deleted_at` soft-delete column we'll add.

### 1. Database migration
Add to `public.tasks`:
- `deleted_at timestamptz null`
- Index on `deleted_at` for fast filtering

All read paths in the app get a `.is("deleted_at", null)` filter.

Enable realtime on `public.tasks` and `public.task_assignees` (add to `supabase_realtime` publication) if not already enabled.

### 2. New `MyTasksPanel` page (`src/pages/app/MyTasks.tsx`)
Replaces the `AppMyTasks` placeholder. Wired into `App.tsx` route `/app/my-tasks`.

Query logic:
1. Resolve current `userId` from `WorkspaceContext` (already exposes it; no race — `AppGuard` gates this route).
2. Fetch `task_assignees` rows where `user_id = userId` → list of task ids.
3. Fetch `tasks` where `id in (...)`, `deleted_at is null`, joined with `task_statuses` to filter out `category in ('done','cancelled')` **unless** the task is overdue (due_date < today and completed_at null) — overdue always shows.
4. Show a "Show completed" toggle that re-includes done/cancelled.
5. Empty state: `"No tasks assigned to you yet"`.

Realtime:
- Subscribe to `postgres_changes` on `tasks` (event `*`) and `task_assignees` (event `*`, filter `user_id=eq.${userId}`) — on any payload, refetch.
- Channel name scoped per user; cleanup on unmount.

Layout: full page list (not a sidebar — the existing layout has no "left column" slot; this is the dedicated `/app/my-tasks` view). Uses the shared `TaskRow` component below so behavior matches other lists.

### 3. Shared task row + action menu
New components in `src/components/app/tasks/`:
- `TaskRow.tsx` — checkbox + title + client/project badges + status pill + due date + assignees + three-dot menu. Focusable (`tabIndex=0`) with keyboard handlers.
- `TaskActionsMenu.tsx` — dropdown (Radix `DropdownMenu`) used by both the three-dot button and `ContextMenu` (right-click). Items:
  - Mark as complete / in progress / to do (writes `status_id` to the workspace's matching `task_statuses` row by category; sets/clears `completed_at`)
  - Edit task → opens existing `TaskFormDialog`
  - Change due date → inline `Popover` + shadcn `Calendar` (with `pointer-events-auto`)
  - Reassign → `MemberPicker` (new, lists workspace members; multi-select; rewrites `task_assignees`)
  - Duplicate → inserts new task copying title/description/priority/due/client/project, copies `task_assignees`
  - Delete → confirmation dialog
- `DeleteTaskDialog.tsx` — confirmation copy includes "This task was created from a meeting/email. Deleting it will not delete the source record." when `meeting_id is not null` (only meeting source exists today; email-sourced tasks aren't tracked yet so we only branch on `meeting_id`).
- `BulkActionBar.tsx` — sticky bottom bar shown when ≥1 row checked: Mark complete / Reassign / Change due date / Delete (with count in confirmation).
- `useTaskMutations.ts` — central hook with: `setStatus`, `setDueDate`, `setAssignees`, `duplicate`, `softDelete(ids)`. All call `supabase` and invalidate React Query keys + emit a local event so non-RQ lists can refresh.

### 4. Apply across all task views
Replace/refactor row rendering to use the new `TaskRow` + actions in:
- `src/components/app/TaskTable.tsx` (client/project task lists)
- `src/components/app/TaskBoard.tsx` (kanban cards get the same three-dot menu + right-click + checkbox)
- `src/components/app/TaskDetailPanel.tsx` (header action menu)
- `src/pages/app/Tasks.tsx` (workspace task page)
- `src/pages/app/Home.tsx` widgets ("My Tasks Today", "My Upcoming Tasks", recent activity task rows) — three-dot menu + keyboard, no checkbox/bulk bar (widgets are previews)

Every list query gets `.is("deleted_at", null)` and removes rows immediately on soft-delete via local state + RQ invalidation.

### 5. Keyboard shortcuts
On focused `TaskRow`:
- `Delete` / `Backspace` → open `DeleteTaskDialog`
- `Enter` → open `TaskFormDialog`
- `Space` → toggle complete (preventDefault to avoid scroll)
Ignored when focus is inside an input/textarea/contenteditable.

### 6. Files

**New**
- `supabase/migrations/<ts>_tasks_soft_delete.sql`
- `src/pages/app/MyTasks.tsx`
- `src/components/app/tasks/TaskRow.tsx`
- `src/components/app/tasks/TaskActionsMenu.tsx`
- `src/components/app/tasks/DeleteTaskDialog.tsx`
- `src/components/app/tasks/BulkActionBar.tsx`
- `src/components/app/tasks/MemberPicker.tsx`
- `src/components/app/tasks/useTaskMutations.ts`
- `src/hooks/useMyTasksRealtime.ts`

**Edited**
- `src/App.tsx` — swap `AppMyTasks` import for new `MyTasks` page
- `src/pages/app/ShellPages.tsx` — drop `AppMyTasks` export
- `src/components/app/TaskTable.tsx`, `TaskBoard.tsx`, `TaskDetailPanel.tsx`
- `src/pages/app/Tasks.tsx`, `src/pages/app/Home.tsx` (task widgets)

### Open assumptions (will proceed unless you object)
1. The "left column panel" refers to the existing `/app/my-tasks` route (currently a placeholder), since the app layout has no persistent left-column task list today.
2. "Reassign using @mention/tag system" — workspace members picker, not tags. The existing `TagPicker` is for tags; members are a different concept.
3. "Email intake" task source isn't tracked yet, so the delete confirmation only mentions meetings when `meeting_id` is set.
4. Soft-deleted tasks are hidden everywhere; no Trash UI yet (not in scope).
