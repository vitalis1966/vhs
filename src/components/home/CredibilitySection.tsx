import { motion } from "framer-motion";
import { Shield, Target, Users, TrendingUp } from "lucide-react";

const allReasons = [
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
    description: "We build long-term relationships. Many clients work with us across multiple stages — from their first practice build through to eventual transition.",
  },
  {
    icon: TrendingUp,
    title: "Deep Healthcare Focus",
    description: "We don't consult across 20 industries. We focus exclusively on healthcare — medical, dental, and veterinary practices, surgical centers, and healthcare organizations.",
  },
];

interface CredibilitySectionProps {
  variant?: "homepage" | "full";
}

export function CredibilitySection({ variant = "full" }: CredibilitySectionProps) {
  const reasons = variant === "homepage" ? allReasons.slice(0, 2) : allReasons;

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
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">
              Why Vitalis
            </span>
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Not just a consultant.<br />
            <span className="text-gradient-primary">A strategic partner.</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Vitalis was founded by clinicians and healthcare executives who have built, run, and grown private practices — not just advised them. Our team includes experience across medical, dental, and veterinary operations. We understand the day-to-day realities of running a practice because we have lived them.
          </p>
        </motion.div>

        <div className={`grid ${variant === "homepage" ? "md:grid-cols-2 max-w-3xl" : "md:grid-cols-2 max-w-5xl"} gap-8 mx-auto`}>
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
