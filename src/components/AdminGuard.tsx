import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { clearPlatform, getPlatform } from "@/lib/platformContext";
import { toast } from "@/hooks/use-toast";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const deny = async (reason?: string) => {
      clearPlatform();
      await supabase.auth.signOut().catch(() => {});
      if (reason) {
        toast({ title: "Access denied", description: reason, variant: "destructive" });
      }
      if (!cancelled) {
        setAuthorized(false);
        setLoading(false);
      }
      navigate("/admin/login", { replace: true });
    };

    const check = async (session: any) => {
      if (!session) {
        clearPlatform();
        navigate("/admin/login", { replace: true });
        if (!cancelled) setLoading(false);
        return;
      }

      // Platform context must be VHS for this guard.
      if (getPlatform() !== "vhs") {
        await deny("Please sign in to VHS Administration.");
        return;
      }

      const { data, error } = await (supabase as any).rpc("has_platform_access", {
        _user: session.user.id,
        _platform: "vhs",
      });
      if (cancelled) return;
      if (error || !data) {
        await deny("This account does not have VHS Administration access.");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { void check(session); }
    );

    supabase.auth.getSession().then(({ data: { session } }) => { void check(session); });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
