import { jsxs, jsx } from "react/jsx-runtime";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, ZAxis, Scatter } from "recharts";
const COLORS = {
  gold: "#C4973A",
  goldLight: "#D4B86A",
  teal: "#4A7C6F",
  charcoal: "#2D3B2E",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  gray: "#E5E7EB"
};
function scoreColor(score) {
  if (score >= 70) return COLORS.green;
  if (score >= 40) return COLORS.amber;
  return COLORS.red;
}
function RadarScoreChart({ sections }) {
  const data = sections.map((s) => ({
    subject: s.section_title.length > 20 ? s.section_title.slice(0, 18) + "…" : s.section_title,
    score: s.score ?? 0,
    fullMark: 100
  }));
  if (data.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 rounded-xl p-4 mb-6 print:break-inside-avoid", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center", children: "Assessment Dimensions — At a Glance" }),
    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 340, children: /* @__PURE__ */ jsxs(RadarChart, { data, cx: "50%", cy: "50%", outerRadius: "70%", children: [
      /* @__PURE__ */ jsx(PolarGrid, { stroke: COLORS.gray }),
      /* @__PURE__ */ jsx(
        PolarAngleAxis,
        {
          dataKey: "subject",
          tick: { fontSize: 9, fill: COLORS.charcoal }
        }
      ),
      /* @__PURE__ */ jsx(PolarRadiusAxis, { angle: 90, domain: [0, 100], tick: { fontSize: 8 } }),
      /* @__PURE__ */ jsx(
        Radar,
        {
          name: "Score",
          dataKey: "score",
          stroke: COLORS.gold,
          fill: COLORS.gold,
          fillOpacity: 0.25,
          strokeWidth: 2
        }
      )
    ] }) })
  ] });
}
function SectionScoreBar({ score }) {
  const color = scoreColor(score);
  return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mt-2", children: /* @__PURE__ */ jsx("div", { className: "flex-1 h-3 rounded-full overflow-hidden", style: { backgroundColor: COLORS.gray }, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "h-full rounded-full transition-all",
      style: { width: `${Math.min(score, 100)}%`, backgroundColor: color }
    }
  ) }) });
}
function ReadinessGaugeChart({ score, category }) {
  const color = scoreColor(score);
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score }
  ];
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center print:break-inside-avoid", children: /* @__PURE__ */ jsxs("div", { className: "relative", style: { width: 220, height: 130 }, children: [
    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsx(PieChart, { children: /* @__PURE__ */ jsxs(
      Pie,
      {
        data,
        cx: "50%",
        cy: "100%",
        startAngle: 180,
        endAngle: 0,
        innerRadius: 70,
        outerRadius: 95,
        dataKey: "value",
        stroke: "none",
        children: [
          /* @__PURE__ */ jsx(Cell, { fill: color }),
          /* @__PURE__ */ jsx(Cell, { fill: COLORS.gray })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-end pb-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold", style: { color }, children: score }),
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-semibold tracking-wider text-muted-foreground", children: (category || "").replace(/_/g, " ") })
    ] })
  ] }) });
}
const severityToX = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};
const categoryToY = {
  operational: 1,
  staffing: 2,
  compliance: 3,
  strategic: 4,
  infrastructure: 5
};
const categoryLabels = ["", "Operational", "Staffing", "Compliance", "Strategic", "Infrastructure"];
const severityLabels = ["", "Low", "Medium", "High", "Critical"];
function ConcernsPriorityMatrix({ concerns }) {
  if (!concerns?.length) return null;
  const data = concerns.map((c, i) => ({
    x: severityToX[c.severity] || 2,
    y: categoryToY[c.type] || 1,
    z: 120,
    label: c.description.length > 30 ? c.description.slice(0, 28) + "…" : c.description,
    severity: c.severity,
    index: i
  }));
  return /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 rounded-xl p-4 mb-4 print:break-inside-avoid", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center", children: "Concern Priority Matrix" }),
    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxs(ScatterChart, { margin: { top: 10, right: 20, bottom: 30, left: 80 }, children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: COLORS.gray }),
      /* @__PURE__ */ jsx(
        XAxis,
        {
          type: "number",
          dataKey: "x",
          domain: [0.5, 4.5],
          ticks: [1, 2, 3, 4],
          tickFormatter: (v) => severityLabels[v] || "",
          tick: { fontSize: 10 },
          label: { value: "Severity →", position: "bottom", offset: 10, fontSize: 10 }
        }
      ),
      /* @__PURE__ */ jsx(
        YAxis,
        {
          type: "number",
          dataKey: "y",
          domain: [0.5, 5.5],
          ticks: [1, 2, 3, 4, 5],
          tickFormatter: (v) => categoryLabels[v] || "",
          tick: { fontSize: 10 },
          width: 75
        }
      ),
      /* @__PURE__ */ jsx(ZAxis, { type: "number", dataKey: "z", range: [80, 200] }),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          content: ({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/40 rounded-lg px-3 py-2 shadow-lg text-xs max-w-[200px]", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: concerns[d.index]?.description }),
              /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mt-1", children: [
                concerns[d.index]?.type,
                " · ",
                concerns[d.index]?.severity
              ] })
            ] });
          }
        }
      ),
      /* @__PURE__ */ jsx(Scatter, { data, children: data.map((entry, i) => /* @__PURE__ */ jsx(
        Cell,
        {
          fill: entry.severity === "critical" || entry.severity === "high" ? COLORS.red : entry.severity === "medium" ? COLORS.amber : COLORS.teal,
          fillOpacity: 0.8
        },
        i
      )) })
    ] }) })
  ] });
}
function FocusAreasTimeline({ focusAreas, showLabels = true }) {
  if (!focusAreas?.length) return null;
  const immediate = focusAreas.filter(
    (f) => f.priority === "immediate" || f.priority === "Immediate"
  );
  const shortTerm = focusAreas.filter(
    (f) => f.priority !== "immediate" && f.priority !== "Immediate"
  );
  const data = [
    ...immediate.map((f) => ({
      area: f.area.length > 35 ? f.area.slice(0, 33) + "…" : f.area,
      immediate: 1,
      short_term: 0
    })),
    ...shortTerm.map((f) => ({
      area: f.area.length > 35 ? f.area.slice(0, 33) + "…" : f.area,
      immediate: 0,
      short_term: 1
    }))
  ];
  if (data.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 rounded-xl p-4 mb-4 print:break-inside-avoid", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center", children: showLabels ? "Priority Timeline" : "Focus Areas by Priority" }),
    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: Math.max(data.length * 40 + 50, 160), children: /* @__PURE__ */ jsxs(BarChart, { data, layout: "vertical", margin: { top: 5, right: 20, bottom: 5, left: 10 }, children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: COLORS.gray, horizontal: false }),
      /* @__PURE__ */ jsx(XAxis, { type: "number", hide: true }),
      /* @__PURE__ */ jsx(
        YAxis,
        {
          type: "category",
          dataKey: "area",
          width: 200,
          tick: { fontSize: 10 }
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          content: ({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            const priority = d.immediate ? "Immediate" : "Short Term";
            return /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/40 rounded-lg px-3 py-2 shadow-lg text-xs", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: d.area }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: priority })
            ] });
          }
        }
      ),
      /* @__PURE__ */ jsx(Bar, { dataKey: "immediate", stackId: "a", fill: COLORS.red, radius: [0, 4, 4, 0], name: "Immediate" }),
      /* @__PURE__ */ jsx(Bar, { dataKey: "short_term", stackId: "a", fill: COLORS.amber, radius: [0, 4, 4, 0], name: "Short Term" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 mt-2 text-[10px]", children: [
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-2 rounded-sm inline-block", style: { backgroundColor: COLORS.red } }),
        "Immediate"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-2 rounded-sm inline-block", style: { backgroundColor: COLORS.amber } }),
        "Short Term"
      ] })
    ] })
  ] });
}
function FinancialWaterfallChart({ data }) {
  if (!data) return null;
  const hasAny = Object.values(data).some((v) => v != null && v > 0);
  if (!hasAny) return null;
  const chartData = [
    ...data.totalStartup ? [{ name: "Total Startup", value: data.totalStartup / 1e6, color: COLORS.charcoal }] : [],
    ...data.buildOut ? [{ name: "Build-Out", value: data.buildOut / 1e6, color: COLORS.gold }] : [],
    ...data.remainingBudget ? [{ name: "Remaining Budget", value: data.remainingBudget / 1e6, color: COLORS.teal }] : [],
    ...data.revenueConcern ? [{ name: "Revenue Concern", value: data.revenueConcern / 1e6, color: COLORS.red }] : [],
    ...data.revenueTargetLow ? [{ name: "3yr Target (Low)", value: data.revenueTargetLow / 1e6, color: COLORS.amber }] : [],
    ...data.revenueTargetHigh ? [{ name: "3yr Target (High)", value: data.revenueTargetHigh / 1e6, color: COLORS.goldLight }] : []
  ];
  if (chartData.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 rounded-xl p-4 print:break-inside-avoid", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center", children: "Financial Overview ($M)" }),
    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxs(BarChart, { data: chartData, margin: { top: 15, right: 10, bottom: 5, left: 10 }, children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: COLORS.gray, vertical: false }),
      /* @__PURE__ */ jsx(XAxis, { dataKey: "name", tick: { fontSize: 9 }, interval: 0, angle: -15, textAnchor: "end", height: 50 }),
      /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 10 }, tickFormatter: (v) => `$${v}M` }),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          formatter: (value) => [`$${value.toFixed(1)}M`, "Amount"],
          contentStyle: { fontSize: 12, borderRadius: 8 }
        }
      ),
      /* @__PURE__ */ jsxs(Bar, { dataKey: "value", radius: [4, 4, 0, 0], children: [
        chartData.map((entry, i) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, i)),
        /* @__PURE__ */ jsx(LabelList, { dataKey: "value", position: "top", formatter: (v) => `$${v}M`, style: { fontSize: 10, fontWeight: 600 } })
      ] })
    ] }) })
  ] });
}
const categoryColors = {
  operational: COLORS.amber,
  strategic: COLORS.red,
  staffing: COLORS.teal,
  compliance: COLORS.gold,
  infrastructure: COLORS.charcoal
};
function FindingsCategoryDonut({ findings }) {
  if (!findings?.length) return null;
  const counts = {};
  for (const f of findings) {
    const t = (f.type || "other").toLowerCase();
    counts[t] = (counts[t] || 0) + 1;
  }
  const data = Object.entries(counts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: categoryColors[name] || COLORS.gray
  }));
  return /* @__PURE__ */ jsxs("div", { className: "bg-secondary/10 rounded-xl p-4 mb-4 print:break-inside-avoid", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center", children: "Findings by Category" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsx(ResponsiveContainer, { width: 180, height: 180, children: /* @__PURE__ */ jsxs(PieChart, { children: [
        /* @__PURE__ */ jsx(
          Pie,
          {
            data,
            cx: "50%",
            cy: "50%",
            innerRadius: 45,
            outerRadius: 75,
            dataKey: "value",
            stroke: "none",
            children: data.map((entry, i) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, i))
          }
        ),
        /* @__PURE__ */ jsx(
          Tooltip,
          {
            formatter: (value, name) => [value, name],
            contentStyle: { fontSize: 12, borderRadius: 8 }
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5", children: data.map((d) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-sm inline-block", style: { backgroundColor: d.color } }),
        /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium", children: d.name }),
        /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
          "(",
          d.value,
          ")"
        ] })
      ] }, d.name)) })
    ] })
  ] });
}
function extractFinancialData(analysis) {
  const allText = JSON.stringify(analysis).toLowerCase();
  const extractAmount = (patterns) => {
    for (const p of patterns) {
      const match = allText.match(p);
      if (match) {
        const num = parseFloat(match[1].replace(/,/g, ""));
        if (match[0].includes("mm") || match[0].includes("million")) return num * 1e6;
        if (num > 1e5) return num;
        if (num >= 1 && num <= 100) return num * 1e6;
      }
    }
    return void 0;
  };
  const totalStartup = extractAmount([
    /total\s*(?:startup|start-up)\s*(?:cost|budget)[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
    /\$\s*([\d,.]+)\s*(?:mm|m|million)?\s*(?:total)?\s*(?:startup|start-up)/i,
    /startup[^$]*?\$([\d,.]+)\s*(?:mm|m|million)/i
  ]);
  const buildOut = extractAmount([
    /build[\s-]*out[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
    /\$\s*([\d,.]+)\s*(?:mm|m|million)?\s*(?:build[\s-]*out)/i
  ]);
  const remainingBudget = extractAmount([
    /remaining[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i
  ]);
  const revenueConcern = extractAmount([
    /revenue\s*concern[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
    /concern[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i
  ]);
  const revenueTargetLow = extractAmount([
    /revenue\s*target[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
    /\$\s*([\d,.]+)\s*[-–]\s*\$?\s*[\d,.]+\s*(?:mm|m|million)/i
  ]);
  const revenueTargetHigh = extractAmount([
    /\$\s*[\d,.]+\s*[-–]\s*\$?\s*([\d,.]+)\s*(?:mm|m|million)/i
  ]);
  const data = { totalStartup, buildOut, remainingBudget, revenueConcern, revenueTargetLow, revenueTargetHigh };
  const hasAny = Object.values(data).some((v) => v != null);
  return hasAny ? data : null;
}
export {
  ConcernsPriorityMatrix as C,
  FindingsCategoryDonut as F,
  ReadinessGaugeChart as R,
  SectionScoreBar as S,
  FinancialWaterfallChart as a,
  FocusAreasTimeline as b,
  RadarScoreChart as c,
  extractFinancialData as e
};
