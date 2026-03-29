import { motion } from "framer-motion";

const stats = [
  { value: "$70M+", label: "Revenue Added Across Engagements", context: "Total measured increase above pre-engagement baseline" },
  { value: "31%", label: "Average Revenue Increase", context: "From pre-engagement baseline across active client portfolio" },
  { value: "34%", label: "Average EBITDA Improvement", context: "For practices completing a full operational engagement" },
  { value: "28%", label: "Average Overhead Reduction", context: "Across operational assessment engagements" },
  { value: "41%", label: "Reduction in Current & Long-Term Liabilities", context: "For practices completing a financial restructuring engagement" },
  { value: "$410K", label: "Average Annual Billing Recovered", context: "Per revenue cycle engagement, from existing patient volume" },
  { value: "100%", label: "Physicians & Practitioners Partnered", context: "Across practices and facilities built, optimized, or advised" },
  { value: "25+", label: "Facilities Built", context: "De novo clinic builds completed coast to coast" },
  { value: "15+", label: "New Facilities Opened", context: "On time and on budget, concept through opening day" },
  { value: "$680K", label: "Avg. Additional M&A Value Negotiated", context: "Above initial acquisition offer, per transaction engagement" },
];

export function ImpactStatsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <span className="h-px w-12 bg-accent" />
          <span className="text-accent font-semibold tracking-widest uppercase text-sm">
            Proven Results
          </span>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border border-border bg-secondary/50 p-6"
            >
              <span className="block w-8 h-0.5 bg-accent mb-4" />
              <p className="font-display text-3xl lg:text-4xl font-bold text-forest">{stat.value}</p>
              <p className="font-semibold text-foreground text-sm mt-2">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.context}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-3 max-w-3xl mx-auto text-xs italic text-muted-foreground text-center">
          Results reflect outcomes from individual client engagements or estimates derived from client-reported data across the Vitalis portfolio. Figures may represent a single engagement, an average across multiple engagements, or a combination of financial and operational outcomes. Past results are not a guarantee of future performance. Individual outcomes vary based on practice type, size, specialty, market conditions, and starting position at the time of engagement.
        </p>
      </div>
    </section>
  );
}
