import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePermission } from "@/hooks/usePermission";
import { Loader2 } from "lucide-react";
import ClientReport, { type ClientReportData } from "@/pages/admin/ClientReport";

export default function AssignmentClientReportPage() {
  const { clientId, assignmentId } = useParams<{ clientId: string; assignmentId: string }>();
  const canView = usePermission("reports.view_client");

  const [data, setData] = useState<ClientReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assignmentId) return;
    setLoading(true);
    (async () => {
      const { data: res, error: err } = await (supabase as any).rpc(
        "get_client_report_for_assignment",
        { p_assignment_id: assignmentId },
      );
      if (err) {
        setError(err.message);
      } else {
        setData({
          session: res?.session,
          assessment: res?.assessment,
          intake: res?.intake,
          report: res?.report,
          edits: res?.edits ?? [],
        });
      }
      setLoading(false);
    })();
  }, [assignmentId]);

  if (!canView) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        You don't have permission to view client reports.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center text-sm text-destructive">
        {error ?? "Report not available."}
      </div>
    );
  }

  return (
    <ClientReport
      data={data}
      embedded
      backTo={`/app/clients/${clientId}?tab=assessments`}
      backLabel="Back to Assessments"
    />
  );
}
