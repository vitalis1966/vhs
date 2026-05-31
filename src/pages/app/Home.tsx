import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { usePinnedClients } from "@/hooks/usePinnedClients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  DndContext, PointerSensor, useSensor, useSensors, closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, rectSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  LayoutGrid, X, GripVertical, Plus, RotateCcw, CheckCircle2,
  AlertTriangle, Users, ListChecks, Activity, ArrowRight, FileText,
  Calendar, Pin, TrendingUp, ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format, startOfWeek, addWeeks, isAfter, isBefore } from "date-fns";
import { TaskDetailPanel } from "@/components/app/TaskDetailPanel";
import { PRIORITY_CLASS, initials } from "@/components/app/taskUtils";

// ---------- Types & tile registry ----------
type TileId =
  | "my_tasks_today" | "open_tasks_firm" | "active_clients"
  | "my_upcoming_tasks" | "recent_activity"
  | "at_risk_clients" | "recently_updated_clients"
  | "task_completion_trend"
  | "pinned_clients" | "my_recent_notes" | "upcoming_meetings"
  | "projects_nearing_deadline" | "welcome";

interface TileMeta {
  id: TileId;
  title: string;
  adminOnly?: boolean;
  defaultForAdmin?: boolean;
  defaultForMember?: boolean;
}

const TILES: TileMeta[] = [
  { id: "my_tasks_today", title: "My Tasks Today", defaultForAdmin: true, defaultForMember: true },
  { id: "open_tasks_firm", title: "Open Tasks Across Firm", adminOnly: true, defaultForAdmin: true },
  { id: "active_clients", title: "Active Clients", adminOnly: true, defaultForAdmin: true },
  { id: "my_upcoming_tasks", title: "My Upcoming Tasks", defaultForAdmin: true, defaultForMember: true },
  { id: "recent_activity", title: "Recent Activity", defaultForAdmin: true, defaultForMember: true },
  { id: "at_risk_clients", title: "At-Risk Clients", adminOnly: true, defaultForAdmin: true },
  { id: "recently_updated_clients", title: "Recently Updated Clients", defaultForAdmin: true, defaultForMember: true },
  { id: "task_completion_trend", title: "Task Completion Trend", defaultForAdmin: true, defaultForMember: true },
  { id: "pinned_clients", title: "Pinned Clients", defaultForMember: true },
  { id: "my_recent_notes", title: "My Recent Notes", defaultForMember: true },
  { id: "upcoming_meetings", title: "Upcoming Meetings" },
  { id: "projects_nearing_deadline", title: "Projects Nearing Deadline" },
  { id: "welcome", title: "Welcome" },
];

const KPI_TILES: TileId[] = ["my_tasks_today", "open_tasks_firm", "active_clients", "welcome"];

function defaultLayout(isAdminOrManager: boolean): TileId[] {
  return TILES
    .filter((t) =>
      isAdminOrManager
        ? t.defaultForAdmin
        : t.defaultForMember && !t.adminOnly,
    )
    .map((t) => t.id);
}

function loadLayout(userId: string, isAdminOrManager: boolean): TileId[] {
  try {
    const raw = localStorage.getItem(`home-layout:${userId}`);
    if (!raw) return defaultLayout(isAdminOrManager);
    const parsed = JSON.parse(raw) as TileId[];
    const valid = parsed.filter((id) => TILES.some((t) => t.id === id));
    return valid.length ? valid : defaultLayout(isAdminOrManager);
  } catch {
    return defaultLayout(isAdminOrManager);
  }
}

function saveLayout(userId: string, layout: TileId[]) {
  localStorage.setItem(`home-layout:${userId}`, JSON.stringify(layout));
}

// ---------- Sortable wrapper ----------
function SortableTile({
  id, editing, onRemove, children, span,
}: {
  id: TileId; editing: boolean; onRemove: () => void; children: React.ReactNode;
  span: "kpi" | "medium" | "full";
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: !editing });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const colClass =
    span === "full" ? "col-span-12"
    : span === "medium" ? "col-span-12 lg:col-span-6"
    : "col-span-12 sm:col-span-6 lg:col-span-4";

  return (
    <div ref={setNodeRef} style={style} className={colClass}>
      <Card className="relative h-full">
        {editing && (
          <>
            <button
              {...attributes}
              {...listeners}
              className="absolute top-2 left-2 z-10 p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing"
              aria-label="Drag handle"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
              aria-label="Hide tile"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
        {children}
      </Card>
    </div>
  );
}

// ---------- Tile Components ----------
function TileHeader({ title, icon: Icon, action }: { title: string; icon?: any; action?: React.ReactNode }) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {title}
      </CardTitle>
      {action}
    </CardHeader>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground py-2">{message}</p>;
}

