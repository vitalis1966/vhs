
## Verified context

- **Source tables**: `assessment_sessions` + `assessment_intakes` (`organization_name`), and `documents` + `client_users` (`business_name`). Confirmed.
- **Permission storage**: `workspaces.role_permissions` JSONB, keyed by action → `{ admin, manager, team_member }`. Defined in `src/lib/permissions.ts`, rendered in `src/components/app/settings/RolesSection.tsx`, consumed via `usePermission()`.
- **Helpers available**: `can_access_client()`, `has_role()`, `is_workspace_admin()` DB functions all exist.
- **SubmissionsDashboard columns (1:1 mirror target)**: Client • Organization • Submitted • Status • Email • Meeting • Internal • Client • Analysis • (actions), widths 10/14/9/10/7/8/8/8/8/4 %.
- **ClientDocumentsAdmin columns (1:1 mirror target)**: select • Document Name • Business • Created • Modified • Type • Size • (actions).
- **Clients list** (`src/pages/app/Clients.tsx`) and **client ProjectsTab** (`src/components/app/ProjectsTab.tsx`) currently rely on RLS — no application-layer non-admin filter, so Rules 1 & 2 need a filter added.

## Plan

### 1. Single migration

```sql
create table public.client_submission_assignments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  source_type text not null check (source_type in ('assessment','submission')),
  source_id uuid not null,
  assigned_by text not null check (assigned_by in ('auto','manual')),
  assigned_at timestamptz not null default now(),
  assigned_by_user_id uuid references auth.users(id),
  hidden_in_client boolean not null default false,
  metadata jsonb,
  unique (client_id, source_type, source_id)
);
create index ... on (source_type, source_id);
create index ... on (client_id, source_type);

grant select, insert, update, delete on public.client_submission_assignments to service_role;
grant select, insert on public.client_submission_assignments to authenticated;
grant update (hidden_in_client) on public.client_submission_assignments to authenticated;

alter table ... enable row level security;
-- Admin full access
create policy csa_admin_all ... using (has_role(auth.uid(),'admin')) with check (has_role(auth.uid(),'admin'));
-- Member read (visible only)
create policy csa_member_select for select ... using (can_access_client(client_id) and hidden_in_client = false);
-- Member toggle hidden_in_client (column GRANT already restricts which column)
create policy csa_member_update for update ... using (can_access_client(client_id)) with check (can_access_client(client_id));
-- Admin manual-insert path (covered by csa_admin_all). No member insert.
```

RPCs in same migration:

