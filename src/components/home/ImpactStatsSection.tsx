import { motion } from "framer-motion";

const stats = [
  { value: "200+", label: "Practices Supported", context: "Medical, dental & veterinary across Canada" },
  { value: "$2.4M", label: "Avg. Revenue Recovered", context: "Per operational assessment engagement" },
  { value: "15+", label: "New Facilities Opened", context: "Guided from concept to first patient" },
  { value: "31%", label: "Avg. Revenue Increase", context: "Reported by practices post-engagement" },
  { value: "1,200+", label: "Physicians & Practitioners", context: "Working inside practices we've supported" },
  { value: "8", label: "Specialties Served", context: "Med · Dent · Vet · Surgical & more" },
];

export function ImpactStatsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-10"
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
              className="rounded-xl border border-border bg-card p-7"
            >
              <p className="font-display text-4xl font-bold text-forest">{stat.value}</p>
              <p className="font-semibold text-foreground mt-2">{stat.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.context}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
