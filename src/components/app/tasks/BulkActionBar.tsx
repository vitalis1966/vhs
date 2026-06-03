import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle2, CalendarIcon, UserPlus, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { bulkSetStatus, bulkSetDueDate, bulkSetAssignees, softDeleteTasks } from "./taskMutations";
import { MemberList } from "./TaskActionsMenu";
import { DeleteTaskDialog } from "./DeleteTaskDialog";

interface Props {
  workspaceId: string;
  selected: string[];
  onClear: () => void;
}

export function BulkActionBar({ workspaceId, selected, onClear }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [datePopover, setDatePopover] = useState(false);
  const [reassignPopover, setReassignPopover] = useState(false);

  if (!selected.length) return null;

  const handleDelete = async () => {
    const ok = await softDeleteTasks(selected);
    setDeleteOpen(false);
    if (ok) { toast.success(`${selected.length} task${selected.length > 1 ? "s" : ""} deleted`); onClear(); }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-full shadow-elevated px-3 py-2 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2">
      <span className="text-sm font-medium px-2">{selected.length} selected</span>
      <div className="h-5 w-px bg-border mx-1" />

      <Button variant="ghost" size="sm" className="h-8" onClick={async () => {
        const ok = await bulkSetStatus(selected, workspaceId, "done");
        if (ok) { toast.success("Marked complete"); onClear(); }
      }}>
        <CheckCircle2 className="h-4 w-4 mr-1" /> Complete
      </Button>

      <Popover open={reassignPopover} onOpenChange={setReassignPopover}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8"><UserPlus className="h-4 w-4 mr-1" /> Reassign</Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 pointer-events-auto" align="center">
          <MemberList
            workspaceId={workspaceId}
            initial={[]}
            onApply={async (ids) => {
              await bulkSetAssignees(selected, ids);
              setReassignPopover(false);
              toast.success("Assignees updated");
              onClear();
            }}
            onCancel={() => setReassignPopover(false)}
          />
        </PopoverContent>
      </Popover>

      <Popover open={datePopover} onOpenChange={setDatePopover}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8"><CalendarIcon className="h-4 w-4 mr-1" /> Due date</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="center">
          <Calendar
            mode="single"
            onSelect={async (d) => {
              const iso = d ? format(d, "yyyy-MM-dd") : null;
              const ok = await bulkSetDueDate(selected, iso);
              setDatePopover(false);
              if (ok) { toast.success("Due date updated"); onClear(); }
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
        <Trash2 className="h-4 w-4 mr-1" /> Delete
      </Button>

      <div className="h-5 w-px bg-border mx-1" />
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClear} aria-label="Clear selection">
        <X className="h-4 w-4" />
      </Button>

      <DeleteTaskDialog open={deleteOpen} onOpenChange={setDeleteOpen} count={selected.length} onConfirm={handleDelete} />
    </div>
  );
}
