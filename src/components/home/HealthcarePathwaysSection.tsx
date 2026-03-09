import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, TrendingUp, Handshake, ArrowRight } from "lucide-react";

const pathways = [
  {
    icon: Building,
    number: "01",
    eyebrow: "New Clinic Development",
    title: "Building a New Clinic",
    description:
      "Planning a new clinic involves dozens of interconnected decisions — from facility design and staffing models to technology infrastructure and regulatory requirements. We help physicians and healthcare entrepreneurs evaluate these factors before major commitments are made.",
    services: [
      "Clinic development and feasibility strategy",
      "Facility planning and design coordination",
      "Technology and infrastructure planning",
      "Staffing models and workforce strategy",
      "Launch readiness and operational setup",
    ],
    cta: "Plan Your Clinic",
    href: "/clinic-audit",
  },
  {
    icon: TrendingUp,
    number: "02",
    eyebrow: "Practice Performance",
    title: "Improving an Existing Practice",
    description:
      "Our practice performance assessment helps clinic leaders evaluate operational systems, patient flow, staffing structure, technology usage, and financial performance — and identify specific opportunities for improvement.",
    services: [
      "Workflow and operational redesign",
      "Revenue cycle performance improvement",
      "Staff structure and culture development",
      "Technology and EHR modernization",
      "Patient experience optimization",
    ],
    cta: "Assess Your Practice",
    href: "/clinic-audit",
  },
  {
    icon: Handshake,
    number: "03",
    eyebrow: "Long-Term Partnership",
    title: "Strategic Advisory & Growth",
    description:
      "Some organizations benefit from an ongoing advisory relationship. Vitalis provides long-term strategic guidance to help healthcare organizations navigate growth, expansion, recruitment, and complex transitions — as a consistent partner throughout the journey.",
    services: [
      "Practice expansion and multi-location strategy",
      "Physician recruitment and succession planning",
      "Financial restructuring and long-term planning",
      "Mergers, acquisitions, and partnership strategy",
      "Ongoing strategic advisory support",
    ],
    cta: "Speak with Vitalis",
    href: "/contact",
  },
];

export function HealthcarePathwaysSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Your Healthcare Journey
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Where are you in your journey?
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Vitalis Health Strategies works with physicians and healthcare organizations at every stage — from planning a first clinic to navigating growth, expansion, and long-term transition across Calgary and Alberta.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl">
          {pathways.map((pathway, i) => (
            <motion.div
              key={pathway.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col group border border-border/40"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <pathway.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <span className="font-display text-5xl font-bold text-muted-foreground/15 select-none">
                  {pathway.number}
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                {pathway.eyebrow}
              </p>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                {pathway.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {pathway.description}
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {pathway.services.map((service) => (
                  <li
                    key={service}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="hero-outline"
                size="default"
                asChild
                className="w-full mt-auto"
              >
                <Link to={pathway.href}>
                  {pathway.cta}
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
