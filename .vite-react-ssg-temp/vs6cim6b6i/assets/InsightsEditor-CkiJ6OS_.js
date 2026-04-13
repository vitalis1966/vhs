import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { useParams, useNavigate, Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { L as Label, I as Input } from "./label-H2YDHQ-y.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D5gT6WoP.js";
import { ArrowLeft, ChevronDown, Check, Copy } from "lucide-react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { s as supabase } from "./client-CxdMKRkw.js";
import { t as toast } from "./use-toast-B2rUv-Rg.js";
import { useState, useEffect } from "react";
import { C as Collapsible, a as CollapsibleTrigger, b as CollapsibleContent } from "./collapsible-DUtqt5i7.js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@supabase/supabase-js";
import "@radix-ui/react-collapsible";
const categories = [
  "Practice Operations",
  "Revenue & Billing",
  "Growth & Expansion",
  "M&A & Transitions",
  "New Builds",
  "People & Leadership",
  "Regulatory Updates"
];
const InsightsEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "Practice Operations",
    status: "draft",
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    estimated_read_time: 5,
    excerpt: "",
    body: "",
    featured_image_url: "",
    meta_title: "",
    meta_description: ""
  });
  const { data: existing } = useQuery({
    queryKey: ["admin-insight", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase.from("insights_articles").select("*").eq("id", id).maybeSingle();
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
        category: existing.category || "Practice Operations",
        status: existing.status || "draft",
        date: existing.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        estimated_read_time: existing.estimated_read_time || 5,
        excerpt: existing.excerpt || "",
        body: existing.body || "",
        featured_image_url: existing.featured_image_url || "",
        meta_title: existing.meta_title || "",
        meta_description: existing.meta_description || ""
      });
    }
  }, [existing]);
  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const handleTitleChange = (val) => {
    setForm((f) => ({
      ...f,
      title: val,
      slug: isNew || f.slug === generateSlug(f.title) ? generateSlug(val) : f.slug
    }));
  };
  const saveMutation = useMutation({
    mutationFn: async (publish) => {
      const payload = {
        ...form,
        status: publish ? "published" : form.status,
        published_at: publish ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (isNew) {
        const { error } = await supabase.from("insights_articles").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("insights_articles").update(payload).eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: (_, publish) => {
      queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
      toast({ title: publish ? "Article published" : "Article saved" });
      navigate("/admin/insights");
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });
  const articleUrl = `${window.location.origin}/insights/${form.slug}`;
  const linkedInText = `${form.title} — ${(form.excerpt || "").split(".")[0]}. Read on the Vitalis website: ${articleUrl}`;
  const emailSubject = `New from Vitalis: ${form.title}`;
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "pt-28 pb-20 container mx-auto px-4 max-w-3xl", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/admin/insights", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
        " Back to Insights"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-8", children: isNew ? "New Article" : "Edit Article" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Title *" }),
          /* @__PURE__ */ jsx(Input, { value: form.title, onChange: (e) => handleTitleChange(e.target.value), placeholder: "Article title" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Slug" }),
          /* @__PURE__ */ jsx(Input, { value: form.slug, onChange: (e) => setForm((f) => ({ ...f, slug: e.target.value })), placeholder: "article-slug" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Category" }),
            /* @__PURE__ */ jsxs(Select, { value: form.category, onValueChange: (v) => setForm((f) => ({ ...f, category: v })), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Date" }),
            /* @__PURE__ */ jsx(Input, { type: "date", value: form.date, onChange: (e) => setForm((f) => ({ ...f, date: e.target.value })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Estimated Read Time (minutes)" }),
          /* @__PURE__ */ jsx(Input, { type: "number", min: 1, value: form.estimated_read_time, onChange: (e) => setForm((f) => ({ ...f, estimated_read_time: parseInt(e.target.value) || 5 })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Label, { children: [
            "Excerpt (",
            form.excerpt.length,
            "/300)"
          ] }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              value: form.excerpt,
              onChange: (e) => {
                if (e.target.value.length <= 300) setForm((f) => ({ ...f, excerpt: e.target.value }));
              },
              placeholder: "Short description...",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Featured Image URL" }),
          /* @__PURE__ */ jsx(Input, { value: form.featured_image_url, onChange: (e) => setForm((f) => ({ ...f, featured_image_url: e.target.value })), placeholder: "https://..." }),
          form.featured_image_url && /* @__PURE__ */ jsx("img", { src: form.featured_image_url, alt: "Preview", className: "mt-2 rounded-lg max-h-48 object-cover" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Body Content (Markdown)" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Supports ## headings, ### subheadings, **bold**, *italic*, - bullet lists, [link text](url), and --- horizontal rules." }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              value: form.body,
              onChange: (e) => setForm((f) => ({ ...f, body: e.target.value })),
              placeholder: "Write your article...",
              rows: 20,
              className: "font-mono text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Collapsible, { children: [
          /* @__PURE__ */ jsxs(CollapsibleTrigger, { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground", children: [
            /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4" }),
            " SEO Settings"
          ] }),
          /* @__PURE__ */ jsxs(CollapsibleContent, { className: "mt-4 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs(Label, { children: [
                "Meta Title (",
                form.meta_title.length,
                "/60)"
              ] }),
              /* @__PURE__ */ jsx(Input, { value: form.meta_title, onChange: (e) => setForm((f) => ({ ...f, meta_title: e.target.value })), maxLength: 60 })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs(Label, { children: [
                "Meta Description (",
                form.meta_description.length,
                "/160)"
              ] }),
              /* @__PURE__ */ jsx(Textarea, { value: form.meta_description, onChange: (e) => setForm((f) => ({ ...f, meta_description: e.target.value })), maxLength: 160, rows: 2 })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => saveMutation.mutate(false), disabled: saveMutation.isPending, children: "Save Draft" }),
          /* @__PURE__ */ jsx(Button, { variant: "hero", onClick: () => saveMutation.mutate(true), disabled: saveMutation.isPending, children: "Publish" })
        ] }),
        !isNew && existing?.status === "published" && /* @__PURE__ */ jsxs("div", { className: "mt-8 p-6 bg-muted/50 rounded-lg space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground", children: "Share this article" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Article URL" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-1", children: [
              /* @__PURE__ */ jsx(Input, { value: articleUrl, readOnly: true, className: "text-sm" }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => handleCopy(articleUrl), children: copied ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "LinkedIn Post" }),
            /* @__PURE__ */ jsx(Textarea, { value: linkedInText, readOnly: true, rows: 3, className: "text-sm mt-1" }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "mt-1", onClick: () => handleCopy(linkedInText), children: "Copy" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Email Subject" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-1", children: [
              /* @__PURE__ */ jsx(Input, { value: emailSubject, readOnly: true, className: "text-sm" }),
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleCopy(emailSubject), children: "Copy" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  InsightsEditor as default
};
