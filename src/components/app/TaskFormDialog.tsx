import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { sendNotification } from "@/lib/notify";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PRIORITIES } from "./taskUtils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultClientId?: string | null;
  defaultProjectId?: string | null;
  defaultTitle?: string;
  defaultDueDate?: string;
  defaultAssigneeId?: string | null;
  onCreated?: (task: any) => void;
}

const UNASSIGNED = "unassigned";

export function TaskFormDialog({ open, onOpenChange, defaultClientId, defaultProjectId, defaultTitle, defaultDueDate, defaultAssigneeId, onCreated }: Props) {
  const { workspaceId, userId } = useWorkspace();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("none");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [statusId, setStatusId] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string>(UNASSIGNED);
  const [summary, setSummary] = useState("");
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; client_id: string }>>([]);
  const [statuses, setStatuses] = useState<Array<{ id: string; name: string; position: number }>>([]);
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);

  useEffect(() => {
    if (!open) return;
    setTitle(defaultTitle ?? "");
    setClientId(defaultClientId ?? "");
    setProjectId(defaultProjectId ?? "none");
    setPriority("Medium");
    setDueDate(defaultDueDate ?? "");
    setAssigneeId(defaultAssigneeId ?? UNASSIGNED);
    setSummary("");
  }, [open, defaultClientId, defaultProjectId, defaultTitle, defaultDueDate, defaultAssigneeId]);

  useEffect(() => {
    if (!open || !workspaceId) return;
    (async () => {
      const [c, p, s, wm] = await Promise.all([
        (supabase as any).from("clients").select("id, name").eq("workspace_id", workspaceId).order("name"),
        (supabase as any).from("projects").select("id, name, client_id").eq("workspace_id", workspaceId).order("name"),
        (supabase as any).from("task_statuses").select("id, name, position").eq("workspace_id", workspaceId).order("position"),
        (supabase as any).from("workspace_members").select("user_id").eq("workspace_id", workspaceId).eq("status", "active").not("user_id", "is", null),
      ]);
      setClients(c.data ?? []);
      setProjects(p.data ?? []);
      setStatuses(s.data ?? []);
      if (s.data?.length && !statusId) setStatusId(s.data[0].id);
      const ids = (wm.data ?? []).map((m: any) => m.user_id);
      if (ids.length) {
        const { data: profs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", ids);
        setMembers(profs ?? []);
      } else setMembers([]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, workspaceId]);

  const projectsForClient = projects.filter((p) => p.client_id === clientId);

  const save = async () => {
    if (!workspaceId || !userId) return;
    if (!title.trim()) return toast.error("Title is required");
    if (!clientId) return toast.error("Client is required");
    setSaving(true);
    try {
      const trimmedSummary = summary.trim();
      const descriptionJson = trimmedSummary
        ? { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: trimmedSummary }] }] }
        : null;
      const payload: any = {
        workspace_id: workspaceId, client_id: clientId,
        project_id: projectId === "none" ? null : projectId,
        title: title.trim(), priority,
        due_date: dueDate || null,
        status_id: statusId || null,
        created_by: userId,
        description: descriptionJson,
        description_text: trimmedSummary || null,
      };
      const { data, error } = await (supabase as any).from("tasks").insert(payload).select().single();
      if (error) throw error;

      const finalAssignee = assigneeId !== UNASSIGNED ? assigneeId : null;
      if (finalAssignee) {
        await (supabase as any).from("task_assignees").insert({ task_id: data.id, user_id: finalAssignee });
        await (supabase as any).from("activities").insert({
          workspace_id: workspaceId, actor_id: userId, verb: "assigned",
          target_type: "task", target_id: data.id, client_id: clientId,
          metadata: { title: data.title, assignee_id: finalAssignee },
        });
        if (finalAssignee !== userId) {
          const clientName = clients.find((c) => c.id === clientId)?.name;
          const bodyParts = [
            clientName ? `Client: ${clientName}` : null,
            dueDate ? `Due: ${dueDate}` : null,
          ].filter(Boolean);
          await sendNotification({
            user_id: finalAssignee,
            type: "task_assigned",
            title: `New task assigned: ${data.title}`,
            body: bodyParts.join(" • ") || null,
            link_url: `/app/tasks?task=${data.id}`,
            entity_type: "task",
            entity_id: data.id,
            actor_id: userId,
            workspace_id: workspaceId,
            email_subject: `New task assigned: ${data.title}`,
          });
        }
      }

      await (supabase as any).from("activities").insert({
        workspace_id: workspaceId, actor_id: userId, verb: "created",
        target_type: "task", target_id: data.id, client_id: clientId,
        metadata: { title: data.title },
      });
      toast.success("Task created");
      onCreated?.(data);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create task");
    } finally { setSaving(false); }
  };

  const memberLabel = (m: { full_name: string | null; email: string | null }) =>
    m.full_name?.trim() || m.email || "Unknown user";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="t-title">Title *</Label>
            <Input id="t-title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div>
            <Label>Client *</Label>
            <Select value={clientId} onValueChange={(v) => { setClientId(v); setProjectId("none"); }}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId} disabled={!clientId}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {projectsForClient.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={statusId} onValueChange={setStatusId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{memberLabel(m)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="t-due">Due Date</Label>
            <Input id="t-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="t-summary">Task Summary</Label>
            <Textarea
              id="t-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe what needs to be done…"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Creating…" : "Create Task"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
