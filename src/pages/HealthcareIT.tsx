import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Monitor,
  Server,
  BarChart3,
  Cog,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  Activity,
  Database,
  Layers,
  TrendingUp,
  Target,
  Zap,
  RefreshCw,
  LineChart,
  PieChart,
  ClipboardList,
  Workflow,
  Globe,
  Shield,
  Plug,
  Laptop,
} from "lucide-react";

/* ── data ── */

const healthcareITAreas = [
  { icon: FileText, label: "Electronic Medical Records (EMRs)" },
  { icon: Calendar, label: "Scheduling & Billing Systems" },
  { icon: ClipboardList, label: "Clinical Documentation Tools" },
  { icon: MessageSquare, label: "Patient Communication Platforms" },
  { icon: BarChart3, label: "Operational Dashboards" },
  { icon: LineChart, label: "Analytics & Reporting Systems" },
];

const techImpact = [
  { icon: Cog, label: "Operational Efficiency" },
  { icon: Users, label: "Staffing Workflows" },
  { icon: Activity, label: "Patient Experience" },
  { icon: TrendingUp, label: "Financial Performance" },
  { icon: Layers, label: "Clinic Scalability" },
];

const newClinicServices = [
  "EMR selection & evaluation",
  "Technology infrastructure planning",
  "Workflow mapping & system design",
  "Billing & scheduling integration",
  "Reporting & analytics design",
  "System integrations",
  "Patient portal implementation",
];

const newClinicAlignment = [
  { icon: Workflow, label: "Clinical Workflows" },
  { icon: Users, label: "Staffing Models" },
  { icon: Target, label: "Facility Design" },
  { icon: Cog, label: "Operational Goals" },
];

const existingClinicServices = [
  { title: "EMR Usage Evaluation", desc: "Assess how effectively your clinic uses its current EMR system." },
  { title: "Workflow Redesign", desc: "Restructure workflows within the EMR to match clinical operations." },
  { title: "Documentation Automation", desc: "Automate repetitive documentation processes to save provider time." },
  { title: "Billing Workflow Improvement", desc: "Streamline billing processes to reduce errors and improve collections." },
  { title: "Administrative Overhead Reduction", desc: "Identify and eliminate unnecessary administrative steps." },
  { title: "Digital Patient Tools", desc: "Integrate online booking, patient portals, and communication platforms." },
  { title: "Reporting & Analytics Modernization", desc: "Build modern dashboards to replace outdated reporting methods." },
];

const optimizationOutcomes = [
  { icon: Zap, label: "Clinic Efficiency", color: "bg-accent" },
  { icon: Activity, label: "Provider Productivity", color: "bg-primary" },
  { icon: BarChart3, label: "Reporting Visibility", color: "bg-accent" },
  { icon: MessageSquare, label: "Patient Communication", color: "bg-primary" },
];

const emrPlatforms = [
  {
    name: "Med Access",
    description:
      "A configurable web-based EMR used widely by physicians and specialists across Canada. Includes scheduling, billing, electronic prescribing, and reporting tools.",
  },
  {
    name: "CHR",
    description:
      "Collaborative Health Record — an integrated platform supporting clinical documentation, scheduling, and patient management for multi-provider practices.",
  },
  {
    name: "AVA EMR",
    description:
      "A Canadian electronic medical record platform developed in Calgary that integrates scheduling, charting, billing, and patient communication features.",
  },
  {
    name: "Zenoti",
    description:
      "An enterprise platform for health and wellness clinics providing scheduling, billing, inventory, and marketing automation capabilities.",
  },
  {
    name: "Jane App",
    description:
      "A popular Canadian practice management system with online booking, charting, telehealth, and insurance billing designed for allied health clinics.",
  },
];

const kpiExamples = [
  "Patient Volume",
  "Provider Utilization",
  "Appointment Wait Times",
  "Revenue per Visit",
  "Billing Efficiency",
  "Procedure Volumes",
  "No-Show Rates",
  "Patient Retention",
  "Referral Patterns",
];

const digitalTools = [
  { icon: Globe, label: "Patient Portals" },
  { icon: Calendar, label: "Online Booking" },
  { icon: Monitor, label: "Virtual Care Platforms" },
  { icon: FileText, label: "Automated Forms" },
  { icon: TrendingUp, label: "Billing Integrations" },
  { icon: Plug, label: "Referral Management" },
  { icon: LineChart, label: "Analytics Systems" },
];

const ongoingServices = [
  "System optimization & tuning",
  "Technology roadmap planning",
  "Vendor evaluation & selection",
  "Digital transformation strategy",
  "Data & reporting improvements",
];

