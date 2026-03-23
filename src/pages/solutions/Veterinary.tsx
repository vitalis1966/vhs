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
  CircleDollarSign,
  Users,
  Settings,
  TrendingUp,
  Monitor,
  MapPin,
  Building2,
  PawPrint,
  Heart,
  Stethoscope,
  Activity,
  Briefcase,
  Handshake,
  UserPlus,
  ShieldCheck,
  Search,
  ArrowLeftRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const heroStats = [
  { stat: "Small Animal · Mixed · Specialty", context: "Companion, mixed, and specialist practices" },
  { stat: "New Builds & Established Practices", context: "Every stage of your practice's lifecycle" },
  { stat: "Alberta & Western Canada", context: "Alberta-focused with national reach" },
  { stat: "ABVMA & CVBC Expertise", context: "Regulatory context built in" },
];

const challenges = [
  {
    icon: Building2,
    title: "Corporate Consolidation Is Reshaping the Market",
    body: "National consolidators — VCA, BluePearl, National Veterinary Associates — are actively acquiring independent practices across Alberta and BC. Independent owners who don't understand their practice's current valuation are entering these conversations unprepared.",
  },
  {
    icon: CircleDollarSign,
    title: "Revenue Is More Complex Than the Invoice",
    body: "Veterinary revenue spans pet insurance, wellness plans, service bundles, specialist referral fees, and pharmacy — each requiring deliberate systems to capture. Most independent practices collect what they invoice without optimizing what or how they invoice.",
  },
  {
    icon: UserPlus,
    title: "Veterinarian Shortage Is Real and Structural",
    body: "Canada has a well-documented shortage of veterinarians, particularly in rural and mixed-practice settings. Retention, compensation structure, and workplace culture are now practice management issues, not just HR issues.",
  },
  {
    icon: TrendingUp,
    title: "Operational Growth Without Structure Breaks the Practice",
    body: "The jump from solo to multi-veterinarian clinic involves management, scheduling, compensation, and quality systems that weren't needed at smaller scale. Most practices attempt this organically — and discover the problems only after they've accumulated.",
  },
];

const services = [
  { icon: ClipboardList, title: "Strategic Assessment", body: "Independent review across revenue, operations, staffing, technology, growth readiness, and competitive positioning." },
  { icon: Building2, title: "New Clinic Builds", body: "Feasibility analysis, financial modeling, site selection, ABVMA facility classification planning, practice management software, and associate recruitment." },
  { icon: CircleDollarSign, title: "Revenue Optimization", body: "Revenue per visit, wellness plan adoption, invoice accuracy, pharmaceutical pricing, and referral fees — reviewed across every stream." },
  { icon: Settings, title: "Operations & Workflow", body: "Scheduling, exam room utilization, patient flow, and technician role design — built to run efficiently as the practice grows." },
  { icon: Users, title: "Associate Recruitment", body: "Finding, compensating, and retaining the right veterinarians and RVTs — from search strategy through partnership structure." },
  { icon: Monitor, title: "Practice Technology", body: "Practice management software selection (ezyVet, Cornerstone, AVImark, Provet Cloud), imaging integration, inventory management, and client communication." },
  { icon: TrendingUp, title: "Growth & Expansion", body: "Second locations and multi-site growth — analyzed demographically, modeled financially, and built operationally." },
  { icon: Handshake, title: "M&A & Transitions", body: "Practice valuation, corporate acquisition advisory, associate buy-in structuring, partnership buyout planning, and transition preparation." },
];

const keyNumbers = [
  { stat: "$500K – $1.5M", label: "Typical New Clinic Capital Requirement", context: "Before opening day, depending on service scope, equipment specification, and facility size. Emergency and specialty facilities are considerably higher." },
  { stat: "8% → 31%", label: "Wellness Plan Adoption Improvement", context: "Achieved by a Vitalis client through restructured offering and front-desk protocols — within six months of engagement." },
  { stat: "40%", label: "EBITDA Improvement", context: "Delivered through a 12-month operational improvement program for a practice owner who had received a corporate acquisition approach." },
];

const acquisitionPoints = [
  { icon: Search, title: "Know Your Practice Value Before They Do", body: "Corporate buyers use EBITDA multiples to value veterinary practices. Understanding your current valuation — and what would improve it — before a buyer approaches changes the conversation entirely." },
  { icon: ShieldCheck, title: "Build Operational Strength Regardless", body: "Practices with strong revenue systems, clean documentation, and structured staffing command higher multiples — whether you intend to sell or not." },
  { icon: Users, title: "Your Team Is Your Asset", body: "Associate retention and culture are central to practice value. Compensation structures that retain your team protect the asset — and the patients." },
  { icon: ArrowLeftRight, title: "You Have More Options Than a Full Sale", body: "Associate buy-ins, partial sales, management service arrangements, and partnership structures are all alternatives. Vitalis helps you understand the financial implications of each." },
];

