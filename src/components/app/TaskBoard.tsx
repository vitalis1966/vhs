import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { format } from "date-fns";
import { PRIORITY_CLASS, clientColor, initials, isOverdue } from "./taskUtils";

interface TaskCard {
  id: string; title: string; status_id: string | null; priority: string;
  due_date: string | null; client_id: string; completed_at: string | null;
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
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!workspaceId) return;
    const sRes = await (supabase as any).from("task_statuses").select("*").eq("workspace_id", workspaceId).order("position");
    setStatuses(sRes.data ?? []);

    let q = (supabase as any).from("tasks")
      .select("id, title, status_id, priority, due_date, client_id, completed_at")
      .eq("workspace_id", workspaceId);
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
      const { data: as } = await (supabase as any).from("task_assignees").select("task_id, user_id").in("task_id", trows.map((t) => t.id));
      const grouped: Record<string, string[]> = {};
      (as ?? []).forEach((r: any) => { (grouped[r.task_id] = grouped[r.task_id] ?? []).push(r.user_id); });
      setAssigneesByTask(grouped);
      const uids = Array.from(new Set((as ?? []).map((r: any) => r.user_id)));
      if (uids.length) {
        const { data: ps } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", uids);
        const pm: Record<string, ProfileLite> = {};
        (ps ?? []).forEach((p: any) => { pm[p.id] = p; });
        setProfiles(pm);
      }
    } else { setAssigneesByTask({}); setProfiles({}); }
  }, [workspaceId, clientId, projectId]);

  useEffect(() => { load(); }, [load, reloadKey]);

  const filtered = useMemo(() => tasks.filter((t) => {
    if (filters?.status && t.status_id !== filters.status) return false;
    if (filters?.priority && t.priority !== filters.priority) return false;
    if (filters?.clientFilter && t.client_id !== filters.clientFilter) return false;
    if (filters?.assignee && !(assigneesByTask[t.id] ?? []).includes(filters.assignee)) return false;
    return true;
  }), [tasks, filters, assigneesByTask]);

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
          const col = filtered.filter((t) => t.status_id === s.id);
          return (
            <Column key={s.id} status={s} count={col.length}>
              {col.map((t) => (
                <DraggableCard
                  key={t.id} task={t}
                  client={clients[t.client_id]}
                  assigneeIds={assigneesByTask[t.id] ?? []}
                  profiles={profiles}
                  onClick={() => onOpenTask(t.id)}
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

function Column({ status, count, children }: { status: Status; count: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });
  return (
    <div ref={setNodeRef} className={`min-w-[280px] w-[280px] flex-shrink-0 rounded-lg p-3 ${isOver ? "bg-muted/80" : "bg-muted/40"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: status.color ?? "#94a3b8" }} />
          <span className="font-medium text-sm">{status.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      <div className="space-y-2 min-h-[60px]">{children}</div>
    </div>
  );
}

function DraggableCard({ task, client, assigneeIds, profiles, onClick }: { task: TaskCard; client?: ClientLite; assigneeIds: string[]; profiles: Record<string, ProfileLite>; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.4 : 1 } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      <Card task={task} client={client} assigneeIds={assigneeIds} profiles={profiles} />
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
