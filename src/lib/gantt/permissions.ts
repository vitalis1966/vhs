import { supabase } from "@/integrations/supabase/client";

export type GanttRole = "admin" | "manager" | "member" | "viewer";

export interface GanttPermissions {
  role: GanttRole;
  canCreate: boolean;
  canDeleteStructure: boolean; // delete sections / restructure
  canEditAnyItem: boolean;
  canEditOwnItem: boolean;
  canSetBaseline: boolean;
  canManageTemplates: boolean;
  canExport: boolean;
  canImport: boolean;
}

export async function loadGanttPermissions(workspaceId: string): Promise<GanttPermissions> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return viewer();
  const { data } = await (supabase as any).from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();
  const role = (data?.role as GanttRole) ?? "viewer";
  const isAdmin = role === "admin" || role === "manager";
  return {
    role,
    canCreate: isAdmin,
    canDeleteStructure: isAdmin,
    canEditAnyItem: isAdmin,
    canEditOwnItem: true,
    canSetBaseline: isAdmin,
    canManageTemplates: isAdmin,
    canExport: true,
    canImport: isAdmin,
  };
}

function viewer(): GanttPermissions {
  return {
    role: "viewer",
    canCreate: false, canDeleteStructure: false, canEditAnyItem: false, canEditOwnItem: false,
    canSetBaseline: false, canManageTemplates: false, canExport: false, canImport: false,
  };
}

export function canEditItem(perms: GanttPermissions, assigneeId: string | null, currentUserId: string | null): boolean {
  if (perms.canEditAnyItem) return true;
  if (perms.canEditOwnItem && assigneeId && currentUserId && assigneeId === currentUserId) return true;
  return false;
}
