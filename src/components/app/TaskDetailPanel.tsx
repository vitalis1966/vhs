import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PRIORITIES, PRIORITY_CLASS, initials } from "./taskUtils";
import { TaskRichText } from "./TaskRichText";
import { TagPicker } from "./TagPicker";
import { Attachments } from "./Attachments";

interface Props {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
}

interface ChecklistItem { id: string; label: string; done: boolean; }

export function TaskDetailPanel({ taskId, open, onOpenChange, onChanged }: Props) {
  const { workspaceId, userId } = useWorkspace();
  const [task, setTask] = useState<any | null>(null);
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; client_id: string }>>([]);
  const [statuses, setStatuses] = useState<Array<{ id: string; name: string; color: string | null; position: number; category: string }>>([]);
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [newChecklist, setNewChecklist] = useState("");

  useEffect(() => {
    if (!open || !taskId || !workspaceId) return;
    (async () => {
      const [t, ta, c, p, s, wm] = await Promise.all([
        (supabase as any).from("tasks").select("*").eq("id", taskId).single(),
        (supabase as any).from("task_assignees").select("user_id").eq("task_id", taskId),
        (supabase as any).from("clients").select("id, name").eq("workspace_id", workspaceId).order("name"),
        (supabase as any).from("projects").select("id, name, client_id").eq("workspace_id", workspaceId).order("name"),
        (supabase as any).from("task_statuses").select("id, name, color, position, category").eq("workspace_id", workspaceId).order("position"),
        (supabase as any).from("workspace_members").select("user_id").eq("workspace_id", workspaceId).eq("status", "active").not("user_id", "is", null),
      ]);
      setTask(t.data); setClients(c.data ?? []); setProjects(p.data ?? []); setStatuses(s.data ?? []);
      setAssignees((ta.data ?? []).map((r: any) => r.user_id));
      const ids = (wm.data ?? []).map((m: any) => m.user_id);
      if (ids.length) {
        const { data: profs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", ids);
        setMembers(profs ?? []);
      } else setMembers([]);
    })();
  }, [open, taskId, workspaceId]);

  const projectsForClient = useMemo(
    () => projects.filter((p) => p.client_id === task?.client_id),
    [projects, task?.client_id]
  );

  if (!open) return null;

  const update = async (patch: Partial<any>, opts?: { activity?: { verb: string; metadata?: any } }) => {
    if (!task || !workspaceId || !userId) return;
    const optimistic = { ...task, ...patch };
    setTask(optimistic);
    const { error } = await (supabase as any).from("tasks").update(patch).eq("id", task.id);
    if (error) { toast.error(error.message); return; }
    if (opts?.activity) {
      await (supabase as any).from("activities").insert({
        workspace_id: workspaceId, actor_id: userId,
        verb: opts.activity.verb, target_type: "task", target_id: task.id,
        client_id: optimistic.client_id, metadata: opts.activity.metadata ?? null,
      });
    }
    onChanged?.();
  };

  const onStatusChange = async (newId: string) => {
    const oldStatus = statuses.find((s) => s.id === task.status_id);
    const newStatus = statuses.find((s) => s.id === newId);
    const patch: any = { status_id: newId };
    if (newStatus?.category === "done" && !task.completed_at) patch.completed_at = new Date().toISOString();
    if (newStatus?.category !== "done" && task.completed_at) patch.completed_at = null;
    await update(patch, {
      activity: { verb: "status_changed", metadata: { title: task.title, old_status: oldStatus?.name ?? null, new_status: newStatus?.name ?? null } },
    });
  };

  const toggleAssignee = async (uid: string) => {
    if (!task || !workspaceId || !userId) return;
    const isAssigned = assignees.includes(uid);
    if (isAssigned) {
      setAssignees(assignees.filter((a) => a !== uid));
      await (supabase as any).from("task_assignees").delete().eq("task_id", task.id).eq("user_id", uid);
    } else {
      setAssignees([...assignees, uid]);
      await (supabase as any).from("task_assignees").insert({ task_id: task.id, user_id: uid });
      // Notification + activity for new assignee
      await (supabase as any).from("notifications").insert({
        workspace_id: workspaceId, user_id: uid, actor_id: userId,
        type: "task_assigned", title: "You have been assigned a task",
        body: task.title, entity_type: "task", entity_id: task.id,
        link_url: `/app/tasks?task=${task.id}`,
      });
      await (supabase as any).from("activities").insert({
        workspace_id: workspaceId, actor_id: userId, verb: "assigned",
        target_type: "task", target_id: task.id, client_id: task.client_id,
        metadata: { title: task.title, assignee_id: uid },
      });
    }
    onChanged?.();
  };

  const updateChecklist = async (next: ChecklistItem[]) => {
    setTask({ ...task, checklist: next });
    await (supabase as any).from("tasks").update({ checklist: next }).eq("id", task.id);
  };

  const checklist: ChecklistItem[] = Array.isArray(task?.checklist) ? task.checklist : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        {!task ? <div className="p-6 text-muted-foreground">Loading…</div> : (
          <>
            <SheetHeader className="mb-4">
              <SheetTitle className="sr-only">Task details</SheetTitle>
              <Input
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                onBlur={(e) => e.target.value !== task.title || update({ title: task.title.trim() || "Untitled" })}
                className="text-lg font-semibold border-0 px-0 focus-visible:ring-0 shadow-none"
              />
            </SheetHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Client *</Label>
                  <Select value={task.client_id} onValueChange={(v) => update({ client_id: v, project_id: null })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Project</Label>
                  <Select value={task.project_id ?? "none"} onValueChange={(v) => update({ project_id: v === "none" ? null : v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {projectsForClient.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={task.status_id ?? ""} onValueChange={onStatusChange}>
                    <SelectTrigger><SelectValue placeholder="Set status" /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: s.color ?? "#94a3b8" }} />
                            {s.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Priority</Label>
                  <Select value={task.priority} onValueChange={(v) => update({ priority: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          <Badge variant="outline" className={PRIORITY_CLASS[p]}>{p}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Due Date</Label>
                  <Input type="date" value={task.due_date ?? ""} onChange={(e) => update({ due_date: e.target.value || null })} />
                </div>
                <div>
                  <Label className="text-xs">Assignees</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start h-10">
                        {assignees.length === 0 ? (
                          <span className="text-muted-foreground text-sm">Unassigned</span>
                        ) : (
                          <div className="flex -space-x-2">
                            {assignees.slice(0, 4).map((uid) => {
                              const m = members.find((x) => x.id === uid);
                              return (
                                <Avatar key={uid} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-[10px]">{initials(m?.full_name ?? m?.email)}</AvatarFallback>
                                </Avatar>
                              );
                            })}
                          </div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2" align="start">
                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {members.map((m) => {
                          const checked = assignees.includes(m.id);
                          return (
                            <button
                              key={m.id} type="button"
                              onClick={() => toggleAssignee(m.id)}
                              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded text-left text-sm"
                            >
                              <Checkbox checked={checked} className="pointer-events-none" />
                              <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(m.full_name ?? m.email)}</AvatarFallback></Avatar>
                              <span className="truncate">{m.full_name ?? m.email}</span>
                            </button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Description</Label>
                <TaskRichText
                  valueJson={task.description}
                  onChange={(json, text) => {
                    setTask({ ...task, description: json, description_text: text });
                  }}
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline" onClick={() => update({ description: task.description, description_text: task.description_text })}>
                    Save description
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Tags</Label>
                <div className="p-2 rounded-md border border-input min-h-[40px]">
                  <TagPicker taggableType="task" taggableId={task.id} />
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Checklist</Label>
                <div className="space-y-1.5">
                  {checklist.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <Checkbox checked={item.done} onCheckedChange={(v) => {
                        const next = [...checklist];
                        next[i] = { ...item, done: !!v };
                        updateChecklist(next);
                      }} />
                      <Input
                        value={item.label}
                        onChange={(e) => {
                          const next = [...checklist]; next[i] = { ...item, label: e.target.value };
                          setTask({ ...task, checklist: next });
                        }}
                        onBlur={() => updateChecklist(checklist)}
                        className={`h-8 ${item.done ? "line-through text-muted-foreground" : ""}`}
                      />
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                        onClick={() => updateChecklist(checklist.filter((_, idx) => idx !== i))}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Add checklist item…" value={newChecklist}
                      onChange={(e) => setNewChecklist(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newChecklist.trim()) {
                          updateChecklist([...checklist, { id: crypto.randomUUID(), label: newChecklist.trim(), done: false }]);
                          setNewChecklist("");
                        }
                      }}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Attachments</Label>
                <Attachments attachableType="task" attachableId={task.id} workspaceId={task.workspace_id} />
              </div>

              <div>
                <Label className="text-xs mb-1.5 block">Comments</Label>
                <div className="text-sm text-muted-foreground italic border border-dashed rounded-md p-3">
                  Comments coming soon.
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
