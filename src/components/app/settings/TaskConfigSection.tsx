import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, GripVertical } from "lucide-react";

type Status = { id: string; name: string; category: string; color: string; position: number };

export function TaskConfigSection() {
  const { workspace, workspaceId, refresh } = useWorkspace();
  const { toast } = useToast();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [defaults, setDefaults] = useState({ priority: "Medium", due_offset_days: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (workspace?.workspace_config) {
      setDefaults({
        priority: workspace.workspace_config.default_priority ?? "Medium",
        due_offset_days: workspace.workspace_config.default_due_offset_days ?? 0,
      });
    }
  }, [workspace]);

  const load = async () => {
    if (!workspaceId) return;
    const { data } = await (supabase as any).from("task_statuses").select("*").eq("workspace_id", workspaceId).order("position");
    setStatuses(data ?? []);
  };
  useEffect(() => { void load(); }, [workspaceId]);

  const updateStatus = async (s: Status, patch: Partial<Status>) => {
    await (supabase as any).from("task_statuses").update(patch).eq("id", s.id);
    void load();
  };
  const addStatus = async () => {
    if (!workspaceId) return;
    await (supabase as any).from("task_statuses").insert({
      workspace_id: workspaceId, name: "New Status", category: "active", color: "#3b82f6", position: statuses.length,
    });
    void load();
  };
  const deleteStatus = async (s: Status) => {
    const { count } = await (supabase as any).from("tasks").select("id", { count: "exact", head: true }).eq("status_id", s.id);
    if ((count ?? 0) > 0) { toast({ title: "Status in use", description: "Reassign tasks before deleting.", variant: "destructive" }); return; }
    await (supabase as any).from("task_statuses").delete().eq("id", s.id);
    void load();
  };
  const move = async (s: Status, dir: -1 | 1) => {
    const idx = statuses.findIndex((x) => x.id === s.id);
    const swap = statuses[idx + dir];
    if (!swap) return;
    await (supabase as any).from("task_statuses").update({ position: swap.position }).eq("id", s.id);
    await (supabase as any).from("task_statuses").update({ position: s.position }).eq("id", swap.id);
    void load();
  };

  const saveDefaults = async () => {
    if (!workspaceId) return;
    setSaving(true);
    const cfg = { ...(workspace?.workspace_config ?? {}), default_priority: defaults.priority, default_due_offset_days: Number(defaults.due_offset_days) };
    const { error } = await (supabase as any).from("workspaces").update({ workspace_config: cfg }).eq("id", workspaceId);
    setSaving(false);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Task defaults saved" });
    await refresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle>Task Statuses</CardTitle><CardDescription>Customize statuses available for tasks.</CardDescription></div>
          <Button size="sm" onClick={addStatus}><Plus className="h-4 w-4 mr-2" />Add Status</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {statuses.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 border rounded-md p-2">
                <button onClick={() => move(s, -1)} disabled={i === 0} className="text-muted-foreground disabled:opacity-30"><GripVertical className="h-4 w-4" /></button>
                <Input value={s.name} onChange={(e) => setStatuses(statuses.map(x => x.id === s.id ? { ...x, name: e.target.value } : x))}
                  onBlur={() => updateStatus(s, { name: s.name })} className="max-w-xs" />
                <span className="text-xs px-2 py-1 rounded bg-muted">{s.category}</span>
                <input type="color" value={s.color} onChange={(e) => updateStatus(s, { color: e.target.value })} className="h-8 w-12 rounded border" />
                <div className="flex-1" />
                <Button variant="ghost" size="icon" onClick={() => deleteStatus(s)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Default Task Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Default Priority</Label>
              <Select value={defaults.priority} onValueChange={(v) => setDefaults({ ...defaults, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Low","Medium","High","Urgent"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Default Due Date Offset (days)</Label>
              <Input type="number" min={0} value={defaults.due_offset_days}
                onChange={(e) => setDefaults({ ...defaults, due_offset_days: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveDefaults} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save Defaults</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
