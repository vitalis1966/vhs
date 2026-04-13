import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
const row1 = [
  { value: "$70M+", label: "Revenue Added Across Engagements", context: "Total measured increase above pre-engagement baseline" },
  { value: "31%", label: "Average Revenue Increase", context: "From pre-engagement baseline across active client portfolio" },
  { value: "34%", label: "Average EBITDA Improvement", context: "For practices completing a full operational engagement" },
  { value: "28%", label: "Average Overhead Reduction", context: "Across operational assessment engagements" }
];
const row2 = [
  { value: "41%", label: "Reduction in Current & Long-Term Liabilities", context: "For practices completing a financial restructuring engagement" },
  { value: "$410K", label: "Average Annual Billing Recovered", context: "Per revenue cycle engagement, from existing patient volume" },
  { value: "100+", label: "Physicians & Practitioners Partnered", context: "Across practices and facilities built, optimized, or advised" },
  { value: "25+", label: "New Facilities Built", context: "De novo clinic builds completed on time and on budget, concept through opening day" }
];
function ImpactStatsSection() {
  return /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-28 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
        className: "flex items-center justify-center gap-2 mb-12",
        children: [
          /* @__PURE__ */ jsx("span", { className: "h-px w-12 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-semibold tracking-widest uppercase text-sm", children: "Proven Results" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5 max-w-6xl mx-auto", children: row1.map((stat, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.4, delay: i * 0.05 },
        className: "rounded-xl border border-border bg-secondary/50 p-6",
        children: [
          /* @__PURE__ */ jsx("span", { className: "block w-8 h-0.5 bg-accent mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "font-display text-3xl lg:text-4xl font-bold text-forest", children: stat.value }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground text-sm mt-2", children: stat.label }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: stat.context })
        ]
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5 max-w-6xl mx-auto mt-5", children: row2.map((stat, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.4, delay: (i + 5) * 0.05 },
        className: "rounded-xl border border-border bg-secondary/50 p-6",
        children: [
          /* @__PURE__ */ jsx("span", { className: "block w-8 h-0.5 bg-accent mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "font-display text-3xl lg:text-4xl font-bold text-forest", children: stat.value }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground text-sm mt-2", children: stat.label }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: stat.context })
        ]
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-3xl mx-auto text-xs italic text-muted-foreground text-center", children: "Results reflect outcomes from individual client engagements or estimates derived from client-reported data across the Vitalis portfolio. Figures may represent a single engagement, an average across multiple engagements, or a combination of financial and operational outcomes. Past results are not a guarantee of future performance. Individual outcomes vary based on practice type, size, specialty, market conditions, and starting position at the time of engagement." })
  ] }) });
}
export {
  ImpactStatsSection
};
