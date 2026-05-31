# Internal Platform Foundation

Adds a protected `/app` workspace under the existing marketing site. All existing routes, tables, and policies remain untouched.

## Part A–D: Database migration (single SQL file)

Create all new tables idempotently (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS` for any pre-existing names). All in `public` schema with `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated` + `GRANT ALL ... TO service_role` (no anon grants — fully auth-only).

**Tables:** workspaces, workspace_members, profiles (skip if exists), clients, contacts, client_members, projects, milestones, task_statuses, tasks, task_assignees, teams, team_members, notes, tags, taggings, documents (note: a `documents` table already exists with `client_user_id` — to avoid collision, this internal table will be named `**platform_documents**` with same columns as spec'd; attachments will reference it), attachments, activities, notifications.

> Note: existing `documents` and `client_users` tables for the client portal are unrelated and untouched. Spec says `documents` — renaming to `platform_documents` is the only deviation, required to prevent breaking the existing client portal. Confirm if you'd prefer a different approach.

**Indexes:** as listed in Part B.

**RLS helpers (SECURITY DEFINER, search_path=public):**

- `is_workspace_member(wid)`, `is_workspace_admin(wid)`, `workspace_role(wid)`, `can_access_client(cid)`

**RLS policies:** per Part C spec, using helpers to avoid recursion. `activities` and `notifications` get SELECT-only for members; writes restricted to `service_role`.

**Functions:**

- `create_workspace_for_user(name, user_id, full_name, email)` — SECURITY DEFINER; inserts workspace (slug = `lower(regexp_replace(name,'[^a-z0-9]+','-','g'))`), upserts profile, inserts admin membership, seeds 5 task_statuses + 9 service_line tags. Returns new workspace_id.
- `accept_pending_invites(user_id, email)` — SECURITY DEFINER; activates pending invites by email.

## Part E: Storage

Create private bucket `platform-documents` via migration (`insert into storage.buckets`). Policies on `storage.objects` for that bucket: authenticated SELECT/INSERT/UPDATE/DELETE where `is_workspace_member((storage.foldername(name))[1]::uuid)`.

## Part F: App bootstrap

- `src/contexts/WorkspaceContext.tsx` — provides `{ workspaceId, workspaceName, role, loading }` via `useWorkspace()`. Queries active memberships on mount + auth change. Auto-selects when exactly one.
- After login (in `AdminLogin` + a shared post-login hook called from WorkspaceContext on `SIGNED_IN`), call `accept_pending_invites(user.id, user.email)` then refetch memberships.
- `src/pages/app/SetupWorkspace.tsx` — shown when authenticated user has zero memberships. Calls `create_workspace_for_user` then routes to `/app/home`.

## Part G: /app shell

- `src/components/app/AppGuard.tsx` — redirects unauthenticated to `/admin/login` (existing login). Wraps WorkspaceProvider. If no membership → SetupWorkspace.
- `src/components/app/AppLayout.tsx` — shadcn `SidebarProvider` shell with:
  - **Sidebar** (`collapsible="icon"`, mobile drawer via shadcn sidebar): workspace name header, nav items (Home, My Tasks, Clients, Projects, Tasks, Dashboards), divider, "Pinned Clients" empty section.
  - **Top bar**: non-functional search input opening a `cmdk` palette on ⌘K (palette wired in later prompt — for now opens empty Dialog), "New" button placeholder, NotificationsBell (realtime subscribed to `notifications` filtered by user_id, shows unread badge), user avatar dropdown (name, role badge, sign out).
- Uses existing design tokens (Playfair/Montserrat, sage/forest/gold). All shadcn components, semantic tokens only.

**Routes added to `App.tsx**` (lazy):

```
/app                      → redirect (desktop → /app/home, mobile → /app/my-tasks)
/app/home
/app/my-tasks
/app/clients
/app/clients/:clientId
/app/projects
/app/tasks
/app/dashboards
/app/setup                → SetupWorkspace (no membership required)
```

Mobile detection via existing `useIsMobile`. Each shell page = title + "Coming soon" placeholder.

**Post-login routing:** modify `AdminLogin` so a successful sign-in for a user with at least one workspace membership routes to `/app/home` (existing admin role check still controls `/admin/*`). Admin users will have both — `/admin/*` continues to work unchanged.

## Files

**Migration:** 1 file (`supabase/migrations/<ts>_platform_foundation.sql`) — covers Parts A–E.

**New code:**

- `src/contexts/WorkspaceContext.tsx`
- `src/components/app/AppGuard.tsx`
- `src/components/app/AppLayout.tsx`
- `src/components/app/AppSidebar.tsx`
- `src/components/app/AppTopBar.tsx`
- `src/components/app/NotificationsBell.tsx`
- `src/components/app/CommandPalette.tsx` (empty shell)
- `src/pages/app/{Home,MyTasks,Clients,ClientDetail,Projects,Tasks,Dashboards,SetupWorkspace}.tsx`

**Modified:**

- `src/App.tsx` — add `/app/*` lazy routes wrapped in `<AppGuard>`.
- `src/pages/admin/AdminLogin.tsx` — after sign-in, check memberships and route to `/app/home` if any (admins still reach `/admin` via direct nav).

Types regenerate automatically after migration.

## Verification checklist

- Marketing routes (`/`, `/about`, `/solutions`, etc.) untouched.
- `/admin/*` flow unchanged.
- Signed-in admin → `/app/home` shows sidebar + topbar.
- Notifications bell renders (badge 0); realtime channel open.
- WorkspaceContext auto-selects the single Vitalis workspace.
- All new tables visible with RLS enabled.

## One clarification before I build

The schema specifies a `documents` table, but the project already has a `documents` table for the client portal (with `client_user_id`). I plan to name the new internal table `**platform_documents**` to avoid breaking the existing portal. Let me know if you'd prefer instead to (a) rename the existing one, or (b) merge them. Otherwise I'll proceed with `platform_documents`.  
  
  
*Proceed with platform_documents. Do not touch the existing documents table.*

*Before skipping the profiles table, check whether it already has the columns full_name, email, and avatar_url. If any are missing, add them with ALTER TABLE ADD COLUMN IF NOT EXISTS.*

*Do not change the post-login routing in AdminLogin. Leave the existing admin routing exactly as is. The /app section is accessed by navigating directly to /app after login.*

*Everything else looks correct. Go ahead and build.*