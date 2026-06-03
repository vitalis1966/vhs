## Goal

Hard separation between **VHS Administration** and **Vitalis OS** using a single shared `auth.users` table. Access is governed by a `platform_roles` table plus an explicit **per-tab platform context** captured at login. Cross-platform navigation does not silently succeed — it clears the platform context and bounces the user to that platform's own login screen.

## Audit (current state)

- Shared Supabase `auth.users`.
- VHS admins → `public.user_roles` (enum `app_role = 'admin'|'client'`), checked via `has_role(uid,'admin')`. Created in `admin-create-administrator` edge function.
- Vitalis OS users → `public.workspace_members` (workspace_id, user_id, role, status). Invited in `admin-invite-team-member`.
- `AdminGuard` currently *silently* redirects non-admin members to `/app/home`; `AppGuard` lets in anyone with an active membership — both violate the requested isolation.
- Login pages: `/admin/login` and `/employee-login`. Both call `signInWithPassword` and then navigate, with no platform tagging.

## Approach

1. **DB**: add `platform_roles` + `has_platform_access()` helper, backfill from existing tables.
2. **Per-tab platform context**: a tiny client module persists the platform the user logged into under `sessionStorage` (per-tab, never cross-tab, never cross-platform).
3. **Login pages**: after `signInWithPassword`, verify `has_platform_access` for *that* platform; on success write the platform context; on failure sign out and toast.
4. **Guards**: both `AdminGuard` and `AppGuard` require (a) a session, (b) the platform context to match the route's platform, and (c) `has_platform_access` for that platform. Mismatch → clear context + `signOut()` + redirect to the correct login screen.
5. **Create/invite flows** write the matching `platform_roles` row.
6. **No UI changes** except the redirect behavior described above.

### 1. Database migration

```sql
create type public.platform_kind as enum ('vhs', 'vitalis_os');

create table public.platform_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform public.platform_kind not null,
  role text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, platform)
);

grant select on public.platform_roles to authenticated;
grant all on public.platform_roles to service_role;

alter table public.platform_roles enable row level security;
create policy pr_self_select on public.platform_roles
  for select to authenticated using (user_id = auth.uid());
-- writes only via service_role (edge functions / migrations)

create trigger platform_roles_touch
  before update on public.platform_roles
  for each row execute function public.touch_updated_at();

create or replace function public.has_platform_access(_user uuid, _platform public.platform_kind)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.platform_roles
    where user_id = _user and platform = _platform and is_active = true
  )
$$;

-- Backfill (idempotent)
insert into public.platform_roles (user_id, platform, role, is_active)
select ur.user_id, 'vhs'::platform_kind, 'admin', true
from public.user_roles ur where ur.role = 'admin'
on conflict (user_id, platform) do nothing;

insert into public.platform_roles (user_id, platform, role, is_active)
select distinct on (wm.user_id) wm.user_id, 'vitalis_os'::platform_kind, wm.role, true
from public.workspace_members wm
where wm.status = 'active' and wm.user_id is not null
on conflict (user_id, platform) do nothing;
```

### 2. Per-tab platform context

New file `src/lib/platformContext.ts`:

```ts
export type Platform = "vhs" | "vitalis_os";
const KEY = "vhs.platformContext";
export const getPlatform = (): Platform | null =>
  (sessionStorage.getItem(KEY) as Platform | null) ?? null;
export const setPlatform = (p: Platform) => sessionStorage.setItem(KEY, p);
export const clearPlatform = () => sessionStorage.removeItem(KEY);
export const loginPathFor = (p: Platform) =>
  p === "vhs" ? "/admin/login" : "/employee-login";
```

`sessionStorage` is per-tab, so a user who has both platforms open in separate tabs maintains an independent platform per tab. Closing the tab clears it. We never sync this across tabs.

### 3. Login pages (no visual change)

