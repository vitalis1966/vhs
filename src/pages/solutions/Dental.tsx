import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/seo";
import { JsonLd, buildServiceSchema, buildBreadcrumbSchema } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle,
  ClipboardList,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Monitor,
  MapPin,
  Shield,
  FileText,
  Building2,
  Brain,
  Smile,
  Baby,
  Scissors,
  Settings,
  Briefcase,
  Handshake,
  CircleDollarSign,
  UserPlus,
  TrendingDown,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const heroStats = [
  { stat: "General & Specialty Dentistry", context: "From solo GPs to multi-location groups" },
  { stat: "New Builds & Established Practices", context: "Every stage of your practice's lifecycle" },
  { stat: "Calgary & Edmonton Markets", context: "Alberta-focused with national reach" },
  { stat: "ADA+C & Provincial Expertise", context: "Regulatory and billing context built in" },
];

const challenges = [
  {
    icon: DollarSign,
    title: "Revenue Is Systematically Under-Captured",
    body: "Dental practices across Canada routinely leave 8–15% of collectible revenue uncaptured — across insurance carriers, fee schedules, and patient billing. The gaps are systematic, not random, and compound quietly until identified by an independent review.",
  },
  {
    icon: Building2,
    title: "Corporate Consolidation Is Accelerating",
    body: "DSOs and corporate dental groups are acquiring independent practices across Alberta, BC, and Ontario. Dentists who don't understand what drives their practice's valuation are negotiating from incomplete information.",
  },
  {
    icon: TrendingDown,
    title: "Growth Without a Plan Costs More Than It Earns",
    body: "Adding an operatory, associate, or second location without financial modeling and operational preparation is how dental practices create financial strain. Every expansion decision has infrastructure, staffing, and cash flow implications that must be modeled first.",
  },
  {
    icon: UserPlus,
    title: "Associate Recruitment Is a Market Problem",
    body: "Alberta's dental associate market is competitive — new graduates have more options than previous generations. Practices that can't clearly articulate their value proposition and compensation structure lose recruiting competitions they could have won.",
  },
];

const services = [
  { icon: ClipboardList, title: "Strategic Assessment", body: "Independent review across revenue collection, scheduling utilization, overhead ratios, staffing structure, technology, and growth readiness." },
  { icon: Building2, title: "New Dental Office Builds", body: "Financial modeling, site selection, dental-specific facility planning, ADA+C compliance, practice management software setup, and launch preparation." },
  { icon: CircleDollarSign, title: "Billing & Fee Collection", body: "Systematic review of every revenue stream — insurance carriers, fee guide alignment, coordination of benefits, and patient billing — to find and close collection gaps." },
  { icon: Calendar, title: "Operations & Scheduling", body: "Operatory utilization, hygiene productivity, appointment mix, and patient flow — redesigned to run at capacity without adding space." },
  { icon: Users, title: "Associate Recruitment", body: "Finding the right associates, structuring compensation fairly, and building the partnership track that retains them long term." },
  { icon: Monitor, title: "Practice Technology", body: "Practice management software selection (Dentrix, Eaglesoft, Tracker, ABELDent, Curve), digital X-ray integration, patient communication, and online booking." },
  { icon: TrendingUp, title: "Growth & Multi-Location", body: "Second locations, new service lines, and multi-site operations — planned financially and built operationally before you open." },
  { icon: Handshake, title: "M&A & Transitions", body: "Dental practice valuation, acquisition advisory, DSO negotiation support, partner buyout structuring, and associate buy-in planning." },
];

const practiceTypes = [
  { icon: Smile, title: "General Family Dentistry", body: "Solo and group practices across Canada" },
  { icon: Scissors, title: "Oral Surgery & OMS", body: "Surgical and sedation practices" },
  { icon: Baby, title: "Pediatric Dentistry", body: "Specialized facility, staffing, and patient experience" },
  { icon: Building2, title: "Multi-Location Dental Groups", body: "2–10 location organizations" },
  { icon: Settings, title: "Orthodontics & Specialty", body: "Ortho, endo, perio, prostho practices" },
  { icon: Briefcase, title: "Dental Corporations & DSO-Track", body: "Positioning for corporate structure or acquisition" },
];

const regulatoryFeatures = [
  { icon: Shield, title: "Alberta Dental Association and College (ADA+C)", body: "Regulates dental practice in Alberta, setting standards for facility, equipment, and professional conduct. Vitalis helps practices understand the operational implications — particularly for multi-location and corporate structures." },
  { icon: DollarSign, title: "Alberta Blue Cross & the Fee Guide", body: "Alberta dental practices bill primarily through insurance carriers against the ADA suggested fee guide. Understanding when and how to price above guide — and ensuring claim accuracy — is one of the most direct revenue levers." },
  { icon: MapPin, title: "Calgary & Edmonton Real Estate", body: "Commercial dental space costs have increased significantly in both markets. Newer community developments and growth corridors present strong new-build opportunities with favourable demographics." },
];