const caseStudies = [
  { tag: "NEW BUILD · CALGARY", headline: "7-exam-room companion animal clinic opened within budget", body: "Veterinarian transitioning from associate to ownership. Site selection, financial modeling, buildout coordination. Opened within 16 months and within 4% of budget." },
  { tag: "REVENUE · ALBERTA", headline: "Wellness plan adoption increased from 8% to 31%", body: "Restructuring wellness plan offering and front-desk presentation protocols resulted in adoption increasing from 8% to 31% within six months." },
  { tag: "ACQUISITION ADVISORY · WESTERN CANADA", headline: "Independent practice retained; valuation increased 40%", body: "Practice owner approached by corporate acquirer engaged Vitalis. 12-month operational improvement program increased EBITDA by 40%." },
];

const practiceTypes = [
  { icon: PawPrint, title: "Companion Animal General Practice", body: "Solo and group small animal practices across Canada" },
  { icon: Heart, title: "Mixed Practice — Large & Small Animal", body: "Rural and semi-rural Alberta serving companion animals and livestock" },
  { icon: Activity, title: "Emergency & Critical Care", body: "24-hour emergency facilities with surgical capability" },
  { icon: Stethoscope, title: "Specialty & Referral Practices", body: "Internal medicine, oncology, cardiology, ophthalmology, and surgical specialists" },
  { icon: Building2, title: "Multi-Location Veterinary Groups", body: "Independent organizations with multiple locations navigating scale" },
  { icon: Briefcase, title: "Corporate-Track & Acquisition-Ready", body: "Practices preparing for or evaluating acquisition approaches" },
];

const geoCards = [
  { title: "Calgary", body: "Calgary's high pet ownership rate and strong household income create above-average veterinary spending. Growth corridors in SE, SW, and NW Calgary have underpenetrated veterinary supply relative to companion animal population density." },
  { title: "Edmonton & Northern Alberta", body: "Edmonton's veterinary market is supported by large suburban communities and proximity to agricultural regions with mixed-practice demand. South Edmonton, Sherwood Park, and St. Albert remain strong companion animal markets." },
  { title: "Alberta & Western Canada", body: "Vitalis also works with veterinary practices in BC (CVBC), Saskatchewan (SVMA), Manitoba (MVMA), and Ontario (CVO) — with understanding of the specific regulatory and market context of each province." },
];

const newPracticeServices = [
  "Veterinary practice feasibility and market analysis",
  "Financial modeling: equipment, buildout, staffing, startup losses, break-even",
  "Facility planning: surgical suite, isolation ward, imaging, kennel",
  "ABVMA facility classification and standards compliance",
  "Site selection for Calgary, Edmonton, and regional Alberta",
  "Practice management software selection and setup",
  "Associate veterinarian recruitment strategy",
];

const existingDimensions = [
  "Revenue per client visit and average invoice benchmarks",
  "Wellness plan structure, pricing, and client adoption rates",
  "Scheduling utilization by appointment type and veterinarian",
  "RVT and assistant-to-revenue ratios",
  "Inventory and pharmaceutical cost controls",
  "Associate productivity and compensation alignment",
  "Valuation positioning",
];

