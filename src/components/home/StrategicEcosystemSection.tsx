import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  Settings,
  Laptop,
  Handshake,
  ArrowRight,
} from "lucide-react";

const ecosystemNodes = [
  { icon: Building2, label: "Facility Development", angle: 0 },
  { icon: TrendingUp, label: "Growth Strategy", angle: 51.4 },
  { icon: DollarSign, label: "Billing & Revenue", angle: 102.8 },
  { icon: Users, label: "People & Recruitment", angle: 154.3 },
  { icon: Settings, label: "Operations & Workflow", angle: 205.7 },
  { icon: Laptop, label: "Digital & Technology", angle: 257.1 },
  { icon: Handshake, label: "Transitions & Advisory", angle: 308.6 },
];

export function StrategicEcosystemSection() {
  return (
    <section className="py-16 lg:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-6"
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
          className="text-center max-w-2xl mx-auto mb-4"
        >
          <p className="text-muted-foreground text-lg leading-relaxed">
            Practitioners launching or growing practices often need financing partners, architects, legal advisors, technology vendors, and operational consultants. Vitalis works alongside you to coordinate trusted partners — ensuring decisions are aligned and projects move forward efficiently.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-muted-foreground text-base italic">
            Every component of your practice is connected. Our approach treats them that way.
          </p>
        </motion.div>

        {/* Hub-and-Spoke Ecosystem Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto mb-16"
        >
          {/* Desktop: Circular Hub-and-Spoke */}
          <div className="hidden lg:block relative h-[550px]">
            {/* Connecting lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 500 500"
              preserveAspectRatio="xMidYMid meet"
            >
              {ecosystemNodes.map((node, i) => {
                const angleRad = (node.angle - 90) * (Math.PI / 180);
                const x2 = 250 + Math.cos(angleRad) * 190;
                const y2 = 250 + Math.sin(angleRad) * 190;
                return (
                  <motion.line
                    key={i}
                    x1="250"
                    y1="250"
                    x2={x2}
                    y2={y2}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.6 }}
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
              <div className="w-40 h-40 rounded-full bg-primary flex flex-col items-center justify-center text-primary-foreground shadow-elevated">
                <span className="font-display text-lg font-bold leading-tight text-center px-2">Vitalis Health Strategies</span>
                <span className="text-xs uppercase tracking-wider opacity-80 mt-1">Strategic Hub</span>
              </div>
            </motion.div>

            {/* Surrounding nodes */}
            {ecosystemNodes.map((node, i) => {
              const angleRad = (node.angle - 90) * (Math.PI / 180);
              const x = 50 + Math.cos(angleRad) * 38;
              const y = 50 + Math.sin(angleRad) * 38;
              return (
                <motion.div
                  key={node.label}
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
                  <div className="bg-card rounded-xl p-4 shadow-card hover:shadow-elevated transition-all duration-300 border border-primary/30 text-center min-w-[160px]">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
                      <node.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground leading-tight block">
                      {node.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile: Vertical stacked list with connecting line */}
          <div className="lg:hidden">
            {/* Hub badge at top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center mb-8"
            >
              <div className="bg-primary rounded-full px-6 py-3 text-primary-foreground shadow-elevated">
                <span className="font-display text-base font-bold">Vitalis Health Strategies</span>
                <span className="block text-xs uppercase tracking-wider opacity-80 text-center mt-0.5">
                  Strategic Hub
                </span>
              </div>
            </motion.div>

            {/* Stacked cards with left connecting line */}
            <div className="relative pl-8">
              {/* Vertical connecting line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-primary/40" />

              <div className="space-y-4">
                {ecosystemNodes.map((node, i) => (
                  <motion.div
                    key={node.label}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="relative"
                  >
                    {/* Dot on the line */}
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10" style={{ left: '-1.45rem' }} />
                    {/* Horizontal connector */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary/40" style={{ left: '-0.75rem' }} />

                    <div className="bg-card rounded-xl p-4 shadow-soft border border-primary/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <node.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{node.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
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
