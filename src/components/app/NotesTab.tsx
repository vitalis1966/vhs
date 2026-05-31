import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { NoteEditor } from "./NoteEditor";

interface Props { clientId: string; }

interface NoteRow {
  id: string; workspace_id: string; client_id: string; project_id: string | null;
  title: string | null; body: any; body_text: string | null;
  updated_at: string;
  projects?: { id: string; name: string } | null;
}

export function NotesTab({ clientId }: Props) {
  const { workspaceId, userId } = useWorkspace();
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const load = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("notes")
      .select("id, workspace_id, client_id, project_id, title, body, body_text, updated_at, projects(id, name)")
      .eq("client_id", clientId)
      .order("updated_at", { ascending: false });
    setNotes(data ?? []);
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  // Open note via ?note= query param
  useEffect(() => {
    const id = searchParams.get("note");
    if (id) setActiveId(id);
  }, [searchParams]);

  const closeEditor = () => {
    setActiveId(null);
    if (searchParams.get("note")) {
      searchParams.delete("note");
      setSearchParams(searchParams, { replace: true });
    }
    load();
  };

  const createNote = async (projectId?: string | null) => {
    if (!workspaceId || !userId) return;
    const { data, error } = await (supabase as any).from("notes").insert({
      workspace_id: workspaceId, client_id: clientId, project_id: projectId ?? null,
      title: "", body: { type: "doc", content: [{ type: "paragraph" }] }, body_text: "",
      created_by: userId, updated_by: userId,
    }).select().single();
    if (error || !data) { toast.error(error?.message ?? "Failed to create note"); return; }
    await load();
    setActiveId(data.id);
  };

  const activeNote = notes.find((n) => n.id === activeId);

  if (activeId && activeNote) {
    return (
      <div className="min-h-[600px]">
        <NoteEditor note={activeNote} onBack={closeEditor} onSaved={() => load()} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{notes.length} {notes.length === 1 ? "note" : "notes"}</p>
        <Button size="sm" onClick={() => createNote(null)}><Plus className="h-4 w-4 mr-1" /> New Note</Button>
      </div>
      {notes.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No notes yet. Create one to start documenting.</p>
        </div>
      ) : (
        <ul className="divide-y border border-border rounded-lg bg-card">
          {notes.map((n) => {
            const preview = (n.body_text ?? "").split("\n").find((l) => l.trim()) ?? "";
            return (
              <li key={n.id}>
                <button
                  onClick={() => setActiveId(n.id)}
                  className="w-full text-left px-4 py-3 hover:bg-muted/40 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-sm text-foreground">{n.title?.trim() || "Untitled"}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(n.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">{preview || "Empty note"}</div>
                  {n.projects?.name && (
                    <div className="text-[10px] uppercase tracking-wider text-accent mt-1">
                      Project · {n.projects.name}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
