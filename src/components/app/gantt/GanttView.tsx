import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { GanttToolbar } from "./GanttToolbar";
import { GanttLeftPanel, type FlatRow } from "./GanttLeftPanel";
import { GanttTimeline } from "./GanttTimeline";
import { GanttItemDetailPanel } from "./GanttItemDetailPanel";
import { GanttImportDialog, type GanttImportResult } from "./GanttImportDialog";
import {
  createItem, deleteItem, listItems, logActivity, updateItem,
} from "@/lib/gantt/api";
import type { ColourBy, GanttItem, GanttItemType, ZoomLevel } from "@/lib/gantt/types";
import { addDays, computeRange, diffDays, today, toISO, ZOOM_PX_PER_DAY } from "@/lib/gantt/dates";
import { exportCsv, exportXlsx } from "@/lib/gantt/importExport";
import { computeCriticalPath, computeSectionProgress, computeOverallProgress } from "@/lib/gantt/critical";

interface Props {
  projectId: string;
  clientId: string;
  workspaceId: string;
  projectStart?: string | null;
  projectEnd?: string | null;
}

const ROW_H = 32;
const HEADER_H = 48;

export function GanttView({ projectId, clientId, workspaceId, projectStart, projectEnd }: Props) {
  const [items, setItems] = useState<GanttItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState<ZoomLevel>("week");
  const [showDeps, setShowDeps] = useState(true);
  const [critical, setCritical] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showWeekends, setShowWeekends] = useState(true);
  const [showBaseline, setShowBaseline] = useState(true);
  const [colourBy, setColourBy] = useState<ColourBy>("status");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [members, setMembers] = useState<Record<string, { full_name: string | null; email: string | null }>>({});
  const [tasks, setTasks] = useState<{ id: string; title: string }[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try { setItems(await listItems(projectId)); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { void reload(); }, [reload]);

  useEffect(() => {
    if (!workspaceId) return;
    (async () => {
      const { data: wm } = await (supabase as any).from("workspace_members")
        .select("user_id").eq("workspace_id", workspaceId).eq("status", "active").not("user_id", "is", null);
      const ids = (wm ?? []).map((r: any) => r.user_id);
      if (!ids.length) return;
      const { data: profs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", ids);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => { map[p.id] = { full_name: p.full_name, email: p.email }; });
      setMembers(map);
    })();
  }, [workspaceId]);

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      const { data } = await (supabase as any).from("tasks").select("id, title").eq("project_id", projectId).is("deleted_at", null);
      setTasks(data ?? []);
    })();
  }, [projectId]);

  const memberList = useMemo(
    () => Object.entries(members).map(([id, m]) => ({ id, full_name: m.full_name, email: m.email })),
    [members]
  );

  // Build flat hierarchy
  const flatRows = useMemo<FlatRow[]>(() => {
    const byParent: Record<string, GanttItem[]> = {};
    for (const it of items) {
      const k = it.parent_id ?? "_root";
      (byParent[k] ??= []).push(it);
    }
    Object.values(byParent).forEach((arr) => arr.sort((a, b) => a.position - b.position));
    const out: FlatRow[] = [];
    const walk = (parentId: string, depth: number, hideAll: boolean) => {
      const list = byParent[parentId] ?? [];
      for (const it of list) {
        if (!showCompleted && (it.is_complete || it.status === "complete" || it.progress >= 100)) continue;
        const has = (byParent[it.id]?.length ?? 0) > 0;
        if (!hideAll) out.push({ item: it, depth, hasChildren: has });
        walk(it.id, depth + 1, hideAll || it.is_collapsed);
      }
    };
    walk("_root", 0, false);
    return out;
  }, [items, showCompleted]);

  const range = useMemo(() => computeRange(
    items.flatMap((i) => [i.start_date, i.end_date]),
    projectStart, projectEnd
  ), [items, projectStart, projectEnd]);

  const cp = useMemo(() => computeCriticalPath(items), [items]);
  const sectionProgress = useMemo(() => computeSectionProgress(items), [items]);
  const overallProgress = useMemo(() => computeOverallProgress(items), [items]);
  const hasBaseline = useMemo(() => items.some((i) => i.baseline_start && i.baseline_end), [items]);

  const selected = items.find((i) => i.id === selectedId) ?? null;

  // ---- mutations ----
  const handleUpdate = async (id: string, patch: Partial<GanttItem>) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...patch } as GanttItem : i));
    try {
      await updateItem(id, patch);
      await logActivity(id, workspaceId, "updated", patch);
    } catch (e: any) { toast.error(e.message); reload(); }
  };

  const nextPosition = (parentId: string | null) => {
    const siblings = items.filter((i) => (i.parent_id ?? null) === parentId);
    return siblings.length ? Math.max(...siblings.map((s) => s.position)) + 1 : 0;
  };

  const handleCreate = async (type: GanttItemType, parentId: string | null = null, overrides: Partial<GanttItem> = {}) => {
    const t = today();
    const base: Partial<GanttItem> = {
      type, parent_id: parentId, title: defaultTitle(type),
      start_date: toISO(t), end_date: type === "milestone" ? null : toISO(addDays(t, 4)),
      progress: 0, status: "not_started", position: nextPosition(parentId),
      ...overrides,
    };
    try {
      const created = await createItem({ workspace_id: workspaceId, project_id: projectId, client_id: clientId, ...base });
      await logActivity(created.id, workspaceId, "created");
      await reload();
      setSelectedId(created.id);
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item and its sub-items?")) return;
    try { await deleteItem(id); setSelectedId((s) => s === id ? null : s); await reload(); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleAction = async (id: string, action: "edit"|"add_sub"|"add_below"|"indent"|"outdent"|"duplicate"|"delete") => {
    const it = items.find((x) => x.id === id); if (!it) return;
    switch (action) {
      case "edit": setSelectedId(id); break;
      case "add_sub": await handleCreate(it.type === "section" ? "task" : "sub_item", id); break;
      case "add_below": await handleCreate("task", it.parent_id); break;
      case "indent": {
        const sibs = items.filter((x) => (x.parent_id ?? null) === (it.parent_id ?? null)).sort((a, b) => a.position - b.position);
        const idx = sibs.findIndex((s) => s.id === id);
        if (idx > 0) await handleUpdate(id, { parent_id: sibs[idx - 1].id });
        break;
      }
      case "outdent": {
        if (!it.parent_id) return;
        const parent = items.find((x) => x.id === it.parent_id); if (!parent) return;
        await handleUpdate(id, { parent_id: parent.parent_id ?? null });
        break;
      }
      case "duplicate": {
        await handleCreate(it.type, it.parent_id, {
          title: it.title + " (copy)", start_date: it.start_date, end_date: it.end_date,
          progress: it.progress, status: it.status, colour: it.colour, assignee_id: it.assignee_id,
        });
        break;
      }
      case "delete": await handleDelete(id); break;
    }
  };

  const handleCreateDep = async (fromId: string, toId: string) => {
    const target = items.find((x) => x.id === toId); if (!target) return;
    const deps = target.dependencies ?? [];
    if (deps.some((d) => d.from === fromId)) return;
    await handleUpdate(toId, { dependencies: [...deps, { from: fromId, type: "FS" }] });
    toast.success("Dependency added");
  };

  // Toolbar actions
  const onJumpToday = () => {
    if (!timelineRef.current) return;
    const x = diffDays(range.start, today()) * ZOOM_PX_PER_DAY[zoom];
    timelineRef.current.scrollTo({ left: Math.max(0, x - 200), behavior: "smooth" });
  };
  const onJumpStart = () => timelineRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  const onFit = () => {
    if (!timelineRef.current) return;
    const w = timelineRef.current.clientWidth;
    const needed = w / range.days;
    const z: ZoomLevel = needed >= 30 ? "day" : needed >= 12 ? "week" : needed >= 4 ? "month" : "quarter";
    setZoom(z);
    setTimeout(() => timelineRef.current?.scrollTo({ left: 0 }), 50);
  };

  const handleSetBaseline = async () => {
    if (!items.length) { toast.error("Nothing to baseline yet"); return; }
    const msg = hasBaseline
      ? "Replace the existing baseline with current dates for all items?"
      : "Snapshot current start/end dates as the baseline for all items?";
    if (!confirm(msg)) return;
    const now = new Date().toISOString();
    const sb: any = supabase;
    try {
      // Per-row update so each item gets its own baseline
      for (const it of items) {
        await sb.from("gantt_items").update({
          baseline_start: it.start_date,
          baseline_end: it.end_date,
          baseline_set_at: now,
        }).eq("id", it.id);
      }
      toast.success("Baseline saved");
      await reload();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleImportConfirm = async (result: GanttImportResult) => {
    try {
      if (result.mode === "replace") {
        if (!confirm("This will delete all existing Gantt items. Continue?")) return;
        await (supabase as any).from("gantt_items").delete().eq("project_id", projectId);
      }

      const startPos = result.mode === "replace" ? 0 : nextPosition(null);

      // Pass 1: create sections and items keyed by import title for parent resolution
      const titleToId = new Map<string, string>();
      const created: { row: typeof result.rows[number]; id: string }[] = [];

      // Sort: sections first, then everything else (so parent sections exist)
      const sorted = [...result.rows].sort((a, b) => (a.type === "section" ? -1 : 1) - (b.type === "section" ? -1 : 1));

      for (let i = 0; i < sorted.length; i++) {
        const r = sorted[i];
        let parentId: string | null = null;
        const parentTitle = r.parentTitle || r.sectionTitle;
        if (parentTitle) parentId = titleToId.get(parentTitle.trim().toLowerCase()) ?? null;

        const c = await createItem({
          workspace_id: workspaceId, project_id: projectId, client_id: clientId,
          parent_id: parentId,
          type: r.type,
          title: r.title,
          description: r.description || null,
          start_date: r.startDate,
          end_date: r.type === "milestone" ? r.startDate : r.endDate,
          progress: r.progress,
          status: "not_started",
          colour: r.colour,
          assignee_id: r.assigneeId,
          position: startPos + i,
          dependencies: [],
        });
        titleToId.set(r.title.trim().toLowerCase(), c.id);
        created.push({ row: r, id: c.id });
      }

      // Pass 2: resolve dependencies (by title) and persist
      for (const { row, id } of created) {
        if (!row.dependencies.length) continue;
        const deps = row.dependencies
          .map((t) => titleToId.get(t.trim().toLowerCase()))
          .filter((x): x is string => !!x)
          .map((from) => ({ from, type: "FS" as const }));
        if (deps.length) await updateItem(id, { dependencies: deps });
      }

      const sections = result.rows.filter((r) => r.type === "section").length;
      const milestones = result.rows.filter((r) => r.type === "milestone").length;
      const tasksCount = result.rows.length - sections - milestones;
      toast.success(`Imported ${result.rows.length} items — ${sections} sections, ${tasksCount} tasks, ${milestones} milestones`);
      await reload();
    } catch (e: any) { toast.error(e.message); }
  };

  const onExportPdf = async () => {
    if (!wrapRef.current) return;
    toast.message("Generating PDF…");
    try {
      const canvas = await html2canvas(wrapRef.current, { scale: 1.5, backgroundColor: "#ffffff" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: [canvas.width * 0.5, canvas.height * 0.5] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width * 0.5, canvas.height * 0.5);
      pdf.save("gantt.pdf");
    } catch (e: any) { toast.error(e.message); }
  };

  const containerCls = fullscreen
    ? "fixed inset-0 z-50 bg-background flex flex-col"
    : "flex flex-col border rounded-lg bg-card";

  return (
    <div ref={wrapRef} className={containerCls}>
      <GanttToolbar
        zoom={zoom} setZoom={setZoom}
        showDeps={showDeps} setShowDeps={setShowDeps}
        critical={critical} setCritical={setCritical}
        showCompleted={showCompleted} setShowCompleted={setShowCompleted}
        showWeekends={showWeekends} setShowWeekends={setShowWeekends}
        showBaseline={showBaseline} setShowBaseline={setShowBaseline}
        colourBy={colourBy} setColourBy={setColourBy}
        onAddSection={() => handleCreate("section")}
        onAddMilestone={() => handleCreate("milestone")}
        onJumpToday={onJumpToday} onJumpStart={onJumpStart} onFit={onFit}
        onImport={() => setImportOpen(true)}
        onExportCsv={() => exportCsv(items, members)}
        onExportXlsx={() => exportXlsx(items, members)}
        onExportPdf={onExportPdf}
        onSetBaseline={handleSetBaseline}
        hasBaseline={hasBaseline}
        fullscreen={fullscreen}
        onToggleFullscreen={() => setFullscreen((v) => !v)}
        overallProgress={overallProgress}
        projectEndDate={cp.endDate ? toISO(cp.endDate) : null}
        criticalCount={cp.ids.size}
      />

      <div className="grid grid-cols-[minmax(420px,38%)_1fr] flex-1 min-h-[480px]">
        <div className="overflow-hidden flex flex-col" style={{ paddingTop: 0 }}>
          <div style={{ height: HEADER_H }} className="border-b bg-muted/30 flex items-end px-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Items</div>
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="p-6 text-sm text-muted-foreground">Loading Gantt…</div>
            ) : items.length === 0 ? (
              <EmptyState onAdd={() => handleCreate("section")} onAddTask={() => handleCreate("task")} onImport={() => setImportOpen(true)} />
            ) : (
              <GanttLeftPanel
                rows={flatRows}
                members={members}
                onOpen={setSelectedId}
                onUpdate={handleUpdate}
                onToggleCollapse={(id) => {
                  const it = items.find((x) => x.id === id); if (!it) return;
                  handleUpdate(id, { is_collapsed: !it.is_collapsed });
                }}
                onAction={handleAction}
                onAddItemAtEnd={(pid) => handleCreate("task", pid)}
                rowHeight={ROW_H}
                selectedId={selectedId}
                criticalIds={cp.ids}
                sectionProgress={sectionProgress}
                showVariance={showBaseline && hasBaseline}
                critical={critical}
              />
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full bg-muted/10" />
          ) : (
            <GanttTimeline
              rows={flatRows}
              zoom={zoom} showDeps={showDeps} critical={critical} showWeekends={showWeekends}
              showBaseline={showBaseline && hasBaseline}
              colourBy={colourBy}
              rangeStart={range.start} rangeDays={range.days}
              rowHeight={ROW_H} headerHeight={HEADER_H}
              onUpdate={handleUpdate} onOpen={setSelectedId} onCreateDep={handleCreateDep}
              selectedId={selectedId}
              scrollRef={timelineRef}
              criticalIds={cp.ids}
            />
          )}
        </div>
      </div>

      <GanttItemDetailPanel
        item={selected} members={members} allItems={items} tasksOfProject={tasks}
        open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}
        onChanged={reload} onDelete={handleDelete}
      />

      <GanttImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        hasExisting={items.length > 0}
        members={memberList}
        onConfirm={handleImportConfirm}
      />
    </div>
  );
}

function defaultTitle(t: GanttItemType): string {
  if (t === "section") return "New section";
  if (t === "milestone") return "New milestone";
  if (t === "sub_item") return "New sub-item";
  return "New task";
}

function EmptyState({ onAdd, onAddTask, onImport }: { onAdd: () => void; onAddTask: () => void; onImport: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-3">
      <div className="text-sm font-semibold">No Gantt items yet</div>
      <div className="text-xs text-muted-foreground max-w-xs">Build your project plan by adding sections to group work, tasks for individual items, and milestones for key dates — or import from CSV / Excel.</div>
      <div className="flex gap-2">
        <button className="px-3 py-1.5 rounded border text-xs hover:bg-muted" onClick={onAdd}>Add section</button>
        <button className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs" onClick={onAddTask}>Add task</button>
        <button className="px-3 py-1.5 rounded border text-xs hover:bg-muted" onClick={onImport}>Import</button>
      </div>
    </div>
  );
}
