import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Code, Bell, BellOff, Send, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { initials } from "./taskUtils";

interface Member {
  id: string;
  full_name: string | null;
  email: string | null;
}
interface Comment {
  id: string;
  task_id: string;
  author_id: string;
  body_html: string;
  body_text: string;
  mentioned_user_ids: string[];
  created_at: string;
}

interface Props {
  taskId: string;
  workspaceId: string;
}

// Sanitize HTML on render: allow only b, strong, i, em, code, span[data-mention], br.
function sanitize(html: string) {
  if (typeof window === "undefined") return html;
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const ALLOWED = new Set(["B", "STRONG", "I", "EM", "CODE", "BR", "SPAN", "DIV", "P"]);
  const walk = (node: Node) => {
    const kids = Array.from(node.childNodes);
    for (const k of kids) {
      if (k.nodeType === Node.ELEMENT_NODE) {
        const el = k as HTMLElement;
        if (!ALLOWED.has(el.tagName)) {
          // unwrap unknown elements
          while (el.firstChild) node.insertBefore(el.firstChild, el);
          node.removeChild(el);
          continue;
        }
        // Strip all attrs except for span[data-mention]
        if (el.tagName === "SPAN" && el.hasAttribute("data-mention-id")) {
          const id = el.getAttribute("data-mention-id") ?? "";
          const name = el.textContent ?? "";
          el.innerHTML = "";
          el.textContent = name;
          el.className =
            "inline-flex items-center px-1 rounded bg-primary/10 text-primary font-medium";
          // Keep data attr
          el.setAttribute("data-mention-id", id);
        } else {
          for (const a of Array.from(el.attributes)) el.removeAttribute(a.name);
          walk(el);
        }
      } else if (k.nodeType !== Node.TEXT_NODE) {
        node.removeChild(k);
      }
    }
  };
  walk(tpl.content);
  return tpl.innerHTML;
}

