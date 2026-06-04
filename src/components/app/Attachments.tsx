import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload, FileText, FileSpreadsheet, FileImage, File as FileIcon,
  Trash2, Download,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export type AttachableType = "client" | "project" | "task";

const ACCEPT = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png", "image/jpeg", "image/gif", "image/webp",
];
const ACCEPT_ATTR = ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp";
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

const BUCKET = "platform-documents";

interface Props {
  attachableType: AttachableType;
  attachableId: string;
  /** When omitted, falls back to workspaceId from context. Required for entity workspace_id consistency. */
  workspaceId?: string;
}

interface DocRow {
  id: string; file_name: string; mime_type: string | null; size_bytes: number | null;
  storage_path: string; uploaded_by: string | null; created_at: string;
}

interface Row extends DocRow {
  attachment_id: string;
  uploader: { full_name: string | null; email: string | null } | null;
}

function bytes(n: number | null) {
  if (!n && n !== 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function iconFor(mime: string | null, name: string) {
  const m = (mime ?? "").toLowerCase();
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (m.startsWith("image/")) return FileImage;
  if (m.includes("pdf") || ext === "pdf") return FileText;
  if (m.includes("sheet") || m.includes("excel") || ["xls", "xlsx", "csv"].includes(ext)) return FileSpreadsheet;
  if (m.includes("word") || ["doc", "docx"].includes(ext)) return FileText;
  return FileIcon;
}

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 180);
}

