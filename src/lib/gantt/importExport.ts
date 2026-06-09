import * as XLSX from "xlsx";
import type { GanttItem, GanttItemType } from "./types";
import { downloadCsv, toCsv, parseCsv } from "@/lib/csv";
import { addDays, toDate, toISO } from "./dates";

// === Export (legacy) ===
const EXPORT_COLUMNS = [
  "Title", "Type", "Parent", "Section", "Start Date", "End Date", "Duration",
  "Assignee", "Progress", "Colour", "Dependencies", "Description", "Is Milestone",
];

function exportRows(items: GanttItem[], members: Record<string, { full_name: string | null; email: string | null }> = {}) {
  const byId = new Map(items.map((i) => [i.id, i] as const));
  const titleOf = (id: string) => byId.get(id)?.title ?? "";
  const sectionOf = (i: GanttItem): string => {
    let cur: GanttItem | undefined = i;
    while (cur && cur.type !== "section" && cur.parent_id) cur = byId.get(cur.parent_id);
    return cur && cur.type === "section" ? cur.title : "";
  };
  return items.map((i) => {
    const a = i.assignee_id ? members[i.assignee_id] : null;
    const parent = i.parent_id ? byId.get(i.parent_id) : null;
    return {
      Title: i.title,
      Type: i.type === "sub_item" ? "Sub-item" : i.type[0].toUpperCase() + i.type.slice(1),
      Parent: parent ? parent.title : "",
      Section: sectionOf(i),
      "Start Date": i.start_date ?? "",
      "End Date": i.end_date ?? "",
      Duration: i.duration_days ?? "",
      Assignee: a?.full_name || a?.email || "",
      Progress: i.progress,
      Colour: i.colour ?? "",
      Dependencies: (i.dependencies ?? []).map((d) => titleOf(d.from)).filter(Boolean).join(", "),
      Description: i.description ?? "",
      "Is Milestone": i.type === "milestone" ? "TRUE" : "FALSE",
    };
  });
}

export function exportCsv(items: GanttItem[], members: Record<string, any> = {}, filename = "gantt.csv") {
  downloadCsv(filename, toCsv(exportRows(items, members), EXPORT_COLUMNS));
}

export function exportXlsx(items: GanttItem[], members: Record<string, any> = {}, filename = "gantt.xlsx") {
  const ws = XLSX.utils.json_to_sheet(exportRows(items, members), { header: EXPORT_COLUMNS });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gantt");
  XLSX.writeFile(wb, filename);
}

// === Templates ===
const TEMPLATE_ROWS = [
  { Title: "Phase 1 — Discovery", Type: "Section", Parent: "", Section: "", "Start Date": "2026-01-06", "End Date": "2026-01-31", Duration: "", Assignee: "", Progress: 0, Colour: "#6366f1", Dependencies: "", Description: "Initial discovery phase", "Is Milestone": "FALSE" },
  { Title: "Stakeholder interviews", Type: "Task", Parent: "", Section: "Phase 1 — Discovery", "Start Date": "2026-01-06", "End Date": "2026-01-15", Duration: 10, Assignee: "jane@example.com", Progress: 0, Colour: "", Dependencies: "", Description: "", "Is Milestone": "FALSE" },
  { Title: "Discovery sign-off", Type: "Milestone", Parent: "", Section: "Phase 1 — Discovery", "Start Date": "2026-01-31", "End Date": "", Duration: "", Assignee: "", Progress: 0, Colour: "", Dependencies: "Stakeholder interviews", Description: "", "Is Milestone": "TRUE" },
];

export function downloadTemplateCsv() {
  downloadCsv("gantt-template.csv", toCsv(TEMPLATE_ROWS, EXPORT_COLUMNS));
}
export function downloadTemplateXlsx() {
  const ws = XLSX.utils.json_to_sheet(TEMPLATE_ROWS, { header: EXPORT_COLUMNS });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, "gantt-template.xlsx");
}

// === Import / Preview ===
export interface PreviewRow {
  rowIndex: number;
  title: string;
  type: GanttItemType;
  parentTitle: string;
  sectionTitle: string;
  startDate: string | null;
  endDate: string | null;
  duration: number | null;
  assigneeInput: string;
  assigneeId: string | null; // resolved
  assigneeUnresolved: boolean;
  progress: number;
  colour: string | null;
  dependencies: string[]; // titles
  description: string;
  errors: string[];
}

