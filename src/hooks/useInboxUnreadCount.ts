import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface InboxBadge {
  newCount: number;
  totalCount: number;
}

const KEY = (uid: string) => `vitalis.inbox.lastVisited.${uid}`;

export function markInboxVisited(userId?: string | null) {
  if (!userId) return;
  try { localStorage.setItem(KEY(userId), new Date().toISOString()); } catch { /* ignore */ }
}

export function useInboxUnreadCount(userId?: string | null): InboxBadge {
  const [badge, setBadge] = useState<InboxBadge>({ newCount: 0, totalCount: 0 });

  useEffect(() => {
    if (!userId) { setBadge({ newCount: 0, totalCount: 0 }); return; }
    let cancelled = false;

    const load = async () => {
      const lastVisited = (() => {
        try { return localStorage.getItem(KEY(userId)); } catch { return null; }
      })();

      const totalReq = (supabase as any)
        .from("inbound_emails")
        .select("id", { count: "exact", head: true });

      const newReq = lastVisited
        ? (supabase as any)
            .from("inbound_emails")
            .select("id", { count: "exact", head: true })
            .gt("received_at", lastVisited)
        : (supabase as any)
            .from("inbound_emails")
            .select("id", { count: "exact", head: true })
            .eq("status", "not_assigned");

      const [tRes, nRes] = await Promise.all([totalReq, newReq]);
      if (cancelled) return;
      setBadge({
        newCount: nRes.count ?? 0,
        totalCount: tRes.count ?? 0,
      });
    };

    load();
    const t = setInterval(load, 60000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => { cancelled = true; clearInterval(t); window.removeEventListener("focus", onFocus); };
  }, [userId]);

  return badge;
}
