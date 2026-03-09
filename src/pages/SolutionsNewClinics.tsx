import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Lightbulb,
  Target,
  DollarSign,
  Building2,
  Monitor,
  Cog,
  Users,
  Rocket,
  ShieldCheck,
  Landmark,
  Scale,
  Home,
  Laptop2,
} from "lucide-react";

const developmentStages = [
  {
    icon: Lightbulb,
    title: "Vision & Concept Development",
    description: "Clarify your vision for the clinic. Define the patient population, service lines, competitive positioning, and long-term goals. Assess market opportunity and feasibility.",
  },
  {
    icon: Target,
    title: "Strategic Planning",
    description: "Develop a comprehensive business plan including service mix, operational model, staffing structure, financial projections, and growth roadmap.",
  },
  {
    icon: DollarSign,
    title: "Financial Structuring",
    description: "Model capital requirements, operating costs, and revenue projections. Work with financial partners to secure appropriate financing and establish sustainable economics.",
  },
  {
    icon: Building2,
    title: "Facility Design & Architecture",
    description: "Coordinate with architects and designers to ensure facility layout supports clinical workflows, patient experience, regulatory requirements, and long-term operational needs.",
  },
  {
    icon: Monitor,
    title: "Technology Infrastructure",
    description: "Plan technology systems including EHR selection, practice management software, diagnostic equipment integration, and IT infrastructure.",
  },
  {
    icon: Cog,
    title: "Operational Design",
    description: "Design workflows, policies, procedures, and operational systems. Create patient flow models, scheduling frameworks, and quality assurance processes.",
  },
  {
    icon: Users,
    title: "Staffing Models",
    description: "Define staffing requirements, organizational structure, compensation models, and recruitment strategies. Plan for leadership development and team culture.",
  },
  {
    icon: Rocket,
    title: "Launch Preparation",
    description: "Prepare for operational readiness including staff training, system testing, marketing launch, and early operations support to ensure successful opening.",
  },
];

const partners = [
  { icon: Landmark, label: "Financial Institutions", description: "Capital planning, clinic financing, and financial structuring" },
  { icon: Building2, label: "Architects & Designers", description: "Healthcare facility planning and design coordination" },
  { icon: Scale, label: "Legal Advisors", description: "Business structure, contracts, and regulatory compliance" },
  { icon: Home, label: "Real Estate Advisors", description: "Site selection, lease negotiation, and property acquisition" },
  { icon: Laptop2, label: "Technology Providers", description: "EHR systems, practice management, and IT infrastructure" },
];

const SolutionsNewClinics = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent font-medium tracking-widest uppercase text-sm mb-6"
          >
            Solutions for New Clinics
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Planning a new clinic? Start here.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl"
          >
            Vitalis guides physicians and healthcare entrepreneurs through every stage of clinic development — from initial concept through successful launch and early operations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/clinic-audit">
                Strategic Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Book a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Development Stages */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">The Development Journey</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              From concept to opening day.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Clinic development involves many interconnected decisions. Vitalis helps coordinate these elements to ensure your clinic is positioned for success from day one.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {developmentStages.map((stage, i) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <stage.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{stage.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{stage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Partners */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Coordinated Advisory</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Working with trusted partners.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Clinic development requires expertise across many domains. Vitalis works alongside you to coordinate strategic partners who specialize in critical areas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-xl p-5 shadow-soft border border-border/40 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                  <partner.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-display text-sm font-bold text-foreground mb-1">{partner.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{partner.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
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

      {/* NHSF Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 lg:p-12 shadow-card border border-border/40"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-14 h-14 rounded-xl bg-gradient-forest flex items-center justify-center mb-6">
                  <ShieldCheck className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Specialized Expertise</p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Non-Hospital Surgical Facilities
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NHSF development requires specialized planning that differs from traditional clinic development. These facilities face unique regulatory, operational, and design requirements.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-1">Regulatory Considerations</h4>
                  <p className="text-sm text-muted-foreground">Navigating licensing, accreditation, and compliance requirements specific to surgical facilities.</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-1">Facility Design Coordination</h4>
                  <p className="text-sm text-muted-foreground">Ensuring facility layout meets surgical standards while supporting efficient workflows.</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-1">Technology Planning</h4>
                  <p className="text-sm text-muted-foreground">Integrating surgical equipment, monitoring systems, and clinical technology infrastructure.</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-1">Operational Systems</h4>
                  <p className="text-sm text-muted-foreground">Designing workflows for patient preparation, surgical procedures, and post-operative care.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to plan your clinic?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Start with a strategic assessment to understand your opportunity, identify key considerations, and outline the path forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/clinic-audit">
                  Strategic Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Book a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SolutionsNewClinics;