function parseDate(v: any): string | null {
  if (v === null || v === undefined || v === "") return null;
  if (v instanceof Date) return toISO(v);
  const s = String(v).trim();
  // YYYY-MM-DD
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  // DD/MM/YYYY
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  // Excel serial number
  if (/^\d+(\.\d+)?$/.test(s)) {
    const serial = Number(s);
    if (serial > 25569) {
      const ms = (serial - 25569) * 86400 * 1000;
      const d = new Date(ms);
      return toISO(d);
    }
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : toISO(d);
}

function normaliseType(v: any, isMilestone: boolean): GanttItemType {
  if (isMilestone) return "milestone";
  if (!v) return "task";
  const s = String(v).toLowerCase().replace(/[-_\s]/g, "");
  if (s === "section") return "section";
  if (s === "milestone") return "milestone";
  if (s === "subitem" || s === "sub") return "sub_item";
  return "task";
}

function key(s: string): string { return s.trim().toLowerCase(); }

function pickField(r: Record<string, any>, candidates: string[]): any {
  // case-insensitive lookup
  const map: Record<string, any> = {};
  for (const k of Object.keys(r)) map[key(k)] = r[k];
  for (const c of candidates) {
    const v = map[key(c)];
    if (v !== undefined && v !== "") return v;
  }
  return undefined;
}

function rowToPreview(r: Record<string, any>, idx: number, members: { id: string; full_name: string | null; email: string | null }[]): PreviewRow {
  const title = String(pickField(r, ["Title", "title", "Name"]) ?? "").trim();
  const isMs = String(pickField(r, ["Is Milestone", "is_milestone"]) ?? "").toLowerCase() === "true";
  const type = normaliseType(pickField(r, ["Type", "type"]), isMs);
  const parentTitle = String(pickField(r, ["Parent", "parent"]) ?? "").trim();
  const sectionTitle = String(pickField(r, ["Section", "section"]) ?? "").trim();
  const startRaw = pickField(r, ["Start Date", "start_date", "Start"]);
  const endRaw = pickField(r, ["End Date", "end_date", "End"]);
  const durRaw = pickField(r, ["Duration", "duration"]);
  const assigneeInput = String(pickField(r, ["Assignee", "assignee"]) ?? "").trim();
  const progress = Math.max(0, Math.min(100, Number(pickField(r, ["Progress", "progress"]) ?? 0) || 0));
  const colour = String(pickField(r, ["Colour", "Color", "colour", "color"]) ?? "").trim() || null;
  const depsRaw = String(pickField(r, ["Dependencies", "dependencies"]) ?? "");
  const description = String(pickField(r, ["Description", "description"]) ?? "");

  let startDate = parseDate(startRaw);
  let endDate = parseDate(endRaw);
  const duration = durRaw !== undefined && durRaw !== "" ? Math.max(1, Math.floor(Number(durRaw))) : null;
  if (!endDate && startDate && duration && type !== "milestone") {
    const sd = toDate(startDate)!;
    endDate = toISO(addDays(sd, duration - 1));
  }
  if (type === "milestone") {
    endDate = startDate;
  }

  const dependencies = depsRaw.split(",").map((s) => s.trim()).filter(Boolean);

  // Resolve assignee
  let assigneeId: string | null = null;
  let assigneeUnresolved = false;
  if (assigneeInput) {
    const q = key(assigneeInput);
    const match = members.find((m) =>
      (m.email && key(m.email) === q) ||
      (m.full_name && key(m.full_name) === q)
    );
    if (match) assigneeId = match.id;
    else assigneeUnresolved = true;
  }

  const errors: string[] = [];
  if (!title) errors.push("Title is required");
  if (startRaw && !startDate) errors.push("Invalid start date");
  if (endRaw && !endDate) errors.push("Invalid end date");
  if (startDate && endDate && endDate < startDate) errors.push("End date is before start date");
  if (type !== "milestone" && !startDate) errors.push("Start date required");
  if (type !== "milestone" && !endDate && !duration) errors.push("End date or duration required");
  if (colour && !/^#?[0-9a-f]{3,8}$/i.test(colour)) errors.push("Invalid colour");

  return {
    rowIndex: idx, title, type, parentTitle, sectionTitle,
    startDate, endDate, duration, assigneeInput, assigneeId, assigneeUnresolved,
    progress, colour: colour ? (colour.startsWith("#") ? colour : `#${colour}`) : null,
    dependencies, description, errors,
  };
}

export async function parseImportFile(
  file: File,
  members: { id: string; full_name: string | null; email: string | null }[],
): Promise<PreviewRow[]> {
  const name = file.name.toLowerCase();
  let rows: Record<string, any>[] = [];
  if (name.endsWith(".csv")) {
    const txt = await file.text();
    rows = parseCsv(txt);
  } else {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array", cellDates: true });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { raw: false, dateNF: "yyyy-mm-dd" });
  }
  return rows.map((r, i) => rowToPreview(r, i, members));
}
