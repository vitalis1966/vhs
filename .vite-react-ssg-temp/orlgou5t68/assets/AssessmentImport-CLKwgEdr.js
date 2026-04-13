import { jsxs, jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { L as Link } from "./index-CalXArNJ.js";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { motion } from "framer-motion";
import { s as supabase } from "./client-B5yO-kwf.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { I as Input, L as Label } from "./label-H2YDHQ-y.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { S as Switch } from "./switch-B7aTy1Ss.js";
import { B as Badge } from "./badge-Bd62qPcf.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D5gT6WoP.js";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
import { F as FIELD_TYPES } from "./assessment-bfYXsSRb.js";
import { ArrowLeft, Upload, AlertCircle, Loader2, Plus, Check, Trash2, ChevronUp, ChevronDown, FileText } from "lucide-react";
import { useParams } from "react-router";
import "react-dom";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-select";
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
function AssessmentImport() {
  const { id } = useParams();
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [step, setStep] = useState("upload");
  const [sections, setSections] = useState([]);
  const [importProgress, setImportProgress] = useState(0);
  const [parseError, setParseError] = useState(null);
  useEffect(() => {
    if (id) loadAssessment();
  }, [id]);
  const loadAssessment = async () => {
    const { data } = await supabase.from("assessments").select("title").eq("id", id).single();
    if (data) setAssessmentTitle(data.title);
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 20MB.", variant: "destructive" });
      return;
    }
    setStep("parsing");
    setParseError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assessment_type", assessmentTitle);
      const response = await fetch(
        `${"https://ilbhphreyvaoomhpvaxi.supabase.co"}/functions/v1/parse-questionnaire`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsYmhwaHJleXZhb29taHB2YXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDQwODAsImV4cCI6MjA4ODU4MDA4MH0.XWJxYAndKB_Xs2DE1BkN_7t7YU94JPMEepMYTvQMK_c"}`
          },
          body: formData
        }
      );
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }
      const result = await response.json();
      if (!result.data?.sections?.length) {
        throw new Error("No sections found in the PDF.");
      }
      const parsed = result.data.sections.map((s) => ({
        title: s.title || "Untitled Section",
        description: s.description || null,
        _expanded: true,
        _selected: true,
        questions: (s.questions || []).map((q) => ({
          question_text: q.question_text || "",
          helper_text: q.helper_text || null,
          field_type: q.field_type || "short_text",
          options: q.options || null,
          is_required: q.is_required ?? false,
          _selected: true
        }))
      }));
      setSections(parsed);
      setStep("preview");
    } catch (err) {
      setParseError(err.message || "Failed to parse PDF");
      setStep("upload");
    }
  };
  const toggleSectionExpand = (idx) => {
    setSections(
      (prev) => prev.map((s, i) => i === idx ? { ...s, _expanded: !s._expanded } : s)
    );
  };
  const toggleSectionSelect = (idx) => {
    setSections(
      (prev) => prev.map(
        (s, i) => i === idx ? {
          ...s,
          _selected: !s._selected,
          questions: s.questions.map((q) => ({ ...q, _selected: !s._selected }))
        } : s
      )
    );
  };
  const toggleQuestionSelect = (sIdx, qIdx) => {
    setSections(
      (prev) => prev.map(
        (s, si) => si === sIdx ? {
          ...s,
          questions: s.questions.map(
            (q, qi) => qi === qIdx ? { ...q, _selected: !q._selected } : q
          )
        } : s
      )
    );
  };
  const updateSection = (idx, field, value) => {
    setSections(
      (prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    );
  };
  const updateQuestion = (sIdx, qIdx, field, value) => {
    setSections(
      (prev) => prev.map(
        (s, si) => si === sIdx ? {
          ...s,
          questions: s.questions.map(
            (q, qi) => qi === qIdx ? { ...q, [field]: value } : q
          )
        } : s
      )
    );
  };
  const removeSection = (idx) => {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };
  const removeQuestion = (sIdx, qIdx) => {
    setSections(
      (prev) => prev.map(
        (s, si) => si === sIdx ? { ...s, questions: s.questions.filter((_, qi) => qi !== qIdx) } : s
      )
    );
  };
  const addQuestion = (sIdx) => {
    setSections(
      (prev) => prev.map(
        (s, si) => si === sIdx ? {
          ...s,
          _expanded: true,
          questions: [
            ...s.questions,
            {
              question_text: "",
              helper_text: null,
              field_type: "short_text",
              options: null,
              is_required: false,
              _selected: true
            }
          ]
        } : s
      )
    );
  };
  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        title: "New Section",
        description: null,
        _expanded: true,
        _selected: true,
        questions: []
      }
    ]);
  };
  const handleImport = async () => {
    const selectedSections = sections.filter((s) => s._selected);
    const totalItems = selectedSections.reduce(
      (sum, s) => sum + s.questions.filter((q) => q._selected && q.question_text.trim()).length + 1,
      0
    );
    if (totalItems <= selectedSections.length) {
      toast({ title: "No questions to import", variant: "destructive" });
      return;
    }
    setStep("importing");
    setImportProgress(0);
    const { data: existingSections } = await supabase.from("assessment_sections").select("id").eq("assessment_id", id);
    const sectionOffset = existingSections?.length || 0;
    let completed = 0;
    for (let sIdx = 0; sIdx < selectedSections.length; sIdx++) {
      const sec = selectedSections[sIdx];
      const { data: newSec } = await supabase.from("assessment_sections").insert({
        assessment_id: id,
        title: sec.title.trim(),
        description: sec.description?.trim() || null,
        sort_order: sectionOffset + sIdx
      }).select().single();
      completed++;
      setImportProgress(Math.round(completed / totalItems * 100));
      if (!newSec) continue;
      const selectedQuestions = sec.questions.filter((q) => q._selected && q.question_text.trim());
      for (let qIdx = 0; qIdx < selectedQuestions.length; qIdx++) {
        const q = selectedQuestions[qIdx];
        await supabase.from("assessment_questions").insert({
          section_id: newSec.id,
          question_text: q.question_text.trim(),
          helper_text: q.helper_text?.trim() || null,
          field_type: q.field_type,
          options: q.options?.length ? q.options : null,
          is_required: q.is_required,
          sort_order: qIdx
        });
        completed++;
        setImportProgress(Math.round(completed / totalItems * 100));
      }
    }
    setStep("done");
    toast({ title: "Import Complete", description: `Imported ${selectedSections.length} sections.` });
  };
  const selectedCount = sections.filter((s) => s._selected).length;
  const selectedQCount = sections.reduce(
    (sum, s) => sum + (s._selected ? s.questions.filter((q) => q._selected).length : 0),
    0
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-6 lg:pt-40 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/admin/assessments/${id}`,
          className: "text-accent text-sm font-medium hover:underline flex items-center gap-1 mb-6",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
            " Back to ",
            assessmentTitle || "Assessment"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl lg:text-4xl font-bold text-foreground tracking-tight", children: "Import Questions" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-muted-foreground", children: [
          "Upload a PDF questionnaire to automatically extract and import sections and questions into",
          " ",
          /* @__PURE__ */ jsx("strong", { children: assessmentTitle }),
          "."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-10 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      step === "upload" && /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "max-w-xl mx-auto", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "border-2 border-dashed border-border/60 rounded-2xl p-12 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors",
            onClick: () => fileRef.current?.click(),
            children: [
              /* @__PURE__ */ jsx(Upload, { className: "h-12 w-12 text-muted-foreground/40 mx-auto mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: "Upload PDF Questionnaire" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Drop a PDF file here or click to browse. The AI will extract sections and questions automatically." }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "PDF · Max 20MB" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: fileRef,
                  type: "file",
                  accept: ".pdf,application/pdf",
                  className: "hidden",
                  onChange: handleFileUpload
                }
              )
            ]
          }
        ),
        parseError && /* @__PURE__ */ jsxs("div", { className: "mt-6 bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-destructive flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-destructive", children: "Parsing Failed" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: parseError })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-card rounded-2xl p-6 shadow-soft border border-border/40", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-display text-sm font-bold text-foreground mb-3", children: "Or add sections manually" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "You can also add sections and questions manually using the assessment builder." }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: `/admin/assessments/${id}`, children: "Open Assessment Builder" }) })
        ] })
      ] }),
      step === "parsing" && /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto text-center py-20", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-10 w-10 animate-spin text-accent mx-auto mb-6" }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-2", children: "Extracting Questions…" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "The AI is reading your PDF and structuring the questions. This may take 30–60 seconds." })
      ] }),
      step === "preview" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6 flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-sm", children: [
              selectedCount,
              " sections · ",
              selectedQCount,
              " questions selected"
            ] }),
            /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: () => {
              setStep("upload");
              setSections([]);
            }, children: [
              /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-4 w-4" }),
              "Upload Different PDF"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: addSection, children: [
              /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
              "Add Section"
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "hero",
                size: "sm",
                onClick: handleImport,
                disabled: selectedQCount === 0,
                children: [
                  /* @__PURE__ */ jsx(Check, { className: "mr-2 h-4 w-4" }),
                  "Import ",
                  selectedQCount,
                  " Questions"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: sections.map((sec, sIdx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `bg-card rounded-2xl shadow-soft border overflow-hidden transition-colors ${sec._selected ? "border-border/40" : "border-border/20 opacity-60"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-5", children: [
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    checked: sec._selected,
                    onCheckedChange: () => toggleSectionSelect(sIdx),
                    className: "flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "flex-1 cursor-pointer",
                    onClick: () => toggleSectionExpand(sIdx),
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
                        "Section ",
                        sIdx + 1
                      ] }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          value: sec.title,
                          onChange: (e) => updateSection(sIdx, "title", e.target.value),
                          onClick: (e) => e.stopPropagation(),
                          className: "font-display font-bold text-foreground border-none bg-transparent p-0 h-auto text-base shadow-none focus-visible:ring-0"
                        }
                      ),
                      /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-[10px] flex-shrink-0", children: [
                        sec.questions.length,
                        " Q"
                      ] })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-destructive hover:text-destructive",
                      onClick: () => removeSection(sIdx),
                      children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsx("button", { onClick: () => toggleSectionExpand(sIdx), children: sec._expanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }) })
                ] })
              ] }),
              sec._expanded && /* @__PURE__ */ jsx("div", { className: "px-5 pb-2", children: /* @__PURE__ */ jsx(
                Input,
                {
                  value: sec.description || "",
                  onChange: (e) => updateSection(sIdx, "description", e.target.value || null),
                  placeholder: "Section description (optional)",
                  className: "text-sm text-muted-foreground border-dashed"
                }
              ) }),
              sec._expanded && /* @__PURE__ */ jsxs("div", { className: "border-t border-border/40 p-5 space-y-3", children: [
                sec.questions.map((q, qIdx) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `rounded-xl p-4 transition-colors ${q._selected ? "bg-secondary/30 border border-border/30" : "bg-secondary/10 border border-border/10 opacity-50"}`,
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                      /* @__PURE__ */ jsx(
                        Switch,
                        {
                          checked: q._selected,
                          onCheckedChange: () => toggleQuestionSelect(sIdx, qIdx),
                          className: "mt-1 flex-shrink-0"
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-muted-foreground mt-2", children: [
                            "Q",
                            qIdx + 1
                          ] }),
                          /* @__PURE__ */ jsx(
                            Textarea,
                            {
                              value: q.question_text,
                              onChange: (e) => updateQuestion(sIdx, qIdx, "question_text", e.target.value),
                              rows: 2,
                              className: "text-sm font-medium"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Field Type" }),
                            /* @__PURE__ */ jsxs(
                              Select,
                              {
                                value: q.field_type,
                                onValueChange: (v) => updateQuestion(sIdx, qIdx, "field_type", v),
                                children: [
                                  /* @__PURE__ */ jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                                  /* @__PURE__ */ jsx(SelectContent, { children: FIELD_TYPES.map((ft) => /* @__PURE__ */ jsx(SelectItem, { value: ft.value, children: ft.label }, ft.value)) })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Helper Text" }),
                            /* @__PURE__ */ jsx(
                              Input,
                              {
                                value: q.helper_text || "",
                                onChange: (e) => updateQuestion(sIdx, qIdx, "helper_text", e.target.value || null),
                                placeholder: "Optional",
                                className: "h-8 text-xs"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "flex items-end gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx(
                              Switch,
                              {
                                checked: q.is_required,
                                onCheckedChange: (v) => updateQuestion(sIdx, qIdx, "is_required", v)
                              }
                            ),
                            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Required" })
                          ] }) })
                        ] }),
                        ["dropdown", "single_select", "multi_select"].includes(q.field_type) && /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Options (one per line)" }),
                          /* @__PURE__ */ jsx(
                            Textarea,
                            {
                              value: q.options?.join("\n") || "",
                              onChange: (e) => updateQuestion(
                                sIdx,
                                qIdx,
                                "options",
                                e.target.value.split("\n").map((o) => o.trim()).filter(Boolean)
                              ),
                              rows: 3,
                              className: "text-xs",
                              placeholder: "Option 1\nOption 2\nOption 3"
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-destructive hover:text-destructive flex-shrink-0",
                          onClick: () => removeQuestion(sIdx, qIdx),
                          children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
                        }
                      )
                    ] })
                  },
                  qIdx
                )),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "w-full border border-dashed border-border/40",
                    onClick: () => addQuestion(sIdx),
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
                      "Add Question"
                    ]
                  }
                )
              ] })
            ]
          },
          sIdx
        )) }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "lg", onClick: handleImport, disabled: selectedQCount === 0, children: [
          /* @__PURE__ */ jsx(Check, { className: "mr-2 h-5 w-5" }),
          "Import ",
          selectedCount,
          " Sections · ",
          selectedQCount,
          " Questions"
        ] }) })
      ] }),
      step === "importing" && /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto text-center py-20", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-10 w-10 animate-spin text-accent mx-auto mb-6" }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-2", children: "Importing Questions…" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [
          importProgress,
          "% complete"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-2 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-accent transition-all duration-300",
            style: { width: `${importProgress}%` }
          }
        ) })
      ] }),
      step === "done" && /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto text-center py-20", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(Check, { className: "h-8 w-8 text-accent" }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Import Complete" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-8", children: [
          "Questions have been imported into ",
          /* @__PURE__ */ jsx("strong", { children: assessmentTitle }),
          ". You can now review, edit, reorder, and publish using the assessment builder."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: `/admin/assessments/${id}`, children: [
            /* @__PURE__ */ jsx(FileText, { className: "mr-2 h-5 w-5" }),
            "Open Assessment Builder"
          ] }) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "lg",
              onClick: () => {
                setStep("upload");
                setSections([]);
              },
              children: [
                /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-5 w-5" }),
                "Import More"
              ]
            }
          )
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AssessmentImport as default
};
