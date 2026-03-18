

## Plan: Add Charts & Graphs to Both Reports

This plan adds Recharts-based visualizations to the Internal Report and Client Report, keeping all existing content and adding charts alongside it.

### New Shared Component File

**`src/components/admin/ReportCharts.tsx`** — A shared module containing all chart components used by both reports:

1. **`RadarScoreChart`** — Radar/spider chart for section analysis dimensions (Internal Report only, shows numeric scores)
2. **`SectionScoreBar`** — Horizontal color-coded bar for each section score: green (70+), amber (40-69), red (<40)
3. **`ReadinessGaugeChart`** — Large donut/gauge chart for Overall Readiness Score with brand gold palette and prominent label
4. **`ConcernsPriorityMatrix`** — Scatter/bubble chart on a 2×2 grid (X=severity mapped to numeric, Y=category) for Areas of Concern (Internal only)
5. **`FocusAreasTimeline`** — Horizontal bar/swimlane chart grouping focus areas by priority (Immediate vs Short Term) with color-coded bars
6. **`FinancialWaterfallChart`** — Stacked bar or waterfall chart for financial figures extracted from analysis data (both reports)
7. **`FindingsCategoryDonut`** — Donut chart breaking down key findings by category type (Client Report only)

### Brand Color Constants
```typescript
const CHART_COLORS = {
  gold: "#C4973A",
  goldLight: "#D4B86A",
  teal: "#4A7C6F",
  tealLight: "#6B9E8F",
  cream: "#F5F0E8",
  charcoal: "#2D3B2E",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
};
```

### Internal Report Changes (`InternalReport.tsx`)

1. **Overall Readiness Score (section 2, ~line 317-332)**: Add `<ReadinessGaugeChart>` donut alongside existing progress bar content. The gauge shows score/100 with the readiness category label.

2. **Section Analysis (section 4, ~line 344-379)**: 
   - Add `<RadarScoreChart>` at the top of the section (before the per-section cards) showing all dimensions at a glance.
   - Inside each section card, add a `<SectionScoreBar>` color-coded horizontal bar next to the existing score/severity badges. The existing text indicators remain.

3. **Areas of Concern (section 5, ~line 382-401)**: Add `<ConcernsPriorityMatrix>` scatter chart above the existing concern cards. Maps each concern as a dot by severity (x) and type/category (y).

4. **Priority Focus Areas (section 6, ~line 404-418)**: Add `<FocusAreasTimeline>` horizontal swimlane chart above the existing focus area cards, grouping items into Immediate vs Short Term lanes.

5. **Financial data**: Parse financial figures from section analyses or raw responses (startup cost, build-out, etc.) and render `<FinancialWaterfallChart>` within the relevant section if data exists.

### Client Report Changes (`ClientReport.tsx`)

1. **Key Findings (~line 577-589)**: Add `<FindingsCategoryDonut>` chart above the existing findings list, showing count by category (operational, strategic, staffing, compliance, infrastructure). No raw scores shown — visual indicators only.

2. **Priority Focus Areas (~line 591-605)**: Add `<FocusAreasTimeline>` (same component, client-friendly styling — no numeric labels, softer colors).

3. **Financial data**: Add `<FinancialWaterfallChart>` in a new card or within the Detailed Findings section if financial data is detected in the analysis.

### Design Requirements Met
- All charts use Recharts (already in dependencies via shadcn chart components)
- Brand colors: cream background, charcoal text, gold/amber accents, muted teal for positives
- Responsive: `ResponsiveContainer` with percentage widths
- Print-friendly: charts render at fixed aspect ratios with `print:break-inside-avoid`
- Internal Report shows full numeric scores; Client Report uses visual indicators without raw numbers
- All existing content preserved — charts are added above or alongside

### Data Extraction Strategy
Charts consume the same `analysis` object already parsed in each report. Section scores come from `analysis.section_analyses[].score` and `.severity`. Concerns come from `analysis.concerns[].type` and `.severity`. Focus area priorities come from `analysis.focus_areas[].priority`. Financial figures are extracted via regex/keyword matching from section summaries or a dedicated financial section in the analysis data.

### Estimated Scope
- 1 new file (~350 lines): `src/components/admin/ReportCharts.tsx`
- 2 edited files: `InternalReport.tsx` (~40 lines added), `ClientReport.tsx` (~25 lines added)

