import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Handshake, ArrowRight } from "lucide-react";

const solutionTracks = [
  {
    icon: Building2,
    label: "New Practice Track",
    title: "Solutions for New Practices",
    description:
      "For practitioners and healthcare entrepreneurs planning a new medical clinic, dental office, or veterinary facility, with support across development strategy, facility planning, operations design, and launch readiness.",
    bullets: [
      "Practice development strategy",
      "Facility planning and design coordination",
      "Operational design and staffing models",
      "Technology planning and launch support",
    ],
    cta: "Planning a Practice? Start Here",
    href: "/solutions/new-clinics",
  },
  {
    icon: TrendingUp,
    label: "Existing Practice Track",
    title: "Solutions for Existing Practices",
    description:
      "For established practices seeking an objective view of performance through workflow analysis, staffing review, revenue assessment, and technology evaluation.",
    bullets: [
      "Workflow and patient flow analysis",
      "Staff structure review",
      "Revenue and billing assessment",
      "Technology review",
    ],
    cta: "Learn About Our Assessment",
    href: "/strategic-assessment/intake",
  },
  {
    icon: Handshake,
    label: "Strategic Advisory",
    title: "Long-Term Partnership Support",
    description:
      "For organizations looking for ongoing strategic advisory across growth planning, recruitment strategy, restructuring, and complex healthcare project coordination.",
    bullets: [
      "Practice expansion strategy",
      "Recruitment and succession planning",
      "Financial and operational restructuring",
      "Ongoing advisory support",
    ],
    cta: "Speak with Vitalis",
    href: "/contact",
  },
];

export function SolutionsPreview() {
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
            Strategic Solution Pathways
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Clear entry points based on your priorities
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Whether you are planning a practice, looking for an objective view of an existing one, or seeking long-term strategic advisory, Vitalis provides structured solutions aligned to your stage.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {solutionTracks.map((track, i) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card rounded-2xl p-7 shadow-soft hover:shadow-card transition-all duration-300 border border-border/40 flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <track.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">{track.label}</p>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">{track.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{track.description}</p>
              <ul className="space-y-2 mb-7 flex-1">
                {track.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero-outline" size="default" asChild className="w-full">
                <Link to={track.href}>
                  {track.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
