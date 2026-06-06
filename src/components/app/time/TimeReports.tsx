import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatDuration } from "@/lib/timeFormat";
import { toCsv, downloadCsv } from "@/lib/csv";
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subWeeks,
  format, eachDayOfInterval, eachWeekOfInterval, isSameDay, isSameWeek,
} from "date-fns";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import {
  ColumnHeader, useTableFilters, TextFilter, MultiSelectFilter, DateRangeFilter, NumberRangeFilter,
} from "@/components/app/columns";

type ReportKind = "client" | "member" | "project" | "activity";
type RangeKey = "this_week" | "this_month" | "last_month" | "last_3_months" | "custom";

interface Entry {
  id: string;
  user_id: string;
  client_id: string;
  project_id: string | null;
  task_id: string | null;
  activity_type_id: string;
  description: string | null;
  started_at: string;
  duration_seconds: number;
}

const COLORS = ["#60766B", "#C89741", "#172620", "#A28F65", "#3F5C53", "#B57430", "#5A7669", "#D4A859", "#2F4A40", "#8B6B3D"];

export function TimeReports() {
  const { workspaceId, userId, role } = useWorkspace();
  const isAdmin = role === "admin" || role === "manager";
  const [kind, setKind] = useState<ReportKind>("client");
  const [rangeKey, setRangeKey] = useState<RangeKey>("this_month");
  const [customStart, setCustomStart] = useState<string>(format(startOfMonth(new Date()), "yyyy-MM-dd"));
  const [customEnd, setCustomEnd] = useState<string>(format(endOfMonth(new Date()), "yyyy-MM-dd"));
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterMember, setFilterMember] = useState<string>("all");
  const [filterActivity, setFilterActivity] = useState<string>("all");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [clients, setClients] = useState<Record<string, string>>({});
  const [activities, setActivities] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<Record<string, string>>({});
  const [clientList, setClientList] = useState<{ id: string; name: string }[]>([]);
  const [memberList, setMemberList] = useState<{ id: string; name: string }[]>([]);
  const [activityList, setActivityList] = useState<{ id: string; name: string }[]>([]);

  const range = useMemo(() => {
    const today = new Date();
    if (rangeKey === "this_week") return { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) };
    if (rangeKey === "this_month") return { start: startOfMonth(today), end: endOfMonth(today) };
    if (rangeKey === "last_month") {
      const m = subMonths(today, 1);
      return { start: startOfMonth(m), end: endOfMonth(m) };
    }
    if (rangeKey === "last_3_months") return { start: startOfMonth(subMonths(today, 2)), end: endOfMonth(today) };
    return { start: new Date(`${customStart}T00:00:00`), end: new Date(`${customEnd}T23:59:59`) };
  }, [rangeKey, customStart, customEnd]);

  useEffect(() => {
    if (!workspaceId) return;
    (async () => {
      const [{ data: cs }, { data: ac }, { data: members }] = await Promise.all([
        (supabase as any).from("clients").select("id, name").eq("workspace_id", workspaceId).order("name"),
        (supabase as any).from("time_activity_types").select("id, name").eq("workspace_id", workspaceId).order("position"),
        isAdmin
          ? (supabase as any).from("workspace_members").select("user_id, profiles:profiles!workspace_members_user_id_fkey(id, full_name, email)").eq("workspace_id", workspaceId).eq("status", "active")
          : { data: [] },
      ]);
      setClientList(cs ?? []); setActivityList(ac ?? []);
      const um: any = {};
      const ml: { id: string; name: string }[] = [];
      (members ?? []).forEach((m: any) => {
        const p = m.profiles;
        if (p?.id) { um[p.id] = p.full_name ?? p.email ?? "User"; ml.push({ id: p.id, name: um[p.id] }); }
      });
      setMemberList(ml);
    })();
  }, [workspaceId, isAdmin]);

  const load = useCallback(async () => {
    if (!workspaceId) return;
    let q = (supabase as any).from("time_entries").select("*")
      .eq("workspace_id", workspaceId)
      .gte("started_at", range.start.toISOString())
      .lte("started_at", range.end.toISOString());
    if (!isAdmin && userId) q = q.eq("user_id", userId);
    else if (filterMember !== "all") q = q.eq("user_id", filterMember);
    if (filterClient !== "all") q = q.eq("client_id", filterClient);
    if (filterActivity !== "all") q = q.eq("activity_type_id", filterActivity);
    const { data } = await q;
    const list: Entry[] = data ?? [];
    setEntries(list);
    const cIds = Array.from(new Set(list.map((e) => e.client_id)));
    const pIds = Array.from(new Set(list.map((e) => e.project_id).filter(Boolean) as string[]));
    const uIds = Array.from(new Set(list.map((e) => e.user_id)));
    const [{ data: cs }, { data: ps }, { data: ac }, { data: us }] = await Promise.all([
      cIds.length ? (supabase as any).from("clients").select("id, name").in("id", cIds) : { data: [] },
      pIds.length ? (supabase as any).from("projects").select("id, name").in("id", pIds) : { data: [] },
      (supabase as any).from("time_activity_types").select("id, name").eq("workspace_id", workspaceId),
      uIds.length ? (supabase as any).from("profiles").select("id, full_name, email").in("id", uIds) : { data: [] },
    ]);
    const cm: any = {}; (cs ?? []).forEach((x: any) => cm[x.id] = x.name); setClients(cm);
    const pm: any = {}; (ps ?? []).forEach((x: any) => pm[x.id] = x.name); setProjects(pm);
    const am: any = {}; (ac ?? []).forEach((x: any) => am[x.id] = x.name); setActivities(am);
    const um: any = {}; (us ?? []).forEach((x: any) => um[x.id] = x.full_name ?? x.email); setUsers(um);
  }, [workspaceId, userId, isAdmin, range.start, range.end, filterClient, filterMember, filterActivity]);

  useEffect(() => { load(); }, [load]);

  const groupBy = (keyFn: (e: Entry) => string, labelFn: (k: string) => string) => {
    const map: Record<string, number> = {};
    entries.forEach((e) => { const k = keyFn(e); map[k] = (map[k] ?? 0) + (e.duration_seconds || 0); });
    return Object.entries(map).map(([k, sec]) => {
      const d = formatDuration(sec);
      return { id: k, label: labelFn(k), seconds: sec, hours: d.decimal, hhmm: d.hhmm, human: d.human, decimalLabel: d.decimalLabel };
    }).sort((a, b) => b.seconds - a.seconds);
  };

  const byClient = useMemo(() => groupBy((e) => e.client_id, (k) => clients[k] ?? "—"), [entries, clients]);
  const byMember = useMemo(() => groupBy((e) => e.user_id, (k) => users[k] ?? "—"), [entries, users]);
  const byProject = useMemo(() => groupBy((e) => e.project_id ?? "none", (k) => k === "none" ? "(no project)" : (projects[k] ?? "—")), [entries, projects]);
  const byActivity = useMemo(() => groupBy((e) => e.activity_type_id, (k) => activities[k] ?? "—"), [entries, activities]);

  const trend = useMemo(() => {
    // Bucket by day or week depending on span
    const spanDays = (range.end.getTime() - range.start.getTime()) / 86400000;
    if (spanDays <= 31) {
      const days = eachDayOfInterval(range);
      return days.map((d) => {
        const sec = entries.filter((e) => isSameDay(new Date(e.started_at), d)).reduce((s, e) => s + e.duration_seconds, 0);
        return { label: format(d, "MMM d"), hours: Math.round(sec / 36) / 100 };
      });
    }
    const weeks = eachWeekOfInterval(range, { weekStartsOn: 1 });
    return weeks.map((w) => {
      const sec = entries.filter((e) => isSameWeek(new Date(e.started_at), w, { weekStartsOn: 1 })).reduce((s, e) => s + e.duration_seconds, 0);
      return { label: format(w, "MMM d"), hours: Math.round(sec / 36) / 100 };
    });
  }, [entries, range]);

  const totalSec = entries.reduce((s, e) => s + e.duration_seconds, 0);
  const totalD = formatDuration(totalSec);

  const primary = kind === "client" ? byClient : kind === "member" ? byMember : kind === "project" ? byProject : byActivity;
  const primaryLabel = kind === "client" ? "Client" : kind === "member" ? "Team Member" : kind === "project" ? "Project" : "Activity Type";

  const exportCsv = () => {
    const rows = primary.map((r) => ({
      [primaryLabel]: r.label,
      "Duration (HH:MM)": r.hhmm,
      "Duration (Decimal)": r.hours.toFixed(2),
    }));
    downloadCsv(`report-${kind}-${format(range.start, "yyyy-MM-dd")}.csv`, toCsv(rows));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Report</div>
          <Select value={kind} onValueChange={(v: any) => setKind(v)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="client">By Client</SelectItem>
              {isAdmin && <SelectItem value="member">By Team Member</SelectItem>}
              <SelectItem value="project">By Project</SelectItem>
              <SelectItem value="activity">By Activity Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Date range</div>
          <Select value={rangeKey} onValueChange={(v: any) => setRangeKey(v)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="this_week">This week</SelectItem>
              <SelectItem value="this_month">This month</SelectItem>
              <SelectItem value="last_month">Last month</SelectItem>
              <SelectItem value="last_3_months">Last 3 months</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {rangeKey === "custom" && (
          <>
            <input type="date" className="h-10 border border-input rounded-md px-2 text-sm bg-background" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
            <input type="date" className="h-10 border border-input rounded-md px-2 text-sm bg-background" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
          </>
        )}
        {isAdmin && (
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-40 h-10"><SelectValue placeholder="Client" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All clients</SelectItem>
              {clientList.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {isAdmin && (
          <Select value={filterMember} onValueChange={setFilterMember}>
            <SelectTrigger className="w-40 h-10"><SelectValue placeholder="Member" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All members</SelectItem>
              {memberList.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Select value={filterActivity} onValueChange={setFilterActivity}>
          <SelectTrigger className="w-40 h-10"><SelectValue placeholder="Activity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All activities</SelectItem>
            {activityList.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-10" onClick={exportCsv}><Download className="h-4 w-4 mr-1.5" /> CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-md border border-border bg-card p-4">
          <div className="text-sm font-medium mb-3">{primaryLabel} breakdown</div>
          {primary.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No data</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left font-medium py-2">{primaryLabel}</th>
                  <th className="text-right font-medium py-2">HH:MM</th>
                  <th className="text-right font-medium py-2">Decimal</th>
                </tr>
              </thead>
              <tbody>
                {primary.map((r) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="py-2">{r.label}</td>
                    <td className="py-2 text-right tabular-nums">{r.hhmm}</td>
                    <td className="py-2 text-right tabular-nums text-muted-foreground">{r.hours.toFixed(2)}h</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right tabular-nums">{totalD.hhmm}</td>
                  <td className="py-2 text-right tabular-nums">{totalD.decimalLabel}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-md border border-border bg-card p-4">
          <div className="text-sm font-medium mb-3">Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={primary.slice(0, 10)} dataKey="hours" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                {primary.slice(0, 10).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}h`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card p-4">
        <div className="text-sm font-medium mb-3">Hours over time</div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any) => `${v}h`} />
            <Line type="monotone" dataKey="hours" stroke="#60766B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
