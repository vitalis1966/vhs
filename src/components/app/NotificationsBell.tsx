import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Mail, Settings, CalendarClock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useWorkspace } from "@/contexts/WorkspaceContext";

interface Notification {
  id: string;
  title: string | null;
  body: string | null;
  link_url: string | null;
  is_read: boolean;
  created_at: string;
  actor_id: string | null;
  email_status: string | null;
}

interface ActorProfile { id: string; full_name: string | null; avatar_url: string | null; email: string | null; }

interface FollowUpItem {
  id: string;
  task_id: string;
  follow_up_date: string | null;
  follow_up_due_date: string | null;
  task: { title: string; client_id: string } | null;
  client_name: string | null;
}

export function NotificationsBell() {
  const { userId, workspaceId } = useWorkspace();
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>([]);
  const [actors, setActors] = useState<Record<string, ActorProfile>>({});
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const load = async () => {
      const { data } = await (supabase as any)
        .from("notifications")
        .select("id, title, body, link_url, is_read, created_at, actor_id, email_status")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30);
      if (cancelled) return;
      const rows = (data ?? []) as Notification[];
      setItems(rows);
      const actorIds = Array.from(new Set(rows.map((r) => r.actor_id).filter(Boolean) as string[]));
      if (actorIds.length) {
        const { data: profiles } = await (supabase as any)
          .from("profiles").select("id, full_name, avatar_url, email").in("id", actorIds);
        if (!cancelled && profiles) {
          const map: Record<string, ActorProfile> = {};
          for (const p of profiles) map[p.id] = p;
          setActors(map);
        }
      }
    };
    void load();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => void load(),
      )
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [userId]);

  useEffect(() => {
    if (!userId || !workspaceId) return;
    let cancelled = false;
    (async () => {
      const horizon = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      // assignee tasks
      const { data: ta } = await (supabase as any)
        .from("task_assignees").select("task_id").eq("user_id", userId);
      const assignedTaskIds: string[] = (ta ?? []).map((r: any) => r.task_id);
      // follow-ups where user is resource OR task assignee
      const { data: rows } = await (supabase as any)
        .from("task_follow_ups")
        .select("id, task_id, follow_up_date, follow_up_due_date, follow_up_status, resource_id, enabled")
        .neq("follow_up_status", "completed")
        .eq("enabled", true)
        .lte("follow_up_date", horizon)
        .order("follow_up_date", { ascending: true });
      const candidate = ((rows ?? []) as any[]).filter((r) =>
        r.resource_id === userId || assignedTaskIds.includes(r.task_id),
      );
      if (!candidate.length) { if (!cancelled) setFollowUps([]); return; }
      const taskIds = candidate.map((r) => r.task_id);
      const { data: tasks } = await (supabase as any)
        .from("tasks").select("id, title, client_id").in("id", taskIds);
      const tmap: Record<string, any> = {};
      (tasks ?? []).forEach((t: any) => tmap[t.id] = t);
      const clientIds = Array.from(new Set((tasks ?? []).map((t: any) => t.client_id).filter(Boolean)));
      const cmap: Record<string, string> = {};
      if (clientIds.length) {
        const { data: cs } = await (supabase as any).from("clients").select("id, name").in("id", clientIds);
        (cs ?? []).forEach((c: any) => cmap[c.id] = c.name);
      }
      if (cancelled) return;
      setFollowUps(candidate.map((r) => ({
        id: r.id,
        task_id: r.task_id,
        follow_up_date: r.follow_up_date,
        follow_up_due_date: r.follow_up_due_date,
        task: tmap[r.task_id] ? { title: tmap[r.task_id].title, client_id: tmap[r.task_id].client_id } : null,
        client_name: tmap[r.task_id] ? cmap[tmap[r.task_id].client_id] ?? null : null,
      })));
    })();
    return () => { cancelled = true; };
  }, [userId, workspaceId, open]);

  const unread = items.filter((i) => !i.is_read).length;

  const markAllRead = async () => {
    if (!userId) return;
    await (supabase as any).from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
  };

  const onClickNotif = async (n: Notification) => {
    if (!n.is_read) {
      await (supabase as any).from("notifications").update({ is_read: true }).eq("id", n.id);
    }
    setOpen(false);
    if (n.link_url) {
      if (n.link_url.startsWith("http")) window.location.href = n.link_url;
      else navigate(n.link_url);
    }
  };

  const initials = (name?: string | null, email?: string | null) => {
    const src = name || email || "?";
    return src.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <Tabs defaultValue="notifications">
          <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b">
            <TabsList className="h-8">
              <TabsTrigger value="notifications" className="text-xs h-7">Notifications</TabsTrigger>
              <TabsTrigger value="followups" className="text-xs h-7">Follow Ups</TabsTrigger>
            </TabsList>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-accent hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          <TabsContent value="notifications" className="m-0">
            <div className="max-h-[28rem] overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">No notifications yet</p>
              ) : (
                items.map((n) => {
                  const actor = n.actor_id ? actors[n.actor_id] : null;
                  return (
                    <button
                      key={n.id}
                      onClick={() => onClickNotif(n)}
                      className={`w-full text-left flex gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-muted/40 transition-colors ${
                        !n.is_read ? "bg-accent/5" : ""
                      }`}
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        {actor?.avatar_url && <AvatarImage src={actor.avatar_url} />}
                        <AvatarFallback className="text-xs">{initials(actor?.full_name, actor?.email)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            {n.title && <div className="text-sm font-medium truncate">{n.title}</div>}
                            {n.body && <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</div>}
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                              {n.email_status === "sent"
                                ? <Mail className="h-3 w-3" aria-label="Sent by email" />
                                : <Bell className="h-3 w-3" aria-label="In-app only" />}
                              <span>{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                            </div>
                          </div>
                          {!n.is_read && <span className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5" />}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="followups" className="m-0">
            <div className="max-h-[28rem] overflow-y-auto">
              {followUps.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">No upcoming follow ups</p>
              ) : (
                followUps.map((f) => (
                  <div key={f.id} className="px-4 py-3 border-b last:border-b-0 hover:bg-muted/40">
                    <div className="flex items-start gap-2">
                      <CalendarClock className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{f.task?.title ?? "Task"}</div>
                        {f.client_name && (
                          <div className="text-xs text-muted-foreground truncate">{f.client_name}</div>
                        )}
                        <div className="text-[11px] text-muted-foreground mt-1 space-y-0.5">
                          {f.follow_up_date && <div>Follow up: {format(new Date(f.follow_up_date), "PP p")}</div>}
                          {f.follow_up_due_date && <div>Due: {format(new Date(f.follow_up_due_date), "PP p")}</div>}
                        </div>
                        <button
                          onClick={() => { setOpen(false); navigate(`/app/tasks?task=${f.task_id}`); }}
                          className="text-xs text-accent hover:underline mt-1.5"
                        >
                          View Task →
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        <div className="border-t px-3 py-2">
          <button
            onClick={() => { setOpen(false); navigate("/app/settings/notifications"); }}
            className="w-full inline-flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1.5 rounded"
          >
            <Settings className="h-3.5 w-3.5" /> Notification settings
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
