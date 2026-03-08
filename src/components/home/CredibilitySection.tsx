import { motion } from "framer-motion";
import { Shield, Target, Users, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Full-Cycle Expertise",
    description: "We don't just advise on a slice — we understand how every decision at one stage impacts every other. This integrated perspective produces dramatically better outcomes.",
  },
  {
    icon: Target,
    title: "Actionable, Not Theoretical",
    description: "We deliver clear roadmaps and implementation support, not generic reports that gather dust. Every engagement ends with tangible outcomes.",
  },
  {
    icon: Users,
    title: "Partnership, Not Transactions",
    description: "We build long-term relationships. Many clients work with us across multiple stages — from their first clinic build through to eventual transition or sale.",
  },
  {
    icon: TrendingUp,
    title: "Deep Healthcare Focus",
    description: "We don't consult across 20 industries. We focus exclusively on healthcare — clinics, surgical centers, physician groups, and healthcare businesses.",
  },
];

export function CredibilitySection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Why Vitalis
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Not just a consultant.<br />
            <span className="text-gradient-primary">A strategic partner.</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Healthcare organizations face fragmented advice from disconnected specialists. We bridge that gap with integrated, full-lifecycle expertise.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-5 p-6 rounded-2xl hover:bg-card hover:shadow-soft transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <reason.icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">{reason.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
