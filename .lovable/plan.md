## Add Assignee field to New Task dialog + notify on creation

### 1. `TaskFormDialog.tsx`
- Load active workspace members (same query as `TaskDetailPanel`) alongside clients/projects/statuses.
- Add an **Assignee** dropdown (single-select, optional "Unassigned") below Priority. Show member full name / email.
- Default value: the `defaultAssigneeId` prop if provided, otherwise empty (Unassigned).
- On submit, after creating the task:
  - If an assignee is selected, insert into `task_assignees` (replaces current `defaultAssigneeId`-only insert so manual picks also work).
  - Fire `sendNotification` (from `src/lib/notify.ts`) with `type: "task_assigned"`, title `"New task assigned: <title>"`, body including client name + due date, `link_url: /app/tasks?task=<id>`, `entity_type: "task"`, `entity_id`, `actor_id: userId`, `workspace_id`.
  - Insert an `activities` row with verb `assigned` and `metadata.assignee_id` (mirrors detail panel behavior).

### 2. No backend changes
- `send-notification` edge function already handles `task_assigned` and sends email via the existing Resend setup → assignee receives email automatically (same path used by `TaskDetailPanel`).
- No schema migration needed; `task_assignees` table already exists.

### Out of scope
- Multi-assignee selector at creation time (detail panel still allows adding more after).
- Changing notification template content.