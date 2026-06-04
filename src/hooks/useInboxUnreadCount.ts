import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useInboxUnreadCount(userId?: string | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) { setCount(0); return; }
    let cancelled = false;
    const load = async () => {
      const { count: c } = await (supabase as any)
        .from("inbound_emails")
        .select("id", { count: "exact", head: true })
        .eq("status", "not_assigned");
      if (!cancelled) setCount(c ?? 0);
    };
    load();
    const t = setInterval(load, 60000);
    return () => { cancelled = true; clearInterval(t); };
  }, [userId]);

  return count;
}
