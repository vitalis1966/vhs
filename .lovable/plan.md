

## Plan: Administrators, Logging, Client Management & Client Portal

Confirmed: any file type allowed (50 MB limit only), no forced password change on first login. Proceeding with the same plan as previously presented, with the two confirmations baked in.

### 1. Database migration (one file, all RLS enabled)

- **Enum** `app_role` (`admin`, `client`).
- **`user_roles`** — `(id, user_id, role, created_at)`, unique `(user_id, role)`. Plus SECURITY DEFINER `has_role(_user_id, _role)`.
- **`administrators`** — `id`, `name`, `email` UNIQUE, `is_active` (default true), `is_builtin` (default false), `created_at`, `updated_at`. Triggers: auto-update `updated_at`; block DELETE when `is_builtin = true`. Seed row for `admin@vitalisstrategies.com` with `is_builtin = true`.
- **`activity_logs`** — `id`, `user_name`, `action` (Login | File Upload | File Deletion | Password Reset | Password Changed), `status` (Success | Failed), `created_at`. RLS: admins read/delete; authenticated + service_role insert.
- **`client_users`** — `id` (= auth.users.id), `name`, `email` UNIQUE, `is_active`, `phone`, `business_name`, `created_at`, `updated_at`. RLS: admins manage all; client may SELECT own row.
- **`documents`** — `id`, `client_user_id`, `file_name`, `file_type` (MIME), `file_size` bigint, `storage_path`, `created_at`, `updated_at`. **CHECK constraint `file_size <= 52428800`** + RLS: admins manage all; client manages only `client_user_id = auth.uid()`.
- **Storage** — private bucket `client-documents` with `file_size_limit = 52428800` and no allowed-MIME restriction (any type). Storage policies: user can read/write/delete only objects under prefix `{auth.uid()}/...`; admins manage all.
- **`AdminGuard` hardening** — also enforce `has_role(uid, 'admin')`; the migration seeds the existing admin email into `user_roles` to avoid lockout.

### 2. Edge functions (each reuses the existing `VHS_Website` Resend secret + the email shell from `send-contact-email`)

| Function | Purpose |
|---|---|
| `admin-create-administrator` | Service-role: create auth user with random 16-char temp password, insert `administrators` row + `user_roles(admin)`, email welcome with username + temp password. |
| `admin-create-client-user` | Same as above for `client_users` + `user_roles(client)`. |
| `admin-reset-password` | Generate new temp password, update auth user, email creds, write `Password Changed` log. |
| `admin-delete-user` | Hard delete; rejects when target `is_builtin = true`. |
| `notify-document-event` | Email all active admins on document upload / modification / deletion; includes client's business name. |
| `admin-import-csv` / `client-import-csv` | Bulk create/update from CSV. |

All functions: validate JWT, verify caller via `has_role(uid, 'admin')`, return JSON + CORS, log to `activity_logs`. No forced password change on first login.

### 3. Admin Dashboard cards (existing `AdminDashboard.tsx` grid)

Three new cards, matching current card styling:
- **Administrators** → `/admin/administrators`
- **Logging** → `/admin/logging`
- **Client Management** → `/admin/client-management` (landing with two sub-cards)

#### `/admin/administrators`
Reusable `<SortableFilterableTable />` (header sort + per-column text filter). Columns: Name, Username, Active (Switch), Created, Modified, Actions (Edit, Reset Password, Delete — disabled when `is_builtin`). Toolbar: Add Administrator (Dialog), Export CSV, Import CSV.

#### `/admin/logging`
Same table component. Columns: User, Action, Date, Status (green Success / red Failed badge). Toolbar: Refresh, Clear Logs (AlertDialog confirm), Export CSV, Show Records (50 / 100 / All).

#### `/admin/client-management`
Two sub-cards:
- `/admin/client-management/users` — mirrors Administrators table; adds Phone + Business Name; Add User dialog includes them.
- `/admin/client-management/documents` — admin view of all documents across clients: Document Name, Created, Modified, Type (human label via `mimeLabel.ts`), Size (human-readable via `formatBytes.ts`), header + per-row checkbox, per-row Delete + bulk delete.

### 4. Client Login (public site) & Client Portal

- **Navbar** — add "Client Login" button immediately after "Speak With Our Team" using the **exact** existing `<Button variant="hero" size="sm">` props + responsive label classes; same in the mobile menu. Opens a `Dialog` with email/password + "Forgot my password" link.
- **Login flow** — `signInWithPassword` → check `has_role`. Client → `/portal/documents`. Admin → `/admin`. Neither → sign out + toast. Login attempts (success + failure) write to `activity_logs`.
- **Forgot password** — `resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`. New public `/reset-password` page handles `type=recovery` and calls `updateUser({ password })`; writes `Password Reset` log on success.
- **Client portal `/portal/documents`** — guarded by new `ClientGuard` (mirrors `AdminGuard`, requires `has_role(uid, 'client')`).
  - Title: `${business_name ? business_name + ' ' : ''}Documentation Submissions`
  - Add Document → file picker (any type), client-side reject `> 52428800` bytes, upload to `client-documents/{auth.uid()}/{uuid}-{name}`, insert `documents` row, fire `notify-document-event`, write `File Upload` log.
  - Document table: Document Name, Created, Modified, Type, Size, Delete (AlertDialog confirm) → removes object + row, fires `notify-document-event` (deletion), writes `File Deletion` log.
  - Wraps in existing `Navbar` + `Footer`; uses existing Tailwind tokens (`bg-card rounded-2xl shadow-soft border-border/40`, font-display headings).

### 5. Files added / changed

**New migration**
- `supabase/migrations/<ts>_admin_clients_and_logging.sql`

**New edge functions**
- `admin-create-administrator/`, `admin-create-client-user/`, `admin-reset-password/`, `admin-delete-user/`, `notify-document-event/`, `admin-import-csv/`, `client-import-csv/`

**New React files**
- `src/components/ClientGuard.tsx`
- `src/components/ClientLoginDialog.tsx`
- `src/components/admin/SortableFilterableTable.tsx`
- `src/components/admin/AdminToolbar.tsx`
- `src/lib/mimeLabel.ts`, `src/lib/formatBytes.ts`, `src/lib/csv.ts`
- `src/pages/admin/AdministratorsAdmin.tsx`
- `src/pages/admin/LoggingAdmin.tsx`
- `src/pages/admin/ClientManagement.tsx`
- `src/pages/admin/ClientUsersAdmin.tsx`
- `src/pages/admin/ClientDocumentsAdmin.tsx`
- `src/pages/portal/ClientDocuments.tsx`
- `src/pages/ResetPassword.tsx`

**Edited**
- `src/App.tsx` — add lazy routes (admin + portal + reset-password)
- `src/components/AdminGuard.tsx` — also enforce `has_role(uid, 'admin')`
- `src/components/Navbar.tsx` — add Client Login button (desktop + mobile)
- `src/pages/admin/AdminDashboard.tsx` — add three new cards
- `supabase/config.toml` — register the 7 new edge functions

### 6. Risk & callouts
- New `has_role` check in `AdminGuard` — migration seeds existing admin emails into `user_roles` to prevent lockout.
- 50 MB limit enforced in three places: client-side check, storage bucket `file_size_limit`, and DB CHECK constraint on `documents.file_size`.
- Built-in admin `admin@vitalisstrategies.com` cannot be deleted: enforced by trigger AND by `admin-delete-user` precheck. Password CAN still be reset by other admins.
- Per spec: passwords are NOT force-rotated on first login.

