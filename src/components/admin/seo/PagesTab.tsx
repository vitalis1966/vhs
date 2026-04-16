import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, RotateCcw, Plus, Trash2, ChevronUp, ChevronDown, Eye, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function CharCounter({ value, max, warn }: { value: string; max: number; warn: number }) {
  const len = value.length;
  const color = len <= max ? "text-green-600" : len <= warn ? "text-amber-500" : "text-red-500";
  return <span className={cn("text-xs font-mono", color)}>{len}/{max}</span>;
}

function GooglePreview({ title, description, path, siteUrl }: { title: string; description: string; path: string; siteUrl: string }) {
  const displayUrl = siteUrl.replace(/^https?:\/\//, "") + (path === "/" ? "" : path);
  return (
    <div className="bg-white border border-border rounded-lg p-4 space-y-1 max-w-xl">
      <p className="text-xs text-muted-foreground">{displayUrl}</p>
      <p className="text-blue-700 text-base font-medium leading-tight truncate">{title || "Page Title"}</p>
      <p className="text-sm text-muted-foreground line-clamp-2">{description || "Page description will appear here…"}</p>
    </div>
  );
}

function SocialPreview({ title, description, image, siteUrl }: { title: string; description: string; image: string; siteUrl: string }) {
  const domain = siteUrl.replace(/^https?:\/\//, "");
  return (
    <div className="border border-border rounded-lg overflow-hidden max-w-sm bg-white">
      <div className="bg-muted h-40 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt="OG Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <span className="text-xs text-muted-foreground">No image set</span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-xs text-muted-foreground uppercase">{domain}</p>
        <p className="text-sm font-semibold leading-tight line-clamp-2">{title || "Page Title"}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{description || "Description"}</p>
      </div>
    </div>
  );
}

function BreadcrumbBuilder({ value, onChange }: { value: Array<{ position: number; name: string; item: string }>; onChange: (v: Array<{ position: number; name: string; item: string }>) => void }) {
  const [showRaw, setShowRaw] = useState(false);
  const [rawJson, setRawJson] = useState("");

  const addItem = () => {
    onChange([...value, { position: value.length + 1, name: "", item: "/" }]);
  };
  const removeItem = (idx: number) => {
    const next = value.filter((_, i) => i !== idx).map((b, i) => ({ ...b, position: i + 1 }));
    onChange(next);
  };
  const updateItem = (idx: number, field: "name" | "item", val: string) => {
    const next = [...value];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };
  const moveItem = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= value.length) return;
    const next = [...value];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    onChange(next.map((b, i) => ({ ...b, position: i + 1 })));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Breadcrumbs</Label>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => {
            setShowRaw(!showRaw);
            if (!showRaw) setRawJson(JSON.stringify(value, null, 2));
          }}>
            {showRaw ? "Visual" : "Raw JSON"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3 w-3 mr-1" />Add</Button>
        </div>
      </div>
      {showRaw ? (
        <div>
          <Textarea value={rawJson} onChange={(e) => setRawJson(e.target.value)} rows={6} className="font-mono text-xs" />
          <Button type="button" size="sm" variant="secondary" className="mt-2" onClick={() => {
            try { onChange(JSON.parse(rawJson)); setShowRaw(false); } catch { toast({ title: "Invalid JSON", variant: "destructive" }); }
          }}>Apply JSON</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-6">{b.position}</span>
              <Input placeholder="Name" value={b.name} onChange={(e) => updateItem(i, "name", e.target.value)} className="flex-1" />
              <Input placeholder="/path" value={b.item} onChange={(e) => updateItem(i, "item", e.target.value)} className="flex-1" />
              <Button type="button" variant="ghost" size="icon" onClick={() => moveItem(i, -1)} disabled={i === 0}><ChevronUp className="h-3 w-3" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => moveItem(i, 1)} disabled={i === value.length - 1}><ChevronDown className="h-3 w-3" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(i)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
            </div>
          ))}
          {value.length === 0 && <p className="text-xs text-muted-foreground">No breadcrumbs. Click "Add" to start.</p>}
        </div>
      )}
    </div>
  );
}

