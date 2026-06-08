import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Play, Square, Pencil, Plus, Clock } from "lucide-react";
import { useTimer } from "@/contexts/TimerContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import { TimeEntryFormFields, type TimeEntryFields } from "./TimeEntryFormFields";
import { formatDuration } from "@/lib/timeFormat";
import { ManualEntryDialog } from "./ManualEntryDialog";
import { toast } from "sonner";

interface StartPanelProps { defaultClientId?: string | null; onStarted?: () => void; onAddManually?: () => void; }

function StartPanel({ defaultClientId, onStarted, onAddManually }: StartPanelProps) {
  const { workspaceId, userId } = useWorkspace();
  const { startTimer } = useTimer();
  const [fields, setFields] = useState<TimeEntryFields>({
    client_id: defaultClientId ?? null, project_id: null, task_id: null,
    activity_type_id: null, description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!workspaceId || !userId) return;
    (async () => {
      const { data } = await (supabase as any)
        .from("time_tracking_settings").select("default_activity_type_id")
        .eq("user_id", userId).eq("workspace_id", workspaceId).maybeSingle();
      if (data?.default_activity_type_id && !fields.activity_type_id) {
        setFields((f) => ({ ...f, activity_type_id: data.default_activity_type_id }));
      } else if (!fields.activity_type_id) {
        const { data: def } = await (supabase as any)
          .from("time_activity_types").select("id")
          .eq("workspace_id", workspaceId).eq("is_default", true).maybeSingle();
        if (def) setFields((f) => ({ ...f, activity_type_id: def.id }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, userId]);

  const onStart = async () => {
    if (!fields.client_id || !fields.activity_type_id) {
      toast.error("Client and activity type are required"); return;
    }
    setSubmitting(true);
    const ok = await startTimer({
      client_id: fields.client_id,
      project_id: fields.project_id,
      task_id: fields.task_id,
      activity_type_id: fields.activity_type_id,
      description: fields.description?.trim() || null,
    });
    setSubmitting(false);
    if (ok) onStarted?.();
  };

  return (
    <div className="space-y-4">
      <TimeEntryFormFields value={fields} onChange={setFields} />
      <DialogFooter className="sm:justify-between gap-2">
        {onAddManually ? (
          <Button variant="ghost" size="sm" onClick={onAddManually} type="button">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add hours manually
          </Button>
        ) : <span />}
        <Button onClick={onStart} disabled={submitting}>
          <Play className="h-4 w-4 mr-2" /> Start Timer
        </Button>
      </DialogFooter>
    </div>
  );
}

function RunningPanel({ onClose }: { onClose: () => void }) {
  const { running, updateRunning } = useTimer();
  const [fields, setFields] = useState<TimeEntryFields>({
    client_id: running?.client_id ?? null,
    project_id: running?.project_id ?? null,
    task_id: running?.task_id ?? null,
    activity_type_id: running?.activity_type_id ?? null,
    description: running?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  if (!running) return null;
  const save = async () => {
    if (!fields.client_id || !fields.activity_type_id) {
      toast.error("Client and activity type are required"); return;
    }
    setSaving(true);
    await updateRunning({
      client_id: fields.client_id,
      project_id: fields.project_id,
      task_id: fields.task_id,
      activity_type_id: fields.activity_type_id,
      description: fields.description?.trim() || null,
    });
    setSaving(false);
    toast.success("Timer updated");
    onClose();
  };
  return (
    <div className="w-[340px] space-y-3">
      <div className="font-medium text-sm">Edit running timer</div>
      <TimeEntryFormFields value={fields} onChange={setFields} />
      <Button onClick={save} disabled={saving} className="w-full" size="sm">Save changes</Button>
    </div>
  );
}

export function TimerWidget() {
  const { running, elapsedSeconds, stopTimer, loading } = useTimer();
  const [openStart, setOpenStart] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openManual, setOpenManual] = useState(false);

  if (loading) return null;

  if (!running) {
    return (
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" className="gap-1.5 h-9" onClick={() => setOpenStart(true)}>
          <Play className="h-4 w-4 text-emerald-600" />
          <span className="hidden sm:inline text-xs">Start timer</span>
        </Button>
        <Dialog open={openStart} onOpenChange={setOpenStart}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Start Timer</DialogTitle>
            </DialogHeader>
            <StartPanel
              onStarted={() => setOpenStart(false)}
              onAddManually={() => { setOpenStart(false); setOpenManual(true); }}
            />
          </DialogContent>
        </Dialog>
        <ManualEntryDialog open={openManual} onOpenChange={setOpenManual} />
      </div>
    );
  }

  const d = formatDuration(elapsedSeconds);
  return (
    <div className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/60 px-2 py-1 dark:bg-emerald-950/30 dark:border-emerald-900">
      <Clock className="h-4 w-4 text-emerald-600 animate-pulse" />
      <div className="flex flex-col leading-tight">
        <span className="font-mono text-sm font-semibold tabular-nums">{d.hhmmss}</span>
        <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
          {running.client_name} · {running.activity_name}
        </span>
      </div>
      <Popover open={openEdit} onOpenChange={setOpenEdit}>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" className="h-7 w-7" title="Edit timer">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-3">
          <RunningPanel onClose={() => setOpenEdit(false)} />
        </PopoverContent>
      </Popover>
      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600 hover:bg-red-50" onClick={stopTimer} title="Stop timer">
        <Square className="h-3.5 w-3.5 fill-current" />
      </Button>
    </div>
  );
}
