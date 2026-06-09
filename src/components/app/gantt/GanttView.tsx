import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GanttToolbar } from "./GanttToolbar";
import { GanttLeftPanel, type FlatRow } from "./GanttLeftPanel";
import { GanttTimeline } from "./GanttTimeline";
import { GanttItemDetailPanel } from "./GanttItemDetailPanel";
import { GanttImportDialog, type GanttImportResult } from "./GanttImportDialog";
import { GanttPdfExportDialog } from "./GanttPdfExportDialog";
import { GanttTemplatesDialog } from "./GanttTemplatesDialog";
import {
  createItem, deleteItem, listItems, logActivity, updateItem,
} from "@/lib/gantt/api";
import type { ColourBy, GanttItem, GanttItemType, ZoomLevel } from "@/lib/gantt/types";
import { addDays, computeRange, diffDays, today, toDate, toISO, ZOOM_PX_PER_DAY } from "@/lib/gantt/dates";
import { exportCsv } from "@/lib/gantt/importExport";
import { exportXlsxFull } from "@/lib/gantt/excelExport";
import { exportGanttPdf } from "@/lib/gantt/pdfExport";
import { computeCriticalPath, computeSectionProgress, computeOverallProgress, isOverdue } from "@/lib/gantt/critical";
import { loadGanttPermissions, canEditItem, type GanttPermissions } from "@/lib/gantt/permissions";

interface Props {
  projectId: string;
  clientId: string;
  workspaceId: string;
  projectName?: string;
  clientName?: string;
  projectStart?: string | null;
  projectEnd?: string | null;
}

const ROW_H = 32;
const HEADER_H = 48;