export function PagesTab() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [savedForm, setSavedForm] = useState<Record<string, unknown>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRoute, setNewRoute] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["seo-admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_pages").select("*").order("route");
      if (error) throw error;
      return data;
    },
  });

  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  const selectPage = useCallback((page: Record<string, unknown>) => {
    setSelectedId(page.id as string);
    setForm({ ...page });
    setSavedForm({ ...page });
  }, []);

  const updateField = (key: string, value: unknown) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-fill OG/Twitter from title/description
      if (key === "title") {
        if (!f.og_title) next._autoOgTitle = true;
        if (!f.twitter_title) next._autoTwitterTitle = true;
      }
      if (key === "description") {
        if (!f.og_description) next._autoOgDesc = true;
        if (!f.twitter_description) next._autoTwitterDesc = true;
      }
      return next;
    });
  };

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { _autoOgTitle, _autoOgDesc, _autoTwitterTitle, _autoTwitterDesc, ...rest } = values;
      // Auto-sync: if OG/Twitter fields are empty, populate from title/description
      if (!rest.og_title && rest.title) rest.og_title = rest.title;
      if (!rest.og_description && rest.description) rest.og_description = rest.description;
      if (!rest.twitter_title && rest.title) rest.twitter_title = rest.og_title || rest.title;
      if (!rest.twitter_description && rest.description) rest.twitter_description = rest.og_description || rest.description;
      const { error } = await supabase.from("seo_pages").update(rest as any).eq("id", rest.id as string);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-pages"] });
      queryClient.invalidateQueries({ queryKey: ["seo-page"] });
      setSavedForm({ ...form });
      toast({ title: "✓ Page SEO saved" });
    },
    onError: (e: Error) => toast({ title: "Error saving", description: e.message, variant: "destructive" }),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("seo_pages").insert({ route: newRoute, page_label: newLabel });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-pages"] });
      setShowAddDialog(false);
      setNewRoute("");
      setNewLabel("");
      toast({ title: "Page added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("seo_pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-pages"] });
      queryClient.invalidateQueries({ queryKey: ["seo-page"] });
      if (selectedId === deletedId) {
        setSelectedId(null);
        setForm({});
        setSavedForm({});
      }
      toast({ title: "Page deleted" });
    },
    onError: (e: Error) => toast({ title: "Error deleting", description: e.message, variant: "destructive" }),
  });

  const siteUrl = "https://www.vitalisstrategies.com";
  const title = (form.title as string) || "";
  const description = (form.description as string) || "";
  const ogTitle = (form.og_title as string) || title;
  const ogDescription = (form.og_description as string) || description;
  const ogImage = (form.og_image as string) || "";
  const twitterTitle = (form.twitter_title as string) || ogTitle;
  const twitterDescription = (form.twitter_description as string) || ogDescription;
  const route = (form.route as string) || "/";

  const selectedPage = selectedId ? pages.find((p) => p.id === selectedId) : null;

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Left sidebar - page list */}
      <div className="w-64 shrink-0 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pages</h3>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Plus className="h-3 w-3 mr-1" />Add</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Page</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Route</Label><Input value={newRoute} onChange={(e) => setNewRoute(e.target.value)} placeholder="/new-page" /></div>
                <div><Label>Label</Label><Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="New Page" /></div>
                <Button onClick={() => addMutation.mutate()} disabled={!newRoute || !newLabel}>Add Page</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
          {pages.map((p) => {
            const isNoindex = p.noindex || (p.robots && p.robots.includes("noindex"));
            return (
              <div key={p.id} className="group flex items-center gap-1">
                <button
                  onClick={() => {
                    if (isDirty && !confirm("You have unsaved changes. Discard?")) return;
                    selectPage(p as Record<string, unknown>);
                  }}
                  className={cn(
                    "flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors min-w-0",
                    selectedId === p.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full shrink-0", isNoindex ? "bg-gray-400" : "bg-green-500")} />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.page_label}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.route}</p>
                    </div>
                  </div>
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{p.page_label}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove the SEO settings for <span className="font-mono">{p.route}</span>. The page itself will still exist but will use global defaults.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(p.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel - edit form */}
      <div className="flex-1 min-w-0">
        {!selectedPage ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a page from the list to edit its SEO settings.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-background z-10 pb-4 border-b">
              <div>
                <h2 className="font-display text-lg font-bold">{form.page_label as string}</h2>
                <p className="text-sm text-muted-foreground font-mono">{route}</p>
              </div>
              <div className="flex gap-2">
                {isDirty && <Badge variant="secondary" className="text-amber-600 bg-amber-50">Unsaved changes</Badge>}
                <Button variant="outline" size="sm" onClick={() => { setForm({ ...savedForm }); }} disabled={!isDirty}>
                  <RotateCcw className="h-3 w-3 mr-1" />Reset
                </Button>
                <Button size="sm" onClick={() => saveMutation.mutate(form)} disabled={!isDirty || saveMutation.isPending}>
                  <Save className="h-3 w-3 mr-1" />Save
                </Button>
              </div>
            </div>

            {/* Identity */}
            <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
              <legend className="text-sm font-semibold px-2">Identity</legend>
              <div>
                <Label>Page Route</Label>
                <Input value={route} disabled className="bg-muted font-mono" />
              </div>
              <div>
                <Label>Page Label</Label>
                <Input value={(form.page_label as string) || ""} onChange={(e) => updateField("page_label", e.target.value)} />
              </div>
            </fieldset>

            {/* Title & Description */}
            <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
              <legend className="text-sm font-semibold px-2">Title & Description</legend>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Title</Label>
                  <CharCounter value={title} max={60} warn={70} />
                </div>
                <Input value={title} onChange={(e) => updateField("title", e.target.value)} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Description</Label>
                  <CharCounter value={description} max={155} warn={165} />
                </div>
                <Textarea value={description} onChange={(e) => updateField("description", e.target.value)} rows={3} />
              </div>
              <div>
                <Label>Keywords</Label>
                <Input value={(form.keywords as string) || ""} onChange={(e) => updateField("keywords", e.target.value)} placeholder="comma, separated, keywords" />
              </div>
            </fieldset>

            {/* Google Preview */}
            <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
              <legend className="text-sm font-semibold px-2 flex items-center gap-1"><Eye className="h-3 w-3" /> Google Search Preview</legend>
              <GooglePreview title={title} description={description} path={route} siteUrl={siteUrl} />
            </fieldset>

            {/* Robots */}
            <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
              <legend className="text-sm font-semibold px-2">Robots & Indexing</legend>
              <div>
                <Label>Robots Directive</Label>
                <Select value={(form.robots as string) || "index, follow"} onValueChange={(v) => {
                  updateField("robots", v);
                  updateField("noindex", v.includes("noindex"));
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index, follow">index, follow</SelectItem>
                    <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                    <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                    <SelectItem value="noarchive">noarchive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={!!form.noindex} onCheckedChange={(v) => {
                  updateField("noindex", v);
                  updateField("robots", v ? "noindex, follow" : "index, follow");
                }} />
                <Label>NoIndex</Label>
              </div>
              <div>
                <Label>Canonical Override</Label>
                <Input value={(form.canonical_override as string) || ""} onChange={(e) => updateField("canonical_override", e.target.value)} placeholder="Leave blank for auto-generated canonical" />
              </div>
            </fieldset>

            {/* Open Graph */}
            <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
              <legend className="text-sm font-semibold px-2">Open Graph (Link Previews)</legend>
              <div>
                <Label>OG Title</Label>
                <Input value={(form.og_title as string) || ""} onChange={(e) => updateField("og_title", e.target.value)} placeholder="Leave blank to use Title" />
                {!form.og_title && title && <p className="text-xs text-green-600 mt-1">↳ Auto-filled from Title</p>}
              </div>
              <div>
                <Label>OG Description</Label>
                <Textarea value={(form.og_description as string) || ""} onChange={(e) => updateField("og_description", e.target.value)} rows={2} placeholder="Leave blank to use Description" />
                {!form.og_description && description && <p className="text-xs text-green-600 mt-1">↳ Auto-filled from Description</p>}
              </div>
              <div>
                <Label>OG Image Path</Label>
                <Input value={ogImage} onChange={(e) => updateField("og_image", e.target.value)} placeholder="/og-home.jpg" />
                {ogImage && <OgImageStatus path={ogImage} />}
              </div>
              <div>
                <Label>OG Image Alt</Label>
                <Input value={(form.og_image_alt as string) || ""} onChange={(e) => updateField("og_image_alt", e.target.value)} />
              </div>
              <div>
                <Label>OG Type</Label>
                <Select value={(form.og_type as string) || "website"} onValueChange={(v) => updateField("og_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">website</SelectItem>
                    <SelectItem value="article">article</SelectItem>
                    <SelectItem value="product">product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <Label className="text-sm font-semibold">Social Card Preview</Label>
                <div className="mt-2">
                  <SocialPreview title={ogTitle} description={ogDescription} image={ogImage ? `${siteUrl}${ogImage}` : ""} siteUrl={siteUrl} />
                </div>
              </div>
            </fieldset>

            {/* Twitter */}
            <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
              <legend className="text-sm font-semibold px-2">Twitter / X Card</legend>
              <div>
                <Label>Twitter Title</Label>
                <Input value={(form.twitter_title as string) || ""} onChange={(e) => updateField("twitter_title", e.target.value)} placeholder="Leave blank to use OG Title" />
                {!form.twitter_title && ogTitle && <p className="text-xs text-green-600 mt-1">↳ Auto-filled from OG Title</p>}
              </div>
              <div>
                <Label>Twitter Description</Label>
                <Textarea value={(form.twitter_description as string) || ""} onChange={(e) => updateField("twitter_description", e.target.value)} rows={2} placeholder="Leave blank to use OG Description" />
                {!form.twitter_description && ogDescription && <p className="text-xs text-green-600 mt-1">↳ Auto-filled from OG Description</p>}
              </div>
              <div>
                <Label>Twitter Image</Label>
                <Input value={(form.twitter_image as string) || ""} onChange={(e) => updateField("twitter_image", e.target.value)} placeholder="Leave blank to use OG Image" />
              </div>
              <div>
                <Label>Twitter Image Alt</Label>
                <Input value={(form.twitter_image_alt as string) || ""} onChange={(e) => updateField("twitter_image_alt", e.target.value)} />
              </div>
              <div>
                <Label>Twitter Card Type</Label>
                <Select value={(form.twitter_card as string) || "summary_large_image"} onValueChange={(v) => updateField("twitter_card", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary_large_image">summary_large_image</SelectItem>
                    <SelectItem value="summary">summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </fieldset>

            {/* Schema & Breadcrumbs */}
            <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
              <legend className="text-sm font-semibold px-2">Schema & Breadcrumbs</legend>
              <div>
                <Label>Schema Type</Label>
                <Select value={(form.schema_type as string) || "WebPage"} onValueChange={(v) => updateField("schema_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["WebPage", "AboutPage", "ContactPage", "CollectionPage", "Service", "Blog", "Article", "FAQPage"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <BreadcrumbBuilder
                value={Array.isArray(form.breadcrumbs) ? form.breadcrumbs as Array<{ position: number; name: string; item: string }> : []}
                onChange={(v) => updateField("breadcrumbs", v)}
              />
              <div>
                <Label>Custom Schema JSON</Label>
                <Textarea
                  value={form.schema_json ? JSON.stringify(form.schema_json, null, 2) : ""}
                  onChange={(e) => {
                    try { updateField("schema_json", JSON.parse(e.target.value)); } catch { /* typing */ }
                  }}
                  rows={6}
                  className="font-mono text-xs"
                  placeholder="Leave blank to auto-generate from Schema Type"
                />
              </div>
            </fieldset>

            {/* Article fields (shown when OG Type = article) */}
            {(form.og_type as string) === "article" && (
              <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
                <legend className="text-sm font-semibold px-2">Article Fields</legend>
                <div><Label>Author</Label><Input value={(form.article_author as string) || ""} onChange={(e) => updateField("article_author", e.target.value)} /></div>
                <div><Label>Published Date</Label><Input type="datetime-local" value={(form.article_published as string)?.slice(0, 16) || ""} onChange={(e) => updateField("article_published", e.target.value)} /></div>
                <div><Label>Modified Date</Label><Input type="datetime-local" value={(form.article_modified as string)?.slice(0, 16) || ""} onChange={(e) => updateField("article_modified", e.target.value)} /></div>
                <div><Label>Section</Label><Input value={(form.article_section as string) || ""} onChange={(e) => updateField("article_section", e.target.value)} /></div>
                <div>
                  <Label>Tags</Label>
                  <ArticleTagsInput
                    value={(form.article_tags as string[]) || []}
                    onChange={(v) => updateField("article_tags", v)}
                  />
                </div>
              </fieldset>
            )}

            {/* Active */}
            <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
              <legend className="text-sm font-semibold px-2">Status</legend>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active !== false} onCheckedChange={(v) => updateField("is_active", v)} />
                <Label>SEO Active for this page</Label>
              </div>
            </fieldset>
          </div>
        )}
      </div>
    </div>
  );
}

function OgImageStatus({ path }: { path: string }) {
  const [status, setStatus] = useState<"loading" | "found" | "missing">("loading");
  useEffect(() => {
    const img = new Image();
    img.onload = () => setStatus("found");
    img.onerror = () => setStatus("missing");
    img.src = path.startsWith("http") ? path : path;
    return () => { img.onload = null; img.onerror = null; };
  }, [path]);
  if (status === "loading") return null;
  return status === "found"
    ? <p className="text-xs text-green-600 mt-1">✅ File found</p>
    : <p className="text-xs text-red-500 mt-1">⚠️ File not found — upload to /public/</p>;
}

function ArticleTagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInput("");
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add tag…" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
        <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => onChange(value.filter((t) => t !== tag))}>
            {tag} ×
          </Badge>
        ))}
      </div>
    </div>
  );
}
