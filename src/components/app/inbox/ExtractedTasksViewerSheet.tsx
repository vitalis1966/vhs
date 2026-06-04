import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExtractedTask } from "./ExtractTasksPanel";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: ExtractedTask[];
  subject?: string | null;
}

export function ExtractedTasksViewerSheet({ open, onOpenChange, tasks, subject }: Props) {
  const [index, setIndex] = useState(0);
  useEffect(() => { if (open) setIndex(0); }, [open, tasks]);
  if (!tasks.length) return null;
  const total = tasks.length;
  const t = tasks[index];
  if (!t) return null;

  const statusLabel = t.status === "saved" ? "Assigned" : t.status === "skipped" ? "Skipped" : "Pending";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Extracted Tasks</SheetTitle>
          {subject && <p className="text-sm text-muted-foreground text-left">{subject}</p>}
        </SheetHeader>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Task {index + 1} of {total}</span>
          {total > 1 && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setIndex(index - 1)} disabled={index === 0}>Back</Button>
              <Button size="sm" variant="outline" onClick={() => setIndex(index + 1)} disabled={index + 1 >= total}>Next</Button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-4 border-t pt-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Title</div>
            <div className="text-base font-medium">{t.title}</div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Badge variant="outline">Priority: {t.priority || "Medium"}</Badge>
            <Badge variant="outline">Status: {statusLabel}</Badge>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Description</div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{t.description || "—"}</pre>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
