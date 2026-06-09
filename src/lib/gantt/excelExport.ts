import XLSX from "xlsx-js-style";
import type { GanttItem } from "./types";
import { VITALIS } from "./types";
import { toDate, diffDays, addDays, toISO } from "./dates";
import { isOverdue, varianceDays, computeCriticalPath, computeOverallProgress } from "./critical";

interface ExportCtx {
  items: GanttItem[];
  members: Record<string, { full_name: string | null; email: string | null }>;
  projectName: string;
  clientName: string;
  projectStart?: string | null;
  projectEnd?: string | null;
}

const HDR_BG = VITALIS.green.replace("#", "");
const SECTION_BG = VITALIS.sageLight.replace("#", "");
const MILESTONE_BG = VITALIS.gold.replace("#", "");
const ZEBRA_BG = "F7F4ED"; // very light cream
const WHITE = "FFFFFF";
const RED = "C0392B";

function styleHeader() {
  return { font: { bold: true, color: { rgb: WHITE }, sz: 11 }, fill: { fgColor: { rgb: HDR_BG } }, alignment: { vertical: "center", horizontal: "left" }, border: thinBorder() };
}
function thinBorder() {
  const s = { style: "thin", color: { rgb: "DDDDDD" } } as any;
  return { top: s, bottom: s, left: s, right: s };
}
function rowStyle(opts: { section?: boolean; milestone?: boolean; zebra?: boolean; overdue?: boolean; complete?: boolean }) {
  const base: any = { alignment: { vertical: "center" }, border: thinBorder() };
  if (opts.section) { base.font = { bold: true, color: { rgb: "172620" } }; base.fill = { fgColor: { rgb: SECTION_BG } }; }
  else if (opts.milestone) { base.font = { bold: true, color: { rgb: WHITE } }; base.fill = { fgColor: { rgb: MILESTONE_BG } }; }
  else if (opts.zebra) { base.fill = { fgColor: { rgb: ZEBRA_BG } }; }
  if (opts.overdue) base.font = { ...(base.font ?? {}), color: { rgb: RED } };
  if (opts.complete) base.font = { ...(base.font ?? {}), strike: true };
  return base;
}

function assigneeLabel(id: string | null, members: ExportCtx["members"]): string {
  if (!id) return "";
  const m = members[id]; return m?.full_name?.trim() || m?.email || "";
}

function titleCase(s: string) { return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); }

// ============ Sheet 1: Gantt Data ============
function buildDataSheet(ctx: ExportCtx) {
  const { items, members } = ctx;
  const byId = new Map(items.map((i) => [i.id, i] as const));
  const sectionOf = (i: GanttItem): string => {
    let cur: GanttItem | undefined = i;
    while (cur && cur.type !== "section" && cur.parent_id) cur = byId.get(cur.parent_id);
    return cur && cur.type === "section" ? cur.title : "";
  };
  const titleOf = (id: string) => byId.get(id)?.title ?? "";
  const cp = computeCriticalPath(items);

  const headers = [
    "ID", "Type", "Section", "Title", "Assignee",
    "Start Date", "End Date", "Duration (days)", "Progress (%)", "Status",
    "Dependencies", "Description", "Baseline Start", "Baseline End", "Variance (days)", "Is Critical Path",
  ];
  const aoa: any[][] = [headers];
  const rowMeta: { section: boolean; milestone: boolean; overdue: boolean; complete: boolean }[] = [];
  items.forEach((i, idx) => {
    const s = toDate(i.start_date), e = toDate(i.end_date) ?? s;
    const dur = s && e ? diffDays(s, e) + 1 : "";
    const overdue = isOverdue(i);
    const complete = i.progress >= 100 || i.is_complete || i.status === "complete";
    aoa.push([
      i.id.slice(0, 8),
      titleCase(i.type),
      sectionOf(i),
      i.title,
      assigneeLabel(i.assignee_id, members),
      i.start_date ?? "",
      i.end_date ?? "",
      dur,
      i.progress,
      titleCase(i.status),
      (i.dependencies ?? []).map((d) => titleOf(d.from)).filter(Boolean).join(", "),
      i.description ?? "",
      i.baseline_start ?? "",
      i.baseline_end ?? "",
      varianceDays(i) ?? "",
      cp.ids.has(i.id) ? "Yes" : "",
    ]);
    rowMeta.push({ section: i.type === "section", milestone: i.type === "milestone", overdue, complete });
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // header styles
  for (let c = 0; c < headers.length; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (ws[addr]) ws[addr].s = styleHeader();
  }
  // body styles
  rowMeta.forEach((m, idx) => {
    const r = idx + 1;
    for (let c = 0; c < headers.length; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) ws[addr] = { t: "s", v: "" };
      ws[addr].s = rowStyle({ section: m.section, milestone: m.milestone, zebra: !m.section && !m.milestone && idx % 2 === 1, overdue: m.overdue, complete: m.complete });
    }
  });
  // widths
  ws["!cols"] = [
    { wch: 10 }, { wch: 11 }, { wch: 22 }, { wch: 36 }, { wch: 22 },
    { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 13 },
    { wch: 28 }, { wch: 40 }, { wch: 13 }, { wch: 13 }, { wch: 13 }, { wch: 14 },
  ];
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };
  return ws;
}

