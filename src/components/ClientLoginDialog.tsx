import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientLoginDialog({ open, onOpenChange }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const navigate = useNavigate();

  const logActivity = async (userName: string, status: "Success" | "Failed") => {
    try {
      await (supabase as any).from("activity_logs").insert({
        user_name: userName,
        action: "Login",
        status,
      });
    } catch (e) { /* swallow */ }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      await logActivity(email, "Failed");
      toast({ title: "Sign-in failed", description: error?.message || "Invalid credentials", variant: "destructive" });
      setLoading(false);
      return;
    }

    const userId = data.session.user.id;
    const [{ data: isClient }, { data: isAdmin }] = await Promise.all([
      (supabase as any).rpc("has_role", { _user_id: userId, _role: "client" }),
      (supabase as any).rpc("has_role", { _user_id: userId, _role: "admin" }),
    ]);

    await logActivity(email, "Success");

    if (isClient) {
      onOpenChange(false);
      navigate("/portal/documents");
    } else if (isAdmin) {
      onOpenChange(false);
      navigate("/admin");
    } else {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "This account has no access.", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Couldn't send reset email", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "Password reset link sent." });
      setForgotMode(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {forgotMode ? "Reset your password" : "Client Login"}
          </DialogTitle>
          <DialogDescription>
            {forgotMode
              ? "Enter your email and we'll send you a reset link."
              : "Sign in to access your documentation portal."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={forgotMode ? handleForgot : handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-login-email">Email</Label>
            <Input id="client-login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          {!forgotMode && (
            <div className="space-y-2">
              <Label htmlFor="client-login-password">Password</Label>
              <Input id="client-login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
          )}
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {forgotMode ? "Send reset link" : "Sign in"}
          </Button>
          <button
            type="button"
            onClick={() => setForgotMode((v) => !v)}
            className="text-sm text-primary hover:underline w-full text-center"
          >
            {forgotMode ? "Back to sign in" : "Forgot my password?"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
