import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle2, Circle, Clock, Edit3, CalendarIcon, UserPlus, Copy, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setTaskStatus, setTaskDueDate, duplicateTask, softDeleteTasks } from "./taskMutations";
import { MemberPicker } from "./MemberPicker";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { setTaskAssignees } from "./taskMutations";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  /** "menu" = three-dot dropdown trigger; "context" = wraps children as right-click target */
  variant?: "menu" | "context";
  children?: React.ReactNode;
}

function MenuItems({
  task, onEdit, openDelete, openDatePicker, openReassign,
}: {
  task: TaskActionTarget;
  onEdit: (id: string) => void;
  openDelete: () => void;
  openDatePicker: () => void;
  openReassign: () => void;
}) {
  const Item = ({ icon: Icon, label, onClick, danger }: any) => (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn("w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-muted text-left",
        danger && "text-destructive hover:bg-destructive/10")}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
  return (
    <>
      <Item icon={CheckCircle2} label="Mark as complete" onClick={async () => { await setTaskStatus(task.id, task.workspaceId, "done"); toast.success("Marked complete"); }} />
      <Item icon={Clock} label="Mark as in progress" onClick={async () => { await setTaskStatus(task.id, task.workspaceId, "active"); }} />
      <Item icon={Circle} label="Mark as to do" onClick={async () => { await setTaskStatus(task.id, task.workspaceId, "todo"); }} />
      <div className="my-1 h-px bg-border" />
      <Item icon={Edit3} label="Edit task" onClick={() => onEdit(task.id)} />
      <Item icon={CalendarIcon} label="Change due date" onClick={openDatePicker} />
      <Item icon={UserPlus} label="Reassign" onClick={openReassign} />
      <Item icon={Copy} label="Duplicate task" onClick={async () => { const t = await duplicateTask(task.id); if (t) toast.success("Task duplicated"); }} />
      <div className="my-1 h-px bg-border" />
      <Item icon={Trash2} label="Delete task" onClick={openDelete} danger />
    </>
  );
}

export function TaskActionsMenu({ task, onEdit, onDeleted, variant = "menu", children }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ctxOpen, setCtxOpen] = useState(false);

  const handleDelete = async () => {
    const ok = await softDeleteTasks([task.id]);
    setDeleteOpen(false);
    if (ok) { toast.success("Task deleted"); onDeleted?.(task.id); }
  };

  const renderInline = () => (
    <div className="p-1 w-56">
      <MenuItems
        task={task}
        onEdit={(id) => { setMenuOpen(false); setCtxOpen(false); onEdit(id); }}
        openDelete={() => { setMenuOpen(false); setCtxOpen(false); setDeleteOpen(true); }}
        openDatePicker={() => { setMenuOpen(false); setCtxOpen(false); setDateOpen(true); }}
        openReassign={() => { setMenuOpen(false); setCtxOpen(false); setReassignOpen(true); }}
      />
    </div>
  );

  return (
    <>
      {variant === "menu" ? (
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7"
              onClick={(e) => e.stopPropagation()}
              aria-label="Task actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-0 w-auto" onClick={(e) => e.stopPropagation()}>
            {renderInline()}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <ContextMenu onOpenChange={setCtxOpen}>
          <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
          <ContextMenuContent className="p-0 w-auto">
            {renderInline()}
          </ContextMenuContent>
        </ContextMenu>
      )}

      {/* Date picker popover (uncontrolled trigger, opened via state) */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild><span className="hidden" /></PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
          <Calendar
            mode="single"
            selected={task.dueDate ? new Date(task.dueDate) : undefined}
            onSelect={async (d) => {
              const iso = d ? format(d, "yyyy-MM-dd") : null;
              await setTaskDueDate(task.id, iso);
              setDateOpen(false);
              toast.success("Due date updated");
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Reassign popover */}
      <MemberPicker
        workspaceId={task.workspaceId}
        value={task.assigneeIds}
        onChange={async (ids) => {
          await setTaskAssignees(task.id, ids);
          setReassignOpen(false);
          toast.success("Assignees updated");
        }}
        trigger={
          <span
            // Programmatic open: render a hidden trigger and click via ref isn't trivial,
            // so render a visible-only-when-open invisible anchor. Instead we mount the picker
            // open by syncing state — MemberPicker has its own state. We hide its trigger
            // and use a tiny effect-less invisible button.
            className="hidden"
          />
        }
      />
      {/* Because MemberPicker manages its own open state internally we render a second
          on-demand variant when reassignOpen is true. */}
      {reassignOpen && (
        <ReassignPopover
          workspaceId={task.workspaceId}
          value={task.assigneeIds}
          onClose={() => setReassignOpen(false)}
          taskId={task.id}
        />
      )}

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

function ReassignPopover({ workspaceId, value, onClose, taskId }: { workspaceId: string; value: string[]; onClose: () => void; taskId: string }) {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) onClose(); }}>
      <PopoverTrigger asChild>
        <button type="button" className="fixed left-0 top-0 h-0 w-0 opacity-0 pointer-events-none" aria-hidden />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 pointer-events-auto" align="start" side="bottom">
        <InlineMemberList
          workspaceId={workspaceId}
          initial={value}
          onApply={async (ids) => {
            await setTaskAssignees(taskId, ids);
            setOpen(false); onClose();
            toast.success("Assignees updated");
          }}
          onCancel={() => { setOpen(false); onClose(); }}
        />
      </PopoverContent>
    </Popover>
  );
}

