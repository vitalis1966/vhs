import { useEffect, useMemo, useRef, useState } from "react";
import { TaskFormDialog, type TaskFormValues } from "../TaskFormDialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export interface ExtractedTask {
  id?: string;
  title: string;
  description: string;
  priority: string;
  status?: string;
  task_id?: string | null;
}

export interface PanelFinishSummary {
  saved: number;
  skipped: number;
  deferred: number;
  pending: number;
  total: number;
  closedMidFlow: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailId: string;
  defaultAssigneeId: string | null;
  tasks: ExtractedTask[];
  onFinished: (summary: PanelFinishSummary) => void;
}

function normalisePriority(p: string): string {
  const v = (p || "").toLowerCase();
  if (v === "high") return "High";
  if (v === "low") return "Low";
  return "Medium";
}

type ReviewState = "pending" | "saved" | "skipped" | "deferred";

interface DraftCache {
  formByIndex: Record<number, Partial<TaskFormValues>>;
  reviewStates: ReviewState[];
}

const storageKey = (emailId: string) => `vitalis:extract-draft:${emailId}`;

function loadDraft(emailId: string): DraftCache | null {
  try {
    const raw = sessionStorage.getItem(storageKey(emailId));
    if (!raw) return null;
    return JSON.parse(raw) as DraftCache;
  } catch { return null; }
}

function saveDraft(emailId: string, draft: DraftCache) {
  try { sessionStorage.setItem(storageKey(emailId), JSON.stringify(draft)); } catch {}
}

function clearDraft(emailId: string) {
  try { sessionStorage.removeItem(storageKey(emailId)); } catch {}
}

