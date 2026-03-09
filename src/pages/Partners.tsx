import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Briefcase, Scale, Laptop2, Users, Landmark } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const partnerGroups = [
  {
    value: "financial",
    icon: Landmark,
    title: "Financial Partners",
    summary: "Banking, lending, and private wealth relationships that support healthcare ventures.",
    leadPartner: {
      name: "ATB Financial — Healthcare & Private Wealth",
      description:
        "ATB Financial provides specialized banking and advisory services for healthcare professionals. Their healthcare and private wealth teams support physicians and clinic operators with financing, capital planning, and long-term financial strategy.",
      collaboration:
        "Vitalis works closely with ATB to support clients with clinic financing, facility builds, financial restructuring, and growth planning.",
    },
    support: [
      "Healthcare lenders and financing specialists",
      "Private wealth advisors for physicians",
      "Capital planning and debt structuring support",
    ],
  },
  {
    value: "design",
    icon: Building2,
    title: "Design & Architecture Partners",
    summary: "Facility planning and design expertise aligned with operational healthcare strategy.",
    leadPartner: {
      name: "Holland Design",
      description:
        "Holland Design is an architectural and design firm with experience in healthcare facility planning and medical environments.",
      collaboration:
        "Vitalis collaborates with Holland Design to ensure clinic layouts support operational workflows, patient flow, and long-term practice growth.",
    },
    support: [
      "Healthcare-focused architectural consultants",
      "Clinical interior and patient flow planning",
      "Construction and build coordination teams",
    ],
  },
  {
    value: "legal",
    icon: Scale,
    title: "Legal Partners",
    summary: "Legal and compliance specialists supporting healthcare structures and transactions.",
    leadPartner: {
      name: "Field Law",
      description:
        "Field Law supports healthcare organizations with regulatory guidance, corporate structuring, transaction support, and legal risk management.",
      collaboration:
        "Vitalis collaborates with Field Law to align legal structure with operational and strategic decisions throughout the lifecycle of healthcare ventures.",
    },
    support: [
      "Healthcare regulatory and licensing guidance",
      "Corporate and governance structuring",
      "Transaction and partnership documentation",
    ],
  },
  {
    value: "technology",
    icon: Laptop2,
    title: "Technology Partners",
    summary: "Digital health, EHR, and systems partners that support modern clinic operations.",
    leadPartner: {
      name: "Healthcare Technology Providers",
      description:
        "Vitalis works with leading technology providers to support EHR strategy, workflow-aligned system selection, and digital modernization.",
      collaboration:
        "We help ensure technology decisions align with staffing models, patient flow, and long-term operational goals.",
    },
    support: [
      "EHR/EMR optimization specialists",
      "Practice management platforms",
      "Data and reporting system advisors",
    ],
  },
  {
    value: "workforce",
    icon: Users,
    title: "Workforce & Recruitment Partners",
    summary: "Partners that support physician recruitment and sustainable workforce growth.",
    leadPartner: {
      name: "Recruitment & Workforce Network",
      description:
        "Our network includes physician recruitment specialists and workforce advisors that help clinics build resilient teams.",
      collaboration:
        "Vitalis integrates recruitment planning with operational and financial strategy to support long-term practice sustainability.",
    },
    support: [
      "Physician recruitment specialists",
      "Workforce planning advisors",
      "Leadership and retention strategy support",
    ],
  },
  {
    value: "advisory",
    icon: Briefcase,
    title: "Additional Advisory Partners",
    summary: "Specialist advisors engaged as needed for complex healthcare projects.",
    leadPartner: {
      name: "Curated Specialist Advisors",
      description:
        "Depending on project scope, Vitalis can coordinate additional advisors in compliance, operations, financing, and implementation support.",
      collaboration:
        "This coordinated model helps physicians avoid managing disconnected specialists while maintaining strategic alignment.",
    },
    support: [
      "Regulatory and accreditation advisors",
      "Operational improvement consultants",
      "Project-specific specialist support",
    ],
  },
];

const Partners = () => {
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
            Partner Ecosystem
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Coordinated Healthcare Advisory
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl"
          >
            Healthcare projects often involve architects, lenders, legal advisors, technology vendors, and consultants. Vitalis coordinates these relationships so physicians and healthcare leaders do not have to manage fragmented advisory structures alone.
          </motion.p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="mb-10">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Explore Partner Categories</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Each category is part of a coordinated model designed to align decisions across financing, design, legal structure, operations, and technology.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full rounded-2xl bg-card px-6 lg:px-8 py-2 shadow-card border border-border/40">
            {partnerGroups.map((group) => (
              <AccordionItem key={group.value} value={group.value} className="border-border/50">
                <AccordionTrigger className="py-6 hover:no-underline">
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <group.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">{group.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{group.summary}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pb-6 pl-14">
                    <div className="bg-secondary/40 rounded-xl p-5 mb-5 border border-border/40">
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Featured Partner</p>
                      <h4 className="font-display text-lg font-bold text-foreground mb-2">{group.leadPartner.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{group.leadPartner.description}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">{group.leadPartner.collaboration}</p>
                    </div>

                    <h5 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">Additional Collaboration Areas</h5>
                    <ul className="space-y-2">
                      {group.support.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Speak with Vitalis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
