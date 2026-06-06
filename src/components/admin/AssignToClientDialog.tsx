import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ClientRow = { id: string; name: string; industry: string | null; status: string | null };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceType: "assessment" | "submission";
  sourceId: string;
  onAssigned?: () => void;
}

export function AssignToClientDialog({ open, onOpenChange, sourceType, sourceId, onAssigned }: Props) {
  const { toast } = useToast();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    setSearch("");
    setLoading(true);
    (async () => {
      const { data } = await (supabase as any)
        .from("clients")
        .select("id, name, industry, status")
        .order("name", { ascending: true });
      setClients((data ?? []) as ClientRow[]);
      setLoading(false);
    })();
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.industry ?? "").toLowerCase().includes(q) ||
        (c.status ?? "").toLowerCase().includes(q),
    );
  }, [clients, search]);

  const handleConfirm = async () => {
    if (!selectedId) return;
    setSaving(true);
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes?.user?.id ?? null;
    const { error } = await (supabase as any).from("client_submission_assignments").insert({
      client_id: selectedId,
      source_type: sourceType,
      source_id: sourceId,
      assigned_by: "manual",
      assigned_by_user_id: uid,
    });
    setSaving(false);
    if (error) {
      if (String(error.message || "").toLowerCase().includes("duplicate")) {
        toast({ title: "Already assigned to this client" });
      } else {
        toast({ title: "Assign failed", description: error.message, variant: "destructive" });
      }
      return;
    }
    toast({ title: "Assigned to client" });
    onAssigned?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign to Client</DialogTitle>
          <DialogDescription>
            Link this {sourceType === "assessment" ? "submission" : "document"} to a Vitalis OS client.
            The source record is not moved or modified.
          </DialogDescription>
        </DialogHeader>

        <Input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients by name, industry, or status…"
          className="mb-3"
        />

        <div className="border rounded-md max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No clients found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 w-10"></th>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">Industry</th>
                  <th className="text-left px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const selected = selectedId === c.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`border-t cursor-pointer ${selected ? "bg-primary/10" : "hover:bg-muted/30"}`}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="radio"
                          name="assign-client"
                          checked={selected}
                          onChange={() => setSelectedId(c.id)}
                          aria-label={`Select ${c.name}`}
                        />
                      </td>
                      <td className="px-3 py-2 font-medium">{c.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{c.industry ?? "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{c.status ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId || saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
