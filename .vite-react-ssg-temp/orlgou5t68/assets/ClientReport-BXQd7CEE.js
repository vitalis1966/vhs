import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from "react";
import { L as Link } from "./index-CalXArNJ.js";
import { s as supabase } from "./client-B5yO-kwf.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { B as Badge } from "./badge-Bd62qPcf.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { I as Input } from "./label-H2YDHQ-y.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CtjoYuUO.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-BqNA8UQx.js";
import { Loader2, ArrowLeft, RotateCcw, Download, CheckCircle, Send, Link as Link$1, Copy, User, Building2, Phone, Stethoscope, FileText, MapPin, Calendar, Target, AlertTriangle, Lightbulb, ArrowRight, Pencil } from "lucide-react";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
import { B as BookingWidget } from "./BookingWidget-ZppRckzm.js";
import { F as FindingsCategoryDonut, e as extractFinancialData, a as FinancialWaterfallChart, b as FocusAreasTimeline } from "./ReportCharts-sqDjxY9B.js";
import { useParams } from "react-router";
import "react-dom";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-alert-dialog";
import "./card-B9jBE8y5.js";
import "react-day-picker";
import "recharts";
const vitalisLogo = "/vitalis-logo.webp";
const replacements = [
  [/\bthe client\b/gi, "your organization"],
  [/\bcritical failure\b/gi, "opportunity for improvement"],
  [/\bextremely concerning\b/gi, "area requiring attention"],
  [/\bhighly dissatisfied\b/gi, "looking for improvement"],
  [/\bextreme dissatisfaction\b/gi, "looking for improvement"],
  [/\d+\s*\/\s*100/g, ""],
  [/\d+\s+out\s+of\s+100/gi, ""]
];
function formatPhone(phone) {
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
function capitalizeFirst(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
function transformText(text) {
  if (!text) return text;
  let result = text;
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  result = result.replace(/\s{2,}/g, " ").trim();
  result = capitalizeFirst(result);
  return result;
}
function transformArray(arr) {
  if (!arr) return [];
  return arr.map(transformText);
}
function EditableBlock({ sectionKey, itemIndex = 0, text, edits, onSave, as = "p" }) {
  const editKey = `${sectionKey}__${itemIndex}`;
  const displayText = edits[editKey] ?? text;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayText);
  const textareaRef = useRef(null);
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
  const handleInput = (e) => {
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
    return /* @__PURE__ */ jsxs("div", { className: "no-print space-y-2", children: [
      /* @__PURE__ */ jsx(
        Textarea,
        {
          ref: textareaRef,
          value: draft,
          onChange: handleInput,
          className: "text-sm min-h-0 resize-none overflow-hidden",
          rows: 1
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "default", onClick: save, children: "Save" }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: cancel, children: "Cancel" })
      ] })
    ] });
  }
  const Tag = as;
  return /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
    /* @__PURE__ */ jsx(Tag, { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap pr-8", children: displayText }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setEditing(true),
        className: "no-print absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground",
        "aria-label": "Edit",
        children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
      }
    )
  ] });
}
function ClientReportCard({ title, icon, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden print:shadow-none print:border print:break-inside-avoid-page", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-secondary/10", children: [
      /* @__PURE__ */ jsx("span", { className: "text-accent", children: icon }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground", children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children })
  ] });
}
function InfoRow({ icon, label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground mt-0.5", children: icon }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: value })
    ] })
  ] });
}
function getCleanAssessmentName(slug, title) {
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
function ClientReport() {
  const { sessionId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [session, setSession] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [intake, setIntake] = useState(null);
  const [edits, setEdits] = useState({});
  const [originalEdits, setOriginalEdits] = useState({});
  const [sendOpen, setSendOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [linkTokens, setLinkTokens] = useState([]);
  const [copiedTokenId, setCopiedTokenId] = useState(null);
  const [revokeConfirmId, setRevokeConfirmId] = useState(null);
  useEffect(() => {
    if (sessionId) loadAll();
  }, [sessionId]);
  const loadAll = async () => {
    setLoading(true);
    const { data: sess } = await supabase.from("assessment_sessions").select("*").eq("id", sessionId).single();
    setSession(sess);
    if (!sess) {
      setLoading(false);
      return;
    }
    const [assessRes, intakeRes, reportRes, editsRes, tokensRes] = await Promise.all([
      supabase.from("assessments").select("*").eq("id", sess.assessment_id).single(),
      sess.intake_id ? supabase.from("assessment_intakes").select("*").eq("id", sess.intake_id).single() : Promise.resolve({ data: null }),
      supabase.from("internal_assessment_reports").select("*").eq("session_id", sessionId).single(),
      supabase.from("client_report_edits").select("*").eq("session_id", sessionId),
      supabase.from("client_report_tokens").select("*").eq("session_id", sessionId).order("created_at", { ascending: false })
    ]);
    setAssessment(assessRes.data);
    setIntake(intakeRes.data);
    setReport(reportRes.data);
    const editMap = {};
    const origMap = {};
    for (const e of editsRes.data || []) {
      const key = `${e.section_key}__${e.item_index}`;
      editMap[key] = e.edited_text;
      origMap[key] = { original: e.original_text, edited: e.edited_text };
    }
    setEdits(editMap);
    setOriginalEdits(origMap);
    setLinkTokens(tokensRes.data || []);
    if (intakeRes.data) {
      setEmailTo(intakeRes.data.email || "");
      const cleanAssessmentName = getCleanAssessmentName(assessRes.data?.slug, assessRes.data?.title);
      setEmailSubject(`${cleanAssessmentName} — ${intakeRes.data.organization_name || intakeRes.data.full_name}`);
      setEmailBody(`Dear ${intakeRes.data.full_name},

Please find attached the findings from your recent strategic assessment. We look forward to discussing these insights with you.

Warm regards,
Vitalis Health Strategies`);
    }
    setLoading(false);
  };
  const handleSaveEdit = useCallback(async (sectionKey, itemIndex, original, edited) => {
    const key = `${sectionKey}__${itemIndex}`;
    setEdits((prev) => ({ ...prev, [key]: edited }));
    setOriginalEdits((prev) => ({ ...prev, [key]: { original, edited } }));
    await supabase.from("client_report_edits").upsert(
      { session_id: sessionId, section_key: sectionKey, item_index: itemIndex, original_text: original, edited_text: edited, updated_at: (/* @__PURE__ */ new Date()).toISOString() },
      { onConflict: "session_id,section_key,item_index" }
    );
  }, [sessionId]);
  const handleResetAll = async () => {
    await supabase.from("client_report_edits").delete().eq("session_id", sessionId);
    setEdits({});
    setOriginalEdits({});
    toast({ title: "Reset Complete", description: "All edits have been restored to the generated version." });
  };
  const getReportSections = () => {
    const sections = [];
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
            report_sections: getReportSections()
          }
        }
      });
      if (res.error) throw new Error(res.error.message);
      setSentToEmail(emailTo);
      setReportSent(true);
      setSending(false);
      const { data: newTokens } = await supabase.from("client_report_tokens").select("*").eq("session_id", sessionId).order("created_at", { ascending: false });
      setLinkTokens(newTokens || []);
    } catch (err) {
      setSendError(err.message || "Failed to send report. Please try again.");
      setSending(false);
    }
  };
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const reportContainer = document.getElementById("report-content");
      if (!reportContainer) {
        setIsGeneratingPDF(false);
        return;
      }
      const clone = reportContainer.cloneNode(true);
      clone.querySelectorAll(".no-print").forEach((el) => el.remove());
      clone.querySelectorAll(".print-footer-spacer").forEach((el) => el.remove());
      Array.from(clone.querySelectorAll("h3")).forEach((el) => {
        if (el.textContent?.toLowerCase().includes("book") || el.textContent?.toLowerCase().includes("discovery")) {
          const section = el.closest("[class*='bg-card']") || el.parentElement;
          section?.remove();
        }
      });
      const wrapper = document.createElement("div");
      wrapper.style.cssText = "position:fixed;top:-9999px;left:0;width:1100px;background:#f9f6f1;padding:16px 40px 40px;";
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
      await new Promise((r) => setTimeout(r, 500));
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f9f6f1",
        windowWidth: 1100,
        scrollY: 0,
        height: wrapper.scrollHeight
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
      const totalImgH = canvas.height * imgW / canvas.width;
      const totalPages = Math.ceil(totalImgH / contentH);
      const organization = intake?.organization_name || intake?.full_name || "Client";
      const addHeaderFooter = (pageNum) => {
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
        if (srcH < 100) {
          if (page > 0) {
            const pageCount = pdf.internal.getNumberOfPages();
            if (pageCount > 1) pdf.deletePage(pageCount);
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
        const sliceH = srcH * imgW / canvas.width;
        pdf.addImage(sliceData, "JPEG", margin, headerH + margin, imgW, sliceH);
      }
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const safeName = organization.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
      pdf.save(`Vitalis-Assessment-${safeName}-${today}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      toast({ title: "PDF Error", description: "Could not generate PDF. Try again.", variant: "destructive" });
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-accent" }) });
  }
  if (!session || !report) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Report not available." }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: `/admin/submissions/${sessionId}`, children: "← Back to Internal Report" }) })
    ] });
  }
  const analysis = (() => {
    let data = report.analysis_data || {};
    const tryParseJSON = (raw) => {
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
        } catch (e2) {
        }
        return null;
      }
    };
    if (data.executive_summary && typeof data.executive_summary === "string") {
      const es = data.executive_summary.trim();
      if (es.startsWith("```") || es.startsWith("{")) {
        const parsed = tryParseJSON(es);
        if (parsed && typeof parsed === "object") {
          console.log("[ClientReport] Extracted structured data from executive_summary string");
          data = { ...data, ...parsed, executive_summary: parsed.executive_summary || "", parse_error: void 0 };
        } else {
          console.error("[ClientReport] Could not parse executive_summary JSON — will show fallback");
          data = { ...data, executive_summary: "", _malformed: true };
        }
      }
    }
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
  const executiveSummary = transformText(analysis.executive_summary || "");
  const sectionAnalyses = (analysis.section_analyses || []).map((sa) => ({
    section_title: sa.section_title,
    summary: transformText(sa.summary || ""),
    operational_gaps: transformArray(sa.operational_gaps),
    improvement_opportunities: transformArray(sa.improvement_opportunities)
    // Strip: score, severity, notable_signals, strategic_gaps kept internal
  }));
  const keyFindings = (analysis.concerns || []).map((c) => ({
    description: transformText(c.description || ""),
    type: c.type
    // Remove severity entirely
  }));
  const focusAreas = (analysis.focus_areas || []).map((f) => ({
    area: transformText(f.area || ""),
    rationale: transformText(f.rationale || ""),
    priority: f.priority
  }));
  const opportunities = (analysis.opportunities || []).map((o) => ({
    description: transformText(o.description || ""),
    category: o.category,
    potential_impact: o.potential_impact
  }));
  const nextSteps = (analysis.recommended_next_steps || []).map((n) => ({
    recommendation: transformText(n.recommendation || ""),
    category: n.category
  }));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
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
      ` }),
    /* @__PURE__ */ jsxs("div", { className: "print-confidential-footer", children: [
      "Confidential — Prepared exclusively for ",
      orgName
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background print:bg-white", children: [
      /* @__PURE__ */ jsx("div", { className: "no-print sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/40", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl py-3 flex items-center justify-between flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: `/admin/submissions/${sessionId}`, children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Back to Internal Report"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
              /* @__PURE__ */ jsx(RotateCcw, { className: "mr-2 h-4 w-4" }),
              "Reset to Generated"
            ] }) }),
            /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Reset all edits?" }),
                /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you sure? All your edits will be lost. This will restore all sections to the AI-generated version." })
              ] }),
              /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsx(AlertDialogAction, { onClick: handleResetAll, children: "Reset All" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleDownloadPDF, disabled: isGeneratingPDF, children: [
            isGeneratingPDF ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
            isGeneratingPDF ? "Generating PDF..." : "Download PDF"
          ] }),
          reportSent ? /* @__PURE__ */ jsxs(Button, { size: "sm", disabled: true, className: "bg-accent/20 text-accent border border-accent/30", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2 h-4 w-4" }),
            "Report Sent ✓"
          ] }) : /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => setSendOpen(true), children: [
            /* @__PURE__ */ jsx(Send, { className: "mr-2 h-4 w-4" }),
            "Send Report to Client"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "no-print container mx-auto px-4 lg:px-8 max-w-5xl pt-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-secondary/10", children: [
          /* @__PURE__ */ jsx(Link$1, { className: "h-5 w-5 text-accent" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: "Report Links" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Each time you send the report, a new private link is generated for that recipient." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-4", children: linkTokens.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground py-2", children: 'No report links generated yet. Use "Send Report to Client" above to generate a link.' }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/40 text-muted-foreground uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx("th", { className: "text-left py-2 px-2 font-medium", children: "Sent To" }),
            /* @__PURE__ */ jsx("th", { className: "text-left py-2 px-2 font-medium", children: "Generated" }),
            /* @__PURE__ */ jsx("th", { className: "text-left py-2 px-2 font-medium", children: "Last Viewed" }),
            /* @__PURE__ */ jsx("th", { className: "text-center py-2 px-2 font-medium", children: "Views" }),
            /* @__PURE__ */ jsx("th", { className: "text-center py-2 px-2 font-medium", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "text-center py-2 px-2 font-medium", children: "Link" }),
            /* @__PURE__ */ jsx("th", { className: "text-center py-2 px-2 font-medium", children: "Revoke" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: linkTokens.map((t) => {
            const isExpired = t.expires_at && new Date(t.expires_at) < /* @__PURE__ */ new Date();
            const isRevoked = t.is_revoked;
            const isActive = !isExpired && !isRevoked;
            const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : null;
            return /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/20 last:border-0", children: [
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-2 text-foreground", children: t.sent_to_email || "—" }),
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-2 text-muted-foreground", children: fmtDate(t.created_at) || "—" }),
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-2 text-muted-foreground", children: fmtDate(t.accessed_at) || "Never" }),
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-2 text-center text-foreground font-medium", children: t.access_count || 0 }),
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-2 text-center", children: isRevoked ? /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-[10px]", children: "Revoked" }) : isExpired ? /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] text-muted-foreground border-muted-foreground/30", children: "Expired" }) : /* @__PURE__ */ jsx(Badge, { className: "text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white border-0", children: "Active" }) }),
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-2 text-center", children: isActive ? /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 text-[11px] px-2",
                  onClick: () => {
                    navigator.clipboard.writeText(`https://vitalisstrategies.com/report/${t.token}`);
                    setCopiedTokenId(t.id);
                    setTimeout(() => setCopiedTokenId(null), 2e3);
                  },
                  children: copiedTokenId === t.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "mr-1 h-3 w-3" }),
                    "Copied!"
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Copy, { className: "mr-1 h-3 w-3" }),
                    "Copy"
                  ] })
                }
              ) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-2 text-center", children: isActive ? revokeConfirmId === t.id ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 justify-center", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "destructive",
                    size: "sm",
                    className: "h-7 text-[11px] px-2",
                    onClick: async () => {
                      await supabase.from("client_report_tokens").update({ is_revoked: true }).eq("id", t.id);
                      setLinkTokens((prev) => prev.map((lt) => lt.id === t.id ? { ...lt, is_revoked: true } : lt));
                      setRevokeConfirmId(null);
                      toast({ title: "Link Revoked", description: "The recipient can no longer access this report." });
                    },
                    children: "Confirm"
                  }
                ),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "h-7 text-[11px] px-2", onClick: () => setRevokeConfirmId(null), children: "Cancel" })
              ] }) : /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 text-[11px] px-2 text-destructive border-destructive/30 hover:bg-destructive/10",
                  onClick: () => setRevokeConfirmId(t.id),
                  children: "Revoke"
                }
              ) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "—" }) })
            ] }, t.id);
          }) })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-card border-b border-border/40 print:border-b-2 print:border-accent", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl py-10 text-center", children: [
        /* @__PURE__ */ jsx("img", { src: vitalisLogo, alt: "Vitalis Health Strategies", className: "h-12 mx-auto mb-4 print:h-10" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-2", children: "Strategic Assessment Report" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-base", children: [
          "Prepared for: ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: orgName })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/60 mt-2", children: formatDate(session?.submitted_at) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { id: "report-content", className: "container mx-auto px-4 lg:px-8 max-w-5xl py-8 space-y-8", children: [
        /* @__PURE__ */ jsx(ClientReportCard, { title: "Overview", icon: /* @__PURE__ */ jsx(User, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), label: "Contact", value: intake?.full_name || "—" }),
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }), label: "Organization", value: intake?.organization_name || "—" }),
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }), label: "Phone", value: formatPhone(intake?.phone) || "—" }),
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Stethoscope, { className: "h-4 w-4" }), label: "Specialty", value: intake?.specialty || "—" }),
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), label: "Email", value: intake?.email || "—" }),
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), label: "Practice Type", value: intake?.practice_type || "—" }),
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }), label: "Location", value: [intake?.city, intake?.province_state, intake?.country].filter(Boolean).join(", ") || "—" }),
          /* @__PURE__ */ jsx(InfoRow, { icon: /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }), label: "Submitted", value: formatDate(session?.submitted_at) })
        ] }) }),
        executiveSummary && /* @__PURE__ */ jsx(ClientReportCard, { title: "Executive Summary", icon: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx(EditableBlock, { sectionKey: "executive_summary", text: executiveSummary, edits, onSave: handleSaveEdit }) }),
        sectionAnalyses.length > 0 && /* @__PURE__ */ jsx(ClientReportCard, { title: "Detailed Findings", icon: /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: sectionAnalyses.map((sa, i) => /* @__PURE__ */ jsxs("div", { className: "border border-border/40 rounded-xl p-5", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-display text-base font-bold text-foreground mb-3", children: sa.section_title }),
          sa.summary && /* @__PURE__ */ jsx(EditableBlock, { sectionKey: `section_summary_${i}`, text: sa.summary, edits, onSave: handleSaveEdit }),
          sa.operational_gaps.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Areas for Improvement" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: sa.operational_gaps.map((gap, gi) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(EditableBlock, { sectionKey: `section_gap_${i}`, itemIndex: gi, text: gap, edits, onSave: handleSaveEdit, as: "li" }) }, gi)) })
          ] }),
          sa.improvement_opportunities.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Opportunities" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: sa.improvement_opportunities.map((opp, oi) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(EditableBlock, { sectionKey: `section_opp_${i}`, itemIndex: oi, text: opp, edits, onSave: handleSaveEdit, as: "li" }) }, oi)) })
          ] })
        ] }, i)) }) }),
        keyFindings.length > 0 && /* @__PURE__ */ jsxs(ClientReportCard, { title: "Key Findings", icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }), children: [
          /* @__PURE__ */ jsx(FindingsCategoryDonut, { findings: keyFindings }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: keyFindings.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary/20 rounded-xl p-4", children: [
            c.type && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] mb-2", children: c.type }),
            /* @__PURE__ */ jsx(EditableBlock, { sectionKey: "key_finding", itemIndex: i, text: c.description, edits, onSave: handleSaveEdit })
          ] }, i)) })
        ] }),
        extractFinancialData(analysis) && /* @__PURE__ */ jsx(ClientReportCard, { title: "Financial Overview", icon: /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx(FinancialWaterfallChart, { data: extractFinancialData(analysis) }) }),
        focusAreas.length > 0 && /* @__PURE__ */ jsxs(ClientReportCard, { title: "Priority Focus Areas", icon: /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }), children: [
          /* @__PURE__ */ jsx(FocusAreasTimeline, { focusAreas, showLabels: false }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: focusAreas.map((f, i) => /* @__PURE__ */ jsxs("div", { className: "bg-secondary/20 rounded-xl p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: f.area }),
              f.priority && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: f.priority.replace(/_/g, " ") })
            ] }),
            /* @__PURE__ */ jsx(EditableBlock, { sectionKey: "focus_area", itemIndex: i, text: f.rationale, edits, onSave: handleSaveEdit })
          ] }, i)) })
        ] }),
        opportunities.length > 0 && /* @__PURE__ */ jsx(ClientReportCard, { title: "Opportunities", icon: /* @__PURE__ */ jsx(Lightbulb, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: opportunities.map((o, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-secondary/20 rounded-xl p-4", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx(EditableBlock, { sectionKey: "opportunity", itemIndex: i, text: o.description, edits, onSave: handleSaveEdit }),
            o.category && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: o.category.replace(/_/g, " ") })
          ] })
        ] }, i)) }) }),
        nextSteps.length > 0 && /* @__PURE__ */ jsx(ClientReportCard, { title: "Recommended Next Steps", icon: /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" }), children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: nextSteps.map((n, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-secondary/20 rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-accent", children: i + 1 }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx(EditableBlock, { sectionKey: "next_step", itemIndex: i, text: n.recommendation, edits, onSave: handleSaveEdit }),
            n.category && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px] mt-1", children: n.category })
          ] })
        ] }, i)) }) }),
        /* @__PURE__ */ jsxs("div", { className: "no-print space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground text-center", children: "Ready to get started? Book a discovery call" }),
          /* @__PURE__ */ jsx(BookingWidget, { sessionId, bookedBy: "admin" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "no-print flex justify-center pt-4 pb-8", children: reportSent ? /* @__PURE__ */ jsxs(Button, { size: "lg", disabled: true, className: "bg-accent/20 text-accent border border-accent/30", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "mr-2 h-4 w-4" }),
          "Report Sent ✓"
        ] }) : /* @__PURE__ */ jsxs(Button, { size: "lg", onClick: () => setSendOpen(true), children: [
          /* @__PURE__ */ jsx(Send, { className: "mr-2 h-4 w-4" }),
          "Send Report to Client"
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "print-footer-spacer" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: sendOpen, onOpenChange: (open) => {
      if (!reportSent) setSendOpen(open);
      else setSendOpen(false);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: reportSent ? "Report Sent" : "Send Report to Client" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: reportSent ? "The report has been delivered." : "Send this client report via email or download as PDF." })
      ] }),
      reportSent ? /* @__PURE__ */ jsxs("div", { className: "py-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-accent/10 rounded-xl p-4 border border-accent/20", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-accent mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
              "Report sent to ",
              sentToEmail
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: 'The client has been notified. A record has been logged. This page now shows "Report Sent ✓" to prevent duplicates.' })
          ] })
        ] }),
        /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setSendOpen(false), children: "Close" }) })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "To" }),
            /* @__PURE__ */ jsx(Input, { value: emailTo, onChange: (e) => setEmailTo(e.target.value), placeholder: "client@email.com" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Subject" }),
            /* @__PURE__ */ jsx(Input, { value: emailSubject, onChange: (e) => setEmailSubject(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Message" }),
            /* @__PURE__ */ jsx(Textarea, { value: emailBody, onChange: (e) => setEmailBody(e.target.value), rows: 4 })
          ] }),
          sendError && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: sendError })
        ] }),
        /* @__PURE__ */ jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => {
            setSendOpen(false);
            handleDownloadPDF();
          }, children: [
            /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
            "Download PDF Instead"
          ] }),
          /* @__PURE__ */ jsxs(Button, { onClick: handleSendReport, disabled: sending || !emailTo, children: [
            sending ? /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "mr-2 h-4 w-4" }),
            "Send"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ClientReport as default
};
