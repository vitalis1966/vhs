import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addDays, diffDays, toDate, toISO, today, ZOOM_PX_PER_DAY } from "@/lib/gantt/dates";
import type { ZoomLevel } from "@/lib/gantt/types";
import { VITALIS } from "@/lib/gantt/types";
import { Diamond } from "lucide-react";

interface PublicItem {
  id: string; type: string; title: string; parent_id: string | null; position: number;
  start_date: string | null; end_date: string | null; progress: number; is_complete: boolean;
}

interface Props { projectId: string; }

export function ClientGanttView({ projectId }: Props) {
  const [items, setItems] = useState<PublicItem[]>([]);
  const [zoom, setZoom] = useState<ZoomLevel>("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await (supabase as any).rpc("get_client_gantt_for_project", { p_project_id: projectId });
      if (error) toast.error(error.message);
      setItems((data ?? []) as PublicItem[]);
      setLoading(false);
    })();
  }, [projectId]);

  const range = useMemo(() => {
    const all = items.flatMap((i) => [toDate(i.start_date), toDate(i.end_date)]).filter((d): d is Date => !!d);
    if (!all.length) return { start: addDays(today(), -14), end: addDays(today(), 60), days: 75 };
    let min = all[0], max = all[0];
    for (const d of all) { if (d < min) min = d; if (d > max) max = d; }
    const start = addDays(min, -7); const end = addDays(max, 14);
    return { start, end, days: diffDays(start, end) + 1 };
  }, [items]);

  const px = ZOOM_PX_PER_DAY[zoom];
  const totalW = range.days * px;
  const td = today();
  const overall = useMemo(() => {
    const leaves = items.filter((i) => i.type !== "section");
    if (!leaves.length) return 0;
    const sum = leaves.reduce((a, b) => a + (b.progress ?? 0), 0);
    return Math.round(sum / leaves.length);
  }, [items]);

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading project plan…</div>;
  if (!items.length) return <div className="p-8 text-sm text-muted-foreground">No project plan available yet.</div>;

  return (
    <div className="rounded-lg border bg-card overflow-hidden" style={{ background: VITALIS.cream }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ background: VITALIS.green, color: "white" }}>
        <div>
          <div className="text-xs uppercase tracking-widest opacity-80">Project plan</div>
          <div className="text-base font-semibold">Overall progress: {overall}%</div>
        </div>
        <div className="flex gap-1 rounded-md bg-white/10 p-1">
          {(["week","month","quarter"] as ZoomLevel[]).map((z) => (
            <button key={z} onClick={() => setZoom(z)} className={`px-2.5 py-1 text-xs capitalize rounded ${zoom === z ? "bg-white text-foreground" : "text-white/80"}`}>{z}</button>
          ))}
        </div>
      </div>
      <div className="overflow-auto" style={{ maxHeight: 600 }}>
        <div style={{ width: Math.max(800, totalW + 200) }}>
          {/* Timeline header */}
          <div className="sticky top-0 z-10" style={{ background: VITALIS.green, color: "white", height: 32, width: Math.max(800, totalW + 200) }}>
            <div className="relative h-full">
              {Array.from({ length: Math.ceil(range.days / (zoom === "week" ? 7 : zoom === "month" ? 30 : 90)) }).map((_, idx) => {
                const step = zoom === "week" ? 7 : zoom === "month" ? 30 : 90;
                const d = addDays(range.start, idx * step);
                const x = idx * step * px;
                return (
                  <div key={idx} className="absolute top-0 h-full border-l border-white/10 text-[10px] px-1 pt-1.5" style={{ left: x }}>
                    {zoom === "week" ? `${d.getMonth() + 1}/${d.getDate()}`
                      : zoom === "month" ? d.toLocaleDateString(undefined, { month: "short" })
                      : `Q${Math.floor(d.getMonth() / 3) + 1}'${String(d.getFullYear()).slice(2)}`}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Today line */}
          {td >= range.start && td <= range.end && (
            <div className="absolute" style={{ left: diffDays(range.start, td) * px + 0.5, top: 32, width: 2, height: 32 + items.length * 32, background: "#ea580c", zIndex: 5 }} />
          )}
          {/* Rows */}
          <div className="relative">
            {items.map((i) => {
              const s = toDate(i.start_date), e = toDate(i.end_date) ?? s;
              const left = s ? diffDays(range.start, s) * px : 0;
              const w = s && e ? Math.max(4, (diffDays(s, e) + 1) * px) : 0;
              const isSection = i.type === "section";
              const isMs = i.type === "milestone";
              return (
                <div key={i.id} className="flex items-center border-b" style={{ height: 32, background: isSection ? VITALIS.sageLight : undefined }}>
                  <div className="px-3 text-xs truncate flex items-center gap-2" style={{ width: 200, color: VITALIS.green, fontWeight: isSection ? 700 : 500 }}>
                    {isMs && <Diamond className="h-3 w-3" style={{ color: VITALIS.gold }} />}
                    <span className={i.is_complete || i.progress >= 100 ? "line-through opacity-70" : ""}>{i.title}</span>
                  </div>
                  <div className="relative flex-1" style={{ height: 32 }}>
                    {s && e && (
                      isMs ? (
                        <div className="absolute" style={{ left, top: 10, width: 12, height: 12, background: VITALIS.gold, transform: "rotate(45deg)" }} />
                      ) : (
                        <div className="absolute rounded" style={{ left, top: 8, width: w, height: 16, background: isSection ? VITALIS.sage : VITALIS.sage, opacity: isSection ? 0.5 : 1 }}>
                          {i.progress > 0 && !isSection && (
                            <div className="rounded-l" style={{ width: `${Math.min(100, i.progress)}%`, height: "100%", background: VITALIS.green }} />
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
