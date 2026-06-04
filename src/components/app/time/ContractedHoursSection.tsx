import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDuration } from "@/lib/timeFormat";

interface Props { clientId: string; workspaceId: string }
interface ActivityType { id: string; name: string }
interface Contract {
  id: string;
  total_hours: number;
  period_start: string | null;
  period_end: string | null;
}
interface Alloc { id?: string; activity_type_id: string; allocated_hours: number }

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
      <div className="text-xs tabular-nums text-muted-foreground min-w-[80px] text-right">{pct.toFixed(0)}%</div>
    </div>
  );
}

export function ContractedHoursSection({ clientId, workspaceId }: Props) {
  const { role } = useWorkspace();
  const canManage = role === "admin" || role === "manager";
  const [contract, setContract] = useState<Contract | null>(null);
  const [allocs, setAllocs] = useState<Alloc[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [usedTotalHours, setUsedTotalHours] = useState(0);
  const [usedByActivity, setUsedByActivity] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Contract>({ id: "", total_hours: 0, period_start: null, period_end: null });
  const [draftAllocs, setDraftAllocs] = useState<Alloc[]>([]);

  const load = useCallback(async () => {
    if (!workspaceId || !clientId) return;
    const { data: a } = await (supabase as any).from("time_activity_types")
      .select("id, name").eq("workspace_id", workspaceId).eq("is_active", true).order("position");
    setActivities(a ?? []);

    const { data: ch } = await (supabase as any).from("contracted_hours")
      .select("*").eq("client_id", clientId).maybeSingle();
    setContract(ch ?? null);

    if (ch) {
      const { data: ca } = await (supabase as any).from("contracted_hours_by_activity")
        .select("*").eq("contracted_hours_id", ch.id);
      setAllocs(ca ?? []);
    } else {
      setAllocs([]);
    }

    const { data: summary } = await (supabase as any).rpc("get_client_time_summary", { p_client_id: clientId });
    if (summary) {
      setUsedTotalHours(Number(summary.total_used_hours ?? 0));
      const m: Record<string, number> = {};
      (summary.by_activity ?? []).forEach((r: any) => { m[r.activity_type_id] = Number(r.used_hours ?? 0); });
      setUsedByActivity(m);
    }
  }, [workspaceId, clientId]);

  useEffect(() => { load(); }, [load]);

  const openEditor = () => {
    setDraft(contract ?? { id: "", total_hours: 0, period_start: null, period_end: null });
    setDraftAllocs(allocs.length ? [...allocs] : activities.map((a) => ({ activity_type_id: a.id, allocated_hours: 0 })));
    setEditing(true);
  };

  const save = async () => {
    if (!workspaceId || !clientId) return;
    let chId = contract?.id ?? null;
    if (chId) {
      const { error } = await (supabase as any).from("contracted_hours").update({
        total_hours: draft.total_hours,
        period_start: draft.period_start,
        period_end: draft.period_end,
      }).eq("id", chId);
      if (error) { toast.error(error.message); return; }
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await (supabase as any).from("contracted_hours").insert({
        workspace_id: workspaceId,
        client_id: clientId,
        total_hours: draft.total_hours,
        period_start: draft.period_start,
        period_end: draft.period_end,
        created_by: user?.id ?? null,
      }).select().single();
      if (error) { toast.error(error.message); return; }
      chId = data.id;
    }

    // Replace allocations
    await (supabase as any).from("contracted_hours_by_activity").delete().eq("contracted_hours_id", chId);
    const filled = draftAllocs.filter((d) => d.allocated_hours > 0);
    if (filled.length) {
      const { error } = await (supabase as any).from("contracted_hours_by_activity").insert(
        filled.map((a) => ({
          contracted_hours_id: chId,
          activity_type_id: a.activity_type_id,
          allocated_hours: a.allocated_hours,
        }))
      );
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Contracted hours saved");
    setEditing(false);
    load();
  };

  const totalAllocated = contract?.total_hours ?? 0;
  const remaining = Math.max(0, totalAllocated - usedTotalHours);

  if (editing) {
    return (
      <div className="space-y-4 border border-border rounded-md p-4 bg-card">
        <div className="font-medium">Edit contracted hours</div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Total hours</Label>
            <Input type="number" min={0} step={0.5} value={draft.total_hours}
              onChange={(e) => setDraft({ ...draft, total_hours: parseFloat(e.target.value || "0") })} />
          </div>
          <div>
            <Label className="text-xs">Period start</Label>
            <Input type="date" value={draft.period_start ?? ""} onChange={(e) => setDraft({ ...draft, period_start: e.target.value || null })} />
          </div>
          <div>
            <Label className="text-xs">Period end</Label>
            <Input type="date" value={draft.period_end ?? ""} onChange={(e) => setDraft({ ...draft, period_end: e.target.value || null })} />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-2 block">Allocation by activity (hours)</Label>
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
      <div className="border border-border rounded-md p-8 text-center bg-card">
        <p className="text-sm text-muted-foreground mb-3">No contracted hours set for this client.</p>
        {canManage && <Button onClick={openEditor}><Plus className="h-4 w-4 mr-1.5" /> Set contracted hours</Button>}
      </div>
    );
  }

  const used = formatDuration(usedTotalHours * 3600);
  const total = formatDuration(totalAllocated * 3600);
  const left = formatDuration(remaining * 3600);

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-card p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Engagement budget</div>
            {(contract.period_start || contract.period_end) && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {contract.period_start ?? "—"} → {contract.period_end ?? "—"}
              </div>
            )}
          </div>
          {canManage && <Button variant="outline" size="sm" onClick={openEditor}>Edit</Button>}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Contracted</div>
            <div className="text-lg font-semibold tabular-nums">{total.human}</div>
            <div className="text-xs text-muted-foreground">{total.decimalLabel}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Used</div>
            <div className="text-lg font-semibold tabular-nums">{used.human}</div>
            <div className="text-xs text-muted-foreground">{used.decimalLabel}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Remaining</div>
            <div className="text-lg font-semibold tabular-nums">{left.human}</div>
            <div className="text-xs text-muted-foreground">{left.decimalLabel}</div>
          </div>
        </div>
        <HoursBar used={usedTotalHours} allocated={totalAllocated} />
      </div>

      <div className="rounded-md border border-border bg-card p-4">
        <div className="text-sm font-medium mb-3">By activity type</div>
        {allocs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No per-activity allocations set.</div>
        ) : (
          <div className="space-y-3">
            {allocs.map((a) => {
              const act = activities.find((x) => x.id === a.activity_type_id);
              const usedH = usedByActivity[a.activity_type_id] ?? 0;
              const rem = Math.max(0, a.allocated_hours - usedH);
              const usedF = formatDuration(usedH * 3600);
              const allocF = formatDuration(a.allocated_hours * 3600);
              const remF = formatDuration(rem * 3600);
              return (
                <div key={a.activity_type_id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{act?.name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {usedF.human} / {allocF.human} <span className="ml-2">({remF.human} left)</span>
                    </div>
                  </div>
                  <HoursBar used={usedH} allocated={a.allocated_hours} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
