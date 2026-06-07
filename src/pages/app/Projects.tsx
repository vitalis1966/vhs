import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table as TableIcon, LayoutGrid } from "lucide-react";
import { PROJECT_STATUSES, PROJECT_STATUS_COLOR } from "@/components/app/ProjectFormDialog";
import {
  ColumnHeader, useTableFilters, TextFilter, MultiSelectFilter, DateRangeFilter, NumberRangeFilter,
  ResizableTh, useColumnWidths,
} from "@/components/app/columns";

const PROJ_COL_DEFAULTS = {
  name: 260, client: 180, status: 130, target: 130, owner: 200, progress: 200,
};

interface ProjectRow {
  id: string; name: string; status: string | null; target_date: string | null;
  owner_id: string | null; client_id: string;
}

function initials(s?: string | null) {
  if (!s) return "?";
  return s.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function Projects() {
  const { workspaceId } = useWorkspace();
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [clients, setClients] = useState<Record<string, { id: string; name: string }>>({});
  const [owners, setOwners] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filterClient, setFilterClient] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOwner, setFilterOwner] = useState("all");

  useEffect(() => {
    if (!workspaceId) return;
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from("projects").select("id, name, status, target_date, owner_id, client_id")
        .eq("workspace_id", workspaceId).order("created_at", { ascending: false });
      const list: ProjectRow[] = data ?? [];
      setRows(list);

      const clientIds = Array.from(new Set(list.map((r) => r.client_id))) as string[];
      if (clientIds.length) {
        const { data: cs } = await (supabase as any)
          .from("clients").select("id, name").in("id", clientIds);
        const cmap: Record<string, any> = {};
        (cs ?? []).forEach((c: any) => { cmap[c.id] = c; });
        setClients(cmap);
      }
      const ownerIds = Array.from(new Set(list.map((r) => r.owner_id).filter(Boolean))) as string[];
      if (ownerIds.length) {
        const { data: ps } = await (supabase as any)
          .from("profiles").select("id, full_name, email").in("id", ownerIds);
        const map: Record<string, any> = {};
        (ps ?? []).forEach((p: any) => { map[p.id] = p; });
        setOwners(map);
      }
      if (list.length) {
        const { data: tasks } = await (supabase as any)
          .from("tasks").select("project_id, completed_at").is("deleted_at", null)
          .in("project_id", list.map((r) => r.id));
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
      }
      setLoading(false);
    })();
  }, [workspaceId]);

  const tf = useTableFilters<"name" | "client" | "status" | "target" | "owner" | "progress">();

  const baseFiltered = useMemo(() => rows.filter((r) =>
    (filterClient === "all" || r.client_id === filterClient) &&
    (filterStatus === "all" || r.status === filterStatus) &&
    (filterOwner === "all" || r.owner_id === filterOwner)
  ), [rows, filterClient, filterStatus, filterOwner]);

  const filtered = useMemo(() => tf.apply(baseFiltered, {
    name: { filterValue: (r) => r.name, sortValue: (r) => r.name.toLowerCase() },
    client: { filterValue: (r) => r.client_id, sortValue: (r) => (clients[r.client_id]?.name ?? "").toLowerCase() },
    status: { filterValue: (r) => r.status ?? "", sortValue: (r) => r.status ?? "" },
    target: {
      filterValue: (r) => (r.target_date ? new Date(r.target_date) : null),
      sortValue: (r) => (r.target_date ? new Date(r.target_date).getTime() : null),
    },
    owner: { filterValue: (r) => r.owner_id ?? "", sortValue: (r) => (r.owner_id ? owners[r.owner_id]?.full_name ?? owners[r.owner_id]?.email ?? "" : "") },
    progress: { filterValue: (r) => progress[r.id] ?? 0, sortValue: (r) => progress[r.id] ?? 0 },
  }), [baseFiltered, tf.state, clients, owners, progress]);

  const grouped = useMemo(() => {
    const g: Record<string, ProjectRow[]> = {};
    PROJECT_STATUSES.forEach((s) => { g[s] = []; });
    filtered.forEach((r) => {
      const s = (r.status && g[r.status] !== undefined) ? r.status : "Active";
      g[s].push(r);
    });
    return g;
  }, [filtered]);

  const ownerList = Object.values(owners);
  const clientList = Object.values(clients);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">All projects across your workspace.</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger className="w-52"><SelectValue placeholder="All clients" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All clients</SelectItem>
            {clientList.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterOwner} onValueChange={setFilterOwner}>
          <SelectTrigger className="w-52"><SelectValue placeholder="All owners" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {ownerList.map((o: any) => (
              <SelectItem key={o.id} value={o.id}>{o.full_name ?? o.email}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table"><TableIcon className="h-4 w-4 mr-2" /> Table</TabsTrigger>
          <TabsTrigger value="board"><LayoutGrid className="h-4 w-4 mr-2" /> Board</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          <div className="rounded-lg border bg-card overflow-x-auto">
            <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <ResizableTh columnKey="name" width={widths.name} onResize={setWidth} className="text-left px-4 py-3">
                    <ColumnHeader label="Project" columnKey="name" sort={tf.sort} onToggleSort={tf.toggleSort}
                      filterValue={tf.filters.name} onFilterChange={tf.setFilter}
                      renderFilter={(v, oc) => <TextFilter value={v} onChange={oc} placeholder="Filter name…" />} />
                  </ResizableTh>
                  <ResizableTh columnKey="client" width={widths.client} onResize={setWidth} className="text-left px-4 py-3">
                    <ColumnHeader label="Client" columnKey="client" sort={tf.sort} onToggleSort={tf.toggleSort}
                      filterValue={tf.filters.client} onFilterChange={tf.setFilter}
                      renderFilter={(v, oc) => <MultiSelectFilter value={v} onChange={oc}
                        options={clientList.map((c: any) => ({ value: c.id, label: c.name }))} />} />
                  </ResizableTh>
                  <ResizableTh columnKey="status" width={widths.status} onResize={setWidth} className="text-left px-4 py-3">
                    <ColumnHeader label="Status" columnKey="status" sort={tf.sort} onToggleSort={tf.toggleSort}
                      filterValue={tf.filters.status} onFilterChange={tf.setFilter}
                      renderFilter={(v, oc) => <MultiSelectFilter value={v} onChange={oc}
                        options={PROJECT_STATUSES.map((s) => ({ value: s, label: s }))} />} />
                  </ResizableTh>
                  <ResizableTh columnKey="target" width={widths.target} onResize={setWidth} className="text-left px-4 py-3">
                    <ColumnHeader label="Target" columnKey="target" sort={tf.sort} onToggleSort={tf.toggleSort}
                      filterValue={tf.filters.target} onFilterChange={tf.setFilter}
                      renderFilter={(v, oc) => <DateRangeFilter value={v} onChange={oc} />} />
                  </ResizableTh>
                  <ResizableTh columnKey="owner" width={widths.owner} onResize={setWidth} className="text-left px-4 py-3">
                    <ColumnHeader label="Owner" columnKey="owner" sort={tf.sort} onToggleSort={tf.toggleSort}
                      filterValue={tf.filters.owner} onFilterChange={tf.setFilter}
                      renderFilter={(v, oc) => <MultiSelectFilter value={v} onChange={oc}
                        options={ownerList.map((o: any) => ({ value: o.id, label: o.full_name ?? o.email }))} />} />
                  </ResizableTh>
                  <ResizableTh columnKey="progress" width={widths.progress} onResize={setWidth} className="text-left px-4 py-3">
                    <ColumnHeader label="Progress" columnKey="progress" sort={tf.sort} onToggleSort={tf.toggleSort}
                      filterValue={tf.filters.progress} onFilterChange={tf.setFilter}
                      renderFilter={(v, oc) => <NumberRangeFilter value={v} onChange={oc} unit="%" />} />
                  </ResizableTh>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No projects.</td></tr>
                )}
                {filtered.map((p) => {
                  const owner = p.owner_id ? owners[p.owner_id] : null;
                  const c = clients[p.client_id];
                  const pct = progress[p.id] ?? 0;
                  return (
                    <tr key={p.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link to={`/app/clients/${p.client_id}/projects/${p.id}`} className="font-medium hover:underline">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {c && <Link to={`/app/clients/${c.id}`} className="text-muted-foreground hover:underline">{c.name}</Link>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={PROJECT_STATUS_COLOR[p.status ?? "Active"] ?? ""}>{p.status ?? "—"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">{p.target_date ?? "—"}</td>
                      <td className="px-4 py-3">
                        {owner ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(owner.full_name ?? owner.email)}</AvatarFallback></Avatar>
                            <span>{owner.full_name ?? owner.email}</span>
                          </div>
                        ) : <span className="text-muted-foreground">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 bg-muted rounded-full flex-1 overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="board" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {PROJECT_STATUSES.map((s) => (
              <div key={s} className="rounded-lg border bg-muted/30 p-3 min-h-[200px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{s}</h3>
                  <span className="text-xs text-muted-foreground">{grouped[s].length}</span>
                </div>
                <div className="space-y-2">
                  {grouped[s].map((p) => {
                    const owner = p.owner_id ? owners[p.owner_id] : null;
                    const c = clients[p.client_id];
                    const pct = progress[p.id] ?? 0;
                    return (
                      <Link key={p.id} to={`/app/clients/${p.client_id}/projects/${p.id}`}
                        className="block rounded-md bg-card border p-3 hover:border-primary/40 transition-colors">
                        <div className="font-medium text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{c?.name ?? "—"}</div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {owner ? (
                            <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px]">{initials(owner.full_name ?? owner.email)}</AvatarFallback></Avatar>
                          ) : <div className="h-5 w-5 rounded-full bg-muted" />}
                          <span className="text-[10px] text-muted-foreground tabular-nums">{p.target_date ?? "—"}</span>
                        </div>
                      </Link>
                    );
                  })}
                  {grouped[s].length === 0 && <p className="text-xs text-muted-foreground italic px-1">No projects</p>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