const financialStats = [
  { value: "$600K – $1.2M", label: "Typical New Dental Office Buildout", detail: "Varies by operatory count, location, leasehold improvement requirements, and equipment specification. This is the capital commitment before your first patient arrives." },
  { value: "8–15%", label: "Typical Fee Collection Gap", detail: "Across insurance billing errors, missed pre-authorizations, and outdated fee schedules. Most practices don't know this gap exists until an independent review finds it." },
  { value: "18–24 months", label: "Typical Break-Even Timeline", detail: "For a new 6-operatory Calgary dental practice. Influenced by startup patient volume, hygiene utilization, associate productivity, and overhead structure." },
];

const caseStudies = [
  { tag: "NEW BUILD · CALGARY SE", headline: "8-operatory practice opened within timeline", body: "Dentist moving from associate to ownership. Vitalis provided site selection, financial modeling, and buildout coordination. Opened within 14 months." },
  { tag: "REVENUE · EDMONTON", headline: "12% fee collection improvement within 60 days", body: "Billing workflow and fee schedule changes after revenue assessment resulted in 12% net collection improvement within 60 days." },
  { tag: "MULTI-SITE · ALBERTA", headline: "Expansion from 2 to 4 locations — structured for scale", body: "Dental group with two Calgary locations. Vitalis planned expansion including financial modeling, site criteria, and practice management system migration." },
];

const newPracticeServices = [
  "Dental practice feasibility analysis and Calgary/Edmonton market assessment",
  "Financial modeling: buildout costs, equipment procurement, staffing, and break-even timeline",
  "Site selection and lease negotiation for Alberta dental spaces",
  "Dental-specific facility planning: operatory count, sterilization, X-ray, mechanical",
  "ADA+C regulatory awareness and compliance planning",
  "Practice management software selection and setup",
  "Associate dentist recruitment for new practices",
];

const existingDimensions = [
  "Insurance claim accuracy across all carriers",
  "ADA fee schedule alignment and above-guide billing opportunities",
  "Hygiene chair utilization and re-appointment rates",
  "Operatory and dentist productivity analysis",
  "Overhead ratios across labour, lab, and supply costs",
  "Associate compensation model review",
  "Expansion readiness",
];

