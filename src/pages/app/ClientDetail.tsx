import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pin, PinOff, Pencil, Plus, Star, Mail } from "lucide-react";
import { ClientFormDialog } from "@/components/app/ClientFormDialog";
import { ProjectsTab } from "@/components/app/ProjectsTab";
import { TasksTab } from "@/components/app/TasksTab";
import { NotesTab } from "@/components/app/NotesTab";
import { MeetingsTab } from "@/components/app/MeetingsTab";
import { Attachments } from "@/components/app/Attachments";
import { ComposeEmailDialog } from "@/components/app/email/ComposeEmailDialog";
import { EmailsTab, RecentEmailsCard } from "@/components/app/email/EmailsTab";
import { usePinnedClients } from "@/hooks/usePinnedClients";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const statusColor: Record<string, string> = {
  Prospect: "bg-blue-100 text-blue-800 border-blue-200",
  Active: "bg-green-100 text-green-800 border-green-200",
  "On Hold": "bg-amber-100 text-amber-800 border-amber-200",
  Closed: "bg-slate-100 text-slate-700 border-slate-200",
};

function initials(s?: string | null) {
  if (!s) return "?";
  return s.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

interface Contact { id: string; name: string; title: string | null; email: string | null; phone: string | null; is_primary: boolean | null; client_id: string; }
interface Project { id: string; name: string; status: string | null; target_date: string | null; }
interface Activity { id: string; verb: string; target_type: string | null; metadata: any; created_at: string; actor_id: string | null; }

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const { userId, workspaceId, role } = useWorkspace();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "overview";
  const canManage = role === "admin" || role === "manager";

  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [owner, setOwner] = useState<any | null>(null);
  const [tags, setTags] = useState<Array<{ id: string; name: string; color: string | null }>>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectProgress, setProjectProgress] = useState<Record<string, number>>({});
  const [openTaskCount, setOpenTaskCount] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [actors, setActors] = useState<Record<string, any>>({});
  const [recentMeetings, setRecentMeetings] = useState<Array<{ id: string; title: string; meeting_date: string; summary_text: string | null }>>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [addContact, setAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const { isPinned, toggle: togglePin } = usePinnedClients(userId, workspaceId);

  const loadAll = async () => {
    if (!clientId) return;
    setLoading(true);

    const { data: c, error } = await (supabase as any)
      .from("clients").select("*").eq("id", clientId).maybeSingle();
    if (error || !c) { setNotFound(true); setLoading(false); return; }
    setClient(c);

    if (c.account_owner_id) {
      const { data: o } = await (supabase as any)
        .from("profiles").select("id, full_name, email").eq("id", c.account_owner_id).maybeSingle();
      setOwner(o);
    } else setOwner(null);

    // Tags via taggings
    const { data: tg } = await (supabase as any)
      .from("taggings").select("tag_id, tags(id, name, color, category)")
      .eq("taggable_type", "client").eq("taggable_id", clientId);
    setTags((tg ?? []).map((t: any) => t.tags).filter(Boolean));

    // Contacts
    const { data: cts } = await (supabase as any)
      .from("contacts").select("*").eq("client_id", clientId);
    setContacts(cts ?? []);

    // Projects
    const { data: pjs } = await (supabase as any)
      .from("projects").select("id, name, status, target_date")
      .eq("client_id", clientId);
    const active = (pjs ?? []).filter((p: any) => p.status !== "Complete" && p.status !== "Cancelled");
    setProjects(active);

    if (active.length) {
      const { data: pts } = await (supabase as any)
        .from("tasks").select("project_id, completed_at").is("deleted_at", null)
        .in("project_id", active.map((p: any) => p.id));
      const totals: Record<string, { done: number; total: number }> = {};
      (pts ?? []).forEach((t: any) => {
        const k = t.project_id;
        totals[k] = totals[k] ?? { done: 0, total: 0 };
        totals[k].total += 1;
        if (t.completed_at) totals[k].done += 1;
      });
      const pct: Record<string, number> = {};
      Object.entries(totals).forEach(([k, v]) => { pct[k] = v.total ? Math.round((v.done / v.total) * 100) : 0; });
      setProjectProgress(pct);
    } else setProjectProgress({});

    // Open task count for this client
    const { count } = await (supabase as any)
      .from("tasks").select("id", { count: "exact", head: true }).is("deleted_at", null)
      .eq("client_id", clientId).is("completed_at", null);
    setOpenTaskCount(count ?? 0);

    // Activities
    const { data: acts } = await (supabase as any)
      .from("activities").select("id, verb, target_type, metadata, created_at, actor_id")
      .eq("client_id", clientId).order("created_at", { ascending: false }).limit(20);
    setActivities(acts ?? []);
    const actorIds = Array.from(new Set((acts ?? []).map((a: any) => a.actor_id).filter(Boolean))) as string[];
    if (actorIds.length) {
      const { data: profs } = await (supabase as any)
        .from("profiles").select("id, full_name, email").in("id", actorIds);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => { map[p.id] = p; });
      setActors(map);
    }

    // Recent meetings (top 2)
    const { data: rm } = await (supabase as any)
      .from("meetings").select("id, title, meeting_date, summary_text")
      .eq("client_id", clientId).order("meeting_date", { ascending: false }).limit(2);
    setRecentMeetings(rm ?? []);

    setLoading(false);
  };

  useEffect(() => { void loadAll(); /* eslint-disable-next-line */ }, [clientId]);

  // Realtime activity feed
  useEffect(() => {
    if (!clientId) return;
    const channel = supabase
      .channel(`activities-${clientId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activities", filter: `client_id=eq.${clientId}` },
        (payload) => {
          setActivities((prev) => [payload.new as any, ...prev].slice(0, 20));
          const aId = (payload.new as any).actor_id;
          if (aId && !actors[aId]) {
            void (supabase as any).from("profiles").select("id, full_name, email").eq("id", aId).maybeSingle()
              .then((r: any) => { if (r.data) setActors((p) => ({ ...p, [aId]: r.data })); });
          }
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [clientId, actors]);

  const primaryContact = useMemo(() => contacts.find((c) => c.is_primary), [contacts]);

  if (loading) return <div className="text-muted-foreground">Loading…</div>;
  if (notFound || !client) {
    return (
      <div className="max-w-xl">
        <h1 className="font-display text-2xl font-bold mb-2">Client not found</h1>
        <p className="text-muted-foreground mb-4">This client doesn't exist or you don't have access to it.</p>
        <Button variant="outline" onClick={() => navigate("/app/clients")}>Back to clients</Button>
      </div>
    );
  }

  const pinned = isPinned(client.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl font-bold text-foreground">{client.name}</h1>
            <Badge variant="outline" className={statusColor[client.status ?? "Active"] ?? ""}>
              {client.status ?? "—"}
            </Badge>
            {client.industry && <span className="text-sm text-muted-foreground">{client.industry}</span>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {tags.map((t) => (
              <Badge key={t.id} variant="outline" style={t.color ? { borderColor: t.color, color: t.color } : undefined}>
                {t.name}
              </Badge>
            ))}
            {owner && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-2">
                <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(owner.full_name ?? owner.email)}</AvatarFallback></Avatar>
                <span>{owner.full_name ?? owner.email}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => { togglePin(client.id); toast.success(pinned ? "Unpinned" : "Pinned to sidebar"); }}
          >
            {pinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
            {pinned ? "Unpin" : "Pin"}
          </Button>
          {canManage && (
            <>
              <Button size="sm" variant="outline" onClick={() => setComposeOpen(true)}>
                <Mail className="h-4 w-4 mr-2" /> Send Email
              </Button>
              <Button size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => { searchParams.set("tab", v); setSearchParams(searchParams, { replace: true }); }}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Key facts */}
              <Card title="Key Facts">
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <KV label="Start Date" value={client.start_date ?? "—"} />
                  <KV label="Health Score" value={client.health_score != null ? String(client.health_score) : "—"} />
                  <KV label="Primary Contact" value={primaryContact?.name ?? "—"} />
                  <KV label="Contact Email" value={primaryContact?.email ?? "—"} />
                  <KV label="Open Tasks" value={String(openTaskCount)} />
                  <KV label="Website" value={client.website ?? "—"} />
                </dl>
              </Card>

              {/* Active projects */}
              <Card title="Active Projects">
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active projects.</p>
                ) : (
                  <ul className="divide-y">
                    {projects.map((p) => {
                      const pct = projectProgress[p.id] ?? 0;
                      return (
                        <li key={p.id}
                          onClick={() => navigate(`/app/clients/${clientId}/projects/${p.id}`)}
                          className="py-3 cursor-pointer hover:bg-muted/30 -mx-2 px-2 rounded">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-sm">{p.name}</span>
                            <Badge variant="outline" className="text-xs">{p.status ?? "—"}</Badge>
                          </div>
                          <div className="flex items-center justify-between gap-3 mt-2">
                            <div className="h-1.5 bg-muted rounded-full flex-1 overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums w-16 text-right">
                              {p.target_date ?? "—"}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>

              {/* Recent Meetings */}
              <Card
                title="Recent Meetings"
                action={
                  <Button size="sm" variant="ghost" onClick={() => setSearchParams({ tab: "meetings" })}>
                    View all
                  </Button>
                }
              >
                {recentMeetings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No meetings logged yet.</p>
                ) : (
                  <ul className="divide-y">
                    {recentMeetings.map((m) => (
                      <li
                        key={m.id}
                        onClick={() => setSearchParams({ tab: "meetings" })}
                        className="py-3 cursor-pointer hover:bg-muted/30 -mx-2 px-2 rounded"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-sm truncate">{m.title}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(m.meeting_date), { addSuffix: true })}
                          </span>
                        </div>
                        {m.summary_text && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.summary_text}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <RecentEmailsCard clientId={client.id} onViewAll={() => setSearchParams({ tab: "emails" })} />

              {/* Contacts */}
              <Card
                title="Contacts"
                action={<Button size="sm" variant="outline" onClick={() => { setEditingContact(null); setAddContact(true); }}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>}
              >
                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No contacts yet.</p>
                ) : (
                  <ul className="divide-y">
                    {contacts.map((c) => (
                      <li key={c.id}
                        onClick={() => { setEditingContact(c); setAddContact(true); }}
                        className="py-3 cursor-pointer hover:bg-muted/30 -mx-2 px-2 rounded">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{c.name}</span>
                          {c.is_primary && <Badge variant="outline" className="text-xs"><Star className="h-3 w-3 mr-1" />Primary</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {[c.title, c.email, c.phone].filter(Boolean).join(" · ") || "—"}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {addContact && (
                  <ContactForm
                    clientId={client.id}
                    contact={editingContact}
                    onClose={() => { setAddContact(false); setEditingContact(null); }}
                    onSaved={loadAll}
                  />
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Activity Feed">
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {activities.map((a) => {
                      const actor = a.actor_id ? actors[a.actor_id] : null;
                      const desc = formatActivity(a);
                      return (
                        <li key={a.id} className="flex items-start gap-3 text-sm">
                          <Avatar className="h-7 w-7 mt-0.5">
                            <AvatarFallback className="text-[10px]">{initials(actor?.full_name ?? actor?.email)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground">
                              <span className="font-medium">{actor?.full_name ?? actor?.email ?? "Someone"}</span>{" "}
                              <span className="text-muted-foreground">{desc}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-6"><ProjectsTab clientId={client.id} /></TabsContent>
        <TabsContent value="tasks" className="mt-6"><TasksTab clientId={client.id} /></TabsContent>
        <TabsContent value="notes" className="mt-6"><NotesTab clientId={client.id} /></TabsContent>
        <TabsContent value="meetings" className="mt-6"><MeetingsTab clientId={client.id} workspaceId={client.workspace_id} /></TabsContent>
        <TabsContent value="files" className="mt-6">
          <Attachments attachableType="client" attachableId={client.id} workspaceId={client.workspace_id} />
        </TabsContent>
        <TabsContent value="emails" className="mt-6"><EmailsTab clientId={client.id} /></TabsContent>
      </Tabs>

      <ComposeEmailDialog open={composeOpen} onOpenChange={setComposeOpen} clientId={client.id} lockClient />

      <ClientFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={{
          id: client.id, name: client.name, status: client.status, industry: client.industry,
          account_owner_id: client.account_owner_id, start_date: client.start_date,
          website: client.website, summary: client.summary,
        }}
        onSaved={loadAll}
      />
    </div>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground mt-0.5">{value}</dd>
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">{text}</div>;
}

function formatActivity(a: Activity) {
  const target = a.metadata?.name ?? a.metadata?.title ?? a.target_type ?? "";
  if (a.verb === "created" && a.target_type === "client") return `created this client`;
  if (a.verb === "meeting_logged") return `logged meeting${target ? ` "${target}"` : ""}`;
  return `${a.verb} ${a.target_type ?? ""}${target ? ` "${target}"` : ""}`.trim();
}

function ContactForm({
  clientId, contact, onClose, onSaved,
}: { clientId: string; contact: Contact | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: contact?.name ?? "", title: contact?.title ?? "", email: contact?.email ?? "",
    phone: contact?.phone ?? "", is_primary: contact?.is_primary ?? false,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    setSaving(true);
    try {
      const payload: any = {
        name: form.name.trim(), title: form.title || null, email: form.email || null,
        phone: form.phone || null, is_primary: form.is_primary, client_id: clientId,
      };
      if (contact) {
        const { error } = await (supabase as any).from("contacts").update(payload).eq("id", contact.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("contacts").insert(payload);
        if (error) throw error;
      }
      toast.success("Saved");
      onSaved(); onClose();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally { setSaving(false); }
  };

  const remove = async () => {
    if (!contact) return;
    const { error } = await (supabase as any).from("contacts").delete().eq("id", contact.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); onSaved(); onClose(); }
  };

  return (
    <div className="mt-4 p-4 border rounded-md space-y-3 bg-muted/30">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label className="text-xs">Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label className="text-xs">Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_primary} onChange={(e) => setForm({ ...form, is_primary: e.target.checked })} />
        Primary contact
      </label>
      <div className="flex justify-between gap-2">
        <div>{contact && <Button size="sm" variant="ghost" onClick={remove}>Delete</Button>}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}
