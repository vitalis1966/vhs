import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "./WorkspaceContext";
import { toast } from "sonner";
import { formatDuration, roundSeconds } from "@/lib/timeFormat";

export interface RunningTimer {
  workspace_id: string;
  client_id: string;
  client_name?: string | null;
  project_id: string | null;
  task_id: string | null;
  activity_type_id: string;
  activity_name?: string | null;
  description: string | null;
  started_at: string; // ISO
}

export interface StartTimerInput {
  client_id: string;
  project_id?: string | null;
  task_id?: string | null;
  activity_type_id: string;
  description?: string | null;
}

interface TimerState {
  running: RunningTimer | null;
  elapsedSeconds: number;
  loading: boolean;
  startTimer: (input: StartTimerInput) => Promise<boolean>;
  stopTimer: () => Promise<void>;
  updateRunning: (patch: Partial<RunningTimer>) => Promise<void>;
  discardTimer: () => Promise<void>;
}

const TimerContext = createContext<TimerState | undefined>(undefined);
const LS_KEY = "vitalis_timer_running_v1";

export function TimerProvider({ children }: { children: ReactNode }) {
  const { userId, workspaceId } = useWorkspace();
  const [running, setRunning] = useState<RunningTimer | null>(null);
  const [elapsedSeconds, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const tickRef = useRef<number | null>(null);

  const computeElapsed = (startedAt: string) => {
    const ms = Date.now() - new Date(startedAt).getTime();
    return Math.max(0, Math.floor(ms / 1000));
  };

  const decorate = useCallback(async (row: any): Promise<RunningTimer> => {
    let client_name: string | null = null;
    let activity_name: string | null = null;
    const [{ data: c }, { data: a }] = await Promise.all([
      (supabase as any).from("clients").select("name").eq("id", row.client_id).maybeSingle(),
      (supabase as any).from("time_activity_types").select("name").eq("id", row.activity_type_id).maybeSingle(),
    ]);
    client_name = c?.name ?? null;
    activity_name = a?.name ?? null;
    return { ...row, client_name, activity_name };
  }, []);

  // Initial load from Supabase (and fallback to localStorage)
  useEffect(() => {
    if (!userId || !workspaceId) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from("time_entries_running")
        .select("*").eq("user_id", userId).maybeSingle();
      if (cancelled) return;
      if (data) {
        const decorated = await decorate(data);
        setRunning(decorated);
        try { localStorage.setItem(LS_KEY, JSON.stringify(decorated)); } catch {}
      } else {
        try { localStorage.removeItem(LS_KEY); } catch {}
        setRunning(null);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [userId, workspaceId, decorate]);

  // Tick
  useEffect(() => {
    if (!running) { setElapsed(0); return; }
    setElapsed(computeElapsed(running.started_at));
    tickRef.current = window.setInterval(() => {
      setElapsed(computeElapsed(running.started_at));
    }, 1000);
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  }, [running]);

  const startTimer = useCallback(async (input: StartTimerInput) => {
    if (!userId || !workspaceId) return false;
    if (running) {
      toast.error("A timer is already running. Stop it first.");
      return false;
    }
    const row = {
      user_id: userId,
      workspace_id: workspaceId,
      client_id: input.client_id,
      project_id: input.project_id ?? null,
      task_id: input.task_id ?? null,
      activity_type_id: input.activity_type_id,
      description: input.description ?? null,
      started_at: new Date().toISOString(),
    };
    const { data, error } = await (supabase as any)
      .from("time_entries_running")
      .upsert(row, { onConflict: "user_id" })
      .select().single();
    if (error) { toast.error(error.message); return false; }
    const decorated = await decorate(data);
    setRunning(decorated);
    try { localStorage.setItem(LS_KEY, JSON.stringify(decorated)); } catch {}
    return true;
  }, [userId, workspaceId, running, decorate]);

  const stopTimer = useCallback(async () => {
    if (!running || !userId) return;
    // Load user settings to apply rounding
    let rounding = 0;
    const { data: setting } = await (supabase as any)
      .from("time_tracking_settings").select("rounding_minutes").eq("user_id", userId).maybeSingle();
    rounding = setting?.rounding_minutes ?? 0;

    const startedAt = new Date(running.started_at);
    const endedAt = new Date();
    let durationSec = Math.max(1, Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000));
    durationSec = roundSeconds(durationSec, rounding) || durationSec;
    const adjustedEnd = new Date(startedAt.getTime() + durationSec * 1000);

    const { error } = await (supabase as any).from("time_entries").insert({
      user_id: userId,
      workspace_id: running.workspace_id,
      client_id: running.client_id,
      project_id: running.project_id,
      task_id: running.task_id,
      activity_type_id: running.activity_type_id,
      description: running.description,
      started_at: running.started_at,
      ended_at: adjustedEnd.toISOString(),
      is_manual: false,
      source: "timer",
    });
    if (error) { toast.error(error.message); return; }

    await (supabase as any).from("time_entries_running").delete().eq("user_id", userId);
    try { localStorage.removeItem(LS_KEY); } catch {}

    const d = formatDuration(durationSec);
    toast.success(`${d.human} logged to ${running.client_name ?? "client"}`);

    // Fire budget alert check (non-blocking)
    try {
      supabase.functions.invoke("notify-budget-threshold", {
        body: { client_id: running.client_id, activity_type_id: running.activity_type_id }
      });
    } catch {}

    setRunning(null);
  }, [running, userId]);

  const updateRunning = useCallback(async (patch: Partial<RunningTimer>) => {
    if (!running || !userId) return;
    const next = { ...running, ...patch };
    const { error } = await (supabase as any).from("time_entries_running").update({
      client_id: next.client_id,
      project_id: next.project_id,
      task_id: next.task_id,
      activity_type_id: next.activity_type_id,
      description: next.description,
    }).eq("user_id", userId);
    if (error) { toast.error(error.message); return; }
    const decorated = await decorate(next);
    setRunning(decorated);
    try { localStorage.setItem(LS_KEY, JSON.stringify(decorated)); } catch {}
  }, [running, userId, decorate]);

  const discardTimer = useCallback(async () => {
    if (!userId) return;
    await (supabase as any).from("time_entries_running").delete().eq("user_id", userId);
    try { localStorage.removeItem(LS_KEY); } catch {}
    setRunning(null);
  }, [userId]);

  return (
    <TimerContext.Provider value={{ running, elapsedSeconds, loading, startTimer, stopTimer, updateRunning, discardTimer }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
}
