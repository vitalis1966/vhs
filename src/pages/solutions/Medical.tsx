import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/seo";
import {
  ClipboardList, Building2, DollarSign, Settings, Users, Laptop, BarChart2,
  Activity, TrendingUp, ArrowRight, Shield, FileText, MapPin, Heart,
  Stethoscope, Microscope, Bone, Eye, Baby, Brain, Zap, CheckCircle
} from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const stats = [
  { label: "Family Medicine to Complex Specialty", desc: "GP clinics, internists, dermatologists, orthopedic surgeons, ophthalmologists, and more" },
  { label: "Calgary · Edmonton · Across Canada", desc: "Deeply familiar with Alberta's regulatory and market environment" },
  { label: "New Builds & Established Practices", desc: "Full lifecycle — from feasibility study to ongoing operational advisory" },
  { label: "CPSA & AHS Expertise", desc: "The regulatory and billing environment specific to Alberta physician practice" },
];

const problems = [
  { icon: DollarSign, heading: "AHS Billing Is More Complex Than It Should Be", body: "Alberta Health Care Insurance Plan billing, shadow billing, uninsured service fee schedules, and third-party billing for WCB, MVA, and occupational health create a revenue cycle that is unusually complex for a private practice. Most medical clinics in Alberta are under-collecting — often without knowing it." },
  { icon: Users, heading: "Physician Recruitment Is a Persistent Problem", body: "Alberta faces a documented physician shortage, particularly in rural and semi-rural communities. Even Calgary and Edmonton practices struggle to recruit and retain associates who fit their clinical model and compensation structure. The recruitment problem is partly operational — how the practice is structured, what it offers, and how it onboards new physicians." },
  { icon: Settings, heading: "Operations Run on Informal Systems", body: "Most medical clinics in Alberta were built around a physician's clinical expertise, not an operational blueprint. Scheduling systems, patient flow protocols, staff roles, and administrative workflows are typically informal — functional, but not optimized. When patient volume grows or a physician leaves, those informal systems break." },
  { icon: TrendingUp, heading: "Growth Is Harder Than It Looks", body: "Adding a second physician, a new service line, or a second location requires more than clinical capacity. Financial modeling, space planning, regulatory navigation, and operational redesign are all prerequisites for growth that holds. Practices that grow without this foundation often discover the costs faster than the revenue." },
];

const services = [
  { icon: ClipboardList, label: "Strategic Assessment", desc: "An independent, structured review of your practice across revenue, operations, staffing, growth readiness, and compliance. The starting point for most Vitalis engagements — and the fastest way to understand where to focus.", link: "/strategic-assessment" },
  { icon: Building2, label: "New Practice Planning & Builds", desc: "Site selection, financial modeling, facility design input, CPSA compliance planning, technology selection, and operational launch preparation — for GPs, specialists, and surgical groups opening new facilities in Alberta and across Canada." },
  { icon: DollarSign, label: "Revenue Cycle & Billing Optimization", desc: "AHS claims accuracy, shadow billing structure, uninsured service fee schedules, WCB and MVA billing, denial management, and collection process review. Alberta medical practices consistently leave 10–20% of collectible revenue uncaptured." },
  { icon: Settings, label: "Operations & Workflow Optimization", desc: "Patient flow design, scheduling model analysis, appointment mix optimization, staff role alignment, and administrative process redesign — built around how your practice actually runs, not a generic template." },
  { icon: Users, label: "Physician Recruitment & Retention", desc: "Associate physician search strategy, compensation model design, partnership structure, onboarding frameworks, and retention planning — for practices in Calgary, Edmonton, rural Alberta, and across Canada." },
  { icon: Laptop, label: "Healthcare Technology & EMR", desc: "EMR platform evaluation and selection (Med Access, CHR, OSCAR, PS Suite, Wolf), scheduling system review, practice management software, and digital workflow optimization for Alberta medical practices." },
  { icon: BarChart2, label: "Growth Strategy & Expansion", desc: "Service line expansion analysis, second location feasibility, multi-physician growth modeling, and the operational prerequisites for scaling — so growth generates profit rather than just overhead." },
  { icon: Activity, label: "Fractional & Advisory Leadership", desc: "On-demand strategic support for practices that need executive-level guidance without a full-time commitment — COO, CMO, or general advisory for practices navigating growth, transition, or operational complexity." },
  { icon: TrendingUp, label: "Mergers, Acquisitions & Transitions", desc: "Practice valuation, acquisition advisory, partnership restructuring, corporate structure optimization, and transition planning — for medical practices considering a change in ownership or organizational structure." },
];

