import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Plus, ArrowLeft } from "lucide-react";
import { ProjectFormDialog, PROJECT_STATUS_COLOR } from "@/components/app/ProjectFormDialog";
import { Attachments } from "@/components/app/Attachments";
import { ProjectContractedHoursSection } from "@/components/app/time/ProjectContractedHoursSection";
import { toast } from "sonner";

function initials(s?: string | null) {
  if (!s) return "?";
  return s.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

interface Milestone { id: string; title: string; due_date: string | null; completed_at: string | null; }
interface Task {
  id: string; title: string; status_id: string | null; priority: string;
  due_date: string | null; completed_at: string | null;
}
interface Note { id: string; title: string | null; updated_at: string; }

export default function ProjectDetail() {
  const { clientId, projectId } = useParams<{ clientId: string; projectId: string }>();
  const navigate = useNavigate();
  const { role } = useWorkspace();
  const canManage = role === "admin" || role === "manager";

  const [project, setProject] = useState<any | null>(null);
  const [client, setClient] = useState<any | null>(null);
  const [owner, setOwner] = useState<any | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<Record<string, { name: string; color: string | null }>>({});
  const [assignees, setAssignees] = useState<Record<string, Array<{ id: string; full_name: string | null; email: string | null }>>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");

  const load = async () => {
    if (!projectId) return;
    setLoading(true);
    const { data: p } = await (supabase as any)
      .from("projects").select("*").eq("id", projectId).maybeSingle();
    if (!p) { setNotFound(true); setLoading(false); return; }
    setProject(p);

    const { data: c } = await (supabase as any)
      .from("clients").select("id, name").eq("id", p.client_id).maybeSingle();
    setClient(c);

    if (p.owner_id) {
      const { data: o } = await (supabase as any)
        .from("profiles").select("id, full_name, email").eq("id", p.owner_id).maybeSingle();
      setOwner(o);
    } else setOwner(null);

    const { data: ms } = await (supabase as any)
      .from("milestones").select("*").eq("project_id", projectId).order("due_date", { ascending: true, nullsFirst: false });
    setMilestones(ms ?? []);

    const { data: ts } = await (supabase as any)
      .from("tasks").select("id, title, status_id, priority, due_date, completed_at").is("deleted_at", null)
      .eq("project_id", projectId).order("created_at", { ascending: false });
    const taskRows: Task[] = ts ?? [];
    setTasks(taskRows);

    // Statuses + assignees
    const statusIds = Array.from(new Set(taskRows.map((t) => t.status_id).filter(Boolean))) as string[];
    if (statusIds.length) {
      const { data: st } = await (supabase as any)
        .from("task_statuses").select("id, name, color").in("id", statusIds);
      const map: Record<string, any> = {};
      (st ?? []).forEach((s: any) => { map[s.id] = s; });
      setStatuses(map);
    } else setStatuses({});

    if (taskRows.length) {
      const { data: tas } = await (supabase as any)
        .from("task_assignees").select("task_id, user_id, profiles(id, full_name, email)")
        .in("task_id", taskRows.map((t) => t.id));
      const map: Record<string, any[]> = {};
      (tas ?? []).forEach((a: any) => {
        map[a.task_id] = map[a.task_id] ?? [];
        if (a.profiles) map[a.task_id].push(a.profiles);
      });
      setAssignees(map);
    } else setAssignees({});

    const { data: ns } = await (supabase as any)
      .from("notes").select("id, title, updated_at")
      .eq("project_id", projectId).order("updated_at", { ascending: false });
    setNotes(ns ?? []);
    setLoading(false);
  };

  useEffect(() => { void load(); /* eslint-disable-next-line */ }, [projectId]);

  const toggleMilestone = async (m: Milestone) => {
    const completed_at = m.completed_at ? null : new Date().toISOString();
    setMilestones((prev) => prev.map((x) => x.id === m.id ? { ...x, completed_at } : x));
    const { error } = await (supabase as any).from("milestones").update({ completed_at }).eq("id", m.id);
    if (error) { toast.error(error.message); void load(); }
  };

  const addMilestone = async () => {
    if (!newMilestone.trim() || !projectId) return;
    const { error } = await (supabase as any).from("milestones").insert({
      project_id: projectId, title: newMilestone.trim(),
      due_date: newMilestoneDate || null,
    });
    if (error) { toast.error(error.message); return; }
    setNewMilestone(""); setNewMilestoneDate("");
    void load();
  };

  if (loading) return <div className="text-muted-foreground">Loading…</div>;
  if (notFound || !project) {
    return (
      <div className="max-w-xl">
        <h1 className="font-display text-2xl font-bold mb-2">Project not found</h1>
        <Button variant="outline" onClick={() => navigate(`/app/clients/${clientId}`)}>Back to client</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/app/clients/${clientId}`)}
        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-3 w-3" /> {client?.name ?? "Client"}
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl font-bold text-foreground">{project.name}</h1>
            <Badge variant="outline" className={PROJECT_STATUS_COLOR[project.status ?? "Active"] ?? ""}>
              {project.status ?? "—"}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span>Target: {project.target_date ?? "—"}</span>
            {owner && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(owner.full_name ?? owner.email)}</AvatarFallback></Avatar>
                <span>{owner.full_name ?? owner.email}</span>
              </div>
            )}
          </div>
        </div>
        {canManage && (
          <Button size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
        )}
      </div>

      <Section title="Description">
        {project.description ? (
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{project.description}</p>
        ) : <p className="text-sm text-muted-foreground italic">No description.</p>}
      </Section>

      <Section title="Milestones">
        {milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground italic mb-3">No milestones yet.</p>
        ) : (
          <ul className="divide-y mb-3">
            {milestones.map((m) => {
              const overdue = !m.completed_at && m.due_date && new Date(m.due_date) < new Date(new Date().toDateString());
              return (
                <li key={m.id} className="py-2 flex items-center gap-3">
                  <Checkbox checked={!!m.completed_at} onCheckedChange={() => toggleMilestone(m)} />
                  <span className={`flex-1 text-sm ${m.completed_at ? "line-through text-muted-foreground" : "text-foreground"}`}>{m.title}</span>
                  {m.due_date && (
                    <span className={`text-xs tabular-nums ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      {m.due_date}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a milestone…" value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addMilestone(); }}
          />
          <Input type="date" className="w-40" value={newMilestoneDate}
            onChange={(e) => setNewMilestoneDate(e.target.value)} />
          <Button size="sm" onClick={addMilestone} disabled={!newMilestone.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Section>

      <Section title="Tasks">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No tasks.</p>
        ) : (
          <ul className="divide-y">
            {tasks.map((t) => {
              const status = t.status_id ? statuses[t.status_id] : null;
              const ppl = assignees[t.id] ?? [];
              return (
                <li key={t.id}
                  onClick={() => navigate(`/app/tasks?task=${t.id}`)}
                  className="py-3 cursor-pointer hover:bg-muted/30 -mx-2 px-2 rounded flex items-center gap-3">
                  <span className={`flex-1 text-sm ${t.completed_at ? "line-through text-muted-foreground" : ""}`}>{t.title}</span>
                  {status && (
                    <Badge variant="outline" className="text-xs"
                      style={status.color ? { borderColor: status.color, color: status.color } : undefined}>
                      {status.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">{t.priority}</Badge>
                  <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">{t.due_date ?? "—"}</span>
                  <div className="flex -space-x-2">
                    {ppl.slice(0, 3).map((u) => (
                      <Avatar key={u.id} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-[10px]">{initials(u.full_name ?? u.email)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Notes" action={
        <Button size="sm" variant="outline" onClick={async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || !project) return;
          const { data, error } = await (supabase as any).from("notes").insert({
            workspace_id: project.workspace_id, client_id: project.client_id, project_id: project.id,
            title: "", body: { type: "doc", content: [{ type: "paragraph" }] }, body_text: "",
            created_by: user.id, updated_by: user.id,
          }).select().single();
          if (error || !data) { toast.error(error?.message ?? "Failed"); return; }
          navigate(`/app/clients/${clientId}?tab=notes&note=${data.id}`);
        }}>
          <Plus className="h-4 w-4 mr-1" /> New Note
        </Button>
      }>
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No notes.</p>
        ) : (
          <ul className="divide-y">
            {notes.map((n) => (
              <li key={n.id}>
                <Link to={`/app/clients/${clientId}?tab=notes&note=${n.id}`}
                  className="block py-3 hover:bg-muted/30 -mx-2 px-2 rounded">
                  <div className="text-sm font-medium text-foreground">{n.title?.trim() || "Untitled note"}</div>
                  <div className="text-xs text-muted-foreground">{new Date(n.updated_at).toLocaleString()}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section title="Contracted Hours">
        <ProjectContractedHoursSection projectId={project.id} workspaceId={project.workspace_id} />
      </Section>

      <Section title="Attachments">
        <Attachments attachableType="project" attachableId={project.id} workspaceId={project.workspace_id} />
      </Section>


      <ProjectFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        clientId={project.client_id}
        initial={{
          id: project.id, name: project.name, description: project.description,
          status: project.status, start_date: project.start_date,
          target_date: project.target_date, owner_id: project.owner_id,
        }}
        onSaved={load}
      />
    </div>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
