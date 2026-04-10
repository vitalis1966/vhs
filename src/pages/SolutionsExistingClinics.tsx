import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  Stethoscope,
  Smile,
  PawPrint,
  Building2,
  MapPin,
  FileText,
  Target,
  UserCheck,
  Heart,
  MessageSquare,
  Shield,
} from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const heroStats = [
  { stat: "200+ Practices Supported", context: "Medical, dental, and veterinary across Canada" },
  { stat: "$40M+ Revenue Gaps Identified", context: "Across client practice assessments" },
  { stat: "Operations · Revenue · Growth", context: "All dimensions of practice performance" },
  { stat: "Ongoing Advisory Available", context: "From single engagement to long-term partnership" },
];

const findingsCards = [
  { icon: DollarSign, title: "Billing gaps they didn't know existed", body: "Fee collection gaps in medical, dental, and veterinary practices are almost always systematic — not random. Claim errors, missed pre-authorizations, outdated fee schedules, and uncaptured uninsured service revenue accumulate quietly. Most practice owners discover them only through an independent review." },
  { icon: Clock, title: "Scheduling capacity they're not using", body: "Unused appointment capacity, suboptimal appointment mix, and scheduling models designed for yesterday's patient volume are among the most common sources of addressable revenue in established practices. A 10% improvement in scheduling utilization typically has more revenue impact than adding a new service line." },
  { icon: Users, title: "Staffing costs misaligned with productivity", body: "Staffing is the largest operating cost in most healthcare practices — and the most complex to optimize. Role misalignment, compensation structures that don't reflect productivity, and retention gaps that create recurring recruitment costs are consistently present in practices that have grown organically." },
  { icon: TrendingUp, title: "Growth opportunities they haven't modeled", body: "Service line expansion, additional practitioners, satellite locations, and corporate structuring each have financial models that most practice owners have not built. Understanding what growth is actually worth — and what it requires — changes the decision-making process entirely." },
];

const opsAssessItems = [
  "Patient flow: intake, rooming, clinical encounter, checkout, and follow-up — mapped against actual performance and compared to benchmarks",
  "Scheduling utilization: appointment mix analysis, open capacity identification, same-day booking rates, no-show and cancellation patterns, and scheduling model redesign",
  "Administrative workflows: front desk, billing, recalls, referrals, and correspondence — mapping time cost against value and identifying streamlining opportunities",
  "Clinical support workflows: nursing, dental hygiene, veterinary technician, and medical assistant roles — scope of practice utilization and support ratio analysis",
  "Technology utilization: EMR workflow configuration, scheduling system optimization, and digital tool adoption — most practices use less than 40% of their EMR's functional capability",
  "Quality and compliance: infection prevention and control, documentation standards, regulatory compliance posture, and incident reporting culture",
];

const opsOutcomes = [
  "Reduced wait times and improved patient experience scores",
  "Increased appointment capacity without adding space or providers",
  "Lower administrative cost per patient encounter",
  "Reduced staff turnover from clearer roles and better-designed workflows",
  "Improved compliance posture with less reactive management effort",
  "Operational infrastructure that supports the next stage of growth",
];

const medicalBillingItems = [
  "AHCIP (Alberta Health Care Insurance Plan) claim accuracy — modifier usage, diagnosis coding, service code selection",
  "Shadow billing structure and uninsured service fee schedule review",
  "Third-party billing: WCB, MVA, occupational health, and executive health program fees",
  "Pre-authorization and referral documentation for specialist billing",
  "Denial management and resubmission processes",
  "Reconciliation between billings and collections",
];

const dentalBillingItems = [
  "Alberta Blue Cross, Sun Life, Manulife, and other carrier claim accuracy",
  "ADA suggested fee guide alignment and above-guide billing strategy",
  "Coordination of benefits: primary and secondary insurance submission sequencing",
  "Pre-determination processes and approval documentation",
  "Patient billing: collection at time of service, payment plan structures, and aging accounts receivable management",
  "Fee schedule review against current market and competitive benchmarks",
];

const vetBillingItems = [
  "Invoice accuracy: missed charges, bundling errors, and procedure documentation gaps",
  "Wellness plan pricing, adoption rate, and revenue per enrolled client analysis",
  "Pet insurance claim support and documentation standards",
  "Pharmacy pricing review: dispensing fees, markup structures, and competitive benchmarks",
  "Specialist referral fee structures and documentation",
  "Accounts receivable aging and collection process review",
];

