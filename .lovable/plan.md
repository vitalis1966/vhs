## Problem

Inviting a user from Company Settings → Users & Permissions never sends an email. The invite row is created in `workspace_members`, but the `sendInviteEmail` helper calls the wrong edge function with the wrong payload:

```ts
supabase.functions.invoke("send-notification", {
  body: { to, subject, title, body, link_url }
})
```

But `send-notification` requires `user_id`, `workspace_id`, and `type` and looks up the recipient's email from the `profiles` table. For an invited person there is no user_id and no profile yet, so the call returns 400 and no email is sent. The catch block swallows the error silently, so the UI still shows "Invitation sent".

## Fix

Replace `sendInviteEmail` in `src/components/app/settings/UsersSection.tsx` to call the existing `send-email` edge function, which sends arbitrary HTML email via Resend to a raw address (no profile lookup required).

New behavior:
- Build a branded HTML body (matching the Vitalis notification email style — cream background, sage header border, gold accent bar, forest-green CTA) with the inviter's message, role, and a "Sign in to Vitalis OS" CTA pointing at `/employee-login`.
- Call `supabase.functions.invoke("send-email", { body: { workspace_id, subject, body_html, body_text, to: [email] } })`.
- Surface failures: if the invoke returns an error, show a destructive toast ("Invite created but email failed to send") instead of silently swallowing, so this class of bug is visible next time.
- Apply the same fix to the "Resend invite" action (line ~118 in the same file) which uses the same broken helper.

No schema changes, no new functions, no changes to `send-notification` (it stays as the in-app + email dispatcher for users who already have profiles).

### Files touched
- `src/components/app/settings/UsersSection.tsx` — rewrite `sendInviteEmail`, update its two call sites to await + handle errors.

### Verification
- Invite a new email from Users & Permissions → confirm the recipient receives the branded invite email from `info@vitalisstrategies.com`.
- Check `email_send_log` (or Resend logs) shows the send.
- Trigger "Resend invite" on a pending row → email arrives.
- Invalid/blocked send → destructive toast appears instead of false success.