import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { X, MapPin, ArrowRight, Briefcase } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-CxdMKRkw.js";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { c as cn } from "./utils-H80jjgLf.js";
import "@radix-ui/react-slot";
import "./PageSEOContext-DZ23I7UH.js";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(
  ({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(SheetPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
      children,
      /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [
        /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
      ] })
    ] })
  ] })
);
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, { ref, className: cn("text-lg font-semibold text-foreground", className), ...props }));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
const filterOptions = ["All", "New Build", "Revenue & Billing", "Operations", "Technology", "People", "Advisory"];
const borderColorMap = {
  "New Build": "#264a39",
  "Revenue & Billing": "#b5832a",
  "Operations": "#3b5a7a",
  "Growth": "#c47c2b",
  "M&A": "#6b3d5a",
  "Technology": "#2a6b6b",
  "People": "#8b4a3a",
  "Advisory": "#5a7a5a"
};
const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  usePageMeta(
    "Healthcare Consulting Portfolio & Case Studies | Vitalis",
    "A selection of healthcare consulting engagements across practice builds, revenue optimization, M&A advisory, and digital transformation.",
    "/og-portfolio.jpg"
  );
  const { data: allCases = [] } = useQuery({
    queryKey: ["portfolio-cases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_cases").select("*").eq("status", "published").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });
  const filteredCases = activeFilter === "All" ? allCases : allCases.filter((c) => c.tags?.includes(activeFilter));
  const selectedCase = allCases.find((c) => c.id === selectedCaseId) || null;
  const hasExtended = (cs) => !!(cs.ext_situation || cs.ext_challenge || cs.ext_what_we_did || cs.ext_results);
  const handleCardClick = (cs) => {
    if (cs.case_type !== "advisory" && hasExtended(cs)) {
      setSelectedCaseId(cs.id);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Our Work" })
      ] }),
      /* @__PURE__ */ jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: "Engagements that moved practices forward." }),
      /* @__PURE__ */ jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl", children: "A selection of strategic, operational, and development engagements across Canada. Practice names and identifying details changed for confidentiality." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-6 bg-background sticky top-[72px] z-30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto flex-nowrap pb-1 scrollbar-hide", children: filterOptions.map((filter) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveFilter(filter),
          className: `whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${activeFilter === filter ? "bg-forest text-primary-foreground border-forest" : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"}`,
          children: filter
        },
        filter
      )) }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 border-b", style: { borderColor: "rgba(0,0,0,0.08)" } })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "pt-8 pb-16 lg:pb-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: filteredCases.map((cs, i) => {
        const isFirst = i === 0 && activeFilter === "All";
        const isAdvisory = cs.case_type === "advisory";
        const tags = cs.tags || [];
        const topBorderColor = borderColorMap[tags[0]] || "#264a39";
        const rowIndex = Math.floor(i / 3);
        const isAltRow = rowIndex % 2 === 1;
        const isClickable = !isAdvisory && hasExtended(cs);
        return /* @__PURE__ */ jsx(
          motion.div,
          {
            layout: true,
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95 },
            transition: { delay: i * 0.04, duration: 0.35 },
            className: `group bg-white rounded-lg overflow-hidden flex flex-col min-h-[200px] transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${isFirst ? "lg:col-span-2" : ""} ${isClickable ? "cursor-pointer" : ""}`,
            style: {
              borderTop: `3px solid ${topBorderColor}`,
              border: `1px solid rgba(0,0,0,0.12)`,
              borderTopWidth: "3px",
              borderTopColor: topBorderColor,
              background: isAltRow ? "rgba(38, 74, 57, 0.02)" : "white"
            },
            role: isClickable ? "button" : void 0,
            tabIndex: isClickable ? 0 : void 0,
            onClick: () => handleCardClick(cs),
            onKeyDown: (e) => {
              if ((e.key === "Enter" || e.key === " ") && isClickable) {
                e.preventDefault();
                setSelectedCaseId(cs.id);
              }
            },
            children: /* @__PURE__ */ jsxs("div", { className: "p-5 flex flex-col flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: tags.map((t) => /* @__PURE__ */ jsx("span", { className: "text-xs text-foreground px-2 py-0.5 rounded-full border border-border", style: { borderWidth: "0.5px" }, children: t }, t)) }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground uppercase tracking-widest mt-2", children: cs.specialty }),
              !isAdvisory && cs.metric ? /* @__PURE__ */ jsx("p", { className: "text-sm font-bold mt-1.5 mb-2 pl-2", style: { color: topBorderColor, borderLeft: `2px solid ${topBorderColor}` }, children: cs.metric }) : null,
              /* @__PURE__ */ jsx("h3", { className: `font-display font-semibold text-forest leading-[1.4] ${isAdvisory ? "mt-2" : ""} ${isFirst ? "text-xl" : "text-base"}`, children: cs.title }),
              /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-3", children: [
                cs.location && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
                  cs.location
                ] }),
                !isAdvisory && !!(cs.ext_situation || cs.ext_challenge || cs.ext_what_we_did || cs.ext_results) && /* @__PURE__ */ jsxs(Link, { to: `/portfolio/${cs.slug}`, className: "text-sm font-medium text-accent hover:underline inline-flex items-center gap-1 mt-2", onClick: (e) => e.stopPropagation(), children: [
                  "Read more ",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
                ] })
              ] })
            ] })
          },
          cs.id
        );
      }) }) }),
      filteredCases.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: "No engagements match this filter." }),
        /* @__PURE__ */ jsx("button", { onClick: () => setActiveFilter("All"), className: "mt-4 text-accent underline underline-offset-4 hover:text-accent/80", children: "Show all engagements" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6 text-lg", children: "Want to discuss how we can help your organization?" }),
      /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
        "Speak With Our Team ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(Sheet, { open: !!selectedCase, onOpenChange: (open) => {
      if (!open) setSelectedCaseId(null);
    }, children: /* @__PURE__ */ jsx(SheetContent, { side: "right", className: "w-full sm:max-w-[640px] p-0 overflow-y-auto", children: selectedCase && /* @__PURE__ */ jsxs("div", { className: "flex flex-col min-h-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 pb-0", children: [
        /* @__PURE__ */ jsxs(SheetHeader, { className: "text-left mb-0", children: [
          /* @__PURE__ */ jsxs(SheetDescription, { className: "text-xs font-medium tracking-widest uppercase text-accent mb-3", children: [
            selectedCase.specialty,
            selectedCase.location ? `, ${selectedCase.location}` : ""
          ] }),
          /* @__PURE__ */ jsx(SheetTitle, { className: "font-display text-2xl lg:text-3xl font-bold text-foreground leading-snug", children: selectedCase.title })
        ] }),
        selectedCase.metric && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground border-y border-border py-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Briefcase, { className: "w-3.5 h-3.5" }),
            (selectedCase.tags || []).join(", ")
          ] }),
          selectedCase.location && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" }),
            selectedCase.location
          ] })
        ] }),
        selectedCase.metric && /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg font-bold text-forest", children: selectedCase.metric })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 lg:p-8 space-y-8 flex-1", children: [
        selectedCase.description && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-widest uppercase text-accent mb-3", children: "Overview" }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground/90 leading-relaxed", children: selectedCase.description })
        ] }),
        selectedCase.body && /* @__PURE__ */ jsxs("div", { className: "prose prose-sm max-w-none text-foreground/90", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold tracking-widest uppercase text-accent mb-3", children: "Details" }),
          selectedCase.body.split("\n\n").map((p, i) => /* @__PURE__ */ jsx("p", { className: "leading-relaxed mb-4 last:mb-0", children: p }, i))
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "sticky bottom-0 p-6 lg:p-8 pt-4 pb-6 bg-background border-t border-border", children: /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", className: "w-full", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
        "Discuss a similar engagement ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) }) })
    ] }) }) })
  ] });
};
export {
  Portfolio as default
};
