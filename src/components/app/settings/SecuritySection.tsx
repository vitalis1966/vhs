import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function SecuritySection() {
  const { workspace, workspaceId, refresh } = useWorkspace();
  const { toast } = useToast();
  const [cfg, setCfg] = useState<any>({
    require_email_confirmation: true,
    session_timeout: "8h",
    allow_self_registration: false,
    allowed_domain: "",
    activity_retention: "90d",
  });
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (workspace?.security_config) setCfg({ ...cfg, ...workspace.security_config });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  useEffect(() => {
    if (!workspaceId) return;
    (async () => {
      const { data } = await (supabase as any).from("activities")
        .select("id, created_at, verb, target_type, target_id, metadata, actor:profiles!activities_actor_id_fkey(full_name, email)")
        .eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(100);
      setLogs(data ?? []);
    })();
  }, [workspaceId]);

  const save = async () => {
    if (!workspaceId) return;
    setSaving(true);
    const { error } = await (supabase as any).from("workspaces").update({ security_config: cfg }).eq("id", workspaceId);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Security settings saved" });
    await refresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Security</CardTitle><CardDescription>Workspace access and session controls.</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between border rounded-md p-3">
            <div><Label>Require Email Confirmation</Label><p className="text-xs text-muted-foreground">New invites must confirm their email before activation.</p></div>
            <Switch checked={!!cfg.require_email_confirmation} onCheckedChange={(v) => setCfg({ ...cfg, require_email_confirmation: v })} />
          </div>
          <div>
            <Label>Session Timeout</Label>
            <Select value={cfg.session_timeout} onValueChange={(v) => setCfg({ ...cfg, session_timeout: v })}>
              <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[["1h","1 hour"],["4h","4 hours"],["8h","8 hours"],["24h","24 hours"],["7d","7 days"],["never","Never"]].map(([v,l]) =>
                  <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between border rounded-md p-3">
            <div><Label>Allow Employee Self-Registration</Label><p className="text-xs text-muted-foreground">Users matching the allowed domain are auto-added as Team Members.</p></div>
            <Switch checked={!!cfg.allow_self_registration} onCheckedChange={(v) => setCfg({ ...cfg, allow_self_registration: v })} />
          </div>
          {cfg.allow_self_registration && (
            <div>
              <Label>Allowed Email Domain</Label>
              <Input placeholder="vitalisstrategies.com" value={cfg.allowed_domain} onChange={(e) => setCfg({ ...cfg, allowed_domain: e.target.value })} />
            </div>
          )}
          <div>
            <Label>Activity Log Retention</Label>
            <Select value={cfg.activity_retention} onValueChange={(v) => setCfg({ ...cfg, activity_retention: v })}>
              <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[["30d","30 days"],["90d","90 days"],["180d","180 days"],["1y","1 year"],["forever","Forever"]].map(([v,l]) =>
                  <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Audit Log</CardTitle><CardDescription>Most recent 100 workspace activities.</CardDescription></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-2 pr-3">When</th><th className="py-2 pr-3">Actor</th><th className="py-2 pr-3">Action</th><th className="py-2">Target</th>
              </tr></thead>
              <tbody>
                {logs.length === 0 ? <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No activity yet.</td></tr>
                : logs.map((l) => (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{formatDistanceToNow(new Date(l.created_at), { addSuffix: true })}</td>
                    <td className="py-2 pr-3">{l.actor?.full_name ?? l.actor?.email ?? "System"}</td>
                    <td className="py-2 pr-3">{l.verb}</td>
                    <td className="py-2 text-xs text-muted-foreground">{l.target_type ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
