import { useCallback, useEffect, useState } from "react";

const EVENT = "pinned-clients-changed";

function storageKey(userId: string | null, workspaceId: string | null) {
  if (!userId || !workspaceId) return null;
  return `pinned-clients:${userId}_${workspaceId}`;
}

function read(key: string | null): string[] {
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function usePinnedClients(userId: string | null, workspaceId: string | null) {
  const key = storageKey(userId, workspaceId);
  const [pinned, setPinned] = useState<string[]>(() => read(key));

  useEffect(() => {
    setPinned(read(key));
    const handler = () => setPinned(read(key));
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [key]);

  const toggle = useCallback(
    (clientId: string) => {
      if (!key) return;
      const current = read(key);
      const next = current.includes(clientId)
        ? current.filter((id) => id !== clientId)
        : [...current, clientId];
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event(EVENT));
    },
    [key]
  );

  const isPinned = useCallback((id: string) => pinned.includes(id), [pinned]);

  return { pinned, isPinned, toggle };
}
