import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { PRIORITY_CLASS, clientColor, initials, isOverdue, parseDateOnly } from "./taskUtils";
import { TaskActionsMenu, type TaskActionTarget } from "./tasks/TaskActionsMenu";
import { BulkActionBar } from "./tasks/BulkActionBar";
import { DeleteTaskDialog } from "./tasks/DeleteTaskDialog";
import { onTasksChanged, setTaskStatus, softDeleteTasks } from "./tasks/taskMutations";
import { toast } from "sonner";
import {
  ColumnHeader, useTableFilters, TextFilter, MultiSelectFilter, DateRangeFilter,
  ResizableTh, useColumnWidths,
} from "@/components/app/columns";
import { FollowUpBadge, FOLLOW_UP_STATUS_OPTIONS, type FollowUpStatus } from "@/components/app/tasks/FollowUpBadge";

const TASK_COL_DEFAULTS = {
  title: 280, client: 160, project: 160, status: 140, priority: 110, due: 130, assignees: 140, followup: 130,
};

interface Row {
  id: string; title: string; status_id: string | null; priority: string;
  due_date: string | null; client_id: string; project_id: string | null;
  completed_at: string | null; meeting_id: string | null;
  comment_count?: number;
}

interface Props {
  clientId?: string;
  projectId?: string;
  filters?: { status?: string; priority?: string; assignee?: string; clientFilter?: string; projectFilter?: string; tag?: string };
  reloadKey?: number;
  onOpenTask: (id: string) => void;
}

const PRIORITY_ORDER: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

