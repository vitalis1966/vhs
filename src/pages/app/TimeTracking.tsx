import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Pencil, Trash2, Plus, Download, Clock } from "lucide-react";
import { ManualEntryDialog } from "@/components/app/time/ManualEntryDialog";
import { TimeReports } from "@/components/app/time/TimeReports";
import { formatDuration } from "@/lib/timeFormat";
import {
  startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, isSameDay, eachDayOfInterval,
} from "date-fns";
import { toast } from "sonner";
import { toCsv, downloadCsv } from "@/lib/csv";
import {
  ColumnHeader, useTableFilters, TextFilter, MultiSelectFilter, DateRangeFilter, NumberRangeFilter,
} from "@/components/app/columns";

interface Entry {
  id: string;
  user_id: string;
  client_id: string;
  project_id: string | null;
  task_id: string | null;
  activity_type_id: string;
  description: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  is_manual: boolean;
}

interface NameRow { id: string; name: string }
interface UserRow { id: string; full_name: string | null; email: string | null }

type ViewMode = "day" | "week" | "month";

export default function TimeTracking() {
  const { workspaceId, userId, role } = useWorkspace();
  const isAdmin = role === "admin" || role === "manager";
  const [tab, setTab] = useState<"entries" | "reports">("entries");
  const [view, setView] = useState<ViewMode>("day");
  const [cursor, setCursor] = useState<Date>(new Date());
  const [selection, setSelection] = useState<string>("mine"); // 'mine' | 'all' | <userId>
  const [entries, setEntries] = useState<Entry[]>([]);
  const [clients, setClients] = useState<Record<string, NameRow>>({});
  const [projects, setProjects] = useState<Record<string, NameRow>>({});
  const [tasks, setTasks] = useState<Record<string, { id: string; title: string }>>({});
  const [activities, setActivities] = useState<Record<string, NameRow>>({});
  const [users, setUsers] = useState<Record<string, UserRow>>({});
  const [memberList, setMemberList] = useState<UserRow[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [manualOpen, setManualOpen] = useState(false);

  // Load active workspace members for dropdown (admin/manager only)
  useEffect(() => {
    if (!workspaceId || !isAdmin) { setMemberList([]); return; }
    (async () => {
      const { data } = await (supabase as any)
        .from("workspace_members")
        .select("user_id, profiles:profiles!workspace_members_user_id_fkey(id, full_name, email)")
        .eq("workspace_id", workspaceId)
        .eq("status", "active");
      const list: UserRow[] = (data ?? [])
        .map((m: any) => m.profiles)
        .filter((p: any) => p?.id)
        .sort((a: any, b: any) => (a.full_name ?? a.email ?? "").localeCompare(b.full_name ?? b.email ?? ""));
      setMemberList(list);
    })();
  }, [workspaceId, isAdmin]);

  const range = useMemo(() => {
    if (view === "day") return { start: startOfDay(cursor), end: endOfDay(cursor) };
    if (view === "week") return { start: startOfWeek(cursor, { weekStartsOn: 1 }), end: endOfWeek(cursor, { weekStartsOn: 1 }) };
    return { start: startOfMonth(cursor), end: endOfMonth(cursor) };
  }, [view, cursor]);

  const load = useCallback(async () => {
    if (!workspaceId) return;
    let q = (supabase as any).from("time_entries").select("*")
      .eq("workspace_id", workspaceId)
      .gte("started_at", range.start.toISOString())
      .lte("started_at", range.end.toISOString())
      .order("started_at", { ascending: false });
    if (selection === "mine" && userId) q = q.eq("user_id", userId);
    else if (selection !== "all" && selection !== "mine") q = q.eq("user_id", selection);
    const { data } = await q;
    const list: Entry[] = data ?? [];
    setEntries(list);
    const cIds = Array.from(new Set(list.map((e) => e.client_id)));
    const pIds = Array.from(new Set(list.map((e) => e.project_id).filter(Boolean) as string[]));
    const tIds = Array.from(new Set(list.map((e) => e.task_id).filter(Boolean) as string[]));
    const uIds = Array.from(new Set(list.map((e) => e.user_id)));
    const [{ data: cs }, { data: ps }, { data: ts }, { data: ac }, { data: us }] = await Promise.all([
      cIds.length ? (supabase as any).from("clients").select("id, name").in("id", cIds) : { data: [] },
      pIds.length ? (supabase as any).from("projects").select("id, name").in("id", pIds) : { data: [] },
      tIds.length ? (supabase as any).from("tasks").select("id, title").in("id", tIds) : { data: [] },
      (supabase as any).from("time_activity_types").select("id, name").eq("workspace_id", workspaceId),
      uIds.length ? (supabase as any).from("profiles").select("id, full_name, email").in("id", uIds) : { data: [] },
    ]);
    const cm: any = {}; (cs ?? []).forEach((x: any) => cm[x.id] = x); setClients(cm);
    const pm: any = {}; (ps ?? []).forEach((x: any) => pm[x.id] = x); setProjects(pm);
    const tm: any = {}; (ts ?? []).forEach((x: any) => tm[x.id] = x); setTasks(tm);
    const am: any = {}; (ac ?? []).forEach((x: any) => am[x.id] = x); setActivities(am);
    const um: any = {}; (us ?? []).forEach((x: any) => um[x.id] = x); setUsers(um);
  }, [workspaceId, userId, selection, range.start, range.end]);

  useEffect(() => { load(); }, [load]);

  const shift = (dir: 1 | -1) => {
    if (view === "day") setCursor(dir > 0 ? addDays(cursor, 1) : subDays(cursor, 1));
    else if (view === "week") setCursor(dir > 0 ? addWeeks(cursor, 1) : subWeeks(cursor, 1));
    else setCursor(dir > 0 ? addMonths(cursor, 1) : subMonths(cursor, 1));
  };

  const total = entries.reduce((s, e) => s + (e.duration_seconds || 0), 0);
  const totalD = formatDuration(total);

  const del = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const { error } = await (supabase as any).from("time_entries").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    setEntries((p) => p.filter((e) => e.id !== id));
  };

  const exportCsv = () => {
    const rows = entries.map((e) => {
      const d = formatDuration(e.duration_seconds);
      return {
        Date: format(new Date(e.started_at), "yyyy-MM-dd"),
        User: users[e.user_id]?.full_name ?? users[e.user_id]?.email ?? "",
        Client: clients[e.client_id]?.name ?? "",
        Project: e.project_id ? projects[e.project_id]?.name ?? "" : "",
        Task: e.task_id ? tasks[e.task_id]?.title ?? "" : "",
        "Activity Type": activities[e.activity_type_id]?.name ?? "",
        Description: e.description ?? "",
        "Start Time": format(new Date(e.started_at), "HH:mm"),
        "End Time": e.ended_at ? format(new Date(e.ended_at), "HH:mm") : "",
        "Duration (HH:MM)": d.hhmm,
        "Duration (Decimal)": d.decimal.toFixed(2),
      };
    });
    const csv = toCsv(rows);
    downloadCsv(`time-entries-${format(range.start, "yyyy-MM-dd")}.csv`, csv);
  };

  const tf = useTableFilters<"client" | "project" | "task" | "activity" | "date" | "duration">();

  const visibleEntries = useMemo(() => tf.apply(entries, {
    client: {
      filterValue: (e) => clients[e.client_id]?.name ?? "",
      sortValue: (e) => (clients[e.client_id]?.name ?? "").toLowerCase(),
    },
    project: {
      filterValue: (e) => (e.project_id ? projects[e.project_id]?.name ?? "" : ""),
      sortValue: (e) => (e.project_id ? (projects[e.project_id]?.name ?? "").toLowerCase() : ""),
    },
    task: {
      filterValue: (e) => (e.task_id ? tasks[e.task_id]?.title ?? "" : ""),
      sortValue: (e) => (e.task_id ? (tasks[e.task_id]?.title ?? "").toLowerCase() : ""),
    },
    activity: {
      filterValue: (e) => activities[e.activity_type_id]?.name ?? "",
      sortValue: (e) => (activities[e.activity_type_id]?.name ?? "").toLowerCase(),
    },
    date: {
      filterValue: (e) => new Date(e.started_at),
      sortValue: (e) => new Date(e.started_at).getTime(),
    },
    duration: {
      filterValue: (e) => e.duration_seconds,
      sortValue: (e) => e.duration_seconds,
    },
  }), [entries, tf.state, clients, projects, tasks, activities]);

  // Grouping (operates on filtered list; empty groups dropped)
  const grouped = useMemo(() => {
    if (view === "day") {
      const byClient: Record<string, Entry[]> = {};
      visibleEntries.forEach((e) => { (byClient[e.client_id] ||= []).push(e); });
      return { kind: "day", groups: Object.entries(byClient) } as const;
    }
    if (view === "week") {
      const days = eachDayOfInterval(range);
      return {
        kind: "week",
        groups: days
          .map((d) => [
            format(d, "EEEE, MMM d"),
            visibleEntries.filter((e) => isSameDay(new Date(e.started_at), d)),
          ] as [string, Entry[]])
          .filter(([, list]) => list.length > 0),
      } as const;
    }
    const weeks: Record<string, Entry[]> = {};
    visibleEntries.forEach((e) => {
      const key = format(startOfWeek(new Date(e.started_at), { weekStartsOn: 1 }), "MMM d");
      (weeks[key] ||= []).push(e);
    });
    return { kind: "month", groups: Object.entries(weeks) } as const;
  }, [view, range, visibleEntries]);

  // Distinct option lists for multi-selects
  const distinctClientOpts = useMemo(() => Array.from(new Set(entries.map((e) => clients[e.client_id]?.name).filter(Boolean) as string[])).map((n) => ({ value: n, label: n })), [entries, clients]);
  const distinctProjectOpts = useMemo(() => Array.from(new Set(entries.map((e) => e.project_id ? projects[e.project_id]?.name : null).filter(Boolean) as string[])).map((n) => ({ value: n, label: n })), [entries, projects]);
  const distinctActivityOpts = useMemo(() => Array.from(new Set(entries.map((e) => activities[e.activity_type_id]?.name).filter(Boolean) as string[])).map((n) => ({ value: n, label: n })), [entries, activities]);

  const headerLabel = view === "day"
    ? format(cursor, "EEEE, MMMM d, yyyy")
    : view === "week"
      ? `${format(range.start, "MMM d")} – ${format(range.end, "MMM d, yyyy")}`
      : format(cursor, "MMMM yyyy");

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between mb-6 gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Time Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and review hours logged against clients.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setManualOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Add hours
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="entries">Entries</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              {(["day", "week", "month"] as ViewMode[]).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-sm capitalize ${view === v ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => setCursor(new Date())}>Today</Button>
              <Button size="icon" variant="ghost" onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="text-sm font-medium">{headerLabel}</div>

            {isAdmin && (
              <Select value={selection} onValueChange={setSelection}>
                <SelectTrigger className="w-48 h-9 ml-auto"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mine">My entries</SelectItem>
                  <SelectItem value="all">All team members</SelectItem>
                  {memberList.length > 0 && <SelectSeparator />}
                  {memberList.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.full_name ?? m.email ?? "Unknown"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button variant="ghost" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1.5" /> CSV
            </Button>
          </div>

          <div className="rounded-md border border-border bg-card">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="font-medium text-sm">Total</div>
              <div className="text-sm tabular-nums">
                <span className="font-semibold">{totalD.human}</span>
                <span className="text-muted-foreground ml-2">/ {totalD.decimalLabel}</span>
              </div>
            </div>

            {entries.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                No time entries in this period.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {grouped.groups.map(([key, list]) => {
                  const groupTotal = list.reduce((s, e) => s + (e.duration_seconds || 0), 0);
                  const td = formatDuration(groupTotal);
                  const heading = view === "day"
                    ? (clients[key]?.name ?? "Client")
                    : key;
                  return (
                    <div key={key} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{heading}</div>
                        <div className="text-xs tabular-nums text-muted-foreground">{td.human} / {td.decimalLabel}</div>
                      </div>
                      <div className="space-y-1">
                        {list.map((e) => {
                          const d = formatDuration(e.duration_seconds);
                          return (
                            <div key={e.id} className="flex items-center gap-3 px-2 py-2 rounded hover:bg-muted/50 text-sm">
                              <Link to={`/app/clients/${e.client_id}`} className="font-medium hover:underline min-w-[120px] truncate">
                                {clients[e.client_id]?.name ?? "Client"}
                              </Link>
                              <div className="text-xs text-muted-foreground min-w-[140px] truncate">
                                {e.project_id ? projects[e.project_id]?.name ?? "" : ""}
                                {e.task_id ? ` · ${tasks[e.task_id]?.title ?? ""}` : ""}
                              </div>
                              <Badge variant="outline" className="text-[10px]">{activities[e.activity_type_id]?.name ?? ""}</Badge>
                              <div className="flex-1 text-xs text-muted-foreground truncate">{e.description}</div>
                              {scope === "all" && (
                                <div className="text-xs text-muted-foreground">{users[e.user_id]?.full_name ?? users[e.user_id]?.email ?? ""}</div>
                              )}
                              <div className="tabular-nums text-sm font-medium min-w-[140px] text-right">
                                {d.human} <span className="text-muted-foreground text-xs">/ {d.decimalLabel}</span>
                              </div>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditId(e.id)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600" onClick={() => del(e.id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <TimeReports />
        </TabsContent>
      </Tabs>

      <ManualEntryDialog
        open={manualOpen || !!editId}
        editingId={editId}
        onOpenChange={(o) => { if (!o) { setManualOpen(false); setEditId(null); } }}
        onSaved={() => { setEditId(null); setManualOpen(false); load(); }}
      />
    </div>
  );
}
