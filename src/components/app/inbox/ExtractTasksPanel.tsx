import { useEffect, useState } from "react";
import { TaskFormDialog } from "../TaskFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ExtractedTask {
  title: string;
  description: string;
  priority: string;
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

export function ExtractTasksPanel({ open, onOpenChange, emailId, defaultAssigneeId, tasks, onFinished }: Props) {
  const [index, setIndex] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setIndex(0);
      setSavedCount(0);
      setDialogOpen(true);
    }
  }, [open]);

  if (!open || tasks.length === 0) return null;
  const current = tasks[index];
  if (!current) return null;
  const total = tasks.length;

  const finish = (count: number) => {
    setDialogOpen(false);
    onOpenChange(false);
    onFinished(count);
  };

  const advance = (didSave: boolean) => {
    const nextSaved = savedCount + (didSave ? 1 : 0);
    setSavedCount(nextSaved);
    if (index + 1 >= total) {
      finish(nextSaved);
    } else {
      setIndex(index + 1);
      // Re-open dialog for next task
      setDialogOpen(false);
      setTimeout(() => setDialogOpen(true), 50);
    }
  };

  const handleCreated = async (task: any) => {
    try {
      await (supabase as any).from("email_task_extractions").insert({ email_id: emailId, task_id: task.id });
    } catch (e: any) {
      console.error(e);
      toast.error("Saved task, but failed to link to email");
    }
    advance(true);
  };

  const skip = () => advance(false);
  const back = () => {
    if (index > 0) {
      setIndex(index - 1);
      setDialogOpen(false);
      setTimeout(() => setDialogOpen(true), 50);
    }
  };

  const header = total > 1 ? (
    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
      <span>Task {index + 1} of {total}</span>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={back} disabled={index === 0}>Back</Button>
        <Button size="sm" variant="ghost" onClick={skip}>Skip</Button>
      </div>
    </div>
  ) : (
    <div className="flex justify-end mt-1">
      <Button size="sm" variant="ghost" onClick={skip}>Skip</Button>
    </div>
  );

  return (
    <TaskFormDialog
      key={index}
      open={dialogOpen}
      onOpenChange={(o) => {
        if (!o) {
          // User closed (e.g. Esc or Cancel) — treat as skip
          if (dialogOpen) advance(false);
        }
      }}
      defaultTitle={current.title}
      defaultSummary={current.description}
      defaultPriority={normalisePriority(current.priority)}
      defaultAssigneeId={defaultAssigneeId}
      titleLabel={total > 1 ? `Extracted Task ${index + 1} of ${total}` : "Extracted Task"}
      saveLabel="Save Task"
      cancelLabel="Skip"
      headerSlot={header}
      onCreated={handleCreated}
    />
  );
}
