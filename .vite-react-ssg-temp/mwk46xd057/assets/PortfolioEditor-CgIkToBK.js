import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { useParams, useNavigate, Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { L as Label, I as Input } from "./label-H2YDHQ-y.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D5gT6WoP.js";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { s as supabase } from "./client-CxdMKRkw.js";
import { t as toast } from "./use-toast-B2rUv-Rg.js";
import { useState, useEffect } from "react";
import { C as Checkbox } from "./checkbox-CWLGP7Wk.js";
import { C as Collapsible, a as CollapsibleTrigger, b as CollapsibleContent } from "./collapsible-DUtqt5i7.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@supabase/supabase-js";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-collapsible";
const tagOptions = ["New Build", "Revenue & Billing", "Operations", "Growth", "M&A", "Technology", "People", "Advisory"];
const serviceOptions = [
  "Practice Feasibility and Financial Modeling",
  "Regulatory Accreditation Preparation",
  "Site Selection and Lease Advisory",
  "Governance and Partnership Structure Design",
  "Facility Design Input",
  "Compliance Documentation",
  "Operational Systems Design",
  "Revenue Cycle Review",
  "Billing Optimization",
  "Staffing and Role Design",
  "People and Culture Assessment",
  "Technology and EMR Advisory",
  "M&A and Transaction Advisory",
  "Practice Valuation",
  "Strategic Advisory",
  "Financial Restructuring",
  "Growth Planning",
  "Recruitment Strategy"
];
const PortfolioEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    specialty: "",
    location: "Canada",
    metric: "",
    description: "",
    tags: [],
    case_type: "case_study",
    sort_order: 0,
    status: "draft",
    ext_situation: "",
    ext_challenge: "",
    ext_what_we_did: "",
    ext_results: "",
    ext_stat_1_value: "",
    ext_stat_1_label: "",
    ext_stat_2_value: "",
    ext_stat_2_label: "",
    ext_stat_3_value: "",
    ext_stat_3_label: "",
    ext_services: []
  });
  const { data: existing } = useQuery({
    queryKey: ["admin-portfolio-case", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase.from("portfolio_cases").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !isNew
  });
  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || "",
        slug: existing.slug || "",
        specialty: existing.specialty || "",
        location: existing.location || "Canada",
        metric: existing.metric || "",
        description: existing.description || "",
        tags: existing.tags || [],
        case_type: existing.case_type || "case_study",
        sort_order: existing.sort_order || 0,
        status: existing.status || "draft",
        ext_situation: existing.ext_situation || "",
        ext_challenge: existing.ext_challenge || "",
        ext_what_we_did: existing.ext_what_we_did || "",
        ext_results: existing.ext_results || "",
        ext_stat_1_value: existing.ext_stat_1_value || "",
        ext_stat_1_label: existing.ext_stat_1_label || "",
        ext_stat_2_value: existing.ext_stat_2_value || "",
        ext_stat_2_label: existing.ext_stat_2_label || "",
        ext_stat_3_value: existing.ext_stat_3_value || "",
        ext_stat_3_label: existing.ext_stat_3_label || "",
        ext_services: existing.ext_services || []
      });
    }
  }, [existing]);
  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const handleSpecialtyChange = (val) => {
    setForm((f) => ({
      ...f,
      specialty: val,
      slug: isNew || f.slug === generateSlug(f.specialty) ? generateSlug(val) : f.slug
    }));
  };
  const toggleTag = (tag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag]
    }));
  };
  const toggleService = (service) => {
    setForm((f) => ({
      ...f,
      ext_services: f.ext_services.includes(service) ? f.ext_services.filter((s) => s !== service) : [...f.ext_services, service]
    }));
  };
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const saveMutation = useMutation({
    mutationFn: async (publish) => {
      const payload = {
        title: form.title,
        slug: form.slug,
        specialty: form.specialty,
        location: form.location,
        metric: form.metric,
        description: form.description,
        tags: form.tags,
        case_type: form.case_type,
        sort_order: form.sort_order,
        status: publish ? "published" : form.status,
        ext_situation: form.ext_situation || null,
        ext_challenge: form.ext_challenge || null,
        ext_what_we_did: form.ext_what_we_did || null,
        ext_results: form.ext_results || null,
        ext_stat_1_value: form.ext_stat_1_value || null,
        ext_stat_1_label: form.ext_stat_1_label || null,
        ext_stat_2_value: form.ext_stat_2_value || null,
        ext_stat_2_label: form.ext_stat_2_label || null,
        ext_stat_3_value: form.ext_stat_3_value || null,
        ext_stat_3_label: form.ext_stat_3_label || null,
        ext_services: form.ext_services.length > 0 ? form.ext_services : null
      };
      if (isNew) {
        const { error } = await supabase.from("portfolio_cases").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_cases").update(payload).eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: (_, publish) => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      toast({ title: publish ? "Case published" : "Case saved" });
      navigate("/admin/portfolio");
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });
  const hasExtendedContent = !!(form.ext_situation || form.ext_challenge || form.ext_what_we_did || form.ext_results);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "pt-28 pb-20 container mx-auto px-4 max-w-3xl", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/admin/portfolio", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
        " Back to Portfolio"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-8", children: isNew ? "New Case" : "Edit Case" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Core" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Specialty *" }),
            /* @__PURE__ */ jsx(Input, { value: form.specialty, onChange: (e) => handleSpecialtyChange(e.target.value), placeholder: "e.g. Family Medicine, Ophthalmology" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Metric / Headline *" }),
            /* @__PURE__ */ jsx(Input, { value: form.metric, onChange: (e) => set("metric", e.target.value), placeholder: "e.g. $310K recovered annually" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Bold stat shown on the card" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(Label, { children: [
              "Title / Description * (",
              form.description.length,
              " chars)"
            ] }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                value: form.description,
                onChange: (e) => {
                  set("description", e.target.value);
                  set("title", e.target.value);
                },
                placeholder: "1-2 sentences shown on the card",
                rows: 3
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Aim for under 140 characters" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Location *" }),
            /* @__PURE__ */ jsx(Input, { value: form.location, onChange: (e) => set("location", e.target.value), placeholder: "e.g. Calgary, Alberta" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "mb-2 block", children: "Tags *" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: tagOptions.map((tag) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
              /* @__PURE__ */ jsx(Checkbox, { checked: form.tags.includes(tag), onCheckedChange: () => toggleTag(tag) }),
              tag
            ] }, tag)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Case Type *" }),
              /* @__PURE__ */ jsxs(Select, { value: form.case_type, onValueChange: (v) => set("case_type", v), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "case_study", children: "Case Study" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "advisory", children: "Advisory" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Sort Order" }),
              /* @__PURE__ */ jsx(Input, { type: "number", value: form.sort_order, onChange: (e) => set("sort_order", parseInt(e.target.value) || 0) })
            ] })
          ] })
        ] }),
        form.case_type === "case_study" && /* @__PURE__ */ jsxs(Collapsible, { defaultOpen: hasExtendedContent, children: [
          /* @__PURE__ */ jsxs(CollapsibleTrigger, { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground", children: [
            /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" }),
            " Extended Content"
          ] }),
          /* @__PURE__ */ jsxs(CollapsibleContent, { className: "mt-4 space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Situation" }),
              /* @__PURE__ */ jsx(Textarea, { value: form.ext_situation, onChange: (e) => set("ext_situation", e.target.value), placeholder: "Describe the practice background, context, and what led to the engagement. 2–4 paragraphs.", rows: 5 })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "The Challenge" }),
              /* @__PURE__ */ jsx(Textarea, { value: form.ext_challenge, onChange: (e) => set("ext_challenge", e.target.value), placeholder: "What specific problems, risks, or blockers did Vitalis find or need to address?", rows: 4 })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "What We Did" }),
              /* @__PURE__ */ jsx(Textarea, { value: form.ext_what_we_did, onChange: (e) => set("ext_what_we_did", e.target.value), placeholder: "Describe the work Vitalis did — what was identified, decided, built, or implemented.", rows: 5 })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Results" }),
              /* @__PURE__ */ jsx(Textarea, { value: form.ext_results, onChange: (e) => set("ext_results", e.target.value), placeholder: "What were the outcomes? Be specific. Refer to the headline metric.", rows: 4 })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "mb-2 block", children: "Result Stats (up to 3)" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: form[`ext_stat_${n}_value`],
                    onChange: (e) => set(`ext_stat_${n}_value`, e.target.value),
                    placeholder: `Stat ${n} value — e.g. +19% above projection`
                  }
                ),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: form[`ext_stat_${n}_label`],
                    onChange: (e) => set(`ext_stat_${n}_label`, e.target.value),
                    placeholder: `Label — e.g. First 6 months`
                  }
                )
              ] }, n)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "mb-2 block", children: "Services in This Engagement" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: serviceOptions.map((service) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
                /* @__PURE__ */ jsx(Checkbox, { checked: form.ext_services.includes(service), onCheckedChange: () => toggleService(service) }),
                service
              ] }, service)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Slug *" }),
          /* @__PURE__ */ jsx(Input, { value: form.slug, onChange: (e) => set("slug", e.target.value), placeholder: "auto-generated-slug" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => saveMutation.mutate(false), disabled: saveMutation.isPending, children: "Save Draft" }),
          /* @__PURE__ */ jsx(Button, { variant: "hero", onClick: () => saveMutation.mutate(true), disabled: saveMutation.isPending, children: "Publish" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  PortfolioEditor as default
};