**`AdminLogin.tsx`** — after `signInWithPassword`:
- Call `rpc("has_platform_access", { _user, _platform: "vhs" })`.
- If false → `clearPlatform()`, `signOut()`, toast "This account does not have VHS Administration access." Stay on page.
- If true → `setPlatform("vhs")` then `navigate("/admin")`.

**`EmployeeLogin.tsx`** — same pattern with `'vitalis_os'`. Keep the existing `must_change_password` redirect (still navigates to `/reset-password`, platform context already set).

### 4. Guards

**`AdminGuard.tsx`**:
1. If no session → `clearPlatform()` → `navigate("/admin/login")`.
2. Read `getPlatform()`. If it is not `"vhs"` → `clearPlatform()`, `signOut()`, `navigate("/admin/login", { replace: true })`. Do not check `vitalis_os` access here.
3. If platform is `"vhs"` but `has_platform_access(uid,'vhs')` is false → same: clear + signOut + redirect to `/admin/login` with a toast.
4. Otherwise render children. Remove the current "redirect non-admins to /app/home" branch entirely.

**`AppGuard.tsx`** (inside `WorkspaceProvider`):
1. If no session → `clearPlatform()` → `navigate("/employee-login")`.
2. If `getPlatform() !== "vitalis_os"` → `clearPlatform()`, `signOut()`, `navigate("/employee-login", { replace: true })` with a toast.
3. If platform is `"vitalis_os"` but `has_platform_access(uid,'vitalis_os')` is false → same flow to `/employee-login`.
4. Otherwise existing membership / setup logic continues unchanged.

`onAuthStateChange` listeners in both guards re-run these checks so a sign-out in one tab still resolves cleanly.

### 5. Edge function updates (write platform_roles)

- `admin-create-administrator`: after inserting `user_roles`, also `upsert into platform_roles (user_id, platform, role, is_active) values (created.user.id, 'vhs', 'admin', true) on conflict (user_id, platform) do update set is_active = true, role = excluded.role, updated_at = now();`.
- `admin-invite-team-member`: same upsert with `'vitalis_os'` and the workspace role.
- `admin-delete-user`: when an administrator is removed, also set the corresponding `platform_roles` row `is_active = false` (or delete it) for `'vhs'`. Workspace member removal already happens through workspace UI; mirror that with a soft-disable on the `'vitalis_os'` row.

These run with `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS — no additional grants needed.

### 6. UI

No visual changes. Login screens, AdminDashboard, VHSManagement, AdministratorsAdmin, Workspace Users & Permissions, and AppLayout/AppSidebar all stay exactly as they are. The only user-visible difference is the explicit redirect-to-login behavior on cross-platform attempts (instead of the previous silent jump or open access).

## Files

**Created**
- `supabase/migrations/<ts>_platform_roles.sql`
- `src/lib/platformContext.ts`

**Edited**
- `src/components/AdminGuard.tsx`
- `src/components/app/AppGuard.tsx`
- `src/pages/admin/AdminLogin.tsx`
- `src/pages/EmployeeLogin.tsx`
- `supabase/functions/admin-create-administrator/index.ts`
- `supabase/functions/admin-invite-team-member/index.ts`
- `supabase/functions/admin-delete-user/index.ts`

## Notes & assumptions

1. **Per-tab isolation via `sessionStorage`** is the cleanest way to meet "no automatic cross-platform session sharing" while keeping a single Supabase auth session — the auth token is shared by Supabase's design, but the *application* refuses to act on it without a matching platform context, and re-asks the user to log in to the other platform.
2. **Dual-platform users**: if Jane has both `('vhs','admin')` and `('vitalis_os','manager')`, she logs in once at `/admin/login` to use VHS in tab A, and separately at `/employee-login` to use Vitalis OS in tab B. The two tabs operate independently.
3. **Existing accounts** keep working: the migration backfill assigns the right platform role(s) automatically, so no one is locked out on first deploy.
4. RLS on existing tables is left as-is; isolation at the data layer is already enforced (VHS data via `has_role(uid,'admin')`, OS data via `workspace_members`). `platform_roles` is the gate at the route layer.