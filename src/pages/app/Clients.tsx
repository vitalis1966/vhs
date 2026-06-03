import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, LayoutGrid, Table as TableIcon, Tag as TagIcon, X } from "lucide-react";
import { ClientFormDialog, CLIENT_STATUSES } from "@/components/app/ClientFormDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

type ClientRow = {
  id: string; name: string; status: string | null; industry: string | null;
  account_owner_id: string | null; created_at: string;
};

type TagRow = { id: string; name: string; color: string | null; category: string | null };

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
  const [allTags, setAllTags] = useState<TagRow[]>([]);
  const [clientTagMap, setClientTagMap] = useState<Record<string, string[]>>({});
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");

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
        .from("tasks").select("client_id, completed_at").is("deleted_at", null)
        .in("client_id", rows.map((r) => r.id))
        .is("completed_at", null);
      const counts: Record<string, number> = {};
      (tasks ?? []).forEach((t: any) => { counts[t.client_id] = (counts[t.client_id] ?? 0) + 1; });
      setOpenCounts(counts);
    } else setOpenCounts({});

    const { data: tagRows } = await (supabase as any)
      .from("tags").select("id, name, color, category")
      .eq("workspace_id", workspaceId).order("name");
    setAllTags(tagRows ?? []);

    if (rows.length) {
      const { data: tg } = await (supabase as any)
        .from("taggings").select("tag_id, taggable_id")
        .eq("taggable_type", "client")
        .in("taggable_id", rows.map((r) => r.id));
      const m: Record<string, string[]> = {};
      (tg ?? []).forEach((r: any) => {
        (m[r.taggable_id] ||= []).push(r.tag_id);
      });
      setClientTagMap(m);
    } else setClientTagMap({});

    setLoading(false);
  };

  useEffect(() => { void load(); }, [workspaceId]);

  const tagMap = useMemo(() => Object.fromEntries(allTags.map((t) => [t.id, t])), [allTags]);

  const filteredClients = useMemo(() => {
    if (!selectedTagIds.length) return clients;
    return clients.filter((c) => {
      const ids = clientTagMap[c.id] ?? [];
      return selectedTagIds.every((t) => ids.includes(t));
    });
  }, [clients, clientTagMap, selectedTagIds]);

  const grouped = useMemo(() => {
    const g: Record<string, ClientRow[]> = { Prospect: [], Active: [], "On Hold": [], Closed: [] };
    filteredClients.forEach((c) => {
      const s = (c.status && g[c.status] !== undefined) ? c.status : "Active";
      g[s].push(c);
    });
    return g;
  }, [filteredClients]);

  const toggleTag = (id: string) =>
    setSelectedTagIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

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

      <div className="flex items-center gap-2 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <TagIcon className="h-3.5 w-3.5 mr-1.5" />
              Tags {selectedTagIds.length > 0 && <span className="ml-1 text-xs text-muted-foreground">({selectedTagIds.length})</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="start">
            <Input value={tagSearch} onChange={(e) => setTagSearch(e.target.value)}
              placeholder="Search tags…" className="h-8 mb-2" />
            <div className="max-h-64 overflow-y-auto space-y-1">
              {allTags
                .filter((t) => !tagSearch.trim() || t.name.toLowerCase().includes(tagSearch.toLowerCase()))
                .map((t) => {
                  const checked = selectedTagIds.includes(t.id);
                  return (
                    <button key={t.id} type="button" onClick={() => toggleTag(t.id)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted flex items-center gap-2 ${checked ? "bg-muted" : ""}`}>
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.color ?? "#94a3b8" }} />
                      <span className="flex-1 truncate">{t.name}</span>
                      {t.category && <span className="text-[10px] uppercase text-muted-foreground tracking-wider">{t.category.replace("_", " ")}</span>}
                    </button>
                  );
                })}
              {allTags.length === 0 && <div className="text-xs text-muted-foreground italic px-2 py-2">No tags yet.</div>}
            </div>
          </PopoverContent>
        </Popover>
        {selectedTagIds.map((id) => {
          const t = tagMap[id];
          if (!t) return null;
          return (
            <Badge key={id} variant="outline" className="border-transparent text-xs gap-1"
              style={{ background: `${t.color ?? "#94a3b8"}22`, color: t.color ?? "#475569" }}>
              {t.name}
              <button onClick={() => toggleTag(id)} type="button" className="hover:opacity-70" aria-label="Remove">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
        {selectedTagIds.length > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedTagIds([])}>Clear</Button>
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
                  <th className="text-left px-4 py-3">Tags</th>
                  <th className="text-left px-4 py-3">Account Owner</th>
                  <th className="text-left px-4 py-3">Open Tasks</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
                )}
                {!loading && filteredClients.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    {clients.length === 0 ? "No clients yet." : "No clients match the selected tags."}
                  </td></tr>
                )}
                {filteredClients.map((c) => {
                  const owner = c.account_owner_id ? owners[c.account_owner_id] : null;
                  const tagIds = clientTagMap[c.id] ?? [];
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
                        <div className="flex flex-wrap gap-1">
                          {tagIds.map((id) => {
                            const t = tagMap[id];
                            if (!t) return null;
                            return (
                              <Badge key={id} variant="outline" className="border-transparent text-[10px]"
                                style={{ background: `${t.color ?? "#94a3b8"}22`, color: t.color ?? "#475569" }}>
                                {t.name}
                              </Badge>
                            );
                          })}
                          {tagIds.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                        </div>
                      </td>
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
