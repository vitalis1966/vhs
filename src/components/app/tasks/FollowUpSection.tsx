import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { FollowUpBadge } from "./FollowUpBadge";

interface Props {
  taskId: string;
  workspaceId: string;
}

interface FollowUpRow {
  id?: string;
  task_id: string;
  enabled: boolean;
  follow_up_date: string | null;
  follow_up_due_date: string | null;
  remind_before_value: number | null;
  remind_before_unit: "hours" | "days" | "months" | null;
  is_recurring: boolean;
  recurrence_frequency: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | null;
  resource_id: string | null;
  follow_up_status?: string;
}

const empty = (taskId: string): FollowUpRow => ({
  task_id: taskId, enabled: false, follow_up_date: null, follow_up_due_date: null,
  remind_before_value: null, remind_before_unit: null, is_recurring: false,
  recurrence_frequency: null, resource_id: null,
});

// Convert ISO datetime to local datetime-local input value
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
};

export function FollowUpSection({ taskId, workspaceId }: Props) {
  const [row, setRow] = useState<FollowUpRow>(empty(taskId));
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [fu, wm] = await Promise.all([
        (supabase as any).from("task_follow_ups").select("*").eq("task_id", taskId).maybeSingle(),
        (supabase as any).from("workspace_members").select("user_id").eq("workspace_id", workspaceId).eq("status", "active").not("user_id", "is", null),
      ]);
      if (cancelled) return;
      if (fu.data) setRow(fu.data); else setRow(empty(taskId));
      const ids = (wm.data ?? []).map((m: any) => m.user_id);
      if (ids.length) {
        const { data: profs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", ids);
        if (!cancelled) setMembers(profs ?? []);
      }
    })();
    return () => { cancelled = true; };
  }, [taskId, workspaceId]);

  const save = async () => {
    setSaving(true);
    const payload: any = { ...row, task_id: taskId };
    delete payload.follow_up_status;
    const { data, error } = await (supabase as any)
      .from("task_follow_ups")
      .upsert(payload, { onConflict: "task_id" })
      .select()
      .maybeSingle();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    if (data) setRow(data);
    toast.success("Follow up saved");
  };

  const set = <K extends keyof FollowUpRow>(k: K, v: FollowUpRow[K]) => setRow((r) => ({ ...r, [k]: v }));

  return (
    <div className="border-t pt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Follow Up</Label>
          {row.enabled && <FollowUpBadge status={row.follow_up_status as any} />}
        </div>
        <Switch checked={row.enabled} onCheckedChange={(v) => set("enabled", v)} />
      </div>

      {row.enabled && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Follow up date</Label>
              <Input
                type="datetime-local"
                value={toLocalInput(row.follow_up_date)}
                onChange={(e) => set("follow_up_date", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
            <div>
              <Label className="text-xs">Follow up due date</Label>
              <Input
                type="datetime-local"
                value={toLocalInput(row.follow_up_due_date)}
                onChange={(e) => set("follow_up_due_date", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Remind me before</Label>
            <div className="grid grid-cols-[1fr_140px] gap-2">
              <Input
                type="number" min={0}
                value={row.remind_before_value ?? ""}
                onChange={(e) => set("remind_before_value", e.target.value === "" ? null : Number(e.target.value))}
                placeholder="e.g. 2"
              />
              <Select
                value={row.remind_before_unit ?? ""}
                onValueChange={(v) => set("remind_before_unit", v as any)}
              >
                <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs">Recurring</Label>
            <Switch checked={row.is_recurring} onCheckedChange={(v) => set("is_recurring", v)} />
          </div>
          {row.is_recurring && (
            <div>
              <Label className="text-xs">Recurrence</Label>
              <Select
                value={row.recurrence_frequency ?? ""}
                onValueChange={(v) => set("recurrence_frequency", v as any)}
              >
                <SelectTrigger><SelectValue placeholder="Choose frequency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-xs">Follow up resource</Label>
            <Select
              value={row.resource_id ?? "none"}
              onValueChange={(v) => set("resource_id", v === "none" ? null : v)}
            >
              <SelectTrigger><SelectValue placeholder="Choose resource" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email ?? m.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save follow up"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
