import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, LayoutGrid, Table as TableIcon } from "lucide-react";
import { ClientFormDialog, CLIENT_STATUSES } from "@/components/app/ClientFormDialog";

type ClientRow = {
  id: string; name: string; status: string | null; industry: string | null;
  account_owner_id: string | null; created_at: string;
};

const statusColor: Record<string, string> = {
  Prospect: "bg-blue-100 text-blue-800 border-blue-200",
  Active: "bg-green-100 text-green-800 border-green-200",
  "On Hold": "bg-amber-100 text-amber-800 border-amber-200",
  Closed: "bg-slate-100 text-slate-700 border-slate-200",
};

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function Clients() {
  const { workspaceId, role } = useWorkspace();
  const canManage = role === "admin" || role === "manager";
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [owners, setOwners] = useState<Record<string, { full_name: string | null; email: string | null }>>({});
  const [openCounts, setOpenCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = async () => {
    if (!workspaceId) return;
    setLoading(true);
    const { data } = await (supabase as any)
      .from("clients")
      .select("id, name, status, industry, account_owner_id, created_at")
      .eq("workspace_id", workspaceId)
      .order("name", { ascending: true });
    const rows: ClientRow[] = data ?? [];
    setClients(rows);

    const ownerIds = Array.from(new Set(rows.map((r) => r.account_owner_id).filter(Boolean))) as string[];
    if (ownerIds.length) {
      const { data: profs } = await (supabase as any)
        .from("profiles").select("id, full_name, email").in("id", ownerIds);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => { map[p.id] = p; });
      setOwners(map);
    } else setOwners({});

    if (rows.length) {
      const { data: tasks } = await (supabase as any)
        .from("tasks").select("client_id, completed_at")
        .in("client_id", rows.map((r) => r.id))
        .is("completed_at", null);
      const counts: Record<string, number> = {};
      (tasks ?? []).forEach((t: any) => { counts[t.client_id] = (counts[t.client_id] ?? 0) + 1; });
      setOpenCounts(counts);
    } else setOpenCounts({});
    setLoading(false);
  };

  useEffect(() => { void load(); }, [workspaceId]);

  const grouped = useMemo(() => {
    const g: Record<string, ClientRow[]> = { Prospect: [], Active: [], "On Hold": [], Closed: [] };
    clients.forEach((c) => {
      const s = (c.status && g[c.status] !== undefined) ? c.status : "Active";
      g[s].push(c);
    });
    return g;
  }, [clients]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">All accounts across your workspace.</p>
        </div>
        {canManage && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Client
          </Button>
        )}
      </div>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table"><TableIcon className="h-4 w-4 mr-2" /> Table</TabsTrigger>
          <TabsTrigger value="board"><LayoutGrid className="h-4 w-4 mr-2" /> Board</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          <div className="rounded-lg border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Company</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Industry</th>
                  <th className="text-left px-4 py-3">Account Owner</th>
                  <th className="text-left px-4 py-3">Open Tasks</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
                )}
                {!loading && clients.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No clients yet.</td></tr>
                )}
                {clients.map((c) => {
                  const owner = c.account_owner_id ? owners[c.account_owner_id] : null;
                  return (
                    <tr key={c.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link to={`/app/clients/${c.id}`} className="font-medium text-foreground hover:underline">
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={statusColor[c.status ?? "Active"] ?? ""}>
                          {c.status ?? "—"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.industry ?? "—"}</td>
                      <td className="px-4 py-3">
                        {owner ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(owner.full_name ?? owner.email)}</AvatarFallback></Avatar>
                            <span>{owner.full_name ?? owner.email}</span>
                          </div>
                        ) : <span className="text-muted-foreground">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{openCounts[c.id] ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="board" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {CLIENT_STATUSES.map((s) => (
              <div key={s} className="rounded-lg border bg-muted/30 p-3 min-h-[200px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{s}</h3>
                  <span className="text-xs text-muted-foreground">{grouped[s].length}</span>
                </div>
                <div className="space-y-2">
                  {grouped[s].map((c) => {
                    const owner = c.account_owner_id ? owners[c.account_owner_id] : null;
                    return (
                      <Link
                        key={c.id} to={`/app/clients/${c.id}`}
                        className="block rounded-md bg-card border p-3 hover:border-primary/40 transition-colors"
                      >
                        <div className="font-medium text-sm text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{c.industry ?? "—"}</div>
                        <div className="flex items-center justify-between mt-3">
                          {owner ? (
                            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(owner.full_name ?? owner.email)}</AvatarFallback></Avatar>
                          ) : <div className="h-6 w-6 rounded-full bg-muted" />}
                          <span className="text-xs text-muted-foreground">{openCounts[c.id] ?? 0} open</span>
                        </div>
                      </Link>
                    );
                  })}
                  {grouped[s].length === 0 && (
                    <p className="text-xs text-muted-foreground italic px-1">No clients</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <ClientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={(c) => {
          setClients((prev) => [{ id: c.id, name: c.name, status: c.status, industry: c.industry, account_owner_id: c.account_owner_id, created_at: c.created_at }, ...prev]);
          void load();
        }}
      />
    </div>
  );
}
