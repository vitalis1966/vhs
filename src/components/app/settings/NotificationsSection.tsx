import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function NotificationsSection() {
  const { workspace, workspaceId, refresh } = useWorkspace();
  const { toast } = useToast();
  const [cfg, setCfg] = useState<any>({
    from_name: "Vitalis OS", reply_to: "",
    daily_digest: false, digest_send_time: "07:00",
    notify_admin_new_client: false, notify_admin_overdue: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workspace?.notification_config) {
      setCfg({ ...cfg, ...workspace.notification_config });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  const save = async () => {
    if (!workspaceId) return;
    setSaving(true);
    const { error } = await (supabase as any).from("workspaces").update({ notification_config: cfg }).eq("id", workspaceId);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Notifications saved" });
    await refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Workspace-level email and digest configuration.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>From Name</Label><Input value={cfg.from_name} onChange={(e) => setCfg({ ...cfg, from_name: e.target.value })} /></div>
          <div><Label>Reply-To Email</Label><Input type="email" value={cfg.reply_to} onChange={(e) => setCfg({ ...cfg, reply_to: e.target.value })} /></div>
        </div>

        <div className="flex items-center justify-between border rounded-md p-3">
          <div>
            <Label>Daily Digest</Label>
            <p className="text-xs text-muted-foreground">Send overdue and due-soon notifications as one daily email.</p>
          </div>
          <Switch checked={!!cfg.daily_digest} onCheckedChange={(v) => setCfg({ ...cfg, daily_digest: v })} />
        </div>

        {cfg.daily_digest && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Digest Send Time</Label>
              <Input type="time" value={cfg.digest_send_time} onChange={(e) => setCfg({ ...cfg, digest_send_time: e.target.value })} />
            </div>
            <div>
              <Label>Digest Time Zone</Label>
              <Input value={workspace?.time_zone ?? "America/Edmonton"} readOnly className="bg-muted" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border rounded-md p-3">
          <div>
            <Label>Notify Admin on New Client</Label>
            <p className="text-xs text-muted-foreground">All admins receive an in-app notification when a new client is created.</p>
          </div>
          <Switch checked={!!cfg.notify_admin_new_client} onCheckedChange={(v) => setCfg({ ...cfg, notify_admin_new_client: v })} />
        </div>

        <div className="flex items-center justify-between border rounded-md p-3">
          <div>
            <Label>Notify Admin on Overdue Tasks</Label>
            <p className="text-xs text-muted-foreground">Send a daily summary of overdue tasks across the workspace.</p>
          </div>
          <Switch checked={!!cfg.notify_admin_overdue} onCheckedChange={(v) => setCfg({ ...cfg, notify_admin_overdue: v })} />
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