export function TaskComments({ taskId, workspaceId }: Props) {
  const { userId } = useWorkspace();
  const [comments, setComments] = useState<Comment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Member>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [muted, setMuted] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const mentionRangeRef = useRef<{ start: number; end: number } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: cs }, { data: wm }, { data: mm }] = await Promise.all([
      (supabase as any)
        .from("task_comments")
        .select("id, task_id, author_id, body_html, body_text, mentioned_user_ids, created_at")
        .eq("task_id", taskId)
        .order("created_at", { ascending: true }),
      (supabase as any)
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", workspaceId)
        .eq("status", "active")
        .not("user_id", "is", null),
      (supabase as any).from("task_mutes").select("user_id").eq("task_id", taskId),
    ]);
    setComments((cs ?? []) as Comment[]);
    const memberIds = (wm ?? []).map((r: any) => r.user_id);
    if (memberIds.length) {
      const { data: ps } = await (supabase as any)
        .from("profiles")
        .select("id, full_name, email")
        .in("id", memberIds);
      const list = (ps ?? []) as Member[];
      setMembers(list);
      const map: Record<string, Member> = {};
      list.forEach((p) => (map[p.id] = p));
      // Add author profiles that may not be in workspace members (rare)
      const missing = (cs ?? [])
        .map((c: any) => c.author_id)
        .filter((id: string) => !map[id]);
      if (missing.length) {
        const { data: extra } = await (supabase as any)
          .from("profiles")
          .select("id, full_name, email")
          .in("id", missing);
        (extra ?? []).forEach((p: Member) => (map[p.id] = p));
      }
      setProfiles(map);
    }
    setMuted(((mm ?? []) as any[]).some((r) => r.user_id === userId));
    setLoading(false);
  }, [taskId, workspaceId, userId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel(`task-comments-${taskId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "task_comments", filter: `task_id=eq.${taskId}` },
        () => void load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [taskId, load]);

  const filteredMembers = useMemo(() => {
    if (mentionQuery == null) return [];
    const q = mentionQuery.toLowerCase().trim();
    return members
      .filter((m) => {
        const n = `${m.full_name ?? ""} ${m.email ?? ""}`.toLowerCase();
        return q ? n.includes(q) : true;
      })
      .slice(0, 6);
  }, [members, mentionQuery]);

  const handleInput = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !editorRef.current) return;
    const node = sel.anchorNode;
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      setMentionQuery(null);
      return;
    }
    const text = (node.textContent ?? "").slice(0, sel.anchorOffset);
    const m = text.match(/(^|\s)@([\w\- ]{0,30})$/);
    if (m) {
      setMentionQuery(m[2]);
      setMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  };

  const insertMention = (member: Member) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount || !editorRef.current) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return;
    const text = node.textContent ?? "";
    const before = text.slice(0, range.startOffset);
    const after = text.slice(range.startOffset);
    const m = before.match(/(^|\s)@([\w\- ]{0,30})$/);
    if (!m) return;
    const newBefore = before.slice(0, before.length - m[2].length - 1); // strip "@query"
    node.textContent = newBefore;
    // Insert mention chip
    const span = document.createElement("span");
    span.setAttribute("data-mention-id", member.id);
    span.className =
      "inline-flex items-center px-1 rounded bg-primary/10 text-primary font-medium";
    span.contentEditable = "false";
    span.textContent = `@${member.full_name ?? member.email ?? "user"}`;
    const afterNode = document.createTextNode("\u00A0" + after);
    // Place after node
    if (node.nextSibling) {
      node.parentNode!.insertBefore(span, node.nextSibling);
      node.parentNode!.insertBefore(afterNode, span.nextSibling);
    } else {
      node.parentNode!.appendChild(span);
      node.parentNode!.appendChild(afterNode);
    }
    // Move cursor after the inserted space
    const r = document.createRange();
    r.setStart(afterNode, 1);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
    setMentionQuery(null);
  };

  const exec = (cmd: "bold" | "italic" | "code") => {
    if (cmd === "code") {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      const code = document.createElement("code");
      code.className = "px-1 rounded bg-muted text-xs font-mono";
      try {
        range.surroundContents(code);
      } catch {
        // fallback
        code.textContent = sel.toString();
        range.deleteContents();
        range.insertNode(code);
      }
      sel.removeAllRanges();
    } else {
      document.execCommand(cmd, false);
    }
    editorRef.current?.focus();
  };

  const submit = async () => {
    if (!editorRef.current || !userId) return;
    const html = editorRef.current.innerHTML.trim();
    const text = editorRef.current.innerText.trim();
    if (!text) return;
    const mentioned = Array.from(
      editorRef.current.querySelectorAll("[data-mention-id]"),
    )
      .map((el) => (el as HTMLElement).getAttribute("data-mention-id")!)
      .filter(Boolean);

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("post-task-comment", {
        body: {
          task_id: taskId,
          body_html: html,
          body_text: text,
          mentioned_user_ids: Array.from(new Set(mentioned)),
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      editorRef.current.innerHTML = "";
      setMentionQuery(null);
      void load();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    const { error } = await (supabase as any).from("task_comments").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setComments((p) => p.filter((c) => c.id !== id));
  };

  const toggleMute = async () => {
    if (!userId) return;
    if (muted) {
      await (supabase as any).from("task_mutes").delete().eq("task_id", taskId).eq("user_id", userId);
      setMuted(false);
      toast.success("Notifications unmuted for this task");
    } else {
      await (supabase as any).from("task_mutes").insert({ task_id: taskId, user_id: userId });
      setMuted(true);
      toast.success("Notifications muted for this task");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 gap-1.5 text-xs"
          onClick={toggleMute}
          aria-label={muted ? "Unmute notifications" : "Mute notifications"}
        >
          {muted ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
          {muted ? "Muted" : "Notifications on"}
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No comments yet.</p>
        ) : (
          comments.map((c) => {
            const author = profiles[c.author_id];
            const mine = c.author_id === userId;
            return (
              <div key={c.id} className="flex gap-2.5 group">
                <Avatar className="h-7 w-7 mt-0.5 flex-shrink-0">
                  <AvatarFallback className="text-[10px]">
                    {initials(author?.full_name ?? author?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">
                      {author?.full_name ?? author?.email ?? "Unknown"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                    </span>
                    {mine && (
                      <button
                        type="button"
                        onClick={() => remove(c.id)}
                        className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                        aria-label="Delete comment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div
                    className="text-sm text-foreground mt-0.5 leading-relaxed break-words [&_code]:px-1 [&_code]:rounded [&_code]:bg-muted [&_code]:text-xs [&_code]:font-mono"
                    dangerouslySetInnerHTML={{ __html: sanitize(c.body_html) }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border border-input rounded-md bg-background relative">
        <div className="flex items-center gap-1 border-b border-border px-2 py-1">
          <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => exec("bold")}>
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => exec("italic")}>
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => exec("code")}>
            <Code className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[11px] text-muted-foreground ml-2">Type @ to mention</span>
          <Button
            type="button"
            size="sm"
            className="ml-auto h-7 gap-1"
            onClick={submit}
            disabled={submitting}
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Posting…" : "Comment"}
          </Button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={(e) => {
            if (mentionQuery != null && filteredMembers.length) {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setMentionIndex((i) => (i + 1) % filteredMembers.length);
                return;
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setMentionIndex((i) => (i - 1 + filteredMembers.length) % filteredMembers.length);
                return;
              }
              if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                insertMention(filteredMembers[mentionIndex]);
                return;
              }
              if (e.key === "Escape") {
                setMentionQuery(null);
                return;
              }
            }
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void submit();
            }
          }}
          className="min-h-[64px] px-3 py-2 text-sm focus:outline-none [&_code]:px-1 [&_code]:rounded [&_code]:bg-muted [&_code]:text-xs [&_code]:font-mono"
          data-placeholder="Add a comment…"
        />
        {mentionQuery != null && filteredMembers.length > 0 && (
          <div className="absolute left-3 bottom-1 translate-y-full mt-1 bg-popover border border-border rounded-md shadow-md z-50 w-64 max-h-56 overflow-y-auto">
            {filteredMembers.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(m);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm ${
                  i === mentionIndex ? "bg-muted" : "hover:bg-muted/60"
                }`}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {initials(m.full_name ?? m.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{m.full_name ?? m.email}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
