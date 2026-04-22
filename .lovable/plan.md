

## UI Refinements: Client Portal & Admin Tables

Three presentation-layer refinements. No changes to routing, auth, edge functions, or database.

---

### 1. Client Portal — Business name as subtitle (`src/pages/portal/ClientDocuments.tsx`)

- Change the heading title back to a static `"Documentation Submissions"`.
- Render `businessName` directly **below** the `<h1>` as a muted subtitle (the existing "Signed in as ..." line stays where it is).

```text
─ CLIENT PORTAL
Documentation Submissions
Acme Dental Group              ← new subtitle (text-lg text-muted-foreground)
Signed in as user@acme.com
```

---

### 2. Document Name → clickable signed-URL link

Applied in **both**:
- `src/pages/portal/ClientDocuments.tsx`
- `src/pages/admin/ClientDocumentsAdmin.tsx`

Behaviour:
- Replace the plain text `file_name` cell with a `<button>` styled as a link (primary color, `hover:underline`), preserving column alignment (no block element, no padding changes).
- On click: call `supabase.storage.from("client-documents").createSignedUrl(row.storage_path, 60)` to generate a 60-second signed URL, then `window.open(url, "_blank", "noopener")`.
- On error: existing `toast` pattern with `variant: "destructive"`.
- The accessor still returns `r.file_name` so sorting/filtering continue to work on the underlying string.
- **Admin side note**: admins already have a `storage.objects` policy `"Admins manage all client-documents"` granting access to all paths, so the same client-side `createSignedUrl` call works for any client's file — no edge function required.

---

### 3. Filter UX — toggle pattern in `SortableFilterableTable`

Single change to `src/components/admin/SortableFilterableTable.tsx`. Because every admin table and the client portal reuse this component, the change propagates everywhere automatically (Administrators, Logging, Client Access Management, Documentation Submissions admin + portal).

Changes:
- Add `Filter` icon (lucide-react) next to the existing sort icon in each column header's button row.
- Header layout becomes a single horizontal flex row:
  ```text
  [ Header label  ↕ ]  [🔍 filter icon]
  ```
- Add local state `openFilterKey: string | null` — only one filter input open at a time (matches the existing single-row mental model and avoids layout jitter).
- Clicking the filter icon for column X:
  - If `openFilterKey === X` → close (set to `null`).
  - Otherwise → open X.
- When open, the `<Input>` renders **below** the header row inside the same `<TableHead>` (preserving column alignment — same `flex flex-col` container, just conditional on `openFilterKey === col.key`).
- Filter icon styling:
  - Default: `opacity-40 hover:opacity-100`.
  - Active (filter value non-empty for that column): `text-primary opacity-100` (so users see at a glance which columns are filtered, even when the input is closed).
- Clearing the input (empty string) does **not** auto-close — user closes via the icon. But the icon reverts to the default (non-highlighted) state.
- Columns with `filterable === false` render no filter icon (the existing spacer `<div className="h-7" />` is removed since headers no longer reserve vertical space for inputs by default).
- Sort behaviour (click on header label) unchanged.

---

### Files touched

| File | Change |
|---|---|
| `src/components/admin/SortableFilterableTable.tsx` | Filter toggle pattern (point 3 + 4) |
| `src/pages/portal/ClientDocuments.tsx` | Business-name subtitle + clickable Document Name |
| `src/pages/admin/ClientDocumentsAdmin.tsx` | Clickable Document Name |

No backend, no migrations, no new dependencies (lucide-react `Filter` icon is already available).

