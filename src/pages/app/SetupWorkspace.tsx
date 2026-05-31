import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export default function SetupWorkspace() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId, userEmail, hasMembership, loading, refresh } = useWorkspace();
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && hasMembership) navigate("/app/home", { replace: true });
  }, [loading, hasMembership, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    const { error } = await (supabase as any).rpc("create_workspace_for_user", {
      p_workspace_name: name,
      p_user_id: userId,
      p_full_name: fullName || userEmail || "",
      p_email: userEmail || "",
    });
    if (error) {
      toast({ title: "Could not create workspace", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    await refresh();
    navigate("/app/home", { replace: true });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-soft border border-border/40 p-8">
        <h1 className="font-display text-2xl font-bold mb-2">Set up your workspace</h1>
        <p className="text-sm text-muted-foreground mb-6">Create a workspace to start using the internal platform.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ws-name">Workspace name</Label>
            <Input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Vitalis Health Strategies" />
          </div>
          <div>
            <Label htmlFor="full-name">Your full name</Label>
            <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <Button type="submit" className="w-full" disabled={submitting || !name}>
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create workspace
          </Button>
        </form>
      </div>
    </div>
  );
}
