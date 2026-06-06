
## Goal

Add per-column filter + sort controls to 6 list views (Inbox, My Tasks, Clients, Projects, Tasks Table, Tasks Board, Time Tracking Entries, Time Tracking Reports) and expand the Time Tracking user dropdown. All work is client-side over already-loaded data — no schema, RLS, edge function, or `types.ts` changes. VHS Administration is untouched.

## Shared building blocks (new) — `src/components/app/columns/`

- **`ColumnHeader.tsx`** — label + tri-state sort caret (`ArrowUpDown` / `ArrowUp` / `ArrowDown`) + optional `Filter` icon button. When the column's filter is active, render a `bg-primary` dot on the icon. Filter icon opens a `Popover` containing the supplied filter primitive.
- **`useTableFilters.ts`** — `useState`-backed: `{ sort: { key, dir: 'asc'|'desc' } | null, filters: Record<key, FilterValue> }`. Exposes `toggleSort(key)`, `setFilter(key, value)`, `clearFilter(key)`, and `apply<T>(rows, { getters, comparators })` returning sorted+filtered array. State lives in the consuming component, so it persists while mounted and resets on unmount (matches "persist while user remains on the view").
- **Filter primitives** in same folder:
  - `TextFilter` — `Input`; case-insensitive `includes`.
  - `MultiSelectFilter` — scrollable list of `Checkbox` rows with a "Clear" button.
  - `DateRangeFilter` — two `Input type="date"` (mirrors `TimeReports` pattern).
  - `NumberRangeFilter` — two `Input type="number"`; consumer translates min/max → seconds for duration filtering, UI labels say "minutes".

No new dependencies. Uses existing `Popover`, `Input`, `Checkbox`, `Button`, and lucide icons already imported elsewhere.

## Per-view changes

### 1. Inbox (`src/pages/app/Inbox.tsx`)
Replace plain `TableHead` cells for From / Subject / Received / Status with `ColumnHeader`. Apply `useTableFilters` to the `emails` array before mapping. Default sort = `received_at desc` (current). Row layout, action dots, status dropdown, and bulk-select behavior unchanged. Header label "Received" kept (Date is already present).

### 2. My Tasks (`src/pages/app/MyTasks.tsx`)
- Replace the column-label `div` row at lines 218–228 with `ColumnHeader`s for: Title (text), Client (multi-select from loaded `clients`), **Project** (new — presentational), Status (multi-select from loaded `statuses`), Priority (multi-select), Due (date range), Assignee (multi-select; only the current user is present here, included for parity).
- The Project column is presentational only and **uses already-loaded row data** (`row.project_id`). Since no projects lookup is loaded today and the spec forbids a new query/join, the cell renders either the raw project label embedded in the loaded data (currently just `project_id` — shown truncated to first 8 chars) or "—" when null. Multi-select filter lists distinct project IDs found on the loaded rows.
- Row body gains a matching `project` cell with the same width allocation; existing column widths for other cells are preserved.
- Source, action dots, timer button, side panel, sort-by-due default, and `showCompleted` switch all unchanged.

### 3. Clients (`src/pages/app/Clients.tsx`)
Table view headers (`Company`, `Status`, `Specialty`, `Tags`, `Account Owner`, `Open Tasks`) become `ColumnHeader`s:
- Company → text + sort
- Status → multi-select of distinct statuses
- Specialty (industry) → text + sort
- Tags → multi-select of all workspace tags (reuses `allTags`)
- Account Owner → multi-select of distinct owners (reuses `owners`)
- Open Tasks → number range + sort
Existing top-of-page tag popover, board view, and creation dialog untouched.

### 4. Projects (`src/pages/app/Projects.tsx`)
Table view headers (`Project`, `Client`, `Status`, `Target`, `Owner`, `Progress`) become `ColumnHeader`s with: text, multi-select, multi-select, date range, multi-select, number range. Existing top-bar `Select` filters and board view remain. Note: only `target_date` exists on the model (no Start Date) — only that single date column is wired.

