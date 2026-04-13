import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { B as Button } from "./button-DnzOxZqg.js";
import { ArrowRight, DollarSign, Clock, TrendingUp, Receipt, Settings, Users, PiggyBank, Rocket, ShieldCheck, Compass, Building, CheckCircle, Stethoscope, Monitor, ClipboardList, FileText, MessageSquare, ChevronRight, Quote } from "lucide-react";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import "react";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./PageSEOContext-DZ23I7UH.js";
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};
const dimensions = [
  { num: "1", name: "Billing & Revenue Integrity", detail: "Fee collection rates, claim accuracy, denial patterns, uncaptured charges", icon: Receipt, score: 62 },
  { num: "2", name: "Operational Efficiency", detail: "Patient flow, scheduling utilization, appointment throughput, bottlenecks", icon: Settings, score: 74 },
  { num: "3", name: "Staffing & Workforce", detail: "Role alignment, recruitment gaps, retention risk, cost per staff member", icon: Users, score: 58 },
  { num: "4", name: "Financial Health", detail: "Overhead ratios, profitability by service line, cash flow patterns", icon: PiggyBank, score: 70 },
  { num: "5", name: "Growth Readiness", detail: "Capacity utilization, market positioning, expansion feasibility", icon: Rocket, score: 45 },
  { num: "6", name: "Compliance & Risk", detail: "Regulatory exposure, documentation gaps, liability considerations", icon: ShieldCheck, score: 82 },
  { num: "7", name: "Strategic Direction", detail: "Leadership bandwidth, growth trajectory, long-term planning infrastructure", icon: Compass, score: 53 }
];
function SampleRadarChart() {
  const labels = dimensions.map((d) => d.name.split(" ")[0]);
  const scores = dimensions.map((d) => d.score);
  const cx = 150, cy = 150, maxR = 110;
  const n = scores.length;
  const pointsForRadius = (r) => Array.from({ length: n }, (_, i) => {
    const angle = Math.PI * 2 * i / n - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
  const dataPoints = scores.map((s, i) => {
    const angle = Math.PI * 2 * i / n - Math.PI / 2;
    const r = s / 100 * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const labelPositions = labels.map((_, i) => {
    const angle = Math.PI * 2 * i / n - Math.PI / 2;
    const r = maxR + 22;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 300 300", className: "w-full max-w-[280px] mx-auto", children: [
    [0.25, 0.5, 0.75, 1].map(
      (pct) => /* @__PURE__ */ jsx("polygon", { points: pointsForRadius(maxR * pct), fill: "none", stroke: "hsl(var(--border))", strokeWidth: "0.5", opacity: 0.6 }, pct)
    ),
    Array.from({ length: n }, (_, i) => {
      const angle = Math.PI * 2 * i / n - Math.PI / 2;
      return /* @__PURE__ */ jsx("line", { x1: cx, y1: cy, x2: cx + maxR * Math.cos(angle), y2: cy + maxR * Math.sin(angle), stroke: "hsl(var(--border))", strokeWidth: "0.5", opacity: 0.4 }, i);
    }),
    /* @__PURE__ */ jsx("polygon", { points: dataPoints.map((p) => `${p.x},${p.y}`).join(" "), fill: "hsl(var(--accent) / 0.2)", stroke: "hsl(var(--accent))", strokeWidth: "2" }),
    dataPoints.map(
      (p, i) => /* @__PURE__ */ jsx("circle", { cx: p.x, cy: p.y, r: "3.5", fill: "hsl(var(--accent))" }, i)
    ),
    labelPositions.map(
      (p, i) => /* @__PURE__ */ jsx("text", { x: p.x, y: p.y, textAnchor: "middle", dominantBaseline: "middle", className: "fill-muted-foreground", fontSize: "8", fontWeight: "500", children: labels[i] }, i)
    )
  ] });
}
const StrategicAssessment = () => {
  usePageMeta(
    "Strategic Assessment | Operational & Financial Analysis | Vitalis Health Strategies",
    "A structured assessment across 7 dimensions of practice performance. See where your practice stands and where to focus first.",
    "/og-strategic-assessment.jpg"
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("section", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight", children: "Find Out What Your Strategic Assessment Reveals About Your Performance." }),
      /* @__PURE__ */ jsx("p", { className: "mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto", children: "Most practice owners are too close to day-to-day operations to see clearly where revenue is being left uncollected, where workflows are adding unnecessary cost, or where growth is being blocked. The Vitalis Strategic Assessment gives you an independent, structured view — across seven dimensions of practice performance — in about 15 minutes." }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-muted-foreground/70 tracking-wide", children: "Completed by practices across medical, dental, and veterinary fields in Canada" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10", children: [
        /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment/intake", children: [
          "Begin Your Assessment",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Complimentary. Confidential. Takes approximately 15 minutes." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      /* @__PURE__ */ jsx(motion.div, { ...fadeUp, className: "text-center mb-16", children: /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Three patterns we see across almost every practice we assess." }) }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-3 gap-6", children: [
        { icon: DollarSign, label: "Billing Gaps", text: "Assessments consistently identify fee collection gaps that are not visible from inside the practice — in coding, claim submission, and follow-up processes." },
        { icon: Clock, label: "Workflow Costs", text: "Scheduling inefficiencies and redundant administrative processes are among the most common sources of unnecessary overhead identified in practice assessments." },
        { icon: TrendingUp, label: "Blocked Growth", text: "Practices that want to expand often discover their current staffing structure, capacity model, or technology setup cannot support the next stage without significant rework." }
      ].map(
        (item, i) => /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: i * 0.08 }, className: "bg-card rounded-2xl p-7 shadow-soft border border-border/40 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(item.icon, { className: "h-6 w-6 text-accent" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2", children: item.label }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: item.text })
        ] }, item.label)
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-6", children: "What the assessment examines." }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto", children: "The Vitalis Strategic Assessment is structured around seven dimensions. Each one is designed to surface issues that are difficult to see without an external, structured review." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: dimensions.map(
        (d, i) => /* @__PURE__ */ jsx(motion.div, { ...fadeUp, transition: { delay: i * 0.05 }, className: "bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(d.icon, { className: "h-5 w-5 text-accent" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-accent/70 tracking-wider", children: [
              "0",
              d.num
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-bold text-foreground mt-0.5 mb-2", children: d.name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: d.detail })
          ] })
        ] }) }, d.num)
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsx(motion.div, { ...fadeUp, className: "text-center mb-16", children: /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Which assessment fits your situation?" }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0 }, className: "bg-card rounded-2xl p-6 lg:p-8 shadow-card border-2 border-primary/30 flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block text-xs font-semibold uppercase tracking-wider bg-primary/15 text-primary px-3 py-1 rounded-full self-start mb-4", children: "Planning a New Practice" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Building, { className: "h-6 w-6 text-primary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground", children: "Build Strategy Assessment" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-5", children: "Designed for practitioners in the planning or early development phase. This assessment evaluates your readiness across feasibility, financial planning, regulatory requirements, facility design, staffing, and operational launch preparation." }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-2", children: "What you will receive" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-5", children: [
            "A readiness summary across six planning dimensions",
            "A prioritized list of decisions to address before committing resources",
            "Guidance on where specialist support is most likely to be needed"
          ].map(
            (item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-primary flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: item })
            ] }, item)
          ) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/70 italic mb-6", children: "Ideal for: Practitioners planning a new medical clinic, dental office, or veterinary facility." }),
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "default", asChild: true, className: "w-full mt-auto h-12 whitespace-normal text-center", children: /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment/intake?path=new-build", children: "Start Your Build Strategy Assessment →" }) })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.1 }, className: "bg-card rounded-2xl p-6 lg:p-8 shadow-card border-2 border-accent/30 flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block text-xs font-semibold uppercase tracking-wider bg-accent/15 text-accent px-3 py-1 rounded-full self-start mb-4", children: "Existing Practice" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Stethoscope, { className: "h-6 w-6 text-accent" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground", children: "Performance Assessment" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-5", children: "Designed for established practices seeking an independent view of performance. This assessment examines billing and revenue gaps, workflow efficiency, staffing structure, growth capacity, compliance exposure, and strategic direction." }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-2", children: "What you will receive" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-5", children: [
            "A scored summary across seven performance dimensions",
            "A priority list of the issues most affecting current performance",
            "An indication of where the clearest opportunities for improvement are"
          ].map(
            (item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: item })
            ] }, item)
          ) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/70 italic mb-6", children: "Ideal for: Practice owners in medical, dental, or veterinary practices seeking an objective operational and financial review." }),
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "default", asChild: true, className: "w-full mt-auto h-12 whitespace-normal text-center", children: /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment/intake?path=existing", children: "Start Your Performance Assessment →" }) })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.2 }, className: "bg-card rounded-2xl p-6 lg:p-8 shadow-card border-2 border-sky-400/30 flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-block text-xs font-semibold uppercase tracking-wider bg-sky-500/15 text-sky-600 dark:text-sky-400 px-3 py-1 rounded-full self-start mb-4", children: "New or Existing Practice" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Monitor, { className: "h-6 w-6 text-sky-600 dark:text-sky-400" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-bold text-foreground", children: "Healthcare IT Assessment" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-5", children: "Focused on IT infrastructure, cybersecurity, EMR systems, and technology operations for healthcare practices — whether you are establishing new systems or improving existing ones." }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2", children: "What you will receive" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 mb-5", children: [
            "An IT infrastructure and readiness review",
            "A cybersecurity posture assessment",
            "EMR and software optimization guidance"
          ].map(
            (item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: item })
            ] }, item)
          ) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/70 italic mb-6", children: "Ideal for: Practices needing IT infrastructure planning, cybersecurity review, or EMR advisory." }),
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "default", asChild: true, className: "w-full mt-auto h-12 whitespace-normal text-center", children: /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment/intake?path=healthcare-it", children: "Start Your Healthcare IT Assessment →" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(motion.p, { ...fadeUp, className: "text-center mt-8 text-sm text-muted-foreground", children: [
        "Not sure which applies?",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment/intake", className: "text-primary hover:text-foreground underline underline-offset-2 transition-colors", children: "Start the intake and we will guide you to the right path →" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      /* @__PURE__ */ jsx(motion.div, { ...fadeUp, className: "text-center mb-16", children: /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "What happens after you complete the assessment." }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4 sm:gap-0", children: [
        { icon: ClipboardList, label: "Complete the Assessment", text: "Answer 15 structured questions covering the seven dimensions. Takes approximately 15 minutes." },
        { icon: FileText, label: "Receive Your Practice Health Summary", text: "A summary of your responses mapped across the seven dimensions, with a note on where the assessment identified areas worth examining further." },
        { icon: MessageSquare, label: "Optional: Review With a Vitalis Consultant", text: "If you would like to discuss your results, you can book a complimentary 45-minute consultation with a Vitalis advisor. There is no obligation to engage further." }
      ].map(
        (item, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center flex-1", children: [
          /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: i * 0.1 }, className: "text-center px-4 max-w-[260px]", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsx(item.icon, { className: "h-7 w-7 text-primary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-bold text-foreground mb-2", children: item.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: item.text })
          ] }),
          i < 2 && /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 my-3 sm:my-0 sm:mx-2", children: [
            /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6 text-accent/50 hidden sm:block" }),
            /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6 text-accent/50 rotate-90 sm:hidden" })
          ] })
        ] }, item.label)
      ) }),
      /* @__PURE__ */ jsx(motion.p, { ...fadeUp, className: "text-center mt-12 text-xs text-muted-foreground/70 italic", children: "All responses are confidential. Vitalis does not share or publish any practice-level data." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-5xl", children: [
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-4", children: "Sample Practice Health Summary" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto", children: "Here's what a scored output looks like — a snapshot of where a practice stands across all seven dimensions." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "bg-card rounded-2xl p-8 shadow-soft border border-border/40 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-6", children: "Dimension Radar" }),
          /* @__PURE__ */ jsx(SampleRadarChart, {}),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/60 mt-4 italic", children: "Sample data — illustrative only" })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: 0.1 }, className: "bg-card rounded-2xl p-8 shadow-soft border border-border/40", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-6", children: "Dimension Scores" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: dimensions.map(
            (d) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(d.icon, { className: "h-4 w-4 text-accent flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground w-40 flex-shrink-0 truncate", children: d.name }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 h-2.5 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  className: "h-full rounded-full",
                  style: { background: d.score >= 70 ? "hsl(var(--primary))" : d.score >= 50 ? "hsl(var(--accent))" : "hsl(var(--destructive))" },
                  initial: { width: 0 },
                  whileInView: { width: `${d.score}%` },
                  viewport: { once: true },
                  transition: { duration: 0.8, delay: 0.2 }
                }
              ) }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-foreground w-10 text-right", children: [
                d.score,
                "%"
              ] })
            ] }, d.num)
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-5 border-t border-border/40 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Overall Score" }),
            /* @__PURE__ */ jsxs("span", { className: "text-2xl font-bold text-foreground", children: [
              Math.round(dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/60 mt-3 italic", children: "Sample data — illustrative only" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsx(motion.div, { ...fadeUp, className: "text-center mb-12", children: /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Built by practitioners. Used by practices across Canada." }) }),
      /* @__PURE__ */ jsx(motion.p, { ...fadeUp, className: "text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto mb-12", children: "The Vitalis Strategic Assessment is built on the same framework our team uses in full Strategic Analysis engagements — across medical clinics, dental practices, and veterinary facilities. It reflects what we have consistently found matters most when evaluating how a practice is performing and where the clearest opportunities for improvement tend to be." }),
      /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, className: "bg-card rounded-2xl p-8 lg:p-10 shadow-soft border border-border/40 max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsx(Quote, { className: "h-8 w-8 text-accent/40 mb-4" }),
        /* @__PURE__ */ jsx("blockquote", { className: "text-foreground text-lg italic leading-relaxed mb-4", children: '"Going through the assessment gave us a clearer picture of our billing process than three years of internal reviews had."' }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "— Practice owner, Calgary (name withheld)" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsx(motion.div, { ...fadeUp, className: "text-center mb-14", children: /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground", children: "Three steps. About 15 minutes." }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6", children: [
        { icon: ClipboardList, text: "Complete 15 questions" },
        { icon: FileText, text: "Receive your summary" },
        { icon: MessageSquare, text: "Optional consultation (complimentary)" }
      ].map(
        (item, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center", children: [
          /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, transition: { delay: i * 0.08 }, className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center", children: /* @__PURE__ */ jsx(item.icon, { className: "h-6 w-6 text-primary" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: item.text })
          ] }),
          i < 2 && /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 my-2 sm:my-0 sm:ml-6", children: [
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5 text-accent/40 hidden sm:block" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5 text-accent/40 rotate-90 sm:hidden" })
          ] })
        ] }, i)
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-gradient-section", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl text-center", children: /* @__PURE__ */ jsxs(motion.div, { ...fadeUp, children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl lg:text-4xl font-bold text-foreground mb-6", children: "The assessment is complimentary. Your results are confidential." }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg leading-relaxed mb-10", children: "If you have been wondering where your practice stands — on billing, operations, staffing, growth, or compliance — this is a practical starting point." }),
      /* @__PURE__ */ jsx(Button, { variant: "hero", size: "xl", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment/intake", children: [
        "Begin Your Assessment",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "mt-6", children: /* @__PURE__ */ jsx(Link, { to: "/contact", className: "text-sm text-primary hover:text-foreground underline underline-offset-2 transition-colors", children: "Prefer to speak with someone first? Schedule a call with our team →" }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  StrategicAssessment as default
};
