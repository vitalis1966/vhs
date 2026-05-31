import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveMatrix, PermissionsMatrix, DEFAULT_PERMISSIONS } from "@/lib/permissions";

export type WorkspaceRole = "admin" | "manager" | "team_member" | "client";

export interface WorkspaceRow {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  date_format: string | null;
  time_zone: string | null;
  default_industry: string | null;
  default_account_owner_id: string | null;
  role_permissions: any;
  notification_config: any;
  workspace_config: any;
  security_config: any;
}

interface WorkspaceState {
  workspaceId: string | null;
  workspaceName: string | null;
  workspace: WorkspaceRow | null;
  role: WorkspaceRole | null;
  permissions: PermissionsMatrix;
  loading: boolean;
  hasMembership: boolean;
  userId: string | null;
  userEmail: string | null;
  userFullName: string | null;
  refresh: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceState | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceRow | null>(null);
  const [role, setRole] = useState<WorkspaceRole | null>(null);
  const [permissions, setPermissions] = useState<PermissionsMatrix>(DEFAULT_PERMISSIONS);
  const [loading, setLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setUserId(null); setUserEmail(null); setUserFullName(null);
      setWorkspaceId(null); setWorkspaceName(null); setWorkspace(null); setRole(null);
      setPermissions(DEFAULT_PERMISSIONS);
      setHasMembership(false); setLoading(false);
      return;
    }
    setUserId(session.user.id);
    setUserEmail(session.user.email ?? null);

    if (session.user.email) {
      await (supabase as any).rpc("accept_pending_invites", {
        p_user_id: session.user.id,
        p_email: session.user.email,
      });
    }

    const { data: memberships } = await (supabase as any)
      .from("workspace_members")
      .select("workspace_id, role, status, workspaces(*)")
      .eq("user_id", session.user.id)
      .eq("status", "active");

    const rows = memberships ?? [];
    setHasMembership(rows.length > 0);

    if (rows.length >= 1) {
      const m = rows[0];
      const ws = m.workspaces as WorkspaceRow | null;
      setWorkspaceId(m.workspace_id);
      setWorkspaceName(ws?.name ?? null);
      setWorkspace(ws);
      setRole(m.role as WorkspaceRole);
      setPermissions(resolveMatrix(ws?.role_permissions));

      // Apply workspace primary color globally.
      if (ws?.primary_color) {
        document.documentElement.style.setProperty("--workspace-accent", ws.primary_color);
      }
    } else {
      setWorkspaceId(null); setWorkspaceName(null); setWorkspace(null); setRole(null);
      setPermissions(DEFAULT_PERMISSIONS);
    }

    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("full_name")
      .eq("id", session.user.id)
      .maybeSingle();
    setUserFullName(profile?.full_name ?? session.user.email ?? null);

    // Touch last_active_at (best-effort).
    void (supabase as any)
      .from("profiles")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", session.user.id);

    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (!cancelled) void load();
    });
    void load();
    return () => { cancelled = true; subscription.unsubscribe(); };
  }, [load]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceId, workspaceName, workspace, role, permissions,
        loading, hasMembership,
        userId, userEmail, userFullName, refresh: load,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
