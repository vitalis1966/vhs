import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, Trash2, Globe, Settings, FileCode, ArrowRightLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// ─── Page SEO Tab ───
function PagesTab() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["seo-admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_pages").select("*").order("route");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const id = values.id as string;
      const { error } = await supabase.from("seo_pages").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-pages"] });
      queryClient.invalidateQueries({ queryKey: ["seo-page"] });
      setEditingId(null);
      toast({ title: "Page SEO saved" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEdit = (page: Record<string, unknown>) => {
    setEditingId(page.id as string);
    setForm({ ...page });
  };

  const updateField = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  if (isLoading) return <p className="text-muted-foreground p-4">Loading…</p>;

  if (editingId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">{form.page_label as string}</h3>
            <p className="text-sm text-muted-foreground">{form.route as string}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
            <Button size="sm" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
              <Save className="h-4 w-4 mr-1" />Save
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
            <legend className="text-sm font-semibold px-2">Title & Description</legend>
            <div>
              <Label>Title</Label>
              <Input value={(form.title as string) || ""} onChange={(e) => updateField("title", e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">{((form.title as string) || "").length}/60 chars</p>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={(form.description as string) || ""} onChange={(e) => updateField("description", e.target.value)} rows={3} />
              <p className="text-xs text-muted-foreground mt-1">{((form.description as string) || "").length}/160 chars</p>
            </div>
            <div>
              <Label>Keywords</Label>
              <Input value={(form.keywords as string) || ""} onChange={(e) => updateField("keywords", e.target.value)} />
            </div>
          </fieldset>

          <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
            <legend className="text-sm font-semibold px-2">Robots & Canonical</legend>
            <div>
              <Label>Robots</Label>
              <Input value={(form.robots as string) || ""} onChange={(e) => updateField("robots", e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!form.noindex} onCheckedChange={(v) => updateField("noindex", v)} />
              <Label>NoIndex</Label>
            </div>
            <div>
              <Label>Canonical Override</Label>
              <Input value={(form.canonical_override as string) || ""} onChange={(e) => updateField("canonical_override", e.target.value)} placeholder="Leave blank for auto" />
            </div>
          </fieldset>

          <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
            <legend className="text-sm font-semibold px-2">Open Graph</legend>
            <div>
              <Label>OG Title</Label>
              <Input value={(form.og_title as string) || ""} onChange={(e) => updateField("og_title", e.target.value)} placeholder="Falls back to page title" />
            </div>
            <div>
              <Label>OG Description</Label>
              <Textarea value={(form.og_description as string) || ""} onChange={(e) => updateField("og_description", e.target.value)} rows={2} placeholder="Falls back to page description" />
            </div>
            <div>
              <Label>OG Image URL</Label>
              <Input value={(form.og_image as string) || ""} onChange={(e) => updateField("og_image", e.target.value)} />
            </div>
            <div>
              <Label>OG Image Alt</Label>
              <Input value={(form.og_image_alt as string) || ""} onChange={(e) => updateField("og_image_alt", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>OG Type</Label><Input value={(form.og_type as string) || ""} onChange={(e) => updateField("og_type", e.target.value)} /></div>
              <div><Label>Width</Label><Input value={(form.og_image_width as string) || ""} onChange={(e) => updateField("og_image_width", e.target.value)} /></div>
              <div><Label>Height</Label><Input value={(form.og_image_height as string) || ""} onChange={(e) => updateField("og_image_height", e.target.value)} /></div>
            </div>
          </fieldset>

          <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
            <legend className="text-sm font-semibold px-2">Twitter / X</legend>
            <div><Label>Twitter Card</Label><Input value={(form.twitter_card as string) || ""} onChange={(e) => updateField("twitter_card", e.target.value)} /></div>
            <div><Label>Twitter Title</Label><Input value={(form.twitter_title as string) || ""} onChange={(e) => updateField("twitter_title", e.target.value)} placeholder="Falls back to OG title" /></div>
            <div><Label>Twitter Description</Label><Textarea value={(form.twitter_description as string) || ""} onChange={(e) => updateField("twitter_description", e.target.value)} rows={2} /></div>
            <div><Label>Twitter Image</Label><Input value={(form.twitter_image as string) || ""} onChange={(e) => updateField("twitter_image", e.target.value)} placeholder="Falls back to OG image" /></div>
          </fieldset>

          <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
            <legend className="text-sm font-semibold px-2">Schema / Structured Data</legend>
            <div><Label>Schema Type</Label><Input value={(form.schema_type as string) || ""} onChange={(e) => updateField("schema_type", e.target.value)} /></div>
            <div>
              <Label>Custom Schema JSON</Label>
              <Textarea
                value={form.schema_json ? JSON.stringify(form.schema_json, null, 2) : ""}
                onChange={(e) => {
                  try { updateField("schema_json", JSON.parse(e.target.value)); } catch { /* ignore parse errors while typing */ }
                }}
                rows={6}
                className="font-mono text-xs"
                placeholder="Leave blank to auto-generate from schema_type"
              />
            </div>
            <div>
              <Label>Breadcrumbs JSON</Label>
              <Textarea
                value={form.breadcrumbs ? JSON.stringify(form.breadcrumbs, null, 2) : ""}
                onChange={(e) => {
                  try { updateField("breadcrumbs", JSON.parse(e.target.value)); } catch { /* ignore */ }
                }}
                rows={4}
                className="font-mono text-xs"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-3 border border-border/40 rounded-xl p-4">
            <legend className="text-sm font-semibold px-2">Active</legend>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active !== false} onCheckedChange={(v) => updateField("is_active", v)} />
              <Label>Page SEO Active</Label>
            </div>
          </fieldset>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Click a page to edit its SEO meta tags, Open Graph, schema, and more.</p>
      <div className="space-y-2">
        {pages.map((p: Record<string, unknown>) => (
          <Card
            key={p.id as string}
            className="p-4 cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => startEdit(p)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{p.page_label as string}</p>
                <p className="text-xs text-muted-foreground">{p.route as string}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.noindex && <Badge variant="secondary" className="text-xs">noindex</Badge>}
                {!p.is_active && <Badge variant="outline" className="text-xs">inactive</Badge>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Global Settings Tab ───
function GlobalTab() {
  const queryClient = useQueryClient();
  const { data: global, isLoading } = useQuery({
    queryKey: ["seo-admin-global"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_global").select("*").eq("id", 1).single();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState<Record<string, unknown>>({});
  const [initialized, setInitialized] = useState(false);

  if (global && !initialized) {
    setForm(global);
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("seo_global").update(values).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-global"] });
      queryClient.invalidateQueries({ queryKey: ["seo-global"] });
      toast({ title: "Global settings saved" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateField = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  if (isLoading) return <p className="text-muted-foreground p-4">Loading…</p>;

  const fields: Array<{ section: string; items: Array<{ key: string; label: string; type?: "textarea" }> }> = [
    {
      section: "Site Identity",
      items: [
        { key: "site_name", label: "Site Name" },
        { key: "site_url", label: "Site URL" },
        { key: "site_locale", label: "Locale" },
        { key: "default_og_image", label: "Default OG Image" },
        { key: "theme_color", label: "Theme Color" },
        { key: "default_title", label: "Default Title (fallback)" },
        { key: "default_description", label: "Default Description (fallback)" },
        { key: "default_robots", label: "Default Robots" },
      ],
    },
    {
      section: "Social Handles",
      items: [
        { key: "twitter_handle", label: "Twitter Handle (@)" },
        { key: "facebook_page_url", label: "Facebook Page URL" },
        { key: "facebook_app_id", label: "Facebook App ID" },
        { key: "linkedin_url", label: "LinkedIn URL" },
        { key: "instagram_url", label: "Instagram URL" },
      ],
    },
    {
      section: "Google Integrations",
      items: [
        { key: "google_analytics_id", label: "Google Analytics ID (G-XXX)" },
        { key: "google_tag_manager_id", label: "Google Tag Manager (GTM-XXX)" },
        { key: "google_search_console", label: "Search Console Verification" },
        { key: "google_ads_id", label: "Google Ads ID (AW-XXX)" },
        { key: "google_ads_conversion_label", label: "Ads Conversion Label" },
      ],
    },
    {
      section: "Other Verification",
      items: [
        { key: "bing_verification", label: "Bing Verification" },
        { key: "pinterest_verification", label: "Pinterest Verification" },
      ],
    },
    {
      section: "Analytics & Marketing",
      items: [
        { key: "meta_pixel_id", label: "Meta Pixel ID" },
        { key: "linkedin_partner_id", label: "LinkedIn Partner ID" },
        { key: "hotjar_id", label: "Hotjar ID" },
      ],
    },
    {
      section: "Chat & Support",
      items: [
        { key: "intercom_app_id", label: "Intercom App ID" },
        { key: "crisp_website_id", label: "Crisp Website ID" },
      ],
    },
    {
      section: "Custom Scripts",
      items: [
        { key: "custom_head_script", label: "Custom Head Script (JS)", type: "textarea" as const },
        { key: "custom_body_script", label: "Custom Body Script (JS)", type: "textarea" as const },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
          <Save className="h-4 w-4 mr-1" />Save Global Settings
        </Button>
      </div>
      {fields.map((section) => (
        <fieldset key={section.section} className="space-y-3 border border-border/40 rounded-xl p-4">
          <legend className="text-sm font-semibold px-2">{section.section}</legend>
          {section.items.map((item) => (
            <div key={item.key}>
              <Label>{item.label}</Label>
              {item.type === "textarea" ? (
                <Textarea value={(form[item.key] as string) || ""} onChange={(e) => updateField(item.key, e.target.value)} rows={4} className="font-mono text-xs" />
              ) : (
                <Input value={(form[item.key] as string) || ""} onChange={(e) => updateField(item.key, e.target.value)} />
              )}
            </div>
          ))}
        </fieldset>
      ))}
    </div>
  );
}

// ─── Schema Tab ───
function SchemaTab() {
  const queryClient = useQueryClient();
  const { data: schemas = [], isLoading } = useQuery({
    queryKey: ["seo-admin-schemas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_schema_global").select("*").order("id");
      if (error) throw error;
      return data;
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [jsonStr, setJsonStr] = useState("");
  const [active, setActive] = useState(true);

  const saveMutation = useMutation({
    mutationFn: async ({ id, schema_json, is_active }: { id: string; schema_json: Record<string, unknown>; is_active: boolean }) => {
      const { error } = await supabase.from("seo_schema_global").update({ schema_json, is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-schemas"] });
      queryClient.invalidateQueries({ queryKey: ["seo-schemas-global"] });
      setEditingId(null);
      toast({ title: "Schema saved" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (isLoading) return <p className="text-muted-foreground p-4">Loading…</p>;

  if (editingId) {
    const schema = schemas.find((s: Record<string, unknown>) => s.id === editingId);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{(schema as Record<string, unknown>)?.label as string}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
            <Button size="sm" onClick={() => {
              try {
                saveMutation.mutate({ id: editingId, schema_json: JSON.parse(jsonStr), is_active: active });
              } catch { toast({ title: "Invalid JSON", variant: "destructive" }); }
            }}>
              <Save className="h-4 w-4 mr-1" />Save
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={active} onCheckedChange={setActive} /><Label>Active</Label>
        </div>
        <Textarea value={jsonStr} onChange={(e) => setJsonStr(e.target.value)} rows={20} className="font-mono text-xs" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Global JSON-LD schemas injected on every page.</p>
      {schemas.map((s: Record<string, unknown>) => (
        <Card key={s.id as string} className="p-4 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => {
          setEditingId(s.id as string);
          setJsonStr(JSON.stringify(s.schema_json, null, 2));
          setActive(s.is_active !== false);
        }}>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">{s.label as string}</p>
            {!s.is_active && <Badge variant="outline" className="text-xs">inactive</Badge>}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Redirects Tab ───
function RedirectsTab() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newType, setNewType] = useState(301);
  const [newNote, setNewNote] = useState("");

  const { data: redirects = [], isLoading } = useQuery({
    queryKey: ["seo-admin-redirects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_redirects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("seo_redirects").insert({ from_path: newFrom, to_path: newTo, redirect_type: newType, note: newNote || null });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-redirects"] });
      setShowAdd(false);
      setNewFrom("");
      setNewTo("");
      setNewNote("");
      toast({ title: "Redirect added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("seo_redirects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-redirects"] });
      toast({ title: "Redirect deleted" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("seo_redirects").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seo-admin-redirects"] }),
  });

  if (isLoading) return <p className="text-muted-foreground p-4">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage URL redirects for SEO.</p>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Redirect</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Redirect</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>From Path</Label><Input value={newFrom} onChange={(e) => setNewFrom(e.target.value)} placeholder="/old-page" /></div>
              <div><Label>To Path</Label><Input value={newTo} onChange={(e) => setNewTo(e.target.value)} placeholder="/new-page" /></div>
              <div><Label>Type</Label>
                <select className="w-full border rounded-md p-2 text-sm" value={newType} onChange={(e) => setNewType(Number(e.target.value))}>
                  <option value={301}>301 Permanent</option>
                  <option value={302}>302 Temporary</option>
                </select>
              </div>
              <div><Label>Note</Label><Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Why this redirect?" /></div>
              <Button onClick={() => addMutation.mutate()} disabled={!newFrom || !newTo || addMutation.isPending}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {redirects.map((r: Record<string, unknown>) => (
          <Card key={r.id as string} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm"><span className="font-mono text-muted-foreground">{r.from_path as string}</span> → <span className="font-mono font-semibold">{r.to_path as string}</span></p>
                <div className="flex gap-2">
                  <Badge variant="secondary">{r.redirect_type as number}</Badge>
                  {r.note && <span className="text-xs text-muted-foreground">{r.note as string}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={r.is_active as boolean} onCheckedChange={(v) => toggleMutation.mutate({ id: r.id as string, is_active: v })} />
                <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this redirect?")) deleteMutation.mutate(r.id as string); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {redirects.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No redirects configured.</p>}
      </div>
    </div>
  );
}

// ─── Main Admin Page ───
export default function SEOAdmin() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">SEO Management</span>
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            SEO Settings
          </h1>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <Tabs defaultValue="pages">
            <TabsList className="mb-6">
              <TabsTrigger value="pages"><Globe className="h-4 w-4 mr-1" />Pages</TabsTrigger>
              <TabsTrigger value="global"><Settings className="h-4 w-4 mr-1" />Global</TabsTrigger>
              <TabsTrigger value="schema"><FileCode className="h-4 w-4 mr-1" />Schema</TabsTrigger>
              <TabsTrigger value="redirects"><ArrowRightLeft className="h-4 w-4 mr-1" />Redirects</TabsTrigger>
            </TabsList>
            <TabsContent value="pages"><PagesTab /></TabsContent>
            <TabsContent value="global"><GlobalTab /></TabsContent>
            <TabsContent value="schema"><SchemaTab /></TabsContent>
            <TabsContent value="redirects"><RedirectsTab /></TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}
