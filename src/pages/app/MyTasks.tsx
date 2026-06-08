import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { ListTodo, Play } from "lucide-react";
import { TaskActionsMenu, type TaskActionTarget } from "@/components/app/tasks/TaskActionsMenu";
import { BulkActionBar } from "@/components/app/tasks/BulkActionBar";
import { DeleteTaskDialog } from "@/components/app/tasks/DeleteTaskDialog";
import { useTimer } from "@/contexts/TimerContext";
import { TaskDetailPanel } from "@/components/app/TaskDetailPanel";
import { PRIORITY_CLASS, clientColor, isOverdue, isApproachingDue, parseDateOnly } from "@/components/app/taskUtils";
import { softDeleteTasks, setTaskStatus, onTasksChanged } from "@/components/app/tasks/taskMutations";
import { toast } from "sonner";
import { markMyTasksVisited } from "@/hooks/useMyTasksBadge";
import {
  ColumnHeader, useTableFilters, TextFilter, MultiSelectFilter, DateRangeFilter,
  ResizableTh, useColumnWidths,
} from "@/components/app/columns";

interface Row {
  id: string;
  title: string;
  status_id: string | null;
  priority: string;
  due_date: string | null;
  client_id: string;
  project_id: string | null;
  completed_at: string | null;
  meeting_id: string | null;
  comment_count?: number;
}

interface StatusRow { id: string; name: string; color: string | null; category: string }
interface ClientLite { id: string; name: string }
interface ProjectLite { id: string; name: string }

