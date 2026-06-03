import { useEffect, useState, ReactNode, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";
import { clearPlatform, getPlatform } from "@/lib/platformContext";
import { toast } from "@/hooks/use-toast";

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

    const deny = async (reason?: string) => {
      clearPlatform();
      await supabase.auth.signOut().catch(() => {});
      if (reason) toast({ title: "Access denied", description: reason, variant: "destructive" });
      if (!cancelled) {
        setAuthed(false);
        setChecking(false);
      }
      navigate("/employee-login", { replace: true });
    };

    const check = async (session: any) => {
      if (cancelled) return;
      if (!session) {
        clearPlatform();
        navigate("/employee-login", { replace: true });
        setAuthed(false);
        setChecking(false);
        return;
      }

      if (getPlatform() !== "vitalis_os") {
        await deny("Please sign in to Vitalis OS.");
        return;
      }

      const { data, error } = await (supabase as any).rpc("has_platform_access", {
        _user: session.user.id,
        _platform: "vitalis_os",
      });
      if (cancelled) return;
      if (error || !data) {
        await deny("This account does not have Vitalis OS access.");
        return;
      }

      setAuthed(true);
      setChecking(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => { void check(s); });
    supabase.auth.getSession().then(({ data: { session } }) => { void check(session); });
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
