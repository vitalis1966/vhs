# Align Paste Email & Forwarded Inbox extraction

## Investigation — differences found

Both paths run server-side in edge functions and call the Lovable AI Gateway, but every meaningful parameter differs.

**Paste Email path** (preferred — better output)
- UI: `src/components/app/email/PasteEmailDialog.tsx:140` → `supabase.functions.invoke("parse-pasted-email", { raw_email, workspace_id, client_id })`
- Edge: `supabase/functions/parse-pasted-email/index.ts`
  - Model: `google/gemini-3-flash-preview` (line 133)
  - Input: full `raw_email` (headers + body, untouched), up to 200,000 chars; user message is `"Parse this email:\n\n${raw_email}"` (line 136)
  - System prompt: rich Vitalis-OS framing (lines 41–57) — categories, priorities, ISO dates, conservative rules, and per-action fields `title / priority / due_date / requester / what / why / acceptance_criteria / key_details / relevant_quote / suggested_next_step`
  - Tool schema: `extract_email` returning headers + `action_items[]` + meeting + people + financials + signature (lines 59–127)
  - Post-processing: `buildContext()` synthesises a rich Markdown `context` per action (lines 157–180) used as the task description
  - No body truncation; no HTML stripping (raw paste already plain text in practice)

**Forwarded Inbox path** (currently weaker)
- UI: `src/pages/app/Inbox.tsx:196` → `supabase.functions.invoke("extract-email-tasks", { email_id, reuse })`
- Edge: `supabase/functions/extract-email-tasks/index.ts`
  - Model: `google/gemini-2.5-pro` (line 109) — different family
  - Input: only `subject + (body_text || body_html)` truncated to **16,000 chars** (lines 84–86). When the email arrives HTML-only, raw HTML markup is sent verbatim — no tag stripping, no quoted-reply trimming. Headers (From/To/Date/Cc) are not included.
  - System prompt: different wording, hard cap of 5 tasks, different field names (`deadline_text` vs `due_date`), no category/meeting/financial extraction (lines 8–25)
  - Tool schema: `return_tasks` with only the tasks array (lines 113–143)
  - Post-processing: similar `buildDescription()` (lines 173–190) but driven by the leaner schema

**Net effect:** the inbox path uses a different prompt, a different model, includes no headers, may send raw HTML, and truncates at 16k. The paste path sends the full raw email with headers through a richer prompt. This matches the user-reported quality gap.

## Source of truth

The Paste Email prompt, tool schema, model, and `buildContext()` post-processing become the single source of truth. The forwarded-inbox path is realigned to call the exact same logic.

## Plan

### 1. Create shared extraction utility (new file)
`supabase/functions/_shared/extract-email-tasks.ts`

Exports (Deno-compatible, no new deps):
- `EXTRACTION_SYSTEM_PROMPT` — copied verbatim from `parse-pasted-email/index.ts` lines 41–57
- `EXTRACTION_TOOL` — copied verbatim from lines 59–127 (`extract_email` tool schema, full set: headers, summary, category, action_items, meeting, mentioned_people, financials, signature)
- `EXTRACTION_MODEL = "google/gemini-3-flash-preview"`
- `buildActionContext(action)` — copied verbatim from `buildContext()` lines 157–174
- `stripHtmlToText(html)` — minimal HTML→text (strip `<script>/<style>`, `<br>`→`\n`, `</p>`→`\n\n`, strip remaining tags, decode `&amp;/&lt;/&gt;/&nbsp;/&quot;/&#39;`, collapse whitespace). Used only when no `body_text` is available.
- `composeEmailForExtraction({ subject, from_name, from_email, to, cc, sent_at, body_text, body_html })` — returns a single string mirroring the raw-paste shape so the same prompt works:

  ```text
  From: <name> <email>
  To: a@x, b@y
  Cc: ...
  Date: <sent_at>
  Subject: <subject>

  <body_text ?? stripHtmlToText(body_html)>
  ```
  Returned string is capped to 200,000 chars to match the paste path.
- `extractEmailViaGateway(apiKey, composedEmail)` — performs the gateway POST with `EXTRACTION_MODEL`, `EXTRACTION_SYSTEM_PROMPT`, tool=`EXTRACTION_TOOL`, `tool_choice` forcing the tool, parses the tool call (`tryParseJSON` mirrors paste path), and returns the parsed object. Surfaces 429/402 via thrown typed errors so callers can map to HTTP status.

No behaviour change for the paste path other than now importing these shared symbols.

### 2. Refactor `parse-pasted-email/index.ts`
- Replace inline `systemPrompt`, `tool`, model literal, and `buildContext` with imports from the shared module.
- Keep all current behaviour: contact/client matching, `action_items` post-processing now uses shared `buildActionContext`. No UI changes. Response shape unchanged.

### 3. Realign `extract-email-tasks/index.ts`
- Replace the existing prompt + tool + model with the shared `EXTRACTION_SYSTEM_PROMPT`, `EXTRACTION_TOOL`, `EXTRACTION_MODEL`.
- Build the AI input by loading `subject, from_name, from_email, to_addresses, cc_addresses, sent_at, body_text, body_html` (extend the existing `inbound_emails` select) and passing them through `composeEmailForExtraction()` — so headers are included and HTML is stripped to text when `body_text` is null.
- Drop the 16k truncation in favour of the shared 200k cap.
- After the gateway call, take `parsed.action_items[]` (already enriched with `context` by shared `buildActionContext`) and persist into `email_extracted_tasks` with the same row shape used today:
  - `title` ← `action_items[i].title`
  - `description` ← `action_items[i].context`
  - `priority` ← lowercase of `High|Medium|Normal` → `high|medium|low` (Normal→medium), default `medium`
  - `position`, `status: "pending"`, `email_id`
- Keep the existing "reuse already-extracted" short-circuit and the `inbound_emails.extraction_state = "extracted"` update.
- Keep the existing cap behaviour: take up to the first 5 `action_items` to preserve current downstream UI assumptions (`ExtractTasksPanel`).
- Return shape (`{ tasks, reused? }`) unchanged so `Inbox.tsx` and `ExtractTasksPanel` need no edits.

### 4. Verification
- `parse-pasted-email`: re-run paste with a sample email; confirm parsed payload + matched contact unchanged.
- `extract-email-tasks`: invoke from Inbox 3-dots on an HTML-only forwarded email and confirm tasks now carry `what / why / acceptance_criteria / key_details / suggested_next_step / relevant_quote` in the description, identical in richness to the paste flow.
- Confirm no UI files are touched.

## Out of scope
- No changes to `PasteEmailDialog`, `ExtractTasksPanel`, `Inbox.tsx`, or any other UI.
- No schema migrations.
- No new npm/Deno deps.
- No changes to VHS Administration, task side panel, status logic, navigation, or Skip/Save/Close flow.
- `src/lib/extractTasks.ts` is **not** created — the extraction must run server-side (LOVABLE_API_KEY is server-only), so the shared utility lives at `supabase/functions/_shared/extract-email-tasks.ts` instead.

## Technical notes
- Both edge functions already use `https://esm.sh/@supabase/supabase-js@2.45.0` / `npm:@supabase/supabase-js@2`; the shared file uses no external imports beyond what Deno provides, so it works from either entry point.
- Gateway error mapping (`429 → "rate limit"`, `402 → "credits exhausted"`) is centralised in the shared helper and re-mapped to HTTP status by each edge function so existing client toasts continue to work.
