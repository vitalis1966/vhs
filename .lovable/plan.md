## Fixes for New Task

### 1. Fix "infinite recursion detected in policy for relation tasks"

The recursion is caused by mutual references between RLS policies:
- `tasks.tasks_select` subqueries `task_assignees`
- `task_assignees.ta_all` subqueries `tasks`

**Migration** (adds SECURITY DEFINER helpers and rewrites the two policies so they don't reference each other):

- Add `public.is_task_assignee(_task_id uuid, _user_id uuid)` — SECURITY DEFINER, reads from `task_assignees` only.
- Add `public.task_workspace_id(_task_id uuid)` — SECURITY DEFINER, reads `workspace_id` from `tasks` only.
- Drop and recreate `tasks_select`:  
  `USING (can_access_client(client_id) OR public.is_task_assignee(id, auth.uid()))`
- Drop and recreate `task_assignees` policies (split into two, neither subqueries `tasks` directly):
  - `ta_self` — user can manage rows where `user_id = auth.uid()`
  - `ta_workspace` — workspace members of the task's workspace can manage rows, via `is_workspace_member(public.task_workspace_id(task_id))`

No schema changes to tables, no grant changes needed.

### 2. Add "Task Summary" field to New Task dialog

The `tasks` table already has `description` (jsonb) and `description_text` (text). Reuse them — no migration needed.

Frontend change in `src/components/app/TaskFormDialog.tsx`:
- Add a `summary` textarea state, labelled **Task Summary**, placed below Due Date.
- On submit, include `description_text: summary || null` and `description: summary ? { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: summary }] }] } : null` in the insert payload, so it shows up correctly in the existing rich-text editor in `TaskDetailPanel`.

### Out of scope
- No changes to `TaskDetailPanel` (it already renders `description` via TaskRichText).
- No changes to email/notification flow.
