import * as XLSX from "xlsx";
import type { GanttItem, GanttItemType } from "./types";
import { downloadCsv, toCsv, parseCsv } from "@/lib/csv";

const COLUMNS = [
  "id", "parent_id", "type", "title", "description",
  "start_date", "end_date", "progress", "status", "assignee_id",
  "colour", "is_critical_path", "dependencies", "position",
];

function rowsFromItems(items: GanttItem[]) {
  return items.map((i) => ({
    id: i.id,
    parent_id: i.parent_id ?? "",
    type: i.type,
    title: i.title,
    description: i.description ?? "",
    start_date: i.start_date ?? "",
    end_date: i.end_date ?? "",
    progress: i.progress,
    status: i.status,
    assignee_id: i.assignee_id ?? "",
    colour: i.colour ?? "",
    is_critical_path: i.is_critical_path ? "true" : "false",
    dependencies: JSON.stringify(i.dependencies ?? []),
    position: i.position,
  }));
}

export function exportCsv(items: GanttItem[], filename = "gantt.csv") {
  downloadCsv(filename, toCsv(rowsFromItems(items), COLUMNS));
}

export function exportXlsx(items: GanttItem[], filename = "gantt.xlsx") {
  const ws = XLSX.utils.json_to_sheet(rowsFromItems(items), { header: COLUMNS });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gantt");
  XLSX.writeFile(wb, filename);
}

export interface ImportedRow {
  parent_id: string | null;
  type: GanttItemType;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  progress: number;
  status: string;
  colour: string | null;
  is_critical_path: boolean;
  dependencies: any[];
  position: number;
}

function normaliseRow(r: Record<string, any>, idx: number): ImportedRow {
  const typeRaw = String(r.type ?? "task").toLowerCase();
  const type = (["section", "task", "milestone", "sub_item"].includes(typeRaw) ? typeRaw : "task") as GanttItemType;
  let deps: any[] = [];
  try {
    if (r.dependencies) {
      const parsed = typeof r.dependencies === "string" ? JSON.parse(r.dependencies) : r.dependencies;
      if (Array.isArray(parsed)) deps = parsed;
    }
  } catch { deps = []; }
  return {
    parent_id: r.parent_id ? String(r.parent_id) : null,
    type,
    title: String(r.title ?? "Untitled").slice(0, 500),
    description: r.description ? String(r.description) : null,
    start_date: r.start_date ? String(r.start_date).slice(0, 10) : null,
    end_date: r.end_date ? String(r.end_date).slice(0, 10) : null,
    progress: Math.max(0, Math.min(100, Number(r.progress) || 0)),
    status: String(r.status ?? "not_started"),
    colour: r.colour ? String(r.colour) : null,
    is_critical_path: String(r.is_critical_path ?? "false").toLowerCase() === "true",
    dependencies: deps,
    position: Number(r.position) || idx,
  };
}

export async function importFile(file: File): Promise<ImportedRow[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv")) {
    const txt = await file.text();
    return parseCsv(txt).map(normaliseRow);
  }
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
  return rows.map(normaliseRow);
}
