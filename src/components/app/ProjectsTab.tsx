import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { ProjectFormDialog, PROJECT_STATUS_COLOR } from "@/components/app/ProjectFormDialog";

interface Props { clientId: string; }

interface ProjectRow {
  id: string; name: string; status: string | null; target_date: string | null;
  owner_id: string | null;
}

function initials(s?: string | null) {
  if (!s) return "?";
  return s.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function ProjectsTab({ clientId }: Props) {
  const { role, userId } = useWorkspace();
  const canManage = role === "admin" || role === "manager";
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [owners, setOwners] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    let query = (supabase as any)
      .from("projects").select("id, name, status, target_date, owner_id")
      .eq("client_id", clientId);
    // Rule 2: non-admins see only projects they own
    if (role && role !== "admin" && userId) {
      query = query.eq("owner_id", userId);
    }
    const { data } = await query.order("created_at", { ascending: false });
    const rows: ProjectRow[] = data ?? [];
    setProjects(rows);

    const ownerIds = Array.from(new Set(rows.map((p) => p.owner_id).filter(Boolean))) as string[];
    if (ownerIds.length) {
      const { data: profs } = await (supabase as any)
        .from("profiles").select("id, full_name, email").in("id", ownerIds);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => { map[p.id] = p; });
      setOwners(map);
    } else setOwners({});

    if (rows.length) {
      const { data: tasks } = await (supabase as any)
        .from("tasks").select("project_id, completed_at").is("deleted_at", null)
        .in("project_id", rows.map((r) => r.id));
      const totals: Record<string, { done: number; total: number }> = {};
      (tasks ?? []).forEach((t: any) => {
        const k = t.project_id;
        totals[k] = totals[k] ?? { done: 0, total: 0 };
        totals[k].total += 1;
        if (t.completed_at) totals[k].done += 1;
      });
      const pct: Record<string, number> = {};
      Object.entries(totals).forEach(([k, v]) => { pct[k] = v.total ? Math.round((v.done / v.total) * 100) : 0; });
      setProgress(pct);
    } else setProgress({});
    setLoading(false);
  };

  useEffect(() => { void load(); /* eslint-disable-next-line */ }, [clientId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Projects</h3>
        {canManage && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card divide-y">
        {loading && <div className="p-6 text-center text-muted-foreground text-sm">Loading…</div>}
        {!loading && projects.length === 0 && (
          <div className="p-6 text-center text-muted-foreground text-sm">No projects yet.</div>
        )}
        {projects.map((p) => {
          const owner = p.owner_id ? owners[p.owner_id] : null;
          const pct = progress[p.id] ?? 0;
          return (
            <Link
              key={p.id}
              to={`/app/clients/${clientId}/projects/${p.id}`}
              className="block p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-foreground">{p.name}</span>
                    <Badge variant="outline" className={PROJECT_STATUS_COLOR[p.status ?? "Active"] ?? ""}>
                      {p.status ?? "—"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 max-w-md">
                    <div className="h-1.5 bg-muted rounded-full flex-1 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="tabular-nums">{p.target_date ?? "—"}</span>
                  {owner ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(owner.full_name ?? owner.email)}</AvatarFallback></Avatar>
                      <span>{owner.full_name ?? owner.email}</span>
                    </div>
                  ) : <span>Unassigned</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clientId={clientId}
        onSaved={load}
      />
    </div>
  );
}
