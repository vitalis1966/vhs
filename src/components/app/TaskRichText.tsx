import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, ListChecks } from "lucide-react";

interface Props {
  valueJson: any;
  onChange: (json: any, text: string) => void;
  placeholder?: string;
}

export function TaskRichText({ valueJson, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: valueJson ?? { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[120px] focus:outline-none px-3 py-2 [&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]_li]:flex [&_ul[data-type=taskList]_li>label]:mr-2 [&_ul[data-type=taskList]_li>label_input]:mr-1",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getJSON(), editor.getText());
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean, onClick: () => void, icon: React.ReactNode, label: string) => (
    <Button
      type="button" size="sm" variant={active ? "secondary" : "ghost"}
      className="h-7 w-7 p-0" onClick={onClick} aria-label={label}
    >
      {icon}
    </Button>
  );

  return (
    <div className="border border-input rounded-md bg-background">
      <div className="flex items-center gap-1 border-b border-border px-2 py-1">
        {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold className="h-3.5 w-3.5" />, "Bold")}
        {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-3.5 w-3.5" />, "Italic")}
        {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="h-3.5 w-3.5" />, "Bullets")}
        {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-3.5 w-3.5" />, "Numbered")}
        {btn(editor.isActive("taskList"), () => editor.chain().focus().toggleTaskList().run(), <ListChecks className="h-3.5 w-3.5" />, "Checklist")}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