- `auto_assign_assessment_to_client(p_session_id uuid) returns void` — SECURITY DEFINER, search_path=public. Look up `assessment_intakes.organization_name` via the session; if not null, `insert ... on conflict (client_id, source_type, source_id) do nothing` matching `lower(btrim(name)) = lower(btrim(org_name))`.
- `auto_assign_document_to_client(p_document_id uuid) returns void` — SECURITY DEFINER, same shape via `client_users.business_name`.
- `set_assignment_hidden(p_id uuid, p_hidden boolean) returns void` — SECURITY DEFINER. Checks `can_access_client(client_id)`. Reads `workspaces.role_permissions` for the row's workspace, resolves caller's role from `workspace_members`, and asserts the matching delete permission:
  - assessment row → `reports.delete_internal` (covers the Delete action in the Assessments tab; client-report delete share the same row, so caller must hold `reports.delete_client` OR `reports.delete_internal`; we'll accept either since the row is a single assignment).
  - submission row → `documents.delete`.
  Raises exception on either failure. Then updates `hidden_in_client`.

### 2. `src/lib/permissions.ts`

Append six entries to `PERMISSION_ACTIONS` and `DEFAULT_PERMISSIONS`:

| key | label | default |
|---|---|---|
| `reports.view_internal` | View Internal Reports | ALL |
| `reports.view_client` | View Client Reports | ALL |
| `reports.delete_internal` | Delete Internal Report (Vitalis OS only) | MGRPLUS |
| `reports.delete_client` | Delete Client Report (Vitalis OS only) | MGRPLUS |
| `documents.view` | View Documents | ALL |
| `documents.delete` | Delete Documents (Vitalis OS only) | MGRPLUS |

Add an optional `section?: string` field on each entry; the six new ones get `section: "Reports & Documents"`. Existing entries unchanged (no section → renders in the default group as today).

### 3. `RolesSection.tsx` — render section headers

When iterating `PERMISSION_ACTIONS`, group by `section`. Insert a `<tr>` spanning all columns with the section label whenever the current row's section differs from the previous one. Pure presentation change; storage path is identical.

### 4. New components

**`src/lib/clientDocuments.ts`** — lift the two helpers from `ClientDocumentsAdmin.tsx`:
- `openSignedDocument(storage_path)` (createSignedUrl + window.open)
- `downloadDocument(storage_path, file_name)` (download + blob).
Re-export and refactor `ClientDocumentsAdmin.tsx` to import them (no behaviour change).

**`src/components/app/clients/AssessmentsTab.tsx`** — `client_submission_assignments` (source_type='assessment') joined to `assessment_sessions`, `assessment_intakes`, `assessments`. Uses the same `Table/TableHeader/TableHead/TableRow/TableCell` markup and the exact widths/labels from `SubmissionsDashboard`. Row action cell uses `DropdownMenu` (MoreVertical) with three permission-gated items:
- *Internal Report* (`reports.view_internal`) → opens `InternalReportViewer` sheet.
- *Client Review* (`reports.view_client`) → opens `ClientReportViewer` sheet.
- *Delete* (`reports.delete_internal`) → confirm AlertDialog → `set_assignment_hidden(id, true)` → refetch.
Buttons that the user cannot use are not rendered at all.

**`src/components/app/clients/SubmissionsTab.tsx`** — analogous, joined to `documents` + `client_users`. Actions:
- *View* (`documents.view`) → `openSignedDocument`.
- *Download* (`documents.view`) → `downloadDocument`.
- *Delete* (`documents.delete`) → `set_assignment_hidden(id, true)`.

Empty state for both: small centred card with icon + "No assessments assigned to this client yet." / "No submissions assigned to this client yet." (matches the existing empty-state look used elsewhere in Vitalis OS).

**`src/components/app/clients/reports/InternalReportViewer.tsx`** and **`ClientReportViewer.tsx`** — `Sheet` (right side, `sm:max-w-3xl`). Both fetch via Supabase using `session_id`:
- Internal viewer queries `internal_assessment_reports` directly. If RLS blocks workspace members, fall back to a new `get_internal_report_for_assignment(p_assignment_id uuid)` SECURITY DEFINER RPC that re-checks `can_access_client` and `reports.view_internal` permission — included in the same migration as a safety net only if needed.
- Client viewer reuses the same data path; renders the client-facing variant of the report markup.
Both are pure read components — no edit UI, no links to `/admin/*` routes.

**`src/components/admin/AssignToClientDialog.tsx`** — shared dialog. Props: `open`, `onOpenChange`, `sourceType: 'assessment' | 'submission'`, `sourceId: string`, `onAssigned()`. Renders `Dialog` with search `Input` + scrollable table (Name • Industry • Status) with single-select radio. Confirm → insert into `client_submission_assignments` with `assigned_by='manual'`, `assigned_by_user_id = auth.uid()` (admin RLS covers it).

### 5. VHS Admin edits

**`src/pages/admin/SubmissionsDashboard.tsx`** — replace the existing row Delete `Button` with `DropdownMenu` (MoreVertical trigger). Items:
- *Delete* → existing handler unchanged.
- *Assign to Client* → opens `AssignToClientDialog` with `sourceType='assessment'`, `sourceId=session.id`. If `assigned_map[session.id]` true → render menu item as disabled with text *Assigned*. Fetch a `Set` of assigned session ids once per load.

**`src/pages/admin/ClientDocumentsAdmin.tsx`** — same 3-dots replacement on the row actions cell (preserve Download + Delete in the menu; keep bulk Download/Delete bar unchanged). Add *Assign to Client* / *Assigned* with `sourceType='submission'`, `sourceId=doc.id`. Existing per-row Delete keeps its AlertDialog confirmation flow.

### 6. Auto-assign hook points

- **`src/pages/assessment/AssessmentClient.tsx`** — directly after the existing `update_session_by_token` submit call (~line 208), add `supabase.rpc('auto_assign_assessment_to_client', { p_session_id: sessionId }).then(...).catch(console.error)`. Non-blocking.
- **`src/pages/portal/ClientDocuments.tsx`** — after the successful `documents` insert, call `supabase.rpc('auto_assign_document_to_client', { p_document_id: row.id }).catch(console.error)`. Non-blocking.

### 7. Client tabs wiring

`src/pages/app/ClientDetail.tsx` — add two new `<TabsTrigger value="assessments">Assessments</TabsTrigger>` and `<TabsTrigger value="submissions">Submissions</TabsTrigger>` immediately after the existing Files trigger, plus matching `<TabsContent value="assessments"><AssessmentsTab clientId={id} /></TabsContent>` and same for submissions. Nothing else in this file changes.

### 8. Rules 1 & 2 (application-layer filters only)

- **`src/pages/app/Clients.tsx`** — read `role` from `useWorkspace()`. If not `admin`, after fetching `clients`, narrow to those where `account_owner_id === auth.uid()` OR id is in `client_members` for this user. Add a single extra `client_members.select('client_id').eq('user_id', uid)` query.
- **`src/components/app/ProjectsTab.tsx`** — if `role !== 'admin'`, add `.eq('owner_id', uid)` to the projects query. Admins keep the unfiltered list.

No existing RLS touched.

### 9. Out of scope (explicit non-goals)

- No edit UI, no `reports.edit_*` permissions.
- No redirects to `/admin/*` from any Vitalis OS component.
- No source-row deletion anywhere.
- No `project_members` table.
- `metadata` jsonb column is created but unused in this build.
- No new npm packages.

## File touch list

New:
- `supabase/migrations/<ts>_client_submission_assignments.sql`
- `src/lib/clientDocuments.ts`
- `src/components/admin/AssignToClientDialog.tsx`
- `src/components/app/clients/AssessmentsTab.tsx`
- `src/components/app/clients/SubmissionsTab.tsx`
- `src/components/app/clients/reports/InternalReportViewer.tsx`
- `src/components/app/clients/reports/ClientReportViewer.tsx`

Edited:
- `src/lib/permissions.ts` (+6 entries, +section field)
- `src/components/app/settings/RolesSection.tsx` (section header rows)
- `src/pages/app/ClientDetail.tsx` (two tab triggers + contents)
- `src/pages/app/Clients.tsx` (Rule 1 filter)
- `src/components/app/ProjectsTab.tsx` (Rule 2 filter)
- `src/pages/admin/SubmissionsDashboard.tsx` (3-dots menu + Assign)
- `src/pages/admin/ClientDocumentsAdmin.tsx` (3-dots menu + Assign, lift helpers)
- `src/pages/assessment/AssessmentClient.tsx` (auto-assign RPC call)
- `src/pages/portal/ClientDocuments.tsx` (auto-assign RPC call)
