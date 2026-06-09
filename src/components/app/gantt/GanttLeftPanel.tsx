import { useState } from "react";
import { ChevronRight, ChevronDown, Diamond, MoreHorizontal, Plus, AlertCircle, GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { initials } from "@/components/app/taskUtils";
import type { GanttItem } from "@/lib/gantt/types";
import { isOverdue, varianceDays } from "@/lib/gantt/critical";

export interface FlatRow { item: GanttItem; depth: number; hasChildren: boolean; }

interface Props {
  rows: FlatRow[];
  members: Record<string, { full_name: string | null; email: string | null }>;
  onOpen: (id: string) => void;
  onUpdate: (id: string, patch: Partial<GanttItem>) => void;
  onToggleCollapse: (id: string) => void;
  onAction: (id: string, action: "edit"|"add_sub"|"add_below"|"indent"|"outdent"|"duplicate"|"delete") => void;
  onAddItemAtEnd: (parentId: string | null) => void;
  rowHeight: number;
  selectedId: string | null;
  criticalIds: Set<string>;
  sectionProgress: Map<string, number>;
  showVariance: boolean;
  critical: boolean;
}

const GRID = "grid-cols-[24px_1fr_84px_88px_88px_56px_52px_56px_22px]";

export function GanttLeftPanel({
  rows, members, onOpen, onUpdate, onToggleCollapse, onAction, onAddItemAtEnd,
  rowHeight, selectedId, criticalIds, sectionProgress, showVariance, critical,
}: Props) {
  return (
    <div className="border-r bg-background flex flex-col min-w-0">
      <div className={`grid ${GRID} gap-0 px-2 py-2 border-b text-[10px] uppercase tracking-wider text-muted-foreground font-semibold bg-muted/30`}>
        <div>#</div>
        <div>Item</div>
        <div>Assignee</div>
        <div>Start</div>
        <div>End</div>
        <div>Prog.</div>
        <div>Days</div>
        <div title="Variance vs baseline">{showVariance ? "Var." : "—"}</div>
        <div></div>
      </div>
      <div className="overflow-y-auto flex-1">
        {rows.map((r, idx) => (
          <Row key={r.item.id} row={r} idx={idx + 1} members={members}
            onOpen={onOpen} onUpdate={onUpdate} onToggleCollapse={onToggleCollapse} onAction={onAction}
            rowHeight={rowHeight} selected={selectedId === r.item.id}
            isCritical={critical && criticalIds.has(r.item.id)}
            sectionProgress={sectionProgress}
            showVariance={showVariance}
          />
        ))}
        <div className="p-2 border-t">
          <Button size="sm" variant="ghost" className="text-xs" onClick={() => onAddItemAtEnd(null)}>
            <Plus className="h-3 w-3 mr-1" /> Add item
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ row, idx, members, onOpen, onUpdate, onToggleCollapse, onAction, rowHeight, selected, isCritical, sectionProgress, showVariance }:
  any) {
  const { item, depth, hasChildren } = row as FlatRow;
  const isSection = item.type === "section";
  const isMilestone = item.type === "milestone";
  const a = item.assignee_id ? members[item.assignee_id] : null;
  const assigneeLabel = a?.full_name?.trim() || a?.email || "—";
  const overdue = isOverdue(item);
  const variance = showVariance ? varianceDays(item) : null;
  const displayedProgress = isSection ? (sectionProgress.get(item.id) ?? 0) : item.progress;

  return (
    <div
      className={`grid ${GRID} items-center gap-0 px-2 border-b text-xs hover:bg-muted/40 ${selected ? "bg-primary/5" : ""} ${isSection ? "bg-muted/20 font-semibold" : ""} ${overdue ? "border-l-2 border-l-red-500" : ""}`}
      style={{ height: rowHeight }}
    >
      <div className="text-muted-foreground tabular-nums text-[10px]">{idx}</div>
      <div className="flex items-center gap-1 min-w-0" style={{ paddingLeft: depth * 14 }}>
        {hasChildren ? (
          <button onClick={() => onToggleCollapse(item.id)} className="opacity-70 hover:opacity-100">
            {item.is_collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        ) : <span className="w-3 inline-block" />}
        {isMilestone && <Diamond className={`h-3 w-3 ${item.is_complete ? "fill-current" : ""}`} style={{ color: item.colour ?? "#6366f1" }} />}
        <InlineText value={item.title} onCommit={(v) => onUpdate(item.id, { title: v })}
          className={isSection ? "font-semibold" : ""} onClickOpen={() => onOpen(item.id)} />
        {isCritical && (
          <span className="ml-1 inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide text-red-600 bg-red-500/10 rounded px-1 py-0.5">
            <GitBranch className="h-2.5 w-2.5" /> Critical
          </span>
        )}
        {overdue && (
          <AlertCircle className="h-3 w-3 text-red-500 shrink-0" aria-label="Overdue" />
        )}
      </div>
      <div className="text-muted-foreground truncate flex items-center gap-1">
        {a && <Avatar className="h-4 w-4"><AvatarFallback className="text-[8px]">{initials(assigneeLabel)}</AvatarFallback></Avatar>}
        <span className="truncate text-[11px]">{assigneeLabel}</span>
      </div>
      <InlineDate value={item.start_date} onCommit={(v) => onUpdate(item.id, { start_date: v })} />
      <InlineDate value={item.end_date} onCommit={(v) => onUpdate(item.id, { end_date: v })} disabled={isMilestone} />
      <div className="flex items-center gap-1">
        {isSection ? (
          <span className="text-[11px] tabular-nums text-muted-foreground">{displayedProgress}%</span>
        ) : (
          <InlineNumber value={item.progress} onCommit={(v) => onUpdate(item.id, { progress: Math.max(0, Math.min(100, v)) })} max={100} />
        )}
      </div>
      <div className="text-muted-foreground tabular-nums text-[11px]">{item.duration_days ?? "—"}</div>
      <div className="tabular-nums text-[11px]">
        {variance == null ? <span className="text-muted-foreground">—</span> :
          variance === 0 ? <span className="text-muted-foreground">0d</span> :
          variance < 0 ? <span className="text-emerald-600">{variance}d</span> :
          <span className="text-red-600">+{variance}d</span>}
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 opacity-50 hover:opacity-100"><MoreHorizontal className="h-3.5 w-3.5" /></button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAction(item.id, "edit")}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(item.id, "add_sub")}>Add sub-item</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(item.id, "add_below")}>Add item below</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction(item.id, "indent")}>Indent</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(item.id, "outdent")}>Outdent</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(item.id, "duplicate")}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction(item.id, "delete")} className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function InlineText({ value, onCommit, className, onClickOpen }: { value: string; onCommit: (v: string) => void; className?: string; onClickOpen?: () => void }) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value);
  if (!editing) {
    return (
      <span
        onClick={() => onClickOpen?.()}
        onDoubleClick={(e) => { e.stopPropagation(); setV(value); setEditing(true); }}
        className={`truncate cursor-text hover:underline decoration-dotted ${className ?? ""}`}
      >{value}</span>
    );
  }
  return (
    <Input autoFocus value={v} onChange={(e) => setV(e.target.value)}
      onBlur={() => { setEditing(false); if (v !== value) onCommit(v); }}
      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") setEditing(false); }}
      className="h-6 px-1 text-xs" />
  );
}

function InlineDate({ value, onCommit, disabled }: { value: string | null; onCommit: (v: string | null) => void; disabled?: boolean }) {
  if (disabled) return <span className="text-muted-foreground text-[11px]">—</span>;
  return (
    <input type="date" value={value ?? ""}
      onChange={(e) => onCommit(e.target.value || null)}
      className="bg-transparent text-[11px] outline-none hover:bg-muted/50 rounded px-1 py-0.5 w-[84px]" />
  );
}

function InlineNumber({ value, onCommit, max }: { value: number; onCommit: (v: number) => void; max?: number }) {
  const [v, setV] = useState(String(value));
  return (
    <input type="number" min={0} max={max} value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => { const n = Number(v); if (!isNaN(n) && n !== value) onCommit(n); else setV(String(value)); }}
      className="bg-transparent text-[11px] outline-none hover:bg-muted/50 rounded px-1 py-0.5 w-12 tabular-nums" />
  );
}