function LoadingRows({ n = 3 }: { n?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: n }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
    </div>
  );
}

// --- KPI: My Tasks Today
function MyTasksTodayTile() {
  const { workspaceId, userId } = useWorkspace();
  const todayStart = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d.toISOString(); }, []);
  const todayEnd = useMemo(() => { const d = new Date(); d.setHours(23,59,59,999); return d.toISOString(); }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["home", "my-tasks-today", workspaceId, userId],
    enabled: !!workspaceId && !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      const { data: assigned } = await (supabase as any)
        .from("task_assignees").select("task_id").eq("user_id", userId);
      const ids = (assigned ?? []).map((r: any) => r.task_id);
      if (!ids.length) return { overdue: 0, today: 0 };
      const { data: tasks } = await (supabase as any)
        .from("tasks")
        .select("id, due_date, completed_at")
        .in("id", ids)
        .is("completed_at", null)
        .eq("workspace_id", workspaceId);
      let overdue = 0, today = 0;
      for (const t of tasks ?? []) {
        if (!t.due_date) continue;
        if (t.due_date < todayStart) overdue++;
        else if (t.due_date <= todayEnd) today++;
      }
      return { overdue, today };
    },
  });

  const total = (data?.overdue ?? 0) + (data?.today ?? 0);

  return (
    <>
      <TileHeader title="My Tasks Today" icon={ListChecks} />
      <CardContent>
        {isLoading ? <Skeleton className="h-16 w-full" /> : total === 0 ? (
          <div className="flex items-center gap-2 py-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <p className="text-sm text-muted-foreground">You are all caught up.</p>
          </div>
        ) : (
          <div className="flex items-end gap-6">
            <div>
              <div className="text-3xl font-bold text-destructive">{data?.overdue ?? 0}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">{data?.today ?? 0}</div>
              <div className="text-xs text-muted-foreground">Due Today</div>
            </div>
          </div>
        )}
        <Link to="/app/my-tasks" className="text-xs text-primary hover:underline mt-3 inline-flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </>
  );
}