export function Attachments({ attachableType, attachableId, workspaceId: wsProp }: Props) {
  const { workspaceId: ctxWs, userId, role } = useWorkspace();
  const workspaceId = wsProp ?? ctxWs;
  const isAdmin = role === "admin";

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<{ name: string; pct: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: atts } = await (supabase as any)
      .from("attachments")
      .select("id, document_id, platform_documents(id, file_name, mime_type, size_bytes, storage_path, uploaded_by, created_at)")
      .eq("attachable_type", attachableType)
      .eq("attachable_id", attachableId);

    const list: Row[] = (atts ?? [])
      .filter((a: any) => a.platform_documents)
      .map((a: any) => ({
        ...a.platform_documents,
        attachment_id: a.id,
        uploader: null,
      }));

    const uploaderIds = Array.from(new Set(list.map((r) => r.uploaded_by).filter(Boolean))) as string[];
    if (uploaderIds.length) {
      const { data: profs } = await (supabase as any)
        .from("profiles").select("id, full_name, email").in("id", uploaderIds);
      const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
      list.forEach((r) => { r.uploader = (map.get(r.uploaded_by!) as any) ?? null; });
    }

    list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    setRows(list);
    setLoading(false);

    // Generate signed thumbnails for images
    const images = list.filter((r) => (r.mime_type ?? "").startsWith("image/"));
    if (images.length) {
      const { data } = await (supabase as any).storage.from(BUCKET)
        .createSignedUrls(images.map((r) => r.storage_path), 60 * 60);
      const next: Record<string, string> = {};
      (data ?? []).forEach((s: any, i: number) => { if (s.signedUrl) next[images[i].id] = s.signedUrl; });
      setThumbs(next);
    } else setThumbs({});
  }, [attachableType, attachableId]);

  useEffect(() => { void load(); }, [load]);

  // Realtime: refresh when an attachment for this entity is added or removed elsewhere
  // (e.g. Paste Email dialog files into a client's Files tab).
  useEffect(() => {
    const ch = supabase
      .channel(`attachments-${attachableType}-${attachableId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attachments", filter: `attachable_id=eq.${attachableId}` },
        () => { void load(); },
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [attachableType, attachableId, load]);

  const upload = async (file: File) => {
    if (!workspaceId || !userId) { toast.error("No workspace context"); return; }
    if (file.size > MAX_BYTES) { toast.error("File exceeds 25 MB limit"); return; }
    if (ACCEPT.length && file.type && !ACCEPT.includes(file.type)) {
      // best-effort, fall through if browser doesn't set a type
    }

    const docId = crypto.randomUUID();
    const safe = sanitizeName(file.name);
    const path = `${workspaceId}/${docId}/${safe}`;

    setUploading({ name: file.name, pct: 5 });
    // Supabase JS v2 doesn't expose granular upload progress; show indeterminate-ish stepping.
    const tick = setInterval(() => {
      setUploading((u) => (u ? { ...u, pct: Math.min(85, u.pct + 7) } : u));
    }, 200);

    const { error: upErr } = await (supabase as any).storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type || undefined, upsert: false });
    clearInterval(tick);

    if (upErr) {
      setUploading(null);
      toast.error(upErr.message ?? "Upload failed");
      return;
    }
    setUploading({ name: file.name, pct: 92 });

    const { error: docErr } = await (supabase as any).from("platform_documents").insert({
      id: docId,
      workspace_id: workspaceId,
      file_name: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
      storage_path: path,
      uploaded_by: userId,
    });
    if (docErr) {
      setUploading(null);
      await (supabase as any).storage.from(BUCKET).remove([path]);
      toast.error(docErr.message);
      return;
    }

    const { error: attErr } = await (supabase as any).from("attachments").insert({
      document_id: docId,
      attachable_type: attachableType,
      attachable_id: attachableId,
    });
    if (attErr) {
      setUploading(null);
      toast.error(attErr.message);
      return;
    }

    setUploading({ name: file.name, pct: 100 });
    setTimeout(() => setUploading(null), 350);
    toast.success("Uploaded");
    void load();
  };

  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files) return;
    for (const f of Array.from(files)) await upload(f);
  };

  const download = async (r: Row) => {
    const { data, error } = await (supabase as any).storage
      .from(BUCKET).createSignedUrl(r.storage_path, 60 * 60, { download: r.file_name });
    if (error || !data?.signedUrl) { toast.error(error?.message ?? "Could not get link"); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  };

  const remove = async (r: Row) => {
    const canDelete = isAdmin || r.uploaded_by === userId;
    if (!canDelete) { toast.error("Only admins or the uploader can delete"); return; }
    if (!confirm(`Delete "${r.file_name}"?`)) return;
    // Delete document (cascades attachments via FK), then remove storage object.
    const { error } = await (supabase as any).from("platform_documents").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    await (supabase as any).storage.from(BUCKET).remove([r.storage_path]);
    setRows((prev) => prev.filter((x) => x.id !== r.id));
    toast.success("Deleted");
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-lg border-2 border-dashed p-5 text-center transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
      >
        <Upload className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-foreground">
          Drag &amp; drop files here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-primary underline-offset-2 hover:underline font-medium"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-muted-foreground mt-1">PDF, Word, Excel, PNG, JPG, GIF, WEBP · up to 25 MB</p>
        <input
          ref={inputRef} type="file" multiple className="hidden"
          accept={ACCEPT_ATTR}
          onChange={(e) => { void handleFiles(e.target.files); e.target.value = ""; }}
        />
        {uploading && (
          <div className="mt-3 text-left max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="truncate">{uploading.name}</span>
              <span className="text-muted-foreground tabular-nums">{uploading.pct}%</span>
            </div>
            <Progress value={uploading.pct} className="h-1.5" />
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No files yet.</p>
      ) : (
        <ul className="divide-y rounded-lg border bg-card">
          {rows.map((r) => {
            const Icon = iconFor(r.mime_type, r.file_name);
            const canDelete = isAdmin || r.uploaded_by === userId;
            const thumb = thumbs[r.id];
            return (
              <li key={r.id} className="flex items-center gap-3 p-3 hover:bg-muted/30">
                {thumb ? (
                  <img src={thumb} alt={r.file_name}
                    className="h-10 w-10 rounded object-cover flex-shrink-0 border" />
                ) : (
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <button
                    type="button" onClick={() => download(r)}
                    className="text-sm font-medium text-foreground hover:underline truncate block text-left w-full"
                  >
                    {r.file_name}
                  </button>
                  <div className="text-xs text-muted-foreground">
                    {bytes(r.size_bytes)} · {r.uploader?.full_name ?? r.uploader?.email ?? "Unknown"} ·{" "}
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => download(r)} aria-label="Download">
                  <Download className="h-4 w-4" />
                </Button>
                {canDelete && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => remove(r)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
