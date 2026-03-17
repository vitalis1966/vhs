import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, TrendingUp, Handshake, ArrowRight } from "lucide-react";

const pathways = [
  {
    id: "journey-building",
    icon: Building,
    number: "01",
    eyebrow: "Planning & Building",
    title: "Planning & Building",
    description:
      "You are preparing to open a new medical clinic, dental office, or veterinary facility. You want experienced guidance on the operational, regulatory, and financial decisions that come before opening day — so you are set up for a strong start, not an expensive learning curve.",
    services: [
      "Practice feasibility analysis and financial planning",
      "Regulatory and compliance navigation for your practice type",
      "Facility design input and equipment procurement guidance",
      "Recruitment support and staffing structure planning",
      "Operational setup and pre-opening staff preparation",
    ],
    cta: "See How We Support New Builds →",
    href: "/solutions/new-clinics",
  },
  {
    id: "journey-operating",
    icon: TrendingUp,
    number: "02",
    eyebrow: "Operating & Growing",
    title: "Operating & Growing",
    description:
      "You have an established practice and want an objective view of how it is performing. Whether it is a billing gap, an operational bottleneck, or a growth opportunity you have not been able to act on yet — a structured assessment can help you see where to focus.",
    services: [
      "Billing and fee collection review",
      "Workflow and scheduling analysis",
      "Staffing structure and cost review",
      "Growth planning: new service lines, additional practitioners, additional locations",
      "Practice management technology and digital tools review",
    ],
    cta: "Start Performance Assessment →",
    href: "/strategic-assessment",
  },
  {
    id: "journey-transitioning",
    icon: Handshake,
    number: "03",
    eyebrow: "Scaling or Transitioning",
    title: "Scaling or Transitioning",
    description:
      "You are thinking about adding a location, restructuring a partnership, bringing in new leadership, or navigating a significant operational change. You want a consulting team that understands how these decisions play out inside a real practice.",
    services: [
      "Practice expansion and multi-location strategy",
      "Practitioner recruitment and succession planning",
      "Financial restructuring and long-term planning",
      "Mergers, acquisitions, and partnership strategy",
      "Ongoing strategic advisory support",
    ],
    cta: "Connect With an Advisor →",
    href: "/contact",
  },
];

export function HealthcarePathwaysSection() {
  return (
    <section id="journey-section" className="py-24 lg:py-32 bg-background">
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
            Where is your practice right now?
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Based in Calgary, Vitalis Health Strategies works with practitioners and healthcare organizations across Canada at every stage — from planning a first practice to navigating growth, expansion, and long-term advisory.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl">
          {pathways.map((pathway, i) => (
            <motion.div
              key={pathway.title}
              id={pathway.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col group border border-border/40 border-l-4 border-l-primary"
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
                  <li key={service} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>

              <Button variant="hero" size="lg" asChild className="w-full mt-auto whitespace-normal text-center h-auto py-3">
                <Link to={pathway.href}>
                  {pathway.cta}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
