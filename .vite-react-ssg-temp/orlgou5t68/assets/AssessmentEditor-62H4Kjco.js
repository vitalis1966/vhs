import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { L as Link } from "./index-CalXArNJ.js";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { s as supabase } from "./client-B5yO-kwf.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { I as Input, L as Label } from "./label-H2YDHQ-y.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { S as Switch } from "./switch-B7aTy1Ss.js";
import { B as Badge } from "./badge-Bd62qPcf.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D5gT6WoP.js";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
import { F as FIELD_TYPES } from "./assessment-bfYXsSRb.js";
import { Loader2, ArrowLeft, Upload, GripVertical, Check, X, Pencil, ArrowUp, ArrowDown, Trash2, ChevronUp, ChevronDown, Save, Plus } from "lucide-react";
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
function AssessmentEditor() {
  const { id } = useParams();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState(/* @__PURE__ */ new Set());
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDesc, setNewSectionDesc] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [editSectionDesc, setEditSectionDesc] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [addingToSection, setAddingToSection] = useState(null);
  const [qForm, setQForm] = useState({
    question_text: "",
    helper_text: "",
    field_type: "short_text",
    options: "",
    is_required: false
  });
  useEffect(() => {
    if (id) loadAssessment();
  }, [id]);
  const loadAssessment = async () => {
    const { data: a } = await supabase.from("assessments").select("*").eq("id", id).single();
    setAssessment(a);
    const { data: secs } = await supabase.from("assessment_sections").select("*").eq("assessment_id", id).order("sort_order");
    const withQ = [];
    for (const sec of secs || []) {
      const { data: qs } = await supabase.from("assessment_questions").select("*").eq("section_id", sec.id).order("sort_order");
      withQ.push({ ...sec, questions: qs || [] });
    }
    setSections(withQ);
    setLoading(false);
  };
  const toggleSection = (sId) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(sId) ? next.delete(sId) : next.add(sId);
      return next;
    });
  };
  const togglePublished = async () => {
    if (!assessment) return;
    const newVal = !assessment.is_published;
    await supabase.from("assessments").update({ is_published: newVal, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", assessment.id);
    setAssessment({ ...assessment, is_published: newVal });
    toast({ title: newVal ? "Assessment Published" : "Assessment Unpublished" });
  };
  const addSection = async () => {
    if (!newSectionTitle.trim()) return;
    const sortOrder = sections.length;
    const { data } = await supabase.from("assessment_sections").insert({
      assessment_id: id,
      title: newSectionTitle.trim(),
      description: newSectionDesc.trim() || null,
      sort_order: sortOrder
    }).select().single();
    if (data) {
      setSections([...sections, { ...data, questions: [] }]);
      setNewSectionTitle("");
      setNewSectionDesc("");
      setShowNewSection(false);
      setExpandedSections((prev) => new Set(prev).add(data.id));
    }
  };
  const deleteSection = async (sId) => {
    await supabase.from("assessment_sections").delete().eq("id", sId);
    setSections(sections.filter((s) => s.id !== sId));
    toast({ title: "Section deleted" });
  };
  const startEditSection = (section, e) => {
    e.stopPropagation();
    setEditingSectionId(section.id);
    setEditSectionTitle(section.title);
    setEditSectionDesc(section.description || "");
  };
  const cancelEditSection = (e) => {
    e.stopPropagation();
    setEditingSectionId(null);
  };
  const saveSection = async (sId, e) => {
    e.stopPropagation();
    if (!editSectionTitle.trim()) return;
    await supabase.from("assessment_sections").update({
      title: editSectionTitle.trim(),
      description: editSectionDesc.trim() || null
    }).eq("id", sId);
    setSections(sections.map(
      (s) => s.id === sId ? { ...s, title: editSectionTitle.trim(), description: editSectionDesc.trim() || null } : s
    ));
    setEditingSectionId(null);
    toast({ title: "Section updated" });
  };
  const moveSectionUp = async (idx) => {
    if (idx <= 0) return;
    const updated = [...sections];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    updated.forEach((s, i) => s.sort_order = i);
    for (const s of updated) {
      await supabase.from("assessment_sections").update({ sort_order: s.sort_order }).eq("id", s.id);
    }
    setSections(updated);
  };
  const moveSectionDown = async (idx) => {
    if (idx >= sections.length - 1) return;
    const updated = [...sections];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    updated.forEach((s, i) => s.sort_order = i);
    for (const s of updated) {
      await supabase.from("assessment_sections").update({ sort_order: s.sort_order }).eq("id", s.id);
    }
    setSections(updated);
  };
  const resetQForm = () => {
    setQForm({ question_text: "", helper_text: "", field_type: "short_text", options: "", is_required: false });
    setEditingQuestion(null);
    setAddingToSection(null);
  };
  const startAddQuestion = (sectionId) => {
    resetQForm();
    setAddingToSection(sectionId);
    setExpandedSections((prev) => new Set(prev).add(sectionId));
  };
  const startEditQuestion = (q) => {
    setQForm({
      question_text: q.question_text,
      helper_text: q.helper_text || "",
      field_type: q.field_type,
      options: q.options ? q.options.join("\n") : "",
      is_required: q.is_required
    });
    setEditingQuestion(q.id);
    setAddingToSection(null);
  };
  const saveQuestion = async (sectionId) => {
    if (!qForm.question_text.trim()) return;
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const opts = qForm.options.trim() ? qForm.options.split("\n").map((o) => o.trim()).filter(Boolean) : null;
    if (editingQuestion) {
      await supabase.from("assessment_questions").update({
        question_text: qForm.question_text.trim(),
        helper_text: qForm.helper_text.trim() || null,
        field_type: qForm.field_type,
        options: opts,
        is_required: qForm.is_required
      }).eq("id", editingQuestion);
      setSections(sections.map(
        (s) => s.id === sectionId ? {
          ...s,
          questions: s.questions.map(
            (q) => q.id === editingQuestion ? { ...q, question_text: qForm.question_text.trim(), helper_text: qForm.helper_text.trim() || null, field_type: qForm.field_type, options: opts, is_required: qForm.is_required } : q
          )
        } : s
      ));
    } else {
      const sortOrder = section.questions.length;
      const { data } = await supabase.from("assessment_questions").insert({
        section_id: sectionId,
        question_text: qForm.question_text.trim(),
        helper_text: qForm.helper_text.trim() || null,
        field_type: qForm.field_type,
        options: opts,
        is_required: qForm.is_required,
        sort_order: sortOrder
      }).select().single();
      if (data) {
        setSections(sections.map(
          (s) => s.id === sectionId ? { ...s, questions: [...s.questions, data] } : s
        ));
      }
    }
    resetQForm();
    toast({ title: editingQuestion ? "Question updated" : "Question added" });
  };
  const deleteQuestion = async (sectionId, qId) => {
    await supabase.from("assessment_questions").delete().eq("id", qId);
    setSections(sections.map(
      (s) => s.id === sectionId ? { ...s, questions: s.questions.filter((q) => q.id !== qId) } : s
    ));
    toast({ title: "Question deleted" });
  };
  const moveQuestionUp = async (sectionId, qIdx) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section || qIdx <= 0) return;
    const updated = [...section.questions];
    [updated[qIdx - 1], updated[qIdx]] = [updated[qIdx], updated[qIdx - 1]];
    updated.forEach((q, i) => q.sort_order = i);
    for (const q of updated) {
      await supabase.from("assessment_questions").update({ sort_order: q.sort_order }).eq("id", q.id);
    }
    setSections(sections.map((s) => s.id === sectionId ? { ...s, questions: updated } : s));
  };
  const moveQuestionDown = async (sectionId, qIdx) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section || qIdx >= section.questions.length - 1) return;
    const updated = [...section.questions];
    [updated[qIdx], updated[qIdx + 1]] = [updated[qIdx + 1], updated[qIdx]];
    updated.forEach((q, i) => q.sort_order = i);
    for (const q of updated) {
      await supabase.from("assessment_questions").update({ sort_order: q.sort_order }).eq("id", q.id);
    }
    setSections(sections.map((s) => s.id === sectionId ? { ...s, questions: updated } : s));
  };
  const needsOptions = ["dropdown", "single_select", "multi_select"].includes(qForm.field_type);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-accent" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-10 lg:pt-40 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/admin/assessments", className: "text-accent text-sm font-medium hover:underline flex items-center gap-1 mb-6", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to Assessments"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl lg:text-4xl font-bold text-foreground tracking-tight", children: assessment?.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: assessment?.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: `/admin/assessments/${id}/import`, children: [
            /* @__PURE__ */ jsx(Upload, { className: "mr-2 h-4 w-4" }),
            "Import from PDF"
          ] }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Published" }),
          /* @__PURE__ */ jsx(Switch, { checked: assessment?.is_published || false, onCheckedChange: togglePublished })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-10 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: sections.map((section, sIdx) => {
        const expanded = expandedSections.has(section.id);
        return /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl shadow-soft border border-border/40 overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-5 cursor-pointer", onClick: () => toggleSection(section.id), children: [
            /* @__PURE__ */ jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground/50 flex-shrink-0" }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: editingSectionId === section.id ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", onClick: (e) => e.stopPropagation(), children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: editSectionTitle,
                  onChange: (e) => setEditSectionTitle(e.target.value),
                  placeholder: "Section title",
                  className: "h-8 text-sm font-bold",
                  autoFocus: true,
                  onKeyDown: (e) => {
                    if (e.key === "Enter") saveSection(section.id, e);
                    if (e.key === "Escape") setEditingSectionId(null);
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: editSectionDesc,
                  onChange: (e) => setEditSectionDesc(e.target.value),
                  placeholder: "Optional description",
                  className: "h-7 text-xs"
                }
              )
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-accent", children: [
                  "Section ",
                  sIdx + 1
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-bold text-foreground", children: section.title }),
                /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
                  section.questions.length,
                  " Q"
                ] })
              ] }),
              section.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: section.description })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", onClick: (e) => e.stopPropagation(), children: editingSectionId === section.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-primary hover:text-primary", onClick: (e) => saveSection(section.id, e), children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: cancelEditSection, children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }) })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: (e) => startEditSection(section, e), children: /* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => moveSectionUp(sIdx), disabled: sIdx === 0, children: /* @__PURE__ */ jsx(ArrowUp, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: () => moveSectionDown(sIdx), disabled: sIdx === sections.length - 1, children: /* @__PURE__ */ jsx(ArrowDown, { className: "h-3 w-3" }) }),
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-destructive hover:text-destructive", onClick: () => deleteSection(section.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }) })
            ] }) }),
            editingSectionId !== section.id && (expanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }))
          ] }),
          expanded && /* @__PURE__ */ jsxs("div", { className: "border-t border-border/40 p-5 space-y-3", children: [
            section.questions.map((q, qIdx) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-secondary/30 rounded-xl p-4 flex items-start gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 flex-shrink-0 pt-1", children: [
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-5 w-5", onClick: () => moveQuestionUp(section.id, qIdx), disabled: qIdx === 0, children: /* @__PURE__ */ jsx(ArrowUp, { className: "h-2.5 w-2.5" }) }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-5 w-5", onClick: () => moveQuestionDown(section.id, qIdx), disabled: qIdx === section.questions.length - 1, children: /* @__PURE__ */ jsx(ArrowDown, { className: "h-2.5 w-2.5" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-muted-foreground", children: [
                      "Q",
                      qIdx + 1
                    ] }),
                    /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-[10px]", children: q.field_type }),
                    q.is_required && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-[10px]", children: "Required" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: q.question_text }),
                  q.helper_text && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: q.helper_text }),
                  q.options && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground/60 mt-1", children: [
                    "Options: ",
                    q.options.join(", ")
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1 flex-shrink-0", children: [
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "text-xs h-7", onClick: () => startEditQuestion(q), children: "Edit" }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 text-destructive hover:text-destructive", onClick: () => deleteQuestion(section.id, q.id), children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }) })
                ] })
              ] }),
              editingQuestion === q.id && /* @__PURE__ */ jsxs("div", { className: "bg-accent/5 rounded-xl p-5 border border-accent/20 space-y-4 mt-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-display text-sm font-bold text-foreground", children: "Update Question" }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: resetQForm, children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Question Text *" }),
                  /* @__PURE__ */ jsx(Input, { value: qForm.question_text, onChange: (e) => setQForm({ ...qForm, question_text: e.target.value }), maxLength: 500 })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Helper Text" }),
                  /* @__PURE__ */ jsx(Input, { value: qForm.helper_text, onChange: (e) => setQForm({ ...qForm, helper_text: e.target.value }), maxLength: 500, placeholder: "Optional guidance text" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx(Label, { children: "Field Type" }),
                    /* @__PURE__ */ jsxs(Select, { value: qForm.field_type, onValueChange: (v) => setQForm({ ...qForm, field_type: v }), children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: FIELD_TYPES.map((ft) => /* @__PURE__ */ jsx(SelectItem, { value: ft.value, children: ft.label }, ft.value)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-6", children: [
                    /* @__PURE__ */ jsx(Switch, { checked: qForm.is_required, onCheckedChange: (v) => setQForm({ ...qForm, is_required: v }) }),
                    /* @__PURE__ */ jsx(Label, { children: "Required" })
                  ] })
                ] }),
                needsOptions && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Options (one per line)" }),
                  /* @__PURE__ */ jsx(
                    Textarea,
                    {
                      value: qForm.options,
                      onChange: (e) => setQForm({ ...qForm, options: e.target.value }),
                      rows: 4,
                      placeholder: "Option 1\nOption 2\nOption 3"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "sm", onClick: () => saveQuestion(section.id), children: [
                  /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
                  "Update Question"
                ] })
              ] })
            ] }, q.id)),
            addingToSection === section.id ? /* @__PURE__ */ jsxs("div", { className: "bg-accent/5 rounded-xl p-5 border border-accent/20 space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-display text-sm font-bold text-foreground", children: "New Question" }),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", onClick: resetQForm, children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Question Text *" }),
                /* @__PURE__ */ jsx(Input, { value: qForm.question_text, onChange: (e) => setQForm({ ...qForm, question_text: e.target.value }), maxLength: 500 })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Helper Text" }),
                /* @__PURE__ */ jsx(Input, { value: qForm.helper_text, onChange: (e) => setQForm({ ...qForm, helper_text: e.target.value }), maxLength: 500, placeholder: "Optional guidance text" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { children: "Field Type" }),
                  /* @__PURE__ */ jsxs(Select, { value: qForm.field_type, onValueChange: (v) => setQForm({ ...qForm, field_type: v }), children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsx(SelectContent, { children: FIELD_TYPES.map((ft) => /* @__PURE__ */ jsx(SelectItem, { value: ft.value, children: ft.label }, ft.value)) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-6", children: [
                  /* @__PURE__ */ jsx(Switch, { checked: qForm.is_required, onCheckedChange: (v) => setQForm({ ...qForm, is_required: v }) }),
                  /* @__PURE__ */ jsx(Label, { children: "Required" })
                ] })
              ] }),
              needsOptions && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { children: "Options (one per line)" }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    value: qForm.options,
                    onChange: (e) => setQForm({ ...qForm, options: e.target.value }),
                    rows: 4,
                    placeholder: "Option 1\nOption 2\nOption 3"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "sm", onClick: () => saveQuestion(section.id), children: [
                /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
                "Add Question"
              ] })
            ] }) : !editingQuestion && /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => startAddQuestion(section.id), className: "w-full", children: [
              /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
              "Add Question"
            ] })
          ] })
        ] }, section.id);
      }) }),
      showNewSection ? /* @__PURE__ */ jsxs("div", { className: "mt-6 bg-card rounded-2xl p-6 shadow-soft border border-border/40 space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-bold text-foreground", children: "New Section" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Section Title *" }),
          /* @__PURE__ */ jsx(Input, { value: newSectionTitle, onChange: (e) => setNewSectionTitle(e.target.value), maxLength: 200, placeholder: "e.g. Financial Planning" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { children: "Description" }),
          /* @__PURE__ */ jsx(Textarea, { value: newSectionDesc, onChange: (e) => setNewSectionDesc(e.target.value), maxLength: 500, rows: 2, placeholder: "Brief description of this section..." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "sm", onClick: addSection, children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Add Section"
          ] }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowNewSection(false), children: "Cancel" })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "lg", className: "mt-6 w-full", onClick: () => setShowNewSection(true), children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Add Section"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AssessmentEditor as default
};
