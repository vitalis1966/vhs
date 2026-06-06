import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Filter } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { format } from "date-fns";
import { PRIORITY_CLASS, clientColor, initials, isOverdue, parseDateOnly } from "./taskUtils";
import { TaskActionsMenu, type TaskActionTarget } from "./tasks/TaskActionsMenu";
import { onTasksChanged } from "./tasks/taskMutations";

type SortKey = "title" | "priority" | "due";
type SortDir = "asc" | "desc";
type ColumnState = { search: string; sort: { key: SortKey; dir: SortDir } | null };
const PRIORITY_ORDER: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

interface TaskCard {
  id: string; title: string; status_id: string | null; priority: string;
  due_date: string | null; client_id: string; completed_at: string | null;
  meeting_id: string | null; comment_count?: number;
}
interface Status { id: string; name: string; color: string | null; position: number; category: string; }
interface ClientLite { id: string; name: string; }
interface ProfileLite { id: string; full_name: string | null; email: string | null; }

interface Props {
  clientId?: string;            // filter to this client
  projectId?: string;           // filter to this project
  filters?: { status?: string; priority?: string; assignee?: string; clientFilter?: string; tag?: string };
  reloadKey?: number;
  onOpenTask: (taskId: string) => void;
}

export function TaskBoard({ clientId, projectId, filters, reloadKey, onOpenTask }: Props) {
  const { workspaceId } = useWorkspace();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [tasks, setTasks] = useState<TaskCard[]>([]);
  const [clients, setClients] = useState<Record<string, ClientLite>>({});
  const [assigneesByTask, setAssigneesByTask] = useState<Record<string, string[]>>({});
  const [tagsByTask, setTagsByTask] = useState<Record<string, string[]>>({});
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [columnState, setColumnState] = useState<Record<string, ColumnState>>({});

  const getColState = (id: string): ColumnState => columnState[id] ?? { search: "", sort: null };
  const setColSearch = (id: string, search: string) => setColumnState((p) => ({ ...p, [id]: { ...getColState(id), search } }));
  const setColSort = (id: string, key: SortKey, dir: SortDir) => setColumnState((p) => ({ ...p, [id]: { ...getColState(id), sort: { key, dir } } }));
  const clearColSort = (id: string) => setColumnState((p) => ({ ...p, [id]: { ...getColState(id), sort: null } }));

  const applyColumn = (statusId: string, list: TaskCard[]): TaskCard[] => {
    const st = getColState(statusId);
    let out = list;
    if (st.search.trim()) {
      const q = st.search.trim().toLowerCase();
      out = out.filter((t) => t.title.toLowerCase().includes(q));
    }
    if (st.sort) {
      const dir = st.sort.dir === "asc" ? 1 : -1;
      out = [...out].sort((a, b) => {
        if (st.sort!.key === "title") return a.title.localeCompare(b.title) * dir;
        if (st.sort!.key === "priority") return ((PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99)) * dir;
        const ad = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const bd = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return (ad - bd) * dir;
      });
    }
    return out;
  };

  const load = useCallback(async () => {
    if (!workspaceId) return;
    const sRes = await (supabase as any).from("task_statuses").select("*").eq("workspace_id", workspaceId).order("position");
    setStatuses(sRes.data ?? []);

    let q = (supabase as any).from("tasks")
      .select("id, title, status_id, priority, due_date, client_id, completed_at, meeting_id, comment_count")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null);
    if (clientId) q = q.eq("client_id", clientId);
    if (projectId) q = q.eq("project_id", projectId);
    const tRes = await q.order("position");
    const trows: TaskCard[] = tRes.data ?? [];
    setTasks(trows);

    const clientIds = Array.from(new Set(trows.map((t) => t.client_id)));
    if (clientIds.length) {
      const { data: cs } = await (supabase as any).from("clients").select("id, name").in("id", clientIds);
      const map: Record<string, ClientLite> = {};
      (cs ?? []).forEach((c: any) => { map[c.id] = c; });
      setClients(map);
    } else setClients({});

    if (trows.length) {
      const [asRes, tgRes] = await Promise.all([
        (supabase as any).from("task_assignees").select("task_id, user_id").in("task_id", trows.map((t) => t.id)),
        (supabase as any).from("taggings").select("tag_id, taggable_id").eq("taggable_type", "task").in("taggable_id", trows.map((t) => t.id)),
      ]);
      const grouped: Record<string, string[]> = {};
      (asRes.data ?? []).forEach((r: any) => { (grouped[r.task_id] = grouped[r.task_id] ?? []).push(r.user_id); });
      setAssigneesByTask(grouped);
      const tg: Record<string, string[]> = {};
      (tgRes.data ?? []).forEach((r: any) => { (tg[r.taggable_id] = tg[r.taggable_id] ?? []).push(r.tag_id); });
      setTagsByTask(tg);
      const uids = Array.from(new Set((asRes.data ?? []).map((r: any) => r.user_id)));
      if (uids.length) {
        const { data: ps } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", uids);
        const pm: Record<string, ProfileLite> = {};
        (ps ?? []).forEach((p: any) => { pm[p.id] = p; });
        setProfiles(pm);
      }
    } else { setAssigneesByTask({}); setTagsByTask({}); setProfiles({}); }
  }, [workspaceId, clientId, projectId]);

  useEffect(() => { load(); }, [load, reloadKey]);
  useEffect(() => onTasksChanged(() => load()), [load]);

  const filtered = useMemo(() => tasks.filter((t) => {
    if (filters?.status && t.status_id !== filters.status) return false;
    if (filters?.priority && t.priority !== filters.priority) return false;
    if (filters?.clientFilter && t.client_id !== filters.clientFilter) return false;
    if (filters?.assignee && !(assigneesByTask[t.id] ?? []).includes(filters.assignee)) return false;
    if (filters?.tag && !(tagsByTask[t.id] ?? []).includes(filters.tag)) return false;
    return true;
  }), [tasks, filters, assigneesByTask, tagsByTask]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = async (e: DragEndEvent) => {
    setDraggingId(null);
    const taskId = String(e.active.id);
    const newStatusId = e.over?.id ? String(e.over.id) : null;
    if (!newStatusId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status_id === newStatusId) return;
    const newStatus = statuses.find((s) => s.id === newStatusId);
    const oldStatus = statuses.find((s) => s.id === task.status_id);
    const completed_at = newStatus?.category === "done" ? (task.completed_at ?? new Date().toISOString()) : null;
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status_id: newStatusId, completed_at } : t));
    await (supabase as any).from("tasks").update({ status_id: newStatusId, completed_at }).eq("id", taskId);
    const { data: { user } } = await supabase.auth.getUser();
    if (user && workspaceId) {
      await (supabase as any).from("activities").insert({
        workspace_id: workspaceId, actor_id: user.id, verb: "status_changed",
        target_type: "task", target_id: taskId, client_id: task.client_id,
        metadata: { title: task.title, old_status: oldStatus?.name ?? null, new_status: newStatus?.name ?? null },
      });
    }
  };

  const draggingTask = tasks.find((t) => t.id === draggingId);

  return (
    <DndContext sensors={sensors} onDragStart={(e) => setDraggingId(String(e.active.id))} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((s) => {
          const col = applyColumn(s.id, filtered.filter((t) => t.status_id === s.id));
          const st = getColState(s.id);
          return (
            <Column
              key={s.id}
              status={s}
              count={col.length}
              search={st.search}
              onSearchChange={(v) => setColSearch(s.id, v)}
              sort={st.sort}
              onSortChange={(key, dir) => setColSort(s.id, key, dir)}
              onClearSort={() => clearColSort(s.id)}
            >
              {col.map((t) => (
                <DraggableCard
                  key={t.id} task={t}
                  client={clients[t.client_id]}
                  assigneeIds={assigneesByTask[t.id] ?? []}
                  profiles={profiles}
                  workspaceId={workspaceId!}
                  onClick={() => onOpenTask(t.id)}
                  onEdit={onOpenTask}
                />
              ))}
            </Column>
          );
        })}
      </div>
      <DragOverlay>
        {draggingTask && (
          <Card task={draggingTask} client={clients[draggingTask.client_id]} assigneeIds={assigneesByTask[draggingTask.id] ?? []} profiles={profiles} />
        )}
      </DragOverlay>
    </DndContext>
  );
}

