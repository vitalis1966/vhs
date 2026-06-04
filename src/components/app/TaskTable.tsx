import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PRIORITY_CLASS, clientColor, initials, isOverdue } from "./taskUtils";
import { TaskActionsMenu, type TaskActionTarget } from "./tasks/TaskActionsMenu";
import { BulkActionBar } from "./tasks/BulkActionBar";
import { DeleteTaskDialog } from "./tasks/DeleteTaskDialog";
import { onTasksChanged, setTaskStatus, softDeleteTasks } from "./tasks/taskMutations";
import { toast } from "sonner";

interface Row {
  id: string; title: string; status_id: string | null; priority: string;
  due_date: string | null; client_id: string; project_id: string | null;
  completed_at: string | null; meeting_id: string | null;
  comment_count?: number;
}

interface Props {
  clientId?: string;
  projectId?: string;
  filters?: { status?: string; priority?: string; assignee?: string; clientFilter?: string; projectFilter?: string; tag?: string };
  reloadKey?: number;
  onOpenTask: (id: string) => void;
}

const PRIORITY_ORDER: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

export function TaskTable({ clientId, projectId, filters, reloadKey, onOpenTask }: Props) {
  const { workspaceId } = useWorkspace();
  const [rows, setRows] = useState<Row[]>([]);
  const [clients, setClients] = useState<Record<string, { id: string; name: string }>>({});
  const [projects, setProjects] = useState<Record<string, { id: string; name: string }>>({});
  const [statuses, setStatuses] = useState<Record<string, { id: string; name: string; color: string | null; category: string }>>({});
  const [assigneesByTask, setAssigneesByTask] = useState<Record<string, string[]>>({});
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<"due" | "priority">("due");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmRow, setConfirmRow] = useState<Row | null>(null);

  const [tagsByTask, setTagsByTask] = useState<Record<string, string[]>>({});
  const load = useCallback(async () => {
    if (!workspaceId) return;
    let q = (supabase as any).from("tasks")
      .select("id, title, status_id, priority, due_date, client_id, project_id, completed_at, meeting_id")
      .eq("workspace_id", workspaceId)
      .is("deleted_at", null);
    if (clientId) q = q.eq("client_id", clientId);
    if (projectId) q = q.eq("project_id", projectId);
    const tRes = await q;
    const trows: Row[] = tRes.data ?? [];
    setRows(trows);

    const [cs, ps, ss] = await Promise.all([
      (supabase as any).from("clients").select("id, name").eq("workspace_id", workspaceId),
      (supabase as any).from("projects").select("id, name").eq("workspace_id", workspaceId),
      (supabase as any).from("task_statuses").select("id, name, color, category").eq("workspace_id", workspaceId),
    ]);
    const cm: any = {}; (cs.data ?? []).forEach((c: any) => cm[c.id] = c); setClients(cm);
    const pm: any = {}; (ps.data ?? []).forEach((p: any) => pm[p.id] = p); setProjects(pm);
    const sm: any = {}; (ss.data ?? []).forEach((s: any) => sm[s.id] = s); setStatuses(sm);

    if (trows.length) {
      const [asRes, tgRes] = await Promise.all([
        (supabase as any).from("task_assignees").select("task_id, user_id").in("task_id", trows.map((t) => t.id)),
        (supabase as any).from("taggings").select("tag_id, taggable_id").eq("taggable_type", "task").in("taggable_id", trows.map((t) => t.id)),
      ]);
      const g: Record<string, string[]> = {};
      (asRes.data ?? []).forEach((r: any) => { (g[r.task_id] = g[r.task_id] ?? []).push(r.user_id); });
      setAssigneesByTask(g);
      const tg: Record<string, string[]> = {};
      (tgRes.data ?? []).forEach((r: any) => { (tg[r.taggable_id] = tg[r.taggable_id] ?? []).push(r.tag_id); });
      setTagsByTask(tg);
      const uids = Array.from(new Set((asRes.data ?? []).map((r: any) => r.user_id)));
      if (uids.length) {
        const { data: prs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", uids);
        const m: any = {}; (prs ?? []).forEach((p: any) => m[p.id] = p); setProfiles(m);
      }
    } else { setTagsByTask({}); }
  }, [workspaceId, clientId, projectId]);

  useEffect(() => { load(); }, [load, reloadKey]);
  useEffect(() => onTasksChanged(() => load()), [load]);

  const filtered = useMemo(() => {
    const out = rows.filter((t) => {
      if (filters?.status && t.status_id !== filters.status) return false;
      if (filters?.priority && t.priority !== filters.priority) return false;
      if (filters?.clientFilter && t.client_id !== filters.clientFilter) return false;
      if (filters?.projectFilter && t.project_id !== filters.projectFilter) return false;
      if (filters?.assignee && !(assigneesByTask[t.id] ?? []).includes(filters.assignee)) return false;
      if (filters?.tag && !(tagsByTask[t.id] ?? []).includes(filters.tag)) return false;
      return true;
    });
    out.sort((a, b) => {
      if (sortBy === "priority") return (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
      const ad = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const bd = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return ad - bd;
    });
    return out;
  }, [rows, filters, assigneesByTask, tagsByTask, sortBy]);

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((r) => r.id));
  const toggleOne = (id: string) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const onKey = async (e: React.KeyboardEvent, row: Row) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (["input", "textarea"].includes(tag) || (e.target as HTMLElement).isContentEditable) return;
    if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); setConfirmRow(row); }
    else if (e.key === "Enter") { e.preventDefault(); onOpenTask(row.id); }
    else if (e.key === " ") {
      e.preventDefault();
      const cat = row.status_id ? statuses[row.status_id]?.category : null;
      await setTaskStatus(row.id, workspaceId!, cat === "done" ? "todo" : "done");
    }
  };

  return (
    <>
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="px-3 py-2 w-8"><Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" /></th>
            <th className="px-3 py-2 font-medium">Title</th>
            <th className="px-3 py-2 font-medium">Client</th>
            <th className="px-3 py-2 font-medium">Project</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">
              <Button variant="ghost" size="sm" className="h-7 px-2 -ml-2" onClick={() => setSortBy("priority")}>
                Priority <ArrowUpDown className="h-3 w-3 ml-1" />
              </Button>
            </th>
            <th className="px-3 py-2 font-medium">
              <Button variant="ghost" size="sm" className="h-7 px-2 -ml-2" onClick={() => setSortBy("due")}>
                Due <ArrowUpDown className="h-3 w-3 ml-1" />
              </Button>
            </th>
            <th className="px-3 py-2 font-medium">Assignees</th>
            <th className="px-3 py-2 w-8" />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={9} className="px-3 py-6 text-center text-muted-foreground">No tasks.</td></tr>
          )}
          {filtered.map((t) => {
            const c = clients[t.client_id];
            const p = t.project_id ? projects[t.project_id] : null;
            const s = t.status_id ? statuses[t.status_id] : null;
            const overdue = isOverdue(t.due_date, t.completed_at);
            const aids = assigneesByTask[t.id] ?? [];
            const target: TaskActionTarget = {
              id: t.id, workspaceId: workspaceId!, meetingId: t.meeting_id,
              assigneeIds: aids, dueDate: t.due_date,
            };
            return (
              <tr
                key={t.id}
                tabIndex={0}
                onKeyDown={(e) => onKey(e, t)}
                onClick={() => onOpenTask(t.id)}
                className="border-t border-border hover:bg-muted/40 cursor-pointer focus:outline-none focus:bg-muted/40"
              >
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selected.includes(t.id)} onCheckedChange={() => toggleOne(t.id)} aria-label="Select task" />
                </td>
                <td className="px-3 py-2 font-medium">{t.title}</td>
                <td className="px-3 py-2">{c && <Badge variant="outline" className={`${clientColor(c.id)} border-transparent`}>{c.name}</Badge>}</td>
                <td className="px-3 py-2 text-muted-foreground">{p?.name ?? "—"}</td>
                <td className="px-3 py-2">
                  {s ? (
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{ background: s.color ?? "#94a3b8" }} />
                      {s.name}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-3 py-2"><Badge variant="outline" className={PRIORITY_CLASS[t.priority] ?? ""}>{t.priority}</Badge></td>
                <td className={`px-3 py-2 ${overdue ? "text-red-600 font-medium" : ""}`}>{t.due_date ? format(new Date(t.due_date), "MMM d, yyyy") : "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex -space-x-1.5">
                    {aids.slice(0, 3).map((uid) => {
                      const pr = profiles[uid];
                      return (
                        <Avatar key={uid} className="h-6 w-6 border border-background">
                          <AvatarFallback className="text-[10px]">{initials(pr?.full_name ?? pr?.email)}</AvatarFallback>
                        </Avatar>
                      );
                    })}
                  </div>
                </td>
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <TaskActionsMenu task={target} onEdit={onOpenTask} onDeleted={() => setRows((prev) => prev.filter((r) => r.id !== t.id))} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <BulkActionBar workspaceId={workspaceId!} selected={selected} onClear={() => setSelected([])} />
    <DeleteTaskDialog
      open={!!confirmRow}
      onOpenChange={(o) => !o && setConfirmRow(null)}
      count={1}
      fromMeeting={!!confirmRow?.meeting_id}
      onConfirm={async () => {
        if (!confirmRow) return;
        const ok = await softDeleteTasks([confirmRow.id]);
        if (ok) { toast.success("Task deleted"); setRows((p) => p.filter((r) => r.id !== confirmRow.id)); }
        setConfirmRow(null);
      }}
    />
    </>
  );
}
