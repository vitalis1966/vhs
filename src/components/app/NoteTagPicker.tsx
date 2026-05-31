import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Tag as TagIcon } from "lucide-react";

interface Tag { id: string; name: string; color: string | null; category: string | null; }

interface Props {
  noteId: string;
}

export function NoteTagPicker({ noteId }: Props) {
  const { workspaceId, role } = useWorkspace();
  const canManage = role === "admin" || role === "manager";
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const load = async () => {
    if (!workspaceId) return;
    const [t, tg] = await Promise.all([
      (supabase as any).from("tags").select("id, name, color, category").eq("workspace_id", workspaceId).order("name"),
      (supabase as any).from("taggings").select("tag_id").eq("taggable_type", "note").eq("taggable_id", noteId),
    ]);
    setAllTags(t.data ?? []);
    setTagIds((tg.data ?? []).map((r: any) => r.tag_id));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [noteId, workspaceId]);

  const toggle = async (tagId: string) => {
    if (tagIds.includes(tagId)) {
      setTagIds(tagIds.filter((id) => id !== tagId));
      await (supabase as any).from("taggings").delete()
        .eq("tag_id", tagId).eq("taggable_type", "note").eq("taggable_id", noteId);
    } else {
      setTagIds([...tagIds, tagId]);
      await (supabase as any).from("taggings").insert({
        tag_id: tagId, taggable_type: "note", taggable_id: noteId,
      });
    }
  };

  const remove = async (tagId: string) => toggle(tagId);

  const createTag = async () => {
    if (!workspaceId || !newTagName.trim() || !canManage) return;
    const { data, error } = await (supabase as any).from("tags")
      .insert({ workspace_id: workspaceId, name: newTagName.trim(), category: "note", color: "#94a3b8" })
      .select().single();
    if (error || !data) return;
    setNewTagName("");
    setAllTags([...allTags, data]);
    await toggle(data.id);
  };

  const tagMap = Object.fromEntries(allTags.map((t) => [t.id, t]));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tagIds.map((id) => {
        const t = tagMap[id]; if (!t) return null;
        return (
          <Badge key={id} variant="outline"
            className="border-transparent text-xs gap-1"
            style={{ background: `${t.color ?? "#94a3b8"}20`, color: t.color ?? "#475569" }}>
            <TagIcon className="h-3 w-3" /> {t.name}
            <button onClick={() => remove(id)} className="hover:opacity-70" aria-label="Remove tag">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">
            <Plus className="h-3 w-3 mr-1" /> Add tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <div className="max-h-48 overflow-y-auto space-y-1 mb-2">
            {allTags.length === 0 && (
              <div className="text-xs text-muted-foreground italic px-2 py-1">No tags yet.</div>
            )}
            {allTags.map((t) => {
              const checked = tagIds.includes(t.id);
              return (
                <button key={t.id} type="button" onClick={() => toggle(t.id)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted flex items-center gap-2 ${checked ? "bg-muted/50" : ""}`}>
                  <span className="w-2 h-2 rounded-full" style={{ background: t.color ?? "#94a3b8" }} />
                  <span className="flex-1 truncate">{t.name}</span>
                  {checked && <span className="text-xs text-muted-foreground">✓</span>}
                </button>
              );
            })}
          </div>
          {canManage && (
            <div className="flex gap-1 border-t border-border pt-2">
              <Input value={newTagName} onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag…" className="h-8 text-sm"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); createTag(); } }} />
              <Button size="sm" className="h-8" onClick={createTag} disabled={!newTagName.trim()}>Add</Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
