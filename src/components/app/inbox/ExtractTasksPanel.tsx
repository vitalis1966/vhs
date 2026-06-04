import { useEffect, useState } from "react";
import { TaskFormDialog } from "../TaskFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ExtractedTask {
  id?: string;
  title: string;
  description: string;
  priority: string;
  status?: string;
  task_id?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailId: string;
  defaultAssigneeId: string | null;
  tasks: ExtractedTask[];
  onFinished: (savedCount: number) => void;
}

function normalisePriority(p: string): string {
  const v = (p || "").toLowerCase();
  if (v === "high") return "High";
  if (v === "low") return "Low";
  return "Medium";
}

type ReviewState = "pending" | "saved" | "skipped";

export function ExtractTasksPanel({ open, onOpenChange, emailId, defaultAssigneeId, tasks: initialTasks, onFinished }: Props) {
  const [index, setIndex] = useState(0);
  const [tasks, setTasks] = useState<ExtractedTask[]>(initialTasks);
  const [reviewStates, setReviewStates] = useState<ReviewState[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [liveValues, setLiveValues] = useState<{ title: string; summary: string; priority: string } | null>(null);

  useEffect(() => {
    if (open) {
      setIndex(0);
      setTasks(initialTasks);
      setReviewStates(initialTasks.map((t) => (t.status as ReviewState) || "pending"));
      setDialogOpen(true);
      setLiveValues(null);
    }
  }, [open, initialTasks]);

  if (!open || tasks.length === 0) return null;
  const current = tasks[index];
  if (!current) return null;
  const total = tasks.length;
  const savedCount = reviewStates.filter((s) => s === "saved").length;

  const persistStatus = async (taskRowId: string | undefined, status: ReviewState, linkedTaskId?: string | null) => {
    if (!taskRowId) return;
    try {
      const upd: any = { status };
      if (linkedTaskId !== undefined) upd.task_id = linkedTaskId;
      await (supabase as any).from("email_extracted_tasks").update(upd).eq("id", taskRowId);
    } catch (e) {
      console.error(e);
    }
  };

  // Persist current form edits to the draft row + local tasks array
  const captureCurrent = async () => {
    if (!liveValues) return;
    const updated = [...tasks];
    updated[index] = {
      ...updated[index],
      title: liveValues.title,
      description: liveValues.summary,
      priority: (liveValues.priority || "Medium").toLowerCase(),
    };
    setTasks(updated);
    const row = updated[index];
    if (row.id) {
      try {
        await (supabase as any)
          .from("email_extracted_tasks")
          .update({ title: row.title, description: row.description, priority: row.priority })
          .eq("id", row.id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const closeDialogTransiently = () => {
    setDialogOpen(false);
    setTimeout(() => setDialogOpen(true), 50);
  };

  const finish = async () => {
    await captureCurrent();
    setDialogOpen(false);
    onOpenChange(false);
    onFinished(reviewStates.filter((s) => s === "saved").length);
  };

  const handleCreated = async (task: any) => {
    try {
      await (supabase as any).from("email_task_extractions").insert({ email_id: emailId, task_id: task.id });
    } catch (e: any) {
      console.error(e);
      toast.error("Saved task, but failed to link to email");
    }
    await persistStatus(current.id, "saved", task.id);
    const next = [...reviewStates];
    next[index] = "saved";
    setReviewStates(next);

    // Find next non-final task; if none, finish
    const nextIdx = next.findIndex((s, i) => i !== index && s === "pending");
    const allDone = next.every((s) => s !== "pending");
    if (allDone) {
      setDialogOpen(false);
      onOpenChange(false);
      onFinished(next.filter((s) => s === "saved").length);
    } else {
      setIndex(nextIdx >= 0 ? nextIdx : Math.min(index + 1, total - 1));
      closeDialogTransiently();
    }
  };

  const skip = async () => {
    await captureCurrent();
    await persistStatus(current.id, "skipped");
    const next = [...reviewStates];
    next[index] = "skipped";
    setReviewStates(next);
    const allDone = next.every((s) => s !== "pending");
    if (allDone) {
      setDialogOpen(false);
      onOpenChange(false);
      onFinished(next.filter((s) => s === "saved").length);
    } else {
      const nextIdx = next.findIndex((s, i) => i !== index && s === "pending");
      setIndex(nextIdx >= 0 ? nextIdx : Math.min(index + 1, total - 1));
      closeDialogTransiently();
    }
  };

  const back = async () => {
    if (index > 0) {
      await captureCurrent();
      setIndex(index - 1);
      closeDialogTransiently();
    }
  };

  const next = async () => {
    if (index + 1 < total) {
      await captureCurrent();
      setIndex(index + 1);
      closeDialogTransiently();
    }
  };

  const header = (
    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
      <span>Task {index + 1} of {total}{savedCount > 0 ? ` · ${savedCount} saved` : ""}</span>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={back} disabled={index === 0}>Back</Button>
        <Button size="sm" variant="ghost" onClick={next} disabled={index + 1 >= total}>Next</Button>
        <Button size="sm" variant="ghost" onClick={skip}>Skip</Button>
      </div>
    </div>
  );

  return (
    <TaskFormDialog
      key={`${emailId}-${index}`}
      open={dialogOpen}
      onOpenChange={(o) => {
        if (!o && dialogOpen) {
          // Treat manual close as finishing (don't mark as skipped) — preserve progress
          finish();
        }
      }}
      defaultTitle={current.title}
      defaultSummary={current.description}
      defaultPriority={normalisePriority(current.priority)}
      defaultAssigneeId={defaultAssigneeId}
      titleLabel={`Extracted Task ${index + 1} of ${total}`}
      saveLabel="Save Task"
      cancelLabel="Close"
      headerSlot={header}
      onCreated={handleCreated}
    />
  );
}
