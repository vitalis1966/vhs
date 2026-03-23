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
  Brain,
  Stethoscope,
  TrendingUp,
  Briefcase,
  Monitor,
  MapPin,
  Shield,
  FileText,
  Eye,
  Bone,
  Heart,
  Activity,
  Building2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const heroStats = [
  { value: "Family Medicine to Complex Specialty" },
  { value: "Calgary · Edmonton · Across Canada" },
  { value: "New Builds & Established Practices" },
  { value: "CPSA & AHS Expertise" },
];

const challenges = [
  {
    icon: DollarSign,
    title: "Billing Complexity",
    body: "Medical practices across Canada face billing complexity — in Alberta this runs through AHCIP, shadow billing, WCB, MVA, and uninsured service fee schedules, creating a revenue cycle that is unusually intricate for a private practice. Most medical clinics are under-collecting — often without knowing it.",
  },
  {
    icon: Users,
    title: "Physician Recruitment",
    body: "Canada faces a documented physician shortage — and Alberta is among the most acutely affected provinces, particularly in rural and semi-rural communities. Even Calgary and Edmonton practices struggle to recruit and retain associates who fit their clinical model and compensation structure. The recruitment problem is partly operational — how the practice is structured, what it offers, and how it onboards new physicians.",
  },
  {
    icon: Settings,
    title: "Operational Systems",
    body: "Most medical clinics in Canada were built around a physician's clinical expertise, not an operational blueprint. Scheduling systems, patient flow protocols, staff roles, and administrative workflows are typically informal — functional, but not optimized. When patient volume grows or a physician leaves, those informal systems break.",
  },
  {
    icon: TrendingUp,
    title: "Growth Planning",
    body: "Adding a second physician, a new service line, or a second location requires more than clinical capacity. Financial modeling, space planning, regulatory navigation, and operational redesign are all prerequisites for growth that holds. Practices that grow without this foundation discover the costs faster than the revenue.",
  },
];

const services = [
  { icon: ClipboardList, title: "Strategic Assessment", body: "Independent review across revenue, operations, staffing, growth readiness, compliance.", link: "/strategic-assessment" },
  { icon: Building2, title: "New Practice Planning & Builds", body: "Site selection, financial modeling, facility design input, CPSA compliance planning, EMR selection, operational launch preparation for GPs, specialists, and surgical groups across Canada." },
  { icon: DollarSign, title: "Revenue Cycle & Billing Optimization", body: "AHS claims accuracy, shadow billing structure, uninsured service fee schedules, WCB and MVA billing, denial management. Alberta medical practices consistently leave 10–20% of collectible revenue uncaptured." },
  { icon: Settings, title: "Operations & Workflow Optimization", body: "Patient flow design, scheduling model analysis, appointment mix optimization, staff role alignment, and administrative process redesign." },
  { icon: Users, title: "Physician Recruitment & Retention", body: "Associate physician search strategy, compensation model design, partnership structure, onboarding frameworks, retention planning for practices in Calgary, Edmonton, rural Alberta, and across Canada." },
  { icon: Monitor, title: "Healthcare Technology & EMR", body: "EMR platform evaluation and selection (Med Access, CHR, OSCAR, PS Suite, Wolf), scheduling system review, practice management software, digital workflow optimization." },
  { icon: TrendingUp, title: "Growth Strategy & Expansion", body: "Service line expansion analysis, second location feasibility, multi-physician growth modeling, and operational prerequisites for scaling." },
  { icon: Briefcase, title: "Fractional & Advisory Leadership", body: "On-demand strategic support for practices that need executive-level guidance without a full-time commitment." },
  { icon: Brain, title: "Mergers, Acquisitions & Transitions", body: "Practice valuation, acquisition advisory, partnership restructuring, corporate structure optimization, transition planning." },
];