const behaviouralItems = [
  { label: "Individual profiling", desc: "validated behavioural assessments for clinical and leadership staff that reveal working style, communication preference, and role fit — providing the language to have productive conversations about performance and fit" },
  { label: "Team composition analysis", desc: "understanding how the current team's behavioural profiles interact — where complementary strengths create synergy and where style mismatches create friction that looks like performance problems" },
  { label: "Hiring for fit", desc: "building behavioural criteria into recruitment processes so that new hires are evaluated not just on technical skill but on cultural and team compatibility" },
  { label: "Leadership profiling", desc: "giving practice owners and senior clinical leaders insight into their own behavioural patterns and how they shape the culture and dynamics of the team around them" },
];

const cultureItems = [
  { label: "Culture assessment", desc: "a structured diagnostic of the current cultural environment — what is working, what is creating friction, and where the gap between stated values and actual behaviours is largest" },
  { label: "Performance framework design", desc: "building clear, documented expectations for every role — so that performance conversations have a baseline, underperformance is identified early, and high performance is recognized and retained" },
  { label: "Difficult conversations and conflict resolution", desc: "a structured approach to the performance conversations most practice owners avoid — providing frameworks, language, and process for addressing underperformance, role misalignment, and interpersonal conflict before they escalate" },
  { label: "Staff retention strategy", desc: "identifying the drivers of turnover specific to the practice — whether compensation, culture, workload, leadership, or opportunity — and building the retention interventions most likely to address them" },
  { label: "Leadership development", desc: "working with practice owners and clinical leaders on the specific leadership capabilities required to manage a growing team — including delegation, feedback, accountability, and the transition from clinician to leader" },
];

const growthCells = [
  { icon: Users, title: "Adding Practitioners", body: "Associate physician, dentist, or veterinarian recruitment and integration — including compensation model design, space planning, scheduling model adjustment, and the operational changes required to support additional clinical volume without degrading quality or profitability." },
  { icon: Building2, title: "New Service Lines", body: "Expanding into adjacent services — cosmetic procedures, diagnostic services, specialist referral, wellness programs, or specialty care — with financial modeling, regulatory assessment, equipment planning, and operational design for the new service alongside the existing practice." },
  { icon: MapPin, title: "Additional Locations", body: "Second and third location planning including site selection, financial modeling for multi-site operations, leadership structure for distributed management, quality consistency across locations, and the technology and administrative infrastructure required at scale." },
  { icon: TrendingUp, title: "Corporate & Organizational Structuring", body: "Professional corporation structuring, management company models, investor-ready financial organization, and the governance and reporting infrastructure that supports practices considering equity investment, partnership, or eventual sale." },
];

const transitionCols = [
  { icon: DollarSign, title: "Practice Valuation", body: "Independent practice valuation for medical, dental, and veterinary practices — based on EBITDA multiple analysis, patient panel or client base assessment, asset valuation, and market comparable data. Understanding what your practice is worth — and what would increase it — is the starting point for any ownership conversation." },
  { icon: FileText, title: "Acquisition Advisory", body: "For practices considering acquisition of another practice or facility — due diligence support, financial model review, operational assessment of the target practice, and integration planning. Understanding what you are buying before you commit is the most valuable investment in an acquisition process." },
  { icon: ArrowRight, title: "Transition & Exit Planning", body: "For practice owners planning a future sale, partner buy-in, associate buy-out, or succession — building the operational, financial, and documentation foundation that maximizes practice value and minimizes transition disruption for patients and staff." },
];

const engagementTypes = [
  { title: "Diagnostic Assessment", duration: "4-6 weeks", description: "Comprehensive review of operations, financials, technology, and staffing to identify improvement opportunities and develop recommendations." },
  { title: "Implementation Support", duration: "3-6 months", description: "Hands-on support to execute improvement initiatives, redesign workflows, implement technology changes, and drive operational transformation." },
  { title: "Strategic Advisory", duration: "Ongoing", description: "Long-term advisory partnership providing ongoing strategic guidance, performance monitoring, and support for major decisions and initiatives." },
];

