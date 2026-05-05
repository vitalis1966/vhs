## Goal
Reduce Total Blocking Time by deferring heavy PDF/canvas libraries until the user triggers export.

## Findings
- `html2canvas` and `jspdf` are imported statically only in `src/pages/admin/ClientReport.tsx` (lines 8–9), used inside the existing PDF export handler (around line 408/419).
- `ReportCharts.tsx` does NOT import `html2canvas`, `jspdf`, or `canvg` — no change needed there.
- No occurrences of `canvg` anywhere in the codebase.
- No `lodash` or `lodash-es` imports anywhere in `src/`, and `lodash`/`@types/lodash` are not in `package.json`. Part 2 is a no-op.

## Part 1 — Lazy-load PDF libs in ClientReport.tsx

1. Remove the static imports at lines 8–9:
   ```ts
   import jsPDF from "jspdf";
   import html2canvas from "html2canvas";
   ```
2. Inside the existing export handler function (the one containing the `html2canvas(wrapper, …)` call at line 408), add at the top of the function body:
   ```ts
   const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
     import("html2canvas"),
     import("jspdf"),
   ]);
   ```
3. Leave all other logic, the wrapper construction, the `new jsPDF(...)` call, and downstream PDF page-stitching code unchanged.

This keeps both libraries out of the initial route chunk so they only load on the export click.

## Part 2 — lodash → lodash-es
No action required. No `lodash` imports or dependency entries exist in the project. Will be reported as a no-op after switching to default mode (no files modified for Part 2).

## Out of scope
- No changes to Recharts imports, Vite config, routing, or any other component.
