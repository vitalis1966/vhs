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
  Workflow,
  Globe,
  Shield,
  Plug,
  Laptop,
  Wifi,
  HardDrive,
  Lock,
  Headphones,
  CloudCog,
  Router,
  Settings,
  AlertTriangle,
  CheckCircle,
  Wrench,
} from "lucide-react";

/* ── data ── */

const healthcareITAreas = [
  { icon: FileText, label: "Electronic Medical Records (EMRs)" },
  { icon: Server, label: "Network Infrastructure" },
  { icon: Laptop, label: "Clinic Hardware" },
  { icon: Shield, label: "Cybersecurity" },
  { icon: BarChart3, label: "Operational Reporting Systems" },
  { icon: Calendar, label: "Scheduling & Billing Platforms" },
  { icon: MessageSquare, label: "Patient Communication Tools" },
];

const managedITServices = [
  {
    icon: HardDrive,
    title: "IT Infrastructure Procurement",
    items: [
      "Servers & workstations",
      "Networking equipment & firewalls",
      "Routers & secure Wi-Fi infrastructure",
      "Backup systems",
      "Provider laptops & tablets",
    ],
    note: "Hardware is selected to ensure compatibility with EMR systems, secure network infrastructure, and scalable clinic operations.",
  },
  {
    icon: Router,
    title: "Network Setup & Configuration",
    items: [
      "Secure internal networks",
      "Firewall configuration",
      "VPN access",
      "Secure Wi-Fi",
      "Segmented networks for clinical & administrative systems",
    ],
    note: "Healthcare environments require strong security and reliability.",
  },
  {
    icon: Lock,
    title: "Cybersecurity Protection",
    items: [
      "Firewall management",
      "Network monitoring",
      "Malware protection",
      "Endpoint security",
      "Data encryption",
      "Security updates & vulnerability management",
    ],
    note: "Healthcare data requires strict security protection.",
  },
  {
    icon: Settings,
    title: "IT Monitoring & Maintenance",
    items: [
      "Server & network monitoring",
      "Device monitoring",
      "Automated alerts for system failures",
      "Software updates",
      "Patch management",
    ],
    note: "Proactive monitoring detects issues before they impact clinic operations.",
  },
  {
    icon: Headphones,
    title: "Helpdesk Support & Ticketing",
    items: [
      "IT support ticketing system",
      "Remote troubleshooting",
      "Device troubleshooting",
      "Network issue resolution",
      "System access support",
      "Staff technical support",
    ],
    note: "Clinics can submit support requests quickly when issues arise.",
  },
  {
    icon: CloudCog,
    title: "Backup & Disaster Recovery",
    items: [
      "Automated backups",
      "Secure data storage",
      "Disaster recovery planning",
      "Rapid system restoration",
    ],
    note: "Critical for protecting patient data and clinic operations.",
  },
];

const newClinicITServices = [
  "IT infrastructure design",
  "Network architecture planning",
  "Server environment setup",
  "Workstation deployment",
  "Secure wireless networks",
  "Cybersecurity framework implementation",
  "EMR system selection & installation",
];

