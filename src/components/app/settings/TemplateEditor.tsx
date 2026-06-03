import { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
} from "lucide-react";
import { toast } from "sonner";

type Mode = "plain" | "rich" | "html";

interface Props {
  html: string;
  text: string;
  onChange: (next: { html: string; text: string }) => void;
}

// Convert HTML → plain text (preserve line breaks).
function htmlToPlain(html: string): string {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n");
  return (tmp.textContent || tmp.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
}

// Convert plain text → HTML (paragraphs from blank-line groups, <br> for single newlines).
function plainToHtml(text: string): string {
  if (!text.trim()) return "";
  return text
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br />").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join("");
}

export function TemplateEditor({ html, text, onChange }: Props) {
  const [mode, setMode] = useState<Mode>("rich");
  const [htmlSource, setHtmlSource] = useState(html);
  const [plainSource, setPlainSource] = useState(text || htmlToPlain(html));
  const skipNextEditorSync = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
    ],
    content: html || "<p></p>",
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
      const nextHtml = editor.getHTML();
      setHtmlSource(nextHtml);
      const nextText = htmlToPlain(nextHtml);
      setPlainSource(nextText);
      onChange({ html: nextHtml, text: nextText });
    },
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  const switchMode = (next: Mode) => {
    if (!next || next === mode) return;

    if (next === "plain") {
      // Coming from rich/html — warn that formatting is lost.
      const sourceHtml = mode === "rich" ? editor?.getHTML() ?? htmlSource : htmlSource;
      const hasFormatting = /<\/?(strong|em|b|i|h[1-6]|ul|ol|li|a|br|p)[\s>]/i.test(sourceHtml);
      if (hasFormatting) {
        const ok = window.confirm(
          "Switching to Plain Text will strip all formatting (bold, links, lists, headings). Continue?",
        );
        if (!ok) return;
      }
      const stripped = htmlToPlain(sourceHtml);
      setPlainSource(stripped);
      // Persist a plain HTML version (paragraphs) so saved html stays consistent.
      const asHtml = plainToHtml(stripped);
      setHtmlSource(asHtml);
      onChange({ html: asHtml, text: stripped });
      setMode("plain");
      return;
    }

    if (next === "rich") {
      let sourceHtml = htmlSource;
      if (mode === "plain") sourceHtml = plainToHtml(plainSource);
      if (mode === "html") sourceHtml = htmlSource;
      skipNextEditorSync.current = true;
      editor?.commands.setContent(sourceHtml || "<p></p>");
      const finalHtml = editor?.getHTML() ?? sourceHtml;
      setHtmlSource(finalHtml);
      const t = htmlToPlain(finalHtml);
      setPlainSource(t);
      onChange({ html: finalHtml, text: t });
      setMode("rich");
      return;
    }

    if (next === "html") {
      const sourceHtml = mode === "rich" ? editor?.getHTML() ?? htmlSource : (mode === "plain" ? plainToHtml(plainSource) : htmlSource);
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
    setHtmlSource(v);
    onChange({ html: v, text: htmlToPlain(v) });
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
      // Validate
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

  return (
    <div className="space-y-2">
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
      </div>

      {mode === "plain" && (
        <Textarea
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
            rows={12}
            value={htmlSource}
            onChange={(e) => onHtmlChange(e.target.value)}
            placeholder="<p>Your HTML…</p>"
            className="font-mono text-xs"
            spellCheck={false}
          />
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Preview</div>
            <div
              className="border border-border rounded-md bg-background p-3 prose prose-sm max-w-none min-h-[120px]"
              dangerouslySetInnerHTML={{ __html: htmlSource || "<p class='text-muted-foreground'>Nothing to preview</p>" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateEditor;