const practiceTypes = [
  { icon: Stethoscope, title: "Family Medicine & Primary Care", body: "Solo and group GP practices, walk-in clinics, and primary care networks across Calgary, Edmonton, Red Deer, and rural Alberta" },
  { icon: Activity, title: "Internal Medicine", body: "General internists and sub-specialists managing complex chronic disease panels" },
  { icon: Eye, title: "Dermatology", body: "Medical and cosmetic dermatology practices, including CPSA-accredited procedural facilities" },
  { icon: Bone, title: "Orthopedics & Musculoskeletal", body: "Orthopedic surgery practices and musculoskeletal clinics" },
  { icon: Eye, title: "Ophthalmology", body: "Ophthalmology clinics and surgical practices, including cataract and refractive surgery centres" },
  { icon: Activity, title: "Sports Medicine & Rehabilitation", body: "Sports medicine clinics, multidisciplinary rehabilitation, WCB and MVA billing" },
  { icon: Heart, title: "Women's Health & OB/GYN", body: "Obstetrics and gynecology practices, women's health clinics" },
  { icon: Brain, title: "Mental Health & Psychiatry", body: "Psychiatric practices, outpatient mental health clinics, interdisciplinary mental health organizations" },
];

const regulatoryFeatures = [
  { icon: Shield, title: "Alberta Health Care Insurance Plan (AHCIP)", body: "Physician billing in Alberta operates through AHCIP — a fee-for-service schedule that covers insured services. Billing accuracy, modifier usage, and claim submission timing directly affect collection rates. Most practices have at least one systematic billing gap that compounds quietly over time." },
  { icon: FileText, title: "CPSA Registration & Facility Standards", body: "All medical clinics in Alberta must register with CPSA. Facilities performing procedures beyond general practice may require additional CPSA accreditation. Vitalis helps practices understand what registration and compliance they need at their current stage." },
  { icon: DollarSign, title: "Shadow Billing & Uninsured Services", body: "Many Alberta physicians offer both insured (AHCIP) and uninsured services. Structuring these service lines, setting fee schedules, and ensuring billing captures all appropriate revenue is an area where Vitalis consistently identifies significant uncaptured income." },
];

const geoCards = [
  { title: "Calgary", body: "Calgary's medical practice landscape spans established inner-city clinics, rapidly growing suburban communities, and specialized surgical centres. Growth corridors in SE, NE, and NW Calgary present strong opportunities for new medical facilities — particularly family medicine and specialty clinics." },
  { title: "Edmonton & Northern Alberta", body: "Edmonton supports a strong medical practice market anchored by proximity to Alberta's largest hospitals and research institutions. Northern Alberta communities face significant physician shortages, creating opportunities for practices willing to serve underserved populations." },
  { title: "Rural Alberta & Across Canada", body: "Rural Alberta practices face unique challenges including physician recruitment, limited specialist access, and distance-related operational constraints. Vitalis also works with medical practices in BC, Saskatchewan, Manitoba, and Ontario." },
];

const processSteps = [
  { num: "01", title: "Assessment", body: "Independent strategic review of your practice." },
  { num: "02", title: "Strategic Plan", body: "Custom roadmap built on findings." },
  { num: "03", title: "Implementation", body: "Hands-on execution alongside your team." },
  { num: "04", title: "Ongoing Advisory", body: "Continuous improvement and support." },
];

const caseStudies = [
  { tag: "Revenue Cycle · Calgary", headline: "28% improvement in net collections", body: "Multi-physician primary care clinic. AHS billing gaps and uncaptured uninsured service revenue. 28% net collections improvement without adding patients." },
  { tag: "New Build · Edmonton", headline: "Specialist clinic opened on schedule and within budget", body: "Multi-physician clinic, feasibility through opening day within 14-month window." },
  { tag: "Operations · Alberta", headline: "Scheduling redesign recovered 22% of unused OR time", body: "Surgical practice operational assessment. Scheduling redesign recovered 22% unused procedure time within 60 days." },
];

const newPracticeServices = [
  "Practice feasibility analysis and Alberta market positioning",
  "Financial modeling: startup costs, operating expenses, break-even timeline",
  "Site selection and lease negotiation support",
  "CPSA facility registration and compliance planning",
  "EMR and practice technology selection",
  "Billing structure setup: AHS, shadow billing, uninsured services",
  "Staff recruitment and onboarding framework design",
];

const existingDimensions = [
  "AHS billing accuracy and claim performance",
  "Uninsured and third-party billing completeness",
  "Scheduling utilization and patient throughput",
  "Physician and staff productivity ratios",
  "CPSA compliance posture review",
  "Growth opportunity analysis",
];

