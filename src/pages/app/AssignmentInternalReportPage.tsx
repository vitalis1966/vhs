import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePermission } from "@/hooks/usePermission";
import { Loader2 } from "lucide-react";
import InternalReport, { type InternalReportData } from "@/pages/admin/InternalReport";

export default function AssignmentInternalReportPage() {
  const { clientId, assignmentId } = useParams<{ clientId: string; assignmentId: string }>();
  const canView = usePermission("reports.view_internal");

  const [data, setData] = useState<InternalReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assignmentId) return;
    setLoading(true);
    (async () => {
      const { data: res, error: err } = await (supabase as any).rpc(
        "get_internal_report_for_assignment",
        { p_assignment_id: assignmentId },
      );
      if (err) {
        setError(err.message);
      } else {
        const responses: Record<string, { value: string; json: any }> = {};
        for (const r of res?.responses ?? []) {
          responses[r.question_id] = { value: r.response_value || "", json: r.response_json };
        }
        setData({
          session: res?.session,
          assessment: res?.assessment,
          intake: res?.intake,
          report: res?.report,
          sections: res?.sections ?? [],
          responses,
        });
      }
      setLoading(false);
    })();
  }, [assignmentId]);

  if (!canView) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        You don't have permission to view internal reports.
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
    <InternalReport
      data={data}
      embedded
      backTo={`/app/clients/${clientId}?tab=assessments`}
      backLabel="Back to Assessments"
    />
  );
}
