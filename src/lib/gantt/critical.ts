import type { GanttItem } from "./types";
import { toDate, diffDays, addDays, toISO, today } from "./dates";

/**
 * Compute critical path: longest chain of dependent items that determines end date.
 * Returns set of item ids on the critical path and the project end date.
 */
export function computeCriticalPath(items: GanttItem[]): { ids: Set<string>; endDate: Date | null } {
  // Only schedulable items (skip sections — they are containers)
  const schedulable = items.filter((i) => i.type !== "section");
  const byId = new Map(schedulable.map((i) => [i.id, i] as const));

  // Build adjacency: successors map (from -> list of items that depend on it)
  const successors = new Map<string, string[]>();
  for (const it of schedulable) {
    for (const dep of it.dependencies ?? []) {
      if (!byId.has(dep.from)) continue;
      if (!successors.has(dep.from)) successors.set(dep.from, []);
      successors.get(dep.from)!.push(it.id);
    }
  }

  // Forward pass — longest path length to end (in days) starting at each node
  const memo = new Map<string, { dur: number; endDate: Date | null; next: string | null }>();
  const visiting = new Set<string>();

  function dur(it: GanttItem): number {
    const s = toDate(it.start_date), e = toDate(it.end_date) ?? s;
    if (!s || !e) return 1;
    return Math.max(1, diffDays(s, e) + 1);
  }

  function visit(id: string): { dur: number; endDate: Date | null; next: string | null } {
    if (memo.has(id)) return memo.get(id)!;
    if (visiting.has(id)) return { dur: 0, endDate: null, next: null };
    visiting.add(id);
    const it = byId.get(id);
    if (!it) { visiting.delete(id); return { dur: 0, endDate: null, next: null }; }
    const own = dur(it);
    const ownEnd = toDate(it.end_date) ?? toDate(it.start_date);
    const succs = successors.get(id) ?? [];
    let bestNext: string | null = null;
    let bestDur = 0;
    let bestEnd: Date | null = ownEnd;
    for (const sid of succs) {
      const r = visit(sid);
      if (r.dur > bestDur) {
        bestDur = r.dur;
        bestNext = sid;
        bestEnd = r.endDate;
      }
    }
    visiting.delete(id);
    const result = { dur: own + bestDur, endDate: bestEnd ?? ownEnd, next: bestNext };
    memo.set(id, result);
    return result;
  }

  // Find root start nodes — items with no predecessors among schedulable
  const hasPred = new Set<string>();
  for (const it of schedulable) {
    for (const dep of it.dependencies ?? []) if (byId.has(dep.from)) hasPred.add(it.id);
  }
  const roots = schedulable.filter((i) => !hasPred.has(i.id)).map((i) => i.id);

  let bestRoot: string | null = null;
  let bestLen = 0;
  let projectEnd: Date | null = null;
  for (const r of roots) {
    const res = visit(r);
    if (res.dur > bestLen) { bestLen = res.dur; bestRoot = r; }
  }

  const ids = new Set<string>();
  let cur = bestRoot;
  while (cur) {
    ids.add(cur);
    const r = memo.get(cur);
    if (r?.endDate && (!projectEnd || r.endDate > projectEnd)) projectEnd = r.endDate;
    cur = r?.next ?? null;
  }

  // Fall back: project end = max end_date across all items
  for (const it of schedulable) {
    const e = toDate(it.end_date) ?? toDate(it.start_date);
    if (e && (!projectEnd || e > projectEnd)) projectEnd = e;
  }

  return { ids, endDate: projectEnd };
}

/** Weighted-average progress for a section based on its descendants (tasks/sub-items only) */
export function computeSectionProgress(items: GanttItem[]): Map<string, number> {
  const byParent = new Map<string, GanttItem[]>();
  for (const it of items) {
    const k = it.parent_id ?? "_root";
    if (!byParent.has(k)) byParent.set(k, []);
    byParent.get(k)!.push(it);
  }
  const out = new Map<string, number>();
  function collectLeaves(id: string): GanttItem[] {
    const kids = byParent.get(id) ?? [];
    if (!kids.length) {
      const self = items.find((i) => i.id === id);
      return self && self.type !== "section" ? [self] : [];
    }
    return kids.flatMap((k) => k.type === "section" ? collectLeaves(k.id) : [k]);
  }
  for (const it of items) {
    if (it.type !== "section") continue;
    const leaves = collectLeaves(it.id);
    if (!leaves.length) { out.set(it.id, 0); continue; }
    // Weight by duration (days)
    let totalW = 0, totalP = 0;
    for (const l of leaves) {
      const s = toDate(l.start_date), e = toDate(l.end_date) ?? s;
      const w = s && e ? Math.max(1, diffDays(s, e) + 1) : 1;
      totalW += w;
      totalP += w * (l.progress ?? 0);
    }
    out.set(it.id, totalW ? Math.round(totalP / totalW) : 0);
  }
  return out;
}

export function computeOverallProgress(items: GanttItem[]): number {
  const leaves = items.filter((i) => i.type !== "section");
  if (!leaves.length) return 0;
  let totalW = 0, totalP = 0;
  for (const l of leaves) {
    const s = toDate(l.start_date), e = toDate(l.end_date) ?? s;
    const w = s && e ? Math.max(1, diffDays(s, e) + 1) : 1;
    totalW += w;
    totalP += w * (l.progress ?? 0);
  }
  return totalW ? Math.round(totalP / totalW) : 0;
}

export function isOverdue(item: { end_date: string | null; progress: number; type: string }): boolean {
  if (item.type === "section") return false;
  if ((item.progress ?? 0) >= 100) return false;
  const e = toDate(item.end_date);
  if (!e) return false;
  return e < today();
}

export function varianceDays(item: { start_date: string | null; end_date: string | null; baseline_start: string | null; baseline_end: string | null }): number | null {
  const e = toDate(item.end_date);
  const be = toDate(item.baseline_end);
  if (!e || !be) return null;
  // Positive => current end is later than baseline (behind)
  // Negative => ahead
  return diffDays(be, e);
}