const specialties = [
  { icon: Heart, label: "Family Medicine & Primary Care", desc: "Solo and group GP practices, walk-in clinics, and primary care networks — the most common medical practice type in Alberta and the one facing the most pressure from physician shortages and billing complexity" },
  { icon: Stethoscope, label: "Internal Medicine", desc: "General internists and sub-specialists managing complex chronic disease panels — with billing and operational structures distinct from primary care" },
  { icon: Microscope, label: "Dermatology", desc: "Medical and cosmetic dermatology practices, including CPSA-accredited procedural facilities for Mohs surgery, laser, and aesthetic procedures" },
  { icon: Bone, label: "Orthopedics & Musculoskeletal", desc: "Orthopedic surgery practices and musculoskeletal clinics, including practices considering NHSF or CSF facility development" },
  { icon: Eye, label: "Ophthalmology", desc: "Ophthalmology clinics and surgical practices, including cataract and refractive surgery centres under CPSA accreditation" },
  { icon: Activity, label: "Sports Medicine & Rehabilitation", desc: "Sports medicine clinics, multidisciplinary rehabilitation, and injury management practices with complex billing structures across AHS, WCB, and private pay" },
  { icon: Baby, label: "Women's Health & OB/GYN", desc: "Obstetrics and gynecology practices, women's health clinics, and maternity care groups across Alberta" },
  { icon: Brain, label: "Mental Health & Psychiatry", desc: "Psychiatric practices, outpatient mental health clinics, and interdisciplinary mental health organizations" },
];

const regulatoryFeatures = [
  { icon: DollarSign, heading: "Alberta Health Care Insurance Plan (AHCIP)", body: "Physician billing in Alberta operates through AHCIP — a fee-for-service schedule that covers insured services. Billing accuracy, modifier usage, and claim submission timing directly affect collection rates. Most practices have at least one systematic billing gap that compounds quietly over time. Vitalis assesses and addresses AHCIP billing performance as part of every revenue cycle engagement." },
  { icon: Shield, heading: "CPSA Registration & Facility Standards", body: "All medical clinics in Alberta must register with CPSA. Facilities performing procedures beyond general practice — including minor surgery, cosmetic procedures, or sedation — may require additional CPSA accreditation. Vitalis helps practices understand what registration and compliance they need at their current stage and plans for compliance requirements before they become issues." },
  { icon: FileText, heading: "Shadow Billing & Uninsured Services", body: "Many Alberta physicians offer both insured (AHCIP) and uninsured services — from cosmetic procedures to third-party assessments to executive health. Structuring these service lines, setting fee schedules, and ensuring billing captures all appropriate revenue is an area where Vitalis consistently identifies significant uncaptured income in practice assessments." },
];

const locations = [
  { heading: "Calgary", body: "Calgary's rapidly growing population has created sustained demand for both primary care and specialist services. SE Calgary, SW Calgary, and surrounding communities represent particularly underserviced growth corridors. Vitalis understands Calgary's healthcare real estate landscape, demographic patterns, and the competitive environment for medical practices across the city's quadrants." },
  { heading: "Edmonton & Northern Alberta", body: "Edmonton's medical ecosystem anchors on the University of Alberta Hospital and Royal Alexandra Hospital, creating strong specialist referral demand for well-positioned private practices. Edmonton Zone AHS billing has its own nuances distinct from Calgary Zone. Vitalis works with Edmonton-area practices on both new builds and existing practice optimization." },
  { heading: "Rural Alberta & Across Canada", body: "Rural and regional Alberta communities face significant physician shortages — creating genuine practice opportunity for well-structured independent clinics. Vitalis also works with medical practices in BC, Saskatchewan, Ontario, and other provinces, applying the same structured approach to each provincial regulatory and billing context." },
];

const cases = [
  { tag: "Revenue Cycle · Calgary", headline: "28% improvement in net collections", body: "A Calgary multi-physician primary care clinic with 4 GPs had systematic AHS billing gaps and uncaptured uninsured service revenue. After a 90-day revenue cycle engagement, net collections improved 28% without adding patients or changing fee schedules." },
  { tag: "New Build · Edmonton", headline: "Specialist clinic opened on schedule and within budget", body: "An Edmonton specialist group planning a new multi-physician clinic engaged Vitalis at the feasibility stage. Vitalis supported site selection, financial modeling, CPSA registration, and operational design through to opening day within the planned 14-month window." },
  { tag: "Operations · Alberta", headline: "Scheduling redesign recovered 22% of unused OR time", body: "A surgical practice with chronic scheduling inefficiency engaged Vitalis for an operational assessment. Scheduling model redesign recovered 22% of previously unused procedure time within 60 days — without adding staff or space." },
];

const processSteps = [
  { num: "01", label: "Assessment", desc: "We begin with a structured review of your practice — where it stands, what you are trying to achieve, and the specific operational or financial challenges in your way. For new builds: feasibility and readiness. For existing practices: independent performance review." },
  { num: "02", label: "Strategic Plan", desc: "You receive a clear, prioritized plan — not a generic report. Specific recommendations, a sequenced timeline, and accountability for outcomes. For new builds: a phased development roadmap. For existing practices: the 3–5 interventions with the greatest performance impact." },
  { num: "03", label: "Implementation", desc: "Vitalis works alongside you through execution. Revenue cycle changes, recruitment processes, technology implementations, facility design, and AHS billing — we are in it with you, not handing off a document." },
  { num: "04", label: "Ongoing Advisory", desc: "Many medical practices retain Vitalis as a long-term strategic partner. CPSA standards evolve, AHS billing rules change, the market shifts, and your practice grows. Having the right advisory relationship means your practice stays ahead of changes rather than reacting to them." },
];

