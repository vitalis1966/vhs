# Time Tracking System Plan

This is a large, multi-part feature. I'll build it in phased migrations + UI drops, with each phase shippable.

## Phase 1 — Data model & RLS

New tables:
- `time_activity_types` (workspace_id, name, position, is_active, is_default) — seeded with the 10 defaults
- `time_entries` (user_id, workspace_id, client_id, project_id?, task_id?, activity_type_id, description, started_at, ended_at?, duration_seconds, is_manual, source)
- `time_entries_running` (one row per user — persists active timer)
- `contracted_hours` (client_id, total_hours, period_start, period_end, created_by)
- `contracted_hours_by_activity` (contracted_hours_id, activity_type_id, allocated_hours)
- `time_tracking_settings` (per user: rounding, reminder time, show_widget, show_decimal, default_activity_id)
- `client_budget_alerts_sent` (dedupe 75/90/100% notifications per client+activity+threshold)

RLS:
- `time_entries`: admins on workspace see all; members only their own. INSERT/UPDATE/DELETE: own rows for members, all for admins.
- `contracted_hours*`: admins manage; members SELECT for clients they can access.
- `time_activity_types`: workspace-scoped; admins write, members read.

Trigger: on `time_entries` INSERT/UPDATE, recompute `duration_seconds` and call `check_budget_thresholds(client_id, activity_type_id)` which inserts notifications + invokes the budget-alert edge function via pg_net for 90/100%.

## Phase 2 — Live timer widget

- `TimerWidget` in `AppTopBar` (always visible)
- Idle: ▶ Start timer button → opens `TimerStartPopover` (Client/Project/Task/Activity/Description)
- Running: live HH:MM:SS counter (client-side `setInterval`), client + activity label, ⏹ Stop, ▼ edit-without-stopping
- Persistence: `time_entries_running` table + localStorage; on mount, restore + show "still running" banner if started >2h ago
- Stop: writes to `time_entries`, deletes from `time_entries_running`, toast "1h 23m logged to [Client]"

## Phase 3 — Manual entry

- `ManualEntryDialog` — date picker, start/end OR duration (mutually exclusive, last-edited wins), client/project/task/activity/description
- Zod validation: client+activity required, end>start, duration>0, not in future

## Phase 4 — Time Tracking section

- New route `/app/time` + sidebar entry under main nav
- Tabs: Day | Week | Month with date navigator
- Group by client (day) / day (week) / week (month)
- Row: client, project, task, activity badge, description, "1h 23m / 1.38h", edit/delete
- Totals shown in HH:MM + decimal

## Phase 5 — Contracted hours per client

- New tab on `ClientDetail`: "Contracted Hours"
- Admin form: total hours, period, per-activity allocation table
- Live summary card: total + per-activity allocated/used/remaining with progress bars (green/amber/red at 75/90%)

## Phase 6 — Budget alerts

- DB trigger detects threshold crossings, inserts `notifications` and (for 90/100) invokes `send-budget-alert` edge function via pg_net
- New email template `budget-alert-90` and `budget-alert-100` in `_shared/transactional-email-templates/`
- Dedupe via `client_budget_alerts_sent`

## Phase 7 — Reports

- `/app/time/reports` with 4 report types (Client, Member [admin], Project, Activity Type)
- Filters: date-range presets + custom, client (admin), member (admin), activity, project
- Charts (recharts): stacked bar, donut, line, gauge
- All totals show HH:MM + decimal
- CSV export via existing `lib/csv.ts`

## Phase 8 — Timer in My Tasks

- Add ▶ icon button per row in `MyTasks.tsx` and `TaskTable.tsx`
- Click → start timer pre-filled with task context
- If timer running → confirm dialog "Stop & Switch | Keep Running"

## Phase 9 — Settings

- New `TimeTrackingSection` in Settings (admin: manage activity types, default activity, rounding)
- User-level prefs: reminder time, show widget, show decimal

## Permissions matrix (RLS-enforced)

| Role | time_entries | contracted_hours | activity_types | alerts |
|------|--------------|------------------|----------------|--------|
| admin | all | manage | manage | receive |
| member | own only | read (for accessible clients) | read | none |

## Technical notes

- `formatDuration(seconds)` util → returns `{ hhmm: "1:23", hms: "1:23:45", decimal: "1.38h" }`
- Apply rounding only on save (not on display) per user setting
- All charts in `recharts` (already in deps)
- Use existing `notifications` table + `NotificationsBell`
- Email templates use Vitalis brand (#172620 / #C89741 / #60766B) per existing brand memory

## Out of scope (not requested)

- Stopwatch keyboard shortcuts
- Approval workflows / time-entry locking
- Billing rate / invoicing
- Mobile-specific timer UI

---

This is roughly 25-30 new files + 1 big migration + 2 edge function emails. I'll execute it in the order above. Shall I proceed?
