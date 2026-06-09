import { useMemo, useRef, useState } from "react";
import {
  addDays, diffDays, formatHeader, isWeekend, stripTime, today, toDate, toISO, ZOOM_PX_PER_DAY,
} from "@/lib/gantt/dates";
import type { ColourBy, GanttItem, ZoomLevel } from "@/lib/gantt/types";
import { STATUS_COLOUR } from "@/lib/gantt/types";
import type { FlatRow } from "./GanttLeftPanel";

interface Props {
  rows: FlatRow[];
  zoom: ZoomLevel;
  showDeps: boolean;
  critical: boolean;
  showWeekends: boolean;
  showBaseline: boolean;
  colourBy: ColourBy;
  rangeStart: Date;
  rangeDays: number;
  rowHeight: number;
  headerHeight: number;
  onUpdate: (id: string, patch: Partial<GanttItem>) => void;
  onOpen: (id: string) => void;
  onCreateDep: (fromId: string, toId: string) => void;
  selectedId: string | null;
  scrollRef?: React.RefObject<HTMLDivElement>;
  criticalIds: Set<string>;
}

const ASSIGNEE_PALETTE = ["#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#84cc16", "#06b6d4", "#a855f7", "#f43f5e"];
function assigneeColour(id: string | null): string {
  if (!id) return "#94a3b8";
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ASSIGNEE_PALETTE[h % ASSIGNEE_PALETTE.length];
}

