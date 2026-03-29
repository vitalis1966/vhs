import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      const img = new Image();
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

function OgImageRow({ route, label, ogImage }: { route: string; label: string; ogImage: string | null }) {
  if (!ogImage) return (
    <TableRow>
      <TableCell className="text-sm">{label}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{route}</TableCell>
      <TableCell className="text-xs text-muted-foreground">No image set</TableCell>
      <TableCell>—</TableCell>
      <TableCell>—</TableCell>
    </TableRow>
  );

  return (
    <TableRow>
      <TableCell className="text-sm">{label}</TableCell>
      <TableCell className="font-mono text-xs">{ogImage}</TableCell>
      <TableCell><FileStatus path={ogImage} /></TableCell>
      <TableCell>
        <img src={ogImage} alt="" className="w-20 h-10 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      </TableCell>
    </TableRow>
  );
}

export function FaviconsTab() {
  const { data: pages = [] } = useQuery({
    queryKey: ["seo-admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_pages").select("route, page_label, og_image").order("route");
      if (error) throw error;
      return data;
    },
  });

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
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">OG Images</h3>
        <p className="text-xs text-muted-foreground">OG images must be 1200×630px JPG/PNG. Place in /public/ folder.</p>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>OG Image Path</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((p) => (
                <OgImageRow key={p.route} route={p.route} label={p.page_label} ogImage={p.og_image} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
