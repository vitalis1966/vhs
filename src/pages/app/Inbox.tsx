import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Inbox as InboxIcon, MoreHorizontal, Sparkles, Trash2, Eye, CheckCircle2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { StatusDropdown, type InboxStatus } from "@/components/app/inbox/StatusDropdown";
import { EmailViewerSheet } from "@/components/app/inbox/EmailViewerSheet";
import { ExtractTasksPanel, type ExtractedTask } from "@/components/app/inbox/ExtractTasksPanel";
import { ExtractedTasksViewerSheet } from "@/components/app/inbox/ExtractedTasksViewerSheet";
import { markInboxVisited } from "@/hooks/useInboxUnreadCount";

const INBOUND_ADDRESS = "inbox@inbound.vitalisstrategies.com";

type ExtractionState = "none" | "extracted" | "completed";

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
  extraction_state: ExtractionState;
}

export default function Inbox() {
  const { workspaceId, userId } = useWorkspace();
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<EmailRow | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EmailRow | null>(null);
  const [extractingId, setExtractingId] = useState<string | null>(null);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractTasks, setExtractTasks] = useState<ExtractedTask[]>([]);
  const [extractEmail, setExtractEmail] = useState<EmailRow | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [confirmExtract, setConfirmExtract] = useState<{ email: EmailRow; tasks: ExtractedTask[] } | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Mark page as visited for badge logic
  useEffect(() => { markInboxVisited(userId); }, [userId]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("inbound_emails")
      .select("id, from_email, from_name, subject, body_text, body_html, received_at, status, assigned_to, extraction_state")
      .order("received_at", { ascending: false })
      .limit(200);
    if (error) toast.error(error.message);
    const rows = (data as EmailRow[]) ?? [];
    setEmails(rows);

    // Fetch task counts per email
    if (rows.length) {
      const ids = rows.map((r) => r.id);
      const { data: ext } = await (supabase as any)
        .from("email_task_extractions")
        .select("email_id, task_id")
        .in("email_id", ids);
      const counts: Record<string, number> = {};
      (ext ?? []).forEach((r: any) => { counts[r.email_id] = (counts[r.email_id] ?? 0) + 1; });
      setTaskCounts(counts);
    } else {
      setTaskCounts({});
    }

    setLoading(false);
    // Refresh the visited marker after load so badge resets
    markInboxVisited(userId);
  }, [userId]);

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

  const updateExtractionState = async (id: string, extraction_state: ExtractionState) => {
    setEmails((rows) => rows.map((r) => r.id === id ? { ...r, extraction_state } : r));
    await (supabase as any).from("inbound_emails").update({ extraction_state }).eq("id", id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await (supabase as any).from("inbound_emails").delete().eq("id", deleteTarget.id);
    if (error) { toast.error(error.message); return; }
    setEmails((rows) => rows.filter((r) => r.id !== deleteTarget.id));
    setSelected((prev) => prev.filter((id) => id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Email deleted");
  };

  const confirmBulkDelete = async () => {
    if (!selected.length) return;
    const { error } = await (supabase as any).from("inbound_emails").delete().in("id", selected);
    if (error) { toast.error(error.message); return; }
    setEmails((rows) => rows.filter((r) => !selected.includes(r.id)));
    const count = selected.length;
    setSelected([]);
    setBulkDeleteOpen(false);
    toast.success(`${count} email${count === 1 ? "" : "s"} deleted`);
  };

  const runExtract = async (email: EmailRow) => {
    setExtractingId(email.id);
    setExtractProgress(10);
    const tick = setInterval(() => {
      setExtractProgress((p) => (p < 90 ? p + Math.max(1, Math.round((92 - p) / 8)) : p));
    }, 400);
    try {
      const { data, error } = await (supabase as any).functions.invoke("extract-email-tasks", {
        body: { email_id: email.id },
      });
      if (error) throw error;
      const tasks: ExtractedTask[] = data?.tasks ?? [];
      setExtractProgress(100);
      if (!tasks.length) {
        toast.error("No actionable tasks found in this email.");
        return;
      }
      // Update local state to 'extracted'
      setEmails((rows) => rows.map((r) => r.id === email.id ? { ...r, extraction_state: "extracted" } : r));
      setConfirmExtract({ email, tasks });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to extract tasks");
    } finally {
      clearInterval(tick);
      setTimeout(() => { setExtractingId(null); setExtractProgress(0); }, 300);
    }
  };

  const viewExtracted = async (email: EmailRow) => {
    const { data, error } = await (supabase as any)
      .from("email_extracted_tasks")
      .select("id, title, description, priority, position, status, task_id")
      .eq("email_id", email.id)
      .order("position", { ascending: true });
    if (error) { toast.error(error.message); return; }
    const tasks = (data as ExtractedTask[]) ?? [];
    if (!tasks.length) {
      toast.error("No extracted tasks stored for this email.");
      return;
    }
    setExtractEmail(email);
    setExtractTasks(tasks);
    setPanelOpen(true);
  };

  const onPanelFinish = async (savedCount: number) => {
    setPanelOpen(false);
    if (!extractEmail) return;
    // Refresh counts
    const { data: ext } = await (supabase as any)
      .from("email_task_extractions")
      .select("task_id")
      .eq("email_id", extractEmail.id);
    setTaskCounts((c) => ({ ...c, [extractEmail.id]: (ext ?? []).length }));

    if (savedCount > 0) {
      await updateStatus(extractEmail.id, "assigned");
      toast.success(`${savedCount} task${savedCount === 1 ? "" : "s"} saved`);
    }
    await updateExtractionState(extractEmail.id, "completed");
    setExtractEmail(null);
    setExtractTasks([]);
  };

  const openViewer = (e: EmailRow) => { setViewing(e); setViewerOpen(true); };

  const allSelected = emails.length > 0 && emails.every((r) => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : emails.map((r) => r.id));
  const toggleOne = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

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
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="w-[190px]">Status</TableHead>
                <TableHead className="w-20 text-center">Tasks</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((e) => {
                const subjectTrunc = (e.subject ?? "(no subject)").length > 70
                  ? (e.subject ?? "").slice(0, 70) + "…"
                  : (e.subject ?? "(no subject)");
                const tcount = taskCounts[e.id] ?? 0;
                const isExtracting = extractingId === e.id;
                const state = e.extraction_state ?? "none";
                return (
                  <TableRow
                    key={e.id}
                    className="cursor-pointer"
                    onClick={() => openViewer(e)}
                  >
                    <TableCell onClick={(ev) => ev.stopPropagation()}>
                      <Checkbox checked={selected.includes(e.id)} onCheckedChange={() => toggleOne(e.id)} aria-label="Select email" />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{e.from_name || e.from_email}</div>
                      {e.from_name && <div className="text-xs text-muted-foreground">{e.from_email}</div>}
                    </TableCell>
                    <TableCell title={e.subject ?? ""}>
                      <div>{subjectTrunc}</div>
                      {isExtracting && (
                        <div className="mt-2 flex items-center gap-2" onClick={(ev) => ev.stopPropagation()}>
                          <Progress value={extractProgress} className="h-1.5 w-40" />
                          <span className="text-xs text-muted-foreground">Extracting…</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell title={format(new Date(e.received_at), "PPpp")}>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(e.received_at), { addSuffix: true })}
                      </span>
                    </TableCell>
                    <TableCell onClick={(ev) => ev.stopPropagation()}>
                      <StatusDropdown value={e.status} onChange={(v) => updateStatus(e.id, v)} />
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {tcount > 0 ? (
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-muted text-foreground font-medium">
                          {tcount}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell onClick={(ev) => ev.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {state === "none" && (
                            <DropdownMenuItem onClick={() => runExtract(e)} disabled={isExtracting}>
                              <Sparkles className="h-4 w-4 mr-2" />
                              {isExtracting ? "Extracting…" : "Extract to Task"}
                            </DropdownMenuItem>
                          )}
                          {state === "extracted" && (
                            <DropdownMenuItem onClick={() => viewExtracted(e)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Extracted Tasks
                            </DropdownMenuItem>
                          )}
                          {state === "completed" && (
                            <DropdownMenuItem disabled>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Completed
                            </DropdownMenuItem>
                          )}
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

      {/* Bulk delete action bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-full shadow-elevated px-3 py-2 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2">
          <span className="text-sm font-medium px-2">{selected.length} selected</span>
          <div className="h-5 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive" onClick={() => setBulkDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
          <div className="h-5 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected([])} aria-label="Clear selection">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

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

      <AlertDialog open={bulkDeleteOpen} onOpenChange={(o) => !o && setBulkDeleteOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.length} email{selected.length === 1 ? "" : "s"}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Post-extraction confirmation */}
      <Dialog open={!!confirmExtract} onOpenChange={(o) => !o && setConfirmExtract(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tasks extracted</DialogTitle>
            <DialogDescription>
              {confirmExtract ? `${confirmExtract.tasks.length} task${confirmExtract.tasks.length === 1 ? "" : "s"} extracted from this email. Do you want to review and assign them now?` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmExtract(null)}>
              Later
            </Button>
            <Button onClick={() => {
              if (!confirmExtract) return;
              setExtractEmail(confirmExtract.email);
              setExtractTasks(confirmExtract.tasks);
              setConfirmExtract(null);
              setPanelOpen(true);
            }}>
              Yes, review now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
