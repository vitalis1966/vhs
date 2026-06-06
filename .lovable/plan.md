## Goal

Fix the Inbox "Extract to Task" multi-step flow so users can navigate between tasks without losing data, defer or skip tasks intentionally, and have the email's action/status reflect the true completion state.

## Components touched

- `src/components/app/inbox/ExtractTasksPanel.tsx` — owns the step navigation, per-task form state, Save/Skip/Close handlers, and the final summary returned to Inbox.
- `src/components/app/TaskFormDialog.tsx` — currently auto-closes on successful save and resets all fields whenever `open` toggles. Will gain two opt-in props so the wizard can keep it open and feed it edited values back when switching steps (no behaviour change for other callers).
- `src/pages/app/Inbox.tsx` — consumes the panel's finish callback. Action-button + email-status decisions move into one place driven by the panel summary.

No schema changes, no new libraries, no other Inbox or VHS files touched.

## 1. Per-task form state (Next / Back / step switch)

In `ExtractTasksPanel` add a single keyed cache:

```text
formByIndex: Record<number, {
  title: string;
  summary: string;
  priority: string;     // "High" | "Medium" | "Low"
  clientId?: string;
  projectId?: string;
  assigneeId?: string;
  dueDate?: string;
  statusId?: string;
}>
```

- Seed entry `i` lazily from the extracted task (`title`, `description`, `priority`) the first time index `i` is shown.
- `TaskFormDialog` already calls `onValuesChange` whenever its inputs change; extend that callback to include the extra fields (client, project, assignee, due date, status) and write the result into `formByIndex[index]` on every change.
- When the user clicks Back/Next, we no longer remount the dialog (`closeDialogTransiently` is removed). Instead, pass `defaultsKey={index}` and the cached values for that index as new defaults. `TaskFormDialog` is updated so its "reset to defaults" effect re-runs when `defaultsKey` changes, not only when `open` toggles. That way:
  - Task 1 → fill fields → Next → Task 2 renders with its own cached/seeded values.
  - Back → Task 1 re-renders with the cached values, including any edits.
  - Works for any N tasks.

The cache lives in component state for the whole session the wizard is mounted. Inbox keeps the wizard mounted (`extractEmail` stays set) while `panelOpen` toggles, so navigating between tasks within one session preserves data.

## 2. Save Task — don't close mid-flow

`TaskFormDialog` gains an opt-in `keepOpenOnSave?: boolean` prop. When true, after a successful insert it skips the `onOpenChange(false)` call and lets the caller decide. The wizard passes `keepOpenOnSave`.

In `ExtractTasksPanel.handleCreated`:

1. Mark `reviewStates[index] = "saved"` and persist `status="saved"` + `task_id` on the `email_extracted_tasks` row (already done today).
2. Find the next non-final index (`pending` or `deferred`).
3. If one exists → advance to it (cache is preserved, no remount).
4. If none exists → the flow is complete, call `finish()` which closes the panel and reports the summary to Inbox.

The current `email_extracted_tasks.status` column ('pending' | 'saved' | 'skipped') is reused. "Later" is tracked **only in component state** as `"deferred"` (see §3); we do not write a new value to the DB, so no schema change. On panel reopen we map any persisted `pending` row to `deferred` if the user previously closed with Later (see §4).

## 3. Skip → confirmation dialog (Yes / No / Later)

Replace the current `skip()` direct action with an `AlertDialog` (already imported elsewhere; `ExtractTasksPanel` will import from `@/components/ui/alert-dialog` — same component used by Inbox delete confirmations, so no new dialog system).

Dialog copy: "Do you want to skip creating this task?" with three buttons: **Yes**, **No**, **Later**.

| Choice | Local state | DB row (`email_extracted_tasks.status`) | Navigation |
|---|---|---|---|
| Yes   | `reviewStates[i] = "skipped"`  | `update status='skipped'` (existing path) | Move to next non-final task; if none, `finish()` |
| No    | unchanged                       | no write | Close dialog, stay on current task |
| Later | `reviewStates[i] = "deferred"`  | no write (row stays `pending`) | Move to next non-final task; if none, `finish()` |

