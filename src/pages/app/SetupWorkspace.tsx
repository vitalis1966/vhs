import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/**
 * No-access screen. The platform has exactly one shared workspace
 * (Vitalis Health Strategies). Users join by invitation only, so any signed-in
 * user without an active membership lands here.
 */
export default function NoWorkspaceAccess() {
  const navigate = useNavigate();

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-soft border border-border/40 p-8 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">No workspace access</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your account is signed in but is not a member of the Vitalis workspace yet.
          Please contact your administrator to be invited.
        </p>
        <Button variant="outline" className="w-full" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
