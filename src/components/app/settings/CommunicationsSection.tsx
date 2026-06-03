import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Mail, Users } from "lucide-react";
import { TemplateEditor } from "./TemplateEditor";
import { countTags } from "./templateTags";
import { toast } from "sonner";
import { format } from "date-fns";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string;
  updated_at: string;
}

interface SentEmail {
  id: string;
  subject: string;
  to_addresses: any;
  is_broadcast: boolean;
  status: string;
  sent_at: string;
  sent_by: string | null;
}

export function CommunicationsSection() {
  const { workspaceId } = useWorkspace();
  const [tab, setTab] = useState("templates");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communications</CardTitle>
        <CardDescription>Manage email templates and review broadcast history.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="templates"><Mail className="h-4 w-4 mr-2" />Templates</TabsTrigger>
            <TabsTrigger value="broadcasts"><Users className="h-4 w-4 mr-2" />Broadcast History</TabsTrigger>
          </TabsList>
          <TabsContent value="templates" className="mt-4">
            {workspaceId && <TemplatesPanel workspaceId={workspaceId} />}
          </TabsContent>
          <TabsContent value="broadcasts" className="mt-4">
            {workspaceId && <BroadcastsPanel workspaceId={workspaceId} />}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TemplatesPanel({ workspaceId }: { workspaceId: string }) {
  const [items, setItems] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("name");
    if (error) toast.error(error.message);
    setItems((data ?? []) as EmailTemplate[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [workspaceId]);

  const onNew = () => {
    setEditing({ id: "", name: "", subject: "", body_html: "", body_text: "", updated_at: "" });
    setOpen(true);
  };

  const onEdit = (t: EmailTemplate) => {
    setEditing(t);
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    const { error } = await supabase.from("email_templates").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Template deleted");
    load();
  };

  const onSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast.error("Name required");
    const payload = {
      workspace_id: workspaceId,
      name: editing.name.trim(),
      subject: editing.subject,
      body_html: editing.body_html ?? "",
      body_text: editing.body_text ?? "",
    };
    const res = editing.id
      ? await supabase.from("email_templates").update(payload).eq("id", editing.id)
      : await supabase.from("email_templates").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Template saved");
    setOpen(false);
    setEditing(null);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onNew} size="sm"><Plus className="h-4 w-4 mr-2" />New template</Button>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No templates yet. Create your first one.</p>
      ) : (
        <div className="border border-border rounded-md divide-y divide-border">
          {items.map((t) => {
            const tagCount = countTags(`${t.subject ?? ""} ${t.body_html ?? ""}`);
            return (
              <div key={t.id} className="p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate flex items-center gap-2">
                    {t.name}
                    {tagCount > 0 && (
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {tagCount} tag{tagCount === 1 ? "" : "s"}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{t.subject || "—"}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit template" : "New template"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={editing.subject} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} />
              </div>
              <div>
                <Label>Body</Label>
                <TemplateEditor
                  html={editing.body_html ?? ""}
                  text={editing.body_text ?? ""}
                  onChange={({ html, text }) =>
                    setEditing({ ...editing, body_html: html, body_text: text })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BroadcastsPanel({ workspaceId }: { workspaceId: string }) {
  const [items, setItems] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("sent_emails")
        .select("id, subject, to_addresses, is_broadcast, status, sent_at, sent_by")
        .eq("workspace_id", workspaceId)
        .eq("is_broadcast", true)
        .order("sent_at", { ascending: false })
        .limit(100);
      if (error) toast.error(error.message);
      setItems((data ?? []) as SentEmail[]);
      setLoading(false);
    })();
  }, [workspaceId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (items.length === 0) return <p className="text-sm text-muted-foreground">No broadcasts sent yet.</p>;

  return (
    <div className="border border-border rounded-md divide-y divide-border">
      {items.map((e) => {
        const recipients = Array.isArray(e.to_addresses) ? e.to_addresses.length : 0;
        return (
          <div key={e.id} className="p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{e.subject}</div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(e.sent_at), "PPp")} · {recipients} recipient{recipients === 1 ? "" : "s"}
              </div>
            </div>
            <Badge variant={e.status === "sent" ? "default" : "destructive"}>{e.status}</Badge>
          </div>
        );
      })}
    </div>
  );
}

export default CommunicationsSection;
