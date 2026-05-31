import { useWorkspace } from "@/contexts/WorkspaceContext";
import { PermissionAction } from "@/lib/permissions";

export function usePermission(action: PermissionAction): boolean {
  const { role, permissions } = useWorkspace();
  if (!role) return false;
  if (role === "client") return false;
  const row = permissions?.[action];
  if (!row) return role === "admin";
  return !!row[role as "admin" | "manager" | "team_member"];
}

export function useHasAnyRole(...roles: Array<"admin" | "manager" | "team_member">) {
  const { role } = useWorkspace();
  return role ? roles.includes(role as any) : false;
}