export default function Medical() {
  usePageMeta(
    "Medical Clinic & Practice Consulting Alberta | Full-Cycle Healthcare Strategy | Vitalis Health Strategies",
    "Vitalis Health Strategies provides end-to-end consulting for medical clinics, specialist practices, and surgical groups across Alberta and Canada — from new builds to performance optimization, revenue cycle, technology, recruitment, and M&A advisory."
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* S1 — Hero */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Medical Practices</p>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                Full-cycle strategic consulting for medical clinics and practices — from your first facility to your most complex operational challenge.
              </h1>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
                Vitalis works with family physicians, specialists, surgical groups, and multi-physician organizations across Calgary, Edmonton, and Canada. Whether you are opening a new clinic, navigating a billing problem, trying to grow, or preparing for a major transition — we have the operational and strategic experience to help you move forward.
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
              The challenges medical practice owners in Alberta face — and what actually causes them.
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
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">What Vitalis does for medical practices.</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Every service below is available as a standalone engagement or as part of a broader advisory relationship.</p>
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
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">Where are you in your practice's lifecycle?</motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* New */}
              <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 shadow-card border border-primary/20 flex flex-col">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-secondary rounded-full px-3 py-1 w-fit mb-4">Opening a New Practice</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Get the foundation right. It's harder to fix once you've opened.</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">Opening a medical clinic or specialist practice in Alberta involves CPSA registration, facility compliance, billing setup, technology selection, staffing, and a financial model — all before you see your first patient. Vitalis works with physicians from the earliest planning stages to opening day.</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {["Practice feasibility analysis and Alberta market positioning","Financial modeling: startup costs, operating expenses, break-even timeline","Site selection and lease negotiation support","CPSA facility registration and compliance planning","EMR and practice technology selection","Billing structure setup: AHS, shadow billing, uninsured services","Staff recruitment and onboarding framework design"].map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />{t}</li>
                  ))}
                </ul>
                <Button variant="hero" size="default" asChild className="w-full"><Link to="/strategic-assessment">Start Your Build Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </motion.div>
              {/* Existing */}
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-accent/30 flex flex-col">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 rounded-full px-3 py-1 w-fit mb-4">Optimizing an Established Practice</span>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Running well and running at your potential are not the same thing.</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">Established medical practices in Alberta typically have significant recoverable revenue and operational efficiency sitting untouched. A structured performance assessment gives you the objective picture your internal view cannot provide.</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {["AHS billing accuracy and claim performance","Uninsured and third-party billing completeness","Scheduling utilization and patient throughput","Physician and staff productivity ratios","CPSA compliance posture review","Growth opportunity analysis"].map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />{t}</li>
                  ))}
                </ul>
                <Button variant="gold" size="default" asChild className="w-full"><Link to="/strategic-assessment">Start Your Performance Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* S5 — Specialties */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">Medical practice types across Alberta and Canada.</motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialties.map((s, i) => {
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
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">What makes Alberta medical practice operations distinct.</motion.h2>
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

        {/* S7 — Geographic */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">Medical practices across Calgary, Edmonton, and Alberta.</motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {locations.map((l, i) => (
                <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border/40">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4"><MapPin className="h-5 w-5 text-primary" /></div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-3">{l.heading}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{l.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* S8 — NHSF Callout */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <motion.div {...fadeUp} className="bg-primary/5 border border-primary/20 rounded-2xl p-8 lg:p-10">
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Planning a surgical facility or procedural centre?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">If your practice involves surgical or procedural services that would qualify as a Non-Hospital Surgical Facility under CPSA accreditation — including Mohs surgery, ophthalmology, orthopedics, dermatology procedures, or any procedure requiring anesthesia — Vitalis provides dedicated advisory for that pathway. NHSF builds and accreditation preparation involve a separate regulatory and financial framework from standard medical clinic development.</p>
              <Button variant="hero-outline" size="default" asChild><Link to="/solutions/nhsf">Explore Our NHSF & Surgical Facility Advisory <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            </motion.div>
          </div>
        </section>

        {/* S9 — How Engagement Works */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">What working with Vitalis looks like.</motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="bg-card rounded-2xl p-6 shadow-card border border-border/40 relative">
                  <span className="text-3xl font-bold text-primary/20 font-display">{s.num}</span>
                  <h3 className="font-display text-base font-bold text-foreground mt-2 mb-2">{s.label}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  {i < processSteps.length - 1 && <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30 z-10" />}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* S10 — Case Reference */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Medical practice engagements — a sample.</h2>
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

        {/* S11 — Final CTA */}
        <section className="py-20 lg:py-28 bg-forest-dark">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground tracking-tight">Your medical practice is a clinical asset and a business. It deserves strategy that treats it as both.</h2>
              <p className="text-primary-foreground/70 mt-4 text-lg">Start with a structured assessment — or speak with our team directly about what you are working through.</p>
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
