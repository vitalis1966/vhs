import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { formatBytes } from "@/lib/formatBytes";
import { toast } from "sonner";

interface Email {
  id: string;
  from_email: string;
  from_name: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  received_at: string;
}

interface Attachment {
  id: string;
  file_name: string;
  storage_path: string;
  mime_type: string | null;
  file_size: number | null;
}

interface Props {
  email: Email | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailViewerSheet({ email, open, onOpenChange }: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    if (!open || !email) { setAttachments([]); return; }
    (async () => {
      const { data } = await (supabase as any)
        .from("inbox_email_attachments")
        .select("id, file_name, storage_path, mime_type, file_size")
        .eq("email_id", email.id)
        .order("created_at", { ascending: true });
      setAttachments((data as Attachment[]) ?? []);
    })();
  }, [open, email]);

  const download = async (a: Attachment) => {
    const { data, error } = await (supabase as any).storage
      .from("email-attachments")
      .createSignedUrl(a.storage_path, 300, { download: a.file_name });
    if (error || !data?.signedUrl) { toast.error(error?.message ?? "Could not generate download link"); return; }
    window.open(data.signedUrl, "_blank");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">{email?.subject || "(no subject)"}</SheetTitle>
        </SheetHeader>
        {email && (
          <div className="mt-4 space-y-4">
            <div className="text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">From:</span> {email.from_name ? `${email.from_name} <${email.from_email}>` : email.from_email}</div>
              <div><span className="font-medium text-foreground">Received:</span> {format(new Date(email.received_at), "PPpp")}</div>
            </div>
            <div className="border-t pt-4">
              {email.body_html && email.body_html.trim() ? (
                <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: email.body_html }} />
              ) : email.body_text && email.body_text.trim() ? (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{email.body_text}</pre>
              ) : (
                <p className="text-sm text-muted-foreground italic">No body content.</p>
              )}
            </div>
            {attachments.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Paperclip className="h-4 w-4" /> Attachments ({attachments.length})
                </div>
                <div className="space-y-1.5">
                  {attachments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-md border border-border bg-muted/30">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{a.file_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.mime_type ?? "file"}{a.file_size ? ` · ${formatBytes(a.file_size)}` : ""}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => download(a)}>
                        <Download className="h-3.5 w-3.5 mr-1" /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