export function TaskTable({ clientId, projectId, filters, reloadKey, onOpenTask }: Props) {
  const { workspaceId } = useWorkspace();
  const [rows, setRows] = useState<Row[]>([]);
  const [clients, setClients] = useState<Record<string, { id: string; name: string }>>({});
  const [projects, setProjects] = useState<Record<string, { id: string; name: string }>>({});
  const [statuses, setStatuses] = useState<Record<string, { id: string; name: string; color: string | null; category: string }>>({});
  const [assigneesByTask, setAssigneesByTask] = useState<Record<string, string[]>>({});
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [followUps, setFollowUps] = useState<Record<string, FollowUpStatus>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmRow, setConfirmRow] = useState<Row | null>(null);
  const tf = useTableFilters<"title" | "client" | "project" | "status" | "priority" | "due" | "assignees" | "followup">({
    defaultSort: { key: "due", dir: "asc" },
  });

  const [tagsByTask, setTagsByTask] = useState<Record<string, string[]>>({});
  const load = useCallback(async () => {
    if (!workspaceId) return;
    let q = (supabase as any).from("tasks")
      .select("id, title, status_id, priority, due_date, client_id, project_id, completed_at, meeting_id, comment_count")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null);
    if (clientId) q = q.eq("client_id", clientId);
    if (projectId) q = q.eq("project_id", projectId);
    const tRes = await q;
    const trows: Row[] = tRes.data ?? [];
    setRows(trows);

    const [cs, ps, ss] = await Promise.all([
      (supabase as any).from("clients").select("id, name").eq("workspace_id", workspaceId),
      (supabase as any).from("projects").select("id, name").eq("workspace_id", workspaceId),
      (supabase as any).from("task_statuses").select("id, name, color, category").eq("workspace_id", workspaceId),
    ]);
    const cm: any = {}; (cs.data ?? []).forEach((c: any) => cm[c.id] = c); setClients(cm);
    const pm: any = {}; (ps.data ?? []).forEach((p: any) => pm[p.id] = p); setProjects(pm);
    const sm: any = {}; (ss.data ?? []).forEach((s: any) => sm[s.id] = s); setStatuses(sm);

    if (trows.length) {
      const [asRes, tgRes] = await Promise.all([
        (supabase as any).from("task_assignees").select("task_id, user_id").in("task_id", trows.map((t) => t.id)),
        (supabase as any).from("taggings").select("tag_id, taggable_id").eq("taggable_type", "task").in("taggable_id", trows.map((t) => t.id)),
      ]);
      const g: Record<string, string[]> = {};
      (asRes.data ?? []).forEach((r: any) => { (g[r.task_id] = g[r.task_id] ?? []).push(r.user_id); });
      setAssigneesByTask(g);
      const tg: Record<string, string[]> = {};
      (tgRes.data ?? []).forEach((r: any) => { (tg[r.taggable_id] = tg[r.taggable_id] ?? []).push(r.tag_id); });
      setTagsByTask(tg);
      const uids = Array.from(new Set((asRes.data ?? []).map((r: any) => r.user_id)));
      if (uids.length) {
        const { data: prs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", uids);
        const m: any = {}; (prs ?? []).forEach((p: any) => m[p.id] = p); setProfiles(m);
      }
    } else { setTagsByTask({}); }
  }, [workspaceId, clientId, projectId]);

  useEffect(() => { load(); }, [load, reloadKey]);
  useEffect(() => onTasksChanged(() => load()), [load]);

  const baseFiltered = useMemo(() => {
    return rows.filter((t) => {
      if (filters?.status && t.status_id !== filters.status) return false;
      if (filters?.priority && t.priority !== filters.priority) return false;
      if (filters?.clientFilter && t.client_id !== filters.clientFilter) return false;
      if (filters?.projectFilter && t.project_id !== filters.projectFilter) return false;
      if (filters?.assignee && !(assigneesByTask[t.id] ?? []).includes(filters.assignee)) return false;
      if (filters?.tag && !(tagsByTask[t.id] ?? []).includes(filters.tag)) return false;
      return true;
    });
  }, [rows, filters, assigneesByTask, tagsByTask]);

  const filtered = useMemo(() => tf.apply(baseFiltered, {
    title: { filterValue: (t) => t.title, sortValue: (t) => t.title.toLowerCase() },
    client: { filterValue: (t) => t.client_id, sortValue: (t) => (clients[t.client_id]?.name ?? "").toLowerCase() },
    project: { filterValue: (t) => t.project_id ?? "", sortValue: (t) => (t.project_id ? projects[t.project_id]?.name ?? "" : "") },
    status: { filterValue: (t) => t.status_id ?? "", sortValue: (t) => (t.status_id ? statuses[t.status_id]?.name ?? "" : "") },
    priority: {
      filterValue: (t) => t.priority,
      sortValue: (t) => PRIORITY_ORDER[t.priority] ?? 99,
    },
    due: {
      filterValue: (t) => (t.due_date ? new Date(t.due_date) : null),
      sortValue: (t) => (t.due_date ? new Date(t.due_date).getTime() : null),
    },
    assignees: { filterValue: (t) => assigneesByTask[t.id] ?? [] },
    followup: {
      filterValue: (t) => followUps[t.id] ?? "not_started",
      sortValue: (t) => followUps[t.id] ?? "not_started",
    },
  }), [baseFiltered, tf.state, clients, projects, statuses, assigneesByTask, followUps]);

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((r) => r.id));
  const toggleOne = (id: string) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const onKey = async (e: React.KeyboardEvent, row: Row) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (["input", "textarea"].includes(tag) || (e.target as HTMLElement).isContentEditable) return;
    if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); setConfirmRow(row); }
    else if (e.key === "Enter") { e.preventDefault(); onOpenTask(row.id); }
    else if (e.key === " ") {
      e.preventDefault();
      const cat = row.status_id ? statuses[row.status_id]?.category : null;
      await setTaskStatus(row.id, workspaceId!, cat === "done" ? "todo" : "done");
    }
  };

  const distinctClients = useMemo(() => Array.from(new Set(rows.map((r) => r.client_id))).map((id) => ({ value: id, label: clients[id]?.name ?? id })), [rows, clients]);
  const distinctProjects = useMemo(() => Array.from(new Set(rows.map((r) => r.project_id).filter(Boolean) as string[])).map((id) => ({ value: id, label: projects[id]?.name ?? id })), [rows, projects]);
  const distinctStatuses = useMemo(() => Array.from(new Set(rows.map((r) => r.status_id).filter(Boolean) as string[])).map((id) => ({ value: id, label: statuses[id]?.name ?? id })), [rows, statuses]);
  const distinctAssignees = useMemo(() => {
    const set = new Set<string>();
    Object.values(assigneesByTask).forEach((arr) => arr.forEach((u) => set.add(u)));
    return Array.from(set).map((id) => ({ value: id, label: profiles[id]?.full_name ?? profiles[id]?.email ?? id }));
  }, [assigneesByTask, profiles]);

  const { widths, setWidth } = useColumnWidths("vitalis.tasks.colWidths.v1", TASK_COL_DEFAULTS);

  return (
    <>
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="px-3 py-2 w-8"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" /></th>
            <ResizableTh columnKey="title" width={widths.title} onResize={setWidth} className="px-3 py-2 font-medium text-left">
              <ColumnHeader label="Title" columnKey="title" sort={tf.sort} onToggleSort={tf.toggleSort}
                filterValue={tf.filters.title} onFilterChange={tf.setFilter}
                renderFilter={(v, oc) => <TextFilter value={v} onChange={oc} placeholder="Filter title…" />} />
            </ResizableTh>
            <ResizableTh columnKey="client" width={widths.client} onResize={setWidth} className="px-3 py-2 font-medium text-left">
              <ColumnHeader label="Client" columnKey="client" sort={tf.sort} onToggleSort={tf.toggleSort}
                filterValue={tf.filters.client} onFilterChange={tf.setFilter}
                renderFilter={(v, oc) => <MultiSelectFilter value={v} onChange={oc} options={distinctClients} />} />
            </ResizableTh>
            <ResizableTh columnKey="project" width={widths.project} onResize={setWidth} className="px-3 py-2 font-medium text-left">
              <ColumnHeader label="Project" columnKey="project" sort={tf.sort} onToggleSort={tf.toggleSort}
                filterValue={tf.filters.project} onFilterChange={tf.setFilter}
                renderFilter={(v, oc) => <MultiSelectFilter value={v} onChange={oc} options={distinctProjects} />} />
            </ResizableTh>
            <ResizableTh columnKey="status" width={widths.status} onResize={setWidth} className="px-3 py-2 font-medium text-left">
              <ColumnHeader label="Status" columnKey="status" sort={tf.sort} onToggleSort={tf.toggleSort}
                filterValue={tf.filters.status} onFilterChange={tf.setFilter}
                renderFilter={(v, oc) => <MultiSelectFilter value={v} onChange={oc} options={distinctStatuses} />} />
            </ResizableTh>
            <ResizableTh columnKey="priority" width={widths.priority} onResize={setWidth} className="px-3 py-2 font-medium text-left">
              <ColumnHeader label="Priority" columnKey="priority" sort={tf.sort} onToggleSort={tf.toggleSort}
                filterValue={tf.filters.priority} onFilterChange={tf.setFilter}
                renderFilter={(v, oc) => <MultiSelectFilter value={v} onChange={oc}
                  options={["Urgent", "High", "Medium", "Low"].map((p) => ({ value: p, label: p }))} />} />
            </ResizableTh>
            <ResizableTh columnKey="due" width={widths.due} onResize={setWidth} className="px-3 py-2 font-medium text-left">
              <ColumnHeader label="Due" columnKey="due" sort={tf.sort} onToggleSort={tf.toggleSort}
                filterValue={tf.filters.due} onFilterChange={tf.setFilter}
                renderFilter={(v, oc) => <DateRangeFilter value={v} onChange={oc} />} />
            </ResizableTh>
            <ResizableTh columnKey="assignees" width={widths.assignees} onResize={setWidth} className="px-3 py-2 font-medium text-left">
              <ColumnHeader label="Assignees" columnKey="assignees" sort={tf.sort} sortable={false} onToggleSort={tf.toggleSort}
                filterValue={tf.filters.assignees} onFilterChange={tf.setFilter}
                renderFilter={(v, oc) => <MultiSelectFilter value={v} onChange={oc} options={distinctAssignees} />} />
            </ResizableTh>
            <ResizableTh columnKey="followup" width={widths.followup} onResize={setWidth} className="px-3 py-2 font-medium text-left">
              <ColumnHeader label="Follow Up" columnKey="followup" sort={tf.sort} onToggleSort={tf.toggleSort}
                filterValue={tf.filters.followup} onFilterChange={tf.setFilter}
                renderFilter={(v, oc) => <MultiSelectFilter value={v} onChange={oc} options={FOLLOW_UP_STATUS_OPTIONS} />} />
            </ResizableTh>
            <th className="px-3 py-2 w-8" />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={10} className="px-3 py-6 text-center text-muted-foreground">No tasks.</td></tr>
          )}
          {filtered.map((t) => {
            const c = clients[t.client_id];
            const p = t.project_id ? projects[t.project_id] : null;
            const s = t.status_id ? statuses[t.status_id] : null;
            const overdue = isOverdue(t.due_date, t.completed_at);
            const aids = assigneesByTask[t.id] ?? [];
            const target: TaskActionTarget = {
              id: t.id, workspaceId: workspaceId!, meetingId: t.meeting_id,
              assigneeIds: aids, dueDate: t.due_date,
            };
            return (
              <tr
                key={t.id}
                tabIndex={0}
                onKeyDown={(e) => onKey(e, t)}
                onClick={() => onOpenTask(t.id)}
                className="border-t border-border hover:bg-muted/40 cursor-pointer focus:outline-none focus:bg-muted/40"
              >
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selected.includes(t.id)} onCheckedChange={() => toggleOne(t.id)} aria-label="Select task" />
                </td>
                <td className="px-3 py-2 font-medium whitespace-normal break-words">
                  <span>{t.title}</span>
                  {!!t.comment_count && (
                    <span className="ml-2 text-[11px] text-muted-foreground">💬 {t.comment_count}</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-normal break-words">{c && <Badge variant="outline" className={`${clientColor(c.id)} border-transparent`}>{c.name}</Badge>}</td>
                <td className="px-3 py-2 text-muted-foreground whitespace-normal break-words">{p?.name ?? "—"}</td>
                <td className="px-3 py-2 whitespace-normal break-words">
                  {s ? (
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{ background: s.color ?? "#94a3b8" }} />
                      {s.name}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-3 py-2 whitespace-normal break-words"><Badge variant="outline" className={PRIORITY_CLASS[t.priority] ?? ""}>{t.priority}</Badge></td>
                <td className={`px-3 py-2 whitespace-normal break-words ${overdue ? "text-red-600 font-medium" : ""}`}>{t.due_date ? format(parseDateOnly(t.due_date)!, "MMM d, yyyy") : "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex -space-x-1.5">
                    {aids.slice(0, 3).map((uid) => {
                      const pr = profiles[uid];
                      return (
                        <Avatar key={uid} className="h-6 w-6 border border-background">
                          <AvatarFallback className="text-[10px]">{initials(pr?.full_name ?? pr?.email)}</AvatarFallback>
                        </Avatar>
                      );
                    })}
                  </div>
                </td>
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <TaskActionsMenu task={target} onEdit={onOpenTask} onDeleted={() => setRows((prev) => prev.filter((r) => r.id !== t.id))} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <BulkActionBar workspaceId={workspaceId!} selected={selected} onClear={() => setSelected([])} />
    <DeleteTaskDialog
      open={!!confirmRow}
      onOpenChange={(o) => !o && setConfirmRow(null)}
      count={1}
      fromMeeting={!!confirmRow?.meeting_id}
      onConfirm={async () => {
        if (!confirmRow) return;
        const ok = await softDeleteTasks([confirmRow.id]);
        if (ok) { toast.success("Task deleted"); setRows((p) => p.filter((r) => r.id !== confirmRow.id)); }
        setConfirmRow(null);
      }}
    />
    </>
  );
}
