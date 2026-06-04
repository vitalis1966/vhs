import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface TimeEntryFields {
  client_id: string | null;
  project_id: string | null;
  task_id: string | null;
  activity_type_id: string | null;
  description: string;
}

interface Props {
  value: TimeEntryFields;
  onChange: (v: TimeEntryFields) => void;
  clientLocked?: boolean;
}

interface OptionRow { id: string; name?: string; title?: string }

export function TimeEntryFormFields({ value, onChange, clientLocked }: Props) {
  const { workspaceId } = useWorkspace();
  const [clients, setClients] = useState<OptionRow[]>([]);
  const [projects, setProjects] = useState<OptionRow[]>([]);
  const [tasks, setTasks] = useState<OptionRow[]>([]);
  const [activities, setActivities] = useState<OptionRow[]>([]);

  useEffect(() => {
    if (!workspaceId) return;
    (async () => {
      const [{ data: c }, { data: a }] = await Promise.all([
        (supabase as any).from("clients").select("id, name").eq("workspace_id", workspaceId).order("name"),
        (supabase as any).from("time_activity_types").select("id, name").eq("workspace_id", workspaceId).eq("is_active", true).order("position"),
      ]);
      setClients(c ?? []); setActivities(a ?? []);
    })();
  }, [workspaceId]);

  useEffect(() => {
    if (!value.client_id) { setProjects([]); return; }
    (supabase as any).from("projects").select("id, name").eq("client_id", value.client_id).order("name")
      .then(({ data }: any) => setProjects(data ?? []));
  }, [value.client_id]);

  useEffect(() => {
    if (!value.client_id) { setTasks([]); return; }
    let q = (supabase as any).from("tasks").select("id, title").eq("client_id", value.client_id).is("deleted_at", null);
    if (value.project_id) q = q.eq("project_id", value.project_id);
    q.order("title").then(({ data }: any) => setTasks(data ?? []));
  }, [value.client_id, value.project_id]);

  const upd = (patch: Partial<TimeEntryFields>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Client *</Label>
        <Select
          value={value.client_id ?? ""}
          onValueChange={(v) => upd({ client_id: v, project_id: null, task_id: null })}
          disabled={clientLocked}
        >
          <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
          <SelectContent>
            {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Project</Label>
          <Select value={value.project_id ?? "__none"} onValueChange={(v) => upd({ project_id: v === "__none" ? null : v, task_id: null })} disabled={!value.client_id}>
            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">None</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Task</Label>
          <Select value={value.task_id ?? "__none"} onValueChange={(v) => upd({ task_id: v === "__none" ? null : v })} disabled={!value.client_id}>
            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">None</SelectItem>
              {tasks.map((t) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs">Activity Type *</Label>
        <Select value={value.activity_type_id ?? ""} onValueChange={(v) => upd({ activity_type_id: v })}>
          <SelectTrigger><SelectValue placeholder="Select activity" /></SelectTrigger>
          <SelectContent>
            {activities.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs">Description</Label>
        <Textarea
          rows={2}
          value={value.description}
          onChange={(e) => upd({ description: e.target.value })}
          placeholder="What are you working on?"
        />
      </div>
    </div>
  );
}
