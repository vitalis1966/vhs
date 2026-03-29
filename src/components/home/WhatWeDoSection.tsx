import { motion } from "framer-motion";
import { Building2, Activity, TrendingUp, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const pillars = [
  {
    Icon: Building2,
    title: "New Practice Builds",
    description: "You have a vision for a clinic, dental office, or surgical centre. We take it from concept through site selection, regulatory approvals, accreditation, and opening day — on time and on budget.",
    linkText: "Explore new builds",
    to: "/solutions/new-clinics",
  },
  {
    Icon: Activity,
    title: "Existing Practice Optimization",
    description: "You're running a practice but leaving money on the table — in billing, overhead, workflow, or staffing. We find exactly where, and fix it.",
    linkText: "Explore existing practice solutions",
    to: "/solutions/existing-clinics",
  },
  {
    Icon: TrendingUp,
    title: "Growth & Expansion",
    description: "You've proven the model and you're ready to scale. New locations, new services, new practitioners — we build the infrastructure that makes expansion sustainable and protects what you've already built.",
    linkText: "See how we work",
    to: "/how-we-work",
  },
  {
    Icon: RefreshCw,
    title: "Practice Restructuring",
    description: "Revenue is down, costs are climbing, or something is broken and you can't see what. We come in, assess honestly, and rebuild the financial and operational foundation from the ground up.",
    linkText: "See how we work",
    to: "/how-we-work",
  },
];

export function WhatWeDoSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">
              What We Do
            </span>
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Full-cycle strategy for every stage of your practice.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From your first facility to your eventual exit — we're the only team you need.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={pillar.to}
                className="block rounded-xl border border-border bg-card p-6 h-full transition-colors duration-200 hover:border-primary/50 group text-left"
              >
                <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <pillar.Icon className="w-5 h-5 text-secondary-foreground" />
                </div>
                <p className="font-semibold text-foreground">{pillar.title}</p>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {pillar.description}
                </p>
                <p className="text-sm text-primary font-medium mt-3 group-hover:underline">
                  {pillar.linkText} →
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
