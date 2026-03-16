import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/lib/seo";
import {
  ClipboardList, Building2, DollarSign, Settings, Users, Laptop, BarChart2,
  Activity, TrendingUp, ArrowRight, Shield, MapPin, Heart, PawPrint,
  Microscope, Zap, CheckCircle
} from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const stats = [
  { label: "Small Animal · Mixed · Specialty", desc: "Companion animal, large animal, emergency, and specialty referral veterinary practices" },
  { label: "Alberta & Western Canada", desc: "Calgary, Edmonton, and across the western Canadian veterinary market" },
  { label: "Independent & Corporate-Track Practices", desc: "Supporting independent ownership — and preparing for whatever comes next" },
  { label: "ABVMA & CVBC Expertise", desc: "Regulatory familiarity across Alberta and BC veterinary practice environments" },
];

const problems = [
  { icon: TrendingUp, heading: "Corporate Consolidation Is Reshaping the Market", body: "National veterinary consolidators have been acquiring independent practices across Canada — Alberta and BC have seen particularly active acquisition activity. Independent practice owners who don't understand their practice's current valuation, what would improve it, or what their alternatives are, are entering ownership conversations unprepared." },
  { icon: DollarSign, heading: "Revenue Is More Complex Than the Invoice", body: "Veterinary revenue models have expanded — pet insurance, wellness plans, multi-service bundles, specialist referral fees, and pharmacy revenue all require deliberate systems to capture and manage. Most independent practices collect what they invoice. They don't systematically optimize what they invoice, when, or how." },
  { icon: Users, heading: "Veterinarian Shortage Is Real and Structural", body: "Canada has a well-documented shortage of veterinarians, particularly in rural and mixed-practice settings — Alberta is among the most severely affected provinces. The competitive market for associate veterinarians means retention, compensation structure, and workplace culture are now practice management issues, not just HR issues. Practices that lose their associates to corporate groups typically can't hire back at the same cost." },
  { icon: Settings, heading: "Operational Growth Without a Structure Breaks the Practice", body: "The jump from a solo-practitioner practice to a multi-veterinarian clinic involves management, scheduling, compensation, and quality control systems that weren't needed at smaller scale. Most veterinary practices attempt this transition organically — and discover the problems only after they have accumulated." },
];

const services = [
  { icon: ClipboardList, label: "Strategic Assessment", desc: "An independent review of your veterinary practice across revenue, operations, staffing, technology, growth readiness, and competitive positioning. For practices considering any significant decision — expansion, acquisition approach, or structural change.", link: "/strategic-assessment" },
  { icon: Building2, label: "New Veterinary Clinic Planning & Builds", desc: "Feasibility analysis, financial modeling (equipment, buildout, staffing, break-even), site selection in Calgary and Edmonton, ABVMA facility classification planning, practice management software selection, and associate recruitment strategy — before you commit capital." },
  { icon: DollarSign, label: "Revenue Optimization", desc: "Revenue per visit analysis, wellness plan structure and adoption strategy, invoice accuracy review, pharmaceutical pricing, specialist referral fee structures, and insurance billing optimization — the levers that determine whether a veterinary practice captures its full financial potential." },
  { icon: Settings, label: "Operations & Workflow", desc: "Appointment scheduling analysis, exam room utilization, patient flow design, front-desk and technician role alignment, and administrative workflow optimization — built around how a veterinary practice actually operates." },
  { icon: Users, label: "Associate Recruitment & Compensation", desc: "Associate veterinarian and RVT search strategy, compensation model design (salary vs production splits), partnership track structuring, cultural onboarding, and retention planning — for practices competing in a tight associate market." },
  { icon: Laptop, label: "Practice Technology & Software", desc: "Practice management software evaluation (ezyVet, Cornerstone, AVImark, Provet Cloud), digital imaging integration, inventory management systems, client communication platforms, and online booking setup." },
  { icon: BarChart2, label: "Growth Strategy & Expansion", desc: "Second location feasibility, demographic analysis for Alberta veterinary markets, financial modeling for multi-site operations, and the operational infrastructure required to expand without degrading quality or profitability." },
  { icon: Activity, label: "Fractional & Advisory Leadership", desc: "On-demand strategic guidance for veterinary practices navigating growth, partnership transitions, corporate interest, or operational complexity — without the cost of a full-time executive." },
  { icon: TrendingUp, label: "Mergers, Acquisitions & Transitions", desc: "Practice valuation, corporate acquisition advisory, associate buy-in structuring, partnership buyout planning, and transition preparation — for veterinary practice owners at any stage of considering a change in ownership structure." },
];

