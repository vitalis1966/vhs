import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";

function AppGuardInner({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { loading, hasMembership } = useWorkspace();

  useEffect(() => {
    if (loading) return;
    if (!hasMembership) {
      navigate("/app/setup", { replace: true });
    }
  }, [loading, hasMembership, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
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
