import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWorkspace } from "@/contexts/WorkspaceContext";

interface Notification {
  id: string;
  title: string | null;
  body: string | null;
  link_url: string | null;
  is_read: boolean;
  created_at: string;
}

export function NotificationsBell() {
  const { userId } = useWorkspace();
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const load = async () => {
      const { data } = await (supabase as any)
        .from("notifications")
        .select("id, title, body, link_url, is_read, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (!cancelled) setItems((data ?? []) as Notification[]);
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

  const unread = items.filter((i) => !i.is_read).length;

  const markAllRead = async () => {
    if (!userId) return;
    await (supabase as any).from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
  };

  return (
    <Popover>
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
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-display text-sm font-semibold">Notifications</span>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-accent hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications yet</p>
          ) : (
            items.map((n) => (
              <a
                key={n.id}
                href={n.link_url ?? "#"}
                className={`block px-4 py-3 border-b last:border-b-0 hover:bg-muted/40 ${!n.is_read ? "bg-accent/5" : ""}`}
              >
                {n.title && <div className="text-sm font-medium">{n.title}</div>}
                {n.body && <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>}
              </a>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
