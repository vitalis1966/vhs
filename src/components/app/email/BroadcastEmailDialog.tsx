import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Bold, Italic, Heading1, Heading2, List, ListOrdered, Link as LinkIcon,
  ChevronDown, ChevronRight, Loader2, Users,
} from "lucide-react";
import { toast } from "sonner";

type ClientRow = {
  id: string; name: string; status: string | null; industry: string | null;
  account_owner_id: string | null;
};
type Contact = { client_id: string; email: string | null; is_primary: boolean };
type Tag = { id: string; name: string; category: string };
type Owner = { id: string; full_name: string | null; email: string | null };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSent?: () => void;
}

export function BroadcastEmailDialog({ open, onOpenChange, onSent }: Props) {
  const { workspaceId, userId } = useWorkspace();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [taggings, setTaggings] = useState<Array<{ tag_id: string; taggable_id: string }>>([]);
  const [owners, setOwners] = useState<Owner[]>([]);

  const [audienceAllActive, setAudienceAllActive] = useState(false);
  const [industriesSel, setIndustriesSel] = useState<Set<string>>(new Set());
  const [tagsSel, setTagsSel] = useState<Set<string>>(new Set());
  const [ownerSel, setOwnerSel] = useState<string>("");
  const [manualText, setManualText] = useState("");

  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showRecipients, setShowRecipients] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: "<p></p>",
    editorProps: {
      attributes: { class: "prose prose-sm max-w-none min-h-[180px] focus:outline-none px-3 py-3" },
    },
  });

  useEffect(() => {
    if (!open) return;
    setAudienceAllActive(false); setIndustriesSel(new Set()); setTagsSel(new Set());
    setOwnerSel(""); setManualText(""); setSubject("");
    editor?.commands.setContent("<p></p>");
  }, [open, editor]);

  useEffect(() => {
    if (!open || !workspaceId) return;
    (async () => {
      const [{ data: cs }, { data: cts }, { data: tg }, { data: tggs }, { data: members }] = await Promise.all([
        (supabase as any).from("clients").select("id, name, status, industry, account_owner_id").eq("workspace_id", workspaceId),
        (supabase as any).from("contacts").select("client_id, email, is_primary"),
        (supabase as any).from("tags").select("id, name, category").eq("workspace_id", workspaceId).eq("category", "service_line"),
        (supabase as any).from("taggings").select("tag_id, taggable_id").eq("taggable_type", "client"),
        (supabase as any).from("workspace_members").select("user_id").eq("workspace_id", workspaceId).eq("status", "active"),
      ]);
      setClients(cs ?? []);
      setContacts(cts ?? []);
      setTags(tg ?? []);
      setTaggings(tggs ?? []);
      const userIds = (members ?? []).map((m: any) => m.user_id).filter(Boolean);
      if (userIds.length) {
        const { data: profs } = await (supabase as any).from("profiles").select("id, full_name, email").in("id", userIds);
        setOwners((profs ?? []).map((p: any) => ({ id: p.id, full_name: p.full_name, email: p.email })));
      } else {
        setOwners([]);
      }
    })();
  }, [open, workspaceId]);

  const industries = useMemo(
    () => Array.from(new Set(clients.map((c) => c.industry).filter(Boolean))) as string[],
    [clients],
  );

  const resolvedEmails = useMemo(() => {
    const out = new Set<string>();
    const matchedClientIds = new Set<string>();

    if (audienceAllActive) {
      clients.filter((c) => c.status === "Active").forEach((c) => matchedClientIds.add(c.id));
    }
    if (industriesSel.size) {
      clients.filter((c) => c.industry && industriesSel.has(c.industry)).forEach((c) => matchedClientIds.add(c.id));
    }
    if (tagsSel.size) {
      const cIds = new Set(taggings.filter((t) => tagsSel.has(t.tag_id)).map((t) => t.taggable_id));
      clients.filter((c) => cIds.has(c.id)).forEach((c) => matchedClientIds.add(c.id));
    }
    if (ownerSel) {
      clients.filter((c) => c.account_owner_id === ownerSel).forEach((c) => matchedClientIds.add(c.id));
    }

    contacts
      .filter((ct) => ct.is_primary && ct.email && matchedClientIds.has(ct.client_id))
      .forEach((ct) => out.add(ct.email!.trim()));

    manualText.split(/[\s,;]+/).map((s) => s.trim()).filter((s) => /@/.test(s)).forEach((e) => out.add(e));

    return Array.from(out);
  }, [audienceAllActive, industriesSel, tagsSel, ownerSel, manualText, clients, contacts, taggings]);

  const audienceDescription = (): string => {
    const parts: string[] = [];
    if (audienceAllActive) parts.push("All active clients");
    if (industriesSel.size) parts.push(`Industries: ${Array.from(industriesSel).join(", ")}`);
    if (tagsSel.size) {
      const names = tags.filter((t) => tagsSel.has(t.id)).map((t) => t.name);
      parts.push(`Tags: ${names.join(", ")}`);
    }
    if (ownerSel) {
      const o = owners.find((x) => x.id === ownerSel);
      parts.push(`Owner: ${o?.full_name ?? o?.email ?? "?"}`);
    }
    if (manualText.trim()) parts.push("Manual list");
    return parts.join(" + ") || "None";
  };

  const doSend = async () => {
    if (!workspaceId) return;
    if (!subject.trim()) { toast.error("Subject required"); return; }
    if (!resolvedEmails.length) { toast.error("No recipients"); return; }
    setSending(true);
    setConfirmOpen(false);
    try {
      const html = editor?.getHTML() ?? "";
      const text = editor?.getText() ?? "";
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          workspace_id: workspaceId,
          subject,
          body_html: html,
          body_text: text,
          to: resolvedEmails,
          is_broadcast: true,
          sent_by: userId,
        },
      });
      if (error) throw error;
      toast.success(`Broadcast sent: ${data?.succeeded ?? 0}/${data?.total ?? resolvedEmails.length}`);
      onSent?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Broadcast failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Broadcast Email</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2 border rounded-md p-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Audience</Label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={audienceAllActive} onCheckedChange={(c) => setAudienceAllActive(!!c)} />
                All active clients
              </label>

              <div>
                <div className="text-xs text-muted-foreground mb-1">By industry</div>
                <div className="flex flex-wrap gap-1.5">
                  {industries.length === 0 && <span className="text-xs text-muted-foreground">No industries.</span>}
                  {industries.map((i) => (
                    <Badge
                      key={i}
                      variant={industriesSel.has(i) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const n = new Set(industriesSel);
                        n.has(i) ? n.delete(i) : n.add(i);
                        setIndustriesSel(n);
                      }}
                    >{i}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">By service line tag</div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.length === 0 && <span className="text-xs text-muted-foreground">No service-line tags.</span>}
                  {tags.map((t) => (
                    <Badge
                      key={t.id}
                      variant={tagsSel.has(t.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const n = new Set(tagsSel);
                        n.has(t.id) ? n.delete(t.id) : n.add(t.id);
                        setTagsSel(n);
                      }}
                    >{t.name}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">By account owner</div>
                <select
                  value={ownerSel} onChange={(e) => setOwnerSel(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">— Any —</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.full_name ?? o.email}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">Manual list (comma, semicolon, or newline separated)</div>
                <Textarea
                  value={manualText} onChange={(e) => setManualText(e.target.value)}
                  rows={2} placeholder="alice@example.com, bob@example.com"
                />
              </div>
            </div>

            <Collapsible open={showRecipients} onOpenChange={setShowRecipients}>
              <CollapsibleTrigger asChild>
                <button type="button" className="flex items-center gap-1.5 text-sm font-medium">
                  {showRecipients ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  {resolvedEmails.length} recipient{resolvedEmails.length === 1 ? "" : "s"} resolved
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="text-xs bg-muted/40 rounded-md p-2 max-h-40 overflow-y-auto font-mono">
                  {resolvedEmails.length === 0 ? "—" : resolvedEmails.join(", ")}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />

            <RichToolbar editor={editor} />
            <div className="border border-border rounded-md bg-card -mt-2">
              <EditorContent editor={editor} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>Cancel</Button>
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={sending || resolvedEmails.length === 0}
            >
              {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Send to {resolvedEmails.length} recipient{resolvedEmails.length === 1 ? "" : "s"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send broadcast to {resolvedEmails.length} recipients?</AlertDialogTitle>
            <AlertDialogDescription>
              Audience: <strong>{audienceDescription()}</strong>. Each recipient receives an individual email and won't see other addresses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doSend}>Send</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function RichToolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  const btn = (active: boolean, onClick: () => void, Icon: any, label: string) => (
    <Button type="button" size="sm" variant={active ? "secondary" : "ghost"} className="h-7 w-7 p-0" onClick={onClick} title={label}>
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );
  return (
    <div className="flex flex-wrap items-center gap-0.5 border border-border border-b-0 rounded-t-md px-2 py-1 bg-muted/30">
      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), Bold, "Bold")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), Italic, "Italic")}
      <div className="w-px h-5 bg-border mx-1" />
      {btn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), Heading1, "H1")}
      {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), Heading2, "H2")}
      <div className="w-px h-5 bg-border mx-1" />
      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), List, "Bullets")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), ListOrdered, "Numbered")}
      <div className="w-px h-5 bg-border mx-1" />
      {btn(editor.isActive("link"), () => {
        const url = window.prompt("Link URL");
        if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        else editor.chain().focus().unsetLink().run();
      }, LinkIcon, "Link")}
    </div>
  );
}
