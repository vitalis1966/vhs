import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  TrendingUp,
  Hospital,
  Landmark,
  ShieldCheck,
  BarChart3,
  Cog,
  DollarSign,
  UserCog,
  Monitor,
  Users,
  Handshake,
  Brain,
  Stethoscope,
} from "lucide-react";

const newClinicSolutions = [
  "Clinic development strategy and concept planning",
  "Facility planning and design coordination",
  "Operational design and workflow planning",
  "Technology planning and infrastructure strategy",
  "Launch strategy and early operations readiness",
];

const existingClinicSolutions = [
  "Workflow optimization and patient flow redesign",
  "Staff structure redesign and leadership alignment",
  "Revenue cycle performance and financial efficiency",
  "Technology modernization and EHR optimization",
  "Operational strategy for growth and sustainability",
];

const fullCapabilities = [
  { icon: Brain, label: "Strategic Analysis" },
  { icon: Cog, label: "Operations & Efficiency" },
  { icon: DollarSign, label: "Finance & Revenue Cycle" },
  { icon: UserCog, label: "Fractional Advisory" },
  { icon: Monitor, label: "Digital Transformation" },
  { icon: Building2, label: "Healthcare IT" },
  { icon: Users, label: "People Management" },
  { icon: Stethoscope, label: "Recruitment Strategy" },
  { icon: Handshake, label: "Mergers & Acquisitions" },
];

const specialties = [
  "Family medicine clinics",
  "Specialty practices",
  "Multidisciplinary clinics",
  "Diagnostic clinics",
  "Non-hospital surgical facilities",
];

const organizations = [
  {
    icon: Building2,
    title: "Private Clinics",
    description:
      "Independent physician practices, specialist groups, and multi-physician clinics requiring strategic planning, operational alignment, and growth support.",
  },
  {
    icon: Hospital,
    title: "Public Healthcare Organizations",
    description:
      "Healthcare organizations and delivery teams looking to improve system performance, strengthen operations, and design better patient-centered care pathways.",
  },
  {
    icon: Landmark,
    title: "Government & Health Authorities",
    description:
      "Health authorities and public sector stakeholders seeking practical strategic advisory for healthcare program development, transformation, and execution.",
  },
];

const Solutions = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent font-medium tracking-widest uppercase text-sm mb-6"
          >
            Solutions
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Strategic solutions for every stage of healthcare growth.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl"
          >
            Based in Calgary, Vitalis Health Strategies helps physicians and healthcare organizations across Canada make better strategic decisions — and execute them with clarity.
          </motion.p>
        </div>
      </section>

      {/* Two-track entry */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Solutions for New Clinics</p>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">Planning a clinic? Start here.</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              For physicians and healthcare entrepreneurs planning a new clinic, expansion, or new healthcare venture.
            </p>
            <ul className="space-y-2.5 mb-8">
              {newClinicSolutions.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="hero" size="default" asChild>
              <Link to="/clinic-audit">
                Planning a Clinic? Start Here
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Solutions for Existing Clinics</p>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">Improve your practice.</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We work with clinic leaders to redesign workflows, improve patient flow, strengthen staffing structures, and ensure technology systems support daily operations.
            </p>
            <ul className="space-y-2.5 mb-8">
              {existingClinicSolutions.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="hero-outline" size="default" asChild>
              <Link to="/clinic-audit">
                Improve Your Practice
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Full capabilities */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Full Scope of Capabilities</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Beyond the two primary tracks, Vitalis provides deep expertise across the full range of healthcare strategy consulting Canada organizations need.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {fullCapabilities.map((cap, i) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-xl p-5 shadow-soft border border-border/40 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <cap.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{cap.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Specialists We Work With</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Healthcare practices of all types
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Vitalis supports physicians and organizations across a range of practice types and clinical specialties throughout Calgary and across Canada.
              </p>
            </div>
            <div className="space-y-3">
              {specialties.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card rounded-xl px-6 py-4 shadow-soft border border-border/40 flex items-center gap-3"
                >
                  <BarChart3 className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{s}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Organizations */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Organizations We Work With</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Vitalis supports a range of healthcare organizations through practical, coordinated healthcare consulting Calgary and Canada-wide engagements.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {organizations.map((org, i) => (
              <motion.div
                key={org.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-5">
                  <org.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{org.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{org.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NHSF */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 lg:p-12 shadow-card border border-border/40"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Specialized Expertise</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Non-Hospital Surgical Facilities (NHSFs)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              NHSF development requires careful coordination across operational planning, regulatory considerations, facility design, and technology strategy. Vitalis supports physicians and organizations through this complexity with structured planning and cross-advisor alignment.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We help ensure that facility design supports workflow, technology systems match clinical operations, and operational plans are built for sustainable performance from launch onward.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
