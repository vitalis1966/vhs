import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ZAxis,
  LabelList,
} from "recharts";

// ─── Brand Colors ──────────────────────────────────────────────────────────────

const COLORS = {
  gold: "#C4973A",
  goldLight: "#D4B86A",
  teal: "#4A7C6F",
  tealLight: "#6B9E8F",
  cream: "#F5F0E8",
  charcoal: "#2D3B2E",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  gray: "#E5E7EB",
};

function scoreColor(score: number) {
  if (score >= 70) return COLORS.green;
  if (score >= 40) return COLORS.amber;
  return COLORS.red;
}

// ─── 1. Radar Score Chart ──────────────────────────────────────────────────────

interface RadarScoreChartProps {
  sections: { section_title: string; score: number }[];
}

export function RadarScoreChart({ sections }: RadarScoreChartProps) {
  const data = sections.map((s) => ({
    subject: s.section_title.length > 20 ? s.section_title.slice(0, 18) + "…" : s.section_title,
    score: s.score ?? 0,
    fullMark: 100,
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-secondary/10 rounded-xl p-4 mb-6 print:break-inside-avoid">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
        Assessment Dimensions — At a Glance
      </p>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke={COLORS.gray} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 9, fill: COLORS.charcoal }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
          <Radar
            name="Score"
            dataKey="score"
            stroke={COLORS.gold}
            fill={COLORS.gold}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── 2. Section Score Bar ──────────────────────────────────────────────────────

interface SectionScoreBarProps {
  score: number;
}

export function SectionScoreBar({ score }: SectionScoreBarProps) {
  const color = scoreColor(score);
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.gray }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── 3. Readiness Gauge Chart ──────────────────────────────────────────────────

interface ReadinessGaugeChartProps {
  score: number;
  category: string;
}

export function ReadinessGaugeChart({ score, category }: ReadinessGaugeChartProps) {
  const color = scoreColor(score);
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  return (
    <div className="flex flex-col items-center print:break-inside-avoid">
      <div className="relative" style={{ width: 220, height: 130 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={95}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill={COLORS.gray} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
            {(category || "").replace(/_/g, " ")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── 4. Concerns Priority Matrix ───────────────────────────────────────────────

const severityToX: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const categoryToY: Record<string, number> = {
  operational: 1,
  staffing: 2,
  compliance: 3,
  strategic: 4,
  infrastructure: 5,
};

const categoryLabels = ["", "Operational", "Staffing", "Compliance", "Strategic", "Infrastructure"];
const severityLabels = ["", "Low", "Medium", "High", "Critical"];

interface ConcernsPriorityMatrixProps {
  concerns: { type: string; severity: string; description: string }[];
}

export function ConcernsPriorityMatrix({ concerns }: ConcernsPriorityMatrixProps) {
  if (!concerns?.length) return null;

  const data = concerns.map((c, i) => ({
    x: severityToX[c.severity] || 2,
    y: categoryToY[c.type] || 1,
    z: 120,
    label: c.description.length > 30 ? c.description.slice(0, 28) + "…" : c.description,
    severity: c.severity,
    index: i,
  }));

  return (
    <div className="bg-secondary/10 rounded-xl p-4 mb-4 print:break-inside-avoid">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
        Concern Priority Matrix
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0.5, 4.5]}
            ticks={[1, 2, 3, 4]}
            tickFormatter={(v) => severityLabels[v] || ""}
            tick={{ fontSize: 10 }}
            label={{ value: "Severity →", position: "bottom", offset: 10, fontSize: 10 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0.5, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v) => categoryLabels[v] || ""}
            tick={{ fontSize: 10 }}
            width={75}
          />
          <ZAxis type="number" dataKey="z" range={[80, 200]} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-card border border-border/40 rounded-lg px-3 py-2 shadow-lg text-xs max-w-[200px]">
                  <p className="font-semibold">{concerns[d.index]?.description}</p>
                  <p className="text-muted-foreground mt-1">
                    {concerns[d.index]?.type} · {concerns[d.index]?.severity}
                  </p>
                </div>
              );
            }}
          />
          <Scatter data={data}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.severity === "critical" || entry.severity === "high"
                    ? COLORS.red
                    : entry.severity === "medium"
                    ? COLORS.amber
                    : COLORS.teal
                }
                fillOpacity={0.8}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── 5. Focus Areas Timeline ───────────────────────────────────────────────────

interface FocusAreasTimelineProps {
  focusAreas: { area: string; priority: string; rationale?: string }[];
  showLabels?: boolean; // false for client report
}

export function FocusAreasTimeline({ focusAreas, showLabels = true }: FocusAreasTimelineProps) {
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
      short_term: 0,
    })),
    ...shortTerm.map((f) => ({
      area: f.area.length > 35 ? f.area.slice(0, 33) + "…" : f.area,
      immediate: 0,
      short_term: 1,
    })),
  ];

  if (data.length === 0) return null;

  return (
    <div className="bg-secondary/10 rounded-xl p-4 mb-4 print:break-inside-avoid">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
        {showLabels ? "Priority Timeline" : "Focus Areas by Priority"}
      </p>
      <ResponsiveContainer width="100%" height={Math.max(data.length * 40 + 50, 160)}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="area"
            width={200}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              const priority = d.immediate ? "Immediate" : "Short Term";
              return (
                <div className="bg-card border border-border/40 rounded-lg px-3 py-2 shadow-lg text-xs">
                  <p className="font-semibold">{d.area}</p>
                  <p className="text-muted-foreground">{priority}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="immediate" stackId="a" fill={COLORS.red} radius={[0, 4, 4, 0]} name="Immediate" />
          <Bar dataKey="short_term" stackId="a" fill={COLORS.amber} radius={[0, 4, 4, 0]} name="Short Term" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
        <span className="flex items-center gap-1">
          <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: COLORS.red }} />
          Immediate
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: COLORS.amber }} />
          Short Term
        </span>
      </div>
    </div>
  );
}

