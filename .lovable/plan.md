## Problem

Right now `inbound_emails` rows are removed with a hard `DELETE` whenever any of the manual UI paths run (single-row menu → Delete, bulk action bar → Delete). There is no automatic deletion code in the project (no cron, no trigger, no edge function deletes inbound emails), but because the deletes are **hard** there is also no audit trail and no way to recover anything. The table is currently empty, so something/someone removed everything irreversibly and we cannot tell what or when.

This plan does two things: (1) makes deletion safe and auditable, and (2) guarantees only an explicit user action can remove an email — never any automated flow.

## What changes

### Database
- Add `deleted_at timestamptz` and `deleted_by uuid` columns to `public.inbound_emails`.
- Add a partial index on `(workspace_id, received_at DESC) WHERE deleted_at IS NULL` for the live inbox.
- Replace the existing DELETE RLS policy with one that **only allows the assigned user, workspace admin, or workspace manager** to delete — same as today, just unchanged behavior on permissions. (No DB-side hard-delete by default; we just stop using it from the app.)
- Add a small `inbound_email_deletions` audit table:
  - `email_id`, `workspace_id`, `from_email`, `subject`, `deleted_by`, `deleted_at`, `mode ('soft'|'hard')`
  - RLS: workspace admins/managers can read; inserts via SECURITY DEFINER RPC only.
- Add a `BEFORE DELETE` trigger on `inbound_emails` that records every hard-delete row into `inbound_email_deletions` so we always know who/when if a real DELETE ever happens again.

### Backend (RPCs / edge function)
- New SECURITY DEFINER RPC `soft_delete_inbound_email(p_id uuid)`:
  - Permission check (assignee/admin/manager).
  - Sets `deleted_at = now()`, `deleted_by = auth.uid()`.
  - Writes audit row with `mode = 'soft'`.
- New SECURITY DEFINER RPC `restore_inbound_email(p_id uuid)`:
  - Same permission check.
  - Nulls `deleted_at` / `deleted_by`.
- New SECURITY DEFINER RPC `hard_delete_inbound_email(p_id uuid)`:
  - Admin/manager only, and only allowed when row is already soft-deleted.
  - Performs the actual DELETE (audit captured by the trigger).
- Edge function `email-inbound` is unchanged but we re-confirm it never deletes; just inserts.
- Edge function `extract-email-tasks` is unchanged on the email row (it only updates `extraction_state`); we re-confirm it does not delete `inbound_emails`.

### Frontend (`src/pages/app/Inbox.tsx`)
- The list query gets a `.is("deleted_at", null)` filter.
- Single-row "Delete" action calls `soft_delete_inbound_email` instead of `.from("inbound_emails").delete()`.
- Bulk "Delete" action loops/calls `soft_delete_inbound_email` for each selected id (or a small batched RPC `soft_delete_inbound_emails(p_ids uuid[])` for efficiency).
- Add a "Trash" toggle/tab at the top of the inbox:
  - Lists soft-deleted emails (most recent first).
  - Each row shows who deleted it and when, plus actions: **Restore** (calls `restore_inbound_email`) and, for admins/managers, **Delete permanently** (calls `hard_delete_inbound_email` with a confirm dialog).
- Confirm dialog copy updated to make the soft/hard distinction obvious ("Move to Trash" vs "Delete permanently — cannot be undone").
- Toasts updated accordingly.

### Safety guarantees
- No code path in the app or edge functions performs an automatic `DELETE` on `inbound_emails`.
- Any future hard-delete (even from SQL) is captured by the BEFORE DELETE trigger into the audit table, so if rows disappear again we can prove it.
- Soft-deleted emails are fully recoverable from Trash until an admin explicitly purges them.

## Out of scope
- Auto-purging old trashed emails (no scheduled cleanup is added; deletions remain strictly manual).
- Changing how extraction state or status transitions work.
- Touching `pasted_emails` or `sent_emails`.