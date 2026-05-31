import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const check = async (session: any) => {
      if (!session) {
        navigate("/admin/login", { replace: true });
        if (!cancelled) setLoading(false);
        return;
      }
      const { data, error } = await (supabase as any).rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (cancelled) return;
      if (error || !data) {
        // Not an admin. If they have an active workspace membership, send them
        // into the platform instead of signing them out.
        const { data: memberships } = await (supabase as any)
          .from("workspace_members")
          .select("workspace_id")
          .eq("user_id", session.user.id)
          .eq("status", "active")
          .limit(1);
        if (memberships && memberships.length > 0) {
          navigate("/app/home", { replace: true });
        } else {
          await supabase.auth.signOut();
          navigate("/admin/login", { replace: true });
        }
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
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