// --- KPI: Open Tasks Across Firm
function OpenTasksFirmTile() {
  const { workspaceId } = useWorkspace();
  const { data, isLoading } = useQuery({
    queryKey: ["home", "open-firm", workspaceId],
    enabled: !!workspaceId,
    staleTime: 60_000,
    queryFn: async () => {
      const { data: tasks } = await (supabase as any)
        .from("tasks")
        .select("id, priority")
        .eq("workspace_id", workspaceId)
        .is("completed_at", null);
      const counts = { urgent: 0, high: 0, medium: 0, low: 0 };
      for (const t of tasks ?? []) {
        const p = (t.priority || "").toLowerCase();
        if (p in counts) (counts as any)[p]++;
      }
      return { total: tasks?.length ?? 0, ...counts };
    },
  });

  const badgeCls: Record<string, string> = {
    urgent: "bg-destructive/10 text-destructive",
    high: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    medium: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <>
      <TileHeader title="Open Tasks Across Firm" icon={Activity} />
      <CardContent>
        {isLoading ? <Skeleton className="h-16 w-full" /> : (
          <>
            <div className="text-3xl font-bold">{data?.total ?? 0}</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(["urgent","high","medium","low"] as const).map((p) => (
                <span key={p} className={`px-2 py-0.5 rounded text-xs font-medium ${badgeCls[p]}`}>
                  {p[0].toUpperCase()+p.slice(1)} {data?.[p] ?? 0}
                </span>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </>
  );
}

// --- KPI: Active Clients
function ActiveClientsTile() {
  const { workspaceId } = useWorkspace();
  const { data, isLoading } = useQuery({
    queryKey: ["home", "active-clients", workspaceId],
    enabled: !!workspaceId,
    staleTime: 60_000,
    queryFn: async () => {
      const { data: clients } = await (supabase as any)
        .from("clients").select("id, status").eq("workspace_id", workspaceId);
      const active = (clients ?? []).filter((c: any) => (c.status || "").toLowerCase() === "active");
      if (!active.length) return { active: 0, needAttention: 0 };
      const ids = active.map((c: any) => c.id);
      const nowIso = new Date().toISOString();
      const { data: overdue } = await (supabase as any)
        .from("tasks")
        .select("client_id")
        .in("client_id", ids)
        .is("completed_at", null)
        .lt("due_date", nowIso);
      const needAttention = new Set((overdue ?? []).map((t: any) => t.client_id)).size;
      return { active: active.length, needAttention };
    },
  });

  return (
    <>
      <TileHeader title="Active Clients" icon={Users} />
      <CardContent>
        {isLoading ? <Skeleton className="h-16 w-full" /> : (
          <>
            <div className="text-3xl font-bold">{data?.active ?? 0}</div>
            <div className="text-xs text-amber-600 mt-2">
              {data?.needAttention ?? 0} need attention
            </div>
          </>
        )}
      </CardContent>
    </>
  );
}

// --- Welcome
function WelcomeTile() {
  const { userFullName, role } = useWorkspace();
  const now = new Date();
  const h = now.getHours();
  const greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const first = (userFullName || "").split(" ")[0] || "there";
  return (
    <>
      <TileHeader title="Welcome" />
      <CardContent>
        <div className="text-xl font-display font-semibold">{greet}, {first}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {format(now, "EEEE, MMMM d, yyyy")}
        </div>
        {role && (
          <Badge variant="secondary" className="mt-3 capitalize">
            {role.replace("_", " ")}
          </Badge>
        )}
      </CardContent>
    </>
  );
}

// --- My Upcoming Tasks
function MyUpcomingTasksTile({ onOpenTask }: { onOpenTask: (id: string) => void }) {
  const { workspaceId, userId } = useWorkspace();
  const { data, isLoading } = useQuery({
    queryKey: ["home", "my-upcoming", workspaceId, userId],
    enabled: !!workspaceId && !!userId,
    staleTime: 30_000,
    queryFn: async () => {
      const { data: assigned } = await (supabase as any)
        .from("task_assignees").select("task_id").eq("user_id", userId);
      const ids = (assigned ?? []).map((r: any) => r.task_id);
      if (!ids.length) return [];
      const { data: tasks } = await (supabase as any)
        .from("tasks")
        .select("id, title, priority, due_date, client_id, clients(name)")
        .in("id", ids)
        .is("completed_at", null)
        .eq("workspace_id", workspaceId)
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(5);
      return tasks ?? [];
    },
  });

  return (
    <>
      <TileHeader title="My Upcoming Tasks" icon={ListChecks} />
      <CardContent>
        {isLoading ? <LoadingRows /> : !data?.length ? (
          <EmptyState message="No upcoming tasks. Enjoy the breather." />
        ) : (
          <div className="divide-y">
            {data.map((t: any) => (
              <button
                key={t.id}
                onClick={() => onOpenTask(t.id)}
                className="w-full flex items-center justify-between py-2 text-left hover:bg-muted/50 px-2 rounded"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.clients?.name ?? "—"}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded ${PRIORITY_CLASS[t.priority] ?? ""}`}>
                    {t.priority}
                  </span>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {t.due_date ? format(new Date(t.due_date), "MMM d") : "—"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        <Link to="/app/my-tasks" className="text-xs text-primary hover:underline mt-3 inline-flex items-center gap-1">
          View all my tasks <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </>
  );
}

// --- Recent Activity (realtime)
function describeActivity(a: any): string {
  const actor = a.actor?.full_name ?? "Someone";
  const client = a.client?.name ?? "a client";
  const verb = a.verb || "did something";
  const target = a.target_type || "item";
  const title = a.metadata?.title ? ` "${a.metadata.title}"` : "";
  const map: Record<string, string> = {
    created: `created a ${target}${title}`,
    updated: `updated a ${target}${title}`,
    deleted: `deleted a ${target}${title}`,
    completed: `completed a ${target}${title}`,
    status_changed: `changed ${target} status${title}`,
    assigned: `was assigned to a ${target}${title}`,
  };
  return `${actor} ${map[verb] ?? verb} on ${client}`;
}

function RecentActivityTile() {
  const { workspaceId } = useWorkspace();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["home", "activity", workspaceId],
    enabled: !!workspaceId,
    staleTime: 30_000,
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("activities")
        .select("id, verb, target_type, target_id, client_id, actor_id, metadata, created_at, actor:profiles!activities_actor_id_fkey(full_name), client:clients(name)")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!workspaceId) return;
    const ch = supabase
      .channel(`home-activity-${workspaceId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activities", filter: `workspace_id=eq.${workspaceId}` }, () => {
        qc.invalidateQueries({ queryKey: ["home", "activity", workspaceId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [workspaceId, qc]);

  return (
    <>
      <TileHeader title="Recent Activity" icon={Activity} />
      <CardContent>
        {isLoading ? <LoadingRows n={5} /> : !data?.length ? (
          <EmptyState message="No recent activity yet. Start by adding a client." />
        ) : (
          <div className="space-y-3 max-h-80 overflow-auto">
            {data.map((a: any) => (
              <div key={a.id} className="flex items-start gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">
                    {initials(a.actor?.full_name ?? "?")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{describeActivity(a)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}

// --- At-Risk Clients
function AtRiskClientsTile() {
  const { workspaceId } = useWorkspace();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["home", "at-risk", workspaceId],
    enabled: !!workspaceId,
    staleTime: 60_000,
    queryFn: async () => {
      const nowIso = new Date().toISOString();
      const { data: tasks } = await (supabase as any)
        .from("tasks")
        .select("id, title, due_date, client_id, clients(id, name, status)")
        .eq("workspace_id", workspaceId)
        .is("completed_at", null)
        .lt("due_date", nowIso)
        .order("due_date", { ascending: true });
      const byClient = new Map<string, { id: string; name: string; count: number; oldest: any }>();
      for (const t of tasks ?? []) {
        if (!t.clients || (t.clients.status || "").toLowerCase() !== "active") continue;
        const cid = t.clients.id;
        const cur = byClient.get(cid);
        if (cur) { cur.count++; }
        else byClient.set(cid, { id: cid, name: t.clients.name, count: 1, oldest: t });
      }
      return Array.from(byClient.values()).slice(0, 5);
    },
  });

  return (
    <>
      <TileHeader title="At-Risk Clients" icon={AlertTriangle} />
      <CardContent>
        {isLoading ? <LoadingRows /> : !data?.length ? (
          <EmptyState message="No at-risk clients. Everything is on track." />
        ) : (
          <div className="divide-y">
            {data.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/app/clients/${c.id}`)}
                className="w-full flex items-center justify-between py-2 text-left hover:bg-muted/50 px-2 rounded"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.oldest.title}</div>
                </div>
                <Badge variant="destructive" className="shrink-0">{c.count} overdue</Badge>
              </button>
            ))}
          </div>
        )}
        <Link to="/app/clients" className="text-xs text-primary hover:underline mt-3 inline-flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </>
  );
}

// --- Recently Updated Clients
function RecentlyUpdatedClientsTile() {
  const { workspaceId } = useWorkspace();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["home", "recent-clients", workspaceId],
    enabled: !!workspaceId,
    staleTime: 30_000,
    queryFn: async () => {
      const { data: acts } = await (supabase as any)
        .from("activities")
        .select("client_id, verb, target_type, metadata, created_at, client:clients(id, name)")
        .eq("workspace_id", workspaceId)
        .not("client_id", "is", null)
        .order("created_at", { ascending: false })
        .limit(40);
      const seen = new Set<string>();
      const list: any[] = [];
      for (const a of acts ?? []) {
        if (!a.client || seen.has(a.client_id)) continue;
        seen.add(a.client_id);
        list.push(a);
        if (list.length >= 5) break;
      }
      return list;
    },
  });

  return (
    <>
      <TileHeader title="Recently Updated Clients" icon={Users} />
      <CardContent>
        {isLoading ? <LoadingRows /> : !data?.length ? (
          <EmptyState message="No client activity yet." />
        ) : (
          <div className="divide-y">
            {data.map((a) => (
              <button
                key={a.client_id}
                onClick={() => navigate(`/app/clients/${a.client_id}`)}
                className="w-full flex items-center justify-between py-2 text-left hover:bg-muted/50 px-2 rounded"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{a.client.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {a.verb} {a.target_type}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}

// --- Task Completion Trend
function TaskCompletionTrendTile() {
  const { workspaceId, userId, role } = useWorkspace();
  const isAdminLike = role === "admin" || role === "manager";

  const { data, isLoading } = useQuery({
    queryKey: ["home", "trend", workspaceId, userId, isAdminLike],
    enabled: !!workspaceId && !!userId,
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const start = startOfWeek(addWeeks(new Date(), -7), { weekStartsOn: 1 });
      let query = (supabase as any)
        .from("tasks")
        .select("id, completed_at")
        .eq("workspace_id", workspaceId)
        .not("completed_at", "is", null)
        .gte("completed_at", start.toISOString());

      let taskRows: any[] = [];
      if (!isAdminLike) {
        const { data: assigned } = await (supabase as any)
          .from("task_assignees").select("task_id").eq("user_id", userId);
        const ids = (assigned ?? []).map((r: any) => r.task_id);
        if (!ids.length) return [];
        const { data } = await query.in("id", ids);
        taskRows = data ?? [];
      } else {
        const { data } = await query;
        taskRows = data ?? [];
      }

      const buckets: { label: string; week: Date; count: number }[] = [];
      for (let i = 0; i < 8; i++) {
        const w = addWeeks(start, i);
        buckets.push({ label: format(w, "MMM d"), week: w, count: 0 });
      }
      for (const t of taskRows) {
        const d = new Date(t.completed_at);
        const idx = buckets.findIndex((b, i) => {
          const next = i < 7 ? buckets[i+1].week : addWeeks(b.week, 1);
          return !isBefore(d, b.week) && isBefore(d, next);
        });
        if (idx >= 0) buckets[idx].count++;
      }
      return buckets.map((b) => ({ name: b.label, count: b.count }));
    },
  });

  return (
    <>
      <TileHeader title="Task Completion Trend (8 weeks)" icon={TrendingUp} />
      <CardContent>
        {isLoading ? <Skeleton className="h-48 w-full" /> : !data?.length ? (
          <EmptyState message="No completed tasks yet." />
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </>
  );
}

// --- Pinned Clients
function PinnedClientsTile() {
  const { workspaceId, userId } = useWorkspace();
  const { pinned } = usePinnedClients(userId, workspaceId);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["home", "pinned", workspaceId, pinned],
    enabled: !!workspaceId && pinned.length > 0,
    staleTime: 60_000,
    queryFn: async () => {
      const { data: clients } = await (supabase as any)
        .from("clients").select("id, name, status").in("id", pinned);
      const ids = (clients ?? []).map((c: any) => c.id);
      const { data: tasks } = ids.length ? await (supabase as any)
        .from("tasks").select("client_id").in("client_id", ids).is("completed_at", null) : { data: [] };
      const counts = new Map<string, number>();
      for (const t of tasks ?? []) counts.set(t.client_id, (counts.get(t.client_id) ?? 0) + 1);
      return (clients ?? []).map((c: any) => ({ ...c, open: counts.get(c.id) ?? 0 }));
    },
  });

  return (
    <>
      <TileHeader title="Pinned Clients" icon={Pin} />
      <CardContent>
        {!pinned.length ? <EmptyState message="No pinned clients. Pin clients from the sidebar." /> :
          isLoading ? <LoadingRows /> :
          (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data?.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/app/clients/${c.id}`)}
                  className="border rounded-md p-3 text-left hover:bg-muted/50"
                >
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="secondary" className="text-xs">{c.status ?? "—"}</Badge>
                    <span className="text-xs text-muted-foreground">{c.open} open</span>
                  </div>
                </button>
              ))}
            </div>
          )
        }
      </CardContent>
    </>
  );
}

// --- My Recent Notes
function MyRecentNotesTile() {
  const { workspaceId, userId } = useWorkspace();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["home", "my-notes", workspaceId, userId],
    enabled: !!workspaceId && !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("notes")
        .select("id, title, updated_at, client_id, clients(name)")
        .eq("workspace_id", workspaceId)
        .or(`created_by.eq.${userId},updated_by.eq.${userId}`)
        .order("updated_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  return (
    <>
      <TileHeader title="My Recent Notes" icon={FileText} />
      <CardContent>
        {isLoading ? <LoadingRows /> : !data?.length ? (
          <EmptyState message="No notes yet." />
        ) : (
          <div className="divide-y">
            {data.map((n: any) => (
              <button
                key={n.id}
                onClick={() => navigate(`/app/clients/${n.client_id}?note=${n.id}`)}
                className="w-full flex items-center justify-between py-2 text-left hover:bg-muted/50 px-2 rounded"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{n.title || "Untitled"}</div>
                  <div className="text-xs text-muted-foreground truncate">{n.clients?.name ?? ""}</div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(n.updated_at), { addSuffix: true })}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}

// --- Upcoming Meetings
function UpcomingMeetingsTile() {
  const { workspaceId } = useWorkspace();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["home", "meetings", workspaceId],
    enabled: !!workspaceId,
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("meetings")
        .select("id, title, meeting_date, client_id, clients(name)")
        .eq("workspace_id", workspaceId)
        .gte("meeting_date", new Date().toISOString())
        .order("meeting_date", { ascending: true })
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <>
      <TileHeader title="Upcoming Meetings" icon={Calendar} />
      <CardContent>
        {isLoading ? <LoadingRows /> : !data?.length ? (
          <EmptyState message="No upcoming meetings." />
        ) : (
          <div className="divide-y">
            {data.map((m: any) => (
              <button
                key={m.id}
                onClick={() => navigate(`/app/clients/${m.client_id}`)}
                className="w-full flex items-center justify-between py-2 text-left hover:bg-muted/50 px-2 rounded"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{m.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{m.clients?.name}</div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {format(new Date(m.meeting_date), "MMM d, p")}
                </span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}

// --- Projects Nearing Deadline
function ProjectsNearingDeadlineTile() {
  const { workspaceId } = useWorkspace();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["home", "projects-near", workspaceId],
    enabled: !!workspaceId,
    staleTime: 60_000,
    queryFn: async () => {
      const now = new Date();
      const in14 = new Date(); in14.setDate(in14.getDate() + 14);
      const { data: projs } = await (supabase as any)
        .from("projects")
        .select("id, name, status, target_date, client_id, clients(name)")
        .eq("workspace_id", workspaceId)
        .gte("target_date", now.toISOString())
        .lte("target_date", in14.toISOString())
        .order("target_date", { ascending: true });
      const filtered = (projs ?? []).filter((p: any) => {
        const s = (p.status || "").toLowerCase();
        return s !== "complete" && s !== "completed" && s !== "cancelled";
      });
      if (!filtered.length) return [];
      const ids = filtered.map((p: any) => p.id);
      const { data: tasks } = await (supabase as any)
        .from("tasks").select("project_id, completed_at").in("project_id", ids);
      const total = new Map<string, number>();
      const done = new Map<string, number>();
      for (const t of tasks ?? []) {
        total.set(t.project_id, (total.get(t.project_id) ?? 0) + 1);
        if (t.completed_at) done.set(t.project_id, (done.get(t.project_id) ?? 0) + 1);
      }
      return filtered.map((p: any) => {
        const tot = total.get(p.id) ?? 0;
        const dn = done.get(p.id) ?? 0;
        return { ...p, progress: tot ? Math.round((dn / tot) * 100) : 0 };
      });
    },
  });

  return (
    <>
      <TileHeader title="Projects Nearing Deadline" icon={Calendar} />
      <CardContent>
        {isLoading ? <LoadingRows /> : !data?.length ? (
          <EmptyState message="No projects with deadlines in the next 14 days." />
        ) : (
          <div className="space-y-3">
            {data.map((p: any) => (
              <button
                key={p.id}
                onClick={() => navigate(`/app/projects/${p.id}`)}
                className="w-full text-left hover:bg-muted/50 px-2 py-1.5 rounded"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <span className="text-xs text-muted-foreground ml-2 shrink-0">
                    {format(new Date(p.target_date), "MMM d")}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate mb-1">{p.clients?.name}</div>
                <Progress value={p.progress} className="h-1.5" />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}

// ---------- Renderer ----------
function renderTile(id: TileId, ctx: { onOpenTask: (id: string) => void }) {
  switch (id) {
    case "my_tasks_today": return <MyTasksTodayTile />;
    case "open_tasks_firm": return <OpenTasksFirmTile />;
    case "active_clients": return <ActiveClientsTile />;
    case "welcome": return <WelcomeTile />;
    case "my_upcoming_tasks": return <MyUpcomingTasksTile onOpenTask={ctx.onOpenTask} />;
    case "recent_activity": return <RecentActivityTile />;
    case "at_risk_clients": return <AtRiskClientsTile />;
    case "recently_updated_clients": return <RecentlyUpdatedClientsTile />;
    case "task_completion_trend": return <TaskCompletionTrendTile />;
    case "pinned_clients": return <PinnedClientsTile />;
    case "my_recent_notes": return <MyRecentNotesTile />;
    case "upcoming_meetings": return <UpcomingMeetingsTile />;
    case "projects_nearing_deadline": return <ProjectsNearingDeadlineTile />;
  }
}

function getSpan(id: TileId): "kpi" | "medium" | "full" {
  if (id === "task_completion_trend") return "full";
  if (KPI_TILES.includes(id)) return "kpi";
  return "medium";
}

// ---------- Page ----------
export default function Home() {
  const { userId, role, loading } = useWorkspace();
  const isAdminLike = role === "admin" || role === "manager";
  const [layout, setLayout] = useState<TileId[]>([]);
  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (userId) setLayout(loadLayout(userId, isAdminLike));
  }, [userId, isAdminLike]);

  const persist = useCallback((next: TileId[]) => {
    setLayout(next);
    if (userId) saveLayout(userId, next);
  }, [userId]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldI = layout.indexOf(active.id as TileId);
    const newI = layout.indexOf(over.id as TileId);
    if (oldI < 0 || newI < 0) return;
    persist(arrayMove(layout, oldI, newI));
  };

  const removeTile = (id: TileId) => persist(layout.filter((t) => t !== id));
  const addTile = (id: TileId) => { persist([...layout, id]); setAddOpen(false); };
  const reset = () => userId && persist(defaultLayout(isAdminLike));

  const hidden = TILES.filter((t) => !layout.includes(t.id) && (!t.adminOnly || isAdminLike));

  if (loading && !layout.length) {
    return (
      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="col-span-12 lg:col-span-4 h-40" />)}
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Home</h1>
          <p className="text-sm text-muted-foreground">Your workspace overview.</p>
        </div>
        <div className="flex items-center gap-2">
          {editing && (
            <>
              <Button variant="outline" size="sm" onClick={() => setAddOpen(true)} disabled={!hidden.length}>
                <Plus className="h-4 w-4 mr-1" /> Add Tile
              </Button>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-1" /> Reset Layout
              </Button>
            </>
          )}
          <Button
            variant={editing ? "default" : "outline"}
            size="sm"
            onClick={() => setEditing((v) => !v)}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            {editing ? "Done" : "Edit Layout"}
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={layout} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-12 gap-4">
            {layout.map((id) => (
              <SortableTile
                key={id}
                id={id}
                editing={editing}
                onRemove={() => removeTile(id)}
                span={getSpan(id)}
              >
                {renderTile(id, { onOpenTask: setOpenTaskId })}
              </SortableTile>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a tile</DialogTitle>
            <DialogDescription>Choose a hidden tile to add back to your home.</DialogDescription>
          </DialogHeader>
          {!hidden.length ? (
            <p className="text-sm text-muted-foreground">All tiles are already on your home.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hidden.map((t) => (
                <button
                  key={t.id}
                  onClick={() => addTile(t.id)}
                  className="border rounded-md p-3 text-left hover:bg-muted/50 flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{t.title}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <TaskDetailPanel
        taskId={openTaskId}
        open={!!openTaskId}
        onOpenChange={(o) => !o && setOpenTaskId(null)}
        onChanged={() => qc.invalidateQueries({ queryKey: ["home"] })}
      />
    </div>
  );
}
