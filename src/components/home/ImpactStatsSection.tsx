import { motion } from "framer-motion";

const stats = [
  { value: "100+", label: "Practices Supported", context: "Medical, dental & veterinary across Canada" },
  { value: "$310K", label: "Billing Revenue Recovered", context: "Per revenue cycle engagement" },
  { value: "31%", label: "Overhead Reduction", context: "Delivered through operational assessments" },
  { value: "15+", label: "New Facilities Opened", context: "Specialty clinics & surgical centres, concept to keys" },
  { value: "−60%", label: "Physician Admin Time Reduced", context: "Through workflow & people restructuring" },
  { value: "$680K", label: "Additional M&A Value", context: "Negotiated above initial acquisition offers" },
];

export function ImpactStatsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-lg border border-border bg-secondary/50 p-7"
            >
              <span className="block w-8 h-0.5 bg-accent mb-4" />
              <p className="font-display text-4xl lg:text-5xl font-bold text-forest">{stat.value}</p>
              <p className="font-semibold text-foreground text-base lg:text-lg mt-2">{stat.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.context}</p>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
