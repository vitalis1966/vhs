import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  ListChecks, Table as TableIcon, Code, Minus, Check, Loader2,
} from "lucide-react";
import { NoteTagPicker } from "./NoteTagPicker";

interface NoteRow {
  id: string; workspace_id: string; client_id: string; project_id: string | null;
  title: string | null; body: any; body_text: string | null;
}

interface Props {
  note: NoteRow;
  onBack: () => void;
  onSaved?: (n: NoteRow) => void;
}

const SLASH_COMMANDS = [
  { label: "Heading 1", icon: Heading1, run: (e: any) => e.chain().focus().deleteRange(getRange(e)).toggleHeading({ level: 1 }).run() },
  { label: "Heading 2", icon: Heading2, run: (e: any) => e.chain().focus().deleteRange(getRange(e)).toggleHeading({ level: 2 }).run() },
  { label: "Heading 3", icon: Heading3, run: (e: any) => e.chain().focus().deleteRange(getRange(e)).toggleHeading({ level: 3 }).run() },
  { label: "Bullet List", icon: List, run: (e: any) => e.chain().focus().deleteRange(getRange(e)).toggleBulletList().run() },
  { label: "Numbered List", icon: ListOrdered, run: (e: any) => e.chain().focus().deleteRange(getRange(e)).toggleOrderedList().run() },
  { label: "Task List", icon: ListChecks, run: (e: any) => e.chain().focus().deleteRange(getRange(e)).toggleTaskList().run() },
  { label: "Table", icon: TableIcon, run: (e: any) => e.chain().focus().deleteRange(getRange(e)).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { label: "Code Block", icon: Code, run: (e: any) => e.chain().focus().deleteRange(getRange(e)).toggleCodeBlock().run() },
  { label: "Divider", icon: Minus, run: (e: any) => e.chain().focus().deleteRange(getRange(e)).setHorizontalRule().run() },
];

function getRange(editor: any) {
  const { selection } = editor.state;
  // Range covering "/" + any typed query characters since slash was typed
  const startOf = (selection as any).$from;
  // We track slashPos externally; this is overwritten by caller
  return { from: startOf.pos, to: startOf.pos };
}

export function NoteEditor({ note, onBack, onSaved }: Props) {
  const { userId } = useWorkspace();
  const [title, setTitle] = useState(note.title ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<number | null>(null);
  const slashRef = useRef<{ from: number; query: string } | null>(null);
  const [slashMenu, setSlashMenu] = useState<{ top: number; left: number; query: string; index: number } | null>(null);

  const filteredCommands = useMemo(() => {
    const q = slashMenu?.query?.toLowerCase() ?? "";
    return SLASH_COMMANDS.filter((c) => !q || c.label.toLowerCase().includes(q));
  }, [slashMenu?.query]);

  const queueSave = useCallback((patch: Partial<NoteRow>) => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = window.setTimeout(async () => {
      const update: any = { ...patch, updated_by: userId, updated_at: new Date().toISOString() };
      const { error } = await (supabase as any).from("notes").update(update).eq("id", note.id);
      if (error) { setSaveState("idle"); return; }
      setSaveState("saved");
      onSaved?.({ ...note, ...patch } as NoteRow);
    }, 1000);
  }, [note, userId, onSaved]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: note.body ?? { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[400px] focus:outline-none px-4 py-4 " +
          "[&_table]:border-collapse [&_table]:w-full [&_table]:my-3 " +
          "[&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-left " +
          "[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 " +
          "[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]_li]:flex [&_ul[data-type=taskList]_li>label]:mr-2 " +
          "[&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-3 [&_pre]:text-xs [&_hr]:my-4 [&_hr]:border-border",
      },
      handleKeyDown(view, event) {
        if (slashMenu) {
          if (event.key === "ArrowDown") { event.preventDefault(); setSlashMenu((s) => s && ({ ...s, index: (s.index + 1) % filteredCommands.length })); return true; }
          if (event.key === "ArrowUp") { event.preventDefault(); setSlashMenu((s) => s && ({ ...s, index: (s.index - 1 + filteredCommands.length) % filteredCommands.length })); return true; }
          if (event.key === "Enter") {
            event.preventDefault();
            const cmd = filteredCommands[slashMenu.index];
            if (cmd && slashRef.current) {
              const to = view.state.selection.from;
              editor?.chain().focus().deleteRange({ from: slashRef.current.from, to }).run();
              cmd.run(editor);
            }
            setSlashMenu(null); slashRef.current = null;
            return true;
          }
          if (event.key === "Escape") { setSlashMenu(null); slashRef.current = null; return true; }
        }
        if (event.key === "/" && !slashMenu) {
          const sel = view.state.selection;
          const coords = view.coordsAtPos(sel.from);
          const root = view.dom.getBoundingClientRect();
          slashRef.current = { from: sel.from, query: "" };
          setTimeout(() => {
            setSlashMenu({ top: coords.bottom - root.top + 4, left: coords.left - root.left, query: "", index: 0 });
          }, 0);
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      // Update slash menu query
      if (slashRef.current) {
        const text = editor.state.doc.textBetween(slashRef.current.from, editor.state.selection.from, "\n");
        if (!text.startsWith("/")) { setSlashMenu(null); slashRef.current = null; }
        else {
          const query = text.slice(1);
          slashRef.current.query = query;
          setSlashMenu((s) => s && ({ ...s, query, index: 0 }));
        }
      }
      const json = editor.getJSON();
      const text = editor.getText();
      queueSave({ body: json, body_text: text });
    },
  });

  useEffect(() => () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); editor?.destroy(); }, [editor]);

  const onTitleChange = (v: string) => { setTitle(v); queueSave({ title: v }); };

  const btn = (active: boolean, onClick: () => void, Icon: any, label: string) => (
    <Button type="button" size="sm" variant={active ? "secondary" : "ghost"} className="h-7 w-7 p-0" onClick={onClick} title={label}>
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to notes
        </Button>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5 min-w-[80px] justify-end">
          {saveState === "saving" && (<><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>)}
          {saveState === "saved" && (<><Check className="h-3 w-3 text-green-600" /> Saved</>)}
        </div>
      </div>
      <Input
        value={title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Untitled"
        className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 shadow-none h-auto py-1 font-display"
      />
      <div className="mt-2 mb-3">
        <NoteTagPicker noteId={note.id} />
      </div>

      <div className="border border-border rounded-md bg-card relative">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1">
          {btn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), Heading1, "H1")}
          {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), Heading2, "H2")}
          {btn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), Heading3, "H3")}
          <div className="w-px h-5 bg-border mx-1" />
          {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), Bold, "Bold")}
          {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), Italic, "Italic")}
          <div className="w-px h-5 bg-border mx-1" />
          {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), List, "Bullets")}
          {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), ListOrdered, "Numbered")}
          {btn(editor.isActive("taskList"), () => editor.chain().focus().toggleTaskList().run(), ListChecks, "Checklist")}
          <div className="w-px h-5 bg-border mx-1" />
          {btn(false, () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), TableIcon, "Table")}
          {btn(editor.isActive("codeBlock"), () => editor.chain().focus().toggleCodeBlock().run(), Code, "Code Block")}
          {btn(false, () => editor.chain().focus().setHorizontalRule().run(), Minus, "Divider")}
          <span className="ml-auto text-[10px] text-muted-foreground hidden sm:inline">Type / for commands</span>
        </div>
        <EditorContent editor={editor} />
        {slashMenu && filteredCommands.length > 0 && (
          <div
            className="absolute z-50 w-56 bg-popover border border-border rounded-md shadow-md py-1"
            style={{ top: slashMenu.top, left: Math.min(slashMenu.left, 400) }}
          >
            {filteredCommands.map((c, i) => (
              <button
                key={c.label}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (slashRef.current && editor) {
                    const to = editor.state.selection.from;
                    editor.chain().focus().deleteRange({ from: slashRef.current.from, to }).run();
                    c.run(editor);
                  }
                  setSlashMenu(null); slashRef.current = null;
                }}
                className={`w-full text-left text-sm px-3 py-1.5 flex items-center gap-2 ${i === slashMenu.index ? "bg-muted" : "hover:bg-muted/60"}`}
              >
                <c.icon className="h-4 w-4 text-muted-foreground" />
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
