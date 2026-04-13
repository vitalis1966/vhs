import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { L as Link } from "./index-CalXArNJ.js";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { c as cn } from "./utils-H80jjgLf.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { Plus, RotateCcw, Save, Eye, ChevronUp, ChevronDown, Trash2, ExternalLink, Pencil, Info, ArrowLeft, Download, Globe, Settings, FileCode, ArrowRightLeft, Image as Image$1 } from "lucide-react";
import { B as Badge } from "./badge-Bd62qPcf.js";
import { L as Label, I as Input } from "./label-H2YDHQ-y.js";
import { T as Textarea } from "./textarea-B6XBNdk0.js";
import { S as Switch } from "./switch-B7aTy1Ss.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D5gT6WoP.js";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CtjoYuUO.js";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { s as supabase } from "./client-B5yO-kwf.js";
import { t as toast } from "./use-toast-B2rUv-Rg.js";
import { C as Card } from "./card-B9jBE8y5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-B7zeG0fx.js";
import "react-dom";
import "react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-switch";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
function CharCounter({ value, max, warn }) {
  const len = value.length;
  const color = len <= max ? "text-green-600" : len <= warn ? "text-amber-500" : "text-red-500";
  return /* @__PURE__ */ jsxs("span", { className: cn("text-xs font-mono", color), children: [
    len,
    "/",
    max
  ] });
}
function GooglePreview({ title, description, path, siteUrl }) {
  const displayUrl = siteUrl.replace(/^https?:\/\//, "") + (path === "/" ? "" : path);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-border rounded-lg p-4 space-y-1 max-w-xl", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: displayUrl }),
    /* @__PURE__ */ jsx("p", { className: "text-blue-700 text-base font-medium leading-tight truncate", children: title || "Page Title" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: description || "Page description will appear here…" })
  ] });
}
function SocialPreview({ title, description, image, siteUrl }) {
  const domain = siteUrl.replace(/^https?:\/\//, "");
  return /* @__PURE__ */ jsxs("div", { className: "border border-border rounded-lg overflow-hidden max-w-sm bg-white", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-muted h-40 flex items-center justify-center overflow-hidden", children: image ? /* @__PURE__ */ jsx("img", { src: image, alt: "OG Preview", className: "w-full h-full object-cover", onError: (e) => {
      e.target.style.display = "none";
    } }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "No image set" }) }),
    /* @__PURE__ */ jsxs("div", { className: "p-3 space-y-1", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground uppercase", children: domain }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold leading-tight line-clamp-2", children: title || "Page Title" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: description || "Description" })
    ] })
  ] });
}
function BreadcrumbBuilder({ value, onChange }) {
  const [showRaw, setShowRaw] = useState(false);
  const [rawJson, setRawJson] = useState("");
  const addItem = () => {
    onChange([...value, { position: value.length + 1, name: "", item: "/" }]);
  };
  const removeItem = (idx) => {
    const next = value.filter((_, i) => i !== idx).map((b, i) => ({ ...b, position: i + 1 }));
    onChange(next);
  };
  const updateItem = (idx, field, val) => {
    const next = [...value];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };
  const moveItem = (idx, dir) => {
    if (idx + dir < 0 || idx + dir >= value.length) return;
    const next = [...value];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    onChange(next.map((b, i) => ({ ...b, position: i + 1 })));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold", children: "Breadcrumbs" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => {
          setShowRaw(!showRaw);
          if (!showRaw) setRawJson(JSON.stringify(value, null, 2));
        }, children: showRaw ? "Visual" : "Raw JSON" }),
        /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: addItem, children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3 mr-1" }),
          "Add"
        ] })
      ] })
    ] }),
    showRaw ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Textarea, { value: rawJson, onChange: (e) => setRawJson(e.target.value), rows: 6, className: "font-mono text-xs" }),
      /* @__PURE__ */ jsx(Button, { type: "button", size: "sm", variant: "secondary", className: "mt-2", onClick: () => {
        try {
          onChange(JSON.parse(rawJson));
          setShowRaw(false);
        } catch {
          toast({ title: "Invalid JSON", variant: "destructive" });
        }
      }, children: "Apply JSON" })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      value.map((b, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground w-6", children: b.position }),
        /* @__PURE__ */ jsx(Input, { placeholder: "Name", value: b.name, onChange: (e) => updateItem(i, "name", e.target.value), className: "flex-1" }),
        /* @__PURE__ */ jsx(Input, { placeholder: "/path", value: b.item, onChange: (e) => updateItem(i, "item", e.target.value), className: "flex-1" }),
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => moveItem(i, -1), disabled: i === 0, children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-3 w-3" }) }),
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => moveItem(i, 1), disabled: i === value.length - 1, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" }) }),
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => removeItem(i), children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3 text-destructive" }) })
      ] }, i)),
      value.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: 'No breadcrumbs. Click "Add" to start.' })
    ] })
  ] });
}
function PagesTab() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({});
  const [savedForm, setSavedForm] = useState({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRoute, setNewRoute] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["seo-admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_pages").select("*").order("route");
      if (error) throw error;
      return data;
    }
  });
  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);
  const selectPage = useCallback((page) => {
    setSelectedId(page.id);
    setForm({ ...page });
    setSavedForm({ ...page });
  }, []);
  const updateField = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title") {
        if (!f.og_title) next._autoOgTitle = true;
        if (!f.twitter_title) next._autoTwitterTitle = true;
      }
      if (key === "description") {
        if (!f.og_description) next._autoOgDesc = true;
        if (!f.twitter_description) next._autoTwitterDesc = true;
      }
      return next;
    });
  };
  const saveMutation = useMutation({
    mutationFn: async (values) => {
      const { _autoOgTitle, _autoOgDesc, _autoTwitterTitle, _autoTwitterDesc, ...rest } = values;
      const { error } = await supabase.from("seo_pages").update(rest).eq("id", rest.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-pages"] });
      queryClient.invalidateQueries({ queryKey: ["seo-page"] });
      setSavedForm({ ...form });
      toast({ title: "✓ Page SEO saved" });
    },
    onError: (e) => toast({ title: "Error saving", description: e.message, variant: "destructive" })
  });
  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("seo_pages").insert({ route: newRoute, page_label: newLabel });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-pages"] });
      setShowAddDialog(false);
      setNewRoute("");
      setNewLabel("");
      toast({ title: "Page added" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" })
  });
  const siteUrl = "https://www.vitalisstrategies.com";
  const title = form.title || "";
  const description = form.description || "";
  const ogTitle = form.og_title || title;
  const ogDescription = form.og_description || description;
  const ogImage = form.og_image || "";
  form.twitter_title || ogTitle;
  form.twitter_description || ogDescription;
  const route = form.route || "/";
  const selectedPage = selectedId ? pages.find((p) => p.id === selectedId) : null;
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-6 min-h-[600px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-64 shrink-0 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Pages" }),
        /* @__PURE__ */ jsxs(Dialog, { open: showAddDialog, onOpenChange: setShowAddDialog, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3 mr-1" }),
            "Add"
          ] }) }),
          /* @__PURE__ */ jsxs(DialogContent, { children: [
            /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Add New Page" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Route" }),
                /* @__PURE__ */ jsx(Input, { value: newRoute, onChange: (e) => setNewRoute(e.target.value), placeholder: "/new-page" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Label" }),
                /* @__PURE__ */ jsx(Input, { value: newLabel, onChange: (e) => setNewLabel(e.target.value), placeholder: "New Page" })
              ] }),
              /* @__PURE__ */ jsx(Button, { onClick: () => addMutation.mutate(), disabled: !newRoute || !newLabel, children: "Add Page" })
            ] })
          ] })
        ] })
      ] }),
      isLoading && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1 max-h-[70vh] overflow-y-auto pr-1", children: pages.map((p) => {
        const isNoindex = p.noindex || p.robots && p.robots.includes("noindex");
        return /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              if (isDirty && !confirm("You have unsaved changes. Discard?")) return;
              selectPage(p);
            },
            className: cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              selectedId === p.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
            ),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: cn("w-2 h-2 rounded-full shrink-0", isNoindex ? "bg-gray-400" : "bg-green-500") }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: p.page_label }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: p.route })
              ] })
            ] })
          },
          p.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: !selectedPage ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full text-muted-foreground", children: /* @__PURE__ */ jsx("p", { children: "Select a page from the list to edit its SEO settings." }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between sticky top-0 bg-background z-10 pb-4 border-b", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-bold", children: form.page_label }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground font-mono", children: route })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          isDirty && /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-amber-600 bg-amber-50", children: "Unsaved changes" }),
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
            setForm({ ...savedForm });
          }, disabled: !isDirty, children: [
            /* @__PURE__ */ jsx(RotateCcw, { className: "h-3 w-3 mr-1" }),
            "Reset"
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => saveMutation.mutate(form), disabled: !isDirty || saveMutation.isPending, children: [
            /* @__PURE__ */ jsx(Save, { className: "h-3 w-3 mr-1" }),
            "Save"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Identity" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Page Route" }),
          /* @__PURE__ */ jsx(Input, { value: route, disabled: true, className: "bg-muted font-mono" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Page Label" }),
          /* @__PURE__ */ jsx(Input, { value: form.page_label || "", onChange: (e) => updateField("page_label", e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Title & Description" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { children: "Title" }),
            /* @__PURE__ */ jsx(CharCounter, { value: title, max: 60, warn: 70 })
          ] }),
          /* @__PURE__ */ jsx(Input, { value: title, onChange: (e) => updateField("title", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Label, { children: "Description" }),
            /* @__PURE__ */ jsx(CharCounter, { value: description, max: 155, warn: 165 })
          ] }),
          /* @__PURE__ */ jsx(Textarea, { value: description, onChange: (e) => updateField("description", e.target.value), rows: 3 })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Keywords" }),
          /* @__PURE__ */ jsx(Input, { value: form.keywords || "", onChange: (e) => updateField("keywords", e.target.value), placeholder: "comma, separated, keywords" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsxs("legend", { className: "text-sm font-semibold px-2 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" }),
          " Google Search Preview"
        ] }),
        /* @__PURE__ */ jsx(GooglePreview, { title, description, path: route, siteUrl })
      ] }),
      /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Robots & Indexing" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Robots Directive" }),
          /* @__PURE__ */ jsxs(Select, { value: form.robots || "index, follow", onValueChange: (v) => {
            updateField("robots", v);
            updateField("noindex", v.includes("noindex"));
          }, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "index, follow", children: "index, follow" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "noindex, follow", children: "noindex, follow" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "noindex, nofollow", children: "noindex, nofollow" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "noarchive", children: "noarchive" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Switch, { checked: !!form.noindex, onCheckedChange: (v) => {
            updateField("noindex", v);
            updateField("robots", v ? "noindex, follow" : "index, follow");
          } }),
          /* @__PURE__ */ jsx(Label, { children: "NoIndex" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Canonical Override" }),
          /* @__PURE__ */ jsx(Input, { value: form.canonical_override || "", onChange: (e) => updateField("canonical_override", e.target.value), placeholder: "Leave blank for auto-generated canonical" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Open Graph (Link Previews)" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "OG Title" }),
          /* @__PURE__ */ jsx(Input, { value: form.og_title || "", onChange: (e) => updateField("og_title", e.target.value), placeholder: "Leave blank to use Title" }),
          !form.og_title && title && /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 mt-1", children: "↳ Auto-filled from Title" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "OG Description" }),
          /* @__PURE__ */ jsx(Textarea, { value: form.og_description || "", onChange: (e) => updateField("og_description", e.target.value), rows: 2, placeholder: "Leave blank to use Description" }),
          !form.og_description && description && /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 mt-1", children: "↳ Auto-filled from Description" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "OG Image Path" }),
          /* @__PURE__ */ jsx(Input, { value: ogImage, onChange: (e) => updateField("og_image", e.target.value), placeholder: "/og-home.jpg" }),
          ogImage && /* @__PURE__ */ jsx(OgImageStatus, { path: ogImage })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "OG Image Alt" }),
          /* @__PURE__ */ jsx(Input, { value: form.og_image_alt || "", onChange: (e) => updateField("og_image_alt", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "OG Type" }),
          /* @__PURE__ */ jsxs(Select, { value: form.og_type || "website", onValueChange: (v) => updateField("og_type", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "website", children: "website" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "article", children: "article" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "product", children: "product" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-semibold", children: "Social Card Preview" }),
          /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(SocialPreview, { title: ogTitle, description: ogDescription, image: ogImage ? `${siteUrl}${ogImage}` : "", siteUrl }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Twitter / X Card" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Twitter Title" }),
          /* @__PURE__ */ jsx(Input, { value: form.twitter_title || "", onChange: (e) => updateField("twitter_title", e.target.value), placeholder: "Leave blank to use OG Title" }),
          !form.twitter_title && ogTitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 mt-1", children: "↳ Auto-filled from OG Title" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Twitter Description" }),
          /* @__PURE__ */ jsx(Textarea, { value: form.twitter_description || "", onChange: (e) => updateField("twitter_description", e.target.value), rows: 2, placeholder: "Leave blank to use OG Description" }),
          !form.twitter_description && ogDescription && /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 mt-1", children: "↳ Auto-filled from OG Description" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Twitter Image" }),
          /* @__PURE__ */ jsx(Input, { value: form.twitter_image || "", onChange: (e) => updateField("twitter_image", e.target.value), placeholder: "Leave blank to use OG Image" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Twitter Image Alt" }),
          /* @__PURE__ */ jsx(Input, { value: form.twitter_image_alt || "", onChange: (e) => updateField("twitter_image_alt", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Twitter Card Type" }),
          /* @__PURE__ */ jsxs(Select, { value: form.twitter_card || "summary_large_image", onValueChange: (v) => updateField("twitter_card", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "summary_large_image", children: "summary_large_image" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "summary", children: "summary" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Schema & Breadcrumbs" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Schema Type" }),
          /* @__PURE__ */ jsxs(Select, { value: form.schema_type || "WebPage", onValueChange: (v) => updateField("schema_type", v), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: ["WebPage", "AboutPage", "ContactPage", "CollectionPage", "Service", "Blog", "Article", "FAQPage"].map((t) => /* @__PURE__ */ jsx(SelectItem, { value: t, children: t }, t)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          BreadcrumbBuilder,
          {
            value: Array.isArray(form.breadcrumbs) ? form.breadcrumbs : [],
            onChange: (v) => updateField("breadcrumbs", v)
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Custom Schema JSON" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              value: form.schema_json ? JSON.stringify(form.schema_json, null, 2) : "",
              onChange: (e) => {
                try {
                  updateField("schema_json", JSON.parse(e.target.value));
                } catch {
                }
              },
              rows: 6,
              className: "font-mono text-xs",
              placeholder: "Leave blank to auto-generate from Schema Type"
            }
          )
        ] })
      ] }),
      form.og_type === "article" && /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Article Fields" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Author" }),
          /* @__PURE__ */ jsx(Input, { value: form.article_author || "", onChange: (e) => updateField("article_author", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Published Date" }),
          /* @__PURE__ */ jsx(Input, { type: "datetime-local", value: form.article_published?.slice(0, 16) || "", onChange: (e) => updateField("article_published", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Modified Date" }),
          /* @__PURE__ */ jsx(Input, { type: "datetime-local", value: form.article_modified?.slice(0, 16) || "", onChange: (e) => updateField("article_modified", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Section" }),
          /* @__PURE__ */ jsx(Input, { value: form.article_section || "", onChange: (e) => updateField("article_section", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { children: "Tags" }),
          /* @__PURE__ */ jsx(
            ArticleTagsInput,
            {
              value: form.article_tags || [],
              onChange: (v) => updateField("article_tags", v)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
        /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Status" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Switch, { checked: form.is_active !== false, onCheckedChange: (v) => updateField("is_active", v) }),
          /* @__PURE__ */ jsx(Label, { children: "SEO Active for this page" })
        ] })
      ] })
    ] }) })
  ] });
}
function OgImageStatus({ path }) {
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const img = new Image();
    img.onload = () => setStatus("found");
    img.onerror = () => setStatus("missing");
    img.src = path.startsWith("http") ? path : path;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [path]);
  if (status === "loading") return null;
  return status === "found" ? /* @__PURE__ */ jsx("p", { className: "text-xs text-green-600 mt-1", children: "✅ File found" }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: "⚠️ File not found — upload to /public/" });
}
function ArticleTagsInput({ value, onChange }) {
  const [input, setInput] = useState("");
  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInput("");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsx(Input, { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Add tag…", onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addTag();
        }
      } }),
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: addTag, children: "Add" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: value.map((tag) => /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "cursor-pointer", onClick: () => onChange(value.filter((t) => t !== tag)), children: [
      tag,
      " ×"
    ] }, tag)) })
  ] });
}
const INTEGRATION_CARDS = [
  { key: "google_analytics_id", label: "Google Analytics 4", icon: "📊", description: "Track website traffic and user behavior.", helpUrl: "https://analytics.google.com", helpLabel: "analytics.google.com" },
  { key: "google_tag_manager_head", label: "Google Tag Manager", icon: "🏷️", description: "Paste the two GTM snippets exactly as provided by Google Tag Manager. No ID needed — just paste the full code blocks.", helpUrl: "https://tagmanager.google.com", helpLabel: "tagmanager.google.com", isGtm: true },
  { key: "google_search_console", label: "Search Console Verification", icon: "🔍", description: "Paste the content value only — not the full <meta> tag.", helpUrl: "https://search.google.com/search-console", helpLabel: "search.google.com" },
  { key: "google_ads_id", label: "Google Ads", icon: "📣", description: "Conversion tracking for Google Ads campaigns.", helpUrl: "https://ads.google.com", helpLabel: "ads.google.com", relatedKeys: ["google_ads_conversion_label"] },
  { key: "bing_verification", label: "Bing Webmaster", icon: "🅱️", description: "Verify site ownership for Bing Webmaster Tools.", helpUrl: "https://www.bing.com/webmasters", helpLabel: "bing.com/webmasters" },
  { key: "pinterest_verification", label: "Pinterest Verification", icon: "📌", description: "Verify site ownership for Pinterest.", helpUrl: "https://business.pinterest.com", helpLabel: "business.pinterest.com" },
  { key: "meta_pixel_id", label: "Meta Pixel", icon: "📘", description: "Track conversions and build audiences for Meta ads.", helpUrl: "https://business.facebook.com/events_manager", helpLabel: "business.facebook.com" },
  { key: "linkedin_partner_id", label: "LinkedIn Insight Tag", icon: "💼", description: "Track conversions and retarget for LinkedIn ads.", helpUrl: "https://www.linkedin.com/campaignmanager", helpLabel: "linkedin.com/campaignmanager" },
  { key: "hotjar_id", label: "Hotjar", icon: "🔥", description: "Heatmaps, session recordings, and feedback.", helpUrl: "https://www.hotjar.com", helpLabel: "hotjar.com" },
  { key: "intercom_app_id", label: "Intercom", icon: "💬", description: "Live chat and customer support widget.", helpUrl: "https://www.intercom.com", helpLabel: "intercom.com" },
  { key: "crisp_website_id", label: "Crisp Chat", icon: "🗨️", description: "Live chat widget for customer conversations.", helpUrl: "https://crisp.chat", helpLabel: "crisp.chat" }
];
function GlobalTab() {
  const queryClient = useQueryClient();
  const { data: global, isLoading } = useQuery({
    queryKey: ["seo-admin-global"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_global").select("*").eq("id", 1).single();
      if (error) throw error;
      return data;
    }
  });
  const [form, setForm] = useState({});
  const [initialized, setInitialized] = useState(false);
  if (global && !initialized) {
    setForm(global);
    setInitialized(true);
  }
  const saveMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase.from("seo_global").update(values).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-global"] });
      queryClient.invalidateQueries({ queryKey: ["seo-global"] });
      queryClient.invalidateQueries({ queryKey: ["seo-global-scripts"] });
      toast({ title: "✓ Global settings saved" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" })
  });
  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  if (isLoading) return /* @__PURE__ */ jsx("p", { className: "text-muted-foreground p-4", children: "Loading…" });
  const hasGTM = !!(form.google_tag_manager_head || form.google_tag_manager_body);
  const hasGA4 = !!form.google_analytics_id;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => saveMutation.mutate(form), disabled: saveMutation.isPending, children: [
      /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 mr-1" }),
      "Save All Settings"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Site Defaults" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Site Name" }),
            /* @__PURE__ */ jsx(Input, { value: form.site_name || "", onChange: (e) => updateField("site_name", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Site URL" }),
            /* @__PURE__ */ jsx(Input, { value: form.site_url || "", onChange: (e) => updateField("site_url", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Site Locale" }),
            /* @__PURE__ */ jsx(Input, { value: form.site_locale || "", onChange: (e) => updateField("site_locale", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Default Title (fallback)" }),
            /* @__PURE__ */ jsx(Input, { value: form.default_title || "", onChange: (e) => updateField("default_title", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Default Description (fallback)" }),
            /* @__PURE__ */ jsx(Textarea, { value: form.default_description || "", onChange: (e) => updateField("default_description", e.target.value), rows: 2 })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Default Robots" }),
            /* @__PURE__ */ jsx(Input, { value: form.default_robots || "", onChange: (e) => updateField("default_robots", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Default OG Image" }),
            /* @__PURE__ */ jsx(Input, { value: form.default_og_image || "", onChange: (e) => updateField("default_og_image", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Theme Color" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
              /* @__PURE__ */ jsx("input", { type: "color", value: form.theme_color || "#1C3D2E", onChange: (e) => updateField("theme_color", e.target.value), className: "w-10 h-10 rounded border cursor-pointer" }),
              /* @__PURE__ */ jsx(Input, { value: form.theme_color || "", onChange: (e) => updateField("theme_color", e.target.value), className: "flex-1 font-mono" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Social Profiles" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Twitter/X Handle" }),
            /* @__PURE__ */ jsx(Input, { value: form.twitter_handle || "", onChange: (e) => updateField("twitter_handle", e.target.value), placeholder: "@vitalishealth" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Facebook App ID" }),
            /* @__PURE__ */ jsx(Input, { value: form.facebook_app_id || "", onChange: (e) => updateField("facebook_app_id", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Facebook Page URL" }),
            /* @__PURE__ */ jsx(Input, { value: form.facebook_page_url || "", onChange: (e) => updateField("facebook_page_url", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "LinkedIn URL" }),
            /* @__PURE__ */ jsx(Input, { value: form.linkedin_url || "", onChange: (e) => updateField("linkedin_url", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Instagram URL" }),
            /* @__PURE__ */ jsx(Input, { value: form.instagram_url || "", onChange: (e) => updateField("instagram_url", e.target.value) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Integrations" }),
        hasGTM && hasGA4 && /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm", children: [
          "⚠️ GTM is active. GA4 will ",
          /* @__PURE__ */ jsx("strong", { children: "not" }),
          " fire directly. Configure GA4 as a tag inside your GTM container at",
          " ",
          /* @__PURE__ */ jsx("a", { href: "https://tagmanager.google.com", target: "_blank", rel: "noopener noreferrer", className: "underline font-medium", children: "tagmanager.google.com" }),
          ". The GA4 ID here is stored for reference only while GTM is active."
        ] }),
        INTEGRATION_CARDS.map((card) => {
          const val = form[card.key] || "";
          const isActive = card.isGtm ? !!(form.google_tag_manager_head || form.google_tag_manager_body) : !!val;
          return /* @__PURE__ */ jsxs(Card, { className: "p-4 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg", children: card.icon }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: card.label })
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: isActive ? "default" : "secondary", className: cn(isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : ""), children: isActive ? "ACTIVE ✓" : "NOT CONFIGURED" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: card.description }),
            card.isGtm ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs font-semibold", children: "Paste in <head>" }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    value: form.google_tag_manager_head || "",
                    onChange: (e) => updateField("google_tag_manager_head", e.target.value),
                    placeholder: "Paste GTM head script here",
                    rows: 4,
                    className: "font-mono text-xs"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: 'From GTM: copy the script from Step 1 ("Paste this code as high in the <head> as possible") and paste it here.' })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { className: "text-xs font-semibold", children: "Paste after <body>" }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    value: form.google_tag_manager_body || "",
                    onChange: (e) => updateField("google_tag_manager_body", e.target.value),
                    placeholder: "Paste GTM noscript body snippet here",
                    rows: 4,
                    className: "font-mono text-xs"
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: 'From GTM: copy the noscript code from Step 2 ("Paste this code immediately after the opening <body> tag") and paste it here.' })
              ] })
            ] }) : /* @__PURE__ */ jsx(Input, { value: val, onChange: (e) => updateField(card.key, e.target.value), placeholder: `Enter ${card.label} ID`, className: "font-mono text-sm" }),
            card.relatedKeys?.map((rk) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Conversion Label" }),
              /* @__PURE__ */ jsx(Input, { value: form[rk] || "", onChange: (e) => updateField(rk, e.target.value), className: "font-mono text-sm" })
            ] }, rk)),
            /* @__PURE__ */ jsxs("a", { href: card.helpUrl, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-primary hover:underline flex items-center gap-1", children: [
              "Get from: ",
              card.helpLabel,
              " ",
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
            ] })
          ] }, card.key);
        }),
        /* @__PURE__ */ jsxs("fieldset", { className: "space-y-3 border border-border/40 rounded-xl p-4", children: [
          /* @__PURE__ */ jsx("legend", { className: "text-sm font-semibold px-2", children: "Custom Scripts" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Custom Head Script (JS)" }),
            /* @__PURE__ */ jsx(Textarea, { value: form.custom_head_script || "", onChange: (e) => updateField("custom_head_script", e.target.value), rows: 4, className: "font-mono text-xs" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { children: "Custom Body Script (JS)" }),
            /* @__PURE__ */ jsx(Textarea, { value: form.custom_body_script || "", onChange: (e) => updateField("custom_body_script", e.target.value), rows: 4, className: "font-mono text-xs" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function SchemaTab() {
  const queryClient = useQueryClient();
  const { data: schemas = [] } = useQuery({
    queryKey: ["seo-admin-schemas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_schema_global").select("*").order("id");
      if (error) throw error;
      return data;
    }
  });
  const { data: pages = [] } = useQuery({
    queryKey: ["seo-admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_pages").select("id, route, page_label, schema_type, schema_json, breadcrumbs, updated_at").order("route");
      if (error) throw error;
      return data;
    }
  });
  const [editingId, setEditingId] = useState(null);
  const [jsonStr, setJsonStr] = useState("");
  const [active, setActive] = useState(true);
  const [jsonError, setJsonError] = useState(null);
  const saveMutation = useMutation({
    mutationFn: async ({ id, schema_json, is_active }) => {
      const { error } = await supabase.from("seo_schema_global").update({ schema_json, is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-schemas"] });
      queryClient.invalidateQueries({ queryKey: ["seo-schemas-global"] });
      queryClient.invalidateQueries({ queryKey: ["seo-schema-global"] });
      setEditingId(null);
      toast({ title: "✓ Schema saved" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" })
  });
  const handleJsonChange = (val) => {
    setJsonStr(val);
    try {
      JSON.parse(val);
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Global Schema (every page)" }),
      editingId ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: schemas.find((s) => s.id === editingId)?.label }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => setEditingId(null), children: "Cancel" }),
            /* @__PURE__ */ jsxs(Button, { size: "sm", disabled: !!jsonError, onClick: () => {
              try {
                saveMutation.mutate({ id: editingId, schema_json: JSON.parse(jsonStr), is_active: active });
              } catch {
                toast({ title: "Invalid JSON", variant: "destructive" });
              }
            }, children: [
              /* @__PURE__ */ jsx(Save, { className: "h-3 w-3 mr-1" }),
              "Save"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Switch, { checked: active, onCheckedChange: setActive }),
          /* @__PURE__ */ jsx(Label, { children: "Active" })
        ] }),
        /* @__PURE__ */ jsx(Textarea, { value: jsonStr, onChange: (e) => handleJsonChange(e.target.value), rows: 20, className: "font-mono text-xs" }),
        jsonError && /* @__PURE__ */ jsxs("p", { className: "text-xs text-red-500", children: [
          "JSON Error: ",
          jsonError
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: schemas.map((s) => /* @__PURE__ */ jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: s.label }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
            "ID: ",
            s.id
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          !s.is_active && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "inactive" }),
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
            setEditingId(s.id);
            setJsonStr(JSON.stringify(s.schema_json, null, 2));
            setActive(s.is_active !== false);
            setJsonError(null);
          }, children: [
            /* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3 mr-1" }),
            "Edit"
          ] })
        ] })
      ] }) }, s.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Per-Page Schema Summary" }),
      /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Route" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Schema Type" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Custom JSON?" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Breadcrumbs" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: pages.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: p.route }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: p.schema_type || "WebPage" }) }),
          /* @__PURE__ */ jsx(TableCell, { children: p.schema_json ? "✓" : "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: Array.isArray(p.breadcrumbs) ? p.breadcrumbs.map((b) => b.name).join(" › ") : "—" })
        ] }, p.id)) })
      ] }) })
    ] })
  ] });
}
function RedirectsTab() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newType, setNewType] = useState("301");
  const [newNote, setNewNote] = useState("");
  const { data: redirects = [], isLoading } = useQuery({
    queryKey: ["seo-admin-redirects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_redirects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });
  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("seo_redirects").insert({
        from_path: newFrom,
        to_path: newTo,
        redirect_type: parseInt(newType),
        note: newNote || null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-redirects"] });
      setShowAdd(false);
      setNewFrom("");
      setNewTo("");
      setNewNote("");
      toast({ title: "✓ Redirect added" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" })
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("seo_redirects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-admin-redirects"] });
      toast({ title: "Redirect deleted" });
    }
  });
  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }) => {
      const { error } = await supabase.from("seo_redirects").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seo-admin-redirects"] })
  });
  if (isLoading) return /* @__PURE__ */ jsx("p", { className: "text-muted-foreground p-4", children: "Loading…" });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 text-sm flex gap-2", children: [
      /* @__PURE__ */ jsx(Info, { className: "h-4 w-4 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsx("p", { children: "Redirects defined here are stored in the database. The RedirectHandler component reads this table on app init and handles them via React Router navigation. For true server-side 301 redirects, configure your hosting provider's _redirects file and use this as a reference source." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        redirects.length,
        " redirect",
        redirects.length !== 1 ? "s" : "",
        " configured"
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3 mr-1" }),
          "Add Redirect"
        ] }) }),
        /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "New Redirect" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "From Path" }),
              /* @__PURE__ */ jsx(Input, { value: newFrom, onChange: (e) => setNewFrom(e.target.value), placeholder: "/old-page" }),
              newFrom && !newFrom.startsWith("/") && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: "Must start with /" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "To Path" }),
              /* @__PURE__ */ jsx(Input, { value: newTo, onChange: (e) => setNewTo(e.target.value), placeholder: "/new-page or https://..." }),
              newTo && !newTo.startsWith("/") && !newTo.startsWith("http") && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: "Must start with / or be a full URL" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Type" }),
              /* @__PURE__ */ jsxs(Select, { value: newType, onValueChange: setNewType, children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsx(SelectItem, { value: "301", children: "301 Permanent" }),
                  /* @__PURE__ */ jsx(SelectItem, { value: "302", children: "302 Temporary" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Note (optional)" }),
              /* @__PURE__ */ jsx(Input, { value: newNote, onChange: (e) => setNewNote(e.target.value), placeholder: "Reason for this redirect" })
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: () => addMutation.mutate(), disabled: !newFrom || !newTo || !newFrom.startsWith("/") || addMutation.isPending, children: "Add Redirect" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      redirects.map((r) => /* @__PURE__ */ jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono text-sm text-muted-foreground", children: r.from_path }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "→" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-semibold", children: r.to_path })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: r.redirect_type }),
            !r.is_active && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-gray-500", children: "Inactive" }),
            r.note && /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: r.note })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
          /* @__PURE__ */ jsx(Switch, { checked: r.is_active ?? true, onCheckedChange: (v) => toggleMutation.mutate({ id: r.id, is_active: v }) }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
            if (confirm("Delete this redirect?")) deleteMutation.mutate(r.id);
          }, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
        ] })
      ] }) }, r.id)),
      redirects.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-12", children: 'No redirects configured. Click "Add Redirect" to create one.' })
    ] })
  ] });
}
const FAVICON_FILES = [
  { file: "/favicon.ico", size: "any" },
  { file: "/favicon.svg", size: "vector" },
  { file: "/favicon-16x16.png", size: "16×16" },
  { file: "/favicon-32x32.png", size: "32×32" },
  { file: "/favicon-96x96.png", size: "96×96" },
  { file: "/apple-touch-icon.png", size: "180×180" },
  { file: "/apple-touch-icon-152x152.png", size: "152×152" },
  { file: "/apple-touch-icon-120x120.png", size: "120×120" },
  { file: "/safari-pinned-tab.svg", size: "vector" },
  { file: "/android-chrome-192x192.png", size: "192×192" },
  { file: "/android-chrome-512x512.png", size: "512×512" },
  { file: "/mstile-150x150.png", size: "150×150" },
  { file: "/site.webmanifest", size: "—" },
  { file: "/browserconfig.xml", size: "—" }
];
function FileStatus({ path }) {
  const [status, setStatus] = useState("checking");
  useEffect(() => {
    const isImage = /\.(png|jpg|jpeg|svg|ico|webp)$/i.test(path);
    if (isImage) {
      const img = new Image();
      img.onload = () => setStatus("found");
      img.onerror = () => setStatus("missing");
      img.src = path;
    } else {
      fetch(path, { method: "HEAD" }).then((r) => setStatus(r.ok ? "found" : "missing")).catch(() => setStatus("missing"));
    }
  }, [path]);
  if (status === "checking") return /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "…" });
  return status === "found" ? /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-green-50 text-green-700 text-xs", children: "✅ Found" }) : /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "bg-red-50 text-red-600 text-xs", children: "⚠️ Missing" });
}
function OgImageRow({ route, label, ogImage }) {
  if (!ogImage) return /* @__PURE__ */ jsxs(TableRow, { children: [
    /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: label }),
    /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: route }),
    /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: "No image set" }),
    /* @__PURE__ */ jsx(TableCell, { children: "—" }),
    /* @__PURE__ */ jsx(TableCell, { children: "—" })
  ] });
  return /* @__PURE__ */ jsxs(TableRow, { children: [
    /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: label }),
    /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: ogImage }),
    /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FileStatus, { path: ogImage }) }),
    /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("img", { src: ogImage, alt: "", className: "w-20 h-10 object-cover rounded border", onError: (e) => {
      e.target.style.display = "none";
    } }) })
  ] });
}
function FaviconsTab() {
  const { data: pages = [] } = useQuery({
    queryKey: ["seo-admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("seo_pages").select("route, page_label, og_image").order("route");
      if (error) throw error;
      return data;
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Favicon Files" }),
        /* @__PURE__ */ jsxs("a", { href: "https://realfavicongenerator.net", target: "_blank", rel: "noopener noreferrer", className: "text-xs text-primary hover:underline flex items-center gap-1", children: [
          "Generate all sizes at realfavicongenerator.net ",
          /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "File" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Size" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: FAVICON_FILES.map((f) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-mono text-xs", children: f.file }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-xs text-muted-foreground", children: f.size }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(FileStatus, { path: f.file }) })
        ] }, f.file)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "OG Images" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "OG images must be 1200×630px JPG/PNG. Place in /public/ folder." }),
      /* @__PURE__ */ jsx("div", { className: "border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Page" }),
          /* @__PURE__ */ jsx(TableHead, { children: "OG Image Path" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Preview" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: pages.map((p) => /* @__PURE__ */ jsx(OgImageRow, { route: p.route, label: p.page_label, ogImage: p.og_image }, p.route)) })
      ] }) })
    ] })
  ] });
}
async function generateSitemap(supabase2, siteUrl) {
  const { data: pages } = await supabase2.from("seo_pages").select("route, robots, updated_at").eq("is_active", true);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const publicPages = (pages || []).filter(
    (p) => !p.route.startsWith("/admin") && !["noindex"].some((n) => p.robots?.includes(n))
  );
  const priorityMap = {
    "/": "1.0",
    "/solutions/new-clinics": "0.9",
    "/solutions/existing-clinics": "0.9",
    "/solutions": "0.9",
    "/contact": "0.8",
    "/strategic-assessment": "0.8",
    "/about": "0.8",
    "/how-we-work": "0.8"
  };
  const changefreqMap = {
    "/": "weekly",
    "/insights": "weekly"
  };
  const urls = publicPages.map((p) => `  <url>
    <loc>${siteUrl}${p.route === "/" ? "" : p.route}/</loc>
    <lastmod>${p.updated_at ? p.updated_at.split("T")[0] : today}</lastmod>
    <changefreq>${changefreqMap[p.route] || "monthly"}</changefreq>
    <priority>${priorityMap[p.route] || "0.7"}</priority>
  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
function SEOAdmin() {
  const [generating, setGenerating] = useState(false);
  const handleGenerateSitemap = async () => {
    setGenerating(true);
    try {
      const { data: global } = await supabase.from("seo_global").select("site_url").single();
      const siteUrl = global?.site_url || "https://www.vitalisstrategies.com";
      const xml = await generateSitemap(supabase, siteUrl);
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sitemap.xml";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "✓ Sitemap generated", description: "Upload this file to /public/sitemap.xml to make it live." });
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-6 lg:pt-40 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-7xl", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/admin", className: "text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to Admin"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "SEO Management" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: "SEO Settings" }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleGenerateSitemap, disabled: generating, children: [
          /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-1" }),
          generating ? "Generating…" : "Generate & Download Sitemap"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-6 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-7xl", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "pages", children: [
      /* @__PURE__ */ jsxs(TabsList, { className: "mb-6 flex-wrap h-auto gap-1", children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "pages", className: "gap-1", children: [
          /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
          "Pages"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "global", className: "gap-1", children: [
          /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }),
          "Global & Integrations"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "schema", className: "gap-1", children: [
          /* @__PURE__ */ jsx(FileCode, { className: "h-4 w-4" }),
          "Schema"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "redirects", className: "gap-1", children: [
          /* @__PURE__ */ jsx(ArrowRightLeft, { className: "h-4 w-4" }),
          "Redirects"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { value: "favicons", className: "gap-1", children: [
          /* @__PURE__ */ jsx(Image$1, { className: "h-4 w-4" }),
          "Favicons & OG Images"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "pages", children: /* @__PURE__ */ jsx(PagesTab, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "global", children: /* @__PURE__ */ jsx(GlobalTab, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "schema", children: /* @__PURE__ */ jsx(SchemaTab, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "redirects", children: /* @__PURE__ */ jsx(RedirectsTab, {}) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "favicons", children: /* @__PURE__ */ jsx(FaviconsTab, {}) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  SEOAdmin as default
};