export function ExtractTasksPanel({ open, onOpenChange, emailId, defaultAssigneeId, tasks: initialTasks, onFinished }: Props) {
  // Hydrate from sessionStorage + the extracted-tasks list passed in.
  const hydrated = useMemo(() => {
    const draft = loadDraft(emailId);
    const baseStates: ReviewState[] = initialTasks.map((t) => {
      const s = (t.status as ReviewState) || "pending";
      return s === "saved" || s === "skipped" ? s : "pending";
    });
    if (draft?.reviewStates?.length === initialTasks.length) {
      // Merge: prefer DB-final states (saved/skipped) over cached, otherwise use cached value (covers deferred).
      const merged = baseStates.map((db, i) => {
        if (db === "saved" || db === "skipped") return db;
        return draft.reviewStates[i] ?? db;
      });
      return { tasks: initialTasks, reviewStates: merged, formByIndex: draft.formByIndex ?? {} };
    }
    return { tasks: initialTasks, reviewStates: baseStates, formByIndex: {} as Record<number, Partial<TaskFormValues>> };
  }, [emailId, initialTasks]);

  // Filter visible indices: if any deferred entries exist, only show those (re-open flow).
  const visibleIndices = useMemo(() => {
    const all = hydrated.tasks.map((_, i) => i);
    const hasDeferred = hydrated.reviewStates.some((s) => s === "deferred");
    if (hasDeferred) return all.filter((i) => hydrated.reviewStates[i] === "deferred" || hydrated.reviewStates[i] === "pending");
    return all.filter((i) => hydrated.reviewStates[i] === "pending");
  }, [hydrated]);

  const [reviewStates, setReviewStates] = useState<ReviewState[]>(hydrated.reviewStates);
  const [formByIndex, setFormByIndex] = useState<Record<number, Partial<TaskFormValues>>>(hydrated.formByIndex);
  const [visible, setVisible] = useState<number[]>(visibleIndices);
  const [pos, setPos] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const liveRef = useRef<TaskFormValues | null>(null);
  const finishedRef = useRef(false);

  // Reset when panel opens for an email
  useEffect(() => {
    if (open) {
      setReviewStates(hydrated.reviewStates);
      setFormByIndex(hydrated.formByIndex);
      setVisible(visibleIndices);
      setPos(0);
      setDialogOpen(true);
      finishedRef.current = false;
      liveRef.current = null;
    } else {
      setDialogOpen(false);
    }
  }, [open, hydrated, visibleIndices]);

  // Persist draft to sessionStorage on changes (while open)
  useEffect(() => {
    if (!open) return;
    saveDraft(emailId, { formByIndex, reviewStates });
  }, [open, emailId, formByIndex, reviewStates]);

  if (!open || !hydrated.tasks.length || !visible.length) return null;
  const total = visible.length;
  const currentIndex = visible[Math.min(pos, total - 1)];
  if (currentIndex === undefined) return null;
  const current = hydrated.tasks[currentIndex];
  if (!current) return null;
  const savedCount = reviewStates.filter((s) => s === "saved").length;

  const summarize = (states: ReviewState[], closedMidFlow: boolean): PanelFinishSummary => ({
    saved: states.filter((s) => s === "saved").length,
    skipped: states.filter((s) => s === "skipped").length,
    deferred: states.filter((s) => s === "deferred").length,
    pending: states.filter((s) => s === "pending").length,
    total: hydrated.tasks.length,
    closedMidFlow,
  });

  const persistDbStatus = async (taskRowId: string | undefined, status: "saved" | "skipped", linkedTaskId?: string | null) => {
    if (!taskRowId) return;
    try {
      const upd: any = { status };
      if (linkedTaskId !== undefined) upd.task_id = linkedTaskId;
      await (supabase as any).from("email_extracted_tasks").update(upd).eq("id", taskRowId);
    } catch (e) { console.error(e); }
  };

  // Capture the form for the current step into formByIndex, and persist draft text to DB row.
  const captureCurrent = async () => {
    const v = liveRef.current;
    if (!v) return;
    setFormByIndex((m) => ({ ...m, [currentIndex]: v }));
    const row = hydrated.tasks[currentIndex];
    if (row?.id) {
      try {
        await (supabase as any)
          .from("email_extracted_tasks")
          .update({ title: v.title, description: v.summary, priority: (v.priority || "Medium").toLowerCase() })
          .eq("id", row.id);
      } catch (e) { console.error(e); }
    }
  };

  const finish = (states: ReviewState[]) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setDialogOpen(false);
    clearDraft(emailId);
    onOpenChange(false);
    onFinished(summarize(states, false));
  };

  const advanceOrFinish = (states: ReviewState[]) => {
    // Recompute visible (deferred + pending) and try to land on the next index after current.
    const hasDeferred = states.some((s) => s === "deferred");
    const nextVisible = hydrated.tasks.map((_, i) => i).filter((i) => {
      const s = states[i];
      if (hasDeferred) return s === "deferred" || s === "pending";
      return s === "pending";
    });
    if (!nextVisible.length) {
      finish(states);
      return;
    }
    setVisible(nextVisible);
    // Find next visible index after currentIndex
    const nextIdx = nextVisible.findIndex((i) => i > currentIndex);
    setPos(nextIdx >= 0 ? nextIdx : 0);
  };

  const handleCreated = async (_task: any) => {
    try {
      await (supabase as any).from("email_task_extractions").insert({ email_id: emailId, task_id: _task.id });
    } catch (e) {
      console.error(e);
      toast.error("Saved task, but failed to link to email");
    }
    await persistDbStatus(current.id, "saved", _task.id);
    const next = [...reviewStates];
    next[currentIndex] = "saved";
    setReviewStates(next);
    advanceOrFinish(next);
  };

  const doSkipYes = async () => {
    setSkipDialogOpen(false);
    await persistDbStatus(current.id, "skipped");
    const next = [...reviewStates];
    next[currentIndex] = "skipped";
    setReviewStates(next);
    advanceOrFinish(next);
  };

  const doSkipLater = async () => {
    setSkipDialogOpen(false);
    await captureCurrent();
    const next = [...reviewStates];
    next[currentIndex] = "deferred";
    setReviewStates(next);
    advanceOrFinish(next);
  };

  const back = async () => {
    if (pos > 0) {
      await captureCurrent();
      setPos(pos - 1);
    }
  };

  const next = async () => {
    if (pos + 1 < total) {
      await captureCurrent();
      setPos(pos + 1);
    }
  };

  const handleClose = async () => {
    if (finishedRef.current) return;
    await captureCurrent();
    setDialogOpen(false);
    onOpenChange(false);
    // Mid-flow close: do not change email status / action.
    onFinished(summarize(reviewStates, true));
  };

  const cached = formByIndex[currentIndex];
  const seedTitle = cached?.title ?? current.title;
  const seedSummary = cached?.summary ?? current.description;
  const seedPriority = cached?.priority ?? normalisePriority(current.priority);
  const seedAssignee = (cached?.assigneeId && cached.assigneeId !== "unassigned") ? cached.assigneeId : (defaultAssigneeId ?? null);
  const seedClient = cached?.clientId || undefined;
  const seedProject = cached?.projectId && cached.projectId !== "none" ? cached.projectId : undefined;
  const seedDue = cached?.dueDate || undefined;
  const seedStatus = cached?.statusId || undefined;

  const header = (
    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
      <span>Task {pos + 1} of {total}{savedCount > 0 ? ` · ${savedCount} saved` : ""}</span>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={back} disabled={pos === 0}>Back</Button>
        <Button size="sm" variant="ghost" onClick={next} disabled={pos + 1 >= total}>Next</Button>
        <Button size="sm" variant="ghost" onClick={() => setSkipDialogOpen(true)}>Skip</Button>
      </div>
    </div>
  );

  return (
    <>
      <TaskFormDialog
        key={`${emailId}`}
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!o && dialogOpen && !finishedRef.current) handleClose();
        }}
        defaultsKey={`${emailId}-${currentIndex}`}
        keepOpenOnSave
        defaultTitle={seedTitle}
        defaultSummary={seedSummary}
        defaultPriority={seedPriority}
        defaultAssigneeId={seedAssignee}
        defaultClientId={seedClient}
        defaultProjectId={seedProject}
        defaultDueDate={seedDue}
        defaultStatusId={seedStatus}
        titleLabel={`Extracted Task ${pos + 1} of ${total}`}
        saveLabel="Save Task"
        cancelLabel="Close"
        headerSlot={header}
        onCreated={handleCreated}
        onValuesChange={(v) => { liveRef.current = v; }}
      />

      <AlertDialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skip this task?</AlertDialogTitle>
            <AlertDialogDescription>Do you want to skip creating this task?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setSkipDialogOpen(false)}>No</Button>
            <Button variant="outline" onClick={doSkipLater}>Later</Button>
            <Button onClick={doSkipYes}>Yes</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
