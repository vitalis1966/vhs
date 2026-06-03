import { useEffect, useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { startOfMonth, subMonths, startOfWeek, addWeeks, format, isAfter, isBefore } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Task { id: string; client_id: string; status_id: string | null; completed_at: string | null; created_at: string; due_date: string | null; }
interface Client { id: string; name: string; status: string | null; industry: string | null; }
interface Status { id: string; name: string; color: string | null; category: string; position: number; }

const PIE_COLORS = ["hsl(var(--accent))", "hsl(var(--primary))", "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#14b8a6", "#a855f7", "#f97316", "#06b6d4"];

export default function LeadershipDashboard() {
  const { workspaceId } = useWorkspace();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    if (!workspaceId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [tRes, cRes, sRes] = await Promise.all([
        (supabase as any).from("tasks").select("id, client_id, status_id, completed_at, created_at, due_date").eq("workspace_id", workspaceId).is("deleted_at", null),
        (supabase as any).from("clients").select("id, name, status, industry").eq("workspace_id", workspaceId),
        (supabase as any).from("task_statuses").select("id, name, color, category, position").eq("workspace_id", workspaceId).order("position"),
      ]);
      if (cancelled) return;
      setTasks((tRes.data ?? []) as Task[]);
      setClients((cRes.data ?? []) as Client[]);
      setStatuses((sRes.data ?? []) as Status[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [workspaceId]);

  const statusMap = useMemo(() => Object.fromEntries(statuses.map((s) => [s.id, s])), [statuses]);

  // KPI: Task completion rate (this month vs last)
  const { rateThisMonth, rateLastMonth } = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const calc = (from: Date, to: Date) => {
      const inWindow = tasks.filter((t) => {
        const c = new Date(t.created_at);
        return c >= from && c < to;
      });
      const completed = inWindow.filter((t) => t.completed_at).length;
      return inWindow.length ? (completed / inWindow.length) * 100 : 0;
    };
    return {
      rateThisMonth: calc(monthStart, new Date(8640000000000000)),
      rateLastMonth: calc(lastMonthStart, monthStart),
    };
  }, [tasks]);

  const openTasks = useMemo(() => tasks.filter((t) => {
    if (t.completed_at) return false;
    const s = t.status_id ? statusMap[t.status_id] : null;
    return !s || (s.category !== "done" && s.category !== "cancelled");
  }), [tasks, statusMap]);

  const activeClients = useMemo(() => clients.filter((c) => c.status === "Active"), [clients]);

  const atRiskClients = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const overdueByClient = new Set<string>();
    for (const t of tasks) {
      if (t.completed_at || !t.due_date) continue;
      if (new Date(t.due_date) < today) overdueByClient.add(t.client_id);
    }
    return activeClients.filter((c) => overdueByClient.has(c.id));
  }, [tasks, activeClients]);

  // Open tasks by client (top 10)
  const openByClient = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of openTasks) counts[t.client_id] = (counts[t.client_id] ?? 0) + 1;
    const nameOf = Object.fromEntries(clients.map((c) => [c.id, c.name]));
    return Object.entries(counts)
      .map(([id, count]) => ({ name: nameOf[id] ?? "Unknown", count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [openTasks, clients]);

  // Clients by industry
  const byIndustry = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of clients) {
      const key = c.industry?.trim() || "Unspecified";
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [clients]);

  // Tasks by status
  const tasksByStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tasks) if (t.status_id) counts[t.status_id] = (counts[t.status_id] ?? 0) + 1;
    return statuses.map((s) => ({ name: s.name, count: counts[s.id] ?? 0, color: s.color ?? "hsl(var(--accent))" }));
  }, [tasks, statuses]);

  // Completion trend over last 8 weeks
  const trend = useMemo(() => {
    const now = new Date();
    const firstWeekStart = startOfWeek(subMonths(now, 0), { weekStartsOn: 1 });
    const weeks = Array.from({ length: 8 }, (_, i) => {
      const start = addWeeks(firstWeekStart, i - 7);
      const end = addWeeks(start, 1);
      return { start, end, label: format(start, "MMM d") };
    });
    return weeks.map((w) => ({
      week: w.label,
      completed: tasks.filter((t) => t.completed_at && isAfter(new Date(t.completed_at), w.start) && isBefore(new Date(t.completed_at), w.end)).length,
    }));
  }, [tasks]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0,1,2,3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Leadership Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Live workspace overview.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Task Completion Rate" value={`${rateThisMonth.toFixed(0)}%`} delta={rateThisMonth - rateLastMonth} suffix="pt vs last mo" />
        <KpiCard label="Open Tasks" value={openTasks.length.toString()} />
        <KpiCard label="Active Clients" value={activeClients.length.toString()} />
        <KpiCard label="At-Risk Clients" value={atRiskClients.length.toString()} tone={atRiskClients.length > 0 ? "warn" : undefined} />
      </div>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Open Tasks by Client" subtitle="Top 10">
          {openByClient.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={openByClient} margin={{ top: 8, right: 12, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} stroke="hsl(var(--muted-foreground))" fontSize={11} height={60} />
                <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Clients by Industry">
          {byIndustry.length === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={byIndustry} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={90} label>
                  {byIndustry.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Full-width: Tasks by status */}
      <ChartCard title="Tasks by Status">
        {tasksByStatus.length === 0 ? <EmptyChart /> : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={tasksByStatus} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {tasksByStatus.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Full-width: completion trend */}
      <ChartCard title="Task Completion Trend" subtitle="Last 8 weeks">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="completed" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--accent))" }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function KpiCard({ label, value, delta, suffix, tone }: { label: string; value: string; delta?: number; suffix?: string; tone?: "warn" }) {
  const hasDelta = typeof delta === "number" && Number.isFinite(delta);
  const dir = hasDelta ? (Math.abs(delta!) < 0.05 ? "flat" : delta! > 0 ? "up" : "down") : null;
  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{label}</div>
      <div className={`mt-2 font-display text-3xl font-bold ${tone === "warn" ? "text-destructive" : "text-foreground"}`}>{value}</div>
      {hasDelta && (
        <div className={`mt-1 inline-flex items-center gap-1 text-xs ${dir === "up" ? "text-emerald-600" : dir === "down" ? "text-destructive" : "text-muted-foreground"}`}>
          {dir === "up" && <ArrowUp className="h-3 w-3" />}
          {dir === "down" && <ArrowDown className="h-3 w-3" />}
          {dir === "flat" && <Minus className="h-3 w-3" />}
          {Math.abs(delta!).toFixed(1)}{suffix ? ` ${suffix}` : ""}
        </div>
      )}
    </Card>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </Card>
  );
}

function EmptyChart() {
  return <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>;
}
