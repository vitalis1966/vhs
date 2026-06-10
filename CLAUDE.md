# Vitalis Health Strategies — Claude Context

## Stack
- Frontend: React + Vite + TypeScript
- Backend: Supabase (PostgreSQL, Auth, RLS, Edge Functions, Storage)
- Hosting: Cloudflare Pages
- Email: Resend (inbound + outbound)
- AI: Anthropic Claude API
- DNS: Cloudflare

## Two Platforms
1. vitalisstrategies.com — public marketing website
2. Vitalis OS — internal CRM (app-new.vitalisstrategies.com → app.vitalisstrategies.com after cutover)

VHS Administration and Vitalis OS users are entirely separate via platform_roles table.

## Critical Rules — Never Violate
- NEVER hard-delete from VHS Administration via any Vitalis OS action
- hidden_in_client = true is the ONLY client-side removal mechanism
- resolveEmailState(summary) is the sole source of truth for email state transitions
- Shared extractTasks utility for all email extraction paths
- All VHS Admin to Vitalis OS data flow is copy-only — never move or delete
- SECURITY DEFINER RPCs for all auto-assignment logic
- Option B preferred: modify existing tables vs adding secondary structures

## Database Patterns
- Use maybeSingle() not single() for queries that may return no rows
- All new public tables need explicit GRANTs in migrations
- RLS enforced on all tables
- Helper functions: can_access_client(), has_role(), is_workspace_admin()

## Key Tables
- client_submission_assignments: links VHS Admin records to Vitalis OS clients
- platform_roles: separates VHS Admin and Vitalis OS user access
- task_follow_ups: one row per task for follow-up reminders
- inbound_emails → email_extracted_tasks → tasks (extraction pipeline)

## Edge Functions
- email-inbound: Resend webhook handler
- extract-email-tasks: inbox email extraction
- parse-pasted-email: paste email extraction
- send-follow-up-reminders: hourly cron for follow-up emails
- Shared extraction logic: supabase/functions/_shared/extract-email-tasks.ts

## File Structure
- supabase/migrations/ — all DB migrations
- supabase/functions/ — edge functions (Deno/TypeScript)
- src/components/app/ — Vitalis OS components
- src/components/admin/ — VHS Admin components
- src/pages/app/ — Vitalis OS pages
- src/pages/admin/ — VHS Admin pages
- src/lib/permissions.ts — role permissions
- src/lib/clientDocuments.ts — signed URL helpers

## SEO
- Cloudflare Worker: vhs-seo-prerender-new (new instance)
- REDIRECTS Map must stay in sync with public/_redirects
- GA4: G-L8BF1MF23S
- GTM: GTM-NJX7FHMW
