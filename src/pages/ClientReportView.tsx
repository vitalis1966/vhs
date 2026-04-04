import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  Lock,
  Clock,
  User,
  Building2,
  Calendar,
  MapPin,
  Stethoscope,
  Phone,
  FileText,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Mail,
} from "lucide-react";
import {
  FindingsCategoryDonut,
  FocusAreasTimeline,
  FinancialWaterfallChart,
  extractFinancialData,
} from "@/components/admin/ReportCharts";

const vitalisLogo = "/vitalis-logo.webp";

// ─── Text transformation (same as admin report) ───

const replacements: [RegExp, string][] = [
  [/\bthe client\b/gi, "your organization"],
  [/\bcritical failure\b/gi, "opportunity for improvement"],
  [/\bextremely concerning\b/gi, "area requiring attention"],
  [/\bhighly dissatisfied\b/gi, "looking for improvement"],
  [/\bextreme dissatisfaction\b/gi, "looking for improvement"],
  [/\d+\s*\/\s*100/g, ""],
  [/\d+\s+out\s+of\s+100/gi, ""],
];

function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function transformText(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  result = result.replace(/\s{2,}/g, " ").trim();
  return capitalizeFirst(result);
}

function transformArray(arr: string[] | undefined): string[] {
  if (!arr) return [];
  return arr.map(transformText);
}

function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith("1")) return `(${digits.slice(1, 4)})${digits.slice(4, 7)}-${digits.slice(7)}`;
  return phone;
}

// ─── Report Card ───

function ReportCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-secondary/10">
        <span className="text-accent">{icon}</span>
        <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ─── Error States ───

