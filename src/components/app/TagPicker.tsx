import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Tag as TagIcon, Check } from "lucide-react";
import { toast } from "sonner";

export interface TagRecord {
  id: string;
  name: string;
  color: string | null;
  category: string | null;
}

export const TAG_CATEGORIES = [
  { value: "topic", label: "Topic" },
  { value: "service_line", label: "Service Line" },
  { value: "industry", label: "Industry" },
] as const;

export const TAG_COLORS = [
  "#64748b", "#ef4444", "#f97316", "#f59e0b",
  "#84cc16", "#22c55e", "#14b8a6", "#06b6d4",
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
];

export type TaggableType = "client" | "project" | "task" | "note";

interface Props {
  taggableType: TaggableType;
  /** When provided, picker reads/writes taggings directly. Omit for pending mode. */
  taggableId?: string;
  /** Controlled selection (used in pending mode). */
  value?: string[];
  onValueChange?: (ids: string[]) => void;
  categoryFilter?: string;
  triggerLabel?: string;
  showSelected?: boolean;
  onChange?: (tags: TagRecord[]) => void;
  compact?: boolean;
}

/**
 * Persist a pending selection of tag ids against a newly created record.
 * Use after insert when picker was used in pending mode.
 */
export async function persistPendingTags(
  taggableType: TaggableType,
  taggableId: string,
  tagIds: string[],
) {
  if (!tagIds.length) return;
  await (supabase as any).from("taggings").insert(
    tagIds.map((tag_id) => ({ tag_id, taggable_type: taggableType, taggable_id: taggableId }))
  );
}

export function TagPicker({
  taggableType, taggableId, value, onValueChange, categoryFilter,
  triggerLabel = "Add tag", showSelected = true, onChange, compact,
}: Props) {
  const { workspaceId, role } = useWorkspace();
  const canManage = role === "admin" || role === "manager";
  const pending = !taggableId;

  const [allTags, setAllTags] = useState<TagRecord[]>([]);
  const [internalIds, setInternalIds] = useState<string[]>([]);
  const selectedIds = pending ? (value ?? []) : internalIds;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<string>(categoryFilter ?? "topic");
  const [newColor, setNewColor] = useState<string>(TAG_COLORS[0]);

  const load = useCallback(async () => {
    if (!workspaceId) return;
    let tagsQ = (supabase as any).from("tags")
      .select("id, name, color, category").eq("workspace_id", workspaceId).order("name");
    if (categoryFilter) tagsQ = tagsQ.eq("category", categoryFilter);
    const tRes = await tagsQ;
    setAllTags(tRes.data ?? []);

    if (!pending && taggableId) {
      const { data: tg } = await (supabase as any).from("taggings")
        .select("tag_id, tags(id, name, color, category)")
        .eq("taggable_type", taggableType).eq("taggable_id", taggableId);
      const rows = (tg ?? []).map((r: any) => r.tags).filter(Boolean);
      const filtered = categoryFilter ? rows.filter((r: any) => r.category === categoryFilter) : rows;
      setInternalIds(filtered.map((r: any) => r.id));
      onChange?.(filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, taggableId, taggableType, categoryFilter, pending]);

  useEffect(() => { void load(); }, [load]);

  const tagMap = useMemo(() => Object.fromEntries(allTags.map((t) => [t.id, t])), [allTags]);

  const setIds = (next: string[]) => {
    if (pending) {
      onValueChange?.(next);
    } else {
      setInternalIds(next);
    }
    onChange?.(next.map((id) => tagMap[id]).filter(Boolean) as TagRecord[]);
  };

  const toggle = async (tagId: string) => {
    const isSelected = selectedIds.includes(tagId);
    const next = isSelected ? selectedIds.filter((id) => id !== tagId) : [...selectedIds, tagId];
    setIds(next);
    if (pending || !taggableId) return;
    if (isSelected) {
      await (supabase as any).from("taggings").delete()
        .eq("tag_id", tagId).eq("taggable_type", taggableType).eq("taggable_id", taggableId);
    } else {
      const { error } = await (supabase as any).from("taggings")
        .insert({ tag_id: tagId, taggable_type: taggableType, taggable_id: taggableId });
      if (error) { toast.error(error.message); setIds(selectedIds); }
    }
  };

  const createTag = async () => {
    if (!workspaceId || !newName.trim() || !canManage) return;
    const { data, error } = await (supabase as any).from("tags").insert({
      workspace_id: workspaceId, name: newName.trim(),
      category: newCategory, color: newColor,
    }).select().single();
    if (error || !data) { toast.error(error?.message ?? "Failed to create tag"); return; }
    setAllTags([...allTags, data].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName(""); setShowCreate(false);
    await toggle(data.id);
  };

  const filteredTags = allTags.filter((t) =>
    !search.trim() || t.name.toLowerCase().includes(search.toLowerCase())
  );
  const selectedTags = selectedIds.map((id) => tagMap[id]).filter(Boolean) as TagRecord[];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {showSelected && selectedTags.map((t) => (
        <Badge key={t.id} variant="outline"
          className="border-transparent text-xs gap-1"
          style={{ background: `${t.color ?? "#94a3b8"}22`, color: t.color ?? "#475569" }}>
          <TagIcon className="h-3 w-3" /> {t.name}
          <button onClick={() => toggle(t.id)} className="hover:opacity-70" aria-label="Remove tag" type="button">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setShowCreate(false); setSearch(""); } }}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="sm"
            className={compact ? "h-6 px-2 text-xs text-muted-foreground" : "h-7 px-2 text-xs text-muted-foreground"}>
            <Plus className="h-3 w-3 mr-1" /> {triggerLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-2" align="start">
          {!showCreate ? (
            <>
              <Input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tags…" className="h-8 mb-2" autoFocus />
              <div className="max-h-56 overflow-y-auto space-y-1">
                {filteredTags.length === 0 && (
                  <div className="text-xs text-muted-foreground italic px-2 py-2">No tags found.</div>
                )}
                {filteredTags.map((t) => {
                  const checked = selectedIds.includes(t.id);
                  return (
                    <button key={t.id} type="button" onClick={() => toggle(t.id)}
                      className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: t.color ?? "#94a3b8" }} />
                      <span className="flex-1 truncate">{t.name}</span>
                      {!categoryFilter && t.category && (
                        <span className="text-[10px] uppercase text-muted-foreground tracking-wider">
                          {t.category.replace("_", " ")}
                        </span>
                      )}
                      {checked && <Check className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  );
                })}
              </div>
              {canManage && (
                <div className="border-t border-border pt-2 mt-2">
                  <Button type="button" variant="ghost" size="sm" className="w-full justify-start h-8 text-xs"
                    onClick={() => { setShowCreate(true); setNewName(search); }}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Add tag{search ? ` "${search}"` : ""}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="Tag name" className="h-8 mt-0.5" autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); createTag(); } }} />
              </div>
              {!categoryFilter && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Category</label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="h-8 mt-0.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TAG_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Color</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {TAG_COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setNewColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition ${newColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ background: c }} aria-label={`Color ${c}`} />
                  ))}
                </div>
              </div>
              <div className="flex gap-1 pt-1">
                <Button type="button" variant="ghost" size="sm" className="h-8 flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="button" size="sm" className="h-8 flex-1" onClick={createTag} disabled={!newName.trim()}>Create</Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