export function GanttTimeline({
  rows, zoom, showDeps, critical, showWeekends, showBaseline, colourBy,
  rangeStart, rangeDays, rowHeight, headerHeight, onUpdate, onOpen, onCreateDep, selectedId, scrollRef, criticalIds,
}: Props) {
  const pxDay = ZOOM_PX_PER_DAY[zoom];
  const width = rangeDays * pxDay;
  const containerRef = useRef<HTMLDivElement>(null);
  const todayD = today();
  const todayX = diffDays(rangeStart, todayD) * pxDay;

  // Drag state
  const [drag, setDrag] = useState<null | {
    id: string; mode: "move" | "resize-end" | "create-dep";
    startX: number; origStart: Date | null; origEnd: Date | null;
    pointerX?: number; pointerY?: number;
  }>(null);

  const rowsById = useMemo(() => {
    const m: Record<string, FlatRow> = {};
    rows.forEach((r) => { m[r.item.id] = r; });
    return m;
  }, [rows]);

  function colourFor(item: GanttItem, depth: number): string {
    if (colourBy === "custom" && item.colour) return item.colour;
    if (colourBy === "assignee") return assigneeColour(item.assignee_id);
    if (colourBy === "section") {
      // walk up to find section
      let cur: FlatRow | undefined = rowsById[item.id];
      while (cur && cur.item.type !== "section" && cur.item.parent_id) {
        cur = rowsById[cur.item.parent_id];
      }
      return cur?.item.colour || "#6366f1";
    }
    return STATUS_COLOUR[item.status] ?? "#3b82f6";
  }

  function startMove(e: React.PointerEvent, item: GanttItem, mode: "move" | "resize-end") {
    e.stopPropagation();
    const s = toDate(item.start_date);
    const en = toDate(item.end_date);
    if (!s || !en) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ id: item.id, mode, startX: e.clientX, origStart: s, origEnd: en });
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    setDrag({ ...drag, pointerX: e.clientX, pointerY: e.clientY });
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!drag) { return; }
    if (drag.mode === "create-dep") {
      // detect drop target
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const tid = el?.closest("[data-gantt-bar]")?.getAttribute("data-id");
      if (tid && tid !== drag.id) onCreateDep(drag.id, tid);
      setDrag(null);
      return;
    }
    const dx = e.clientX - drag.startX;
    const days = Math.round(dx / pxDay);
    if (days !== 0 && drag.origStart && drag.origEnd) {
      const item = rowsById[drag.id]?.item;
      if (item) {
        if (drag.mode === "move") {
          onUpdate(drag.id, {
            start_date: toISO(addDays(drag.origStart, days)),
            end_date: toISO(addDays(drag.origEnd, days)),
          });
        } else {
          const newEnd = addDays(drag.origEnd, days);
          if (newEnd >= drag.origStart) onUpdate(drag.id, { end_date: toISO(newEnd) });
        }
      }
    }
    setDrag(null);
  }

  function startCreateDep(e: React.PointerEvent, item: GanttItem) {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ id: item.id, mode: "create-dep", startX: e.clientX, origStart: null, origEnd: null, pointerX: e.clientX, pointerY: e.clientY });
  }

  // Group headers by month for top header row
  const monthSegments = useMemo(() => {
    const segs: { label: string; x: number; w: number }[] = [];
    let cursor = stripTime(rangeStart);
    let i = 0;
    while (i < rangeDays) {
      const segStart = i;
      const m = cursor.getMonth(), y = cursor.getFullYear();
      while (i < rangeDays && cursor.getMonth() === m && cursor.getFullYear() === y) {
        cursor = addDays(cursor, 1); i++;
      }
      segs.push({
        label: new Date(y, m, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" }),
        x: segStart * pxDay,
        w: (i - segStart) * pxDay,
      });
    }
    return segs;
  }, [rangeStart, rangeDays, pxDay]);

  // Sub-tick interval based on zoom
  const tickEvery = zoom === "day" ? 1 : zoom === "week" ? 7 : zoom === "month" ? 30 : 90;

  return (
    <div ref={scrollRef ?? containerRef} className="overflow-auto bg-background relative"
      onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <div style={{ width, position: "relative" }}>
        {/* Header */}
        <div className="sticky top-0 z-20 bg-background border-b" style={{ height: headerHeight }}>
          <div className="relative h-1/2 border-b">
            {monthSegments.map((s, i) => (
              <div key={i} className="absolute top-0 h-full px-2 flex items-center text-[11px] font-semibold border-r truncate"
                style={{ left: s.x, width: s.w }}>{s.label}</div>
            ))}
          </div>
          <div className="relative h-1/2">
            {Array.from({ length: Math.ceil(rangeDays / tickEvery) }).map((_, i) => {
              const d = addDays(rangeStart, i * tickEvery);
              return (
                <div key={i} className="absolute top-0 h-full border-r text-[10px] text-muted-foreground flex items-center justify-center"
                  style={{ left: i * tickEvery * pxDay, width: tickEvery * pxDay }}>
                  {formatHeader(d, zoom)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="relative">
          {/* Weekend & grid background */}
          {showWeekends && Array.from({ length: rangeDays }).map((_, i) => {
            const d = addDays(rangeStart, i);
            if (!isWeekend(d)) return null;
            return <div key={i} className="absolute top-0 bottom-0 bg-muted/30 pointer-events-none"
              style={{ left: i * pxDay, width: pxDay }} />;
          })}

          {/* Rows */}
          {rows.map((r, idx) => (
            <div key={r.item.id} className="border-b relative" style={{ height: rowHeight }}>
              {r.item.type === "section" ? (
                <SectionBar row={r} rows={rows} rangeStart={rangeStart} pxDay={pxDay} rowHeight={rowHeight} />
              ) : r.item.type === "milestone" ? (
                <MilestoneNode item={r.item} rangeStart={rangeStart} pxDay={pxDay} rowHeight={rowHeight}
                  selected={selectedId === r.item.id} onOpen={onOpen} colour={colourFor(r.item, r.depth)} />
              ) : (
                <Bar item={r.item} rangeStart={rangeStart} pxDay={pxDay} rowHeight={rowHeight}
                  colour={colourFor(r.item, r.depth)} sub={r.item.type === "sub_item"}
                  critical={critical && criticalIds.has(r.item.id)}
                  showBaseline={showBaseline}
                  selected={selectedId === r.item.id}
                  onOpen={onOpen} onMove={(e) => startMove(e, r.item, "move")}
                  onResizeEnd={(e) => startMove(e, r.item, "resize-end")}
                  onStartDep={(e) => startCreateDep(e, r.item)} />
              )}
            </div>
          ))}

          {/* Today line */}
          {todayX >= 0 && todayX <= width && (
            <div className="absolute top-0 bottom-0 pointer-events-none z-10" style={{ left: todayX }}>
              <div className="absolute top-0 bottom-0 w-px bg-red-500/70" />
              <div className="absolute -top-1 -translate-x-1/2 bg-red-500 text-white text-[9px] px-1 rounded">TODAY</div>
            </div>
          )}

          {/* Dependency arrows */}
          {showDeps && (
            <DependencyLayer rows={rows} rangeStart={rangeStart} pxDay={pxDay} rowHeight={rowHeight} headerHeight={0} />
          )}

          {/* Drag-to-create-dep line */}
          {drag?.mode === "create-dep" && drag.pointerX != null && (
            <DragDepLine drag={drag} containerRef={scrollRef ?? containerRef} rangeStart={rangeStart} pxDay={pxDay} rowHeight={rowHeight} rows={rows} />
          )}
        </div>
      </div>
    </div>
  );
}

function Bar({ item, rangeStart, pxDay, rowHeight, colour, sub, critical, selected, onOpen, onMove, onResizeEnd, onStartDep }: any) {
  const s = toDate(item.start_date); const e = toDate(item.end_date);
  if (!s || !e) return null;
  const x = diffDays(rangeStart, s) * pxDay;
  const w = Math.max(pxDay, (diffDays(s, e) + 1) * pxDay);
  const h = sub ? rowHeight - 14 : rowHeight - 10;
  const top = (rowHeight - h) / 2;
  const progressW = Math.max(0, Math.min(100, item.progress)) / 100 * w;
  return (
    <div
      data-gantt-bar data-id={item.id}
      onClick={() => onOpen(item.id)}
      onPointerDown={onMove}
      title={`${item.title}\n${item.start_date} → ${item.end_date}\nProgress ${item.progress}%`}
      className={`absolute rounded-md shadow-sm cursor-grab active:cursor-grabbing overflow-hidden group ${critical ? "ring-2 ring-red-500" : selected ? "ring-2 ring-primary" : ""}`}
      style={{ left: x, top, width: w, height: h, background: `${colour}33`, border: `1px solid ${colour}` }}
    >
      <div className="absolute inset-y-0 left-0" style={{ width: progressW, background: colour, opacity: 0.85 }} />
      <div className="relative px-2 h-full flex items-center text-[10px] font-medium text-foreground/90 truncate pointer-events-none">
        {item.title}
      </div>
      {/* resize handle */}
      <div onPointerDown={onResizeEnd} className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize bg-foreground/0 hover:bg-foreground/20" />
      {/* dep handle */}
      <div onPointerDown={onStartDep}
        className="absolute -right-2 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 cursor-crosshair"
        title="Drag to another item to create dependency" />
    </div>
  );
}

function MilestoneNode({ item, rangeStart, pxDay, rowHeight, selected, onOpen, colour }: any) {
  const d = toDate(item.start_date); if (!d) return null;
  const x = diffDays(rangeStart, d) * pxDay;
  const size = Math.min(rowHeight - 8, 18);
  return (
    <div data-gantt-bar data-id={item.id} onClick={() => onOpen(item.id)} title={`${item.title} • ${item.start_date}`}
      className={`absolute cursor-pointer ${selected ? "ring-2 ring-primary rounded" : ""}`}
      style={{ left: x - size / 2, top: (rowHeight - size) / 2, width: size, height: size, transform: "rotate(45deg)", background: item.is_complete ? colour : "transparent", border: `2px solid ${colour}` }} />
  );
}

function SectionBar({ row, rows, rangeStart, pxDay, rowHeight }: any) {
  // find children
  const children = rows.filter((r: FlatRow) => r.item.parent_id === row.item.id && (r.item.type !== "milestone" ? r.item.start_date && r.item.end_date : r.item.start_date));
  if (!children.length) return null;
  let minD: Date | null = null, maxD: Date | null = null;
  for (const c of children) {
    const s = toDate(c.item.start_date); const e = toDate(c.item.end_date ?? c.item.start_date);
    if (s && (!minD || s < minD)) minD = s;
    if (e && (!maxD || e > maxD)) maxD = e;
  }
  if (!minD || !maxD) return null;
  const x = diffDays(rangeStart, minD) * pxDay;
  const w = Math.max(pxDay, (diffDays(minD, maxD) + 1) * pxDay);
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: rowHeight / 2 - 3, width: w, height: 6 }}>
      <div className="h-1.5 bg-foreground/60 rounded-sm" />
      <div className="absolute -top-1 left-0 h-3 w-1 bg-foreground/60 rounded-l" />
      <div className="absolute -top-1 right-0 h-3 w-1 bg-foreground/60 rounded-r" />
    </div>
  );
}

function DependencyLayer({ rows, rangeStart, pxDay, rowHeight }: any) {
  const indexById: Record<string, number> = {};
  rows.forEach((r: FlatRow, i: number) => { indexById[r.item.id] = i; });

  const lines: { x1: number; y1: number; x2: number; y2: number; }[] = [];
  rows.forEach((r: FlatRow) => {
    const toItem = r.item;
    const toStart = toDate(toItem.start_date); if (!toStart) return;
    const toX = diffDays(rangeStart, toStart) * pxDay;
    const toY = indexById[toItem.id] * rowHeight + rowHeight / 2;
    (toItem.dependencies ?? []).forEach((dep) => {
      const fromIdx = indexById[dep.from]; if (fromIdx == null) return;
      const fromItem = rows[fromIdx].item;
      const fromEnd = toDate(fromItem.end_date ?? fromItem.start_date); if (!fromEnd) return;
      const fromX = (diffDays(rangeStart, fromEnd) + 1) * pxDay;
      const fromY = fromIdx * rowHeight + rowHeight / 2;
      lines.push({ x1: fromX, y1: fromY, x2: toX, y2: toY });
    });
  });

  if (!lines.length) return null;
  const w = Math.max(...lines.map((l) => Math.max(l.x1, l.x2))) + 20;
  const h = rows.length * rowHeight;
  return (
    <svg className="absolute top-0 left-0 pointer-events-none" width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <marker id="arr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="hsl(var(--muted-foreground))" />
        </marker>
      </defs>
      {lines.map((l, i) => {
        const midX = l.x1 + 12;
        return (
          <path key={i} d={`M${l.x1},${l.y1} L${midX},${l.y1} L${midX},${l.y2} L${l.x2},${l.y2}`}
            fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.2" opacity="0.7" markerEnd="url(#arr)" />
        );
      })}
    </svg>
  );
}

function DragDepLine({ drag, containerRef, rangeStart, pxDay, rowHeight, rows }: any) {
  const idx = rows.findIndex((r: FlatRow) => r.item.id === drag.id);
  const item = rows[idx]?.item; if (!item) return null;
  const end = toDate(item.end_date ?? item.start_date); if (!end) return null;
  const rect = containerRef.current?.getBoundingClientRect();
  if (!rect) return null;
  const scrollLeft = containerRef.current?.scrollLeft ?? 0;
  const scrollTop = containerRef.current?.scrollTop ?? 0;
  const x1 = (diffDays(rangeStart, end) + 1) * pxDay;
  const y1 = idx * rowHeight + rowHeight / 2;
  const x2 = drag.pointerX - rect.left + scrollLeft;
  const y2 = drag.pointerY - rect.top + scrollTop - 60; // approx header
  return (
    <svg className="absolute top-0 left-0 pointer-events-none" width="100%" height="100%" style={{ overflow: "visible" }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}
