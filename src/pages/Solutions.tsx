import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Building, BarChart3, Settings, DollarSign,
  Users, TrendingUp, Handshake, Laptop, ArrowRight,
} from "lucide-react";

const solutions = [
  {
    icon: Building,
    title: "New Clinics & Facility Builds",
    description: "End-to-end support for launching new healthcare facilities — from concept validation and feasibility through design, construction oversight, operational setup, and go-to-market.",
    outcomes: ["Validated concept and business model", "Facility design and build oversight", "Operational launch plan", "Revenue ramp strategy"],
  },
  {
    icon: BarChart3,
    title: "Strategic Analysis & Assessments",
    description: "Comprehensive evaluations that identify gaps, risks, and opportunities across clinical operations, financials, compliance, and market position.",
    outcomes: ["Gap and risk identification", "Competitive positioning", "Actionable improvement roadmap", "Benchmark analysis"],
  },
  {
    icon: Settings,
    title: "Operational Excellence",
    description: "Workflow optimization, systems redesign, efficiency improvement, and process engineering to elevate daily operations and free up capacity.",
    outcomes: ["Streamlined workflows", "Reduced operational waste", "Improved throughput", "Staff satisfaction gains"],
  },
  {
    icon: DollarSign,
    title: "Revenue & Financial Performance",
    description: "Revenue cycle management, coding optimization, payer strategy, and financial health improvement to strengthen the bottom line.",
    outcomes: ["Revenue cycle optimization", "Coding accuracy improvement", "Reduced denials and AR", "Financial clarity and control"],
  },
  {
    icon: Users,
    title: "Physician Recruitment & Workforce",
    description: "Strategic recruitment, succession planning, culture development, and workforce design to build and retain the right team.",
    outcomes: ["Physician recruitment strategy", "Succession planning", "Retention improvement", "Workforce alignment"],
  },
  {
    icon: Laptop,
    title: "Digital Transformation",
    description: "Technology assessment, EHR optimization, digital workflow modernization, and platform integration to future-proof operations.",
    outcomes: ["Technology roadmap", "EHR optimization", "Digital workflow design", "Integration strategy"],
  },
  {
    icon: TrendingUp,
    title: "Growth & Expansion Strategy",
    description: "Market analysis, geographic expansion, service line development, and multi-location scaling to grow with intention.",
    outcomes: ["Market opportunity analysis", "Expansion playbook", "Service line strategy", "Scalable growth model"],
  },
  {
    icon: Handshake,
    title: "Mergers, Acquisitions & Exit",
    description: "Transaction advisory, valuation optimization, deal structuring, buyer/partner identification, and value-maximized transitions.",
    outcomes: ["Valuation preparation", "Deal structuring", "Buyer/partner sourcing", "Transition management"],
  },
];

const Solutions = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
            Solutions, Not Just Services
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Strategic consulting built around outcomes.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Every engagement is designed to solve real problems, create measurable improvement, and build lasting value for your healthcare organization.
          </motion.p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-12">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="bg-card rounded-2xl p-8 lg:p-10 shadow-card"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{s.description}</p>
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">What We Deliver</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {s.outcomes.map((outcome) => (
                        <div key={outcome} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          {outcome}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="hero-outline" size="default" asChild className="mt-6">
                    <Link to="/contact">Discuss This Solution <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
