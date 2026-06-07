import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { formatDuration } from "@/lib/timeFormat";

interface Props { projectId: string; workspaceId: string }
interface ActivityType { id: string; name: string }
interface Contract {
  id: string;
  total_hours: number;
  period_start: string | null;
  period_end: string | null;
  cadence: "monthly" | "one_time";
  rollover_unused: boolean;
}
interface Alloc { activity_type_id: string; allocated_hours: number }

function barColor(pct: number) {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 75) return "bg-amber-500";
  return "bg-emerald-500";
}
function HoursBar({ used, allocated }: { used: number; allocated: number }) {
  const pct = allocated > 0 ? Math.min(100, (used / allocated) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${barColor(pct)} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs tabular-nums text-muted-foreground min-w-[60px] text-right">{pct.toFixed(0)}%</div>
    </div>
  );
}
function currentMonthRange() {
  const n = new Date();
  return { start: new Date(n.getFullYear(), n.getMonth(), 1), end: new Date(n.getFullYear(), n.getMonth() + 1, 1) };
}
function monthsBetween(a: Date, b: Date) {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

export function ProjectContractedHoursSection({ projectId, workspaceId }: Props) {
  const { role } = useWorkspace();
  const canManage = role === "admin" || role === "manager";
  const [contract, setContract] = useState<Contract | null>(null);
  const [allocs, setAllocs] = useState<Alloc[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [usedTotal, setUsedTotal] = useState(0);
  const [usedByActivity, setUsedByActivity] = useState<Record<string, number>>({});
  const [carryover, setCarryover] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Contract>({ id: "", total_hours: 0, period_start: null, period_end: null, cadence: "one_time", rollover_unused: false });
  const [draftAllocs, setDraftAllocs] = useState<Alloc[]>([]);

  const load = useCallback(async () => {
    if (!projectId || !workspaceId) return;
    const { data: a } = await (supabase as any).from("time_activity_types")
      .select("id, name").eq("workspace_id", workspaceId).eq("is_active", true).order("position");
    setActivities(a ?? []);

    const { data: ch } = await (supabase as any).from("project_contracted_hours")
      .select("*").eq("project_id", projectId).maybeSingle();
    const row: Contract | null = ch ? {
      ...ch, cadence: ch.cadence ?? "one_time", rollover_unused: ch.rollover_unused ?? false,
    } : null;
    setContract(row);

    if (row) {
      const { data: ca } = await (supabase as any).from("project_contracted_hours_by_activity")
        .select("*").eq("project_contracted_hours_id", row.id);
      setAllocs(ca ?? []);
    } else setAllocs([]);

    let startIso: string | null = null;
    let endIso: string | null = null;
    if (row?.cadence === "monthly") {
      const { start, end } = currentMonthRange();
      startIso = start.toISOString(); endIso = end.toISOString();
    } else if (row?.period_start || row?.period_end) {
      startIso = row?.period_start ? new Date(row.period_start).toISOString() : null;
      endIso = row?.period_end ? new Date(new Date(row.period_end).getTime() + 86400000).toISOString() : null;
    }

    const { data: summary } = await (supabase as any).rpc("get_project_time_summary_window", {
      p_project_id: projectId, p_start: startIso, p_end: endIso,
    });
    if (summary) {
      setUsedTotal(Number(summary.total_used_hours ?? 0));
      const m: Record<string, number> = {};
      (summary.by_activity ?? []).forEach((r: any) => { m[r.activity_type_id] = Number(r.used_hours ?? 0); });
      setUsedByActivity(m);
    } else { setUsedTotal(0); setUsedByActivity({}); }

    if (row?.cadence === "monthly" && row.rollover_unused && row.period_start) {
      const ps = new Date(row.period_start);
      const { start: curStart } = currentMonthRange();
      const monthsBefore = Math.max(0, monthsBetween(new Date(ps.getFullYear(), ps.getMonth(), 1), curStart));
      if (monthsBefore > 0) {
        const { data: prior } = await (supabase as any).rpc("get_project_time_summary_window", {
          p_project_id: projectId,
          p_start: new Date(ps.getFullYear(), ps.getMonth(), 1).toISOString(),
          p_end: curStart.toISOString(),
        });
        const usedBefore = Number(prior?.total_used_hours ?? 0);
        const allowanceBefore = monthsBefore * Number(row.total_hours ?? 0);
        setCarryover(Math.max(0, allowanceBefore - usedBefore));
      } else setCarryover(0);
    } else setCarryover(0);
  }, [projectId, workspaceId]);

  useEffect(() => { load(); }, [load]);

  const openEditor = () => {
    setDraft(contract ?? { id: "", total_hours: 0, period_start: null, period_end: null, cadence: "one_time", rollover_unused: false });
    setDraftAllocs(allocs.length ? [...allocs] : []);
    setEditing(true);
  };

  const save = async () => {
    let id = contract?.id ?? null;
    const allocSum = draftAllocs.reduce((s, d) => s + (Number(d.allocated_hours) || 0), 0);
    const payload = {
      total_hours: allocSum,
      period_start: draft.period_start,
      period_end: draft.period_end,
      cadence: draft.cadence,
      rollover_unused: draft.cadence === "monthly" ? draft.rollover_unused : false,
    };
    if (id) {
      const { error } = await (supabase as any).from("project_contracted_hours").update(payload).eq("id", id);
      if (error) { toast.error(error.message); return; }
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await (supabase as any).from("project_contracted_hours").insert({
        workspace_id: workspaceId, project_id: projectId, ...payload, created_by: user?.id ?? null,
      }).select().single();
      if (error) { toast.error(error.message); return; }
      id = data.id;
    }
    await (supabase as any).from("project_contracted_hours_by_activity").delete().eq("project_contracted_hours_id", id);
    const filled = draftAllocs.filter((d) => d.allocated_hours > 0);
    if (filled.length) {
      const { error } = await (supabase as any).from("project_contracted_hours_by_activity").insert(
        filled.map((a) => ({ project_contracted_hours_id: id, activity_type_id: a.activity_type_id, allocated_hours: a.allocated_hours }))
      );
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Project budget saved");
    setEditing(false);
    load();
  };

  const base = contract?.total_hours ?? 0;
  const totalAllocated = base + carryover;
  const remaining = Math.max(0, totalAllocated - usedTotal);

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Cadence</Label>
          <RadioGroup
            value={draft.cadence}
            onValueChange={(v) => setDraft({ ...draft, cadence: v as "monthly" | "one_time" })}
            className="flex gap-6"
          >
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <RadioGroupItem value="one_time" /> One-time pool
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <RadioGroupItem value="monthly" /> Monthly recurring
            </label>
          </RadioGroup>
          {draft.cadence === "monthly" && (
            <label className="flex items-center gap-2 text-sm pt-1 cursor-pointer">
              <Checkbox checked={draft.rollover_unused} onCheckedChange={(v) => setDraft({ ...draft, rollover_unused: !!v })} />
              Roll unused hours over to next month
            </label>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">{draft.cadence === "monthly" ? "Hours per month" : "Total hours"}</Label>
            <Input type="number" min={0} step={0.5} value={draft.total_hours}
              onChange={(e) => setDraft({ ...draft, total_hours: parseFloat(e.target.value || "0") })} />
          </div>
          <div>
            <Label className="text-xs">Start</Label>
            <Input type="date" value={draft.period_start ?? ""} onChange={(e) => setDraft({ ...draft, period_start: e.target.value || null })} />
          </div>
          <div>
            <Label className="text-xs">End</Label>
            <Input type="date" value={draft.period_end ?? ""} onChange={(e) => setDraft({ ...draft, period_end: e.target.value || null })} />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-2 block">
            Allocation by activity ({draft.cadence === "monthly" ? "hours / month" : "hours"})
          </Label>
          <div className="space-y-1">
            {activities.map((a) => {
              const row = draftAllocs.find((d) => d.activity_type_id === a.id);
              return (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="text-sm flex-1">{a.name}</div>
                  <Input type="number" min={0} step={0.5} className="w-28 h-8"
                    value={row?.allocated_hours ?? 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value || "0");
                      setDraftAllocs((prev) => {
                        const others = prev.filter((p) => p.activity_type_id !== a.id);
                        return [...others, { activity_type_id: a.id, allocated_hours: val }];
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-sm text-muted-foreground">
        <p className="mb-3">No project budget set.</p>
        {canManage && <Button size="sm" onClick={openEditor}><Plus className="h-4 w-4 mr-1.5" /> Set project budget</Button>}
      </div>
    );
  }

  const used = formatDuration(usedTotal * 3600);
  const tot = formatDuration(totalAllocated * 3600);
  const left = formatDuration(remaining * 3600);
  const cadenceLabel = contract.cadence === "monthly" ? "Monthly recurring" : "One-time pool";
  const periodLabel = contract.cadence === "monthly"
    ? new Date().toLocaleString(undefined, { month: "long", year: "numeric" })
    : `${contract.period_start ?? "—"} → ${contract.period_end ?? "—"}`;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="text-xs text-muted-foreground">
          {cadenceLabel} · {periodLabel}
          {contract.cadence === "monthly" && contract.rollover_unused && (
            <span className="ml-2 text-emerald-600">· rollover on</span>
          )}
        </div>
        {canManage && <Button variant="outline" size="sm" onClick={openEditor}>Edit</Button>}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {contract.cadence === "monthly" ? "This month" : "Budgeted"}
          </div>
          <div className="text-lg font-semibold tabular-nums">{tot.human}</div>
          {carryover > 0 && <div className="text-xs text-emerald-600">+{formatDuration(carryover * 3600).human} rolled over</div>}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Used</div>
          <div className="text-lg font-semibold tabular-nums">{used.human}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Remaining</div>
          <div className="text-lg font-semibold tabular-nums">{left.human}</div>
        </div>
      </div>
      <HoursBar used={usedTotal} allocated={totalAllocated} />

      {allocs.length > 0 && (
        <div className="space-y-2 pt-2">
          {allocs.map((a) => {
            const act = activities.find((x) => x.id === a.activity_type_id);
            const u = usedByActivity[a.activity_type_id] ?? 0;
            return (
              <div key={a.activity_type_id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{act?.name ?? "—"}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatDuration(u * 3600).human} / {formatDuration(a.allocated_hours * 3600).human}
                  </span>
                </div>
                <HoursBar used={u} allocated={a.allocated_hours} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
