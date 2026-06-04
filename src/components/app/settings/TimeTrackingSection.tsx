import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, GripVertical, Plus, Star } from "lucide-react";
import { toast } from "sonner";

interface ActivityType {
  id: string;
  name: string;
  position: number;
  is_active: boolean;
  is_default: boolean;
}

interface UserPref {
  rounding_minutes: number;
  reminder_time: string | null;
  reminder_enabled: boolean;
  show_widget: boolean;
  show_decimal: boolean;
  default_activity_type_id: string | null;
}

export function TimeTrackingSection() {
  const { workspaceId, userId, role } = useWorkspace();
  const isAdmin = role === "admin";
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [newName, setNewName] = useState("");
  const [pref, setPref] = useState<UserPref>({
    rounding_minutes: 0, reminder_time: null, reminder_enabled: false,
    show_widget: true, show_decimal: true, default_activity_type_id: null,
  });

  const load = useCallback(async () => {
    if (!workspaceId || !userId) return;
    const [{ data: a }, { data: p }] = await Promise.all([
      (supabase as any).from("time_activity_types").select("*").eq("workspace_id", workspaceId).order("position"),
      (supabase as any).from("time_tracking_settings").select("*").eq("user_id", userId).eq("workspace_id", workspaceId).maybeSingle(),
    ]);
    setActivities(a ?? []);
    if (p) setPref({
      rounding_minutes: p.rounding_minutes ?? 0,
      reminder_time: p.reminder_time ?? null,
      reminder_enabled: !!p.reminder_enabled,
      show_widget: p.show_widget ?? true,
      show_decimal: p.show_decimal ?? true,
      default_activity_type_id: p.default_activity_type_id ?? null,
    });
  }, [workspaceId, userId]);

  useEffect(() => { load(); }, [load]);

  const addActivity = async () => {
    if (!newName.trim()) return;
    const pos = activities.length;
    const { error } = await (supabase as any).from("time_activity_types").insert({
      workspace_id: workspaceId, name: newName.trim(), position: pos, is_active: true,
    });
    if (error) { toast.error(error.message); return; }
    setNewName(""); load();
  };

  const rename = async (id: string, name: string) => {
    await (supabase as any).from("time_activity_types").update({ name }).eq("id", id);
    load();
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    await (supabase as any).from("time_activity_types").update({ is_active }).eq("id", id);
    load();
  };

  const removeActivity = async (id: string) => {
    if (!confirm("Remove this activity? Existing entries will keep their reference but the option will hide.")) return;
    const { error } = await (supabase as any).from("time_activity_types").delete().eq("id", id);
    if (error) {
      // If FK blocks delete, just deactivate
      await (supabase as any).from("time_activity_types").update({ is_active: false }).eq("id", id);
      toast.success("Activity hidden (in use by existing entries)");
    }
    load();
  };

  const reorder = async (id: string, dir: -1 | 1) => {
    const idx = activities.findIndex((a) => a.id === id);
    const swap = activities[idx + dir];
    if (!swap) return;
    await Promise.all([
      (supabase as any).from("time_activity_types").update({ position: swap.position }).eq("id", id),
      (supabase as any).from("time_activity_types").update({ position: activities[idx].position }).eq("id", swap.id),
    ]);
    load();
  };

  const setAsDefault = async (id: string) => {
    await (supabase as any).from("time_activity_types").update({ is_default: false }).eq("workspace_id", workspaceId).neq("id", id);
    await (supabase as any).from("time_activity_types").update({ is_default: true }).eq("id", id);
    load();
  };

  const savePref = async (next: UserPref) => {
    setPref(next);
    if (!userId || !workspaceId) return;
    await (supabase as any).from("time_tracking_settings").upsert({
      user_id: userId,
      workspace_id: workspaceId,
      rounding_minutes: next.rounding_minutes,
      reminder_time: next.reminder_time,
      reminder_enabled: next.reminder_enabled,
      show_widget: next.show_widget,
      show_decimal: next.show_decimal,
      default_activity_type_id: next.default_activity_type_id,
    }, { onConflict: "user_id,workspace_id" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-1">Time Tracking</h2>
        <p className="text-sm text-muted-foreground">Activity types, rounding, reminders, and your personal preferences.</p>
      </div>

      {isAdmin && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Activity types</h3>
          <div className="border border-border rounded-md divide-y divide-border bg-card">
            {activities.map((a, i) => (
              <div key={a.id} className="flex items-center gap-2 px-3 py-2">
                <div className="flex flex-col">
                  <button onClick={() => reorder(a.id, -1)} disabled={i === 0} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">▲</button>
                  <button onClick={() => reorder(a.id, 1)} disabled={i === activities.length - 1} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">▼</button>
                </div>
                <Input
                  className="h-8 flex-1"
                  defaultValue={a.name}
                  onBlur={(e) => { if (e.target.value !== a.name) rename(a.id, e.target.value); }}
                />
                <Button variant={a.is_default ? "default" : "ghost"} size="sm" onClick={() => setAsDefault(a.id)} title="Set as default">
                  <Star className={`h-3.5 w-3.5 ${a.is_default ? "fill-current" : ""}`} />
                </Button>
                <Switch checked={a.is_active} onCheckedChange={(v) => toggleActive(a.id, v)} />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => removeActivity(a.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="New activity type" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button onClick={addActivity}><Plus className="h-4 w-4 mr-1.5" /> Add</Button>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Your preferences</h3>
        <div className="border border-border rounded-md bg-card divide-y divide-border">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Show timer widget</div>
              <div className="text-xs text-muted-foreground">Display the live timer in the top bar.</div>
            </div>
            <Switch checked={pref.show_widget} onCheckedChange={(v) => savePref({ ...pref, show_widget: v })} />
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Show decimal hours</div>
              <div className="text-xs text-muted-foreground">Show 1.38h alongside 1h 23m throughout the app.</div>
            </div>
            <Switch checked={pref.show_decimal} onCheckedChange={(v) => savePref({ ...pref, show_decimal: v })} />
          </div>
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Round entries to</div>
              <div className="text-xs text-muted-foreground">Applied on save.</div>
            </div>
            <Select value={String(pref.rounding_minutes)} onValueChange={(v) => savePref({ ...pref, rounding_minutes: parseInt(v, 10) })}>
              <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No rounding</SelectItem>
                <SelectItem value="5">Nearest 5 min</SelectItem>
                <SelectItem value="10">Nearest 10 min</SelectItem>
                <SelectItem value="15">Nearest 15 min</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Default activity type</div>
              <div className="text-xs text-muted-foreground">Pre-selected when starting a new timer.</div>
            </div>
            <Select value={pref.default_activity_type_id ?? "__none"} onValueChange={(v) => savePref({ ...pref, default_activity_type_id: v === "__none" ? null : v })}>
              <SelectTrigger className="w-56 h-9"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">None</SelectItem>
                {activities.filter((a) => a.is_active).map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Daily reminder</div>
              <div className="text-xs text-muted-foreground">In-app notification if you haven't started a timer by this time.</div>
            </div>
            <div className="flex items-center gap-2">
              <Input type="time" className="w-32 h-9" value={pref.reminder_time ?? ""} onChange={(e) => savePref({ ...pref, reminder_time: e.target.value || null })} />
              <Switch checked={pref.reminder_enabled} onCheckedChange={(v) => savePref({ ...pref, reminder_enabled: v })} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
