import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Briefcase, FolderKanban, CheckSquare, StickyNote, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";

type Result = {
  kind: "client" | "project" | "task" | "note";
  id: string;
  title: string;
  subtitle: string | null;
  client_id: string | null;
  project_id: string | null;
  rank: number;
};

const ICONS = {
  client: Briefcase,
  project: FolderKanban,
  task: CheckSquare,
  note: StickyNote,
} as const;

const LABELS = { client: "Clients", project: "Projects", task: "Tasks", note: "Notes" } as const;

export function CommandPalette() {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const reqRef = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) { setQuery(""); setResults([]); return; }
  }, [open]);

  useEffect(() => {
    if (!workspaceId) return;
    const q = query.trim();
    if (q.length < 2) { setResults([]); setLoading(false); return; }
    const seq = ++reqRef.current;
    setLoading(true);
    const t = setTimeout(async () => {
      const { data, error } = await (supabase as any).rpc("global_search", {
        p_workspace_id: workspaceId,
        p_query: q,
      });
      if (seq !== reqRef.current) return;
      if (error) console.error("global_search error", error);
      setResults((data ?? []) as Result[]);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query, workspaceId]);

  const grouped = useMemo(() => {
    const out: Record<Result["kind"], Result[]> = { client: [], project: [], task: [], note: [] };
    for (const r of results) out[r.kind].push(r);
    return out;
  }, [results]);

  const go = (r: Result) => {
    setOpen(false);
    switch (r.kind) {
      case "client":
        navigate(`/app/clients/${r.id}`); break;
      case "project":
        navigate(`/app/clients/${r.client_id}/projects/${r.id}`); break;
      case "task":
        navigate(`/app/tasks?task=${r.id}`); break;
      case "note":
        navigate(`/app/clients/${r.client_id}?tab=notes&note=${r.id}`); break;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search clients, projects, tasks, notes…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Searching…
          </div>
        )}
        {!loading && query.trim().length >= 2 && results.length === 0 && (
          <CommandEmpty>No results for "{query}".</CommandEmpty>
        )}
        {!loading && query.trim().length < 2 && (
          <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
        )}
        {(["client", "project", "task", "note"] as const).map((kind) => {
          const rows = grouped[kind];
          if (!rows.length) return null;
          const Icon = ICONS[kind];
          return (
            <CommandGroup key={kind} heading={LABELS[kind]}>
              {rows.map((r) => (
                <CommandItem
                  key={`${kind}-${r.id}`}
                  value={`${kind}-${r.id}-${r.title}`}
                  onSelect={() => go(r)}
                  className="flex items-center gap-3"
                >
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{r.title}</div>
                    {r.subtitle && (
                      <div className="truncate text-xs text-muted-foreground">{r.subtitle}</div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
