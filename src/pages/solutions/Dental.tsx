import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/seo";
import {
  ClipboardList, Building2, DollarSign, Settings, Users, Laptop, BarChart2,
  Activity, TrendingUp, ArrowRight, Shield, MapPin, Smile, Scissors, Baby,
  Zap, CheckCircle
} from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const stats = [
  { label: "General & Specialty Dentistry", desc: "Family dental, orthodontics, oral surgery, endodontics, periodontics, and pediatric dental" },
  { label: "Calgary & Edmonton Markets", desc: "Deep familiarity with Alberta's dental real estate, demographics, and fee landscape" },
  { label: "Solo Practices to Multi-Location Groups", desc: "From first-time owners to dental corporations managing multiple sites" },
  { label: "ADA+C & Alberta Fee Guide", desc: "Alberta-specific regulatory and billing expertise" },
];

const problems = [
  { icon: DollarSign, heading: "Fee Collection Gaps Are Systematic", body: "Alberta dental practices routinely under-collect across insurance claims, pre-authorization processes, and patient billing. Alberta Blue Cross, Sun Life, Manulife, and other carriers each have different claim requirements — and most practices have billing gaps across at least two of them. Vitalis assessments consistently identify 8–15% of collectable revenue not being captured." },
  { icon: Building2, heading: "Corporate Consolidation Is Accelerating", body: "DSOs and corporate dental groups are acquiring independent practices across Alberta with increasing speed. Independent dentists who don't understand what drives their practice's valuation — or what would increase it — are negotiating from a position of incomplete information. Whether you plan to sell or stay independent, knowing your practice's financial position matters." },
  { icon: TrendingUp, heading: "Growth Without a Plan Costs More Than It Earns", body: "Adding an operatory, an associate, or a second location without proper financial modeling and operational preparation is one of the most common ways dental practices create financial strain. Each expansion decision has infrastructure, staffing, and cash flow implications that must be modeled before commitment." },
  { icon: Users, heading: "Associate Recruitment Is a Market Problem", body: "Alberta's dental associate market has become competitive. New dental graduates have more options than previous generations — including associate positions in corporate groups with guaranteed pay. Independent practices that cannot clearly articulate their value proposition and compensation structure lose recruiting competitions they could have won." },
];

const services = [
  { icon: ClipboardList, label: "Strategic Assessment", desc: "An independent review of your dental practice across revenue collection, scheduling utilization, overhead ratios, staffing structure, technology, and growth readiness. The clearest picture of your practice you will get without internal bias.", link: "/strategic-assessment" },
  { icon: Building2, label: "New Dental Office Planning & Builds", desc: "Financial modeling for buildout and equipment costs, site selection in Calgary and Edmonton growth corridors, dental-specific facility planning (operatory count, sterilization, X-ray, plumbing), ADA+C compliance, and practice management software setup — before you sign a lease." },
  { icon: DollarSign, label: "Billing & Fee Collection Optimization", desc: "Alberta Blue Cross claim accuracy, ADA suggested fee guide alignment, coordination of benefits review, predetermination process optimization, and patient billing protocol review. Recoverable revenue identified and collected." },
  { icon: Settings, label: "Operations & Scheduling Optimization", desc: "Operatory utilization analysis, hygiene chair productivity, appointment mix review, scheduling model redesign, and patient flow improvement — the operational levers that most directly determine dental practice profitability." },
  { icon: Users, label: "Associate Recruitment & Compensation", desc: "Associate dentist search strategy, compensation model design (associate pay, production splits, guaranteed minimums), partnership track structuring, and onboarding framework — for practices adding capacity." },
  { icon: Laptop, label: "Practice Technology & Software", desc: "Practice management software evaluation and selection (Dentrix, Eaglesoft, Tracker, ABELDent, Curve), digital X-ray and imaging integration, patient communication systems, and online booking setup." },
  { icon: BarChart2, label: "Growth Strategy & Multi-Location Planning", desc: "Second location feasibility, demographic analysis for Calgary and Edmonton expansion corridors, financial modeling for multi-site operations, and the operational infrastructure required to maintain quality and profitability across locations." },
  { icon: Activity, label: "Fractional & Advisory Leadership", desc: "On-demand executive guidance for dental practices navigating expansion, partner transitions, corporate restructuring, or operational complexity that exceeds what the current leadership model can address." },
  { icon: TrendingUp, label: "Mergers, Acquisitions & Transitions", desc: "Dental practice valuation, acquisition advisory, DSO negotiation support, partner buyout structuring, associate buy-in planning, and transition preparation — for dental practice owners considering any change in ownership." },
];

