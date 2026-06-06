import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, Edit3, CalendarIcon, UserPlus, Copy, Trash2, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { initials } from "@/components/app/taskUtils";
import { setTaskStatus, setTaskDueDate, setTaskAssignees, duplicateTask, softDeleteTasks } from "./taskMutations";
import { DeleteTaskDialog } from "./DeleteTaskDialog";

export interface TaskActionTarget {
  id: string;
  workspaceId: string;
  meetingId?: string | null;
  assigneeIds: string[];
  dueDate: string | null;
}

interface Props {
  task: TaskActionTarget;
  onEdit: (taskId: string) => void;
  onDeleted?: (taskId: string) => void;
  variant?: "menu" | "context";
  children?: React.ReactNode;
}

function Item({ icon: Icon, label, onClick, danger }: { icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted text-left",
        danger && "text-destructive hover:bg-destructive/10",
      )}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

export function TaskActionsMenu({ task, onEdit, onDeleted, variant = "menu", children }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => { setMenuOpen(false); };

  const handleDelete = async () => {
    const ok = await softDeleteTasks([task.id]);
    setDeleteOpen(false);
    if (ok) { toast.success("Task deleted"); onDeleted?.(task.id); }
  };

  const items = (
    <div className="p-1 w-56">
      <Item icon={CheckCircle2} label="Mark as complete" onClick={async () => { close(); const ok = await setTaskStatus(task.id, task.workspaceId, "done"); if (ok) toast.success("Marked complete"); }} />
      <Item icon={Clock} label="Mark as in progress" onClick={async () => { close(); await setTaskStatus(task.id, task.workspaceId, "active"); }} />
      <Item icon={Circle} label="Mark as to do" onClick={async () => { close(); await setTaskStatus(task.id, task.workspaceId, "todo"); }} />
      <div className="my-1 h-px bg-border" />
      <Item icon={Edit3} label="Edit task" onClick={() => { close(); onEdit(task.id); }} />
      <Item icon={CalendarIcon} label="Change due date" onClick={() => { close(); setTimeout(() => setDateOpen(true), 50); }} />
      <Item icon={UserPlus} label="Reassign" onClick={() => { close(); setTimeout(() => setReassignOpen(true), 50); }} />
      <Item icon={Copy} label="Duplicate task" onClick={async () => { close(); const t = await duplicateTask(task.id); if (t) toast.success("Task duplicated"); }} />
      <div className="my-1 h-px bg-border" />
      <Item icon={Trash2} label="Delete task" onClick={() => { close(); setTimeout(() => setDeleteOpen(true), 50); }} danger />
    </div>
  );

  return (
    <>
      {variant === "menu" ? (
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()} aria-label="Task actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-0 w-auto" onClick={(e) => e.stopPropagation()}>
            {items}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <ContextMenu>
          <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
          <ContextMenuContent className="p-0 w-auto">{items}</ContextMenuContent>
        </ContextMenu>
      )}

      <Dialog open={dateOpen} onOpenChange={setDateOpen}>
        <DialogContent className="w-auto max-w-sm p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>Change due date</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="single"
            selected={task.dueDate ? new Date(task.dueDate) : undefined}
            onSelect={async (d) => {
              const iso = d ? format(d, "yyyy-MM-dd") : null;
              const ok = await setTaskDueDate(task.id, iso);
              setDateOpen(false);
              if (ok) toast.success("Due date updated");
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </DialogContent>
      </Dialog>


      <ReassignPopover
        open={reassignOpen}
        onOpenChange={setReassignOpen}
        workspaceId={task.workspaceId}
        value={task.assigneeIds}
        onApply={async (ids) => {
          await setTaskAssignees(task.id, ids);
          setReassignOpen(false);
          toast.success("Assignees updated");
        }}
      />

      <DeleteTaskDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        count={1}
        fromMeeting={!!task.meetingId}
        onConfirm={handleDelete}
      />
    </>
  );
}

export function ReassignPopover({ open, onOpenChange, workspaceId, value, onApply }: {
  open: boolean; onOpenChange: (o: boolean) => void;
  workspaceId: string; value: string[]; onApply: (ids: string[]) => void;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild><span className="hidden" /></PopoverTrigger>
      <PopoverContent className="w-72 p-0 pointer-events-auto" align="start">
        <MemberList workspaceId={workspaceId} initial={value} onApply={onApply} onCancel={() => onOpenChange(false)} />
      </PopoverContent>
    </Popover>
  );
}

export function MemberList({ workspaceId, initial, onApply, onCancel }: {
  workspaceId: string; initial: string[]; onApply: (ids: string[]) => void; onCancel: () => void;
}) {
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [local, setLocal] = useState<string[]>(initial);
  const [q, setQ] = useState("");
  useEffect(() => { setLocal(initial); }, [initial]);
  useEffect(() => {
    (async () => {
      const { data: wm } = await (supabase as any)
        .from("workspace_members").select("user_id")
        .eq("workspace_id", workspaceId).eq("status", "active").not("user_id", "is", null);
      const ids = (wm ?? []).map((r: any) => r.user_id);
      if (!ids.length) { setMembers([]); return; }
      const { data: profs } = await (supabase as any)
        .from("profiles").select("id, full_name, email").in("id", ids);
      setMembers(profs ?? []);
    })();
  }, [workspaceId]);
  const label = (m: any) => m.full_name?.trim() || m.email || "Unknown";
  const filtered = members.filter((m) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (m.full_name ?? "").toLowerCase().includes(s) || (m.email ?? "").toLowerCase().includes(s);
  });
  return (
    <div>
      <div className="p-2 border-b">
        <Input placeholder="Search team…" value={q} onChange={(e) => setQ(e.target.value)} className="h-8" />
      </div>
      <div className="max-h-64 overflow-y-auto p-1">
        {filtered.length === 0 && <div className="px-3 py-4 text-xs text-muted-foreground text-center">No members</div>}
        {filtered.map((m) => {
          const checked = local.includes(m.id);
          return (
            <button key={m.id} type="button"
              onClick={() => setLocal((p) => p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id])}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-left">
              <Checkbox checked={checked} className="pointer-events-none" />
              <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(label(m))}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{label(m)}</div>
                {m.email && m.full_name && <div className="text-[10px] text-muted-foreground truncate">{m.email}</div>}
              </div>
            </button>
          );
        })}
      </div>
      <div className="p-2 border-t flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={() => onApply(local)}>Apply</Button>
      </div>
    </div>
  );
}
