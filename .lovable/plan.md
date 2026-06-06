## Remove duplicate group header row in Time Tracking Entries

**File:** `src/pages/app/TimeTracking.tsx` (lines 334–339)

In the grouped entries render loop, each group currently emits an intermediate label row showing the client name (or week/day label) and its subtotal before the actual entry rows. This sits between the column header bar and the entries, causing the duplicate "TEST 0m / 0.00h" row visible in the screenshot.

**Change:** Delete the inner `<div className="flex items-center justify-between mb-2">…</div>` block that renders `heading` and `td.human / td.decimalLabel` (lines 336–339). Also drop the now-unused `groupTotal`, `td`, and `heading` locals (lines 329–333). The outer `.map` wrapper, `space-y-1` entries container, grouping logic (`grouped`), and everything else stay intact.

Result: the column header row renders once, followed directly by entry rows with no intermediate group label rows.

**Untouched:** column headers, entry row markup, edit/delete actions, Total row, CSV export, date navigation, Week/Month grouping logic itself (still used to flatten ordered entries; only the visible label row is removed).