function InlineMemberList({ workspaceId, initial, onApply, onCancel }: {
  workspaceId: string; initial: string[]; onApply: (ids: string[]) => void; onCancel: () => void;
}) {
  // Reuse MemberPicker's render by mounting it without its own trigger:
  // simpler: inline implementation
  return (
    <MemberPickerInline workspaceId={workspaceId} initial={initial} onApply={onApply} onCancel={onCancel} />
  );
}

// Lightweight inline picker used by ReassignPopover
import { useEffect as useEffectInline, useState as useStateInline } from "react";
import { supabase as supabaseInline } from "@/integrations/supabase/client";
import { Input as InputInline } from "@/components/ui/input";
import { Checkbox as CheckboxInline } from "@/components/ui/checkbox";
import { Avatar as AvatarInline, AvatarFallback as AvatarFallbackInline } from "@/components/ui/avatar";
import { initials as initialsInline } from "@/components/app/taskUtils";

function MemberPickerInline({ workspaceId, initial, onApply, onCancel }: { workspaceId: string; initial: string[]; onApply: (ids: string[]) => void; onCancel: () => void; }) {
  const [members, setMembers] = useStateInline<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [local, setLocal] = useStateInline<string[]>(initial);
  const [q, setQ] = useStateInline("");
  useEffectInline(() => {
    (async () => {
      const { data: wm } = await (supabaseInline as any)
        .from("workspace_members").select("user_id")
        .eq("workspace_id", workspaceId).eq("status", "active").not("user_id", "is", null);
      const ids = (wm ?? []).map((r: any) => r.user_id);
      if (!ids.length) return;
      const { data: profs } = await (supabaseInline as any)
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
        <InputInline placeholder="Search team…" value={q} onChange={(e) => setQ(e.target.value)} className="h-8" />
      </div>
      <div className="max-h-64 overflow-y-auto p-1">
        {filtered.length === 0 && <div className="px-3 py-4 text-xs text-muted-foreground text-center">No members</div>}
        {filtered.map((m) => {
          const checked = local.includes(m.id);
          return (
            <button key={m.id} type="button"
              onClick={() => setLocal((p) => p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id])}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-left">
              <CheckboxInline checked={checked} className="pointer-events-none" />
              <AvatarInline className="h-6 w-6"><AvatarFallbackInline className="text-[10px]">{initialsInline(label(m))}</AvatarFallbackInline></AvatarInline>
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
