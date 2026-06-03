## Goal
Make the **Client Login** button (top-right of the navbar) a documents-only entry point that works for both client users and VHS admins, with proper scoping.

## Current state (verified)
- `ClientLoginDialog` already authenticates via Supabase and routes by role.
- RLS on `public.documents` already enforces: clients see only rows where `client_user_id = auth.uid()`; admins see all. No DB changes needed.
- `/portal/documents` (`ClientDocuments.tsx`) is guarded by `ClientGuard` (requires `has_role(client)`) and already filters its query to the signed-in client.
- `/admin/client-management/documents` (`ClientDocumentsAdmin.tsx`) is guarded by `AdminGuard` and lists submissions from all clients.

## Problems with current behavior
1. After admin login through the Client Login dialog, the user is redirected to `/admin` (the full admin dashboard) instead of the Documentation Submissions page.
2. Users with neither role get a generic "no access" toast — fine, but we should be explicit.

## Change (frontend only)
Edit **`src/components/ClientLoginDialog.tsx`** `handleLogin`:

- After successful `signInWithPassword`, check `has_role(client)` and `has_role(admin)` in parallel (already done).
- Routing:
  - `isClient` → `navigate("/portal/documents")` (unchanged; client sees only their docs via RLS).
  - `isAdmin` → `navigate("/admin/client-management/documents")` (new: documents-only landing, not `/admin`).
  - Neither → `supabase.auth.signOut()` and show "Access denied" toast (unchanged).
- Keep platform context untouched — this login is for the client portal flow, not VHS/Vitalis OS guards.

No other files change. No DB, RLS, routing, or guard changes are required since:
- Client scoping is already enforced by RLS and the existing `.eq("client_user_id", user.id)` query in `ClientDocuments`.
- Admin-wide visibility is already provided by the admin documents page.

## Out of scope
- No changes to `AdminGuard`, `ClientGuard`, `AdminLogin`, or platform separation logic added in earlier turns.
- No UI/style changes to the dialog or pages.