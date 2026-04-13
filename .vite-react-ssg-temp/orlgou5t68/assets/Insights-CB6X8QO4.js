import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-DZHwhlEF.js";
import { Footer } from "./Footer-vLUE6RrN.js";
import { motion } from "framer-motion";
import { L as Link } from "./index-CalXArNJ.js";
import { ArrowRight } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-B5yO-kwf.js";
import { format } from "date-fns";
import "./button-DnzOxZqg.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "react-router";
import "react-dom";
import "./PageSEOContext-DZ23I7UH.js";
import "@supabase/phoenix";
import "iceberg-js";
import "@supabase/auth-js";
import "tslib";
const categories = [
  "All",
  "Practice Operations",
  "Revenue & Billing",
  "Growth & Expansion",
  "M&A & Transitions",
  "New Builds",
  "People & Leadership",
  "Regulatory Updates"
];
const Insights = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  usePageMeta(
    "Insights — Canadian Healthcare Practice | Vitalis",
    "The Vitalis team shares insights on the operational, financial, and strategic decisions facing medical, dental, and veterinary practices across Canada.",
    "/og-insights.jpg"
  );
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["insights-articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("insights_articles").select("*").eq("status", "published").order("date", { ascending: false });
      if (error) throw error;
      return data;
    }
  });
  const filtered = activeCategory === "All" ? articles : articles.filter((a) => a.category === activeCategory);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Insights" })
      ] }),
      /* @__PURE__ */ jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: "Perspectives on Canadian healthcare practice." }),
      /* @__PURE__ */ jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl", children: "The Vitalis team shares insights on the operational, financial, and strategic decisions facing medical, dental, and veterinary practices across Canada." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-6 bg-background border-b border-border sticky top-[72px] z-30", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto flex-nowrap pb-1 scrollbar-hide", children: categories.map((cat) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActiveCategory(cat),
        className: `whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${activeCategory === cat ? "bg-forest text-primary-foreground border-forest" : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"}`,
        children: cat
      },
      cat
    )) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/60 p-6 animate-pulse", style: { borderTopWidth: "3px", borderTopColor: "hsl(var(--forest))" }, children: [
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-muted rounded w-24 mb-3" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-muted rounded w-20 mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "h-5 bg-muted rounded w-full mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-5 bg-muted rounded w-3/4 mb-4" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-muted rounded w-full mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-muted rounded w-2/3" })
    ] }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: "No articles in this category yet." }),
      /* @__PURE__ */ jsx("button", { onClick: () => setActiveCategory("All"), className: "mt-4 text-accent underline underline-offset-4 hover:text-accent/80", children: "Show all articles" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filtered.map((article, i) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.04, duration: 0.35 },
        children: /* @__PURE__ */ jsx(
          Link,
          {
            to: `/insights/${article.slug}`,
            className: "group bg-background rounded-lg border border-border/60 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-border h-full",
            style: { borderTopWidth: "3px", borderTopColor: "hsl(var(--forest))" },
            children: /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-foreground px-2.5 py-0.5 rounded-full border border-border bg-transparent self-start mb-2", children: article.category }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-3", children: article.date ? format(new Date(article.date), "MMMM yyyy") : "" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-forest leading-snug mb-3 line-clamp-3", children: article.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4", children: article.excerpt }),
              /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-accent group-hover:underline inline-flex items-center gap-1", children: [
                "Read more ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
              ] }) })
            ] })
          }
        )
      },
      article.id
    )) }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Insights as default
};
