# Inbox: Status & Action State Resolver (Extract to Task)

Consolidate all email Status + Action mutations into one resolver driven by the truth table. Touch only the panel summary and the Inbox handler — no schema, no other features.

## Files

- `src/components/app/inbox/ExtractTasksPanel.tsx`
- `src/pages/app/Inbox.tsx`

## 1. Extend `PanelFinishSummary`

Add the missing fields so the resolver can branch on real counts (currently only saved/skipped/deferred/closedMidFlow exist).

```ts
export interface PanelFinishSummary {
  saved: number;
  skipped: number;   // Yes on Skip dialog
  deferred: number;  // Later on Skip dialog
  pending: number;   // not yet reviewed
  total: number;     // total extracted tasks
  closedMidFlow: boolean;
}
```

Update `summarize()` in `ExtractTasksPanel.tsx` to populate `pending` (states === "pending") and `total` (`hydrated.tasks.length`). Emitted from both `finish()` (closedMidFlow=false) and `handleClose()` (closedMidFlow=true). No DB writes added for deferred — already component/sessionStorage-only.

## 2. Single resolver in `Inbox.tsx`

Replace the current inline if/else in `onPanelFinish` with one pure function:

```ts
function resolveEmailState(s: PanelFinishSummary):
  { status: InboxStatus; extractionState: ExtractionState }
```

Branches, in this exact order (each named, no fallthrough default):

1. `s.total === 0` → `{ not_assigned, completed }`  *(Action: Complete)*
2. `s.closedMidFlow && s.saved === 0` → `{ not_assigned, extracted }`
3. `s.closedMidFlow && s.saved > 0` → `{ waiting, extracted }`
4. `s.saved === 0 && s.skipped === s.total` → `{ not_assigned, completed }` *(all Yes-skipped)*
5. `s.saved > 0 && s.saved + s.skipped === s.total` → `{ assigned, completed }` *(mix created + Yes-skipped, none pending/deferred)*
6. `s.saved + s.skipped === s.total && s.saved === 0` → already covered by 4 (kept as guard comment)
7. `s.pending + s.deferred > 0 && s.saved > 0` → `{ waiting, extracted }`
8. `s.pending + s.deferred > 0 && s.saved === 0` → `{ not_assigned, extracted }`

Where `extraction_state` drives Action: `completed` → "Complete", `extracted` → "View Extracted Tasks", `none` → "Extract to Task" (unchanged initial state, never produced by resolver).

`onPanelFinish` becomes:

```ts
const { status, extractionState } = resolveEmailState(summary);
await updateStatus(emailRef.id, status);
await updateExtractionState(emailRef.id, extractionState);
```

Always called — even `closedMidFlow` — so the truth table is the only source of mutations. Remove the existing scattered branches.

## 3. Skip dialog paths (no extra work needed, verify)

- **No** → just closes dialog (`setSkipDialogOpen(false)`), panel stays open, `onFinished` not called → Status/Action untouched. ✓ already correct.
- **Later** → marks deferred locally + sessionStorage, advances; only triggers `onFinished` when no remaining visible tasks (via `advanceOrFinish` → `finish`). Status will then resolve to Waiting (saved>0) or Not Assigned (saved=0) via branches 7/8. ✓
- **Yes** → persists `skipped` to DB row, advances; resolver handles via branches 4/5 when last task. ✓

## 4. Zero-tasks-extracted path

In `Inbox.runExtract`, when `tasks.length === 0`:
- still mark `extraction_state = "completed"` and keep status `not_assigned` (matches branch 1) instead of just toasting and returning.
- Skip showing the confirm dialog (already does).

This ensures Action becomes "Complete" per spec without going through the panel.

## 5. Cleanup

- Remove the inline status/action logic currently inside `onPanelFinish`.
- No other call sites of `updateStatus` / `updateExtractionState` related to the extract flow remain (verified: only used by `StatusDropdown` for manual user changes — left intact).

## Verification checklist

- 13 truth-table scenarios produce the exact Status + Action listed.
- Save mid-flow: no resolver call (handled inside panel `advanceOrFinish`).
- No on Skip: no resolver call, panel stays.
- Close (X): single `onFinished` with `closedMidFlow=true`, resolver picks branch 2 or 3.
- Deferred path writes nothing to DB (only sessionStorage + local state).
- No schema changes, no new deps, no UI/badge/menu changes.