### 5. Tasks Table (`src/components/app/TaskTable.tsx`)
Headers become `ColumnHeader`s for: Title (text), Client (multi-select), Project (multi-select), Status (multi-select), Priority (multi-select), Due (date range), Assignees (multi-select from `profiles`). Existing `sortBy` buttons are removed in favor of the unified header sort. `TasksFilters` top bar remains and composes with column filters. Bulk action bar, row click, and action menu unchanged.

### 6. Tasks Board (`src/components/app/TaskBoard.tsx`)
Each `Column`'s header gains:
- A `Filter` icon → popover with a single text input that searches task name **within this column only**.
- A sort icon → `DropdownMenu` with: Task Name A–Z / Z–A, Priority High→Low / Low→High, Due Earliest→Latest / Latest→Earliest.
- State stored as `Record<statusId, { search: string; sort: { key, dir } | null }>` inside `TaskBoard`, fully independent per column.
- Drag-and-drop wiring, `useDraggable` IDs, `onDragEnd`, and the underlying `tasks` array are not modified. Filtering only changes which cards are rendered inside the column; cross-column drags continue to call the same status-update logic.

### 7. Time Tracking user dropdown (`src/pages/app/TimeTracking.tsx`)
- Replace `scope: 'mine' | 'all'` with `selection: 'mine' | 'all' | <userId>`.
- Fetch active workspace members via the **same query pattern already used by `TimeReports`** (`workspace_members` + `profiles` join, `status='active'`). Only fired when `isAdmin` (matches current gating).
- `Select` content: `My entries`, `All team members`, a divider (`<SelectSeparator>`), then one `SelectItem` per member sorted alphabetically by `full_name ?? email`.
- `load()` query branching: `mine` → `eq('user_id', userId)`; `all` → no user filter; otherwise → `eq('user_id', selection)`.

### 8. Time Tracking Entries list (`src/pages/app/TimeTracking.tsx`)
- Add a sticky header row above the grouped entries block with `ColumnHeader`s: Client, Project, Task, Activity, Date, Duration. Header width allocations match the row layout already rendered inside groups (left-aligned columns + right-aligned duration).
- Filters apply across the full entry set; a group whose entries are all filtered out is **omitted entirely** (no orphan group header). Specifically for the date-range filter, this collapses entire date/week groups, not individual rows.
- Sort applies within each group (default keeps `started_at desc`).
- Duration filter UI in minutes; comparison done in seconds against `duration_seconds`. Display continues to use `formatDuration`.
- Manual entry dialog, edit, delete, CSV export, view selector, and date navigation unchanged.

### 9. Time Tracking Reports (`src/components/app/time/TimeReports.tsx`)
- Modify the **existing** breakdown table only — no new sub-tables.
- Replace the table that currently lists primary `label / HH:MM / Decimal` rows so each entry is rendered inline with the required columns: Client, Project, Task, Activity, User (admin only), Date, Duration. Each column header uses `ColumnHeader` with the right filter primitive (text/multi-select/date range/number range).
- The footer "Total" row remains pinned and is computed from the **unfiltered** `entries` set (the report's primary date+scope filters), so totals are not affected by inline column filters. Same for the pie chart, line chart, and breakdown aggregates above/around the table.
- CSV export keeps using the unfiltered `primary` set — unchanged.

## Out of scope (explicit)

- No DB migrations, RLS, edge functions, or `types.ts` changes.
- Board drag-and-drop, card layout, and inter-column moves are not modified.
- Task creation, side panels, and existing top-bar filters are not modified.
- VHS Administration is not touched.
- No new npm dependencies.

## Verification after build

- Inbox: header sort cycles asc/desc/none; status multi-select narrows rows; date range filters by `received_at`; action dots still open viewer/extract; bulk-select still works.
- My Tasks: new Project column present; filters compose; due-date asc default preserved; side panel + timer unaffected.
- Clients / Projects tables: column filters compose with existing top-level filters; board views untouched.
- Tasks Table: removal of old `sortBy` buttons does not break sort; `TasksFilters` bar still works.
- Tasks Board: filter in column A leaves column B unchanged; dragging a card between columns still persists the status update.
- Time Tracking: dropdown shows My / All / divider / alphabetized members; selecting a user reloads only that user's entries; entries-list header filters collapse groups; reports column filters do not change totals or charts.