const existingClinicITServices = [
  { title: "IT Infrastructure Audits", desc: "Comprehensive review of current technology environment." },
  { title: "Network Redesign", desc: "Optimize network architecture for performance and security." },
  { title: "Hardware Upgrades", desc: "Replace aging equipment with modern, reliable systems." },
  { title: "Cybersecurity Improvements", desc: "Strengthen security posture and compliance." },
  { title: "Performance Optimization", desc: "Tune systems for better speed and reliability." },
  { title: "Infrastructure Modernization", desc: "Transition to modern, scalable IT infrastructure." },
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

const emrServices = [
  "Select the right EMR platform",
  "Configure workflows",
  "Optimize scheduling and documentation",
  "Integrate digital health tools",
];

const kpiExamples = [
  "Patient Volumes",
  "Provider Utilization",
  "Appointment Wait Times",
  "Revenue per Visit",
  "Billing Performance",
  "No-Show Rates",
];

const ongoingAdvisoryServices = [
  { icon: Workflow, label: "IT roadmap planning" },
  { icon: RefreshCw, label: "System upgrades" },
  { icon: Target, label: "Technology vendor selection" },
  { icon: Settings, label: "Infrastructure improvements" },
  { icon: LineChart, label: "Reporting & analytics strategy" },
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
            Healthcare IT Strategy &amp; Managed Technology Services
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl"
          >
            Strategic technology planning, managed IT infrastructure, and operational intelligence for modern healthcare practices.
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
                Technology powers every modern clinic.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Healthcare organizations rely heavily on technology systems to operate effectively. From electronic medical records to network infrastructure and cybersecurity, every technology decision impacts how a clinic delivers care, manages staff, and sustains growth.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Vitalis supports clinics through both <strong>technology strategy</strong> and <strong>managed IT infrastructure and services</strong> — providing complete healthcare IT support.
              </p>

              {/* Two pillars */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-5 border border-border/40 shadow-soft">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">Technology Strategy</h3>
                  <p className="text-sm text-muted-foreground">EMR selection, analytics, workflow optimization, and digital transformation.</p>
                </div>
                <div className="bg-card rounded-xl p-5 border border-border/40 shadow-soft">
                  <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-3">
                    <Server className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">Managed IT Services</h3>
                  <p className="text-sm text-muted-foreground">Hardware, networks, security, monitoring, helpdesk, and infrastructure support.</p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Healthcare IT Includes</h3>
              <div className="space-y-3">
                {healthcareITAreas.map((item, i) => (
                  <motion.div
                    key={item.label}
                    {...fadeUp}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-soft border border-border/40"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 2 — Managed IT Services ── */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-16">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Managed IT</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Managed IT Services for Healthcare Practices
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Many clinics do not have internal IT teams and require reliable IT infrastructure and support. Vitalis provides managed IT services designed specifically for healthcare environments.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 bg-card rounded-xl px-5 py-3 border border-border/40 shadow-soft">
              <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                <strong>Set-it-and-forget-it model:</strong> Focus on patient care while IT is managed professionally.
              </span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedITServices.map((service, i) => (
              <motion.div
                key={service.title}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{service.title}</h3>
                <ul className="space-y-2 mb-4">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground/80 italic border-t border-border/40 pt-3">{service.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 — IT for New Clinic Builds ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">New Clinic Builds</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Technology &amp; Infrastructure for New Clinics
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                When building a new clinic, technology infrastructure must be designed correctly from the beginning. Poor planning leads to costly changes later — and disrupts clinical operations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Vitalis supports new clinic builds by planning complete IT infrastructure, ensuring the clinic launches with fully operational and secure technology systems.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="space-y-3">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Vitalis plans for new clinics:</h3>
              {newClinicITServices.map((s, i) => (
                <motion.div
                  key={s}
                  {...fadeUp}
                  transition={{ delay: 0.04 * i }}
                  className="flex items-center gap-3 bg-card rounded-xl px-5 py-3.5 shadow-soft border border-border/40"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{s}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 4 — IT Optimization for Existing Clinics ── */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-16 max-w-3xl">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Existing Practices</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Technology Optimization for Existing Clinics
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Many clinics operate with outdated or poorly configured IT environments. Vitalis helps existing clinics improve their infrastructure for reliable systems and stronger operational performance.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {existingClinicITServices.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5 — Clinic Intelligence, Dashboards & Data Strategy ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-16 max-w-3xl">
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Clinic Intelligence</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Operational Dashboards &amp; EMR Data Intelligence
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Healthcare clinics generate significant operational data through their EMR systems. When structured correctly, this data provides insight into clinic performance, provider productivity, patient access, and financial outcomes.
            </p>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Vitalis helps clinics transform their operational data into clear dashboards, KPIs, and decision-making tools.
            </p>
          </motion.div>

          {/* Custom Clinic Dashboards */}
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
            <motion.div {...fadeUp}>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Custom Clinic Dashboards</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Vitalis helps clinics build custom operational dashboards tailored to their practice. Dashboards may use integrated EMR reporting, external reporting tools, or manual data integration when direct integrations are not available.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl p-5 border border-border/40 shadow-soft">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                    <Plug className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-foreground mb-1">Integrated Dashboards</h4>
                  <p className="text-xs text-muted-foreground">Connected directly to EMR reporting and data feeds.</p>
                </div>
                <div className="bg-card rounded-xl p-5 border border-border/40 shadow-soft">
                  <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-3">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-foreground mb-1">Manual Frameworks</h4>
                  <p className="text-xs text-muted-foreground">Structured reporting when direct integrations are not available.</p>
                </div>
              </div>
            </motion.div>

            {/* KPI Grid */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                <h3 className="font-display text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Example KPIs</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {kpiExamples.map((kpi) => (
                    <div key={kpi} className="bg-secondary rounded-lg px-3 py-2.5 text-center">
                      <span className="text-xs font-semibold text-secondary-foreground">{kpi}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intelligence Pipeline */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                <h4 className="font-display text-sm font-bold text-foreground mb-5 text-center uppercase tracking-wider">
                  Data → Insight → Decision
                </h4>
                <div className="flex items-center justify-between gap-2">
                  {[
                    { icon: Database, label: "Clinic Data" },
                    { icon: Cog, label: "Analysis" },
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
              </div>
            </motion.div>
          </div>

          {/* Clinic Performance Analysis */}
          <motion.div {...fadeUp} className="mb-20">
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">Clinic Performance Analysis</h3>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              Vitalis uses clinic data to analyze operational efficiency, provider productivity, scheduling capacity, patient access, and financial performance — helping clinics make strategic decisions.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: Users, title: "Staffing Adjustments", desc: "Align staffing models with patient demand patterns." },
                { icon: Calendar, title: "Schedule Redesign", desc: "Optimize provider schedules for capacity and access." },
                { icon: Cog, title: "Operational Improvements", desc: "Identify bottlenecks and streamline workflows." },
                { icon: TrendingUp, title: "Growth Planning", desc: "Use performance data to support expansion decisions." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-display text-base font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* EMR Advisory Clarification + Platform Examples */}
          <motion.div {...fadeUp}>
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">EMR Advisory</h3>
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">
              Vitalis does not install or manage EMR systems directly. Instead, Vitalis helps clinics evaluate EMR platform options, advise on selection, assess system capabilities, configure workflows at a strategic level, and ensure reporting and analytics structures are effective.
            </p>
            <div className="bg-card rounded-2xl p-7 shadow-soft border border-border/40 mb-8">
              <h4 className="font-display text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                Examples of EMR Platforms Used by Clinics
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {emrPlatforms.map((emr) => (
                  <div key={emr.name} className="flex items-start gap-3 bg-secondary/50 rounded-xl px-4 py-3">
                    <Laptop className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-bold text-foreground">{emr.name}</span>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{emr.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic max-w-2xl">
              Vitalis advises clinics on selecting the right platform based on their operational model. EMR installation and technical support are handled by the respective vendors or IT providers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 6 — Ongoing Technology Advisory ── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Long-Term Partnership</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Ongoing Technology Advisory
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Many clinics retain Vitalis for ongoing technology advisory services. Technology evolves quickly — and having a trusted partner ensures clinics stay ahead of changes and continuously optimize their systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This ensures clinics continue improving their technology environment as they grow, without needing to manage IT strategy internally.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="space-y-3">
              {ongoingAdvisoryServices.map((s, i) => (
                <motion.div
                  key={s.label}
                  {...fadeUp}
                  transition={{ delay: 0.05 * i }}
                  className="bg-card rounded-xl px-6 py-4 shadow-soft border border-border/40 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <s.icon className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center">
                <Server className="h-7 w-7 text-accent" />
              </div>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Complete healthcare IT support.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              From strategic technology planning to managed IT infrastructure — Vitalis provides the complete technology expertise your clinic needs to operate efficiently and securely.
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