/* ── helpers ── */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

/* ── Component ── */

const HealthcareIT = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p {...fadeUp} className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
            Healthcare IT
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Healthcare IT Strategy&nbsp;&amp;&nbsp;Systems
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl"
          >
            Strategic technology planning, EMR optimization, and operational intelligence for modern healthcare practices.
          </motion.p>
        </div>
      </section>

      {/* ── Section 1 — Introduction ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">The Foundation</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Technology is the backbone of every modern clinic.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Healthcare organizations rely heavily on technology systems to operate effectively. From electronic medical records to analytics dashboards, every technology decision impacts how a clinic delivers care, manages staff, and sustains growth.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Vitalis supports healthcare organizations in making strategic technology decisions and ensuring systems work effectively together — across new builds, existing practices, and long-term operational intelligence.
              </p>
            </motion.div>

            <div className="space-y-8">
              <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Healthcare IT Includes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {healthcareITAreas.map((item, i) => (
                    <motion.div
                      key={item.label}
                      {...fadeUp}
                      transition={{ delay: 0.05 * i }}
                      className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-soft border border-border/40"
                    >
                      <item.icon className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Technology Decisions Affect</h3>
                <div className="flex flex-wrap gap-3">
                  {techImpact.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2"
                    >
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold text-secondary-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2 — New Clinics ── */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">New Clinic Builds</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Technology Strategy for New Clinics
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Technology planning is one of the most important parts of launching a new healthcare facility. The systems chosen at launch shape every operational decision that follows.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Services list */}
            <motion.div {...fadeUp} className="space-y-3">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Vitalis supports new clinics with:</h3>
              {newClinicServices.map((s, i) => (
                <motion.div
                  key={s}
                  {...fadeUp}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 bg-card rounded-xl px-5 py-3.5 shadow-soft border border-border/40"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-accent">{i + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{s}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Alignment + diagram */}
            <div className="space-y-8">
              <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Technology must align with:</h3>
                <div className="grid grid-cols-2 gap-4">
                  {newClinicAlignment.map((item) => (
                    <div
                      key={item.label}
                      className="bg-card rounded-2xl p-5 shadow-soft border border-border/40 flex flex-col items-center text-center gap-3"
                    >
                      <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Flow diagram */}
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                <h4 className="font-display text-sm font-bold text-foreground mb-5 text-center uppercase tracking-wider">
                  Technology Integration Flow
                </h4>
                <div className="flex flex-col items-center gap-0">
                  {[
                    { icon: Cog, label: "Clinic Operations", color: "bg-secondary" },
                    { icon: Monitor, label: "EMR System", color: "bg-primary/15" },
                    { icon: BarChart3, label: "Reporting & Analytics", color: "bg-accent/15" },
                    { icon: TrendingUp, label: "Financial Performance", color: "bg-secondary" },
                    { icon: Activity, label: "Patient Experience", color: "bg-primary/15" },
                  ].map((step, i, arr) => (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className={`${step.color} rounded-xl px-6 py-3 flex items-center gap-3 w-full max-w-xs`}>
                        <step.icon className="h-5 w-5 text-foreground flex-shrink-0" />
                        <span className="text-sm font-semibold text-foreground">{step.label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-px h-6 bg-border" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3 — Existing Clinics ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-16 max-w-3xl">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Existing Practices</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Technology Optimization for Existing Clinics
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Many clinics operate with technology that is not fully optimized. Most practices only use a small portion of their EMR capabilities — leaving significant efficiency gains unrealized.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6 mb-14">
            {existingClinicServices.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300"
              >
                <h3 className="font-display text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Outcomes */}
          <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 shadow-card border border-border/40 max-w-3xl mx-auto">
            <h3 className="font-display text-xl font-bold text-foreground mb-6 text-center">
              Technology optimization improves
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {optimizationOutcomes.map((o) => (
                <div key={o.label} className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${o.color}/15 flex items-center justify-center`}>
                    <o.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-foreground text-center">{o.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 4 — EMR Platforms ── */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">EMR Expertise</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Electronic Medical Records (EMR) Platforms
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Vitalis works with clinics using many EMR platforms. Each system has different strengths and workflows — and the right choice depends on the clinic's specialty, size, and operational model.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {emrPlatforms.map((emr, i) => (
              <motion.div
                key={emr.name}
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <Laptop className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{emr.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{emr.description}</p>
              </motion.div>
            ))}

            {/* More coming */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.35 }}
              className="bg-card/50 rounded-2xl p-7 border border-dashed border-border flex flex-col items-center justify-center text-center"
            >
              <RefreshCw className="h-8 w-8 text-muted-foreground/50 mb-3" />
              <span className="text-sm font-medium text-muted-foreground">More platforms added over time</span>
            </motion.div>
          </div>

          <motion.div {...fadeUp} className="mt-12 bg-card rounded-2xl p-7 shadow-soft border border-border/40 max-w-3xl">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">Vitalis helps clinics:</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {["Choose the right EMR", "Configure workflows", "Integrate external tools", "Optimize system usage"].map(
                (s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{s}</span>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 5 — Dashboards & KPIs ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Clinic Intelligence</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Operational Dashboards &amp; KPI Reporting
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                One of the most powerful uses of healthcare technology is operational intelligence. Vitalis designs custom dashboards and KPI tracking systems built around clinic data, integrating with EMR systems to surface the metrics that matter.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Dashboards help clinic leaders understand operational performance, identify bottlenecks, improve financial outcomes, and track growth — all in real time.
              </p>
            </motion.div>

            <div className="space-y-6">
              {/* KPI grid */}
              <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                <h3 className="font-display text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Key Performance Indicators</h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {kpiExamples.map((kpi) => (
                    <div key={kpi} className="bg-secondary rounded-lg px-3 py-2.5 text-center">
                      <span className="text-xs font-semibold text-secondary-foreground">{kpi}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Data flow diagram */}
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                <h4 className="font-display text-sm font-bold text-foreground mb-5 text-center uppercase tracking-wider">
                  Intelligence Pipeline
                </h4>
                <div className="flex items-center justify-between gap-2">
                  {[
                    { icon: Database, label: "EMR Data" },
                    { icon: Cog, label: "Processing" },
                    { icon: PieChart, label: "Dashboard" },
                    { icon: Target, label: "Decisions" },
                  ].map((step, i, arr) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <step.icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground">{step.label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-border mb-5 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6 — Data & Reporting ── */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Data Strategy</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Data &amp; Reporting Strategy
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Healthcare data is often underutilized. Vitalis helps clinics extract value from the data they already collect — building reporting systems that drive strategic decisions.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Database, title: "Build Reporting Systems", desc: "Structure data into actionable reports." },
              { icon: Server, title: "Extract EMR Data", desc: "Surface insights from clinical records." },
              { icon: LineChart, title: "Identify Trends", desc: "Spot operational and financial patterns." },
              { icon: Target, title: "Strategic Decisions", desc: "Use data to guide planning and growth." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-12 bg-card rounded-2xl p-7 shadow-soft border border-border/40 max-w-3xl mx-auto">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">Strong reporting systems help clinics:</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {["Improve operational efficiency", "Plan staffing strategically", "Understand financial performance", "Support expansion decisions"].map(
                (s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{s}</span>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 7 — Digital Health Tools ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Digital Ecosystem</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Technology Integration &amp; Digital Health Tools
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Modern clinics rely on multiple digital tools beyond the EMR. From patient portals to virtual care platforms, these tools must work as an integrated ecosystem — not in silos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Vitalis supports integration planning to ensure every tool connects seamlessly, reducing redundancy and improving both the patient and provider experience.
              </p>
            </motion.div>

            {/* Ecosystem visual */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <div className="relative">
                {/* Center hub */}
                <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-accent" />
                    </div>
                  </div>
                  <p className="text-center text-sm font-bold text-foreground mb-6">Integrated Technology Ecosystem</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {digitalTools.map((tool) => (
                      <div
                        key={tool.label}
                        className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2.5"
                      >
                        <tool.icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span className="text-xs font-medium text-secondary-foreground">{tool.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 8 — Ongoing Advisory ── */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Long-Term Partnership</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Healthcare IT as an Ongoing Advisory Service
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Technology evolves quickly. Vitalis provides ongoing advisory support for healthcare technology — ensuring clinics stay ahead of changes and continuously optimize their systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Technology advisory can be part of ongoing strategic advisory relationships, providing clinics with a trusted partner for every technology decision.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="space-y-3">
              {ongoingServices.map((s, i) => (
                <motion.div
                  key={s}
                  {...fadeUp}
                  transition={{ delay: 0.05 * i }}
                  className="bg-card rounded-xl px-6 py-4 shadow-soft border border-border/40 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{s}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <Monitor className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Strategic healthcare technology advisory.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Whether you're launching a new clinic, optimizing an existing practice, or building operational intelligence — Vitalis brings the strategic technology expertise your organization needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Book a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero" size="xl" asChild>
                <Link to="/clinic-audit">
                  Strategic Assessment
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

export default HealthcareIT;
