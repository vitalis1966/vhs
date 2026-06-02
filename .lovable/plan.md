## Goal
Make invited workspace users actually able to sign in by creating an auth account with a temporary password at invite time, matching the existing Administrator / Client User onboarding pattern.

## Changes

### 1. New edge function: `admin-invite-team-member`
Mirrors `admin-create-administrator` / `admin-create-client-user`:
- Verifies the caller is an authenticated workspace admin of the target workspace.
- Input: `workspace_id`, `email`, `full_name`, `role` (`admin` | `manager` | `team_member`), optional `message`.
- Generates a temp password (12+ chars, mixed).
- `supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name } })`.
  - If the email already has an auth user, reuse that `user_id` and skip password generation (do not overwrite their password); flag `reused: true` so the email omits credentials.
- Inserts/updates `profiles` (id, full_name, email).
- Inserts `user_roles` row (`role: 'team_member'` app role — keep workspace-level role separate in `workspace_members`).
- Upserts the `workspace_members` row: sets `user_id`, `status = 'active'`, keeps `role` from input.
- Calls `accept_pending_invites` to clean up any stale pending rows for that email.
- Sends invite email via existing `send-email` function from `noreply@mail.vitalisstrategies.com`:
  - New user → email contains login URL (`/employee-login`), email, temp password, and a note to change it after first login.
  - Existing user → email tells them they've been added to the workspace and to sign in with their existing credentials.
- Returns `{ ok, user_id, reused, email_sent }`.

### 2. `UsersSection.tsx` rewrite of invite path
- `InviteDialog.submit`: stop inserting `workspace_members` directly. Call `supabase.functions.invoke('admin-invite-team-member', { body: {...} })`. Toast surfaces real errors from the function.
- `resendInvite(m)`: call the same edge function with the pending member's email/name/role; the function detects existing pending row and reuses it, re-generates a temp password, and resends the email. (If we don't want password resets on resend, instead just resend the same email via a separate `resend` flag — see Decision below.)
- Remove the client-side `sendInviteEmail` HTML composition (move HTML into the edge function so credentials never live in browser code).
- Pending-tab "Resend Invite" still works the same from the user's POV.

### 3. First-login password change prompt (light touch)
- On successful sign-in at `/employee-login`, check a `profiles.must_change_password` flag. If true, route to `/reset-password` (already exists) and clear the flag after a successful update.
- Migration: add `must_change_password boolean default false` to `profiles`. The edge function sets it to `true` when it generates a temp password.

## Decision needed (one)
**Resend Invite behavior** for pending users:
- (a) Regenerate a new temp password each resend (simpler, current password always works after most recent email).
- (b) Keep the original temp password and just resend the same email (requires storing it — not great). 
Recommend **(a)**.

## Technical Details
- Edge function uses service role key from env; verifies caller via `Authorization` bearer + `auth.getUser()` and `is_workspace_admin(workspace_id)` RPC.
- Temp password generator: 16 chars from `A-Za-z0-9!@#$%` with at least one of each class.
- `config.toml`: add `[functions.admin-invite-team-member] verify_jwt = true`.
- Email HTML reuses the existing Vitalis-branded template (sage header, gold accent bar) currently in `UsersSection.tsx`, moved into the edge function.
- No schema change for `workspace_members`; only the `profiles.must_change_password` column is added.

## Out of scope
- Pre-linking selected `clientIds` at invite time (currently already deferred until accept; can stay deferred or be applied immediately once `user_id` exists — happy to include if you want).