export default function Medical() {
  usePageMeta(
    "Medical Clinic Consulting Canada | Calgary, Edmonton & Nationwide | Vitalis Health Strategies",
    "Vitalis Health Strategies provides end-to-end consulting for medical clinics across Canada — with deep focus on Calgary, Edmonton, and Alberta. New builds, revenue cycle, operations, recruitment, technology, and M&A advisory."
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
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">Medical Practices</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight tracking-tight max-w-4xl mx-auto">
              Full-cycle strategic consulting for medical clinics and practices — from your first facility to your most complex operational challenge.
            </h1>
            <p className="mt-6 text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Vitalis works with family physicians, specialists, surgical groups, and multi-physician organizations across Calgary, Edmonton, and Canada. Opening a new clinic, navigating a billing problem, trying to grow, or preparing for a major transition — we have the operational and strategic experience to help.
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

      {/* CHALLENGES */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              The challenges medical practice owners face across Canada — and what actually causes them.
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((c, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-card p-8 shadow-card">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <c.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{c.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">What Vitalis does for medical practices.</h2>
            <p className="mt-4 text-muted-foreground text-lg">Every service below is available as a standalone engagement or as part of a broader advisory relationship.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl bg-card p-6 shadow-card hover:shadow-elevated transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6 text-primary" />
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
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Where are you in your practice's lifecycle?</h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}
              className="rounded-2xl bg-card border border-border/50 p-8 lg:p-10 flex flex-col">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent bg-accent/10 px-3 py-1 rounded-full w-fit mb-4">Opening a New Practice</span>
              <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-4">Get the foundation right. It's harder to fix once you've opened.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Opening a medical clinic or specialist practice in Alberta involves CPSA registration, facility compliance, billing setup, technology selection, staffing, and a financial model — all before you see your first patient. Vitalis works with physicians from the earliest planning stages to opening day.
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
              <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-4">Running well and running at your potential are not the same thing.</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Established medical practices in Alberta typically have significant recoverable revenue and operational efficiency sitting untouched. A structured performance assessment gives you the objective picture your internal view cannot provide.
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
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Medical practices across Canada.</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceTypes.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl bg-card p-6 text-center shadow-soft hover:shadow-card transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <p.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{p.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{p.body}</p>
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
            Vitalis also works with medical practices in British Columbia (under CPSBC registration), Ontario (CPSO), Saskatchewan, and Manitoba — applying the same structured approach to each province's specific billing, regulatory, and market environment.
          </motion.p>
        </div>
      </section>

      {/* GEOGRAPHY */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Medical practices across Calgary, Edmonton, and Canada.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {geoCards.map((g, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl bg-card p-6 shadow-card">
                <MapPin className="h-6 w-6 text-accent mb-3" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{g.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{g.body}</p>
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
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Planning a surgical facility or procedural centre?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If your practice involves surgical or procedural services that would qualify as a Non-Hospital Surgical Facility under CPSA accreditation, Vitalis provides dedicated advisory for that pathway. NHSF builds and accreditation preparation involve a separate regulatory and financial framework from standard medical clinic development.
              </p>
            </div>
            <Button variant="hero" size="lg" className="flex-shrink-0" asChild>
              <Link to="/solutions/nhsf">Explore Our NHSF & Surgical Facility Advisory <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">What working with Vitalis looks like.</h2>
          </motion.div>
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-0">
            <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-border" />
            <div className="lg:hidden absolute top-0 bottom-0 left-6 w-0.5 bg-border" />
            {processSteps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex lg:flex-col items-center lg:items-center text-center lg:w-1/4 gap-4 lg:gap-0 pl-12 lg:pl-0">
                <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary font-bold text-sm z-10 flex-shrink-0 absolute left-0 lg:relative lg:left-auto">
                  {s.num}
                </div>
                <div className="lg:mt-4">
                  <h3 className="font-display text-base font-bold text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground text-xs mt-1">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-4">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Medical practice engagements — a sample.</h2>
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
              Your medical practice is a clinical asset and a business. It deserves strategy that treats it as both.
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
