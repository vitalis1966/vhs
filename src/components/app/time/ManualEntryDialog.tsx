import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TimeEntryFormFields, type TimeEntryFields } from "./TimeEntryFormFields";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { roundSeconds } from "@/lib/timeFormat";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultClientId?: string | null;
  editingId?: string | null;
  onSaved?: () => void;
}

type LastEdited = "range" | "duration";

export function ManualEntryDialog({ open, onOpenChange, defaultClientId, editingId, onSaved }: Props) {
  const { workspaceId, userId } = useWorkspace();
  const [fields, setFields] = useState<TimeEntryFields>({
    client_id: defaultClientId ?? null, project_id: null, task_id: null,
    activity_type_id: null, description: "",
  });
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [last, setLast] = useState<LastEdited>("duration");
  const [saving, setSaving] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open && !editingId) {
      setFields({
        client_id: defaultClientId ?? null, project_id: null, task_id: null,
        activity_type_id: null, description: "",
      });
      setDate(format(new Date(), "yyyy-MM-dd"));
      setStartTime(""); setEndTime(""); setHours(""); setMinutes(""); setLast("duration");
    }
  }, [open, editingId, defaultClientId]);

  // Load existing entry when editing
  useEffect(() => {
    if (!open || !editingId) return;
    (async () => {
      const { data } = await (supabase as any).from("time_entries").select("*").eq("id", editingId).maybeSingle();
      if (!data) return;
      setFields({
        client_id: data.client_id, project_id: data.project_id, task_id: data.task_id,
        activity_type_id: data.activity_type_id, description: data.description ?? "",
      });
      const s = new Date(data.started_at);
      setDate(format(s, "yyyy-MM-dd"));
      setStartTime(format(s, "HH:mm"));
      if (data.ended_at) setEndTime(format(new Date(data.ended_at), "HH:mm"));
      const totalMin = Math.round((data.duration_seconds || 0) / 60);
      setHours(String(Math.floor(totalMin / 60)));
      setMinutes(String(totalMin % 60));
      setLast("range");
    })();
  }, [open, editingId]);

  // Pre-fill default activity
  useEffect(() => {
    if (!open || fields.activity_type_id || !workspaceId || !userId) return;
    (async () => {
      const { data: setting } = await (supabase as any)
        .from("time_tracking_settings").select("default_activity_type_id")
        .eq("user_id", userId).eq("workspace_id", workspaceId).maybeSingle();
      if (setting?.default_activity_type_id) {
        setFields((f) => ({ ...f, activity_type_id: setting.default_activity_type_id }));
        return;
      }
      const { data: def } = await (supabase as any)
        .from("time_activity_types").select("id").eq("workspace_id", workspaceId).eq("is_default", true).maybeSingle();
      if (def) setFields((f) => ({ ...f, activity_type_id: def.id }));
    })();
  }, [open, workspaceId, userId, fields.activity_type_id]);

  const computed = useMemo(() => {
    // Returns { startedAt: Date, endedAt: Date, durationSec } based on "last" precedence
    if (last === "range" && startTime && endTime && date) {
      const s = new Date(`${date}T${startTime}:00`);
      const e = new Date(`${date}T${endTime}:00`);
      const dur = Math.floor((e.getTime() - s.getTime()) / 1000);
      return { startedAt: s, endedAt: e, durationSec: dur };
    }
    if (last === "duration" && (hours || minutes)) {
      const totalSec = (parseInt(hours || "0", 10) * 3600) + (parseInt(minutes || "0", 10) * 60);
      if (totalSec <= 0) return null;
      // Build started_at: use start time if present, else 09:00 on chosen date
      const sBase = startTime ? `${date}T${startTime}:00` : `${date}T09:00:00`;
      const s = new Date(sBase);
      const e = new Date(s.getTime() + totalSec * 1000);
      return { startedAt: s, endedAt: e, durationSec: totalSec };
    }
    return null;
  }, [last, startTime, endTime, hours, minutes, date]);

  const save = async () => {
    if (!fields.client_id || !fields.activity_type_id) {
      toast.error("Client and activity type are required"); return;
    }
    if (!computed) { toast.error("Enter start/end times or a duration"); return; }
    if (computed.durationSec <= 0) { toast.error("Duration must be positive"); return; }
    if (computed.endedAt.getTime() > Date.now()) { toast.error("Cannot log time in the future"); return; }
    if (!workspaceId || !userId) return;

    // Rounding
    let rounding = 0;
    const { data: setting } = await (supabase as any)
      .from("time_tracking_settings").select("rounding_minutes")
      .eq("user_id", userId).eq("workspace_id", workspaceId).maybeSingle();
    rounding = setting?.rounding_minutes ?? 0;
    let durationSec = computed.durationSec;
    const rounded = roundSeconds(durationSec, rounding);
    if (rounded > 0) durationSec = rounded;
    const endedAt = new Date(computed.startedAt.getTime() + durationSec * 1000);

    setSaving(true);
    let res;
    if (editingId) {
      res = await (supabase as any).from("time_entries").update({
        client_id: fields.client_id,
        project_id: fields.project_id,
        task_id: fields.task_id,
        activity_type_id: fields.activity_type_id,
        description: fields.description?.trim() || null,
        started_at: computed.startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
      }).eq("id", editingId);
    } else {
      res = await (supabase as any).from("time_entries").insert({
        user_id: userId,
        workspace_id: workspaceId,
        client_id: fields.client_id,
        project_id: fields.project_id,
        task_id: fields.task_id,
        activity_type_id: fields.activity_type_id,
        description: fields.description?.trim() || null,
        started_at: computed.startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        is_manual: true,
        source: "manual",
      });
    }
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(editingId ? "Entry updated" : "Hours added");
    onSaved?.();
    onOpenChange(false);

    // Budget alerts (non-blocking)
    try {
      supabase.functions.invoke("notify-budget-threshold", {
        body: { client_id: fields.client_id, activity_type_id: fields.activity_type_id }
      });
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{editingId ? "Edit time entry" : "Add hours"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Date *</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={format(new Date(), "yyyy-MM-dd")} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Start time</Label>
              <Input type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); setLast("range"); }} />
            </div>
            <div>
              <Label className="text-xs">End time</Label>
              <Input type="time" value={endTime} onChange={(e) => { setEndTime(e.target.value); setLast("range"); }} />
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground">— or duration —</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Hours</Label>
              <Input type="number" min={0} value={hours} onChange={(e) => { setHours(e.target.value); setLast("duration"); }} />
            </div>
            <div>
              <Label className="text-xs">Minutes</Label>
              <Input type="number" min={0} max={59} value={minutes} onChange={(e) => { setMinutes(e.target.value); setLast("duration"); }} />
            </div>
          </div>
          <TimeEntryFormFields value={fields} onChange={setFields} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{editingId ? "Save" : "Add hours"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
