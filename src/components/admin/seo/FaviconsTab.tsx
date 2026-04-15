import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const FAVICON_FILES = [
  { file: "/favicon.ico", size: "any" },
  { file: "/favicon.svg", size: "vector" },
  { file: "/favicon-16x16.png", size: "16×16" },
  { file: "/favicon-32x32.png", size: "32×32" },
  { file: "/favicon-96x96.png", size: "96×96" },
  { file: "/apple-touch-icon.png", size: "180×180" },
  { file: "/apple-touch-icon-152x152.png", size: "152×152" },
  { file: "/apple-touch-icon-120x120.png", size: "120×120" },
  { file: "/safari-pinned-tab.svg", size: "vector" },
  { file: "/android-chrome-192x192.png", size: "192×192" },
  { file: "/android-chrome-512x512.png", size: "512×512" },
  { file: "/mstile-150x150.png", size: "150×150" },
  { file: "/site.webmanifest", size: "—" },
  { file: "/browserconfig.xml", size: "—" },
];

function FileStatus({ path }: { path: string }) {
  const [status, setStatus] = useState<"checking" | "found" | "missing">("checking");

  useEffect(() => {
    const isImage = /\.(png|jpg|jpeg|svg|ico|webp)$/i.test(path);
    if (isImage) {
      const img = new window.Image();
      img.onload = () => setStatus("found");
      img.onerror = () => setStatus("missing");
      img.src = path;
    } else {
      fetch(path, { method: "HEAD" })
        .then((r) => setStatus(r.ok ? "found" : "missing"))
        .catch(() => setStatus("missing"));
    }
  }, [path]);

  if (status === "checking") return <span className="text-xs text-muted-foreground">…</span>;
  return status === "found"
    ? <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">✅ Found</Badge>
    : <Badge variant="secondary" className="bg-red-50 text-red-600 text-xs">⚠️ Missing</Badge>;
}

interface OgPage {
  id: string;
  route: string;
  page_label: string;
  og_image: string | null;
  og_image_alt: string | null;
}

interface OgFormState {
  og_image: string;
  og_image_alt: string;
}

export function FaviconsTab() {
  const queryClient = useQueryClient();

  const { data: pages = [] } = useQuery({
    queryKey: ["seo-admin-og-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_pages").select("id, route, page_label, og_image, og_image_alt").order("route");
      if (error) throw error;
      return data as OgPage[];
    },
  });

  // Edit dialog state
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<OgFormState>({ og_image: "", og_image_alt: "" });

  // Add dialog state
  const [showAdd, setShowAdd] = useState(false);
  const [addRoute, setAddRoute] = useState("");
  const [addLabel, setAddLabel] = useState("");
  const [addForm, setAddForm] = useState<OgFormState>({ og_image: "", og_image_alt: "" });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editId) return;
      const { error } = await supabase.from("seo_pages").update({
        og_image: editForm.og_image || null,
        og_image_alt: editForm.og_image_alt || null,
      }).eq("id", editId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-og-pages"] });
      setEditId(null);
      toast({ title: "✓ OG image updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("seo_pages").insert({
        route: addRoute,
        page_label: addLabel,
        og_image: addForm.og_image || null,
        og_image_alt: addForm.og_image_alt || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-og-pages"] });
      setShowAdd(false);
      setAddRoute("");
      setAddLabel("");
      setAddForm({ og_image: "", og_image_alt: "" });
      toast({ title: "✓ Page OG image added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const clearOgMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("seo_pages").update({
        og_image: null,
        og_image_alt: null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-og-pages"] });
      toast({ title: "OG image cleared" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const openEdit = (p: OgPage) => {
    setEditId(p.id);
    setEditForm({ og_image: p.og_image ?? "", og_image_alt: p.og_image_alt ?? "" });
  };

  return (
    <div className="space-y-8">
      {/* Favicons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Favicon Files</h3>
          <a href="https://realfavicongenerator.net" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
            Generate all sizes at realfavicongenerator.net <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FAVICON_FILES.map((f) => (
                <TableRow key={f.file}>
                  <TableCell className="font-mono text-xs">{f.file}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{f.size}</TableCell>
                  <TableCell><FileStatus path={f.file} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* OG Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">OG Images</h3>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-3 w-3 mr-1" />Add OG Image</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add OG Image to Page</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Route</Label>
                  <Input value={addRoute} onChange={(e) => setAddRoute(e.target.value)} placeholder="/about" />
                  {addRoute && !addRoute.startsWith("/") && <p className="text-xs text-red-500 mt-1">Must start with /</p>}
                </div>
                <div>
                  <Label>Page Label</Label>
                  <Input value={addLabel} onChange={(e) => setAddLabel(e.target.value)} placeholder="About" />
                </div>
                <div>
                  <Label>OG Image Path</Label>
                  <Input value={addForm.og_image} onChange={(e) => setAddForm(f => ({ ...f, og_image: e.target.value }))} placeholder="/og-about.jpg" />
                  <p className="text-xs text-muted-foreground mt-1">1200×630px JPG/PNG in /public/ folder</p>
                </div>
                <div>
                  <Label>Image Alt Text</Label>
                  <Input value={addForm.og_image_alt} onChange={(e) => setAddForm(f => ({ ...f, og_image_alt: e.target.value }))} placeholder="About page preview" />
                </div>
                <Button onClick={() => addMutation.mutate()} disabled={!addRoute || !addLabel || !addRoute.startsWith("/") || addMutation.isPending}>
                  Add Page OG Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-xs text-muted-foreground">OG images must be 1200×630px JPG/PNG. Place in /public/ folder.</p>

        {/* Edit Dialog */}
        <Dialog open={editId !== null} onOpenChange={(open) => { if (!open) setEditId(null); }}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit OG Image</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>OG Image Path</Label>
                <Input value={editForm.og_image} onChange={(e) => setEditForm(f => ({ ...f, og_image: e.target.value }))} placeholder="/og-about.jpg" />
                <p className="text-xs text-muted-foreground mt-1">1200×630px JPG/PNG in /public/ folder</p>
              </div>
              <div>
                <Label>Image Alt Text</Label>
                <Input value={editForm.og_image_alt} onChange={(e) => setEditForm(f => ({ ...f, og_image_alt: e.target.value }))} placeholder="About page preview" />
              </div>
              {editForm.og_image && (
                <div>
                  <Label className="text-xs text-muted-foreground">Preview</Label>
                  <img src={editForm.og_image} alt="" className="w-full max-w-xs h-auto rounded border mt-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>OG Image Path</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm">{p.page_label}</TableCell>
                  <TableCell className="font-mono text-xs">{p.og_image || <span className="text-muted-foreground">No image set</span>}</TableCell>
                  <TableCell>{p.og_image ? <FileStatus path={p.og_image} /> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    {p.og_image ? (
                      <img src={p.og_image} alt="" className="w-20 h-10 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="Edit OG image">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {p.og_image && (
                        <Button variant="ghost" size="icon" onClick={() => { if (confirm(`Clear OG image for ${p.page_label}?`)) clearOgMutation.mutate(p.id); }} title="Clear OG image">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">No pages configured.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
