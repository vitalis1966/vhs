import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdminGuard } from "@/components/AdminGuard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ColumnDef, SortableFilterableTable } from "@/components/admin/SortableFilterableTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Trash2, Download, Loader2, ArrowLeft } from "lucide-react";
import { downloadCsv, toCsv } from "@/lib/csv";
import { Link } from "react-router-dom";

type LogRow = {
  id: string;
  user_name: string;
  action: string;
  status: string;
  created_at: string;
};

function LoggingAdminInner() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<string>("50");
  const [clearOpen, setClearOpen] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    let q = (supabase as any).from("activity_logs").select("*").order("created_at", { ascending: false });
    if (limit !== "all") q = q.limit(Number(limit));
    const { data } = await q;
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRows(); /* eslint-disable-next-line */ }, [limit]);

  const handleClear = async () => {
    const { error } = await (supabase as any).from("activity_logs").delete().not("id", "is", null);
    if (error) { toast({ title: "Clear failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Logs cleared" });
    setClearOpen(false);
    fetchRows();
  };

  const exportCsv = () => {
    const data = rows.map((r) => ({
      user: r.user_name, action: r.action, status: r.status, date: r.created_at,
    }));
    downloadCsv(`activity-logs-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(data));
  };

  const columns: ColumnDef<LogRow>[] = [
    { key: "user_name", header: "User", accessor: (r) => r.user_name },
    { key: "action", header: "Action", accessor: (r) => r.action },
    {
      key: "created_at", header: "Date",
      accessor: (r) => new Date(r.created_at),
      cell: (r) => <span className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>,
    },
    {
      key: "status", header: "Status",
      accessor: (r) => r.status,
      cell: (r) => (
        <Badge variant="outline" className={r.status === "Success" ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-red-300 bg-red-50 text-red-700"}>
          {r.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="pt-32 pb-10 lg:pt-40 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Internal Admin</span>
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">Activity Logs</h1>
        </div>
      </section>

      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select value={limit} onValueChange={setLimit}>
                <SelectTrigger className="w-[100px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchRows}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
              <Button variant="outline" size="sm" onClick={() => setClearOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Clear Logs</Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <SortableFilterableTable<LogRow> data={rows} columns={columns} rowKey={(r) => r.id} />
          )}
        </div>
      </section>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all activity logs?</AlertDialogTitle>
            <AlertDialogDescription>This permanently deletes all log records. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear}>Clear All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  );
}

export default function LoggingAdmin() {
  return <AdminGuard><LoggingAdminInner /></AdminGuard>;
}
