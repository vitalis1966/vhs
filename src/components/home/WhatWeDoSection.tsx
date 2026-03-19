import { motion } from "framer-motion";
import { Building2, BarChart3, TrendingUp, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const pillars = [
  {
    Icon: Building2,
    title: "New Practice Builds",
    description: "Site selection, regulatory planning, facility design, and pre-opening operations",
  },
  {
    Icon: BarChart3,
    title: "Operational Excellence",
    description: "Revenue cycle, workflow, staffing, and performance assessment for established practices",
  },
  {
    Icon: TrendingUp,
    title: "Revenue & Growth",
    description: "Billing optimization, fee analysis, and growth strategy to increase practice profitability",
  },
  {
    Icon: Handshake,
    title: "M&A Advisory",
    description: "Valuations, deal structuring, and succession planning for practice transitions",
  },
];

export function WhatWeDoSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">
              What We Do
            </span>
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Full-cycle strategy for every stage of your practice.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
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
                to="/solutions"
                className="block rounded-xl border border-border bg-card p-6 h-full transition-colors duration-200 hover:border-primary/50 group"
              >
                <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <pillar.Icon className="w-5 h-5 text-secondary-foreground" />
                </div>
                <p className="font-semibold text-foreground">{pillar.title}</p>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {pillar.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
