import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  DollarSign,
  Clock,
  TrendingUp,
  ClipboardList,
  FileText,
  MessageSquare,
  Quote,
  ChevronRight,
  Receipt,
  Settings,
  Users,
  PiggyBank,
  Rocket,
  ShieldCheck,
  Compass,
  Building,
  Stethoscope,
  CheckCircle,
  Monitor } from
"lucide-react";
import { usePageMeta } from "@/lib/seo";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};

const dimensions = [
{ num: "1", name: "Billing & Revenue Integrity", detail: "Fee collection rates, claim accuracy, denial patterns, uncaptured charges", icon: Receipt, score: 62 },
{ num: "2", name: "Operational Efficiency", detail: "Patient flow, scheduling utilization, appointment throughput, bottlenecks", icon: Settings, score: 74 },
{ num: "3", name: "Staffing & Workforce", detail: "Role alignment, recruitment gaps, retention risk, cost per staff member", icon: Users, score: 58 },
{ num: "4", name: "Financial Health", detail: "Overhead ratios, profitability by service line, cash flow patterns", icon: PiggyBank, score: 70 },
{ num: "5", name: "Growth Readiness", detail: "Capacity utilization, market positioning, expansion feasibility", icon: Rocket, score: 45 },
{ num: "6", name: "Compliance & Risk", detail: "Regulatory exposure, documentation gaps, liability considerations", icon: ShieldCheck, score: 82 },
{ num: "7", name: "Strategic Direction", detail: "Leadership bandwidth, growth trajectory, long-term planning infrastructure", icon: Compass, score: 53 }];


