import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TasksBadge {
  newCount: number;
  totalCount: number;
}

const KEY = (uid: string) => `vitalis.myTasks.lastVisited.${uid}`;

export function markMyTasksVisited(userId?: string | null) {
  if (!userId) return;
  try { localStorage.setItem(KEY(userId), new Date().toISOString()); } catch { /* ignore */ }
}

export function useMyTasksBadge(userId?: string | null, workspaceId?: string | null): TasksBadge {
  const [badge, setBadge] = useState<TasksBadge>({ newCount: 0, totalCount: 0 });

  useEffect(() => {
    if (!userId || !workspaceId) { setBadge({ newCount: 0, totalCount: 0 }); return; }
    let cancelled = false;

    const load = async () => {
      const lastVisited = (() => {
        try { return localStorage.getItem(KEY(userId)); } catch { return null; }
      })();

      const { data: assigned } = await (supabase as any)
        .from("task_assignees").select("task_id").eq("user_id", userId);
      const ids: string[] = (assigned ?? []).map((r: any) => r.task_id);
      if (!ids.length) { if (!cancelled) setBadge({ newCount: 0, totalCount: 0 }); return; }

      const { data: tasks } = await (supabase as any)
        .from("tasks")
        .select("id, created_at, status_id, completed_at")
        .in("id", ids)
        .eq("workspace_id", workspaceId)
        .is("deleted_at", null);

      const { data: statuses } = await (supabase as any)
        .from("task_statuses").select("id, category").eq("workspace_id", workspaceId);
      const cat: Record<string, string> = {};
      (statuses ?? []).forEach((s: any) => { cat[s.id] = s.category; });

      const isOpen = (t: any) => {
        const c = t.status_id ? cat[t.status_id] : null;
        return c !== "done" && c !== "cancelled";
      };

      const all = (tasks ?? []) as any[];
      const open = all.filter(isOpen);
      const newCount = lastVisited
        ? open.filter((t) => t.created_at && t.created_at > lastVisited).length
        : open.length;

      if (!cancelled) setBadge({ newCount, totalCount: open.length });
    };

    load();
    const t = setInterval(load, 60000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => { cancelled = true; clearInterval(t); window.removeEventListener("focus", onFocus); };
  }, [userId, workspaceId]);

  return badge;
}
