import { supabase } from "@/integrations/supabase/client";
import type { GanttItem } from "./types";

const sb = supabase as any;

export async function listItems(projectId: string): Promise<GanttItem[]> {
  const { data, error } = await sb
    .from("gantt_items")
    .select("*")
    .eq("project_id", projectId)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as GanttItem[];
}

export async function createItem(payload: Partial<GanttItem> & { workspace_id: string; project_id: string; client_id: string }): Promise<GanttItem> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await sb
    .from("gantt_items")
    .insert({ ...payload, created_by: user?.id ?? null })
    .select()
    .single();
  if (error) throw error;
  return data as GanttItem;
}

export async function updateItem(id: string, patch: Partial<GanttItem>): Promise<GanttItem> {
  const { data, error } = await sb
    .from("gantt_items")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as GanttItem;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await sb.from("gantt_items").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderItems(updates: { id: string; position: number; parent_id: string | null }[]): Promise<void> {
  // Sequential is fine for small lists
  for (const u of updates) {
    await sb.from("gantt_items").update({ position: u.position, parent_id: u.parent_id }).eq("id", u.id);
  }
}

export async function logActivity(itemId: string, workspaceId: string, action: string, changes?: any) {
  const { data: { user } } = await supabase.auth.getUser();
  await sb.from("gantt_item_activity").insert({
    gantt_item_id: itemId, workspace_id: workspaceId, actor_id: user?.id ?? null, action, changes: changes ?? null,
  });
}

export async function listActivity(itemId: string) {
  const { data } = await sb
    .from("gantt_item_activity")
    .select("*")
    .eq("gantt_item_id", itemId)
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function listComments(itemId: string) {
  const { data } = await sb
    .from("gantt_item_comments")
    .select("*")
    .eq("gantt_item_id", itemId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function addComment(itemId: string, workspaceId: string, body: string, mentionedIds: string[] = []) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { data, error } = await sb.from("gantt_item_comments").insert({
    gantt_item_id: itemId, workspace_id: workspaceId, author_id: user.id, body, mentioned_user_ids: mentionedIds,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteComment(id: string) {
  await sb.from("gantt_item_comments").delete().eq("id", id);
}