const practiceTypes = [
  { icon: Smile, label: "General Family Dentistry", desc: "Solo and group family dental practices in Calgary, Edmonton, Red Deer, Lethbridge, and across Alberta — the largest segment of the Canadian dental market and the most active for both new builds and corporate acquisition" },
  { icon: Scissors, label: "Oral Surgery & OMS", desc: "Oral maxillofacial surgery practices with surgical and sedation capabilities — including practices considering CPSA-accredited surgical facility development for publicly funded OMS procedures" },
  { icon: Baby, label: "Pediatric Dentistry", desc: "Pediatric dental practices with specialized facility design, staffing, and patient experience requirements distinct from general dental" },
  { icon: Building2, label: "Multi-Location Dental Groups", desc: "Two-to-ten location dental organizations navigating the operational, financial, and quality control complexity that comes with scale — including practice management system migrations and multi-site financial visibility" },
  { icon: Zap, label: "Orthodontics & Specialty Dental", desc: "Orthodontic, endodontic, periodontic, and prosthodontic specialty practices with distinct patient flow, fee structures, and referral relationship management requirements" },
  { icon: TrendingUp, label: "Dental Corporations & DSO-Track Practices", desc: "Dental organizations positioning for corporate structure, investor entry, or acquisition — including EBITDA improvement programs, valuation readiness, and deal structure advisory" },
];

const regulatoryFeatures = [
  { icon: Shield, heading: "Alberta Dental Association and College (ADA+C)", body: "The ADA+C regulates dental practice in Alberta, setting standards for facility, equipment, and professional conduct. Vitalis helps practices understand the operational implications of ADA+C requirements — particularly for multi-location and corporate dental structures where compliance complexity increases with scale." },
  { icon: DollarSign, heading: "Alberta Blue Cross & the Fee Guide", body: "Alberta dental practices bill primarily through insurance carriers — Alberta Blue Cross, Sun Life, Manulife, and others. The ADA suggested fee guide is the baseline for insurance reimbursement. Understanding when and how to price above guide — and ensuring claim submission is accurate and complete — is one of the most direct revenue levers in dental practice management." },
  { icon: Building2, heading: "Calgary & Edmonton Real Estate", body: "Calgary and Edmonton commercial dental space costs have increased significantly. Medical-dental building developments in Calgary's newer communities — Seton, Mahogany, Legacy, and others — represent significant new-build opportunities. Edmonton's south side and Sherwood Park corridor continue to show strong dental practice demographics. Vitalis understands this landscape." },
];

const financialStats = [
  { value: "$600K – $1.2M", label: "Typical new dental office buildout in Calgary or Edmonton", note: "Varies by operatory count, location, leasehold improvement requirements, and equipment specification." },
  { value: "8 – 15%", label: "Typical fee collection gap identified in dental practice assessments", note: "Across insurance billing errors, missed pre-authorizations, and outdated fee schedules." },
  { value: "18 – 24 months", label: "Typical break-even for a new 6-operatory Calgary dental practice", note: "Influenced by startup patient volume, hygiene utilization, associate productivity, and overhead structure." },
];

const cases = [
  { tag: "New Build · Calgary SE", headline: "8-operatory practice opened within timeline", body: "A dentist moving from associate to ownership engaged Vitalis for site selection, financial modeling, and buildout coordination. Opened within 14 months." },
  { tag: "Revenue · Edmonton", headline: "12% fee collection improvement within 60 days", body: "Billing workflow and fee schedule changes after a revenue assessment resulted in 12% net collection improvement within 60 days." },
  { tag: "Multi-Site · Alberta", headline: "Expansion from 2 to 4 locations — structured for scale", body: "A dental group with two Calgary locations engaged Vitalis to plan structured expansion including financial modeling, site criteria, and practice management system migration." },
];

