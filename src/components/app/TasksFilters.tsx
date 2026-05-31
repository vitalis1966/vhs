import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PRIORITIES } from "./taskUtils";

export interface TaskFilterState {
  status?: string; priority?: string; assignee?: string;
  clientFilter?: string; projectFilter?: string; tag?: string;
}

interface Props {
  value: TaskFilterState;
  onChange: (v: TaskFilterState) => void;
  hideClient?: boolean;
  hideProject?: boolean;
  scopeClientId?: string;
}

export function TasksFilters({ value, onChange, hideClient, hideProject, scopeClientId }: Props) {
  const { workspaceId } = useWorkspace();
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; client_id: string }>>([]);
  const [statuses, setStatuses] = useState<Array<{ id: string; name: string }>>([]);
  const [members, setMembers] = useState<Array<{ id: string; full_name: string | null; email: string | null }>>([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string; color: string | null }>>([]);

  useEffect(() => {
    if (!workspaceId) return;
    (async () => {
      const [c, p, s, wm, tg] = await Promise.all([
        (supabase as any).from("clients").select("id, name").eq("workspace_id", workspaceId).order("name"),
        (supabase as any).from("projects").select("id, name, client_id").eq("workspace_id", workspaceId).order("name"),
        (supabase as any).from("task_statuses").select("id, name").eq("workspace_id", workspaceId).order("position"),
        (supabase as any).from("workspace_members").select("user_id").eq("workspace_id", workspaceId).eq("status", "active").not("user_id", "is", null),
        (supabase as any).from("tags").select("id, name, color").eq("workspace_id", workspaceId).order("name"),
      ]);
      setClients(c.data ?? []); setProjects(p.data ?? []); setStatuses(s.data ?? []);
      setTags(tg.data ?? []);
      const ids = (wm.data ?? []).map((m: any) => m.user_id);
      if (ids.length) {
        const { data: ps } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", ids);
        setMembers(ps ?? []);
      }
    })();
  }, [workspaceId]);

  const projectOptions = scopeClientId ? projects.filter((p) => p.client_id === scopeClientId) : projects;
  const hasAny = Object.values(value).some((v) => !!v);
  const sel = (val: string | undefined, setter: (v?: string) => void) => (v: string) => setter(v === "__all" ? undefined : v);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!hideClient && (
        <Select value={value.clientFilter ?? "__all"} onValueChange={sel(value.clientFilter, (v) => onChange({ ...value, clientFilter: v }))}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All clients</SelectItem>
            {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
      {!hideProject && (
        <Select value={value.projectFilter ?? "__all"} onValueChange={sel(value.projectFilter, (v) => onChange({ ...value, projectFilter: v }))}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All projects</SelectItem>
            {projectOptions.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
      <Select value={value.status ?? "__all"} onValueChange={sel(value.status, (v) => onChange({ ...value, status: v }))}>
        <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all">All statuses</SelectItem>
          {statuses.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={value.priority ?? "__all"} onValueChange={sel(value.priority, (v) => onChange({ ...value, priority: v }))}>
        <SelectTrigger className="h-9 w-[130px]"><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all">All priorities</SelectItem>
          {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={value.assignee ?? "__all"} onValueChange={sel(value.assignee, (v) => onChange({ ...value, assignee: v }))}>
        <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Assignee" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all">All assignees</SelectItem>
          {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={value.tag ?? "__all"} onValueChange={sel(value.tag, (v) => onChange({ ...value, tag: v }))}>
        <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Tag" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__all">All tags</SelectItem>
          {tags.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: t.color ?? "#94a3b8" }} />
                {t.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasAny && (
        <Button variant="ghost" size="sm" onClick={() => onChange({})}>
          <X className="h-3.5 w-3.5 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
}
