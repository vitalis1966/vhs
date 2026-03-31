import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  ArrowLeft,
  Pencil,
  RotateCcw,
  Send,
  Download,
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
  Copy,
  Link as LinkIcon,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const vitalisLogo = "/vitalis-logo.webp";
import BookingWidget from "@/components/BookingWidget";
import {
  FindingsCategoryDonut,
  FocusAreasTimeline,
  FinancialWaterfallChart,
  extractFinancialData,
} from "@/components/admin/ReportCharts";

// ─── Text transformation ───────────────────────────────────────────────────────

const replacements: [RegExp, string][] = [
  [/\bthe client\b/gi, "your organization"],
  [/\bcritical failure\b/gi, "opportunity for improvement"],
  [/\bextremely concerning\b/gi, "area requiring attention"],
  [/\bhighly dissatisfied\b/gi, "looking for improvement"],
  [/\bextreme dissatisfaction\b/gi, "looking for improvement"],
  [/\d+\s*\/\s*100/g, ""],
  [/\d+\s+out\s+of\s+100/gi, ""],
];

function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)})${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

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
  // Clean up double spaces left by removals
  result = result.replace(/\s{2,}/g, " ").trim();
  // Ensure first character is capitalized
  result = capitalizeFirst(result);
  return result;
}

function transformArray(arr: string[] | undefined): string[] {
  if (!arr) return [];
  return arr.map(transformText);
}

// ─── Editable Block ────────────────────────────────────────────────────────────

interface EditableBlockProps {
  sectionKey: string;
  itemIndex?: number;
  text: string;
  edits: Record<string, string>;
  onSave: (key: string, index: number, original: string, edited: string) => void;
  as?: "p" | "li";
}

