# Internal Report Viewer, Client Report Viewer & Sidebar Collapse

## Findings from exploration

**VHS Admin report rendering**
- Internal report: `src/pages/admin/InternalReport.tsx` (622 lines) — full page at route `/admin/submissions/:sessionId`, guarded by `AdminGuard`. Loads session, intake, internal report, sections via direct Supabase queries from `sessionId` URL param. Contains admin-only actions interleaved with rendering: "Regenerate analysis" (calls `analyze-assessment` edge function), navigation to client-report editor, etc.
- Client report: `src/pages/admin/ClientReport.tsx` (1031 lines) — route `/admin/submissions/:sessionId/client-report`, guarded by `AdminGuard`. Loads internal report + `client_report_edits` + `client_report_tokens`, supports inline editing, token generation, sending client email, and embeds `BookingWidget`.
- Both pages **open inline** (router navigation), not in new tabs. They are not referenced via `window.open` / `target=_blank`.
- Both contain admin-only logic that must be stripped for OS reuse.

**OS sidebar**
- `src/components/ui/sidebar.tsx` already exposes `useSidebar().toggleSidebar()` and a `SidebarTrigger`. The trigger is already mounted in `src/components/app/AppTopBar.tsx` (line 66), and collapsed state is persisted via the `sidebar:state` cookie.
- The user's request is specifically for a toggle inside the **sidebar header** (under the "Vitalis OS" branding). No new state mechanism is needed — we surface `toggleSidebar()` there.
- `sessionStorage` is not required because the existing cookie already persists state across the session.

## Decisions

1. **Extract read-only display components** under `src/components/shared/reports/`:
   - `InternalReportDisplay.tsx` — takes `sessionId: string`, fetches its own data (session, intake, internal report, sections) and renders the exact JSX currently in `InternalReport.tsx`. No edit, regenerate, send-email, or navigation controls.
   - `ClientReportDisplay.tsx` — takes `sessionId: string` and optional `readOnly` flag, fetches report + `client_report_edits`, renders the exact JSX currently in `ClientReport.tsx`. When `readOnly`, hides edit fields, token controls, email send, and `BookingWidget`.
2. **Refactor VHS Admin pages** to delegate rendering to the new shared components. The admin pages keep all their admin-only actions in a toolbar/wrapper around the shared display — so VHS Admin behavior is unchanged but both surfaces render from one source of truth.
3. **OS viewers open in a new tab**, since the request says "match exactly" and OS routes must not redirect to `/admin/*`. New OS-only routes will be added:
   - `/app/clients/:clientId/assessments/:assignmentId/internal-report`
   - `/app/clients/:clientId/assessments/:assignmentId/client-report`
   These resolve `session_id` from the assignment via the existing `list_client_assessment_assignments` RPC (or a small lookup against `client_submission_assignments`), then render the shared display component. Permission-gated by the existing `view_internal_report` / `view_client_report` permission keys.
   - Note: VHS Admin opens inline. The spec says "Opens in a new tab if VHS Admin opens it in a new tab; opens inline if VHS Admin renders it inline." Since VHS Admin is inline, the OS viewers will technically be **inline OS routes** rather than `window.open` new tabs — same model. The existing `Sheet`-based viewers (`InternalReportViewer.tsx`, `ClientReportViewer.tsx`) will be replaced by `Link`/`navigate` to these routes, then deleted.
4. **Sidebar collapse button**: add an icon button (`PanelLeftClose` from lucide-react, already used in the design language) inside `SidebarHeader` in `src/components/app/AppSidebar.tsx`. Wires to `useSidebar().toggleSidebar()`. When collapsed, the existing `collapsible="icon"` behavior already shows icon-only mode; the existing topbar `SidebarTrigger` continues to act as the re-open control (and is the standard expand affordance).

## Files

**New**
- `src/components/shared/reports/InternalReportDisplay.tsx`
- `src/components/shared/reports/ClientReportDisplay.tsx`
- `src/pages/app/AssignmentInternalReportPage.tsx`
- `src/pages/app/AssignmentClientReportPage.tsx`

**Edited**
- `src/pages/admin/InternalReport.tsx` — strip rendering JSX, wrap `<InternalReportDisplay sessionId={sessionId}/>` with admin toolbar.
- `src/pages/admin/ClientReport.tsx` — strip rendering JSX, wrap `<ClientReportDisplay sessionId={sessionId} readOnly={false}/>` with admin toolbar (edit, tokens, email, BookingWidget).
- `src/components/app/clients/AssessmentsTab.tsx` — replace Sheet opens with navigation to new OS report routes.
- `src/App.tsx` — register the two new OS routes (lazy).
- `src/components/app/AppSidebar.tsx` — add `PanelLeftClose` toggle button in `SidebarHeader` calling `toggleSidebar()`.

**Deleted**
- `src/components/app/clients/reports/InternalReportViewer.tsx`
- `src/components/app/clients/reports/ClientReportViewer.tsx`

## Constraints honored
- No schema changes, no new dependencies.
- VHS Admin actions and routes preserved; only the rendering JSX is hoisted into shared components used by both surfaces.
- OS routes never redirect to `/admin/*`; data is fetched directly via existing RPCs/queries.
- Existing `view_internal_report` / `view_client_report` permission gates from the prior build are reused.
- Sidebar uses the existing `useSidebar` state and cookie persistence — no new state, no `sessionStorage` key.