const practiceTypes = [
  { icon: Heart, label: "Companion Animal General Practice", desc: "Solo and group small animal practices in Calgary, Edmonton, and Alberta communities — the largest segment of the Canadian veterinary market and the most active for both new builds and corporate acquisition" },
  { icon: PawPrint, label: "Mixed Practice — Large & Small Animal", desc: "Rural and semi-rural Alberta practices serving both companion animals and livestock — including practices in Southern Alberta, the Peace Country, and central Alberta agricultural regions" },
  { icon: Activity, label: "Emergency & Critical Care", desc: "24-hour emergency facilities with surgical capability — the highest-capital and most operationally complex veterinary investment, with unique staffing, scheduling, and financial modeling requirements" },
  { icon: Microscope, label: "Specialty & Referral Practices", desc: "Internal medicine, oncology, cardiology, ophthalmology, and surgical specialist practices serving referral populations — with distinct financial models and corporate acquisition dynamics" },
  { icon: Building2, label: "Multi-Location Veterinary Groups", desc: "Independent veterinary organizations with multiple locations navigating the operational, financial, and quality consistency challenges that come with scale" },
  { icon: TrendingUp, label: "Corporate-Track & Acquisition-Ready Practices", desc: "Practices that have received or expect acquisition approaches — including valuation preparation, EBITDA improvement programs, and ownership transition planning" },
];

const corporateCards = [
  { icon: Shield, heading: "Know Your Practice Value Before They Do", body: "Corporate buyers use EBITDA multiples to value veterinary practices. Understanding your practice's current valuation — and what would improve it — before a buyer approaches changes the conversation entirely.", borderColor: 'hsl(var(--primary))' },
  { icon: TrendingUp, heading: "Build Operational Strength Regardless", body: "Practices with strong revenue systems, clean documentation, and structured staffing command higher multiples and are more defensible competitively — whether you intend to sell or not.", borderColor: 'hsl(var(--accent))' },
  { icon: Users, heading: "Your Team Is Your Asset", body: "Associate retention and culture are central to practice value. Compensation structures and working environments that retain your team protect the asset — and the patients.", borderColor: 'hsl(var(--sage))' },
  { icon: DollarSign, heading: "You Have More Options Than a Full Sale", body: "Associate buy-ins, partial sales, management service arrangements, and partnership structures are alternatives to full corporate acquisition. Vitalis helps you understand the financial implications of each.", borderColor: 'hsl(var(--forest))' },
];

const locations = [
  { heading: "Calgary", body: "Calgary's high pet ownership rate and strong household income create above-average veterinary spending. Growth corridors in SE, SW, and NW Calgary have underpenetrated veterinary supply relative to companion animal population density." },
  { heading: "Edmonton & Northern Alberta", body: "Edmonton's veterinary market is supported by large suburban communities and proximity to agricultural regions with mixed-practice demand. South Edmonton, Sherwood Park, and St. Albert remain strong companion animal markets. Northern Alberta has significant veterinary shortage areas." },
  { heading: "Alberta & Beyond", body: "Vitalis works with veterinary practices in BC (under CVBC), Saskatchewan (SVMA), Manitoba (MVMA), and Ontario (CVO) — with understanding of the specific regulatory and market context of each province. The western Canadian veterinary market is our primary focus, with growing engagement across Ontario." },
];

const cases = [
  { tag: "New Build · Calgary", headline: "7-exam-room companion animal clinic opened within budget", body: "A veterinarian transitioning from associate to ownership engaged Vitalis for site selection, financial modeling, and buildout coordination. The new Calgary SW clinic opened within 16 months and within 4% of budget." },
  { tag: "Revenue · Alberta", headline: "Wellness plan adoption increased from 8% to 31%", body: "Restructuring the wellness plan offering and front-desk presentation protocols resulted in wellness plan adoption increasing from 8% to 31% within six months." },
  { tag: "Acquisition Advisory · Western Canada", headline: "Independent practice retained; valuation increased 40%", body: "A practice owner approached by a corporate acquirer engaged Vitalis to understand the offer. A 12-month operational improvement program increased EBITDA by 40% — improving both practice value and the owner's options." },
];