`finish()` is the only place that calls `onFinished(summary)`.

## 4. Close (X / overlay) — pause, don't change anything

Today `TaskFormDialog`'s X click fires `onOpenChange(false)`, which the wizard currently treats as "finish". Change the wizard's `onOpenChange` handler so a close performs:

1. `captureCurrent()` — write the latest live values into `formByIndex[index]` (already implemented; remains).
2. Persist the in-progress draft fields (`title`, `description`, `priority`) to the `email_extracted_tasks` row for the current index, as we already do.
3. Close the panel **without** calling `onFinished` — instead call a new `onClosedMidFlow()` callback so Inbox knows not to flip status/action.

`formByIndex` lives in component state and is lost when the wizard unmounts, which happens when Inbox clears `extractEmail` after a close. To survive close → reopen, the wizard hydrates `formByIndex` on mount from two sources, in this order:

1. `sessionStorage` key `vitalis:extract-draft:<email_id>` — JSON `{ formByIndex, reviewStates }`.
2. The `email_extracted_tasks` rows (`title`, `description`, `priority`, `status`) we already fetch.

Every state change (`formByIndex`, `reviewStates`) writes the merged object back to sessionStorage. On a `finish()` (all tasks resolved) we clear the key.

Reopening via "View Extracted Tasks": Inbox calls `viewExtracted(email)` as today. The panel hydrates from sessionStorage + DB. If `reviewStates` contains any `deferred` entries, the wizard filters its visible task list to **only** those indices and renumbers "Task X of Y" accordingly. If there are no deferred entries (i.e. nothing in sessionStorage), it falls back to today's behaviour (show all stored extracted tasks).

## 5. Single source of truth for email status & action label

Replace the existing `onPanelFinish(savedCount)` signature with a richer summary:

```text
onFinished({
  saved: number,
  skipped: number,
  deferred: number,
  closedMidFlow: boolean,
})
```

In `Inbox.onPanelFinish`, apply this table exactly once:

| Condition | extraction_state | email status |
|---|---|---|
| `closedMidFlow` | unchanged | unchanged |
| `saved>0 && skipped===0 && deferred===0` | `completed` (renders as **Complete**) | `assigned` |
| `saved>0 && (skipped>0 \|\| deferred>0)` | `extracted` (renders as **View Extracted Tasks**) | `assigned` |
| `saved===0` | `extracted` | unchanged |

The Inbox row's action menu already keys off `extraction_state` (`none` → Extract, `extracted` → View Extracted Tasks, `completed` → Complete). No render changes needed there — only `onPanelFinish` is rewritten to apply the table above, and `updateStatus`/`updateExtractionState` calls move inside it.

The Save-mid-flow case is covered because Save no longer triggers `onFinished`; only `finish()` does.

## Verification

1. Extract email with ≥3 tasks. Fill Task 1, Next → Task 2, Back → Task 1 fields intact. Edit Task 1, Next → Task 2 retains its own data.
2. On Task 2, click Save Task → toast shows, panel stays open on Task 3 (or next pending). Email row status/action unchanged in the background.
3. Click Skip on Task 3 → confirmation dialog appears.
   - **No** → dialog closes, still on Task 3.
   - **Later** → moves to next; on completion, panel closes, action stays "View Extracted Tasks", status = Assigned.
   - **Yes** → marks skipped; same action/status outcome if any deferred/skipped remain; otherwise action = Complete.
4. Click X mid-flow → panel closes, action label and status unchanged. Reopen via "View Extracted Tasks": draft text restored; if Later was used, only deferred tasks shown.
5. Resolve all deferred tasks (Save or Yes-skip) → action flips to Complete only when zero deferred and zero skipped remain.
6. Confirm no other Inbox dropdown items, status dropdown behaviour, bulk delete, filters, or sorts changed. Confirm no edits to `TaskFormDialog` callers other than the new optional props (existing callers continue to behave identically because new props default to off).
