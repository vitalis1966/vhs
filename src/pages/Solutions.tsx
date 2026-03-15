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
  BarChart3,
  Cog,
  DollarSign,
  UserCog,
  Monitor,
  Users,
  Handshake,
  Brain,
  Stethoscope,
  Target,
} from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "Strategic Consulting",
    description: "Business strategy, market positioning, growth planning, and long-term strategic roadmaps.",
  },
  {
    icon: Cog,
    title: "Operations & Workflow",
    description: "Workflow optimization, patient flow redesign, process improvement, and operational efficiency.",
  },
  {
    icon: DollarSign,
    title: "Financial & Revenue Cycle",
    description: "Revenue cycle performance, financial modeling, cost optimization, and profitability improvement.",
  },
  {
    icon: Building2,
    title: "Practice Development",
    description: "New practice planning, facility design coordination, launch strategy, and development oversight.",
  },
  {
    icon: Monitor,
    title: "Technology & Digital",
    description: "EMR optimization, technology planning, digital transformation, and systems integration.",
  },
  {
    icon: Users,
    title: "People Management",
    description: "Staff structure design, leadership development, team alignment, and organizational culture.",
  },
  {
    icon: Stethoscope,
    title: "Practitioner Recruitment",
    description: "Recruitment strategy, practitioner onboarding, partnership structures, and succession planning.",
  },
  {
    icon: Handshake,
    title: "Mergers & Acquisitions",
    description: "Practice valuation, acquisition strategy, integration planning, and transaction advisory.",
  },
];

const practiceTypes = [
  "Family medicine practices",
  "Specialty practices",
  "Multidisciplinary practices",
  "Dental practices",
  "Veterinary practices",
  "Non-hospital surgical facilities",
];

const organizations = [
  {
    icon: Building2,
    title: "Private Practices",
    description: "Independent practitioner practices, specialist groups, and multi-provider practices requiring strategic planning, operational alignment, and growth support.",
  },
  {
    icon: Hospital,
    title: "Public Healthcare Organizations",
    description: "Healthcare organizations and delivery teams looking to improve system performance, strengthen operations, and design better patient-centered care pathways.",
  },
  {
    icon: Landmark,
    title: "Government & Health Authorities",
    description: "Health authorities and public sector stakeholders seeking practical strategic advisory for healthcare program development, transformation, and execution.",
  },
];

const Solutions = () => {
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
            Solutions Overview
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Full-cycle strategic advisory for healthcare organizations.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl"
          >
            Based in Calgary, Vitalis Health Strategies supports practitioners and healthcare organizations across Canada through every stage of growth — from initial concept through long-term strategic advisory.
          </motion.p>
        </div>
      </section>

      {/* Two Entry Points */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Where is your practice right now?</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Vitalis provides tailored solutions whether you're planning a new practice or looking for an objective view of an existing one.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40 hover:shadow-elevated transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-forest flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Planning a New Practice
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                For practitioners and healthcare entrepreneurs planning a new medical clinic, dental office, or veterinary facility. We guide you from concept through launch.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/solutions/new-clinics">
                  Explore New Practice Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40 hover:shadow-elevated transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Growing an Existing Practice
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                For practice leaders looking to gain an objective view of operations, improve performance, modernize systems, and position their practice for sustainable growth.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/solutions/existing-clinics">
                  Explore Existing Practice Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full Capabilities */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Full-Cycle Capabilities</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Comprehensive expertise across healthcare strategy.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Vitalis brings deep capability across the full spectrum of healthcare strategy consulting — supporting organizations through every challenge and opportunity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <cap.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{cap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Types */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Types of Practices We Work With</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Healthcare practices of all types.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Vitalis supports practitioners and organizations across a range of practice types and clinical specialties throughout Calgary and across Canada.
              </p>
            </div>
            <div className="space-y-3">
              {practiceTypes.map((type, i) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card rounded-xl px-6 py-4 shadow-soft border border-border/40 flex items-center gap-3"
                >
                  <BarChart3 className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{type}</span>
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
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Organizations We Support</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              From private practices to public systems.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Vitalis supports a range of healthcare organizations through practical, coordinated advisory engagements.
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
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <org.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{org.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{org.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle CTA */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Target className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Full-lifecycle advisory partnership.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Many organizations retain Vitalis as a long-term strategic advisor — providing ongoing guidance as their organization grows, evolves, and navigates new challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Talk to Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero" size="xl" asChild>
                <Link to="/strategic-assessment/intake">
                  Explore a Practice Assessment
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

export default Solutions;
