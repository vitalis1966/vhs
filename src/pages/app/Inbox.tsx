import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Inbox as InboxIcon, MoreHorizontal, Sparkles, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { StatusDropdown, type InboxStatus } from "@/components/app/inbox/StatusDropdown";
import { EmailViewerSheet } from "@/components/app/inbox/EmailViewerSheet";
import { ExtractTasksPanel, type ExtractedTask } from "@/components/app/inbox/ExtractTasksPanel";

const INBOUND_ADDRESS = "inbox@inbound.vitalisstrategies.com";

interface EmailRow {
  id: string;
  from_email: string;
  from_name: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  received_at: string;
  status: InboxStatus;
  assigned_to: string | null;
}

export default function Inbox() {
  const { workspaceId } = useWorkspace();
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<EmailRow | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EmailRow | null>(null);
  const [extracting, setExtracting] = useState<string | null>(null);
  const [extractTasks, setExtractTasks] = useState<ExtractedTask[]>([]);
  const [extractEmail, setExtractEmail] = useState<EmailRow | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("inbound_emails")
      .select("id, from_email, from_name, subject, body_text, body_html, received_at, status, assigned_to")
      .order("received_at", { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    setEmails((data as EmailRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { if (workspaceId) load(); }, [workspaceId, load]);

  const updateStatus = async (id: string, status: InboxStatus) => {
    const prev = emails;
    setEmails((rows) => rows.map((r) => r.id === id ? { ...r, status } : r));
    const { error } = await (supabase as any).from("inbound_emails").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      setEmails(prev);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await (supabase as any).from("inbound_emails").delete().eq("id", deleteTarget.id);
    if (error) { toast.error(error.message); return; }
    setEmails((rows) => rows.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Email deleted");
  };

  const extract = async (email: EmailRow) => {
    setExtracting(email.id);
    try {
      const { data, error } = await (supabase as any).functions.invoke("extract-email-tasks", {
        body: { email_id: email.id },
      });
      if (error) throw error;
      const tasks: ExtractedTask[] = data?.tasks ?? [];
      if (!tasks.length) {
        toast.error("No actionable tasks found in this email.");
        return;
      }
      setExtractEmail(email);
      setExtractTasks(tasks);
      setPanelOpen(true);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to extract tasks");
    } finally {
      setExtracting(null);
    }
  };

  const onPanelFinish = async (savedCount: number) => {
    setPanelOpen(false);
    if (savedCount > 0 && extractEmail) {
      await updateStatus(extractEmail.id, "assigned");
      toast.success(`${savedCount} task${savedCount === 1 ? "" : "s"} saved`);
    }
    setExtractEmail(null);
    setExtractTasks([]);
  };

  const openViewer = (e: EmailRow) => { setViewing(e); setViewerOpen(true); };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Inbox</h1>
        <p className="text-sm text-muted-foreground mt-1">Emails forwarded to Vitalis OS for task extraction.</p>
      </div>

      <div className="border border-border rounded-lg bg-card">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading…</div>
        ) : emails.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <InboxIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground font-medium">No emails yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Forward emails to <span className="font-mono text-foreground">{INBOUND_ADDRESS}</span> to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((e) => {
                const subjectTrunc = (e.subject ?? "(no subject)").length > 70
                  ? (e.subject ?? "").slice(0, 70) + "…"
                  : (e.subject ?? "(no subject)");
                return (
                  <TableRow
                    key={e.id}
                    className="cursor-pointer"
                    onClick={() => openViewer(e)}
                  >
                    <TableCell>
                      <div className="text-sm font-medium">{e.from_name || e.from_email}</div>
                      {e.from_name && <div className="text-xs text-muted-foreground">{e.from_email}</div>}
                    </TableCell>
                    <TableCell title={e.subject ?? ""}>{subjectTrunc}</TableCell>
                    <TableCell title={format(new Date(e.received_at), "PPpp")}>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(e.received_at), { addSuffix: true })}
                      </span>
                    </TableCell>
                    <TableCell onClick={(ev) => ev.stopPropagation()}>
                      <StatusDropdown value={e.status} onChange={(v) => updateStatus(e.id, v)} />
                    </TableCell>
                    <TableCell onClick={(ev) => ev.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => extract(e)} disabled={extracting === e.id}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            {extracting === e.id ? "Extracting…" : "Extract to Task"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteTarget(e)} className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <EmailViewerSheet email={viewing} open={viewerOpen} onOpenChange={setViewerOpen} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this email?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {extractEmail && (
        <ExtractTasksPanel
          open={panelOpen}
          onOpenChange={setPanelOpen}
          emailId={extractEmail.id}
          defaultAssigneeId={extractEmail.assigned_to}
          tasks={extractTasks}
          onFinished={onPanelFinish}
        />
      )}
    </div>
  );
}
