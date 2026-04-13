import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback, createElement } from "react";
import { useParams, Link } from "react-router-dom";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { motion } from "framer-motion";
import { B as Button } from "./button-DnzOxZqg.js";
import { s as supabase } from "./client-CxdMKRkw.js";
import { L as Label, I as Input } from "./label-H2YDHQ-y.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-_RjaqiGR.js";
import { C as Checkbox } from "./checkbox-CWLGP7Wk.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D5gT6WoP.js";
import { Loader2, AlertCircle, CheckCircle, ArrowRight, ClipboardList, ArrowLeft, Save } from "lucide-react";
import { u as useToast } from "./use-toast-B2rUv-Rg.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@supabase/supabase-js";
import "@radix-ui/react-label";
import "@radix-ui/react-radio-group";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-select";
function QuestionRenderer({ question, value, jsonValue, onChange }) {
  const { field_type, question_text, helper_text, options, is_required } = question;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs(Label, { className: "text-base font-semibold text-foreground", children: [
        question_text,
        is_required && /* @__PURE__ */ jsx("span", { className: "text-destructive ml-1", children: "*" })
      ] }),
      helper_text && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: helper_text })
    ] }),
    field_type === "short_text" && /* @__PURE__ */ jsx(
      Input,
      {
        value,
        onChange: (e) => onChange(e.target.value),
        maxLength: 500,
        placeholder: "Your answer..."
      }
    ),
    field_type === "long_text" && /* @__PURE__ */ jsx(
      Textarea,
      {
        value,
        onChange: (e) => onChange(e.target.value),
        maxLength: 5e3,
        rows: 4,
        placeholder: "Your answer..."
      }
    ),
    field_type === "dropdown" && options && /* @__PURE__ */ jsxs(Select, { value, onValueChange: (v) => onChange(v), children: [
      /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select an option" }) }),
      /* @__PURE__ */ jsx(SelectContent, { children: options.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt, children: opt }, opt)) })
    ] }),
    field_type === "single_select" && options && /* @__PURE__ */ jsx(RadioGroup, { value, onValueChange: (v) => onChange(v), className: "space-y-2", children: options.map((opt) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-3 bg-secondary/30 rounded-lg px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer",
        children: [
          /* @__PURE__ */ jsx(RadioGroupItem, { value: opt, id: `${question.id}-${opt}` }),
          /* @__PURE__ */ jsx(Label, { htmlFor: `${question.id}-${opt}`, className: "cursor-pointer text-sm font-medium flex-1", children: opt })
        ]
      },
      opt
    )) }),
    field_type === "multi_select" && options && /* @__PURE__ */ jsx("div", { className: "space-y-2", children: options.map((opt) => {
      const selected = jsonValue || [];
      const isChecked = selected.includes(opt);
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center gap-3 bg-secondary/30 rounded-lg px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer",
          children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: `${question.id}-${opt}`,
                checked: isChecked,
                onCheckedChange: (checked) => {
                  const next = checked ? [...selected, opt] : selected.filter((s) => s !== opt);
                  onChange(next.join(", "), next);
                }
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: `${question.id}-${opt}`, className: "cursor-pointer text-sm font-medium flex-1", children: opt })
          ]
        },
        opt
      );
    }) }),
    field_type === "yes_no" && /* @__PURE__ */ jsxs(RadioGroup, { value, onValueChange: (v) => onChange(v), className: "flex gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-secondary/30 rounded-lg px-5 py-3 hover:bg-secondary/50 transition-colors cursor-pointer", children: [
        /* @__PURE__ */ jsx(RadioGroupItem, { value: "yes", id: `${question.id}-yes` }),
        /* @__PURE__ */ jsx(Label, { htmlFor: `${question.id}-yes`, className: "cursor-pointer text-sm font-medium", children: "Yes" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-secondary/30 rounded-lg px-5 py-3 hover:bg-secondary/50 transition-colors cursor-pointer", children: [
        /* @__PURE__ */ jsx(RadioGroupItem, { value: "no", id: `${question.id}-no` }),
        /* @__PURE__ */ jsx(Label, { htmlFor: `${question.id}-no`, className: "cursor-pointer text-sm font-medium", children: "No" })
      ] })
    ] }),
    field_type === "number" && /* @__PURE__ */ jsx(
      Input,
      {
        type: "number",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder: "0",
        className: "max-w-xs"
      }
    ),
    field_type === "date" && /* @__PURE__ */ jsx(
      Input,
      {
        type: "date",
        value,
        onChange: (e) => onChange(e.target.value),
        className: "max-w-xs"
      }
    ),
    field_type === "file_upload" && /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-border rounded-xl p-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "File upload will be available soon." }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/70 mt-1", children: "This feature is under development." })
    ] })
  ] });
}
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
function AssessmentClient() {
  const { token } = useParams();
  const { toast } = useToast();
  const [screen, setScreen] = useState("loading");
  const [session, setSession] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [sections, setSections] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [saveStatus, setSaveStatus] = useState("idle");
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!token) {
      setScreen("error");
      return;
    }
    loadData();
  }, [token]);
  const loadData = async () => {
    try {
      const { data: sess, error: sessErr } = await supabase.rpc("get_session_by_token", { p_token: token });
      const session2 = Array.isArray(sess) ? sess[0] : sess;
      if (sessErr || !session2) {
        setScreen("error");
        return;
      }
      if (session2.status === "submitted") {
        setSession(session2);
        setScreen("submitted");
        return;
      }
      const sess_data = session2;
      const { data: assess } = await supabase.from("assessments").select("*").eq("id", sess_data.assessment_id).single();
      const { data: secs } = await supabase.from("assessment_sections").select("*").eq("assessment_id", sess_data.assessment_id).order("sort_order");
      const sectionsWithQuestions = [];
      for (const sec of secs || []) {
        const { data: questions } = await supabase.from("assessment_questions").select("*").eq("section_id", sec.id).order("sort_order");
        sectionsWithQuestions.push({ ...sec, questions: questions || [] });
      }
      const { data: existingResponses } = await supabase.rpc("get_responses_by_token", { p_token: token });
      const resMap = {};
      for (const r of existingResponses || []) {
        resMap[r.question_id] = { value: r.response_value || "", json: r.response_json };
      }
      setSession(sess_data);
      setAssessment(assess);
      setSections(sectionsWithQuestions);
      setResponses(resMap);
      setCurrentIdx(sess_data.current_section_index || 0);
      setScreen("start");
    } catch {
      setScreen("error");
    }
  };
  const saveResponse = useCallback(async (questionId, value, jsonValue) => {
    if (!token) return;
    setSaveStatus("saving");
    try {
      const { error } = await supabase.rpc("upsert_response_by_token", {
        p_token: token,
        p_question_id: questionId,
        p_response_value: value || null,
        p_response_json: jsonValue || null
      });
      if (error) throw error;
      setSaveStatus("saved");
    } catch {
      setSaveStatus("idle");
    }
  }, [token]);
  const handleResponseChange = (questionId, value, jsonValue) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { value, json: jsonValue }
    }));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveResponse(questionId, value, jsonValue), 1500);
  };
  const saveAllCurrentSection = async () => {
    if (!token || !sections[currentIdx]) return;
    setSaveStatus("saving");
    try {
      for (const q of sections[currentIdx].questions) {
        const r = responses[q.id];
        if (!r) continue;
        const { error } = await supabase.rpc("upsert_response_by_token", {
          p_token: token,
          p_question_id: q.id,
          p_response_value: r.value || null,
          p_response_json: r.json || null
        });
        if (error) throw error;
      }
      await supabase.rpc("update_session_by_token", {
        p_token: token,
        p_current_section_index: currentIdx
      });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("idle");
      throw new Error("Failed to save assessment section");
    }
  };
  const validateCurrentSection = () => {
    if (!sections[currentIdx]) return true;
    for (const q of sections[currentIdx].questions) {
      if (q.is_required) {
        const r = responses[q.id];
        if (!r || !r.value && !r.json) {
          toast({
            title: "Required Field",
            description: `Please answer: "${q.question_text}"`,
            variant: "destructive"
          });
          return false;
        }
      }
    }
    return true;
  };
  const goNext = async () => {
    if (!validateCurrentSection()) return;
    await saveAllCurrentSection();
    if (currentIdx < sections.length - 1) {
      setCurrentIdx(currentIdx + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setScreen("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleSubmit = async () => {
    if (!session) return;
    setSaveStatus("saving");
    await supabase.rpc("update_session_by_token", {
      p_token: token,
      p_status: "submitted",
      p_submitted_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    await supabase.rpc("cancel_reminders_by_token", { p_token: token });
    if (session.intake_id) {
      try {
        await supabase.functions.invoke("send-assessment-completion-emails", {
          body: {
            session_id: session.id,
            intake_id: session.intake_id,
            assessment_title: assessment?.title || "Strategic Assessment",
            assessment_slug: assessment?.slug || ""
          }
        });
      } catch (emailErr) {
        console.error("Completion emails failed (non-blocking):", emailErr);
      }
    }
    setSaveStatus("saved");
    setScreen("submitted");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const progress = sections.length > 0 ? screen === "review" || screen === "submitted" ? 100 : Math.round((currentIdx + 1) / sections.length * 100) : 0;
  if (screen === "loading") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-accent" }) });
  }
  if (screen === "error") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsxs("div", { className: "pt-40 pb-20 text-center", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-12 w-12 text-destructive mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-4", children: "Assessment Not Found" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-8", children: "This assessment link may be invalid or expired." }),
        /* @__PURE__ */ jsx(Button, { variant: "hero", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment", children: "Back to Strategic Assessment" }) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (screen === "submitted") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("div", { className: "pt-40 pb-20 text-center max-w-2xl mx-auto px-4", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-8 w-8 text-accent" }) }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-4", children: "Assessment Submitted" }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg text-muted-foreground mb-4", children: [
          "Thank you for completing the ",
          assessment?.title || "Strategic Assessment",
          "."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4", children: "Your responses have been received. You can view a formatted summary of your submission below." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-10", children: "Our team will review your assessment and follow up with strategic insights tailored to your situation." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: `/assessment/${token}/report`, children: [
            "View Response Summary",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
          ] }) }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "lg", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Return to Website" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (screen === "start") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(ClipboardList, { className: "h-8 w-8 text-accent" }) }) }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight mb-6", children: assessment?.title }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground leading-relaxed mb-4", children: assessment?.description }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-2", children: [
          "This assessment has ",
          /* @__PURE__ */ jsxs("strong", { children: [
            sections.length,
            " sections"
          ] }),
          " with questions designed to understand your situation."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-10", children: "Your progress is saved automatically. You can save and continue later at any time." }),
        /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "xl", onClick: () => {
          setScreen("section");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, children: [
          "Begin Assessment",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-16 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-2xl", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-foreground mb-6 text-center", children: "Assessment Sections" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: sections.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl px-5 py-4 shadow-soft border border-border/40 flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-primary", children: i + 1 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: s.title }),
            s.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: s.description })
          ] })
        ] }, s.id)) })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (screen === "review") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("div", { className: "fixed top-16 lg:top-20 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50", children: /* @__PURE__ */ jsx("div", { className: "h-1 bg-secondary", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-accent transition-all duration-500", style: { width: "100%" } }) }) }),
      /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-2", children: "Review Your Answers" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-10", children: "Please review your responses before submitting. You can go back to any section to make changes." }),
        sections.map((section2, sIdx) => /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxs("h2", { className: "font-display text-lg font-bold text-foreground", children: [
              sIdx + 1,
              ". ",
              section2.title
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => {
                  setCurrentIdx(sIdx);
                  setScreen("section");
                },
                className: "text-accent hover:text-accent/80",
                children: "Edit"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl p-6 shadow-soft border border-border/40 space-y-4", children: [
            section2.questions.map((q) => {
              const r = responses[q.id];
              const displayValue = r?.json && Array.isArray(r.json) ? r.json.join(", ") : r?.value || "";
              return /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                  q.question_text,
                  q.is_required && /* @__PURE__ */ jsx("span", { className: "text-destructive ml-1", children: "*" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: displayValue || /* @__PURE__ */ jsx("span", { className: "italic text-muted-foreground/60", children: "No answer provided" }) })
              ] }, q.id);
            }),
            section2.questions.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground italic", children: "No questions in this section yet." })
          ] })
        ] }, section2.id)),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 pt-6", children: [
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "lg", onClick: () => {
            setCurrentIdx(sections.length - 1);
            setScreen("section");
          }, children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Back to Last Section"
          ] }),
          /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "lg", onClick: handleSubmit, className: "flex-1", children: [
            "Submit Assessment",
            /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  const section = sections[currentIdx];
  if (!section) return null;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "fixed top-16 lg:top-20 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50", children: [
      /* @__PURE__ */ jsx("div", { className: "h-1 bg-secondary", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-accent transition-all duration-500",
          style: { width: `${progress}%` }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl flex items-center justify-between py-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "Section ",
          currentIdx + 1,
          " of ",
          sections.length
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          saveStatus === "saving" && /* @__PURE__ */ jsx(Loader2, { className: "h-3 w-3 animate-spin text-muted-foreground" }),
          saveStatus === "saved" && /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 text-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : "" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "pt-36 lg:pt-40 pb-20 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-2xl", children: /* @__PURE__ */ createElement(motion.div, { ...fadeUp, key: section.id }, /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-accent font-medium tracking-widest uppercase text-xs mb-2", children: [
        "Section ",
        currentIdx + 1,
        " of ",
        sections.length
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl lg:text-3xl font-bold text-foreground mb-2", children: section.title }),
      section.description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: section.description })
    ] }), /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      section.questions.map((q) => /* @__PURE__ */ jsx("div", { className: "bg-card rounded-2xl p-6 shadow-soft border border-border/40", children: /* @__PURE__ */ jsx(
        QuestionRenderer,
        {
          question: q,
          value: responses[q.id]?.value || "",
          jsonValue: responses[q.id]?.json,
          onChange: (val, json) => handleResponseChange(q.id, val, json)
        }
      ) }, q.id)),
      section.questions.length === 0 && /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl p-8 shadow-soft border border-border/40 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No questions in this section yet." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70 mt-1", children: "Questions will be added soon." })
      ] })
    ] }), /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-10 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        currentIdx > 0 && /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "lg", onClick: goPrev, children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Previous"
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "lg", onClick: saveAllCurrentSection, children: [
          /* @__PURE__ */ jsx(Save, { className: "mr-2 h-4 w-4" }),
          "Save Progress"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", onClick: goNext, children: currentIdx < sections.length - 1 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Next Section",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        "Review Answers",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
      ] }) })
    ] })) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AssessmentClient as default
};
