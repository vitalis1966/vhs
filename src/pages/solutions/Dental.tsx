import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle,
  ClipboardList,
  DollarSign,
  Users,
  Settings,
  TrendingUp,
  Briefcase,
  Monitor,
  MapPin,
  Shield,
  FileText,
  Building2,
  Brain,
  Smile,
  Baby,
  Scissors,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const heroStats = [
  { value: "General & Specialty Dentistry" },
  { value: "Calgary & Edmonton Markets" },
  { value: "Solo Practices to Multi-Location Groups" },
  { value: "ADA+C & Provincial Expertise" },
];

const challenges = [
  { stat: "8–15%", label: "Fee Collection Gaps Are Systematic", body: "Dental practices across Canada routinely under-collect — and in Alberta this runs across Alberta Blue Cross, Sun Life, Manulife, and other carriers whose claim requirements each differ. Vitalis assessments consistently identify 8–15% of collectable revenue not being captured." },
  { stat: "Rising", label: "Corporate Consolidation Is Accelerating", body: "DSOs and corporate dental groups are acquiring independent practices across Canada — Alberta, BC, and Ontario have seen the most active acquisition activity. Independent dentists who don't understand what drives their practice's valuation are negotiating from a position of incomplete information." },
  { stat: "Plan First", label: "Growth Without a Plan Costs More Than It Earns", body: "Adding an operatory, an associate, or a second location without proper financial modeling and operational preparation is one of the most common ways dental practices create financial strain. Each expansion decision has infrastructure, staffing, and cash flow implications that must be modeled before commitment." },
  { stat: "Competitive", label: "Associate Recruitment Is a Market Problem", body: "Alberta's dental associate market has become competitive. New dental graduates have more options than previous generations. Independent practices that cannot clearly articulate their value proposition and compensation structure lose recruiting competitions they could have won." },
];

const services = [
  { icon: ClipboardList, title: "Strategic Assessment", body: "Independent review across revenue collection, scheduling utilization, overhead ratios, staffing structure, technology, and growth readiness.", link: "/strategic-assessment" },
  { icon: Building2, title: "New Dental Office Planning & Builds", body: "Financial modeling for buildout and equipment costs, site selection in Calgary and Edmonton growth corridors, dental-specific facility planning (operatory count, sterilization, X-ray, plumbing), ADA+C compliance, practice management software setup." },
  { icon: DollarSign, title: "Billing & Fee Collection Optimization", body: "Alberta Blue Cross claim accuracy, ADA suggested fee guide alignment, coordination of benefits review, predetermination process optimization, and patient billing protocol review." },
  { icon: Settings, title: "Operations & Scheduling Optimization", body: "Operatory utilization analysis, hygiene chair productivity, appointment mix review, scheduling model redesign, and patient flow improvement." },
  { icon: Users, title: "Associate Recruitment & Compensation", body: "Associate dentist search strategy, compensation model design (production splits, guaranteed minimums), partnership track structuring, and onboarding framework." },
  { icon: Monitor, title: "Practice Technology & Software", body: "Practice management software evaluation and selection (Dentrix, Eaglesoft, Tracker, ABELDent, Curve), digital X-ray integration, patient communication systems, online booking setup." },
  { icon: TrendingUp, title: "Growth Strategy & Multi-Location Planning", body: "Second location feasibility, demographic analysis for Calgary and Edmonton expansion corridors, financial modeling for multi-site operations, and the operational infrastructure required for expansion." },
  { icon: Briefcase, title: "Fractional & Advisory Leadership", body: "On-demand executive guidance for dental practices navigating expansion, partner transitions, or corporate restructuring." },
  { icon: Brain, title: "Mergers, Acquisitions & Transitions", body: "Dental practice valuation, acquisition advisory, DSO negotiation support, partner buyout structuring, associate buy-in planning." },
];

const practiceTypes = [
  { icon: Smile, title: "General Family Dentistry", body: "Solo and group family dental practices in Calgary, Edmonton, Red Deer, Lethbridge, and across Canada — the largest segment of the Canadian dental market" },
  { icon: Scissors, title: "Oral Surgery & OMS", body: "Oral maxillofacial surgery practices with surgical and sedation capabilities" },
  { icon: Baby, title: "Pediatric Dentistry", body: "Pediatric dental practices with specialized facility design, staffing, and patient experience requirements" },
  { icon: Building2, title: "Multi-Location Dental Groups", body: "Two-to-ten location dental organizations navigating operational, financial, and quality control complexity" },
  { icon: Settings, title: "Orthodontics & Specialty Dental", body: "Orthodontic, endodontic, periodontic, and prosthodontic specialty practices" },
  { icon: Briefcase, title: "Dental Corporations & DSO-Track", body: "Dental organizations positioning for corporate structure, investor entry, or acquisition" },
];

const regulatoryFeatures = [
  { icon: Shield, title: "Alberta Dental Association and College (ADA+C)", body: "Regulates dental practice in Alberta, setting standards for facility, equipment, and professional conduct. Vitalis helps practices understand the operational implications of ADA+C requirements — particularly for multi-location and corporate dental structures." },
  { icon: DollarSign, title: "Alberta Blue Cross & the Fee Guide", body: "Alberta dental practices bill primarily through insurance carriers. The ADA suggested fee guide is the baseline for insurance reimbursement. Understanding when and how to price above guide — and ensuring claim submission is accurate and complete — is one of the most direct revenue levers in dental practice management." },
  { icon: MapPin, title: "Calgary & Edmonton Real Estate", body: "Calgary and Edmonton commercial dental space costs have increased significantly. Medical-dental building developments in Calgary's newer communities represent significant new-build opportunities. Edmonton's south side and Sherwood Park corridor continue to show strong dental practice demographics." },
];