export default function Dental() {
  usePageMeta(
    "Dental Practice Consulting Alberta | Full-Service Dental Advisory | Vitalis Health Strategies",
    "Vitalis Health Strategies provides comprehensive consulting for dental practices across Alberta and Canada — new office planning, revenue optimization, operations, technology, recruitment, expansion, and M&A advisory."
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* S1 — Hero */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Dental Practices</p>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                Full-cycle consulting for dental practices — from your first office to a multi-location group.
              </h1>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
                Vitalis works with general dentists, specialists, and dental organizations across Calgary, Edmonton, and Canada. We bring operational expertise and structured strategy to every stage of dental practice development — new builds, performance optimization, growth planning, technology, and ownership transitions.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {stats.map((s, i) => (
                <div key={i} className="bg-card/60 backdrop-blur rounded-xl p-4 border border-border/40 text-left">
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                </div>
              ))}
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }} className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button variant="hero" size="lg" asChild><Link to="/strategic-assessment">Start Your Strategic Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button variant="hero-outline" size="lg" asChild><Link to="/contact">Speak With Our Team</Link></Button>
            </motion.div>
          </div>
        </section>

        {/* S2 — Problems */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">
              The real challenges facing dental practices in Alberta right now.
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {problems.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="bg-card rounded-2xl p-6 border-l-4 border-accent shadow-card">
                    <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-4"><Icon className="h-5 w-5 text-accent" /></div>
                    <h3 className="font-display text-base font-bold text-foreground mb-2">{p.heading}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{p.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* S3 — All Services */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">What Vitalis does for dental practices.</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Every service below is available as part of a full engagement or as a focused standalone advisory.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.06 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/40 flex flex-col">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4"><Icon className="h-5 w-5 text-primary" /></div>
                    <h3 className="font-display text-base font-bold text-foreground mb-2">{s.label}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{s.desc}</p>
                    {s.link && <Link to={s.link} className="text-primary text-sm font-medium mt-4 inline-flex items-center hover:underline">Learn More <ArrowRight className="ml-1 h-3 w-3" /></Link>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* S4 — New vs Existing */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">Where does your practice sit right now?</motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 shadow-card border border-primary/20 flex flex-col">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-secondary rounded-full px-3 py-1 w-fit mb-4">Opening a New Practice</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">A dental office is one of the most capital-intensive businesses a dentist will ever open. The financial model determines whether it succeeds.</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">A 10-operatory general dental office in Calgary or Edmonton typically requires $600,000 to $1.2M in leasehold improvements and equipment before the first patient arrives. The site you choose, the lease terms you sign, and the financial structure you build around that investment set the ceiling for the practice's financial performance for years.</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {["Dental practice feasibility analysis and Calgary/Edmonton market assessment","Financial modeling: buildout costs, equipment procurement, staffing, and break-even timeline","Site selection and lease negotiation for Alberta dental spaces","Dental-specific facility planning: operatory count, sterilization, X-ray, mechanical requirements","ADA+C regulatory awareness and compliance planning","Practice management software selection and setup","Associate dentist recruitment for new practices"].map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />{t}</li>
                  ))}
                </ul>
                <Button variant="hero" size="default" asChild className="w-full"><Link to="/strategic-assessment">Start Your Build Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </motion.div>

              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-accent/30 flex flex-col">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 rounded-full px-3 py-1 w-fit mb-4">Optimizing an Established Practice</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Revenue per chair. Hygiene utilization. Fee schedule alignment. These are the numbers that tell the real story of your practice.</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">Most established dental practices have at least one systematic revenue or operational gap that compounds quietly. An independent performance review identifies exactly where that gap is and what it would take to close it — without disrupting clinical operations or patient relationships.</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {["Insurance claim accuracy across all carriers","ADA fee schedule alignment and above-guide billing opportunities","Hygiene chair utilization and re-appointment rates","Operatory and dentist productivity analysis","Overhead ratios across labour, lab, and supply costs","Associate compensation model review","Expansion readiness: additional operatories or second location"].map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />{t}</li>
                  ))}
                </ul>
                <Button variant="gold" size="default" asChild className="w-full"><Link to="/strategic-assessment">Start Your Performance Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* S5 — Practice Types */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">Dental practices Vitalis works with across the spectrum.</motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {practiceTypes.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.06 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4"><Icon className="h-5 w-5 text-primary" /></div>
                    <h3 className="font-display text-sm font-bold text-foreground mb-1">{s.label}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* S6 — Alberta Regulatory */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {regulatoryFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border/40">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6"><Icon className="h-6 w-6 text-primary" /></div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-3">{f.heading}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* S7 — NHSF Callout */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <motion.div {...fadeUp} className="bg-primary/5 border border-primary/20 rounded-2xl p-8 lg:p-10">
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Operating a dental surgical facility or planning one?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">Oral maxillofacial surgery facilities, dental surgical centres, and practices offering general anesthesia or deep sedation require CPSA NHSF accreditation — the same framework as medical surgical facilities. Vitalis provides dedicated advisory for dental surgical facility builds and compliance preparation.</p>
              <Button variant="hero-outline" size="default" asChild><Link to="/solutions/nhsf">Explore Our Surgical Facility Advisory <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            </motion.div>
          </div>
        </section>

        {/* S8 — Financial Snapshot */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Understanding the numbers behind a dental practice.</h2>
              <p className="text-muted-foreground text-sm mt-2">Illustrative figures only. Individual results vary significantly.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {financialStats.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border/40 text-center">
                  <p className="text-3xl font-bold text-primary font-display">{s.value}</p>
                  <p className="text-foreground font-medium text-sm mt-3">{s.label}</p>
                  <p className="text-muted-foreground text-xs mt-2">{s.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* S9 — Case Reference */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Dental practice engagements — a sample.</h2>
              <p className="text-muted-foreground text-sm mt-2">Client details withheld. Results represent actual Vitalis engagements.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {cases.map((c, i) => (
                <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/40">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">{c.tag}</span>
                  <h3 className="font-display text-lg font-bold text-foreground mt-3 mb-2">{c.headline}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* S10 — Final CTA */}
        <section className="py-20 lg:py-28 bg-forest-dark">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground tracking-tight">Your dental practice is more than a clinical operation. It's a financial asset that deserves professional management.</h2>
              <p className="text-primary-foreground/70 mt-4 text-lg">Start with an assessment or speak with our team about what you are navigating.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button variant="hero" size="lg" asChild><Link to="/strategic-assessment">Start Your Strategic Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
                <Button variant="hero-outline" size="lg" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"><Link to="/contact">Speak With Our Team</Link></Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