function EditableBlock({ sectionKey, itemIndex = 0, text, edits, onSave, as = "p" }: EditableBlockProps) {
  const editKey = `${sectionKey}__${itemIndex}`;
  const displayText = edits[editKey] ?? text;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(edits[editKey] ?? text);
  }, [edits, editKey, text]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      const ta = textareaRef.current;
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
      ta.focus();
    }
  }, [editing]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const save = () => {
    onSave(sectionKey, itemIndex, text, draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(edits[editKey] ?? text);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="no-print space-y-2">
        <Textarea
          ref={textareaRef}
          value={draft}
          onChange={handleInput}
          className="text-sm min-h-0 resize-none overflow-hidden"
          rows={1}
        />
        <div className="flex gap-2">
          <Button size="sm" variant="default" onClick={save}>Save</Button>
          <Button size="sm" variant="ghost" onClick={cancel}>Cancel</Button>
        </div>
      </div>
    );
  }

  const Tag = as;
  return (
    <div className="group relative">
      <Tag className="text-sm text-foreground leading-relaxed whitespace-pre-wrap pr-8">
        {displayText}
      </Tag>
      <button
        onClick={() => setEditing(true)}
        className="no-print absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground"
        aria-label="Edit"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Report Card (clean, no color badges) ──────────────────────────────────────

function ClientReportCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden print:shadow-none print:border print:break-inside-avoid-page">
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

// ─── Main Component ────────────────────────────────────────────────────────────

function getCleanAssessmentName(slug?: string, title?: string): string {
  if (slug) {
    if (slug.includes("new-build") || slug.includes("new-clinic")) return "Your Build Strategy Assessment";
    if (slug.includes("existing")) return "Your Performance Assessment";
    if (slug.includes("healthcare-it") || slug.includes("it")) return "Your Healthcare IT Assessment";
  }
  if (title) {
    const t = title.toLowerCase();
    if (t.includes("build") || t.includes("new clinic")) return "Your Build Strategy Assessment";
    if (t.includes("performance") || t.includes("existing")) return "Your Performance Assessment";
    if (t.includes("healthcare it") || t.includes(" it")) return "Your Healthcare IT Assessment";
  }
  return "Your Strategic Assessment";
}

export default function ClientReport() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [intake, setIntake] = useState<any>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [originalEdits, setOriginalEdits] = useState<Record<string, { original: string; edited: string }>>({});

  // Send dialog state
  const [sendOpen, setSendOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [linkTokens, setLinkTokens] = useState<any[]>([]);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [revokeConfirmId, setRevokeConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) loadAll();
  }, [sessionId]);

  const loadAll = async () => {
    setLoading(true);

    const { data: sess } = await (supabase.from("assessment_sessions" as any).select("*").eq("id", sessionId).single() as any);
    setSession(sess);
    if (!sess) { setLoading(false); return; }

    const [assessRes, intakeRes, reportRes, editsRes, tokensRes] = await Promise.all([
      supabase.from("assessments" as any).select("*").eq("id", sess.assessment_id).single() as any,
      sess.intake_id ? supabase.from("assessment_intakes" as any).select("*").eq("id", sess.intake_id).single() as any : Promise.resolve({ data: null }),
      supabase.from("internal_assessment_reports" as any).select("*").eq("session_id", sessionId).single() as any,
      supabase.from("client_report_edits" as any).select("*").eq("session_id", sessionId) as any,
      supabase.from("client_report_tokens" as any).select("*").eq("session_id", sessionId).order("created_at", { ascending: false }) as any,
    ]);

    setAssessment(assessRes.data);
    setIntake(intakeRes.data);
    setReport(reportRes.data);

    // Restore persisted edits
    const editMap: Record<string, string> = {};
    const origMap: Record<string, { original: string; edited: string }> = {};
    for (const e of editsRes.data || []) {
      const key = `${e.section_key}__${e.item_index}`;
      editMap[key] = e.edited_text;
      origMap[key] = { original: e.original_text, edited: e.edited_text };
    }
    setEdits(editMap);
    setOriginalEdits(origMap);
    setLinkTokens(tokensRes.data || []);

    // Pre-fill send dialog
    if (intakeRes.data) {
      setEmailTo(intakeRes.data.email || "");
      const cleanAssessmentName = getCleanAssessmentName(assessRes.data?.slug, assessRes.data?.title);
      setEmailSubject(`${cleanAssessmentName} — ${intakeRes.data.organization_name || intakeRes.data.full_name}`);
      setEmailBody(`Dear ${intakeRes.data.full_name},\n\nPlease find attached the findings from your recent strategic assessment. We look forward to discussing these insights with you.\n\nWarm regards,\nVitalis Health Strategies`);
    }

    setLoading(false);
  };

  const handleSaveEdit = useCallback(async (sectionKey: string, itemIndex: number, original: string, edited: string) => {
    const key = `${sectionKey}__${itemIndex}`;
    setEdits(prev => ({ ...prev, [key]: edited }));
    setOriginalEdits(prev => ({ ...prev, [key]: { original, edited } }));

    // Persist to DB
    await (supabase.from("client_report_edits" as any) as any).upsert(
      { session_id: sessionId, section_key: sectionKey, item_index: itemIndex, original_text: original, edited_text: edited, updated_at: new Date().toISOString() },
      { onConflict: "session_id,section_key,item_index" }
    );
  }, [sessionId]);

  const handleResetAll = async () => {
    await (supabase.from("client_report_edits" as any).delete().eq("session_id", sessionId) as any);
    setEdits({});
    setOriginalEdits({});
    toast({ title: "Reset Complete", description: "All edits have been restored to the generated version." });
  };

  const getReportSections = (): string[] => {
    const sections: string[] = [];
    if (analysis.executive_summary) sections.push("Executive Summary");
    if ((analysis.section_analyses || []).length > 0) sections.push("Detailed Findings");
    if ((analysis.concerns || []).length > 0) sections.push("Key Findings");
    if (extractFinancialData(analysis)) sections.push("Financial Overview");
    if ((analysis.focus_areas || []).length > 0) sections.push("Priority Focus Areas");
    if ((analysis.opportunities || []).length > 0) sections.push("Opportunities");
    if ((analysis.recommended_next_steps || []).length > 0) sections.push("Recommended Next Steps");
    return sections;
  };

  const handleSendReport = async () => {
    setSending(true);
    setSendError("");
    try {
      const res = await supabase.functions.invoke("send-assessment-email", {
        body: {
          email_type: "client_report",
          recipient_email: emailTo,
          session_id: sessionId,
          intake_id: intake?.id,
          template_data: {
            client_name: intake?.full_name || "Valued Client",
            organization: intake?.organization_name || "",
            report_url: `${window.location.origin}/admin/submissions/${sessionId}/client-report`,
            subject_line: emailSubject,
            message_body: emailBody,
            report_sections: getReportSections(),
          },
        },
      });
      if (res.error) throw new Error(res.error.message);
      setSentToEmail(emailTo);
      setReportSent(true);
      setSending(false);
      // Refresh tokens list after successful send
      const { data: newTokens } = await (supabase.from("client_report_tokens" as any).select("*").eq("session_id", sessionId).order("created_at", { ascending: false }) as any);
      setLinkTokens(newTokens || []);
    } catch (err: any) {
      setSendError(err.message || "Failed to send report. Please try again.");
      setSending(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const reportContainer = document.getElementById("report-content");
      if (!reportContainer) { setIsGeneratingPDF(false); return; }

      // Clone and remove no-print elements
      const clone = reportContainer.cloneNode(true) as HTMLElement;
      clone.querySelectorAll(".no-print").forEach(el => el.remove());
      clone.querySelectorAll(".print-footer-spacer").forEach(el => el.remove());

      // Remove booking section
      Array.from(clone.querySelectorAll("h3")).forEach(el => {
        if (el.textContent?.toLowerCase().includes("book") || el.textContent?.toLowerCase().includes("discovery")) {
          const section = el.closest("[class*='bg-card']") || el.parentElement;
          section?.remove();
        }
      });

      // Mount clone off-screen for capture
      const wrapper = document.createElement("div");
      wrapper.style.cssText = "position:fixed;top:-9999px;left:0;width:1100px;background:#f9f6f1;padding:16px 40px 40px;";

      // Add styles for better PDF rendering of card sections
      const pdfStyle = document.createElement("style");
      pdfStyle.textContent = `
        .bg-card {
          border: 1px solid #dde4e0 !important;
          margin-bottom: 16px !important;
          page-break-inside: avoid !important;
        }
      `;
      wrapper.appendChild(pdfStyle);
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      await new Promise(r => setTimeout(r, 500));

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f9f6f1",
        windowWidth: 1100,
        scrollY: 0,
        height: wrapper.scrollHeight,
      });

      document.body.removeChild(wrapper);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const headerH = 14;
      const footerH = 10;
      const contentH = pageH - headerH - footerH - margin * 2 - 8;
      const imgW = pageW - margin * 2;
      const totalImgH = (canvas.height * imgW) / canvas.width;
      const totalPages = Math.ceil(totalImgH / contentH);
      const organization = intake?.organization_name || intake?.full_name || "Client";

      const addHeaderFooter = (pageNum: number) => {
        pdf.setFontSize(7);
        pdf.setTextColor(169, 177, 161);
        pdf.text("CONFIDENTIAL — Vitalis Health Strategies Inc.", margin, 8);
        pdf.text("vitalisstrategies.com", pageW - margin, 8, { align: "right" });
        pdf.setDrawColor(200, 151, 65);
        pdf.setLineWidth(0.4);
        pdf.line(margin, 10, pageW - margin, 10);

        pdf.setDrawColor(221, 228, 224);
        pdf.setLineWidth(0.3);
        pdf.line(margin, pageH - footerH - 2, pageW - margin, pageH - footerH - 2);
        pdf.setFontSize(7);
        pdf.setTextColor(169, 177, 161);
        pdf.text(`Confidential — Prepared for ${organization} by Vitalis Health Strategies Inc.`, margin, pageH - 6);
        pdf.text(`Page ${pageNum} of ${totalPages}`, pageW - margin, pageH - 6, { align: "right" });
      };

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const srcY = page * contentH * (canvas.height / totalImgH);
        const srcH = Math.min(contentH * (canvas.height / totalImgH), canvas.height - srcY);

        // Skip near-empty last page
        if (srcH < 100) {
          if (page > 0) {
            // Remove the just-added blank page
            const pageCount = (pdf as any).internal.getNumberOfPages();
            if (pageCount > 1) (pdf as any).deletePage(pageCount);
          }
          continue;
        }

        addHeaderFooter(page + 1);

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = srcH;
        const ctx = sliceCanvas.getContext("2d");
        if (ctx) ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

        const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.95);
        const sliceH = (srcH * imgW) / canvas.width;
        pdf.addImage(sliceData, "JPEG", margin, headerH + margin, imgW, sliceH);
      }

      const today = new Date().toISOString().split("T")[0];
      const safeName = organization.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
      pdf.save(`Vitalis-Assessment-${safeName}-${today}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      toast({ title: "PDF Error", description: "Could not generate PDF. Try again.", variant: "destructive" });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!session || !report) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Report not available.</p>
        <Button variant="outline" asChild>
          <Link to={`/admin/submissions/${sessionId}`}>← Back to Internal Report</Link>
        </Button>
      </div>
    );
  }

  const analysis = (() => {
    let data = report.analysis_data || {};
    // Robust parsing: handle multiple malformed storage patterns
    const tryParseJSON = (raw: string): any | null => {
      try {
        let cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
        return JSON.parse(cleaned);
      } catch (e1) {
        try {
          const first = raw.indexOf("{");
          const last = raw.lastIndexOf("}");
          if (first !== -1 && last > first) {
            return JSON.parse(raw.substring(first, last + 1));
          }
        } catch (e2) { /* fall through */ }
        return null;
      }
    };

    // Case 1: executive_summary contains the full JSON blob (parse_error scenario)
    if (data.executive_summary && typeof data.executive_summary === "string") {
      const es = data.executive_summary.trim();
      if (es.startsWith("```") || es.startsWith("{")) {
        const parsed = tryParseJSON(es);
        if (parsed && typeof parsed === "object") {
          console.log("[ClientReport] Extracted structured data from executive_summary string");
          data = { ...data, ...parsed, executive_summary: parsed.executive_summary || "", parse_error: undefined };
        } else {
          console.error("[ClientReport] Could not parse executive_summary JSON — will show fallback");
          data = { ...data, executive_summary: "", _malformed: true };
        }
      }
    }

    // Case 2: analysis_data itself might be a string
    if (typeof data === "string") {
      const parsed = tryParseJSON(data);
      if (parsed) {
        data = parsed;
      } else {
        console.error("[ClientReport] analysis_data is an unparseable string");
        data = { executive_summary: "", _malformed: true };
      }
    }

    return data;
  })();
  const orgName = intake?.organization_name || intake?.full_name || "Your Organization";

  // Transform analysis data
  const executiveSummary = transformText(analysis.executive_summary || "");

  const sectionAnalyses = (analysis.section_analyses || []).map((sa: any) => ({
    section_title: sa.section_title,
    summary: transformText(sa.summary || ""),
    operational_gaps: transformArray(sa.operational_gaps),
    improvement_opportunities: transformArray(sa.improvement_opportunities),
    // Strip: score, severity, notable_signals, strategic_gaps kept internal
  }));

  const keyFindings = (analysis.concerns || []).map((c: any) => ({
    description: transformText(c.description || ""),
    type: c.type,
    // Remove severity entirely
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
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 20mm 15mm 30mm 15mm; }
          .print-footer-spacer { height: 40px; }
          .print-confidential-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #999;
            padding: 8px 0;
            border-top: 1px solid #e5e5e5;
          }
        }
        @media screen {
          .print-confidential-footer { display: none; }
        }
      `}</style>

      {/* Print-only repeating footer */}
      <div className="print-confidential-footer">
        Confidential — Prepared exclusively for {orgName}
      </div>

      <div className="min-h-screen bg-background print:bg-white">
        {/* Toolbar */}
        <div className="no-print sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/40">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-3 flex items-center justify-between flex-wrap gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/admin/submissions/${sessionId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Internal Report
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Generated
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset all edits?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure? All your edits will be lost. This will restore all sections to the AI-generated version.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetAll}>Reset All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
              </Button>
              {reportSent ? (
                <Button size="sm" disabled className="bg-accent/20 text-accent border border-accent/30">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Report Sent ✓
                </Button>
              ) : (
                <Button size="sm" onClick={() => setSendOpen(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Report to Client
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Header with Vitalis branding */}
        <div className="bg-card border-b border-border/40 print:border-b-2 print:border-accent">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-10 text-center">
            <img src={vitalisLogo} alt="Vitalis Health Strategies" className="h-12 mx-auto mb-4 print:h-10" />
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-2">
              Strategic Assessment Report
            </h1>
            <p className="text-muted-foreground text-base">
              Prepared for: <span className="font-semibold text-foreground">{orgName}</span>
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              {formatDate(session?.submitted_at)}
            </p>
          </div>
        </div>

        {/* Report Body */}
        <div id="report-content" className="container mx-auto px-4 lg:px-8 max-w-5xl py-8 space-y-8">

          {/* Client Overview */}
          <ClientReportCard title="Overview" icon={<User className="h-5 w-5" />}>
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
          </ClientReportCard>

          {/* Executive Summary */}
          {executiveSummary && (
            <ClientReportCard title="Executive Summary" icon={<FileText className="h-5 w-5" />}>
              <EditableBlock sectionKey="executive_summary" text={executiveSummary} edits={edits} onSave={handleSaveEdit} />
            </ClientReportCard>
          )}

          {/* Section Analysis — only gaps & opportunities */}
          {sectionAnalyses.length > 0 && (
            <ClientReportCard title="Detailed Findings" icon={<Target className="h-5 w-5" />}>
              <div className="space-y-6">
                {sectionAnalyses.map((sa: any, i: number) => (
                  <div key={i} className="border border-border/40 rounded-xl p-5">
                    <h4 className="font-display text-base font-bold text-foreground mb-3">{sa.section_title}</h4>
                    {sa.summary && (
                      <EditableBlock sectionKey={`section_summary_${i}`} text={sa.summary} edits={edits} onSave={handleSaveEdit} />
                    )}
                    {sa.operational_gaps.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Areas for Improvement</p>
                        <ul className="space-y-1.5">
                          {sa.operational_gaps.map((gap: string, gi: number) => (
                            <li key={gi}>
                              <EditableBlock sectionKey={`section_gap_${i}`} itemIndex={gi} text={gap} edits={edits} onSave={handleSaveEdit} as="li" />
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
                            <li key={oi}>
                              <EditableBlock sectionKey={`section_opp_${i}`} itemIndex={oi} text={opp} edits={edits} onSave={handleSaveEdit} as="li" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ClientReportCard>
          )}

          {/* Key Findings (was "Areas of Concern") */}
          {keyFindings.length > 0 && (
            <ClientReportCard title="Key Findings" icon={<AlertTriangle className="h-5 w-5" />}>
              <FindingsCategoryDonut findings={keyFindings} />
              <div className="space-y-3">
                {keyFindings.map((c: any, i: number) => (
                  <div key={i} className="bg-secondary/20 rounded-xl p-4">
                    {c.type && <Badge variant="outline" className="text-[10px] mb-2">{c.type}</Badge>}
                    <EditableBlock sectionKey="key_finding" itemIndex={i} text={c.description} edits={edits} onSave={handleSaveEdit} />
                  </div>
                ))}
              </div>
            </ClientReportCard>
          )}

          {/* Financial Waterfall (if data found) */}
          {extractFinancialData(analysis) && (
            <ClientReportCard title="Financial Overview" icon={<Target className="h-5 w-5" />}>
              <FinancialWaterfallChart data={extractFinancialData(analysis)!} />
            </ClientReportCard>
          )}

          {/* Priority Focus Areas */}
          {focusAreas.length > 0 && (
            <ClientReportCard title="Priority Focus Areas" icon={<Target className="h-5 w-5" />}>
              <FocusAreasTimeline focusAreas={focusAreas} showLabels={false} />
              <div className="space-y-3">
                {focusAreas.map((f: any, i: number) => (
                  <div key={i} className="bg-secondary/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{f.area}</span>
                      {f.priority && <Badge variant="outline" className="text-[10px]">{f.priority.replace(/_/g, " ")}</Badge>}
                    </div>
                    <EditableBlock sectionKey="focus_area" itemIndex={i} text={f.rationale} edits={edits} onSave={handleSaveEdit} />
                  </div>
                ))}
              </div>
            </ClientReportCard>
          )}

          {/* Opportunities */}
          {opportunities.length > 0 && (
            <ClientReportCard title="Opportunities" icon={<Lightbulb className="h-5 w-5" />}>
              <div className="space-y-3">
                {opportunities.map((o: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/20 rounded-xl p-4">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <EditableBlock sectionKey="opportunity" itemIndex={i} text={o.description} edits={edits} onSave={handleSaveEdit} />
                      {o.category && <p className="text-xs text-muted-foreground mt-1">{o.category.replace(/_/g, " ")}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </ClientReportCard>
          )}

          {/* Recommended Next Steps */}
          {nextSteps.length > 0 && (
            <ClientReportCard title="Recommended Next Steps" icon={<ArrowRight className="h-5 w-5" />}>
              <div className="space-y-3">
                {nextSteps.map((n: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/20 rounded-xl p-4">
                    <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-accent">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <EditableBlock sectionKey="next_step" itemIndex={i} text={n.recommendation} edits={edits} onSave={handleSaveEdit} />
                      {n.category && <Badge variant="outline" className="text-[10px] mt-1">{n.category}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </ClientReportCard>
          )}

          {/* Link Activity removed from here — moved to top */}

          <div className="no-print space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground text-center">
              Ready to get started? Book a discovery call
            </h3>
            <BookingWidget sessionId={sessionId} bookedBy="admin" />
          </div>

          {/* Bottom Send button */}
          <div className="no-print flex justify-center pt-4 pb-8">
            {reportSent ? (
              <Button size="lg" disabled className="bg-accent/20 text-accent border border-accent/30">
                <CheckCircle className="mr-2 h-4 w-4" />
                Report Sent ✓
              </Button>
            ) : (
              <Button size="lg" onClick={() => setSendOpen(true)}>
                <Send className="mr-2 h-4 w-4" />
                Send Report to Client
              </Button>
            )}
          </div>

          {/* Print spacer */}
          <div className="print-footer-spacer" />
        </div>
      </div>

      {/* Send Dialog */}
      <Dialog open={sendOpen} onOpenChange={(open) => { if (!reportSent) setSendOpen(open); else setSendOpen(false); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{reportSent ? "Report Sent" : "Send Report to Client"}</DialogTitle>
            <DialogDescription>{reportSent ? "The report has been delivered." : "Send this client report via email or download as PDF."}</DialogDescription>
          </DialogHeader>
          {reportSent ? (
            <div className="py-4 space-y-3">
              <div className="flex items-start gap-3 bg-accent/10 rounded-xl p-4 border border-accent/20">
                <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Report sent to {sentToEmail}</p>
                  <p className="text-xs text-muted-foreground mt-1">The client has been notified. A record has been logged. This page now shows "Report Sent ✓" to prevent duplicates.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSendOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">To</label>
                  <Input value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="client@email.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Subject</label>
                  <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Message</label>
                  <Textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={4} />
                </div>
                {sendError && (
                  <p className="text-sm text-destructive">{sendError}</p>
                )}
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => { setSendOpen(false); handleDownloadPDF(); }}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Instead
                </Button>
                <Button onClick={handleSendReport} disabled={sending || !emailTo}>
                  {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Send
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