// ─── 6. Financial Waterfall Chart ──────────────────────────────────────────────

interface FinancialWaterfallChartProps {
  data?: {
    totalStartup?: number;
    buildOut?: number;
    remainingBudget?: number;
    revenueConcern?: number;
    revenueTargetLow?: number;
    revenueTargetHigh?: number;
  };
}

export function FinancialWaterfallChart({ data }: FinancialWaterfallChartProps) {
  if (!data) return null;
  const hasAny = Object.values(data).some((v) => v != null && v > 0);
  if (!hasAny) return null;

  const chartData = [
    ...(data.totalStartup ? [{ name: "Total Startup", value: data.totalStartup / 1_000_000, color: COLORS.charcoal }] : []),
    ...(data.buildOut ? [{ name: "Build-Out", value: data.buildOut / 1_000_000, color: COLORS.gold }] : []),
    ...(data.remainingBudget ? [{ name: "Remaining Budget", value: data.remainingBudget / 1_000_000, color: COLORS.teal }] : []),
    ...(data.revenueConcern ? [{ name: "Revenue Concern", value: data.revenueConcern / 1_000_000, color: COLORS.red }] : []),
    ...(data.revenueTargetLow ? [{ name: "3yr Target (Low)", value: data.revenueTargetLow / 1_000_000, color: COLORS.amber }] : []),
    ...(data.revenueTargetHigh ? [{ name: "3yr Target (High)", value: data.revenueTargetHigh / 1_000_000, color: COLORS.goldLight }] : []),
  ];

  if (chartData.length === 0) return null;

  return (
    <div className="bg-secondary/10 rounded-xl p-4 print:break-inside-avoid">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
        Financial Overview ($M)
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 15, right: 10, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray} vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-15} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}M`} />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(1)}M`, "Amount"]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
            <LabelList dataKey="value" position="top" formatter={(v: number) => `$${v}M`} style={{ fontSize: 10, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── 7. Findings Category Donut ────────────────────────────────────────────────

interface FindingsCategoryDonutProps {
  findings: { type: string }[];
}

const categoryColors: Record<string, string> = {
  operational: COLORS.amber,
  strategic: COLORS.red,
  staffing: COLORS.teal,
  compliance: COLORS.gold,
  infrastructure: COLORS.charcoal,
};

export function FindingsCategoryDonut({ findings }: FindingsCategoryDonutProps) {
  if (!findings?.length) return null;

  const counts: Record<string, number> = {};
  for (const f of findings) {
    const t = (f.type || "other").toLowerCase();
    counts[t] = (counts[t] || 0) + 1;
  }

  const data = Object.entries(counts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: categoryColors[name] || COLORS.gray,
  }));

  return (
    <div className="bg-secondary/10 rounded-xl p-4 mb-4 print:break-inside-avoid">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
        Findings by Category
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-1.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: d.color }} />
              <span className="text-foreground font-medium">{d.name}</span>
              <span className="text-muted-foreground">({d.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Helper: Extract financial data from analysis ──────────────────────────────

export function extractFinancialData(analysis: any): FinancialWaterfallChartProps["data"] | null {
  // Try to find financial figures from section analyses or raw text
  const allText = JSON.stringify(analysis).toLowerCase();

  const extractAmount = (patterns: RegExp[]): number | undefined => {
    for (const p of patterns) {
      const match = allText.match(p);
      if (match) {
        const num = parseFloat(match[1].replace(/,/g, ""));
        // Detect if in millions
        if (match[0].includes("mm") || match[0].includes("million")) return num * 1_000_000;
        if (num > 100_000) return num;
        if (num >= 1 && num <= 100) return num * 1_000_000; // likely in M
      }
    }
    return undefined;
  };

  const totalStartup = extractAmount([
    /total\s*(?:startup|start-up)\s*(?:cost|budget)[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
    /\$\s*([\d,.]+)\s*(?:mm|m|million)?\s*(?:total)?\s*(?:startup|start-up)/i,
    /startup[^$]*?\$([\d,.]+)\s*(?:mm|m|million)/i,
  ]);

  const buildOut = extractAmount([
    /build[\s-]*out[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
    /\$\s*([\d,.]+)\s*(?:mm|m|million)?\s*(?:build[\s-]*out)/i,
  ]);

  const remainingBudget = extractAmount([
    /remaining[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
  ]);

  const revenueConcern = extractAmount([
    /revenue\s*concern[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
    /concern[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
  ]);

  const revenueTargetLow = extractAmount([
    /revenue\s*target[^$]*?\$\s*([\d,.]+)\s*(?:mm|m|million)?/i,
    /\$\s*([\d,.]+)\s*[-–]\s*\$?\s*[\d,.]+\s*(?:mm|m|million)/i,
  ]);

  const revenueTargetHigh = extractAmount([
    /\$\s*[\d,.]+\s*[-–]\s*\$?\s*([\d,.]+)\s*(?:mm|m|million)/i,
  ]);

  const data = { totalStartup, buildOut, remainingBudget, revenueConcern, revenueTargetLow, revenueTargetHigh };
  const hasAny = Object.values(data).some((v) => v != null);
  return hasAny ? data : null;
}