export default function Veterinary() {
  usePageMeta(
    "Veterinary Practice Consulting Canada | Calgary, Edmonton & Nationwide | Vitalis Health Strategies",
    "Vitalis Health Strategies provides comprehensive consulting for veterinary practices across Canada — with deep focus on Calgary, Edmonton, and Alberta. New clinic builds, practice optimization, revenue, staffing, technology, expansion, and M&A advisory."
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* SECTION 1 — HERO */}
      <section className="relative bg-gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-6xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Veterinary Practices</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight max-w-4xl">
              Full-cycle strategic consulting for veterinary practices — from your first clinic to your eventual exit.
            </h1>
            <p className="mt-6 text-muted-foreground text-lg max-w-3xl leading-relaxed">
              Vitalis works with companion animal practices, mixed practices, specialty clinics, and emergency facilities across Calgary, Edmonton, and western Canada. The same operational and financial expertise we bring to human healthcare practices — applied to the distinct realities of veterinary medicine.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="mt-8 flex flex-wrap gap-3">
            {heroStats.map((s, i) => (
              <div key={i} className="rounded-full bg-background/60 backdrop-blur-sm border border-border/50 px-4 py-2">
                <p className="text-sm font-medium text-foreground">{s}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.25 }} className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment">Start Your Practice Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/contact">Speak With Our Team</Link>
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
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent bg-accent/10 px-3 py-1 rounded-full w-fit mb-4">Opening a New Practice</span>
              <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-4">The financial and operational decisions made before opening day determine the ceiling of your practice for years.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                A new small animal clinic in Calgary or Edmonton typically requires $500,000 to $1.5M in capital before opening, depending on service scope and equipment specification. Emergency and specialty facilities are considerably higher. Understanding exactly what you are building, what it will cost, and what revenue model will support it — before you commit — is what separates a strong launch from a financial strain.
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
              className="rounded-2xl bg-card border-2 border-border p-8 lg:p-10 flex flex-col shadow-elevated">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent bg-accent/10 px-3 py-1 rounded-full w-fit mb-4">Optimizing an Established Practice</span>
              <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-4">Strong clinical reputation and strong financial performance are not the same thing. Both are achievable.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Revenue per visit, wellness plan penetration, scheduling utilization, associate productivity, and inventory cost control are the operational metrics that determine whether a veterinary practice is capturing its potential — or leaving it behind. Most practice owners know one or two of these numbers. Very few have a complete, independent view of all of them.
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

      {/* SECTION 3 — CHALLENGES (dark band) */}
      <section className="py-16 lg:py-24 bg-forest">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">The Challenges</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight">What veterinary practice owners across Canada are navigating right now.</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-primary-foreground/95 p-8">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{c.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — SERVICES */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Our Services</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">What Vitalis does for veterinary practices.</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-3xl mx-auto">The full range of advisory services — each one framed for the specific realities of veterinary medicine.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl bg-card p-6 shadow-card hover:shadow-elevated transition-shadow duration-300">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — MID-PAGE CTA */}
      <section className="py-16 lg:py-20 bg-sage-light">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <p className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-snug tracking-tight">
              "Independent veterinary practices are being acquired at a rate the market has never seen before. The ones that thrive — whether they sell or not — are built on strong operational and financial foundations."
            </p>
            <p className="mt-4 text-muted-foreground">An independent assessment tells you where you stand.</p>
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
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Understanding the numbers behind a veterinary practice.</h2>
            <p className="mt-3 text-muted-foreground text-sm">Illustrative figures only. Individual results vary significantly.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {keyNumbers.map((n, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-border p-8 shadow-card text-center">
                <p className="font-display text-3xl lg:text-4xl font-bold text-accent mb-2">{n.stat}</p>
                <p className="font-display text-base font-semibold text-foreground mb-3">{n.label}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{n.context}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — CORPORATE ACQUISITION (dark sage band) */}
      <section className="py-16 lg:py-24 bg-forest-light">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">The Acquisition Wave</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight">The corporate acquisition wave — what independent veterinary practice owners need to know.</h2>
          </motion.div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-primary-foreground/80 text-base mb-12 max-w-3xl mx-auto leading-relaxed">
            Corporate veterinary consolidators have acquired a significant share of independent practices across Canada over the past decade. For independent owners, this creates both risk and opportunity — depending on how your practice is positioned.
          </motion.p>
          <div className="grid sm:grid-cols-2 gap-6">
            {acquisitionPoints.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 p-8">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center mb-4">
                  <p.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-primary-foreground mb-3">{p.title}</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.4 }} className="mt-10 text-center">
            <Button variant="gold" size="lg" asChild>
              <Link to="/contact">Speak With Our M&A Team <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 8 — PROOF */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Veterinary Practice Engagements</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">A sample of what we've delivered.</h2>
            <p className="mt-3 text-muted-foreground text-sm">Client details withheld.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-card border-2 border-border p-8 shadow-elevated">
                <span className="inline-block text-xs font-semibold tracking-wider uppercase text-accent mb-4">{c.tag}</span>
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{c.headline}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — SPECIALTIES */}
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Veterinary Specialties</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Veterinary practices we work with.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {practiceTypes.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{p.title}</h3>
                  <p className="text-muted-foreground text-sm">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — GEOGRAPHY */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Where We Work</span>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10">
            {geoCards.map((g, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <MapPin className="h-6 w-6 text-accent mb-3" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{g.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{g.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11 — NHSF CALLOUT */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
            className="rounded-2xl bg-forest p-8 lg:p-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Surgical Facilities</span>
            </div>
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground mb-4">Planning a veterinary surgical or specialty facility?</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-3xl mx-auto mb-8">
              Veterinary surgical facilities, specialty referral centres, and emergency facilities with surgical capability involve distinct planning, ABVMA classification requirements, equipment specification, and financial modeling compared to general companion animal practice. Vitalis provides dedicated advisory for veterinary surgical facility development.
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link to="/solutions/nhsf">Explore Our Surgical Facility Advisory <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 12 — FINAL CTA */}
      <section className="py-20 lg:py-28 bg-forest">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground tracking-tight">
              You built your practice around clinical excellence. Vitalis helps you build the business infrastructure that makes it sustainable.
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
