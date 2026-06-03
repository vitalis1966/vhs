import { useEffect, useState, useRef, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Tag as TagIcon,
  ChevronDown,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { TagPill } from "./TagPillNode";
import {
  TAG_CATEGORIES,
  TAG_LABELS,
  buildContext,
  substitute,
  type RawContactRow,
  type TagContext,
} from "./templateTags";

type Mode = "plain" | "rich" | "html";

interface Props {
  html: string;
  text: string;
  onChange: (next: { html: string; text: string }) => void;
}

// Detect "raw HTML" content that the rich editor would mangle:
// full documents, tables, style attributes, <style> blocks, divs, spans
// with attrs, etc. If detected we default to HTML mode so we don't lose
// inline styles/layout on round-trip through TipTap.
function isRichHtmlContent(html: string): boolean {
  if (!html) return false;
  // Markers that StarterKit doesn't preserve
  return /<!doctype|<html[\s>]|<head[\s>]|<body[\s>]|<style[\s>]|<table[\s>]|<tr[\s>]|<td[\s>]|<th[\s>]|<div[\s>]|<span[\s>]|<img[\s>]|style\s*=\s*["']/i.test(
    html,
  );
}

// HTML → plain text (preserves line breaks).
function htmlToPlain(html: string): string {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n");
  return (tmp.textContent || tmp.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
}

// Plain text → HTML.
function plainToHtml(text: string): string {
  if (!text.trim()) return "";
  return text
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p>${para
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

// Insert text into a textarea at the cursor, preserving selection.
function insertAtCursor(el: HTMLTextAreaElement, snippet: string, onCommit: (v: string) => void) {
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  const next = el.value.slice(0, start) + snippet + el.value.slice(end);
  onCommit(next);
  requestAnimationFrame(() => {
    el.focus();
    const pos = start + snippet.length;
    el.setSelectionRange(pos, pos);
  });
}

interface ContactOption {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  client_name: string | null;
  raw: RawContactRow;
}

export function TemplateEditor({ html, text, onChange }: Props) {
  const { workspaceId } = useWorkspace();
  // Auto-detect HTML mode for content with inline styles / tables / full docs.
  const initialMode: Mode = useMemo(() => (isRichHtmlContent(html) ? "html" : "rich"), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [mode, setMode] = useState<Mode>(initialMode);
  const [htmlSource, setHtmlSource] = useState(html);
  const [plainSource, setPlainSource] = useState(text || htmlToPlain(html));
  const skipNextEditorSync = useRef(false);
  // True until the user has actively edited the rich editor in this session.
  // While true, the canonical HTML is `htmlSource` (the raw value the user
  // saved last time), not whatever TipTap parses on mount.
  const richDirty = useRef(false);
  const plainRef = useRef<HTMLTextAreaElement>(null);
  const htmlRef = useRef<HTMLTextAreaElement>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      TagPill,
    ],
    // Don't preload raw-HTML content into TipTap — it would silently strip
    // inline styles / tables. The rich editor only seeds itself when the user
    // explicitly switches to Rich mode.
    content: initialMode === "rich" ? html || "<p></p>" : "<p></p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[240px] focus:outline-none px-3 py-3",
      },
    },
    onUpdate({ editor }) {
      if (skipNextEditorSync.current) {
        skipNextEditorSync.current = false;
        return;
      }
      richDirty.current = true;
      const nextHtml = editor.getHTML();
      setHtmlSource(nextHtml);
      const nextText = htmlToPlain(nextHtml);
      setPlainSource(nextText);
      onChange({ html: nextHtml, text: nextText });
    },
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  useEffect(() => {
    if (!workspaceId || !previewOpen || contacts.length > 0) return;
    (async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select(
          "id,name,email,phone,clients!inner(name,industry,start_date,workspace_id,account_owner_id)",
        )
        .eq("clients.workspace_id", workspaceId)
        .order("name")
        .limit(100);
      if (error) {
        toast.error(error.message);
        return;
      }
      const rows = (data ?? []) as Array<{
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        clients: {
          name: string | null;
          industry: string | null;
          start_date: string | null;
          account_owner_id: string | null;
        } | null;
      }>;

      const ownerIds = Array.from(
        new Set(rows.map((r) => r.clients?.account_owner_id).filter(Boolean) as string[]),
      );
      const ownerMap: Record<string, string> = {};
      if (ownerIds.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id,full_name")
          .in("id", ownerIds);
        (profs ?? []).forEach((p: { id: string; full_name: string | null }) => {
          if (p.full_name) ownerMap[p.id] = p.full_name;
        });
      }

      setContacts(
        rows.map((r) => ({
          id: r.id,
          name: r.name ?? "Unnamed contact",
          email: r.email,
          phone: r.phone,
          client_name: r.clients?.name ?? null,
          raw: {
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            client: r.clients
              ? {
                  name: r.clients.name,
                  industry: r.clients.industry,
                  start_date: r.clients.start_date,
                  account_owner_full_name: r.clients.account_owner_id
                    ? ownerMap[r.clients.account_owner_id] ?? ""
                    : "",
                }
              : null,
          },
        })),
      );
    })();
  }, [workspaceId, previewOpen, contacts.length]);

  const previewCtx: TagContext = useMemo(() => {
    const c = contacts.find((x) => x.id === selectedContactId);
    return buildContext(c?.raw);
  }, [contacts, selectedContactId]);

  const previewedHtml = useMemo(() => substitute(htmlSource, previewCtx), [htmlSource, previewCtx]);

  const switchMode = (next: Mode) => {
    if (!next || next === mode) return;

    if (next === "plain") {
      const sourceHtml =
        mode === "rich" && richDirty.current ? editor?.getHTML() ?? htmlSource : htmlSource;
      const hasFormatting = /<\/?(strong|em|b|i|h[1-6]|ul|ol|li|a|br|p|div|span|table|tr|td)[\s>]/i.test(
        sourceHtml,
      );
      if (hasFormatting) {
        const ok = window.confirm(
          "Switching to Plain Text will strip all formatting (bold, links, lists, headings). Continue?",
        );
        if (!ok) return;
      }
      const stripped = htmlToPlain(sourceHtml);
      setPlainSource(stripped);
      const asHtml = plainToHtml(stripped);
      setHtmlSource(asHtml);
      onChange({ html: asHtml, text: stripped });
      // Reset rich editor to match new plain content next time we enter rich.
      skipNextEditorSync.current = true;
      editor?.commands.setContent(asHtml || "<p></p>");
      richDirty.current = false;
      setMode("plain");
      return;
    }

    if (next === "rich") {
      // Warn before letting TipTap mangle inline styles / tables / full docs.
      if (mode === "html" && isRichHtmlContent(htmlSource)) {
        const ok = window.confirm(
          "Switching to Rich Text may strip inline styles, tables and other custom HTML that the visual editor doesn't support. Continue?",
        );
        if (!ok) return;
      }
      let sourceHtml = htmlSource;
      if (mode === "plain") sourceHtml = plainToHtml(plainSource);
      skipNextEditorSync.current = true;
      editor?.commands.setContent(sourceHtml || "<p></p>");
      const finalHtml = editor?.getHTML() ?? sourceHtml;
      setHtmlSource(finalHtml);
      const t = htmlToPlain(finalHtml);
      setPlainSource(t);
      onChange({ html: finalHtml, text: t });
      richDirty.current = false;
      setMode("rich");
      return;
    }

    if (next === "html") {
      // Raw HTML mode: prefer the canonical raw source over TipTap's reserialized
      // version unless the user actually edited the rich editor this session.
      const sourceHtml =
        mode === "rich"
          ? richDirty.current
            ? editor?.getHTML() ?? htmlSource
            : htmlSource
          : mode === "plain"
          ? plainToHtml(plainSource)
          : htmlSource;
      setHtmlSource(sourceHtml);
      onChange({ html: sourceHtml, text: htmlToPlain(sourceHtml) });
      setMode("html");
    }
  };

  const onPlainChange = (v: string) => {
    setPlainSource(v);
    const asHtml = plainToHtml(v);
    setHtmlSource(asHtml);
    onChange({ html: asHtml, text: v });
  };

  const onHtmlChange = (v: string) => {
    // HTML mode is authoritative: store the raw string verbatim, with
    // a tag-stripped plain text fallback. No sanitization.
    setHtmlSource(v);
    onChange({ html: v, text: htmlToPlain(v) });
  };

  const insertTag = (tagKey: string) => {
    if (mode === "rich" && editor) {
      editor
        .chain()
        .focus()
        .insertContent({ type: "tagPill", attrs: { tag: tagKey } })
        .run();
      return;
    }
    const snippet = `{{${tagKey}}}`;
    if (mode === "plain" && plainRef.current) {
      insertAtCursor(plainRef.current, snippet, onPlainChange);
      return;
    }
    if (mode === "html" && htmlRef.current) {
      insertAtCursor(htmlRef.current, snippet, onHtmlChange);
      return;
    }
    if (mode === "plain") onPlainChange((plainSource ? plainSource + " " : "") + snippet);
    else if (mode === "html") onHtmlChange((htmlSource ? htmlSource + " " : "") + snippet);
  };

  const addLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    try {
      new URL(url);
    } catch {
      toast.error("Invalid URL");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const tBtn = (active: boolean, onClick: () => void, icon: React.ReactNode, label: string) => (
    <Button
      type="button"
      size="sm"
      variant={active ? "secondary" : "ghost"}
      className="h-8 w-8 p-0"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon}
    </Button>
  );

  const insertTagDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="h-8 gap-1">
          <TagIcon className="h-3.5 w-3.5" />
          Insert tag
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[60vh] overflow-y-auto w-64">
        {TAG_CATEGORIES.map((cat, idx) => (
          <div key={cat.name}>
            {idx > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {cat.name}
            </DropdownMenuLabel>
            {cat.tags.map((t) => (
              <DropdownMenuItem
                key={t.key}
                onSelect={(e) => {
                  e.preventDefault();
                  insertTag(t.key);
                }}
                className="flex flex-col items-start gap-0.5 py-1.5"
              >
                <span className="text-sm font-medium">{t.label}</span>
                <span className="text-[11px] text-muted-foreground font-mono">{`{{${t.key}}}`}</span>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => switchMode(v as Mode)}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="plain">Plain text</ToggleGroupItem>
          <ToggleGroupItem value="rich">Rich text</ToggleGroupItem>
          <ToggleGroupItem value="html">HTML</ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center gap-2">
          {insertTagDropdown}
          <Button
            type="button"
            size="sm"
            variant={previewOpen ? "secondary" : "outline"}
            className="h-8 gap-1"
            onClick={() => setPreviewOpen((v) => !v)}
          >
            <Eye className="h-3.5 w-3.5" />
            {previewOpen ? "Hide preview" : "Preview"}
          </Button>
        </div>
      </div>

      {mode === "plain" && (
        <Textarea
          ref={plainRef}
          rows={14}
          value={plainSource}
          onChange={(e) => onPlainChange(e.target.value)}
          placeholder="Type your message…"
          className="font-sans"
        />
      )}

      {mode === "rich" && editor && (
        <div className="border border-input rounded-md bg-background">
          <div className="flex items-center gap-1 border-b border-border px-2 py-1 flex-wrap">
            {tBtn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold className="h-3.5 w-3.5" />, "Bold")}
            {tBtn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-3.5 w-3.5" />, "Italic")}
            <div className="w-px h-5 bg-border mx-1" />
            {tBtn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 className="h-3.5 w-3.5" />, "H1")}
            {tBtn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-3.5 w-3.5" />, "H2")}
            {tBtn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="h-3.5 w-3.5" />, "H3")}
            <div className="w-px h-5 bg-border mx-1" />
            {tBtn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="h-3.5 w-3.5" />, "Bullet list")}
            {tBtn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-3.5 w-3.5" />, "Numbered list")}
            <div className="w-px h-5 bg-border mx-1" />
            {tBtn(editor.isActive("link"), addLink, <LinkIcon className="h-3.5 w-3.5" />, "Add / edit link")}
            {tBtn(false, () => editor.chain().focus().unsetLink().run(), <Unlink className="h-3.5 w-3.5" />, "Remove link")}
          </div>
          <EditorContent editor={editor} />
        </div>
      )}

      {mode === "html" && (
        <div className="space-y-2">
          <Textarea
            ref={htmlRef}
            rows={12}
            value={htmlSource}
            onChange={(e) => onHtmlChange(e.target.value)}
            placeholder="<p>Your HTML…</p>"
            className="font-mono text-xs"
            spellCheck={false}
          />
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Source preview</div>
            <div
              className="border border-border rounded-md bg-background p-3 prose prose-sm max-w-none min-h-[120px]"
              dangerouslySetInnerHTML={{
                __html: htmlSource || "<p class='text-muted-foreground'>Nothing to preview</p>",
              }}
            />
          </div>
        </div>
      )}

      {previewOpen && (
        <div className="border border-border rounded-md bg-muted/30 p-3 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-3.5 w-3.5" />
              Live preview
            </div>
            <div className="min-w-[260px] flex-1 max-w-md">
              <Select value={selectedContactId} onValueChange={setSelectedContactId}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select a contact to preview…" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.length === 0 ? (
                    <div className="p-2 text-xs text-muted-foreground">No contacts available</div>
                  ) : (
                    contacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                        {c.client_name ? ` · ${c.client_name}` : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          {!selectedContactId && (
            <p className="text-xs text-muted-foreground">
              Choose a contact to see how tags will render. Missing values use sensible defaults
              (e.g. &quot;there&quot; for first name).
            </p>
          )}
          <div
            className="bg-background border border-border rounded-md p-4 prose prose-sm max-w-none min-h-[120px]"
            dangerouslySetInnerHTML={{
              __html: previewedHtml || "<p class='text-muted-foreground'>Nothing to preview</p>",
            }}
          />
          {selectedContactId && (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(previewCtx)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <Badge key={k} variant="secondary" className="text-[10px] font-normal">
                    <span className="text-muted-foreground mr-1">{TAG_LABELS[k] ?? k}:</span>
                    {String(v)}
                  </Badge>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TemplateEditor;
