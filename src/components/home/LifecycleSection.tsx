import { motion } from "framer-motion";

const stages = [
  {
    label: "Vision & Concept",
    description: "Exploring the opportunity for a new practice or healthcare venture.",
    isOngoing: false,
  },
  {
    label: "Strategy & Planning",
    description: "Defining the operational, financial, and clinical strategy.",
    isOngoing: false,
  },
  {
    label: "Design & Build",
    description: "Planning facility layout, workflows, and technology infrastructure.",
    isOngoing: false,
  },
  {
    label: "Launch & Early Operations",
    description: "Supporting operational readiness and early performance.",
    isOngoing: false,
  },
  {
    label: "Optimize & Improve",
    description: "Improving patient flow, staffing structure, and operational systems.",
    isOngoing: false,
  },
  {
    label: "Grow & Expand",
    description: "Adding services, practitioners, or new locations.",
    isOngoing: false,
  },
  {
    label: "Strategic Advisory & Ongoing Improvement",
    description: "Retained advisory partnership for sustained excellence and long-term strategic growth.",
    isOngoing: true,
  },
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
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
            The Full Cycle
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Every stage. One partner.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Most consultants see only a slice. We understand the entire journey — and that perspective creates better decisions at every stage. Many organizations retain Vitalis as a long-term strategic advisor well beyond the initial engagement.
          </p>
        </motion.div>

        {/* Lifecycle visual */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-7 left-[3.5rem] right-[3.5rem] h-px bg-border z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 lg:gap-4">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-display text-lg font-bold shadow-soft group-hover:shadow-elevated transition-all duration-300 relative z-10 ${
                    stage.isOngoing
                      ? "bg-gradient-forest text-primary-foreground ring-2 ring-accent/40 ring-offset-2 ring-offset-background"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {stage.isOngoing ? "∞" : i + 1}
                </div>
                <h3
                  className="mt-4 font-display text-sm font-semibold text-foreground"
                >
                  {stage.label}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {stage.description}
                </p>
                {stage.isOngoing && (
                  <span className="mt-2 text-xs font-semibold text-accent uppercase tracking-wider">
                    Ongoing
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ongoing advisory note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 max-w-2xl mx-auto text-center"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Many Vitalis clients maintain an ongoing advisory relationship beyond project completion — retaining strategic guidance as their organization grows, evolves, and navigates new challenges.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