export function GanttView({ projectId, clientId, workspaceId, projectName = "Project", clientName = "Client", projectStart, projectEnd }: Props) {
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
  const [pdfOpen, setPdfOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [templatesMode, setTemplatesMode] = useState<"apply" | "save">("apply");
  const [members, setMembers] = useState<Record<string, { full_name: string | null; email: string | null }>>({});
  const [tasks, setTasks] = useState<{ id: string; title: string }[]>([]);
  const [meetings, setMeetings] = useState<{ id: string; title: string; meeting_date: string | null }[]>([]);
  const [perms, setPerms] = useState<GanttPermissions | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const notifiedRef = useRef(false);

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
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
      setPerms(await loadGanttPermissions(workspaceId));
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
      const [{ data: t }, { data: m }] = await Promise.all([
        (supabase as any).from("tasks").select("id, title").eq("project_id", projectId).is("deleted_at", null),
        (supabase as any).from("meetings").select("id, title, meeting_date").eq("project_id", projectId),
      ]);
      setTasks(t ?? []);
      setMeetings(m ?? []);
    })();
  }, [projectId]);

  // ---- In-app notifications for due-soon / overdue (runs once per session per project) ----
  useEffect(() => {
    if (notifiedRef.current || !items.length || !workspaceId) return;
    notifiedRef.current = true;
    (async () => {
      const sb: any = supabase;
      const td = today();
      const toNotify: Array<{ user_id: string; type: string; title: string; body: string; entity_id: string; field: "due_reminder_3d_sent_at" | "due_reminder_1d_sent_at" | "due_reminder_0d_sent_at" | "overdue_notified_at" }> = [];
      for (const it of items) {
        if (it.type === "section" || !it.assignee_id) continue;
        const e = toDate(it.end_date) ?? toDate(it.start_date);
        if (!e) continue;
        const days = diffDays(td, e);
        const done = it.progress >= 100 || it.is_complete;
        if (done) continue;
        if (days === 3 && !it.due_reminder_3d_sent_at) toNotify.push({ user_id: it.assignee_id, type: "gantt_due_3d", title: `Due in 3 days: ${it.title}`, body: `${projectName} · ${clientName}`, entity_id: it.id, field: "due_reminder_3d_sent_at" });
        else if (days === 1 && !it.due_reminder_1d_sent_at) toNotify.push({ user_id: it.assignee_id, type: "gantt_due_1d", title: `Due tomorrow: ${it.title}`, body: `${projectName} · ${clientName}`, entity_id: it.id, field: "due_reminder_1d_sent_at" });
        else if (days === 0 && !it.due_reminder_0d_sent_at) toNotify.push({ user_id: it.assignee_id, type: "gantt_due_0d", title: `Due today: ${it.title}`, body: `${projectName} · ${clientName}`, entity_id: it.id, field: "due_reminder_0d_sent_at" });
        else if (days < 0 && !it.overdue_notified_at) toNotify.push({ user_id: it.assignee_id, type: "gantt_overdue", title: `Overdue: ${it.title}`, body: `${projectName} · ${clientName}`, entity_id: it.id, field: "overdue_notified_at" });
      }
      for (const n of toNotify) {
        try {
          await sb.from("notifications").insert({
            user_id: n.user_id, workspace_id: workspaceId, type: n.type,
            title: n.title, body: n.body, entity_type: "gantt_item", entity_id: n.entity_id,
            link_url: `/app/clients/${clientId}/projects/${projectId}`,
          });
          await sb.from("gantt_items").update({ [n.field]: new Date().toISOString() }).eq("id", n.entity_id);
        } catch { /* silent */ }
      }
    })();
  }, [items, workspaceId, projectName, clientName, clientId, projectId]);

  const memberList = useMemo(
    () => Object.entries(members).map(([id, m]) => ({ id, full_name: m.full_name, email: m.email })),
    [members]
  );

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

  const handleUpdate = async (id: string, patch: Partial<GanttItem>) => {
    if (perms) {
      const it = items.find((x) => x.id === id);
      if (it && !canEditItem(perms, it.assignee_id, currentUserId)) {
        // Allow progress-only edits on assigned items already handled; block others
        const onlyProgress = Object.keys(patch).every((k) => k === "progress");
        if (!onlyProgress) { toast.error("You don't have permission to edit this item"); return; }
      }
    }
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
    if (perms && !perms.canCreate) { toast.error("You don't have permission to add items"); return; }
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
    const it = items.find((x) => x.id === id);
    if (perms && it?.type === "section" && !perms.canDeleteStructure) { toast.error("Only admins can delete sections"); return; }
    if (perms && !perms.canEditAnyItem && !(perms.canEditOwnItem && it?.assignee_id === currentUserId)) { toast.error("You don't have permission to delete this item"); return; }
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
    if (perms && !perms.canSetBaseline) { toast.error("Only admins can set baselines"); return; }
    const msg = hasBaseline
      ? "Replace the existing baseline with current dates for all items?"
      : "Snapshot current start/end dates as the baseline for all items?";
    if (!confirm(msg)) return;
    const now = new Date().toISOString();
    const sb: any = supabase;
    try {
      for (const it of items) {
        await sb.from("gantt_items").update({
          baseline_start: it.start_date, baseline_end: it.end_date, baseline_set_at: now,
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
      const titleToId = new Map<string, string>();
      const created: { row: typeof result.rows[number]; id: string }[] = [];
      const sorted = [...result.rows].sort((a, b) => (a.type === "section" ? -1 : 1) - (b.type === "section" ? -1 : 1));
      for (let i = 0; i < sorted.length; i++) {
        const r = sorted[i];
        let parentId: string | null = null;
        const parentTitle = r.parentTitle || r.sectionTitle;
        if (parentTitle) parentId = titleToId.get(parentTitle.trim().toLowerCase()) ?? null;
        const c = await createItem({
          workspace_id: workspaceId, project_id: projectId, client_id: clientId,
          parent_id: parentId, type: r.type, title: r.title, description: r.description || null,
          start_date: r.startDate, end_date: r.type === "milestone" ? r.startDate : r.endDate,
          progress: r.progress, status: "not_started", colour: r.colour, assignee_id: r.assigneeId,
          position: startPos + i, dependencies: [],
        });
        titleToId.set(r.title.trim().toLowerCase(), c.id);
        created.push({ row: r, id: c.id });
      }
      for (const { row, id } of created) {
        if (!row.dependencies.length) continue;
        const deps = row.dependencies.map((t) => titleToId.get(t.trim().toLowerCase())).filter((x): x is string => !!x).map((from) => ({ from, type: "FS" as const }));
        if (deps.length) await updateItem(id, { dependencies: deps });
      }
      const sections = result.rows.filter((r) => r.type === "section").length;
      const milestones = result.rows.filter((r) => r.type === "milestone").length;
      const tasksCount = result.rows.length - sections - milestones;
      toast.success(`Imported ${result.rows.length} items — ${sections} sections, ${tasksCount} tasks, ${milestones} milestones`);
      await reload();
    } catch (e: any) { toast.error(e.message); }
  };

  const onExportPdfConfirm = async (opts: import("@/lib/gantt/pdfExport").PdfExportOptions) => {
    toast.message("Generating PDF…");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const me = user?.id ? members[user.id] : null;
      await exportGanttPdf({
        items, members, projectName, clientName,
        projectStart: projectStart ?? (range.start ? toISO(range.start) : null),
        projectEnd: projectEnd ?? (cp.endDate ? toISO(cp.endDate) : null),
        preparedBy: me?.full_name || me?.email || "—",
        logoUrl: "/images/email-logo.png",
      }, opts);
    } catch (e: any) { toast.error(e.message); }
  };

  const onExportXlsx = () => {
    exportXlsxFull({
      items, members, projectName, clientName,
      projectStart: projectStart ?? (range.start ? toISO(range.start) : null),
      projectEnd: cp.endDate ? toISO(cp.endDate) : projectEnd ?? null,
    }, `${projectName.replace(/\W+/g, "-")}-gantt.xlsx`);
  };

  const onOpenTemplates = (mode: "apply" | "save") => { setTemplatesMode(mode); setTemplatesOpen(true); };

  const containerCls = fullscreen
    ? "fixed inset-0 z-50 bg-background flex flex-col"
    : "flex flex-col border rounded-lg bg-card";

  const safePerms = perms ?? {
    role: "viewer" as const, canCreate: false, canDeleteStructure: false, canEditAnyItem: false,
    canEditOwnItem: false, canSetBaseline: false, canManageTemplates: false, canExport: false, canImport: false,
  };

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
        onExportXlsx={onExportXlsx}
        onExportPdf={() => setPdfOpen(true)}
        onSetBaseline={handleSetBaseline}
        onOpenTemplates={onOpenTemplates}
        hasBaseline={hasBaseline}
        fullscreen={fullscreen}
        onToggleFullscreen={() => setFullscreen((v) => !v)}
        overallProgress={overallProgress}
        projectEndDate={cp.endDate ? toISO(cp.endDate) : null}
        criticalCount={cp.ids.size}
        perms={safePerms}
      />

      <div className="grid grid-cols-[minmax(420px,38%)_1fr] flex-1 min-h-[480px]">
        <div className="overflow-hidden flex flex-col" style={{ paddingTop: 0 }}>
          <div style={{ height: HEADER_H }} className="border-b bg-muted/30 flex items-end px-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Items</div>
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="p-6 text-sm text-muted-foreground">Loading Gantt…</div>
            ) : items.length === 0 ? (
              <EmptyState
                onAdd={() => handleCreate("section")}
                onAddTask={() => handleCreate("task")}
                onImport={() => setImportOpen(true)}
                onTemplate={() => onOpenTemplates("apply")}
                canCreate={safePerms.canCreate}
                canImport={safePerms.canImport}
                canTemplates={safePerms.canManageTemplates}
              />
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
        item={selected} members={members} allItems={items} tasksOfProject={tasks} meetingsOfProject={meetings}
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

      <GanttPdfExportDialog
        open={pdfOpen}
        onOpenChange={setPdfOpen}
        onConfirm={onExportPdfConfirm}
        defaultStart={range.start ? toISO(range.start) : null}
        defaultEnd={cp.endDate ? toISO(cp.endDate) : null}
      />

      <GanttTemplatesDialog
        open={templatesOpen}
        onOpenChange={setTemplatesOpen}
        workspaceId={workspaceId}
        projectId={projectId}
        clientId={clientId}
        currentItems={items}
        hasExisting={items.length > 0}
        mode={templatesMode}
        onApplied={reload}
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

function EmptyState({ onAdd, onAddTask, onImport, onTemplate, canCreate, canImport, canTemplates }: { onAdd: () => void; onAddTask: () => void; onImport: () => void; onTemplate: () => void; canCreate: boolean; canImport: boolean; canTemplates: boolean }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-3">
      <div className="text-sm font-semibold">No Gantt items yet</div>
      <div className="text-xs text-muted-foreground max-w-xs">Build your project plan by adding sections, tasks, and milestones — or start from a template, or import from a file.</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {canTemplates && <button onClick={onTemplate} className="px-3 py-1.5 text-xs rounded border bg-primary text-primary-foreground">Start from template</button>}
        {canCreate && <button onClick={onAdd} className="px-3 py-1.5 text-xs rounded border">Add section</button>}
        {canCreate && <button onClick={onAddTask} className="px-3 py-1.5 text-xs rounded border">Add task</button>}
        {canImport && <button onClick={onImport} className="px-3 py-1.5 text-xs rounded border">Import…</button>}
      </div>
    </div>
  );
}
