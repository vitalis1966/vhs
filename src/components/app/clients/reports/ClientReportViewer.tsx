import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string | null;
}

export function ClientReportViewer({ open, onOpenChange, assignmentId }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !assignmentId) return;
    setLoading(true);
    setError(null);
    setData(null);
    (async () => {
      const { data: res, error: err } = await (supabase as any).rpc(
        "get_client_report_for_assignment",
        { p_assignment_id: assignmentId },
      );
      if (err) setError(err.message);
      else setData(res);
      setLoading(false);
    })();
  }, [open, assignmentId]);

  const intake = data?.intake;
  const report = data?.report;
  const assessment = data?.assessment;
  const analysis = report?.analysis_data ?? {};
  const edits: Array<{ section_key: string; edited_content: string }> = data?.edits ?? [];
  const editsMap = new Map<string, string>();
  for (const e of edits) editsMap.set(e.section_key, e.edited_content);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Client Report</SheetTitle>
          <SheetDescription>
            {assessment?.title ?? "Strategic Assessment"} — client-facing view.
          </SheetDescription>
        </SheetHeader>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="mt-6 space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-1">{intake?.full_name ?? "—"}</h3>
              <p className="text-muted-foreground">
                {intake?.organization_name ?? ""}{intake?.email ? ` · ${intake.email}` : ""}
              </p>
            </section>

            {!report ? (
              <p className="text-muted-foreground italic">No report has been generated yet.</p>
            ) : (
              <>
                {(editsMap.get("executive_summary") || report.executive_summary) && (
                  <section>
                    <h3 className="font-semibold text-base mb-2">Executive Summary</h3>
                    <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {editsMap.get("executive_summary") ?? report.executive_summary}
                    </div>
                  </section>
                )}

                {(analysis?.client_summary || analysis?.summary) && (
                  <section>
                    <h3 className="font-semibold text-base mb-2">Summary</h3>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {analysis.client_summary ?? analysis.summary}
                    </div>
                  </section>
                )}

                {Array.isArray(analysis?.recommendations) && analysis.recommendations.length > 0 && (
                  <section>
                    <h3 className="font-semibold text-base mb-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((r: any, i: number) => (
                        <li key={i} className="rounded-md border bg-card p-3">
                          {typeof r === "string" ? r : (
                            <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(r, null, 2)}</pre>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
