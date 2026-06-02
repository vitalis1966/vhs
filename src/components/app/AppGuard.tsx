import { useEffect, useState, ReactNode, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";

const NoWorkspaceAccess = lazy(() => import("@/pages/app/SetupWorkspace"));

function AppGuardInner({ children }: { children: ReactNode }) {
  const { loading, hasMembership } = useWorkspace();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!hasMembership) {
    return (
      <Suspense fallback={<div className="min-h-screen" />}>
        <NoWorkspaceAccess />
      </Suspense>
    );
  }
  return <>{children}</>;
}

export function AppGuard({ children, requireMembership = true }: { children: ReactNode; requireMembership?: boolean }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = (session: any) => {
      if (cancelled) return;
      if (!session) {
        navigate("/admin/login", { replace: true });
        setAuthed(false);
      } else {
        setAuthed(true);
      }
      setChecking(false);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => check(s));
    supabase.auth.getSession().then(({ data: { session } }) => check(session));
    return () => { cancelled = true; subscription.unsubscribe(); };
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!authed) return null;

  return (
    <WorkspaceProvider>
      {requireMembership ? <AppGuardInner>{children}</AppGuardInner> : <>{children}</>}
    </WorkspaceProvider>
  );
}
