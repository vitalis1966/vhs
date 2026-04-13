import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-CxdMKRkw.js";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowLeft, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
const renderParagraphs = (text) => text.split("\n\n").filter(Boolean).map((p, i) => /* @__PURE__ */ jsx("p", { className: "text-foreground/90 leading-relaxed mb-4 last:mb-0", children: p }, i));
const PortfolioDetail = () => {
  const { slug } = useParams();
  const { data: c, isLoading } = useQuery({
    queryKey: ["portfolio-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_cases").select("*").eq("slug", slug).eq("status", "published").single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });
  const stats = c ? [
    { value: c.ext_stat_1_value, label: c.ext_stat_1_label },
    { value: c.ext_stat_2_value, label: c.ext_stat_2_label },
    { value: c.ext_stat_3_value, label: c.ext_stat_3_label }
  ].filter((s) => s.value) : [];
  const services = c?.ext_services || [];
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("div", { className: "pt-32 pb-20 container mx-auto px-4 max-w-[780px]", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 w-40 bg-muted rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-10 w-3/4 bg-muted rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 w-full bg-muted rounded" })
      ] }) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  if (!c) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsxs("div", { className: "pt-32 pb-20 container mx-auto px-4 max-w-[780px] text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold text-foreground mb-4", children: "Case study not found" }),
        /* @__PURE__ */ jsx(Button, { variant: "hero", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/portfolio", children: "Back to Portfolio" }) })
      ] }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
  }
  const tags = c.tags || [];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("article", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-[780px]", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/portfolio", className: "text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
        " Back to Portfolio"
      ] }),
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, className: "flex gap-2 flex-wrap mb-3", children: tags.map((t) => /* @__PURE__ */ jsx("span", { className: "text-xs text-foreground px-2.5 py-1 rounded-full border border-border", style: { borderWidth: "0.5px" }, children: t }, t)) }),
      /* @__PURE__ */ jsx(motion.p, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 }, className: "text-xs text-muted-foreground uppercase tracking-widest mb-2", children: c.specialty }),
      /* @__PURE__ */ jsx(motion.h1, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "font-display text-3xl lg:text-4xl font-bold text-forest tracking-tight leading-tight mb-4", children: c.metric }),
      /* @__PURE__ */ jsx(motion.p, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.15 }, className: "text-foreground/90 leading-relaxed text-lg mb-3", children: c.description }),
      c.location && /* @__PURE__ */ jsxs(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, className: "text-sm text-muted-foreground flex items-center gap-1.5 mb-8", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" }),
        " ",
        c.location
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "border-t mb-10", style: { borderColor: "#B8860B" } }),
      c.ext_situation && /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-forest mb-4", children: "Situation" }),
        renderParagraphs(c.ext_situation)
      ] }),
      c.ext_challenge && /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-forest mb-4", children: "The Challenge" }),
        renderParagraphs(c.ext_challenge)
      ] }),
      c.ext_what_we_did && /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-forest mb-4", children: "What We Did" }),
        renderParagraphs(c.ext_what_we_did)
      ] }),
      c.ext_results && /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-forest mb-4", children: "Results" }),
        renderParagraphs(c.ext_results)
      ] }),
      stats.length > 0 && /* @__PURE__ */ jsx("section", { className: "mb-10", children: /* @__PURE__ */ jsx("div", { className: `grid gap-4 ${stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-2" : "grid-cols-3"}`, children: stats.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "bg-muted/40 rounded-lg p-5 text-center border border-border", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-forest mb-1", children: s.value }),
        s.label && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
      ] }, i)) }) }),
      services.length > 0 && /* @__PURE__ */ jsxs("section", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl font-bold text-forest mb-4", children: "Services in This Engagement" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: services.map((s) => /* @__PURE__ */ jsx("span", { className: "text-xs text-foreground px-3 py-1.5 rounded-full border border-border bg-muted/30", children: s }, s)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "pt-8 border-t border-border text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-5 text-lg", children: "Want to discuss a similar engagement?" }),
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
          "Speak With Our Team ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  PortfolioDetail as default
};