export default function MyTasks() {
  const { workspaceId, userId } = useWorkspace();
  const [rows, setRows] = useState<Row[]>([]);
  const [statuses, setStatuses] = useState<Record<string, StatusRow>>({});
  const [clients, setClients] = useState<Record<string, ClientLite>>({});
  const [projects, setProjects] = useState<Record<string, ProjectLite>>({});
  const [extractedTaskIds, setExtractedTaskIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [confirmRow, setConfirmRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const { running, startTimer, stopTimer } = useTimer();

  const MY_TASKS_COL_DEFAULTS = {
    title: 280, client: 128, project: 112, status: 112, priority: 96, source: 96, due: 112, assignee: 96,
  };
  const { widths, setWidth } = useColumnWidths("vitalis.mytasks.colWidths.v1", MY_TASKS_COL_DEFAULTS);

  useEffect(() => { markMyTasksVisited(userId); }, [userId]);

  const startTimerForTask = useCallback(async (row: Row) => {
    if (!workspaceId) return;
    const begin = async () => {
      const { data: pref } = await (supabase as any)
        .from("time_tracking_settings").select("default_activity_type_id")
        .eq("user_id", userId).eq("workspace_id", workspaceId).maybeSingle();
      let actId = pref?.default_activity_type_id ?? null;
      if (!actId) {
        const { data: def } = await (supabase as any)
          .from("time_activity_types").select("id")
          .eq("workspace_id", workspaceId).eq("is_default", true).maybeSingle();
        actId = def?.id;
      }
      if (!actId) {
        const { data: any1 } = await (supabase as any)
          .from("time_activity_types").select("id")
          .eq("workspace_id", workspaceId).eq("is_active", true).order("position").limit(1).maybeSingle();
        actId = any1?.id;
      }
      if (!actId) { toast.error("No activity types configured"); return; }
      await startTimer({
        client_id: row.client_id,
        project_id: row.project_id,
        task_id: row.id,
        activity_type_id: actId,
        description: row.title,
      });
    };
    if (running) {
      const ok = window.confirm(`You have a timer running for "${running.activity_name ?? "current task"}". Stop it and start a new one?`);
      if (!ok) return;
      await stopTimer();
      await begin();
    } else {
      await begin();
    }
  }, [workspaceId, userId, running, startTimer, stopTimer]);


  const load = useCallback(async () => {
    if (!workspaceId || !userId) return;
    setLoading(true);
    const { data: assigned } = await (supabase as any)
      .from("task_assignees").select("task_id").eq("user_id", userId);
    const ids: string[] = (assigned ?? []).map((r: any) => r.task_id);
    if (!ids.length) {
      setRows([]); setSelected([]); setLoading(false);
      // still load statuses for safety
      const { data: ss } = await (supabase as any)
        .from("task_statuses").select("id, name, color, category").eq("workspace_id", workspaceId);
      const sm: Record<string, StatusRow> = {};
      (ss ?? []).forEach((s: any) => sm[s.id] = s);
      setStatuses(sm);
      return;
    }

    const [tRes, sRes] = await Promise.all([
      (supabase as any).from("tasks")
        .select("id, title, status_id, priority, due_date, client_id, project_id, completed_at, meeting_id, comment_count, deleted_at")
        .in("id", ids)
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null),
      (supabase as any).from("task_statuses")
        .select("id, name, color, category").eq("workspace_id", workspaceId),
    ]);
    const sm: Record<string, StatusRow> = {};
    (sRes.data ?? []).forEach((s: any) => sm[s.id] = s);
    setStatuses(sm);

    const all: Row[] = tRes.data ?? [];
    const clientIds = Array.from(new Set(all.map((t) => t.client_id)));
    if (clientIds.length) {
      const { data: cs } = await (supabase as any).from("clients").select("id, name").in("id", clientIds);
      const cm: Record<string, ClientLite> = {};
      (cs ?? []).forEach((c: any) => cm[c.id] = c);
      setClients(cm);
    } else setClients({});

    const projectIds = Array.from(new Set(all.map((t) => t.project_id).filter(Boolean) as string[]));
    if (projectIds.length) {
      const { data: ps } = await (supabase as any).from("projects").select("id, name").in("id", projectIds);
      const pm: Record<string, ProjectLite> = {};
      (ps ?? []).forEach((p: any) => pm[p.id] = p);
      setProjects(pm);
    } else setProjects({});

    setRows(all);

    // Identify which of these tasks were created via email extraction
    if (all.length) {
      const { data: ext } = await (supabase as any)
        .from("email_task_extractions")
        .select("task_id")
        .in("task_id", all.map((t) => t.id));
      setExtractedTaskIds(new Set((ext ?? []).map((r: any) => r.task_id)));
    } else {
      setExtractedTaskIds(new Set());
    }

    setLoading(false);
    markMyTasksVisited(userId);
  }, [workspaceId, userId]);

  useEffect(() => { load(); }, [load]);

  // Realtime: subscribe to task_assignees for this user and tasks generally
  useEffect(() => {
    if (!userId || !workspaceId) return;
    const ch = supabase
      .channel(`my-tasks-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => { load(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "task_assignees", filter: `user_id=eq.${userId}` }, () => { load(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, workspaceId, load]);

  // Cross-component task mutations
  useEffect(() => onTasksChanged(() => load()), [load]);

  const tf = useTableFilters<"title" | "client" | "project" | "status" | "priority" | "due" | "assignee">({
    defaultSort: { key: "due", dir: "asc" },
  });

  const projectLabel = (pid: string | null) => pid ? (projects[pid]?.name ?? pid.slice(0, 8)) : "";
  const distinctProjectIds = useMemo(
    () => Array.from(new Set(rows.map((r) => r.project_id).filter(Boolean) as string[])),
    [rows],
  );

  const baseFiltered = useMemo(() => {
    return rows.filter((t) => {
      const cat = t.status_id ? statuses[t.status_id]?.category : null;
      const overdue = isOverdue(t.due_date, t.completed_at);
      if (!showCompleted) {
        if (cat === "done" || cat === "cancelled") {
          return overdue;
        }
      }
      return true;
    });
  }, [rows, statuses, showCompleted]);

  const filtered = useMemo(() => tf.apply(baseFiltered, {
    title: { filterValue: (r) => r.title, sortValue: (r) => r.title.toLowerCase() },
    client: {
      filterValue: (r) => r.client_id,
      sortValue: (r) => (clients[r.client_id]?.name ?? "").toLowerCase(),
    },
    project: {
      filterValue: (r) => r.project_id ?? "",
      sortValue: (r) => r.project_id ?? "",
    },
    status: {
      filterValue: (r) => r.status_id ?? "",
      sortValue: (r) => (r.status_id ? statuses[r.status_id]?.name ?? "" : ""),
    },
    priority: { filterValue: (r) => r.priority, sortValue: (r) => r.priority },
    due: {
      filterValue: (r) => (r.due_date ? new Date(r.due_date) : null),
      sortValue: (r) => (r.due_date ? new Date(r.due_date).getTime() : null),
    },
    assignee: {
      filterValue: () => (userId ? [userId] : []),
      sortValue: () => userId ?? "",
    },
  }), [baseFiltered, tf.state, clients, statuses, userId]);

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((r) => r.id));
  const toggleOne = (id: string) =>
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleRowKey = async (e: React.KeyboardEvent, row: Row) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (["input", "textarea"].includes(tag) || (e.target as HTMLElement).isContentEditable) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      setConfirmRow(row);
    } else if (e.key === "Enter") {
      e.preventDefault();
      setOpenTaskId(row.id);
    } else if (e.key === " ") {
      e.preventDefault();
      const cat = row.status_id ? statuses[row.status_id]?.category : null;
      const next = cat === "done" ? "todo" : "done";
      await setTaskStatus(row.id, workspaceId!, next as any);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Everything assigned to you across all clients and projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show completed</span>
          <Switch checked={showCompleted} onCheckedChange={setShowCompleted} />
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 w-8"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" /></th>
              <ResizableTh columnKey="title" width={widths.title} onResize={setWidth} className="px-3 py-2 font-medium text-left">
                <ColumnHeader label="Title" columnKey="title" sort={tf.sort} onToggleSort={tf.toggleSort}
                  filterValue={tf.filters.title} onFilterChange={tf.setFilter}
                  renderFilter={(v, onChange) => <TextFilter value={v} onChange={onChange} placeholder="Filter title…" />} />
              </ResizableTh>
              <ResizableTh columnKey="client" width={widths.client} onResize={setWidth} className="px-3 py-2 font-medium text-left">
                <ColumnHeader label="Client" columnKey="client" sort={tf.sort} onToggleSort={tf.toggleSort}
                  filterValue={tf.filters.client} onFilterChange={tf.setFilter}
                  renderFilter={(v, onChange) => <MultiSelectFilter value={v} onChange={onChange}
                    options={Object.values(clients).map((c) => ({ value: c.id, label: c.name }))} />} />
              </ResizableTh>
              <ResizableTh columnKey="project" width={widths.project} onResize={setWidth} className="px-3 py-2 font-medium text-left">
                <ColumnHeader label="Project" columnKey="project" sort={tf.sort} onToggleSort={tf.toggleSort}
                  filterValue={tf.filters.project} onFilterChange={tf.setFilter}
                  renderFilter={(v, onChange) => <MultiSelectFilter value={v} onChange={onChange}
                    options={distinctProjectIds.map((id) => ({ value: id, label: projectLabel(id) }))} />} />
              </ResizableTh>
              <ResizableTh columnKey="status" width={widths.status} onResize={setWidth} className="px-3 py-2 font-medium text-left">
                <ColumnHeader label="Status" columnKey="status" sort={tf.sort} onToggleSort={tf.toggleSort}
                  filterValue={tf.filters.status} onFilterChange={tf.setFilter}
                  renderFilter={(v, onChange) => <MultiSelectFilter value={v} onChange={onChange}
                    options={Object.values(statuses).map((s) => ({ value: s.id, label: s.name }))} />} />
              </ResizableTh>
              <ResizableTh columnKey="priority" width={widths.priority} onResize={setWidth} className="px-3 py-2 font-medium text-left">
                <ColumnHeader label="Priority" columnKey="priority" sort={tf.sort} onToggleSort={tf.toggleSort}
                  filterValue={tf.filters.priority} onFilterChange={tf.setFilter}
                  renderFilter={(v, onChange) => <MultiSelectFilter value={v} onChange={onChange}
                    options={["Urgent", "High", "Medium", "Low"].map((p) => ({ value: p, label: p }))} />} />
              </ResizableTh>
              <ResizableTh columnKey="source" width={widths.source} onResize={setWidth} className="px-3 py-2 font-medium text-left">Source</ResizableTh>
              <ResizableTh columnKey="due" width={widths.due} onResize={setWidth} className="px-3 py-2 font-medium text-left">
                <ColumnHeader label="Due" columnKey="due" sort={tf.sort} onToggleSort={tf.toggleSort}
                  filterValue={tf.filters.due} onFilterChange={tf.setFilter}
                  renderFilter={(v, onChange) => <DateRangeFilter value={v} onChange={onChange} />} />
              </ResizableTh>
              <ResizableTh columnKey="assignee" width={widths.assignee} onResize={setWidth} className="px-3 py-2 font-medium text-left">
                <ColumnHeader label="Assignee" columnKey="assignee" sort={tf.sort} onToggleSort={tf.toggleSort}
                  filterValue={tf.filters.assignee} onFilterChange={tf.setFilter}
                  renderFilter={(v, onChange) => <MultiSelectFilter value={v} onChange={onChange}
                    options={userId ? [{ value: userId, label: "Me" }] : []} />} />
              </ResizableTh>
              <th className="px-3 py-2 w-8" />
              <th className="px-3 py-2 w-8" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} className="px-3 py-12 text-center text-sm text-muted-foreground">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={11} className="px-3 py-16 text-center">
                <ListTodo className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No tasks assigned to you yet</p>
              </td></tr>
            ) : (
              filtered.map((row) => {
                const status = row.status_id ? statuses[row.status_id] : null;
                const overdue = isOverdue(row.due_date, row.completed_at);
                const approaching = !overdue && isApproachingDue(row.due_date, row.completed_at);
                const client = clients[row.client_id];
                const dueClass = overdue
                  ? "text-red-600 font-bold"
                  : approaching
                  ? "text-amber-500 font-semibold"
                  : "";
                const target: TaskActionTarget = {
                  id: row.id,
                  workspaceId: workspaceId!,
                  meetingId: row.meeting_id,
                  assigneeIds: [userId!],
                  dueDate: row.due_date,
                };
                return (
                  <TaskActionsMenu
                    key={row.id}
                    task={target}
                    variant="context"
                    onEdit={(id) => setOpenTaskId(id)}
                    onDeleted={() => setRows((p) => p.filter((r) => r.id !== row.id))}
                  >
                    <tr
                      tabIndex={0}
                      onKeyDown={(e) => handleRowKey(e, row)}
                      onClick={() => setOpenTaskId(row.id)}
                      className="border-t border-border hover:bg-muted/40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-muted/40"
                    >
                      <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selected.includes(row.id)} onCheckedChange={() => toggleOne(row.id)} aria-label="Select task" />
                      </td>
                      <td className="px-3 py-2 font-medium whitespace-normal break-words">
                        {row.title}
                        {!!row.comment_count && (
                          <span className="ml-2 text-[11px] text-muted-foreground">💬 {row.comment_count}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-normal break-words">
                        {client && (
                          <Link to={`/app/clients/${client.id}`} onClick={(e) => e.stopPropagation()}>
                            <Badge variant="outline" className={`${clientColor(client.id)} border-transparent`}>{client.name}</Badge>
                          </Link>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-normal break-words text-xs text-muted-foreground" title={row.project_id ?? ""}>
                        {row.project_id ? projectLabel(row.project_id) : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {status ? (
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <span className="w-2 h-2 rounded-full" style={{ background: status.color ?? "#94a3b8" }} />
                            {status.name}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className={PRIORITY_CLASS[row.priority] ?? ""}>{row.priority}</Badge>
                      </td>
                      <td className="px-3 py-2">
                        {extractedTaskIds.has(row.id) ? (
                          <Badge variant="outline" className="border-primary/30 text-primary">Extracted</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Manual</Badge>
                        )}
                      </td>
                      <td className={`px-3 py-2 ${dueClass}`}>
                        {row.due_date ? format(parseDateOnly(row.due_date)!, "MMM d, yyyy") : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">Me</td>
                      <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon" variant="ghost" className="h-7 w-7 text-emerald-600 hover:bg-emerald-50"
                          title="Start timer for this task"
                          onClick={() => startTimerForTask(row)}
                        >
                          <Play className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                      <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                        <TaskActionsMenu
                          task={target}
                          onEdit={(id) => setOpenTaskId(id)}
                          onDeleted={() => setRows((p) => p.filter((r) => r.id !== row.id))}
                        />
                      </td>
                    </tr>
                  </TaskActionsMenu>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <BulkActionBar workspaceId={workspaceId!} selected={selected} onClear={() => setSelected([])} />

      <TaskDetailPanel
        taskId={openTaskId}
        open={!!openTaskId}
        onOpenChange={(o) => !o && setOpenTaskId(null)}
        onChanged={() => load()}
      />

      <DeleteTaskDialog
        open={!!confirmRow}
        onOpenChange={(o) => !o && setConfirmRow(null)}
        count={1}
        fromMeeting={!!confirmRow?.meeting_id}
        onConfirm={async () => {
          if (!confirmRow) return;
          const ok = await softDeleteTasks([confirmRow.id]);
          if (ok) {
            toast.success("Task deleted");
            setRows((p) => p.filter((r) => r.id !== confirmRow.id));
          }
          setConfirmRow(null);
        }}
      />
    </div>
  );
}
