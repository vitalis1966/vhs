import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function RedirectsTab() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newType, setNewType] = useState("301");
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
      const { error } = await supabase.from("seo_redirects").insert({
        from_path: newFrom,
        to_path: newTo,
        redirect_type: parseInt(newType),
        note: newNote || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-redirects"] });
      setShowAdd(false);
      setNewFrom("");
      setNewTo("");
      setNewNote("");
      toast({ title: "✓ Redirect added" });
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
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 text-sm flex gap-2">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>Redirects defined here are stored in the database. The RedirectHandler component reads this table on app init and handles them via React Router navigation. For true server-side 301 redirects, configure your hosting provider's _redirects file and use this as a reference source.</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{redirects.length} redirect{redirects.length !== 1 ? "s" : ""} configured</p>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-3 w-3 mr-1" />Add Redirect</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Redirect</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>From Path</Label>
                <Input value={newFrom} onChange={(e) => setNewFrom(e.target.value)} placeholder="/old-page" />
                {newFrom && !newFrom.startsWith("/") && <p className="text-xs text-red-500 mt-1">Must start with /</p>}
              </div>
              <div>
                <Label>To Path</Label>
                <Input value={newTo} onChange={(e) => setNewTo(e.target.value)} placeholder="/new-page or https://..." />
                {newTo && !newTo.startsWith("/") && !newTo.startsWith("http") && <p className="text-xs text-red-500 mt-1">Must start with / or be a full URL</p>}
              </div>
              <div>
                <Label>Type</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">301 Permanent</SelectItem>
                    <SelectItem value="302">302 Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Note (optional)</Label>
                <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Reason for this redirect" />
              </div>
              <Button onClick={() => addMutation.mutate()} disabled={!newFrom || !newTo || !newFrom.startsWith("/") || addMutation.isPending}>
                Add Redirect
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {redirects.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm text-muted-foreground">{r.from_path}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono text-sm font-semibold">{r.to_path}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{r.redirect_type}</Badge>
                  {!r.is_active && <Badge variant="outline" className="text-xs text-gray-500">Inactive</Badge>}
                  {r.note && <span className="text-xs text-muted-foreground">{r.note}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Switch checked={r.is_active ?? true} onCheckedChange={(v) => toggleMutation.mutate({ id: r.id, is_active: v })} />
                <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this redirect?")) deleteMutation.mutate(r.id); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {redirects.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">No redirects configured. Click "Add Redirect" to create one.</p>
        )}
      </div>
    </div>
  );
}
