import { motion } from "framer-motion";

const stages = [
  { label: "Vision & Concept", description: "Exploring the opportunity" },
  { label: "Strategy & Planning", description: "Operational & clinical strategy" },
  { label: "Design & Build", description: "Facility & workflows" },
  { label: "Launch", description: "Early operations readiness" },
  { label: "Optimize & Improve", description: "Patient flow & efficiency" },
  { label: "Grow & Expand", description: "Adding services & locations" },
  { label: "Transition & Exit", description: "M&A & succession" },
];

export function LifecycleSection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-section">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">The Full Cycle</p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Every stage. One partner.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Most consultants see only a slice. We see the entire journey — and that perspective creates dramatically better outcomes at every stage.
          </p>
        </motion.div>

        {/* Lifecycle visual */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 lg:gap-4">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-lg font-bold shadow-soft group-hover:shadow-elevated transition-shadow duration-300 relative z-10">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-display text-sm font-semibold text-foreground">{stage.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{stage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
