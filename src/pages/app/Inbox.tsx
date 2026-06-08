import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Inbox as InboxIcon, MoreHorizontal, Sparkles, Trash2, Eye, CheckCircle2, X, RotateCcw } from "lucide-react";
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
import { ExtractTasksPanel, type ExtractedTask, type PanelFinishSummary } from "@/components/app/inbox/ExtractTasksPanel";
import { ExtractedTasksViewerSheet } from "@/components/app/inbox/ExtractedTasksViewerSheet";
import { markInboxVisited } from "@/hooks/useInboxUnreadCount";
import { Switch } from "@/components/ui/switch";
import {
  ColumnHeader, useTableFilters, TextFilter, MultiSelectFilter, DateRangeFilter,
} from "@/components/app/columns";

const INBOUND_ADDRESS = "inbox@mail.vitalisstrategies.com";

const INBOX_STATUS_LABELS: Record<InboxStatus, string> = {
  not_assigned: "Not Assigned",
  assigned: "Assigned",
  waiting: "Waiting",
};

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
  deleted_at: string | null;
  deleted_by: string | null;
}

export default function Inbox() {
  const { workspaceId, userId, role } = useWorkspace();
  const isAdminOrManager = role === "admin" || role === "manager";
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<EmailRow | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EmailRow | null>(null);
  const [hardDeleteTarget, setHardDeleteTarget] = useState<EmailRow | null>(null);
  const [extractingId, setExtractingId] = useState<string | null>(null);
  const [extractProgress, setExtractProgress] = useState(0);
  const [extractTasks, setExtractTasks] = useState<ExtractedTask[]>([]);
  const [extractEmail, setExtractEmail] = useState<EmailRow | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [confirmExtract, setConfirmExtract] = useState<{ email: EmailRow; tasks: ExtractedTask[] } | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [tasksViewer, setTasksViewer] = useState<{ tasks: ExtractedTask[]; subject: string | null } | null>(null);
  const [view, setView] = useState<"inbox" | "trash">("inbox");
  const [deletedByNames, setDeletedByNames] = useState<Record<string, string>>({});
  const [showCompleted, setShowCompleted] = useState<boolean>(() => {
    try { return sessionStorage.getItem("inbox:show-completed") === "1"; } catch { return false; }
  });
  useEffect(() => {
    try { sessionStorage.setItem("inbox:show-completed", showCompleted ? "1" : "0"); } catch {}
  }, [showCompleted]);

  // Mark page as visited for badge logic
  useEffect(() => { markInboxVisited(userId); }, [userId]);

  const load = useCallback(async () => {
    setLoading(true);
    setSelected([]);
    let q = (supabase as any)
      .from("inbound_emails")
      .select("id, from_email, from_name, subject, body_text, body_html, received_at, status, assigned_to, extraction_state, deleted_at, deleted_by")
      .order(view === "trash" ? "deleted_at" : "received_at", { ascending: false })
      .limit(200);
    q = view === "trash" ? q.not("deleted_at", "is", null) : q.is("deleted_at", null);
    const { data, error } = await q;
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

    // Resolve deleted_by names for trash view
    if (view === "trash" && rows.length) {
      const uids = Array.from(new Set(rows.map((r) => r.deleted_by).filter(Boolean) as string[]));
      if (uids.length) {
        const { data: profs } = await (supabase as any)
          .from("profiles")
          .select("id, full_name, email")
          .in("id", uids);
        const map: Record<string, string> = {};
        (profs ?? []).forEach((p: any) => { map[p.id] = p.full_name || p.email || p.id; });
        setDeletedByNames(map);
      }
    }

    setLoading(false);
    // Refresh the visited marker after load so badge resets
    markInboxVisited(userId);
  }, [userId, view]);

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
    const { error } = await (supabase as any).rpc("soft_delete_inbound_email", { p_id: deleteTarget.id });
    if (error) { toast.error(error.message); return; }
    setEmails((rows) => rows.filter((r) => r.id !== deleteTarget.id));
    setSelected((prev) => prev.filter((id) => id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Email moved to Trash");
  };

  const confirmBulkDelete = async () => {
    if (!selected.length) return;
    const { error } = await (supabase as any).rpc("soft_delete_inbound_emails", { p_ids: selected });
    if (error) { toast.error(error.message); return; }
    setEmails((rows) => rows.filter((r) => !selected.includes(r.id)));
    const count = selected.length;
    setSelected([]);
    setBulkDeleteOpen(false);
    toast.success(`${count} email${count === 1 ? "" : "s"} moved to Trash`);
  };

  const restoreEmail = async (id: string) => {
    const { error } = await (supabase as any).rpc("restore_inbound_email", { p_id: id });
    if (error) { toast.error(error.message); return; }
    setEmails((rows) => rows.filter((r) => r.id !== id));
    toast.success("Email restored");
  };

  const confirmHardDelete = async () => {
    if (!hardDeleteTarget) return;
    const { error } = await (supabase as any).rpc("hard_delete_inbound_email", { p_id: hardDeleteTarget.id });
    if (error) { toast.error(error.message); return; }
    setEmails((rows) => rows.filter((r) => r.id !== hardDeleteTarget.id));
    setHardDeleteTarget(null);
    toast.success("Email permanently deleted");
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
        // No action items extracted → Status: Not Assigned, Action: Complete
        await updateExtractionState(email.id, "completed");
        toast.message("No actionable tasks found in this email.");
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
    // Self-heal: if every extracted task is already saved/skipped, finish the row directly.
    const allResolved = tasks.every((t) => t.status === "saved" || t.status === "skipped");
    if (allResolved) {
      const saved = tasks.filter((t) => t.status === "saved").length;
      const skipped = tasks.filter((t) => t.status === "skipped").length;
      const summary: PanelFinishSummary = {
        saved, skipped, deferred: 0, pending: 0, total: tasks.length, closedMidFlow: false,
      };
      const { status, extractionState } = resolveEmailState(summary);
      await updateStatus(email.id, status);
      await updateExtractionState(email.id, extractionState);
      // Refresh task counts
      const { data: ext } = await (supabase as any)
        .from("email_task_extractions")
        .select("task_id")
        .eq("email_id", email.id);
      setTaskCounts((c) => ({ ...c, [email.id]: (ext ?? []).length }));
      toast.message("All extracted tasks already resolved.");
      return;
    }
    // Make sure the email body viewer isn't open behind the task dialog
    setViewerOpen(false);
    setViewing(null);
    setTasksViewer(null);
    setExtractEmail(email);
    setExtractTasks(tasks);
    setPanelOpen(true);
  };

  const resolveEmailState = (s: PanelFinishSummary): { status: InboxStatus; extractionState: ExtractionState } => {
    // Branch 1: nothing extracted
    if (s.total === 0) return { status: "not_assigned", extractionState: "completed" };
    // Branch 2: closed mid-flow, nothing saved yet
    if (s.closedMidFlow && s.saved === 0) return { status: "not_assigned", extractionState: "extracted" };
    // Branch 3: closed mid-flow, some saved
    if (s.closedMidFlow && s.saved > 0) return { status: "waiting", extractionState: "extracted" };
    // Branch 4: all Yes-skipped, nothing created
    if (s.saved === 0 && s.skipped === s.total) return { status: "not_assigned", extractionState: "completed" };
    // Branch 5: fully resolved, at least one created (mix of created + Yes-skipped)
    if (s.saved > 0 && s.saved + s.skipped === s.total) return { status: "assigned", extractionState: "completed" };
    // Branch 6: outstanding work + something saved
    if ((s.pending + s.deferred) > 0 && s.saved > 0) return { status: "waiting", extractionState: "extracted" };
    // Branch 7: outstanding work + nothing saved
    if ((s.pending + s.deferred) > 0 && s.saved === 0) return { status: "not_assigned", extractionState: "extracted" };
    // Safety fallback (should be unreachable given the table above)
    return { status: "not_assigned", extractionState: "extracted" };
  };

  const onPanelFinish = async (summary: PanelFinishSummary) => {
    setPanelOpen(false);
    if (!extractEmail) return;
    const emailRef = extractEmail;

    // Refresh task counts regardless
    const { data: ext } = await (supabase as any)
      .from("email_task_extractions")
      .select("task_id")
      .eq("email_id", emailRef.id);
    setTaskCounts((c) => ({ ...c, [emailRef.id]: (ext ?? []).length }));

    const { status, extractionState } = resolveEmailState(summary);
    await updateStatus(emailRef.id, status);
    await updateExtractionState(emailRef.id, extractionState);

    if (summary.saved > 0) toast.success(`${summary.saved} task${summary.saved === 1 ? "" : "s"} saved`);

    setExtractEmail(null);
    setExtractTasks([]);
  };

  const openTasksViewer = async (email: EmailRow) => {
    const { data, error } = await (supabase as any)
      .from("email_extracted_tasks")
      .select("id, title, description, priority, position, status, task_id")
      .eq("email_id", email.id)
      .order("position", { ascending: true });
    if (error) { toast.error(error.message); return; }
    const tasks = (data as ExtractedTask[]) ?? [];
    if (!tasks.length) {
      // Fallback to linked tasks if no extracted draft rows
      toast.message("No extracted task drafts stored for this email.");
      return;
    }
    setTasksViewer({ tasks, subject: email.subject });
  };

  const openViewer = (e: EmailRow) => { setViewing(e); setViewerOpen(true); };

  const tf = useTableFilters<"from" | "subject" | "status" | "received">({
    defaultSort: { key: "received", dir: "desc" },
  });

  const visibleEmails = useMemo(() => tf.apply(emails, {
    from: {
      filterValue: (e) => `${e.from_name ?? ""} ${e.from_email}`,
      sortValue: (e) => (e.from_name ?? e.from_email).toLowerCase(),
    },
    subject: {
      filterValue: (e) => e.subject ?? "",
      sortValue: (e) => (e.subject ?? "").toLowerCase(),
    },
    status: {
      filterValue: (e) => e.status,
      sortValue: (e) => e.status,
    },
    received: {
      filterValue: (e) => new Date(e.received_at),
      sortValue: (e) => new Date(e.received_at).getTime(),
    },
  }), [emails, tf.state]);

  const allSelected = visibleEmails.length > 0 && visibleEmails.every((r) => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : visibleEmails.map((r) => r.id));
  const toggleOne = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {view === "trash"
              ? "Deleted emails. Restore them or delete permanently."
              : "Emails forwarded to Vitalis OS for task extraction."}
          </p>
        </div>
        <div className="inline-flex rounded-md border border-border bg-card p-0.5">
          <Button
            size="sm"
            variant={view === "inbox" ? "secondary" : "ghost"}
            className="h-8"
            onClick={() => setView("inbox")}
          >
            <InboxIcon className="h-4 w-4 mr-1.5" /> Inbox
          </Button>
          <Button
            size="sm"
            variant={view === "trash" ? "secondary" : "ghost"}
            className="h-8"
            onClick={() => setView("trash")}
          >
            <Trash2 className="h-4 w-4 mr-1.5" /> Trash
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg bg-card">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading…</div>
        ) : emails.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              {view === "trash" ? <Trash2 className="h-6 w-6 text-muted-foreground" /> : <InboxIcon className="h-6 w-6 text-muted-foreground" />}
            </div>
            <p className="text-sm text-foreground font-medium">{view === "trash" ? "Trash is empty" : "No emails yet"}</p>
            {view === "inbox" && (
              <p className="text-sm text-muted-foreground mt-1">
                Forward emails to <span className="font-mono text-foreground">{INBOUND_ADDRESS}</span> to get started.
              </p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead>
                  <ColumnHeader label="From" columnKey="from" sort={tf.sort} onToggleSort={tf.toggleSort}
                    filterValue={tf.filters.from} onFilterChange={tf.setFilter}
                    renderFilter={(v, onChange) => <TextFilter value={v} onChange={onChange} placeholder="Filter sender…" />} />
                </TableHead>
                <TableHead>
                  <ColumnHeader label="Subject" columnKey="subject" sort={tf.sort} onToggleSort={tf.toggleSort}
                    filterValue={tf.filters.subject} onFilterChange={tf.setFilter}
                    renderFilter={(v, onChange) => <TextFilter value={v} onChange={onChange} placeholder="Filter subject…" />} />
                </TableHead>
                <TableHead>
                  <ColumnHeader label="Date" columnKey="received" sort={tf.sort} onToggleSort={tf.toggleSort}
                    filterValue={tf.filters.received} onFilterChange={tf.setFilter}
                    renderFilter={(v, onChange) => <DateRangeFilter value={v} onChange={onChange} />} />
                </TableHead>
                <TableHead className="w-[190px]">
                  <ColumnHeader label="Status" columnKey="status" sort={tf.sort} onToggleSort={tf.toggleSort}
                    filterValue={tf.filters.status} onFilterChange={tf.setFilter}
                    renderFilter={(v, onChange) => <MultiSelectFilter value={v} onChange={onChange}
                      options={(Object.keys(INBOX_STATUS_LABELS) as InboxStatus[]).map((k) => ({ value: k, label: INBOX_STATUS_LABELS[k] }))} />} />
                </TableHead>
                <TableHead className="w-20 text-center">Tasks</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleEmails.map((e) => {
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
                    <TableCell className="text-center text-sm" onClick={(ev) => ev.stopPropagation()}>
                      {tcount > 0 ? (
                        <button
                          type="button"
                          onClick={() => openTasksViewer(e)}
                          className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-muted text-foreground font-medium hover:bg-muted/70 transition-colors"
                          title="View extracted tasks"
                        >
                          {tcount}
                        </button>
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
                          {view === "inbox" && state === "none" && (
                            <DropdownMenuItem onClick={() => runExtract(e)} disabled={isExtracting}>
                              <Sparkles className="h-4 w-4 mr-2" />
                              {isExtracting ? "Extracting…" : "Extract to Task"}
                            </DropdownMenuItem>
                          )}
                          {view === "inbox" && state === "extracted" && (
                            <DropdownMenuItem onClick={() => viewExtracted(e)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Extracted Tasks
                            </DropdownMenuItem>
                          )}
                          {view === "inbox" && state === "completed" && (
                            <DropdownMenuItem disabled>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Completed
                            </DropdownMenuItem>
                          )}
                          {view === "inbox" ? (
                            <DropdownMenuItem onClick={() => setDeleteTarget(e)} className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" /> Move to Trash
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem onClick={() => restoreEmail(e.id)}>
                                <RotateCcw className="h-4 w-4 mr-2" /> Restore
                              </DropdownMenuItem>
                              {isAdminOrManager && (
                                <DropdownMenuItem onClick={() => setHardDeleteTarget(e)} className="text-destructive focus:text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete permanently
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {view === "trash" && e.deleted_at && (
                        <div className="text-[11px] text-muted-foreground mt-1 text-right">
                          {formatDistanceToNow(new Date(e.deleted_at), { addSuffix: true })}
                          {e.deleted_by && deletedByNames[e.deleted_by] ? ` · ${deletedByNames[e.deleted_by]}` : ""}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Bulk action bar — only on inbox view */}
      {selected.length > 0 && view === "inbox" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-full shadow-elevated px-3 py-2 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2">
          <span className="text-sm font-medium px-2">{selected.length} selected</span>
          <div className="h-5 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive" onClick={() => setBulkDeleteOpen(true)}>
            <Trash2 className="h-4 w-4 mr-1" /> Move to Trash
          </Button>
          <div className="h-5 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected([])} aria-label="Clear selection">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <EmailViewerSheet email={viewing} open={viewerOpen} onOpenChange={setViewerOpen} />

      <ExtractedTasksViewerSheet
        open={!!tasksViewer}
        onOpenChange={(o) => !o && setTasksViewer(null)}
        tasks={tasksViewer?.tasks ?? []}
        subject={tasksViewer?.subject}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move this email to Trash?</AlertDialogTitle>
            <AlertDialogDescription>You can restore it from Trash later.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Move to Trash</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={(o) => !o && setBulkDeleteOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move {selected.length} email{selected.length === 1 ? "" : "s"} to Trash?</AlertDialogTitle>
            <AlertDialogDescription>You can restore them from Trash later.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Move to Trash</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!hardDeleteTarget} onOpenChange={(o) => !o && setHardDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete permanently?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone. The email will be removed from the system.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmHardDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete permanently</AlertDialogAction>
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
