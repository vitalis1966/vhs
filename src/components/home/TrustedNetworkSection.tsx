import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Briefcase, Scale, Laptop2, Stethoscope, HandshakeIcon } from "lucide-react";

const networkPartners = [
  {
    icon: Scale,
    category: "Legal & Compliance",
    name: "Healthcare Legal Partners",
    description: "Specialized healthcare law firms for regulatory compliance, licensing, corporate structuring, and transaction support.",
    examples: ["Field Law", "Bennett Jones", "McLennan Ross"],
  },
  {
    icon: Briefcase,
    category: "Financial Advisory",
    name: "Banking & Wealth Partners",
    description: "Financial institutions and wealth advisors who understand healthcare ventures and physician financial planning.",
    examples: ["ATB Financial", "RBC Private Banking", "TD Wealth"],
  },
  {
    icon: Building2,
    category: "Architecture & Design",
    name: "Healthcare Facility Design",
    description: "Architects and interior designers specializing in clinical environments and NHSF-compliant builds.",
    examples: ["Holland Design", "Number TEN Architectural Group", "GEC Architecture"],
  },
  {
    icon: Laptop2,
    category: "Healthcare Technology",
    name: "EHR & IT Partners",
    description: "Leading EHR/EMR platforms and health technology providers for digital transformation and workflow modernization.",
    examples: ["TELUS Health", "QHR Technologies", "Meditech"],
  },
];

export function TrustedNetworkSection() {
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
            Coordinated Advisory Network
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight">
            One partner. Complete ecosystem.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Building or growing a healthcare organization often requires coordination between financial advisors, legal counsel, architects, technology specialists, and operational consultants. Vitalis helps bring these pieces together by working with a trusted network of partners who understand healthcare ventures.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {networkPartners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                <partner.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">{partner.category}</p>
              <h3 className="mt-2 font-display text-lg font-bold text-foreground">{partner.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{partner.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {partner.examples.map((example) => (
                  <span key={example} className="text-xs bg-secondary/50 text-muted-foreground px-2 py-1 rounded-md">
                    {example}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto"
        >
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-8">
            Why the coordinated model works better
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">Time Savings</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Healthcare professionals already operate under significant time pressure. By working through a coordinated advisory structure, physicians can spend more time focused on patients and clinical leadership rather than project management.
                </p>
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">Better Decision Alignment</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vitalis helps align decisions across finance, operations, facility design, staffing models, and technology systems to ensure early decisions don't create operational problems later.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">Reduced Communication Breakdowns</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When multiple professionals operate independently, miscommunication can occur between design decisions and operational workflows, technology systems and clinic processes, financial assumptions and operational realities.
                </p>
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">Improved Return on Investment</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Strategic coordination helps ensure that facility design supports operational efficiency, technology investments support workflows, and staffing structures support sustainable growth.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/partners"
              className="text-sm font-medium text-primary hover:text-forest-light transition-colors"
            >
              Learn more about our partner ecosystem →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}