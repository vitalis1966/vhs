import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Shield, Target, Users, TrendingUp } from "lucide-react";
const allReasons = [
  {
    icon: Shield,
    title: "Full-Cycle Expertise",
    description: "We don't just advise on a slice — we understand how every decision at one stage impacts every other. This integrated perspective produces dramatically better outcomes."
  },
  {
    icon: Target,
    title: "Actionable, Not Theoretical",
    description: "We deliver clear roadmaps and implementation support, not generic reports that gather dust. Every engagement ends with tangible outcomes."
  },
  {
    icon: Users,
    title: "Partnership, Not Transactions",
    description: "We build long-term relationships. Many clients work with us across multiple stages — from their first practice build through to eventual transition."
  },
  {
    icon: TrendingUp,
    title: "Deep Healthcare Focus",
    description: "We don't consult across 20 industries. We focus exclusively on healthcare — medical, dental, and veterinary practices, surgical centers, and healthcare organizations."
  }
];
function CredibilitySection({ variant = "full" }) {
  const reasons = variant === "homepage" ? allReasons.slice(0, 2) : allReasons;
  return /* @__PURE__ */ jsx("section", { className: "py-24 lg:py-32 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        className: "text-center max-w-2xl mx-auto mb-16",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Why Vitalis" })
          ] }),
          /* @__PURE__ */ jsxs("h2", { className: "font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight", children: [
            "Not just a consultant.",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-gradient-primary", children: "A strategic partner." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted-foreground text-lg leading-relaxed", children: "Vitalis was founded by clinicians and healthcare executives who have built, run, and grown private practices — not just advised them. Our team includes experience across medical, dental, and veterinary operations. We understand the day-to-day realities of running a practice because we have lived them." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: `grid ${variant === "homepage" ? "md:grid-cols-2 max-w-3xl" : "md:grid-cols-2 max-w-5xl"} gap-8 mx-auto`, children: reasons.map((reason, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, delay: i * 0.08 },
        className: "flex gap-5 p-6 rounded-2xl hover:bg-card hover:shadow-soft transition-all duration-300",
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(reason.icon, { className: "h-6 w-6 text-accent" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground", children: reason.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground leading-relaxed", children: reason.description })
          ] })
        ]
      },
      reason.title
    )) })
  ] }) });
}
export {
  CredibilitySection
};
