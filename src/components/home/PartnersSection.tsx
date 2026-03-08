import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Briefcase, Scale, Laptop2, Stethoscope, HandshakeIcon } from "lucide-react";

const partners = [
  {
    icon: Building2,
    category: "Architecture & Design",
    name: "Healthcare Facility Design Partners",
    description: "Collaborating with leading architects and interior designers specializing in clinical environments, NHSF-compliant builds, and patient-centric spaces.",
  },
  {
    icon: Scale,
    category: "Legal & Compliance",
    name: "Healthcare Legal Advisors",
    description: "Working with specialized healthcare law firms for regulatory compliance, licensing, corporate structuring, and transaction support.",
  },
  {
    icon: Briefcase,
    category: "Financial & Transactional",
    name: "M&A and Valuation Partners",
    description: "Partnering with financial advisory firms for valuations, due diligence, financing, and deal structuring across healthcare transactions.",
  },
  {
    icon: Laptop2,
    category: "Technology & Digital",
    name: "Health IT & EHR Partners",
    description: "Integrating with leading EHR/EMR platforms and health technology providers for digital transformation and workflow modernization.",
  },
  {
    icon: Stethoscope,
    category: "Clinical & Recruitment",
    name: "Physician Recruitment Networks",
    description: "Connected to national and regional physician recruitment networks for strategic workforce planning and talent acquisition.",
  },
  {
    icon: HandshakeIcon,
    category: "Industry Associations",
    name: "Healthcare Industry Bodies",
    description: "Active members and collaborators with provincial and national healthcare associations, ensuring our clients benefit from the latest industry standards.",
  },
];

export function PartnersSection() {
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
            Our Ecosystem
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            Strategic partners,<br />better outcomes.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            We work with a curated network of industry-leading partners to deliver comprehensive solutions across every stage of the healthcare lifecycle.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <partner.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">{partner.category}</p>
              <h3 className="mt-2 font-display text-lg font-bold text-foreground">{partner.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{partner.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/partners"
            className="text-sm font-medium text-primary hover:text-forest-light transition-colors"
          >
            Learn about our partner ecosystem →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
