import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase parses the recovery link and creates a session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "At least 8 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      try { await (supabase as any).from("activity_logs").insert({ user_name: user?.email || "unknown", action: "Password Reset", status: "Failed" }); } catch {}
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    try { await (supabase as any).from("activity_logs").insert({ user_name: user?.email || "unknown", action: "Password Reset", status: "Success" }); } catch {}
    if (user) {
      try { await (supabase as any).from("profiles").update({ must_change_password: false }).eq("id", user.id); } catch {}
    }
    toast({ title: "Password updated", description: "Redirecting…" });
    // Determine destination
    if (user) {
      const { data: isAdmin } = await (supabase as any).rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (isAdmin) { navigate("/admin"); return; }
      const { data: memberships } = await (supabase as any)
        .from("workspace_members").select("workspace_id").eq("user_id", user.id).eq("status", "active").limit(1);
      if (memberships && memberships.length > 0) navigate("/app/home");
      else navigate("/portal/documents");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="pt-32 pb-16 lg:pt-40 bg-gradient-hero flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-md">
          <div className="bg-card rounded-2xl shadow-soft border border-border/40 p-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Set a new password</h1>
            <p className="text-sm text-muted-foreground mb-6">
              {ready ? "Enter your new password below." : "Validating your reset link…"}
            </p>
            {ready && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rp-pw">New password</Label>
                  <Input id="rp-pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rp-confirm">Confirm password</Label>
                  <Input id="rp-confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update password
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