export default function Dental() {
  usePageMeta(
    "Dental Practice Consulting Canada | Calgary, Edmonton & Nationwide | Vitalis Health Strategies",
    "Vitalis Health Strategies provides comprehensive consulting for dental practices across Canada — with deep focus on Calgary and Edmonton. New office planning, revenue optimization, operations, technology, recruitment, expansion, and M&A advisory."
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* SECTION 1 — HERO */}
      <section className="relative bg-gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Dental Practices</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight">
              Full-cycle consulting for dental practices —{" "}
              <span className="text-gradient-primary italic">from your first office to a multi-location group.</span>
            </h1>
            <p className="mt-6 text-muted-foreground text-lg max-w-3xl leading-relaxed">
              Vitalis works with general dentists, specialists, and dental organizations across Calgary, Edmonton, and Canada. We bring operational expertise and structured strategy to every stage of dental practice development — new builds, performance optimization, growth planning, technology, and ownership transitions.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {heroStats.map((s, i) => (
              <div key={i} className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                <p className="text-sm font-bold text-foreground">{s.stat}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.context}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment">Start Your Practice Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — SELF-IDENTIFICATION */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Where Are You?</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Every engagement starts with one question.</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
              className="rounded-2xl bg-card border-2 border-border p-8 lg:p-10 flex flex-col shadow-elevated">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-forest bg-forest/10 px-3 py-1 rounded-full w-fit mb-4">Opening a New Practice</span>
              <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-4">A dental office is one of the most capital-intensive businesses a dentist will ever open. The financial model determines whether it succeeds.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                A 10-operatory general dental office in Calgary or Edmonton typically requires $600,000 to $1.2M in leasehold improvements and equipment before the first patient arrives. The site you choose, the lease terms you sign, and the financial structure you build around that investment set the ceiling for the practice's financial performance for years.
              </p>
              <ul className="space-y-2 mb-8 flex-grow">
                {newPracticeServices.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" className="w-full whitespace-normal h-auto py-3 text-center leading-snug" asChild>
                <Link to="/strategic-assessment">Start Your Build Strategy Assessment <ArrowRight className="ml-2 h-5 w-5 shrink-0" /></Link>
              </Button>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl bg-card border-2 border-border p-8 lg:p-10 flex flex-col shadow-elevated">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent bg-accent/10 px-3 py-1 rounded-full w-fit mb-4">Optimizing an Established Practice</span>
              <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-4">Revenue per chair. Hygiene utilization. Fee schedule alignment. These are the numbers that tell the real story of your practice.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Most established dental practices have at least one systematic revenue or operational gap that compounds quietly. An independent performance review identifies exactly where that gap is and what it would take to close it — without disrupting clinical operations or patient relationships.
              </p>
              <ul className="space-y-2 mb-8 flex-grow">
                {existingDimensions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" className="w-full whitespace-normal h-auto py-3 text-center leading-snug" asChild>
                <Link to="/strategic-assessment">Start Your Performance Assessment <ArrowRight className="ml-2 h-5 w-5 shrink-0" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CHALLENGES (dark band) */}
      <section className="py-16 lg:py-24 bg-gradient-forest">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">The Challenges</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight">
              The real challenges facing dental practices across Canada right now.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-primary-foreground/95 p-7">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <c.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{c.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — SERVICES */}
      <section className="py-16 lg:py-24 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Our Services</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">What Vitalis does for dental practices.</h2>
            <p className="mt-3 text-muted-foreground text-lg">Every service is available as part of a full engagement or as a focused standalone advisory.</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.35, delay: i * 0.04 }}
                className="rounded-xl bg-card p-5 shadow-card hover:shadow-elevated transition-shadow duration-300 flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1.5">{s.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — MID-PAGE CTA */}
      <section className="py-14 lg:py-20 bg-muted/40">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <p className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-snug tracking-tight italic">
              "Your dental practice is a financial asset. Most dentists manage it like a clinical operation."
            </p>
            <p className="mt-4 text-muted-foreground text-sm">An independent review changes what you can see — and what you can act on.</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/strategic-assessment">Start Your Practice Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/contact">Speak With Our Team</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 — KEY NUMBERS */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">The Numbers</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Understanding the numbers behind a dental practice.</h2>
            <p className="mt-2 text-muted-foreground text-xs">Illustrative figures only. Individual results vary significantly.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {financialStats.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-border/60 p-8 text-center shadow-card">
                <p className="font-display text-3xl lg:text-4xl font-bold text-accent">{s.value}</p>
                <p className="mt-3 text-sm font-semibold text-foreground uppercase tracking-wider">{s.label}</p>
                <p className="mt-2 text-muted-foreground text-xs leading-relaxed">{s.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — CASE STUDIES */}
      <section className="py-16 lg:py-24 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Dental Practice Engagements</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">A sample of what we've delivered.</h2>
            <p className="mt-2 text-muted-foreground text-sm">Client details withheld.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-card border-2 border-border p-8 shadow-elevated flex flex-col">
                <span className="inline-block text-xs font-bold tracking-wider uppercase text-accent mb-4">{c.tag}</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{c.headline}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — SPECIALTIES */}
      <section className="py-14 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Dental Specialties</span>
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Dental practices we work with.</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {practiceTypes.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-start gap-3 p-4 rounded-lg">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <p.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — REGULATORY CONTEXT */}
      <section className="py-14 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Billing & Regulatory Context</span>
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Alberta, BC, Ontario, and across Canada.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {regulatoryFeatures.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl bg-card border border-border/60 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-sm font-bold text-foreground">{f.title}</h3>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center text-muted-foreground text-xs italic">
            In BC, CDSBC and the BC Dental Fee Guide apply. In Ontario, RCDSO governs practice standards. Vitalis brings regulatory awareness across all major provincial frameworks.
          </motion.p>
        </div>
      </section>

      {/* SECTION 10 — NHSF CALLOUT */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="rounded-2xl bg-gradient-forest p-8 lg:p-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Dental Surgical Facilities</span>
            </div>
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground mb-3">Operating a dental surgical facility or planning one?</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-2xl mx-auto mb-6">
              Oral maxillofacial surgery facilities, dental surgical centres, and practices offering general anesthesia or deep sedation require CPSA NHSF accreditation. Vitalis provides dedicated advisory for dental surgical facility builds and compliance preparation.
            </p>
            <Button variant="gold" size="lg" asChild className="whitespace-normal h-auto py-3 text-center leading-snug">
              <Link to="/solutions/nhsf">Explore Our Surgical Facility Advisory <ArrowRight className="ml-2 h-5 w-5 shrink-0" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 11 — FINAL CTA */}
      <section className="py-20 lg:py-28 bg-gradient-forest text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">
              Your dental practice is more than a clinical operation. It's a financial asset that deserves professional management.
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="gold" size="xl" asChild>
                <Link to="/strategic-assessment">Start Your Practice Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="xl" className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent" asChild>
                <Link to="/contact">Speak With Our Team</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
