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
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold, Italic, Heading1, Heading2, List, ListOrdered, Link as LinkIcon,
  Paperclip, FileText, Loader2, X, Upload,
} from "lucide-react";
import { toast } from "sonner";

const BUCKET = "platform-documents";

type Contact = { id: string; name: string; email: string | null; is_primary: boolean };
type ClientLite = { id: string; name: string };
type DocLite = { id: string; file_name: string; storage_path?: string };
type Template = { id: string; name: string; subject: string; body_html: string; body_text: string };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Initial client context (locks selector when provided as `lockClient`) */
  clientId?: string | null;
  lockClient?: boolean;
  onSent?: () => void;
}

export function ComposeEmailDialog({ open, onOpenChange, clientId, lockClient, onSent }: Props) {
  const { workspaceId, userId, userFullName } = useWorkspace();
  const [allClients, setAllClients] = useState<ClientLite[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(clientId ?? null);
  const [toEmails, setToEmails] = useState<string[]>([]);
  const [toInput, setToInput] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [cc, setCc] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState("");
  const [bcc, setBcc] = useState<string[]>([]);
  const [bccInput, setBccInput] = useState("");
  const [subject, setSubject] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [clientDocs, setClientDocs] = useState<DocLite[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const [newUploads, setNewUploads] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [docSearch, setDocSearch] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline text-primary" } })],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[220px] focus:outline-none px-3 py-3",
      },
    },
  });

  // Reset on open
  useEffect(() => {
    if (!open) return;
    setSelectedClientId(clientId ?? null);
    setToEmails([]); setToInput("");
    setCc([]); setBcc([]); setCcInput(""); setBccInput("");
    setShowCc(false); setShowBcc(false);
    setSubject("");
    setSelectedDocIds(new Set());
    setNewUploads([]);
    editor?.commands.setContent("<p></p>");
  }, [open, clientId, editor]);

  // Load workspace clients + templates
  useEffect(() => {
    if (!open || !workspaceId) return;
    (async () => {
      const [{ data: clients }, { data: tmpls }] = await Promise.all([
        (supabase as any).from("clients").select("id, name").eq("workspace_id", workspaceId).order("name"),
        (supabase as any).from("email_templates").select("*").eq("workspace_id", workspaceId).order("name"),
      ]);
      setAllClients(clients ?? []);
      setTemplates(tmpls ?? []);
    })();
  }, [open, workspaceId]);

  // Load client-specific data when client changes
  useEffect(() => {
    if (!open || !selectedClientId) {
      setClientDocs([]);
      return;
    }
    (async () => {
      const [{ data: contacts }, { data: docs }] = await Promise.all([
        (supabase as any).from("contacts").select("id, name, email, is_primary").eq("client_id", selectedClientId),
        (supabase as any).from("platform_documents").select("id, file_name, storage_path").order("file_name"),
      ]);
      // Pre-fill TO with primary contact emails
      const primaries = (contacts ?? []).filter((c: Contact) => c.is_primary && c.email).map((c: Contact) => c.email!);
      if (primaries.length && toEmails.length === 0) {
        setToEmails(primaries);
      }
      setClientDocs(docs ?? []);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedClientId]);

  const filteredDocs = useMemo(() => {
    const q = docSearch.toLowerCase();
    return clientDocs.filter((d) => !q || d.file_name.toLowerCase().includes(q));
  }, [clientDocs, docSearch]);

  const commitChip = (raw: string, list: string[], setList: (l: string[]) => void) => {
    const v = raw.trim().replace(/[,;]+$/, "");
    if (!v) return;
    if (!list.includes(v)) setList([...list, v]);
  };

  const handleChipKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputVal: string,
    setInput: (v: string) => void,
    list: string[],
    setList: (l: string[]) => void,
  ) => {
    if (e.key === "Enter" || e.key === "," || e.key === ";" || e.key === "Tab") {
      if (inputVal.trim()) {
        e.preventDefault();
        commitChip(inputVal, list, setList);
        setInput("");
      }
    } else if (e.key === "Backspace" && !inputVal && list.length) {
      setList(list.slice(0, -1));
    }
  };

  const applyTemplate = (t: Template) => {
    setSubject(t.subject);
    if (t.body_html) editor?.commands.setContent(t.body_html);
    else editor?.commands.setContent(`<p>${t.body_text.replace(/\n/g, "<br/>")}</p>`);
  };

  const uploadNewFiles = async (): Promise<DocLite[]> => {
    if (!newUploads.length || !workspaceId) return [];
    const uploaded: DocLite[] = [];
    for (const f of newUploads) {
      const path = `${workspaceId}/${crypto.randomUUID()}-${f.name}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, f, { upsert: false });
      if (upErr) { toast.error(`Upload failed: ${f.name}`); continue; }
      const { data: doc, error } = await (supabase as any)
        .from("platform_documents")
        .insert({
          workspace_id: workspaceId,
          file_name: f.name,
          mime_type: f.type || "application/octet-stream",
          size_bytes: f.size,
          storage_path: path,
          uploaded_by: userId,
        })
        .select("id, file_name, storage_path")
        .single();
      if (error || !doc) continue;
      // Optional: link to client via attachments table
      if (selectedClientId) {
        await (supabase as any).from("attachments").insert({
          document_id: doc.id, attachable_type: "client", attachable_id: selectedClientId,
        });
      }
      uploaded.push(doc as DocLite);
    }
    return uploaded;
  };

  const send = async () => {
    // Commit any pending chip input
    if (toInput.trim()) commitChip(toInput, toEmails, setToEmails);
    if (ccInput.trim()) commitChip(ccInput, cc, setCc);
    if (bccInput.trim()) commitChip(bccInput, bcc, setBcc);
    const finalTo = toInput.trim() ? [...toEmails, toInput.trim()] : toEmails;

    if (!finalTo.length) { toast.error("Add at least one recipient"); return; }
    if (!subject.trim()) { toast.error("Subject is required"); return; }
    if (!workspaceId) return;

    setSending(true);
    try {
      const uploaded = await uploadNewFiles();
      const allAttachmentIds = [
        ...Array.from(selectedDocIds),
        ...uploaded.map((d) => d.id),
      ];
      const docsById = new Map<string, DocLite>();
      [...clientDocs, ...uploaded].forEach((d) => docsById.set(d.id, d));
      const attachmentRefs = allAttachmentIds
        .map((id) => docsById.get(id))
        .filter(Boolean)
        .map((d) => ({ id: d!.id, file_name: d!.file_name, storage_path: d!.storage_path ?? "" }));

      const html = editor?.getHTML() ?? "";
      const text = editor?.getText() ?? "";

      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          workspace_id: workspaceId,
          client_id: selectedClientId,
          subject,
          body_html: html,
          body_text: text,
          to: finalTo,
          cc: ccInput.trim() ? [...cc, ccInput.trim()] : cc,
          bcc: bccInput.trim() ? [...bcc, bccInput.trim()] : bcc,
          attachments: attachmentRefs,
          attachment_ids: allAttachmentIds,
          sent_by: userId,
          is_broadcast: false,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error("Send failed");
      toast.success(`Email sent · from ${userFullName ?? "you"}`);
      onSent?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {!lockClient && (
            <div>
              <Label className="text-xs">Client (optional)</Label>
              <select
                value={selectedClientId ?? ""}
                onChange={(e) => setSelectedClientId(e.target.value || null)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— No client —</option>
                {allClients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <ChipField
            label="To"
            chips={toEmails}
            inputValue={toInput}
            setInputValue={setToInput}
            removeChip={(i) => setToEmails(toEmails.filter((_, idx) => idx !== i))}
            onKeyDown={(e) => handleChipKey(e, toInput, setToInput, toEmails, setToEmails)}
            right={
              <div className="flex gap-1 text-xs">
                {!showCc && <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setShowCc(true)}>Cc</button>}
                {!showBcc && <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => setShowBcc(true)}>Bcc</button>}
              </div>
            }
          />
          {showCc && (
            <ChipField
              label="Cc" chips={cc} inputValue={ccInput} setInputValue={setCcInput}
              removeChip={(i) => setCc(cc.filter((_, idx) => idx !== i))}
              onKeyDown={(e) => handleChipKey(e, ccInput, setCcInput, cc, setCc)}
            />
          )}
          {showBcc && (
            <ChipField
              label="Bcc" chips={bcc} inputValue={bccInput} setInputValue={setBccInput}
              removeChip={(i) => setBcc(bcc.filter((_, idx) => idx !== i))}
              onKeyDown={(e) => handleChipKey(e, bccInput, setBccInput, bcc, setBcc)}
            />
          )}

          <div className="flex items-center gap-2">
            <Input
              value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject" className="flex-1"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm" disabled={!templates.length}>
                  <FileText className="h-4 w-4 mr-1.5" /> Templates
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-1">
                {templates.length === 0 && <p className="text-xs text-muted-foreground p-2">No templates saved.</p>}
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t)}
                    className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted"
                  >
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.subject}</div>
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <RichToolbar editor={editor} />
          <div className="border border-border rounded-md bg-card">
            <EditorContent editor={editor} />
          </div>

          <div>
            <Label className="text-xs flex items-center gap-1.5"><Paperclip className="h-3 w-3" /> Attachments</Label>
            {selectedClientId && (
              <div className="border border-border rounded-md p-2 mt-1 space-y-1">
                <Input
                  placeholder="Search client files…"
                  value={docSearch} onChange={(e) => setDocSearch(e.target.value)}
                  className="h-8 text-xs mb-1"
                />
                <div className="max-h-32 overflow-y-auto">
                  {filteredDocs.length === 0 && <p className="text-xs text-muted-foreground p-1">No files.</p>}
                  {filteredDocs.map((d) => (
                    <label key={d.id} className="flex items-center gap-2 text-sm px-1 py-1 hover:bg-muted/40 rounded cursor-pointer">
                      <Checkbox
                        checked={selectedDocIds.has(d.id)}
                        onCheckedChange={(c) => {
                          const next = new Set(selectedDocIds);
                          if (c) next.add(d.id); else next.delete(d.id);
                          setSelectedDocIds(next);
                        }}
                      />
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{d.file_name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2">
              <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                <Upload className="h-3.5 w-3.5" />
                Add new file
                <input
                  type="file" multiple className="hidden"
                  onChange={(e) => setNewUploads([...newUploads, ...Array.from(e.target.files ?? [])])}
                />
              </label>
              {newUploads.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {newUploads.map((f, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {f.name}
                      <button type="button" onClick={() => setNewUploads(newUploads.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>Cancel</Button>
          <Button onClick={send} disabled={sending}>
            {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChipField({
  label, chips, inputValue, setInputValue, onKeyDown, removeChip, right,
}: {
  label: string; chips: string[]; inputValue: string;
  setInputValue: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeChip: (i: number) => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <Label className="text-xs w-10 pt-2.5">{label}</Label>
      <div className="flex-1 min-w-0 border border-input rounded-md px-2 py-1.5 flex flex-wrap items-center gap-1 bg-background min-h-9">
        {chips.map((c, i) => (
          <Badge key={i} variant="secondary" className="gap-1">
            {c}
            <button type="button" onClick={() => removeChip(i)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={chips.length ? "" : "email@example.com"}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none"
        />
      </div>
      {right}
    </div>
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
    <div className="flex flex-wrap items-center gap-0.5 border border-border border-b-0 rounded-t-md px-2 py-1 bg-muted/30 -mb-2">
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

/** Used by AlertDialog confirmation for broadcasts */
export function BroadcastConfirmDialog({
  open, onOpenChange, count, onConfirm,
}: { open: boolean; onOpenChange: (v: boolean) => void; count: number; onConfirm: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send broadcast to {count} recipients?</AlertDialogTitle>
          <AlertDialogDescription>
            Each recipient will receive an individual email. They will not see each other's addresses.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Send {count} emails</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
