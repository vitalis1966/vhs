import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, GripVertical, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SocialIconRender, PLATFORM_META } from "./SocialIconRender";

type IconStyle = "original" | "filled" | "outline" | "monochrome";

interface SocialRow {
  id: string;
  platform: string;
  is_active: boolean;
  profile_url: string | null;
  display_label: string | null;
  icon_style: IconStyle;
  open_in_new_tab: boolean;
  sort_order: number;
}

const urlSchema = z
  .string()
  .trim()
  .url({ message: "Must be a valid URL" })
  .startsWith("https://", { message: "Must start with https://" })
  .max(500, { message: "URL too long" });

function validateUrl(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null; // empty is allowed at row level
  const r = urlSchema.safeParse(url);
  return r.success ? null : r.error.issues[0].message;
}

function SortableCard({
  row,
  onChange,
  errors,
}: {
  row: SocialRow;
  onChange: (patch: Partial<SocialRow>) => void;
  errors: Record<string, string>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const meta = PLATFORM_META[row.platform];
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const urlError = errors[row.id];

  return (
    <Card
      ref={setNodeRef}
      style={{ ...style, borderLeftColor: meta?.color ?? "hsl(var(--border))" }}
      className={cn(
        "p-4 border-l-4 transition-opacity",
        !row.is_active && "opacity-60",
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Drag to reorder"
          className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-lg" aria-hidden>{meta?.emoji ?? "🔗"}</span>
        <span className="font-semibold text-sm flex-1">{meta?.label ?? row.platform}</span>
        <Label className="text-xs text-muted-foreground mr-2">Active</Label>
        <Switch
          checked={row.is_active}
          onCheckedChange={(v) => onChange({ is_active: v })}
        />
      </div>

      {row.is_active && (
        <div className="mt-4 space-y-3 pl-7">
          <div>
            <Label className="text-xs">Profile URL</Label>
            <Input
              value={row.profile_url ?? ""}
              onChange={(e) => onChange({ profile_url: e.target.value })}
              placeholder={meta?.placeholder ?? "https://..."}
              className={cn("font-mono text-sm", urlError && "border-destructive")}
            />
            {urlError && <p className="text-xs text-destructive mt-1">{urlError}</p>}
          </div>
          <div>
            <Label className="text-xs">Display Label (optional)</Label>
            <Input
              value={row.display_label ?? ""}
              onChange={(e) => onChange({ display_label: e.target.value })}
              placeholder={`Follow us on ${meta?.label ?? row.platform}`}
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Icon Style</Label>
              <Select
                value={row.icon_style}
                onValueChange={(v) => onChange({ icon_style: v as IconStyle })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original (brand colors)</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end pb-2 gap-2">
              <Checkbox
                id={`newtab-${row.id}`}
                checked={row.open_in_new_tab}
                onCheckedChange={(v) => onChange({ open_in_new_tab: v === true })}
              />
              <Label htmlFor={`newtab-${row.id}`} className="text-xs cursor-pointer">
                Open in new tab
              </Label>
            </div>
          </div>
          {row.platform === "instagram" && (
            <p className="text-[11px] text-muted-foreground italic">
              Note: Instagram's Filled style renders as flat brand pink. For a cleaner look on the dark footer, choose Monochrome.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

export function SocialMediaTab() {
  const queryClient = useQueryClient();

  const { data: serverRows, isLoading } = useQuery({
    queryKey: ["seo-admin-social"],
    queryFn: async (): Promise<SocialRow[]> => {
      const { data, error } = await (supabase as any)
        .from("seo_social_links")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [rows, setRows] = useState<SocialRow[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (serverRows && !initialized) {
      setRows(serverRows);
      setInitialized(true);
    }
  }, [serverRows, initialized]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const errors = useMemo(() => {
    const map: Record<string, string> = {};
    rows.forEach((r) => {
      if (r.is_active) {
        const e = validateUrl(r.profile_url);
        if (e) map[r.id] = e;
      }
    });
    return map;
  }, [rows]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setRows((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const next = arrayMove(items, oldIndex, newIndex);
      return next.map((r, idx) => ({ ...r, sort_order: idx }));
    });
  };

  const updateRow = (id: string, patch: Partial<SocialRow>) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = rows.map((r, idx) =>
        (supabase as any)
          .from("seo_social_links")
          .update({
            is_active: r.is_active,
            profile_url: r.profile_url?.trim() || null,
            display_label: r.display_label?.trim() || null,
            icon_style: r.icon_style,
            open_in_new_tab: r.open_in_new_tab,
            sort_order: idx,
          })
          .eq("id", r.id),
      );
      const results = await Promise.all(updates);
      const failed = results.find((res: any) => res.error);
      if (failed?.error) throw failed.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-social"] });
      queryClient.invalidateQueries({ queryKey: ["seo-social"] });
      toast({ title: "✓ Social media settings saved." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleSave = () => {
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Cannot save",
        description: "Fix the URL errors highlighted on the cards before saving.",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate();
  };

  if (isLoading) return <p className="text-muted-foreground p-4">Loading…</p>;

  const previewRows = rows.filter((r) => r.is_active && r.profile_url && r.profile_url.trim().length > 0);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 text-sm flex gap-2">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          Toggle a platform <strong>Active</strong> to expose its icon in the site footer. Drag the handle to reorder.
          Inactive platforms — and active ones with empty URLs — never render in the footer.
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {rows.map((row) => (
              <SortableCard
                key={row.id}
                row={row}
                errors={errors}
                onChange={(patch) => updateRow(row.id, patch)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Live preview */}
      <div className="rounded-xl overflow-hidden border border-border/40">
        <div className="bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Footer Preview
        </div>
        <div className="bg-primary text-primary-foreground p-6 flex items-center justify-center">
          {previewRows.length === 0 ? (
            <p className="text-sm text-white/60 italic">No active platforms with valid URLs — nothing will render in the footer.</p>
          ) : (
            <div className="flex items-center gap-5">
              {previewRows.map((r) => (
                <SocialIconRender
                  key={r.id}
                  platform={r.platform}
                  iconStyle={r.icon_style}
                  className="text-white/80"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          <Save className="h-4 w-4 mr-1" />
          {saveMutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