const financialStats = [
  { value: "$600K – $1.2M", label: "Typical new dental office buildout", detail: "Varies by operatory count, location, leasehold improvement requirements, and equipment specification." },
  { value: "8 – 15%", label: "Typical fee collection gap", detail: "Across insurance billing errors, missed pre-authorizations, and outdated fee schedules." },
  { value: "18 – 24 months", label: "Typical break-even timeline", detail: "For a new 6-operatory Calgary dental practice. Influenced by startup patient volume, hygiene utilization, associate productivity, and overhead structure." },
];

const caseStudies = [
  { tag: "New Build · Calgary SE", headline: "8-operatory practice opened within timeline", body: "Dentist moving from associate to ownership. Vitalis provided site selection, financial modeling, and buildout coordination. Opened within 14 months." },
  { tag: "Revenue · Edmonton", headline: "12% fee collection improvement within 60 days", body: "Billing workflow and fee schedule changes after revenue assessment resulted in 12% net collection improvement within 60 days." },
  { tag: "Multi-Site · Alberta", headline: "Expansion from 2 to 4 locations — structured for scale", body: "Dental group with two Calgary locations. Vitalis planned expansion including financial modeling, site criteria, and practice management system migration." },
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

      {/* HERO */}
      <section className="relative bg-gradient-hero pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-6xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Dental Practices</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight max-w-4xl mx-auto">
              Full-cycle consulting for dental practices — from your first office to a multi-location group.
            </h1>
            <p className="mt-6 text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Vitalis works with general dentists, specialists, and dental organizations across Calgary, Edmonton, and Canada. We bring operational expertise and structured strategy to every stage of dental practice development — new builds, performance optimization, growth planning, technology, and ownership transitions.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {heroStats.map((s, i) => (
              <div key={i} className="rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 p-4 text-center">
                <p className="text-sm font-medium text-foreground">{s.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.25 }} className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment">Start Your Strategic Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/contact">Speak With Our Team</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CHALLENGES — Stat Callout Cards */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              The real challenges facing dental practices across Canada right now.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {challenges.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-card p-8 shadow-card flex flex-col items-start">
                <span className="font-display text-4xl lg:text-5xl font-bold text-accent mb-4">{c.stat}</span>
                <h3 className="font-display text-base font-bold text-foreground mb-3">{c.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">What Vitalis does for dental practices.</h2>
            <p className="mt-4 text-muted-foreground text-lg">Every service below is available as part of a full engagement or as a focused standalone advisory.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl bg-card p-6 shadow-sm hover:shadow-card transition-shadow duration-300">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                {s.link && (
                  <Link to={s.link} className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO PATHS */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Where does your practice sit right now?</h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
              className="rounded-2xl bg-card border border-border/50 p-8 lg:p-10 flex flex-col">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent bg-accent/10 px-3 py-1 rounded-full w-fit mb-4">Opening a New Practice</span>
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
              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/strategic-assessment">Start Your Build Strategy Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl bg-card border border-border/50 p-8 lg:p-10 flex flex-col">
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
              <Button variant="hero" size="lg" className="w-full" asChild>
                <Link to="/strategic-assessment">Start Your Performance Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRACTICE TYPES */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Dental practices we work with — from Calgary and Edmonton to Vancouver, Toronto, and beyond.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceTypes.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl bg-card p-6 shadow-soft hover:shadow-card transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground mb-1">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REGULATORY */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Billing and regulatory context — Alberta, BC, Ontario, and across Canada.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {regulatoryFeatures.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
                  <f.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center text-muted-foreground text-sm italic max-w-3xl mx-auto">
            In BC, the College of Dental Surgeons of BC (CDSBC) and the BC Dental Fee Guide apply. In Ontario, the Royal College of Dental Surgeons of Ontario (RCDSO) governs practice standards. Vitalis brings regulatory awareness across all major provincial frameworks.
          </motion.p>
        </div>
      </section>

      {/* FINANCIAL SNAPSHOT */}
      <section className="py-20 lg:py-28 bg-accent/5">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-4">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Understanding the numbers behind a dental practice.</h2>
          </motion.div>
          <p className="text-center text-muted-foreground text-xs mb-16">Illustrative figures only. Individual results vary significantly.</p>
          <div className="grid md:grid-cols-3 gap-12">
            {financialStats.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }} className="text-center">
                <p className="font-display text-4xl lg:text-5xl font-bold text-accent">{s.value}</p>
                <p className="mt-3 text-sm font-semibold text-foreground uppercase tracking-wider">{s.label}</p>
                <p className="mt-2 text-muted-foreground text-xs leading-relaxed">{s.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NHSF CALLOUT */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="rounded-2xl bg-primary/5 border border-primary/20 p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-grow">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Operating a dental surgical facility or planning one?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Oral maxillofacial surgery facilities, dental surgical centres, and practices offering general anesthesia or deep sedation require CPSA NHSF accreditation. Vitalis provides dedicated advisory for dental surgical facility builds and compliance preparation.
              </p>
            </div>
            <Button variant="hero" size="lg" className="flex-shrink-0" asChild>
              <Link to="/solutions/nhsf">Explore Our Surgical Facility Advisory <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-4">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Dental practice engagements — a sample.</h2>
          </motion.div>
          <p className="text-center text-muted-foreground text-sm mb-12">Client details withheld.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-border/50 p-6 shadow-card">
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-accent mb-3">{c.tag}</span>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{c.headline}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 lg:py-28 bg-gradient-forest text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">
              Your dental practice is more than a clinical operation. It's a financial asset that deserves professional management.
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="gold" size="xl" asChild>
                <Link to="/strategic-assessment">Start Your Strategic Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
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