// Radar chart SVG helper
function SampleRadarChart() {
  const labels = dimensions.map((d) => d.name.split(" ")[0]);
  const scores = dimensions.map((d) => d.score);
  const cx = 150,cy = 150,maxR = 110;
  const n = scores.length;

  const pointsForRadius = (r: number) =>
  Array.from({ length: n }, (_, i) => {
    const angle = Math.PI * 2 * i / n - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  const dataPoints = scores.map((s, i) => {
    const angle = Math.PI * 2 * i / n - Math.PI / 2;
    const r = s / 100 * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const labelPositions = labels.map((_, i) => {
    const angle = Math.PI * 2 * i / n - Math.PI / 2;
    const r = maxR + 22;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
      {[0.25, 0.5, 0.75, 1].map((pct) =>
      <polygon key={pct} points={pointsForRadius(maxR * pct)} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.6} />
      )}
      {Array.from({ length: n }, (_, i) => {
        const angle = Math.PI * 2 * i / n - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos(angle)} y2={cy + maxR * Math.sin(angle)} stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.4} />;
      })}
      <polygon points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="hsl(var(--accent) / 0.2)" stroke="hsl(var(--accent))" strokeWidth="2" />
      {dataPoints.map((p, i) =>
      <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="hsl(var(--accent))" />
      )}
      {labelPositions.map((p, i) =>
      <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground" fontSize="8" fontWeight="500">{labels[i]}</text>
      )}
    </svg>);

}

const StrategicAssessment = () => {
  usePageMeta(
    "Strategic Assessment | Operational & Financial Analysis | Vitalis Health Strategies",
    "A structured assessment across 7 dimensions of practice performance. See where your practice stands and where to focus first.",
    "/og-strategic-assessment.jpg"
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Section 1 — Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
              Find Out What Your Strategic Assessment Reveals About Your Performance.
            </h1>
            <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Most practice owners are too close to day-to-day operations to see clearly where revenue is being left uncollected, where workflows are adding unnecessary cost, or where growth is being blocked. The Vitalis Strategic Assessment gives you an independent, structured view — across seven dimensions of practice performance — in about 15 minutes.
            </p>
            <p className="mt-6 text-sm text-muted-foreground/70 tracking-wide">
              Completed by practices across medical, dental, and veterinary fields in Canada
            </p>
            <div className="mt-10">
              <Button variant="hero" size="xl" asChild>
                <Link to="/strategic-assessment/intake">
                  Begin Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                Complimentary. Confidential. Takes approximately 15 minutes.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — Problem Awareness */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Three patterns we see across almost every practice we assess.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
            { icon: DollarSign, label: "Billing Gaps", text: "Assessments consistently identify fee collection gaps that are not visible from inside the practice — in coding, claim submission, and follow-up processes." },
            { icon: Clock, label: "Workflow Costs", text: "Scheduling inefficiencies and redundant administrative processes are among the most common sources of unnecessary overhead identified in practice assessments." },
            { icon: TrendingUp, label: "Blocked Growth", text: "Practices that want to expand often discover their current staffing structure, capacity model, or technology setup cannot support the next stage without significant rework." }].
            map((item, i) =>
            <motion.div key={item.label} {...fadeUp} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40 text-center">
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{item.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3 — The Seven Dimensions */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">What the assessment examines.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              The Vitalis Strategic Assessment is structured around seven dimensions. Each one is designed to surface issues that are difficult to see without an external, structured review.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dimensions.map((d, i) =>
            <motion.div key={d.num} {...fadeUp} transition={{ delay: i * 0.05 }} className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                    <d.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-accent/70 tracking-wider">0{d.num}</span>
                    <h3 className="font-display text-base font-bold text-foreground mt-0.5 mb-2">{d.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{d.detail}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Two-Path Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Which assessment fits your situation?
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 — Build Strategy */}
            <motion.div {...fadeUp} transition={{ delay: 0 }} className="bg-card rounded-2xl p-6 lg:p-8 shadow-card border-2 border-primary/30 flex flex-col">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-primary/15 text-primary px-3 py-1 rounded-full self-start mb-4">
                Planning a New Practice
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">Build Strategy Assessment</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Designed for practitioners in the planning or early development phase. This assessment evaluates your readiness across feasibility, financial planning, regulatory requirements, facility design, staffing, and operational launch preparation.
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">What you will receive</p>
              <ul className="space-y-2 mb-5">
                {[
                "A readiness summary across six planning dimensions",
                "A prioritized list of decisions to address before committing resources",
                "Guidance on where specialist support is most likely to be needed"].
                map((item) =>
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                )}
              </ul>
              <p className="text-xs text-muted-foreground/70 italic mb-6">
                Ideal for: Practitioners planning a new medical clinic, dental office, or veterinary facility.
              </p>
              <Button variant="hero" size="default" asChild className="w-full mt-auto h-12 whitespace-normal text-center">
                <Link to="/strategic-assessment/intake?path=new-build">
                  Start Your Build Strategy Assessment →
                </Link>
              </Button>
            </motion.div>

            {/* Card 2 — Performance */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 lg:p-8 shadow-card border-2 border-accent/30 flex flex-col">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-accent/15 text-accent px-3 py-1 rounded-full self-start mb-4">
                Existing Practice
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">Performance Assessment</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Designed for established practices seeking an independent view of performance. This assessment examines billing and revenue gaps, workflow efficiency, staffing structure, growth capacity, compliance exposure, and strategic direction.
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">What you will receive</p>
              <ul className="space-y-2 mb-5">
                {[
                "A scored summary across seven performance dimensions",
                "A priority list of the issues most affecting current performance",
                "An indication of where the clearest opportunities for improvement are"].
                map((item) =>
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                )}
              </ul>
              <p className="text-xs text-muted-foreground/70 italic mb-6">
                Ideal for: Practice owners in medical, dental, or veterinary practices seeking an objective operational and financial review.
              </p>
              <Button variant="hero" size="default" asChild className="w-full mt-auto h-12 whitespace-normal text-center">
                <Link to="/strategic-assessment/intake?path=existing">
                  Start Your Performance Assessment →
                </Link>
              </Button>
            </motion.div>

            {/* Card 3 — Healthcare IT */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-6 lg:p-8 shadow-card border-2 border-sky-400/30 flex flex-col">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-sky-500/15 text-sky-600 dark:text-sky-400 px-3 py-1 rounded-full self-start mb-4">
                New or Existing Practice
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">Healthcare IT Assessment</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Focused on IT infrastructure, cybersecurity, EMR systems, and technology operations for healthcare practices — whether you are establishing new systems or improving existing ones.
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">What you will receive</p>
              <ul className="space-y-2 mb-5">
                {[
                "An IT infrastructure and readiness review",
                "A cybersecurity posture assessment",
                "EMR and software optimization guidance"].
                map((item) =>
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                )}
              </ul>
              <p className="text-xs text-muted-foreground/70 italic mb-6">
                Ideal for: Practices needing IT infrastructure planning, cybersecurity review, or EMR advisory.
              </p>
              <Button variant="hero" size="default" asChild className="w-full mt-auto h-12 whitespace-normal text-center">
                <Link to="/strategic-assessment/intake?path=healthcare-it">
                  Start Your Healthcare IT Assessment →
                </Link>
              </Button>
            </motion.div>
          </div>
          <motion.p {...fadeUp} className="text-center mt-8 text-sm text-muted-foreground">
            Not sure which applies?{" "}
            <Link to="/strategic-assessment/intake" className="text-primary hover:text-foreground underline underline-offset-2 transition-colors">
              Start the intake and we will guide you to the right path →
            </Link>
          </motion.p>
        </div>
      </section>

      {/* Section 4 — What You Receive */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              What happens after you complete the assessment.
            </h2>
          </motion.div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-4 sm:gap-0">
            {[
            { icon: ClipboardList, label: "Complete the Assessment", text: "Answer 15 structured questions covering the seven dimensions. Takes approximately 15 minutes." },
            { icon: FileText, label: "Receive Your Practice Health Summary", text: "A summary of your responses mapped across the seven dimensions, with a note on where the assessment identified areas worth examining further." },
            { icon: MessageSquare, label: "Optional: Review With a Vitalis Consultant", text: "If you would like to discuss your results, you can book a complimentary 45-minute consultation with a Vitalis advisor. There is no obligation to engage further." }].
            map((item, i) =>
            <div key={item.label} className="flex flex-col sm:flex-row items-center flex-1">
                <motion.div {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center px-4 max-w-[260px]">
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">{item.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </motion.div>
                {i < 2 &&
              <div className="flex-shrink-0 my-3 sm:my-0 sm:mx-2">
                    <ChevronRight className="h-6 w-6 text-accent/50 hidden sm:block" />
                    <ChevronRight className="h-6 w-6 text-accent/50 rotate-90 sm:hidden" />
                  </div>
              }
              </div>
            )}
          </div>
          <motion.p {...fadeUp} className="text-center mt-12 text-xs text-muted-foreground/70 italic">
            All responses are confidential. Vitalis does not share or publish any practice-level data.
          </motion.p>
        </div>
      </section>

      {/* Sample Scorecard + Radar Chart */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">Sample Practice Health Summary</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              Here's what a scored output looks like — a snapshot of where a practice stands across all seven dimensions.
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 shadow-soft border border-border/40 flex flex-col items-center justify-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-6">Dimension Radar</p>
              <SampleRadarChart />
              <p className="text-xs text-muted-foreground/60 mt-4 italic">Sample data — illustrative only</p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-8 shadow-soft border border-border/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-6">Dimension Scores</p>
              <div className="space-y-4">
                {dimensions.map((d) =>
                <div key={d.num} className="flex items-center gap-3">
                    <d.icon className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground w-40 flex-shrink-0 truncate">{d.name}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                      className="h-full rounded-full"
                      style={{ background: d.score >= 70 ? "hsl(var(--primary))" : d.score >= 50 ? "hsl(var(--accent))" : "hsl(var(--destructive))" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${d.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }} />
                    
                    </div>
                    <span className="text-sm font-bold text-foreground w-10 text-right">{d.score}%</span>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Overall Score</span>
                <span className="text-2xl font-bold text-foreground">{Math.round(dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length)}%</span>
              </div>
              <p className="text-xs text-muted-foreground/60 mt-3 italic">Sample data — illustrative only</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 5 — Authority */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Built by practitioners. Used by practices across Canada.
            </h2>
          </motion.div>
          <motion.p {...fadeUp} className="text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto mb-12">
            The Vitalis Strategic Assessment is built on the same framework our team uses in full Strategic Analysis engagements — across medical clinics, dental practices, and veterinary facilities. It reflects what we have consistently found matters most when evaluating how a practice is performing and where the clearest opportunities for improvement tend to be.
          </motion.p>
          <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 lg:p-10 shadow-soft border border-border/40 max-w-2xl mx-auto">
            <Quote className="h-8 w-8 text-accent/40 mb-4" />
            <blockquote className="text-foreground text-lg italic leading-relaxed mb-4">
              "Going through the assessment gave us a clearer picture of our billing process than three years of internal reviews had."
            </blockquote>
            <p className="text-sm text-muted-foreground">— Practice owner, Calgary (name withheld)</p>
          </motion.div>
        </div>
      </section>

      {/* Section 6 — How It Works */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Three steps. About 15 minutes.
            </h2>
          </motion.div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {[
            { icon: ClipboardList, text: "Complete 15 questions" },
            { icon: FileText, text: "Receive your summary" },
            { icon: MessageSquare, text: "Optional consultation (complimentary)" }].
            map((item, i) =>
            <div key={i} className="flex flex-col sm:flex-row items-center">
                <motion.div {...fadeUp} transition={{ delay: i * 0.08 }} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{item.text}</p>
                </motion.div>
                {i < 2 &&
              <div className="flex-shrink-0 my-2 sm:my-0 sm:ml-6">
                    <ArrowRight className="h-5 w-5 text-accent/40 hidden sm:block" />
                    <ArrowRight className="h-5 w-5 text-accent/40 rotate-90 sm:hidden" />
                  </div>
              }
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 7 — Final CTA */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              The assessment is complimentary. Your results are confidential.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              If you have been wondering where your practice stands — on billing, operations, staffing, growth, or compliance — this is a practical starting point.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment/intake">
                Begin Your Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-6">
              <Link to="/contact" className="text-sm text-primary hover:text-foreground underline underline-offset-2 transition-colors">
                Prefer to speak with someone first? Schedule a call with our team →
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>);

};

export default StrategicAssessment;