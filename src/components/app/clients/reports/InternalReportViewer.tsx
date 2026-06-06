import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string | null;
}

export function InternalReportViewer({ open, onOpenChange, assignmentId }: Props) {
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
        "get_internal_report_for_assignment",
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
  const session = data?.session;
  const analysis = report?.analysis_data ?? {};

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Internal Report</SheetTitle>
          <SheetDescription>
            {assessment?.title ?? "Strategic Assessment"} — read-only view for workspace members.
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
              <h3 className="font-semibold text-base mb-2">Submission</h3>
              <dl className="grid grid-cols-2 gap-3">
                <Field label="Client" value={intake?.full_name ?? "—"} />
                <Field label="Organization" value={intake?.organization_name ?? "—"} />
                <Field label="Email" value={intake?.email ?? "—"} />
                <Field
                  label="Submitted"
                  value={session?.submitted_at ? new Date(session.submitted_at).toLocaleString() : "—"}
                />
                <Field
                  label="Meeting"
                  value={session?.meeting_booked ? "Booked" : "Not booked"}
                />
                <Field label="Analysis status" value={report?.analysis_status ?? "—"} />
              </dl>
            </section>

            {report ? (
              <>
                {report.readiness_category && (
                  <section>
                    <h3 className="font-semibold text-base mb-2">Readiness</h3>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{report.readiness_category}</Badge>
                      {report.overall_score != null && (
                        <span className="text-muted-foreground">
                          Overall score: <span className="font-semibold text-foreground">{report.overall_score}</span>
                        </span>
                      )}
                    </div>
                  </section>
                )}

                {report.executive_summary && (
                  <section>
                    <h3 className="font-semibold text-base mb-2">Executive Summary</h3>
                    <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {report.executive_summary}
                    </div>
                  </section>
                )}

                <AnalysisBlock title="Section Scores" rows={analysis?.section_scores} />
                <AnalysisBlock title="Strengths" rows={analysis?.strengths} />
                <AnalysisBlock title="Concerns" rows={analysis?.concerns} />
                <AnalysisBlock title="Recommendations" rows={analysis?.recommendations ?? analysis?.focus_areas} />
              </>
            ) : (
              <p className="text-muted-foreground italic">No report has been generated yet.</p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function AnalysisBlock({ title, rows }: { title: string; rows: any }) {
  if (!rows) return null;
  if (Array.isArray(rows) && rows.length === 0) return null;
  return (
    <section>
      <h3 className="font-semibold text-base mb-2">{title}</h3>
      {Array.isArray(rows) ? (
        <ul className="space-y-2">
          {rows.map((r: any, i: number) => (
            <li key={i} className="rounded-md border bg-card p-3">
              {typeof r === "string" ? (
                <p>{r}</p>
              ) : (
                <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(r, null, 2)}</pre>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <pre className="whitespace-pre-wrap text-xs rounded-md border bg-card p-3">
          {JSON.stringify(rows, null, 2)}
        </pre>
      )}
    </section>
  );
}
