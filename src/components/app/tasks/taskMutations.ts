import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type StatusCategory = "todo" | "active" | "waiting" | "done" | "cancelled";

const EVENT = "tasks:changed";

export function emitTasksChanged(taskIds?: string[]) {
  try {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { taskIds } }));
  } catch {}
}

export function onTasksChanged(handler: (ids?: string[]) => void) {
  const fn = (e: Event) => handler((e as CustomEvent).detail?.taskIds);
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}

async function getStatusByCategory(workspaceId: string, category: StatusCategory) {
  const { data } = await (supabase as any)
    .from("task_statuses")
    .select("id, category, position")
    .eq("workspace_id", workspaceId)
    .eq("category", category)
    .order("position")
    .limit(1);
  return data?.[0] ?? null;
}

export async function setTaskStatus(taskId: string, workspaceId: string, category: StatusCategory) {
  const s = await getStatusByCategory(workspaceId, category);
  if (!s) {
    toast.error(`No "${category}" status configured for this workspace`);
    return false;
  }
  const completed_at = category === "done" ? new Date().toISOString() : null;
  const { error } = await (supabase as any)
    .from("tasks")
    .update({ status_id: s.id, completed_at })
    .eq("id", taskId);
  if (error) { toast.error(error.message); return false; }
  emitTasksChanged([taskId]);
  return true;
}

export async function bulkSetStatus(taskIds: string[], workspaceId: string, category: StatusCategory) {
  const s = await getStatusByCategory(workspaceId, category);
  if (!s) { toast.error(`No "${category}" status configured`); return false; }
  const completed_at = category === "done" ? new Date().toISOString() : null;
  const { error } = await (supabase as any)
    .from("tasks")
    .update({ status_id: s.id, completed_at })
    .in("id", taskIds);
  if (error) { toast.error(error.message); return false; }
  emitTasksChanged(taskIds);
  return true;
}

export async function setTaskDueDate(taskId: string, dueDate: string | null) {
  const { error } = await (supabase as any)
    .from("tasks")
    .update({ due_date: dueDate })
    .eq("id", taskId);
  if (error) { toast.error(error.message); return false; }
  emitTasksChanged([taskId]);
  return true;
}

export async function bulkSetDueDate(taskIds: string[], dueDate: string | null) {
  const { error } = await (supabase as any)
    .from("tasks")
    .update({ due_date: dueDate })
    .in("id", taskIds);
  if (error) { toast.error(error.message); return false; }
  emitTasksChanged(taskIds);
  return true;
}

export async function setTaskAssignees(taskId: string, userIds: string[]) {
  const { error: delErr } = await (supabase as any)
    .from("task_assignees").delete().eq("task_id", taskId);
  if (delErr) { toast.error(delErr.message); return false; }
  if (userIds.length) {
    const rows = userIds.map((uid) => ({ task_id: taskId, user_id: uid }));
    const { error } = await (supabase as any).from("task_assignees").insert(rows);
    if (error) { toast.error(error.message); return false; }
  }
  emitTasksChanged([taskId]);
  return true;
}

export async function bulkSetAssignees(taskIds: string[], userIds: string[]) {
  for (const id of taskIds) {
    await setTaskAssignees(id, userIds);
  }
  return true;
}

export async function softDeleteTasks(taskIds: string[]) {
  const { error } = await (supabase as any)
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", taskIds);
  if (error) { toast.error(error.message); return false; }
  emitTasksChanged(taskIds);
  return true;
}

export async function duplicateTask(taskId: string) {
  const { data: src, error } = await (supabase as any)
    .from("tasks").select("*").eq("id", taskId).single();
  if (error || !src) { toast.error(error?.message ?? "Task not found"); return null; }
  const { id, created_at, updated_at, completed_at, position, ...rest } = src;
  const { data: ins, error: insErr } = await (supabase as any)
    .from("tasks")
    .insert({ ...rest, title: `${src.title} (copy)`, completed_at: null, deleted_at: null })
    .select().single();
  if (insErr) { toast.error(insErr.message); return null; }
  const { data: asg } = await (supabase as any)
    .from("task_assignees").select("user_id").eq("task_id", taskId);
  if (asg?.length) {
    await (supabase as any).from("task_assignees").insert(
      asg.map((r: any) => ({ task_id: ins.id, user_id: r.user_id })),
    );
  }
  emitTasksChanged([ins.id]);
  return ins;
}