function Column({
  status, count, children, search, onSearchChange, sort, onSortChange, onClearSort,
}: {
  status: Status; count: number; children: React.ReactNode;
  search: string; onSearchChange: (v: string) => void;
  sort: { key: SortKey; dir: SortDir } | null;
  onSortChange: (key: SortKey, dir: SortDir) => void;
  onClearSort: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });
  const filterActive = search.trim().length > 0;
  const sortActive = sort != null;
  return (
    <div ref={setNodeRef} className={`min-w-[280px] w-[280px] flex-shrink-0 rounded-lg p-3 ${isOver ? "bg-muted/80" : "bg-muted/40"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: status.color ?? "#94a3b8" }} />
          <span className="font-medium text-sm truncate">{status.name}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-xs text-muted-foreground mr-1">{count}</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className={`h-6 w-6 relative ${filterActive ? "text-primary" : ""}`} aria-label="Filter column">
                <Filter className="h-3 w-3" />
                {filterActive && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-2 w-56">
              <Input autoFocus placeholder="Search by task name…" value={search} onChange={(e) => onSearchChange(e.target.value)} className="h-8" />
              {filterActive && (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs mt-2 w-full justify-start" onClick={() => onSearchChange("")}>Clear</Button>
              )}
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={`h-6 w-6 ${sortActive ? "text-primary" : ""}`} aria-label="Sort column">
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onSortChange("title", "asc")}>Task Name A–Z</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("title", "desc")}>Task Name Z–A</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSortChange("priority", "asc")}>Priority High → Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("priority", "desc")}>Priority Low → High</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSortChange("due", "asc")}>Due Earliest → Latest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("due", "desc")}>Due Latest → Earliest</DropdownMenuItem>
              {sortActive && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onClearSort}>Clear sort</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-2 min-h-[60px]">{children}</div>
    </div>
  );
}

function DraggableCard({ task, client, assigneeIds, profiles, workspaceId, onClick, onEdit }: { task: TaskCard; client?: ClientLite; assigneeIds: string[]; profiles: Record<string, ProfileLite>; workspaceId: string; onClick: () => void; onEdit: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.4 : 1 } : undefined;
  const target: TaskActionTarget = {
    id: task.id, workspaceId, meetingId: task.meeting_id, assigneeIds, dueDate: task.due_date,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick} className="relative group">
      <Card task={task} client={client} assigneeIds={assigneeIds} profiles={profiles} />
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
        <TaskActionsMenu task={target} onEdit={onEdit} />
      </div>
    </div>
  );
}

function Card({ task, client, assigneeIds, profiles }: { task: TaskCard; client?: ClientLite; assigneeIds: string[]; profiles: Record<string, ProfileLite>; }) {
  const overdue = isOverdue(task.due_date, task.completed_at);
  return (
    <div className="bg-card border border-border rounded-md p-3 cursor-pointer hover:border-primary/50 hover:shadow-sm transition">
      <div className="text-sm font-medium text-foreground mb-2 line-clamp-2">{task.title}</div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {client && <Badge variant="outline" className={`text-xs ${clientColor(client.id)} border-transparent`}>{client.name}</Badge>}
        <Badge variant="outline" className={`text-xs ${PRIORITY_CLASS[task.priority] ?? ""}`}>{task.priority}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <div className={`text-xs ${overdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
          {task.due_date ? format(new Date(task.due_date), "MMM d") : ""}
          {!!task.comment_count && (
            <span className="ml-2">💬 {task.comment_count}</span>
          )}
        </div>
        <div className="flex -space-x-1.5">
          {assigneeIds.slice(0, 3).map((uid) => {
            const p = profiles[uid];
            return (
              <Avatar key={uid} className="h-5 w-5 border border-background">
                <AvatarFallback className="text-[9px]">{initials(p?.full_name ?? p?.email)}</AvatarFallback>
              </Avatar>
            );
          })}
        </div>
      </div>
    </div>
  );
}
