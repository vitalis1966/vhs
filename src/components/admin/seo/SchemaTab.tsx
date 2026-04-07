import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export function SchemaTab() {
  const queryClient = useQueryClient();

  const { data: schemas = [] } = useQuery({
    queryKey: ["seo-admin-schemas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_schema_global").select("*").order("id");
      if (error) throw error;
      return data;
    },
  });

  const { data: pages = [] } = useQuery({
    queryKey: ["seo-admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_pages").select("id, route, page_label, schema_type, schema_json, breadcrumbs, updated_at").order("route");
      if (error) throw error;
      return data;
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [jsonStr, setJsonStr] = useState("");
  const [active, setActive] = useState(true);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async ({ id, schema_json, is_active }: { id: string; schema_json: Json; is_active: boolean }) => {
      const { error } = await supabase.from("seo_schema_global").update({ schema_json, is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-schemas"] });
      queryClient.invalidateQueries({ queryKey: ["seo-schemas-global"] });
      queryClient.invalidateQueries({ queryKey: ["seo-schema-global"] });
      setEditingId(null);
      toast({ title: "✓ Schema saved" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleJsonChange = (val: string) => {
    setJsonStr(val);
    try { JSON.parse(val); setJsonError(null); } catch (e: unknown) { setJsonError((e as Error).message); }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left — Global Schemas */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Global Schema (every page)</h3>

        {editingId ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{schemas.find((s) => s.id === editingId)?.label}</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                <Button size="sm" disabled={!!jsonError} onClick={() => {
                  try {
                    saveMutation.mutate({ id: editingId, schema_json: JSON.parse(jsonStr) as Json, is_active: active });
                  } catch { toast({ title: "Invalid JSON", variant: "destructive" }); }
                }}>
                  <Save className="h-3 w-3 mr-1" />Save
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={active} onCheckedChange={setActive} /><Label>Active</Label>
            </div>
            <Textarea value={jsonStr} onChange={(e) => handleJsonChange(e.target.value)} rows={20} className="font-mono text-xs" />
            {jsonError && <p className="text-xs text-red-500">JSON Error: {jsonError}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {schemas.map((s) => (
              <Card key={s.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{s.label}</p>
                    <p className="text-xs text-muted-foreground font-mono">ID: {s.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!s.is_active && <Badge variant="outline" className="text-xs">inactive</Badge>}
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditingId(s.id);
                      setJsonStr(JSON.stringify(s.schema_json, null, 2));
                      setActive(s.is_active !== false);
                      setJsonError(null);
                    }}>
                      <Pencil className="h-3 w-3 mr-1" />Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right — Per-Page Schema Summary */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Per-Page Schema Summary</h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Schema Type</TableHead>
                <TableHead>Custom JSON?</TableHead>
                <TableHead>Breadcrumbs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.route}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{p.schema_type || "WebPage"}</Badge></TableCell>
                  <TableCell>{p.schema_json ? "✓" : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {Array.isArray(p.breadcrumbs)
                      ? (p.breadcrumbs as Array<{ name: string }>).map((b) => b.name).join(" › ")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
