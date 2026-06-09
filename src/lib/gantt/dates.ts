import type { ZoomLevel } from "./types";

export const DAY_MS = 86400000;

export function toDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s + (s.length === 10 ? "T00:00:00" : ""));
  return isNaN(d.getTime()) ? null : d;
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((stripTime(b).getTime() - stripTime(a).getTime()) / DAY_MS);
}

export function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function today(): Date {
  return stripTime(new Date());
}

export const ZOOM_PX_PER_DAY: Record<ZoomLevel, number> = {
  day: 40,
  week: 18,
  month: 6,
  quarter: 2.4,
};

export function isWeekend(d: Date): boolean {
  const w = d.getDay();
  return w === 0 || w === 6;
}

export interface TimelineRange { start: Date; end: Date; days: number; }

export function computeRange(dates: (string | null)[], projectStart?: string | null, projectEnd?: string | null): TimelineRange {
  const all: Date[] = [];
  for (const s of dates) {
    const d = toDate(s);
    if (d) all.push(d);
  }
  const ps = toDate(projectStart); if (ps) all.push(ps);
  const pe = toDate(projectEnd); if (pe) all.push(pe);
  const now = today();
  if (!all.length) {
    const start = addDays(now, -14);
    const end = addDays(now, 60);
    return { start, end, days: diffDays(start, end) + 1 };
  }
  let min = all[0], max = all[0];
  for (const d of all) { if (d < min) min = d; if (d > max) max = d; }
  const start = addDays(min, -7);
  const end = addDays(max, 14);
  return { start, end, days: diffDays(start, end) + 1 };
}

export function formatHeader(d: Date, zoom: ZoomLevel): string {
  if (zoom === "day") return String(d.getDate());
  if (zoom === "week") return `${d.getDate()}/${d.getMonth() + 1}`;
  if (zoom === "month") return d.toLocaleDateString(undefined, { month: "short" });
  return `Q${Math.floor(d.getMonth() / 3) + 1} '${String(d.getFullYear()).slice(2)}`;
}