const SolutionsExistingClinics = () => {
  const location = useLocation();

  usePageMeta(
    "Practice Operations, Growth & Advisory | Existing Practice Consulting Canada | Vitalis Health Strategies",
    "Vitalis Health Strategies helps established medical, dental, and veterinary practices optimize operations, improve revenue performance, plan strategic growth, and navigate ownership transitions — across Canada.",
    "/og-existing-clinics.jpg"
  );

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* S1 — Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Operating, Growing & Advising</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Most practices are running well. There is almost always room to run significantly better.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Established medical, dental, and veterinary practices across Canada consistently have recoverable revenue, operational efficiency, and growth opportunity that is not visible from inside the operation. Vitalis provides the independent, structured view that helps practice owners act on what they can see — and discover what they cannot.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {heroStats.map((s) => (
              <div key={s.stat} className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/30">
                <p className="text-sm font-bold text-foreground">{s.stat}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.context}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl" asChild className="whitespace-normal h-auto py-3 text-center leading-snug">
              <Link to="/strategic-assessment">Start Your Performance Assessment <ArrowRight className="ml-2 h-5 w-5 shrink-0" /></Link>
            </Button>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* S2 — What Practices Find */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-16 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Common Findings</span>
          </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">What practice owners discover when they look at the numbers independently.</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">These are not hypothetical risks. They are the consistent findings across Vitalis performance assessments.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {findingsCards.map((card, i) => (
              <motion.div key={card.title} {...fadeUp} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S3 — Operations & Workflow */}
      <section id="operations" className="py-20 lg:py-28 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Operations & Workflow Optimization</span>
          </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">How your practice runs day-to-day determines what it can become.</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Operational performance is not just about efficiency — it is about creating the conditions for consistent clinical quality, staff retention, and financial performance. Vitalis conducts structured operational reviews and works with practice leaders to redesign the workflows, systems, and structures that determine day-to-day performance.
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-10">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <h3 className="font-display text-xl font-bold text-foreground mb-6">What we assess</h3>
              <div className="space-y-3">
                {opsAssessItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <h3 className="font-display text-xl font-bold text-foreground mb-6">What operational improvement delivers</h3>
              <div className="space-y-3">
                {opsOutcomes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* S4 — Billing & Revenue Review */}
      <section id="billing" className="py-20 lg:py-28 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Billing & Revenue Review</span>
          </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Your billing system is probably leaving money on the table. Most are.</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Revenue cycle performance is the single highest-impact area in most practice performance assessments. Fee collection gaps are almost always systematic — meaning they recur month after month until someone identifies and addresses the underlying process failure. Vitalis conducts structured revenue cycle reviews across medical, dental, and veterinary practices and implements the specific changes that recover and sustain revenue.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Medical */}
            <motion.div {...fadeUp} transition={{ delay: 0.08 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Medical Practices</h3>
              <div className="space-y-2 mb-5">
                {medicalBillingItems.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">Typical finding:</span> 10–20% of collectible revenue uncaptured in medical practices</p>
              </div>
            </motion.div>

            {/* Dental */}
            <motion.div {...fadeUp} transition={{ delay: 0.12 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                <Smile className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Dental Practices</h3>
              <div className="space-y-2 mb-5">
                {dentalBillingItems.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">Typical finding:</span> 8–15% of collectible revenue uncaptured in dental practices</p>
              </div>
            </motion.div>

            {/* Veterinary */}
            <motion.div {...fadeUp} transition={{ delay: 0.16 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                <PawPrint className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Veterinary Practices</h3>
              <div className="space-y-2 mb-5">
                {vetBillingItems.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">Typical finding:</span> Revenue optimization through invoice accuracy and wellness plan redesign typically yields 12–18% revenue improvement</p>
              </div>
            </motion.div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground/70 italic text-center">Figures are illustrative. Individual practice results vary based on size, specialty, billing model, and current performance baseline.</p>
        </div>
      </section>

      {/* S5 — People */}
      <section id="people" className="py-20 lg:py-28 bg-muted/40 scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">People</span>
          </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Your team is your most important operational system — and the one most practices manage least systematically.</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Established practices often reach a stage where clinical performance is strong, patient relationships are good, and the business is financially adequate — but something in the team isn't working the way it should. Turnover is higher than it should be. Key staff aren't performing to their potential. A leadership or cultural tension is present but unnamed. Or the practice is growing and the team structure that worked at smaller scale is starting to show cracks. Vitalis addresses people performance as a structured operational discipline — not as a soft HR function.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Behavioural Profiling & Team Composition</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Understanding how individuals work — their communication style, decision-making preferences, stress responses, and collaboration tendencies — is foundational to building a high-performing team. Vitalis uses validated behavioural profiling tools to give practice leaders an objective picture of their team composition and the dynamics it creates.
              </p>
              <div className="space-y-3">
                {behaviouralItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground">{item.label}:</span> {item.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
              <h3 className="font-display text-xl font-bold text-foreground mb-3">Culture, Performance & Retention</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Culture is not a values statement on a wall. It is the actual behaviours, norms, and expectations that govern how people treat each other, how decisions get made, and what is tolerated versus what is not. In a healthcare practice, culture directly affects patient experience, staff retention, and clinical quality.
              </p>
              <div className="space-y-3">
                {cultureItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
                    <span className="text-sm text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground">{item.label}:</span> {item.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="mt-8 bg-card rounded-2xl p-8 shadow-card border border-border/40">
            <h4 className="font-display text-lg font-bold text-foreground mb-3">The cost of losing a staff member is higher than most practice owners think.</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Recruiting, onboarding, and training a replacement for a clinical support staff member typically costs 50–75% of their annual salary when lost productivity, recruitment fees, and training time are included. For a clinical staff member — nurse, dental hygienist, veterinary technician — the cost is higher. Most practices experience this as a painful but unavoidable cost of doing business. The ones that treat retention as a financial priority discover it is not unavoidable at all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* S6 — Growth Strategy */}
      <section id="growth" className="py-20 lg:py-28 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Growth Strategy & Expansion Planning</span>
          </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Growth that isn't planned is usually more expensive than growth that is.</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Adding a second location, a new service line, an additional practitioner, or corporate infrastructure each requires a different kind of planning — financial modeling, operational redesign, regulatory navigation, and the people infrastructure to manage at greater scale. Vitalis helps practices build and execute growth strategies that generate financial return rather than just operational complexity.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {growthCells.map((cell, i) => (
              <motion.div key={cell.title} {...fadeUp} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <cell.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{cell.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cell.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S7 — Mergers, Acquisitions & Transitions */}
      <section id="transitions" className="py-20 lg:py-28 bg-gradient-section scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="mb-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Mergers, Acquisitions & Transitions</span>
          </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Every practice changes hands eventually. How you manage that transition determines what it's worth.</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Whether you are buying a practice, selling one, structuring a partnership, navigating a partner departure, or preparing for a corporate acquisition approach — ownership transitions involve financial, operational, and people complexity that requires specific expertise. Vitalis advises practice owners through every type of ownership change, from the first conversation through to completed transaction.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {transitionCols.map((col, i) => (
              <motion.div key={col.title} {...fadeUp} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <col.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{col.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{col.body}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="mt-8 bg-card/60 rounded-xl p-5 border border-border/30">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vitalis also advises practices that have received unsolicited acquisition approaches — including from DSOs, corporate veterinary consolidators, and physician management organizations — on how to evaluate the offer, understand their alternatives, and negotiate from an informed position.
            </p>
          </motion.div>
        </div>
      </section>

      {/* S8 — Engagement Models */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Engagement Models</span>
          </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Engagement models designed to match your situation.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {engagementTypes.map((type, i) => (
              <motion.div key={type.title} {...fadeUp} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-7 shadow-card border border-border/40">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-display font-bold text-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-secondary/50 px-2 py-1 rounded">{type.duration}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{type.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S9 — Final CTA */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">An independent view of your practice is one of the highest-return investments you can make.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">Most of what Vitalis identifies in a performance assessment was already there — it just wasn't visible. The assessment makes it visible, prioritizes it, and gives you a clear path to acting on it.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild className="whitespace-normal h-auto py-3 text-center leading-snug">
                <Link to="/strategic-assessment">Start Your Performance Assessment <ArrowRight className="ml-2 h-5 w-5 shrink-0" /></Link>
              </Button>
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SolutionsExistingClinics;