const newPracticeItems = [
  "Veterinary practice feasibility and Alberta/western Canada market analysis",
  "Financial modeling: equipment, buildout, staffing, startup losses, break-even",
  "Facility planning specific to veterinary requirements: surgical suite, isolation ward, imaging, kennel",
  "ABVMA facility classification and standards compliance planning",
  "Site selection for Calgary, Edmonton, and regional Alberta veterinary spaces",
  "Practice management software selection and setup",
  "Associate veterinarian recruitment strategy",
];

const existingPracticeItems = [
  "Revenue per client visit and average invoice benchmarks",
  "Wellness plan structure, pricing, and client adoption rates",
  "Scheduling utilization by appointment type and veterinarian",
  "RVT and assistant-to-revenue ratios",
  "Inventory and pharmaceutical cost controls",
  "Associate productivity and compensation alignment",
  "Valuation positioning for practices considering future ownership change",
];

export default function Veterinary() {
  usePageMeta(
    "Veterinary Practice Consulting Canada | Calgary, Edmonton & Nationwide | Vitalis Health Strategies",
    "Vitalis Health Strategies provides comprehensive consulting for veterinary practices across Canada — with deep focus on Calgary, Edmonton, and Alberta. New clinic builds, practice optimization, revenue, staffing, technology, expansion, and M&A advisory."
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* S1 — Hero */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl text-center">
            <motion.div {...fadeUp}>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-4">Veterinary Practices</p>
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                Full-cycle strategic consulting for veterinary practices — from your first clinic to navigating what comes next.
              </h1>
              <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
                Vitalis works with companion animal practices, mixed practices, specialty clinics, and emergency facilities across Calgary, Edmonton, and western Canada. The same operational and financial expertise we bring to human healthcare practices — applied to the distinct realities of veterinary medicine.
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

        {/* S2 — Problems — Alternating full-width rows */}
        <section className="py-24 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14 px-4">
              What veterinary practice owners across Canada are navigating right now.
            </motion.h2>
            {problems.map((p, i) => {
              const Icon = p.icon;
              const isEven = i % 2 === 1;
              return (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className={`py-12 border-b border-border/30 ${i % 2 === 0 ? 'bg-background' : 'bg-gradient-section'}`}
                >
                  <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                    {/* Mobile: stacked */}
                    <div className="lg:hidden flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-foreground">{p.heading}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{p.body}</p>
                    </div>
                    {/* Desktop: alternating */}
                    <div className={`hidden lg:flex items-start gap-10 ${isEven ? 'flex-row-reverse' : ''}`}>
                      <div className="w-[20%] flex flex-col items-center text-center shrink-0">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-display text-sm font-bold text-foreground mt-3">{p.heading}</h3>
                      </div>
                      <div className="w-[80%]">
                        <p className="text-muted-foreground leading-relaxed">{p.body}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* S3 — Services — Numbered rows */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">What Vitalis does for veterinary practices.</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">The full range of advisory services — each one framed for the specific realities of veterinary practice.</p>
            </motion.div>
            <div className="divide-y divide-border/30">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    {...fadeUp}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="flex items-start gap-4 lg:gap-6 py-6 transition-colors hover:bg-primary/[0.03] px-2 rounded"
                  >
                    <span className="text-4xl font-bold text-primary/20 font-display shrink-0 w-16 leading-none">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-bold text-foreground mb-1">{s.label}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                      {s.link && <Link to={s.link} className="text-primary text-sm font-medium mt-2 inline-flex items-center hover:underline">Learn More <ArrowRight className="ml-1 h-3 w-3" /></Link>}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 hidden lg:flex">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* S4 — New vs Existing — Stacked editorial panels */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">Where is your practice right now?</motion.h2>

            {/* Panel 1 — New */}
            <motion.div {...fadeUp} className="grid lg:grid-cols-[40%_60%] overflow-hidden mb-2">
              <div className="p-8 lg:p-10 flex flex-col justify-center" style={{ backgroundColor: 'hsl(155, 35%, 14%)' }}>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1 w-fit mb-4" style={{ color: 'hsl(40, 40%, 96%)', backgroundColor: 'hsla(40, 40%, 96%, 0.1)' }}>Opening a New Practice</span>
                <h3 className="font-display text-xl font-bold mb-3" style={{ color: 'hsl(40, 40%, 96%)' }}>The financial and operational decisions made before opening day determine the ceiling of your practice for years.</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsla(40, 40%, 96%, 0.7)' }}>A new small animal clinic in Calgary or Edmonton typically requires $500,000 to $1.5M in capital before opening.</p>
              </div>
              <div className="p-8 lg:p-10" style={{ backgroundColor: 'hsl(40, 33%, 97%)' }}>
                <ul className="space-y-2">
                  {newPracticeItems.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />{t}</li>
                  ))}
                </ul>
                <Button variant="hero" size="default" asChild className="w-full mt-6"><Link to="/strategic-assessment">Start Your Build Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </div>
            </motion.div>

            {/* Panel 2 — Existing */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="grid lg:grid-cols-[40%_60%] overflow-hidden">
              <div className="p-8 lg:p-10 flex flex-col justify-center" style={{ backgroundColor: 'hsl(148, 15%, 55%)' }}>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1 w-fit mb-4" style={{ color: 'hsl(40, 40%, 96%)', backgroundColor: 'hsla(40, 40%, 96%, 0.15)' }}>Optimizing an Established Practice</span>
                <h3 className="font-display text-xl font-bold mb-3" style={{ color: 'hsl(40, 40%, 96%)' }}>Strong clinical reputation and strong financial performance are not the same thing. Both are achievable.</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsla(40, 40%, 96%, 0.7)' }}>Most practice owners know one or two key metrics. Very few have a complete, independent view of all of them.</p>
              </div>
              <div className="p-8 lg:p-10" style={{ backgroundColor: 'hsl(40, 33%, 97%)' }}>
                <ul className="space-y-2">
                  {existingPracticeItems.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />{t}</li>
                  ))}
                </ul>
                <Button variant="gold" size="default" asChild className="w-full mt-6"><Link to="/strategic-assessment">Start Your Performance Assessment <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* S5 — Practice Types — Alternating large rows */}
        <section className="py-24 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14 px-4">
              Veterinary practices we work with — across Canada.
            </motion.h2>
            {practiceTypes.map((s, i) => {
              const Icon = s.icon;
              const isEven = i % 2 === 1;
              return (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  className={`py-10 ${i % 2 === 0 ? 'bg-background' : 'bg-gradient-section'}`}
                >
                  <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                    {/* Mobile */}
                    <div className="lg:hidden flex flex-col items-center text-center gap-4">
                      <div className="w-[72px] h-[72px] rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-9 w-9 text-primary" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground">{s.label}</h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">{s.desc}</p>
                    </div>
                    {/* Desktop */}
                    <div className={`hidden lg:flex items-center gap-12 ${isEven ? 'flex-row-reverse' : ''}`}>
                      <div className="w-[72px] h-[72px] rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-9 w-9 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-foreground mb-2">{s.label}</h3>
                        <p className="text-muted-foreground text-[15px] leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* S6 — Corporate Acquisition — Colored left-border cards */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.div {...fadeUp} className="text-center mb-6">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">The corporate acquisition wave — what independent veterinary practice owners need to know.</h2>
            </motion.div>
            <motion.p {...fadeUp} className="text-muted-foreground text-center max-w-3xl mx-auto mb-14">Corporate veterinary consolidators have acquired a significant share of independent practices across Canada over the past decade. Alberta and BC have seen particularly active acquisition activity. For independent practice owners, this creates both risk and opportunity — depending on how your practice is positioned.</motion.p>
            <div className="grid sm:grid-cols-2 gap-6">
              {corporateCards.map((c, i) => (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="bg-card p-6 rounded-r-lg"
                  style={{ borderLeft: `4px solid ${c.borderColor}` }}
                >
                  <h3 className="font-display text-sm font-bold text-foreground mb-2">{c.heading}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{c.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* S7 — Geographic */}
        <section className="py-24 lg:py-32 bg-gradient-section">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.h2 {...fadeUp} className="font-display text-2xl lg:text-3xl font-bold text-foreground text-center mb-14">Veterinary practices across Calgary, Edmonton, and Alberta.</motion.h2>
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
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Planning a veterinary surgical or specialty facility?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">Veterinary surgical facilities, specialty referral centres, and emergency facilities with surgical capability involve distinct planning, ABVMA classification requirements, equipment specification, and financial modeling compared to general companion animal practice. Vitalis provides dedicated advisory for veterinary surgical facility development.</p>
              <Button variant="hero-outline" size="default" asChild><Link to="/solutions/nhsf">Explore Our Surgical Facility Advisory <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            </motion.div>
          </div>
        </section>

        {/* S9 — Case Reference */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Veterinary practice engagements — a sample.</h2>
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
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground tracking-tight">You built your practice around clinical excellence. Vitalis helps you build the business infrastructure that makes it sustainable.</h2>
              <p className="text-primary-foreground/70 mt-4 text-lg">Start with an assessment — or speak directly with our team.</p>
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
