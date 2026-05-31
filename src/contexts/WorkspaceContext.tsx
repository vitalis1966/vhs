import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WorkspaceRole = "admin" | "manager" | "team_member" | "client";

interface WorkspaceState {
  workspaceId: string | null;
  workspaceName: string | null;
  role: WorkspaceRole | null;
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
  const [role, setRole] = useState<WorkspaceRole | null>(null);
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
      setWorkspaceId(null); setWorkspaceName(null); setRole(null);
      setHasMembership(false); setLoading(false);
      return;
    }
    setUserId(session.user.id);
    setUserEmail(session.user.email ?? null);

    // Activate any pending invites that match this email.
    if (session.user.email) {
      await (supabase as any).rpc("accept_pending_invites", {
        p_user_id: session.user.id,
        p_email: session.user.email,
      });
    }

    const { data: memberships } = await (supabase as any)
      .from("workspace_members")
      .select("workspace_id, role, workspaces(name)")
      .eq("user_id", session.user.id)
      .eq("status", "active");

    const rows = memberships ?? [];
    setHasMembership(rows.length > 0);

    if (rows.length >= 1) {
      const m = rows[0];
      setWorkspaceId(m.workspace_id);
      setWorkspaceName(m.workspaces?.name ?? null);
      setRole(m.role as WorkspaceRole);
    } else {
      setWorkspaceId(null); setWorkspaceName(null); setRole(null);
    }

    // Fetch profile name (best-effort)
    const { data: profile } = await (supabase as any)
      .from("profiles")
      .select("full_name")
      .eq("id", session.user.id)
      .maybeSingle();
    setUserFullName(profile?.full_name ?? session.user.email ?? null);

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
        workspaceId, workspaceName, role, loading, hasMembership,
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
