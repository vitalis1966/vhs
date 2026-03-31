

## Plan: Rewrite Assessment Intake Notification to Use Resend Directly

### Analysis

- **send-assessment-completion-emails** — Already calls Resend directly via `VHS_Website` secret, `from: 'Vitalis Health Strategies <info@mail.vitalisstrategies.com>'`. No changes needed.
- **send-contact-email** — Already calls Resend directly. No changes needed.
- **send-assessment-intake-notification** — Uses the broken Lovable `enqueue_email` RPC queue. This is the only function that needs rewriting.

### Change: Rewrite `send-assessment-intake-notification/index.ts`

Replace the entire function with a direct Resend call, matching the `send-contact-email` pattern:

- Use `Deno.env.get('VHS_Website')` for the Resend API key
- POST to `https://api.resend.com/emails` with `Authorization: Bearer ${apiKey}`
- `from: 'Vitalis Health Strategies <info@mail.vitalisstrategies.com>'`
- `to: ['info@vitalisstrategies.com']`
- `reply_to: 'info@vitalisstrategies.com'`
- Keep the React Email template rendering (it produces the branded HTML)
- Remove all queue-related code: `enqueue_email` RPC, suppression checks, unsubscribe token logic, `email_send_log` inserts
- Keep CORS headers and input validation

### Confirmed `from` addresses after changes

| Function | From |
|---|---|
| send-assessment-intake-notification | `Vitalis Health Strategies <info@mail.vitalisstrategies.com>` |
| send-assessment-completion-emails | `Vitalis Health Strategies <info@mail.vitalisstrategies.com>` (already correct) |
| send-contact-email | `Vitalis Health Strategies <info@mail.vitalisstrategies.com>` (no change) |

### Deployment

Redeploy `send-assessment-intake-notification` after the rewrite.