// ============ Sheet 2: Summary ============
function buildSummarySheet(ctx: ExportCtx) {
  const { items, members } = ctx;
  const sections = items.filter((i) => i.type === "section").length;
  const tasks = items.filter((i) => i.type === "task" || i.type === "sub_item").length;
  const milestones = items.filter((i) => i.type === "milestone").length;
  const overall = computeOverallProgress(items);
  const byAssignee = new Map<string, { count: number; days: number }>();
  for (const i of items) {
    if (i.type === "section") continue;
    const name = i.assignee_id ? assigneeLabel(i.assignee_id, members) || "Unassigned" : "Unassigned";
    const s = toDate(i.start_date), e = toDate(i.end_date) ?? s;
    const days = s && e ? diffDays(s, e) + 1 : 0;
    const cur = byAssignee.get(name) ?? { count: 0, days: 0 };
    cur.count++; cur.days += days;
    byAssignee.set(name, cur);
  }
  const overdue = items.filter(isOverdue);
  const aoa: any[][] = [];
  aoa.push(["Project", ctx.projectName]);
  aoa.push(["Client", ctx.clientName]);
  aoa.push(["Date range", `${ctx.projectStart ?? "—"} → ${ctx.projectEnd ?? "—"}`]);
  aoa.push(["Overall progress", `${overall}%`]);
  aoa.push([]);
  aoa.push(["Items by type", ""]);
  aoa.push(["Sections", sections]);
  aoa.push(["Tasks", tasks]);
  aoa.push(["Milestones", milestones]);
  aoa.push([]);
  aoa.push(["Items by assignee", "Count", "Total days"]);
  for (const [k, v] of byAssignee) aoa.push([k, v.count, v.days]);
  aoa.push([]);
  aoa.push(["Overdue items", ""]);
  if (!overdue.length) aoa.push(["None", ""]);
  else for (const o of overdue) aoa.push([o.title, o.end_date ?? ""]);
  aoa.push([]);
  aoa.push(["Milestones", "Date", "Status"]);
  for (const m of items.filter((i) => i.type === "milestone")) {
    aoa.push([m.title, m.start_date ?? "", m.is_complete ? "Complete" : "Pending"]);
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [{ wch: 30 }, { wch: 22 }, { wch: 14 }];
  // style "header" rows (first column bold for label rows that look like labels)
  ["Items by type", "Items by assignee", "Overdue items", "Milestones"].forEach((label) => {
    for (let r = 0; r < aoa.length; r++) {
      if (aoa[r]?.[0] === label) {
        const addr = XLSX.utils.encode_cell({ r, c: 0 });
        if (ws[addr]) ws[addr].s = styleHeader();
      }
    }
  });
  return ws;
}

// ============ Sheet 3: Visual Timeline ============
function buildTimelineSheet(ctx: ExportCtx) {
  const items = ctx.items;
  const allDates = items.flatMap((i) => [toDate(i.start_date), toDate(i.end_date)]).filter((d): d is Date => !!d);
  if (!allDates.length) return XLSX.utils.aoa_to_sheet([["No dated items"]]);
  const minD = allDates.reduce((a, b) => (a < b ? a : b));
  const maxD = allDates.reduce((a, b) => (a > b ? a : b));
  // Week columns
  const startWeek = new Date(minD); startWeek.setDate(startWeek.getDate() - startWeek.getDay()); // Sunday
  const weeks: Date[] = [];
  for (let d = new Date(startWeek); d <= addDays(maxD, 7); d = addDays(d, 7)) weeks.push(new Date(d));
  const header = ["Item", ...weeks.map((w) => `${w.getMonth() + 1}/${w.getDate()}`)];
  const aoa: any[][] = [header];
  const rowMeta: { type: string; complete: boolean; spans: boolean[] }[] = [];
  for (const i of items) {
    const s = toDate(i.start_date), e = toDate(i.end_date) ?? s;
    const spans = weeks.map((w) => {
      if (!s || !e) return false;
      const wEnd = addDays(w, 6);
      return e >= w && s <= wEnd;
    });
    aoa.push([i.title, ...spans.map(() => "")]);
    rowMeta.push({ type: i.type, complete: i.is_complete || i.progress >= 100, spans });
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // header
  for (let c = 0; c < header.length; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (ws[addr]) ws[addr].s = styleHeader();
  }
  // shade cells
  rowMeta.forEach((m, idx) => {
    const r = idx + 1;
    const titleAddr = XLSX.utils.encode_cell({ r, c: 0 });
    if (ws[titleAddr]) ws[titleAddr].s = rowStyle({ section: m.type === "section", milestone: m.type === "milestone", complete: m.complete });
    m.spans.forEach((on, ci) => {
      const c = ci + 1;
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) ws[addr] = { t: "s", v: "" };
      if (on) {
        const fill = m.type === "section" ? SECTION_BG : m.type === "milestone" ? MILESTONE_BG : HDR_BG;
        ws[addr].s = { fill: { fgColor: { rgb: fill } }, border: thinBorder() };
      } else {
        ws[addr].s = { border: thinBorder() };
      }
    });
  });
  ws["!cols"] = [{ wch: 36 }, ...weeks.map(() => ({ wch: 4 }))];
  ws["!freeze"] = { xSplit: 1, ySplit: 1 };
  return ws;
}

// ============ Sheet 4: Import Template ============
function buildImportTemplateSheet() {
  const headers = ["Title", "Type", "Parent", "Section", "Start Date", "End Date", "Duration", "Assignee", "Progress", "Colour", "Dependencies", "Description", "Is Milestone"];
  const examples = [
    ["Phase 1 — Discovery", "Section", "", "", "2026-01-06", "2026-01-31", "", "", 0, "#60766B", "", "Discovery phase", "FALSE"],
    ["Stakeholder interviews", "Task", "", "Phase 1 — Discovery", "2026-01-06", "2026-01-15", 10, "jane@example.com", 0, "", "", "", "FALSE"],
    ["Discovery sign-off", "Milestone", "", "Phase 1 — Discovery", "2026-01-31", "", "", "", 0, "#C89741", "Stakeholder interviews", "", "TRUE"],
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...examples]);
  for (let c = 0; c < headers.length; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (ws[addr]) ws[addr].s = styleHeader();
  }
  ws["!cols"] = headers.map(() => ({ wch: 18 }));
  // Data validation lists (xlsx-js-style supports !dataValidation via array of rules)
  (ws as any)["!dataValidation"] = [
    { sqref: "B2:B1000", type: "list", formula1: '"Section,Task,Milestone,Sub-item"' },
    { sqref: "M2:M1000", type: "list", formula1: '"TRUE,FALSE"' },
  ];
  return ws;
}

// ============ Public ============
export function exportXlsxFull(ctx: ExportCtx, filename = "gantt.xlsx") {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, buildDataSheet(ctx), "Gantt Data");
  XLSX.utils.book_append_sheet(wb, buildSummarySheet(ctx), "Summary");
  XLSX.utils.book_append_sheet(wb, buildTimelineSheet(ctx), "Timeline");
  XLSX.utils.book_append_sheet(wb, buildImportTemplateSheet(), "Import Template");
  XLSX.writeFile(wb, filename);
}
