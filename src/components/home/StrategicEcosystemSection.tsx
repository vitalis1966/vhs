import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Scale,
  Briefcase,
  Building2,
  Laptop2,
  Home,
  Landmark,
  ArrowRight,
} from "lucide-react";

const ecosystemPartners = [
  { icon: Landmark, label: "Financial Institutions", angle: 0 },
  { icon: Scale, label: "Legal Advisors", angle: 60 },
  { icon: Building2, label: "Architecture & Design", angle: 120 },
  { icon: Home, label: "Real Estate Advisors", angle: 180 },
  { icon: Laptop2, label: "Healthcare Technology", angle: 240 },
  { icon: Briefcase, label: "Operational Consultants", angle: 300 },
];

export function StrategicEcosystemSection() {
  return (
    <section className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Strategic Ecosystem
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Healthcare ventures require many specialists.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-muted-foreground text-lg leading-relaxed">
            Practitioners launching or growing practices often need financing partners, architects, legal advisors, technology vendors, and operational consultants. Vitalis works alongside you to coordinate trusted partners — ensuring decisions are aligned and projects move forward efficiently.
          </p>
        </motion.div>

        {/* Hub-and-Spoke Ecosystem Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto mb-20"
        >
          {/* Desktop: Circular Hub-and-Spoke */}
          <div className="hidden lg:block relative h-[500px]">
            {/* Connecting lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 500 500"
              preserveAspectRatio="xMidYMid meet"
            >
              {ecosystemPartners.map((partner, i) => {
                const angleRad = (partner.angle - 90) * (Math.PI / 180);
                const x2 = 250 + Math.cos(angleRad) * 180;
                const y2 = 250 + Math.sin(angleRad) * 180;
                return (
                  <motion.line
                    key={i}
                    x1="250"
                    y1="250"
                    x2={x2}
                    y2={y2}
                    stroke="hsl(var(--accent))"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.4 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                );
              })}
            </svg>

            {/* Center Hub - Vitalis */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="w-36 h-36 rounded-full bg-gradient-forest flex flex-col items-center justify-center text-primary-foreground shadow-elevated">
                <span className="font-display text-xl font-bold">Vitalis</span>
                <span className="text-xs uppercase tracking-wider opacity-80 mt-1">Strategic Hub</span>
              </div>
            </motion.div>

            {/* Partner nodes */}
            {ecosystemPartners.map((partner, i) => {
              const angleRad = (partner.angle - 90) * (Math.PI / 180);
              const x = 50 + Math.cos(angleRad) * 36;
              const y = 50 + Math.sin(angleRad) * 36;
              return (
                <motion.div
                  key={partner.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  className="absolute z-10"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="bg-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-300 border border-border/40 text-center min-w-[140px]">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                      <partner.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground leading-tight block">
                      {partner.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile: Stacked layout with central hub */}
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-forest rounded-2xl p-8 text-primary-foreground text-center mb-8 shadow-elevated"
            >
              <span className="font-display text-2xl font-bold">Vitalis</span>
              <span className="block text-xs uppercase tracking-wider opacity-80 mt-1 mb-3">
                Strategic Hub
              </span>
              <p className="text-sm leading-relaxed opacity-85">
                Coordinating trusted partners for your healthcare venture
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {ecosystemPartners.map((partner, i) => (
                <motion.div
                  key={partner.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-xl p-4 shadow-soft border border-border/40 text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
                    <partner.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{partner.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Link to partners page */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Vitalis collaborates with trusted professionals across finance, architecture, legal, real estate, and technology.
          </p>
          <Link
            to="/partners"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground transition-colors"
          >
            Explore the strategic ecosystem
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