function ErrorPage({ icon, title, message }: { icon: React.ReactNode; title: string; message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 mx-auto mb-8" />
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
          {icon}
        </div>
        <h1 className="font-display text-xl font-bold text-foreground mb-3">{title}</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{message}</p>
        <Button variant="outline" asChild>
          <a href="mailto:info@vitalisstrategies.com">
            <Mail className="mr-2 h-4 w-4" />
            Contact Us
          </a>
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───
//
// ⚠️  REGRESSION-PREVENTION NOTE — DO NOT REMOVE THE POLLING LOGIC BELOW  ⚠️
//
// A valid client_report_tokens row can exist BEFORE the matching
// internal_assessment_reports row is ready (analysis runs asynchronously).
// The RPC get_report_by_token now returns { status: "pending" } in that case.
//
// This component MUST poll on "pending" instead of falling through to the
// "Report Not Available" error screen.  The polling is tied to route mount
// so it also works correctly after a full page refresh.
//
// If you change the loading / error flow, make sure "pending" is still
// handled as a retryable state with a branded waiting screen.

const POLL_INTERVAL_MS = 5_000;
const MAX_POLL_DURATION_MS = 120_000; // 2 minutes

export default function ClientReportView() {
  const { token } = useParams<{ token: string }>();
  const [phase, setPhase] = useState<"loading" | "preparing">("loading");
  const [error, setError] = useState<"invalid" | "expired" | "revoked" | "timeout" | null>(null);
  const [session, setSession] = useState<any>(null);
  const [intake, setIntake] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const startedAt = Date.now();

    const poll = async () => {
      while (!cancelled) {
        try {
          const { data: result, error: rpcErr } = await supabase.rpc(
            "get_report_by_token" as any,
            { p_token: token } as any,
          );

          if (cancelled) return;

          if (rpcErr || !result) {
            console.error("RPC error:", rpcErr);
            setError("invalid");
            return;
          }

          const parsed = typeof result === "string" ? JSON.parse(result) : result;

          // Terminal errors — stop immediately
          if (parsed.error) {
            setError(parsed.error as "invalid" | "expired" | "revoked");
            return;
          }

          // Report still being generated — poll again
          if (parsed.status === "pending") {
            setPhase("preparing");
            if (Date.now() - startedAt >= MAX_POLL_DURATION_MS) {
              setError("timeout");
              return;
            }
            await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
            continue;
          }

          // Report is ready
          setSession(parsed.session);
          setAssessment(parsed.assessment);
          setIntake(parsed.intake);
          const reportData = parsed.report;
          if (reportData) {
            (reportData as any)._edits = parsed.edits || [];
          }
          setReport(reportData);
          setPhase("loading"); // reset — will fall through to render
          return;
        } catch (err) {
          console.error("ClientReportView error:", err);
          if (!cancelled) setError("invalid");
          return;
        }
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [token]);

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  // Loading state — initial fetch
  if (!error && !report && phase === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 mb-6" />
        <Loader2 className="h-6 w-6 animate-spin text-accent mb-3" />
        <p className="text-sm text-muted-foreground">Loading your report…</p>
      </div>
    );
  }

  // Preparing state — token valid but report still generating
  if (!error && !report && phase === "preparing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-10 mb-6" />
        <Loader2 className="h-6 w-6 animate-spin text-accent mb-3" />
        <p className="text-sm text-muted-foreground">Your report is being prepared, please wait…</p>
      </div>
    );
  }

  if (error === "invalid") {
    return (
      <ErrorPage
        icon={<AlertCircle className="h-7 w-7 text-destructive" />}
        title="This Link Is Not Valid"
        message="The report link you followed is not valid. Please contact info@vitalisstrategies.com if you believe this is an error."
      />
    );
  }

  if (error === "expired") {
    return (
      <ErrorPage
        icon={<Clock className="h-7 w-7 text-destructive" />}
        title="This Link Has Expired"
        message="This report link has expired (90 days). Please contact info@vitalisstrategies.com to request a new link."
      />
    );
  }

  if (error === "revoked") {
    return (
      <ErrorPage
        icon={<Lock className="h-7 w-7 text-destructive" />}
        title="This Link Has Been Deactivated"
        message="This report link has been deactivated. Please contact info@vitalisstrategies.com for assistance."
      />
    );
  }

  if (error === "timeout" || !report || !session) {
    return (
      <ErrorPage
        icon={<AlertCircle className="h-7 w-7 text-destructive" />}
        title="Report Not Available"
        message="This report is not yet available. Please try again in a few minutes or contact info@vitalisstrategies.com."
      />
    );
  }

  // Parse analysis data (same robust parsing as admin)
  const analysis = (() => {
    let data = report.analysis_data || {};
    const tryParseJSON = (raw: string): any | null => {
      try {
        let cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
        return JSON.parse(cleaned);
      } catch {
        try {
          const first = raw.indexOf("{");
          const last = raw.lastIndexOf("}");
          if (first !== -1 && last > first) return JSON.parse(raw.substring(first, last + 1));
        } catch { /* fall through */ }
        return null;
      }
    };

    if (data.executive_summary && typeof data.executive_summary === "string") {
      const es = data.executive_summary.trim();
      if (es.startsWith("```") || es.startsWith("{")) {
        const parsed = tryParseJSON(es);
        if (parsed && typeof parsed === "object") {
          data = { ...data, ...parsed, executive_summary: parsed.executive_summary || "", parse_error: undefined };
        } else {
          data = { ...data, executive_summary: "", _malformed: true };
        }
      }
    }

    if (typeof data === "string") {
      const parsed = tryParseJSON(data);
      data = parsed || { executive_summary: "", _malformed: true };
    }

    return data;
  })();

  // Build edit map from persisted edits
  const editMap: Record<string, string> = {};
  for (const e of (report as any)._edits || []) {
    editMap[`${e.section_key}__${e.item_index}`] = e.edited_text;
  }

  const getEditedText = (sectionKey: string, itemIndex: number, original: string) => {
    return editMap[`${sectionKey}__${itemIndex}`] ?? original;
  };

  const orgName = intake?.organization_name || intake?.full_name || "Your Organization";
  const executiveSummary = transformText(analysis.executive_summary || "");

  const sectionAnalyses = (analysis.section_analyses || []).map((sa: any) => ({
    section_title: sa.section_title,
    summary: transformText(sa.summary || ""),
    operational_gaps: transformArray(sa.operational_gaps),
    improvement_opportunities: transformArray(sa.improvement_opportunities),
  }));

  const keyFindings = (analysis.concerns || []).map((c: any) => ({
    description: transformText(c.description || ""),
    type: c.type,
  }));

  const focusAreas = (analysis.focus_areas || []).map((f: any) => ({
    area: transformText(f.area || ""),
    rationale: transformText(f.rationale || ""),
    priority: f.priority,
  }));

  const opportunities = (analysis.opportunities || []).map((o: any) => ({
    description: transformText(o.description || ""),
    category: o.category,
    potential_impact: o.potential_impact,
  }));

  const nextSteps = (analysis.recommended_next_steps || []).map((n: any) => ({
    recommendation: transformText(n.recommendation || ""),
    category: n.category,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/40">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-10 text-center">
          <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-12 mx-auto mb-4" />
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-2">
            Strategic Assessment Report
          </h1>
          <p className="text-muted-foreground text-base">
            Prepared for: <span className="font-semibold text-foreground">{orgName}</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">{formatDate(session?.submitted_at)}</p>
        </div>
      </div>

      {/* Confidentiality Banner */}
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl pt-6">
        <div className="bg-secondary/30 border border-border/40 rounded-xl p-4">
          <p className="text-[10px] font-bold text-accent uppercase tracking-[0.15em] mb-1">CONFIDENTIAL</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This report has been prepared exclusively for <strong className="text-foreground">{intake?.full_name || "you"}</strong>
            {intake?.organization_name && <> / <strong className="text-foreground">{intake.organization_name}</strong></>} by Vitalis Health Strategies Inc. Do not distribute or share without written authorization.
          </p>
        </div>
      </div>

      {/* Report Body */}
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-8 space-y-8">
        {/* Overview */}
        <ReportCard title="Overview" icon={<User className="h-5 w-5" />}>
          <div className="grid sm:grid-cols-2 gap-4">
            <InfoRow icon={<User className="h-4 w-4" />} label="Contact" value={intake?.full_name || "—"} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Organization" value={intake?.organization_name || "—"} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={formatPhone(intake?.phone) || "—"} />
            <InfoRow icon={<Stethoscope className="h-4 w-4" />} label="Specialty" value={intake?.specialty || "—"} />
            <InfoRow icon={<FileText className="h-4 w-4" />} label="Email" value={intake?.email || "—"} />
            <InfoRow icon={<FileText className="h-4 w-4" />} label="Practice Type" value={intake?.practice_type || "—"} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={[intake?.city, intake?.province_state, intake?.country].filter(Boolean).join(", ") || "—"} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Submitted" value={formatDate(session?.submitted_at)} />
          </div>
        </ReportCard>

        {/* Executive Summary */}
        {executiveSummary && (
          <ReportCard title="Executive Summary" icon={<FileText className="h-5 w-5" />}>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {getEditedText("executive_summary", 0, executiveSummary)}
            </p>
          </ReportCard>
        )}

        {/* Detailed Findings */}
        {sectionAnalyses.length > 0 && (
          <ReportCard title="Detailed Findings" icon={<Target className="h-5 w-5" />}>
            <div className="space-y-6">
              {sectionAnalyses.map((sa: any, i: number) => (
                <div key={i} className="border border-border/40 rounded-xl p-5">
                  <h4 className="font-display text-base font-bold text-foreground mb-3">{sa.section_title}</h4>
                  {sa.summary && (
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {getEditedText(`section_summary_${i}`, 0, sa.summary)}
                    </p>
                  )}
                  {sa.operational_gaps.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Areas for Improvement</p>
                      <ul className="space-y-1.5">
                        {sa.operational_gaps.map((gap: string, gi: number) => (
                          <li key={gi} className="text-sm text-foreground leading-relaxed">
                            {getEditedText(`section_gap_${i}`, gi, gap)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {sa.improvement_opportunities.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Opportunities</p>
                      <ul className="space-y-1.5">
                        {sa.improvement_opportunities.map((opp: string, oi: number) => (
                          <li key={oi} className="text-sm text-foreground leading-relaxed">
                            {getEditedText(`section_opp_${i}`, oi, opp)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ReportCard>
        )}

        {/* Key Findings */}
        {keyFindings.length > 0 && (
          <ReportCard title="Key Findings" icon={<AlertTriangle className="h-5 w-5" />}>
            <FindingsCategoryDonut findings={keyFindings} />
            <div className="space-y-3">
              {keyFindings.map((c: any, i: number) => (
                <div key={i} className="bg-secondary/20 rounded-xl p-4">
                  {c.type && <Badge variant="outline" className="text-[10px] mb-2">{c.type}</Badge>}
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {getEditedText("key_finding", i, c.description)}
                  </p>
                </div>
              ))}
            </div>
          </ReportCard>
        )}

        {/* Financial Overview */}
        {extractFinancialData(analysis) && (
          <ReportCard title="Financial Overview" icon={<Target className="h-5 w-5" />}>
            <FinancialWaterfallChart data={extractFinancialData(analysis)!} />
          </ReportCard>
        )}

        {/* Priority Focus Areas */}
        {focusAreas.length > 0 && (
          <ReportCard title="Priority Focus Areas" icon={<Target className="h-5 w-5" />}>
            <FocusAreasTimeline focusAreas={focusAreas} showLabels={false} />
            <div className="space-y-3">
              {focusAreas.map((f: any, i: number) => (
                <div key={i} className="bg-secondary/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{f.area}</span>
                    {f.priority && <Badge variant="outline" className="text-[10px]">{f.priority.replace(/_/g, " ")}</Badge>}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {getEditedText("focus_area", i, f.rationale)}
                  </p>
                </div>
              ))}
            </div>
          </ReportCard>
        )}

        {/* Opportunities */}
        {opportunities.length > 0 && (
          <ReportCard title="Opportunities" icon={<Lightbulb className="h-5 w-5" />}>
            <div className="space-y-3">
              {opportunities.map((o: any, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-secondary/20 rounded-xl p-4">
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {getEditedText("opportunity", i, o.description)}
                    </p>
                    {o.category && <p className="text-xs text-muted-foreground mt-1">{o.category.replace(/_/g, " ")}</p>}
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>
        )}

        {/* Recommended Next Steps */}
        {nextSteps.length > 0 && (
          <ReportCard title="Recommended Next Steps" icon={<ArrowRight className="h-5 w-5" />}>
            <div className="space-y-3">
              {nextSteps.map((n: any, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-secondary/20 rounded-xl p-4">
                  <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-accent">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {getEditedText("next_step", i, n.recommendation)}
                    </p>
                    {n.category && <Badge variant="outline" className="text-[10px] mt-1">{n.category}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>
        )}
      </div>

      {/* Footer */}
      <div className="bg-card border-t border-border/40 mt-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-10 text-center space-y-4">
          <div>
            <p className="text-sm font-bold text-foreground font-display">Vitalis Health Strategies</p>
            <p className="text-xs text-muted-foreground mt-1">Calgary, Alberta, Canada</p>
            <p className="text-xs text-muted-foreground mt-1">
              <a href="mailto:info@vitalisstrategies.com" className="text-accent hover:underline">info@vitalisstrategies.com</a>
              {" · "}
              <a href="https://vitalisstrategies.com" className="text-accent hover:underline">vitalisstrategies.com</a>
            </p>
          </div>
          <div className="border-t border-border/40 pt-4">
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed max-w-2xl mx-auto">
              This report was prepared exclusively for {intake?.full_name || "the recipient"}
              {intake?.organization_name && ` and ${intake.organization_name}`} by Vitalis Health Strategies Inc. and is strictly confidential.
              © {new Date().getFullYear()} Vitalis Health Strategies Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
