import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Briefcase, Scale, Laptop2, Stethoscope, HandshakeIcon, Landmark, ShieldCheck } from "lucide-react";

const partnerCategories = [
  {
    icon: Building2,
    category: "Architecture & Facility Design",
    description: "We collaborate with leading healthcare architects and interior designers who specialize in clinical environments, Non-Hospital Surgical Facility (NHSF) compliant builds, and patient-centric spaces that drive operational efficiency from day one.",
    examples: ["Healthcare facility architects", "Clinical interior designers", "Medical equipment planners", "Construction management firms"],
  },
  {
    icon: Scale,
    category: "Legal & Regulatory Compliance",
    description: "Our legal partners specialize in healthcare law — licensing, corporate structuring, regulatory compliance, and transaction support — ensuring every engagement is built on a solid legal foundation.",
    examples: ["Healthcare law firms", "Regulatory consultants", "Privacy & compliance advisors", "Corporate structuring specialists"],
  },
  {
    icon: Briefcase,
    category: "Financial & Transactional Advisory",
    description: "We partner with financial advisory firms for valuations, due diligence, financing structures, and deal support across healthcare mergers, acquisitions, and exits.",
    examples: ["Healthcare valuation experts", "M&A financial advisors", "Healthcare lenders", "Tax & accounting firms"],
  },
  {
    icon: Laptop2,
    category: "Technology & Digital Health",
    description: "Integrating with leading EHR/EMR platforms and health technology providers for digital transformation, workflow modernization, and clinical data analytics.",
    examples: ["EHR/EMR platforms", "Practice management systems", "Health analytics providers", "Telehealth platforms"],
  },
  {
    icon: Stethoscope,
    category: "Physician Recruitment & Workforce",
    description: "Connected to national and regional physician recruitment networks and workforce planning specialists to ensure our clients attract and retain the right clinical talent.",
    examples: ["National recruitment networks", "Locum agencies", "Credentialing services", "HR consulting firms"],
  },
  {
    icon: ShieldCheck,
    category: "Quality & Accreditation",
    description: "Working with accreditation bodies and quality consultants to help clinics achieve and maintain the highest standards of clinical excellence and patient safety.",
    examples: ["Accreditation consultants", "Quality improvement specialists", "Patient safety advisors", "Clinical audit experts"],
  },
  {
    icon: Landmark,
    category: "Government & Grants",
    description: "Navigating government programs, grants, and funding opportunities that support healthcare infrastructure development and operational improvement.",
    examples: ["Government grant advisors", "Public health consultants", "Policy specialists", "Funding navigators"],
  },
  {
    icon: HandshakeIcon,
    category: "Industry Associations",
    description: "Active members and collaborators with provincial and national healthcare associations, keeping our clients at the forefront of industry standards and best practices.",
    examples: ["Provincial medical associations", "National healthcare bodies", "Surgical associations", "Business healthcare groups"],
  },
];

const Partners = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
            Our Ecosystem
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Strategic partners for<br />complete solutions.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Vitalis works with a curated network of industry-leading professionals across architecture, law, finance, technology, recruitment, and more — so our clients receive comprehensive, connected support at every stage.
          </motion.p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {partnerCategories.map((p, i) => (
              <motion.div
                key={p.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{p.category}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">{p.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.examples.map((ex) => (
                    <span key={ex} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{ex}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Interested in partnering with Vitalis?</h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">We're always looking to expand our ecosystem with firms that share our commitment to healthcare excellence.</p>
            <div className="mt-8">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Partner With Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
