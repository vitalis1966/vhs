import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users } from "lucide-react";

export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("must_change_password")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile?.must_change_password) {
        toast({
          title: "Please set a new password",
          description: "You're using a temporary password. Choose a permanent one to continue.",
        });
        navigate("/reset-password");
        setLoading(false);
        return;
      }

      const { data: memberships } = await (supabase as any)
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", data.user.id)
        .eq("status", "active")
        .limit(1);

      if (memberships && memberships.length > 0) {
        navigate("/app/home");
      } else {
        toast({
          title: "Access not yet granted",
          description: "You do not have access yet. Contact your administrator.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-background pt-20">
        <div className="w-full max-w-sm mx-auto px-4">
          <div className="bg-card rounded-2xl shadow-soft border border-border/40 p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-xl font-bold text-foreground text-center mb-1">
              Team Login
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Sign in to access the Vitalis OS workspace
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@vitalisstrategies.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
