import { useRef, useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Scale,
  Laptop2,
  Home,
  Landmark,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Settings,
  MapPin,
  X,
  Check,
} from "lucide-react";
import { usePageMeta } from "@/lib/seo";

// ATB logo: Upload to replace src="" on img#atb-logo — expected format: PNG or SVG, white or dark background version
// Holland logo: Upload to replace src="" on img#holland-logo — expected format: PNG or SVG, white or dark background version
// Alternatively, logos can be placed in /public/logos/ and referenced as src="/logos/atb.png" and src="/logos/holland.png"

const ecosystemPartners = [
  { icon: Landmark, label: "Financial Institutions", angle: 0 },
  { icon: Scale, label: "Legal Advisors", angle: 60 },
  { icon: Building2, label: "Architecture & Design", angle: 120 },
  { icon: Home, label: "Real Estate Advisors", angle: 180 },
  { icon: Laptop2, label: "Technology Providers", angle: 240 },
  { icon: Briefcase, label: "Operational Consultants", angle: 300 },
];

const coordinationProblems = [
  {
    heading: "Facility design that doesn't match operations",
    body: "Architects optimise for aesthetics and code compliance. They rarely know how a specific clinical model runs day-to-day. Without operational input during design, practices frequently open with layouts that create workflow problems they spend years trying to work around.",
  },
  {
    heading: "Technology selected after the building is built",
    body: "EMR selection, network infrastructure, and medical gas requirements all have physical implications — conduit placement, room dimensions, power requirements. Selecting technology after construction decisions are locked in creates retrofitting costs that are consistently underestimated.",
  },
  {
    heading: "Financial structure that doesn't match the operating model",
    body: "How a practice is legally and financially structured affects everything from tax treatment to partnership entry to eventual sale value. Structures designed by a banker without legal and operational input frequently require expensive restructuring within 3–5 years.",
  },
];

const statsStrip = [
  { label: "Financial", desc: "Banking, capital planning & healthcare financing" },
  { label: "Legal", desc: "Corporate structure, partnerships & transactions" },
  { label: "Design", desc: "Healthcare facility planning & clinical environments" },
  { label: "Technology", desc: "EMR, IT infrastructure & digital systems" },
];

const referralPoints = [
  "You receive a name and phone number",
  "Each advisor operates independently",
  "Conflicts between advisors surface after the fact",
  "You manage communication across 6+ relationships",
  "No one is responsible for the integrated outcome",
];

const ecosystemPoints = [
  "You engage one strategic relationship",
  "All advisors are briefed on your goals and constraints",
  "Decisions are reviewed for alignment before they're made",
  "Vitalis manages the coordination layer",
  "Vitalis is accountable for the strategic outcome",
];

const Partners = () => {
  usePageMeta(
    "The Vitalis Ecosystem | Strategic Healthcare Advisory Partners | Vitalis Health Strategies",
    "The Vitalis Ecosystem connects medical, dental, and veterinary practices with trusted financial, legal, design, and technology partners — coordinated through one strategic relationship."
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const recalcLines = useCallback(() => {
    if (!containerRef.current || !hubRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const hRect = hubRef.current.getBoundingClientRect();
    const hubCenterX = hRect.left - cRect.left + hRect.width / 2;
    const hubCenterY = hRect.top - cRect.top + hRect.height / 2;
    setContainerSize({ width: cRect.width, height: cRect.height });

    const newLines = nodeRefs.current.map((node) => {
      if (!node) return { x1: hubCenterX, y1: hubCenterY, x2: hubCenterX, y2: hubCenterY };
      const nRect = node.getBoundingClientRect();
      return {
        x1: hubCenterX,
        y1: hubCenterY,
        x2: nRect.left - cRect.left + nRect.width / 2,
        y2: nRect.top - cRect.top + nRect.height / 2,
      };
    });
    setLines(newLines);
  }, []);

  useEffect(() => {
    const timer = setTimeout(recalcLines, 100);
    window.addEventListener("resize", recalcLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", recalcLines);
    };
  }, [recalcLines]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* SECTION 1 — Hero */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
            THE VITALIS ECOSYSTEM
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            One relationship. Every specialist you need.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Physicians and practice owners navigating a new build, a transition, or a growth challenge typically need 6–8 different specialists — each with their own agenda, timeline, and communication style. Vitalis coordinates them. You deal with one team.
          </motion.p>

          {/* Stats Strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsStrip.map((stat) => (
              <div key={stat.label} className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border/40">
                <p className="font-display text-lg font-bold text-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-snug">{stat.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button variant="hero" size="xl" asChild>
              <Link to="/strategic-assessment">Start Your Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — The Coordination Problem */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Why coordination matters more than any individual advisor.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-3xl mx-auto">
              The most expensive mistakes in healthcare development happen at the handoffs — where one advisor's decisions conflict with another's.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {coordinationProblems.map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-5">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{problem.heading}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{problem.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center text-muted-foreground italic max-w-3xl mx-auto leading-relaxed"
          >
            Vitalis sits at the intersection of all of these decisions — not as a referral service, but as a coordinator with enough operational knowledge to catch misalignments before they become expensive.
          </motion.p>
        </div>
      </section>

      {/* SECTION 3 — Hub Visual */}
      <section className="py-20 lg:py-28 bg-gradient-section overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Your strategic hub for healthcare advisory.</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">Rather than managing multiple disconnected advisors, Vitalis serves as the central coordinator — ensuring all expertise aligns with your strategic goals.</p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative max-w-4xl mx-auto">
            {/* Desktop */}
            <div className="hidden lg:block relative h-[520px]" ref={containerRef}>
              {containerSize.width > 0 && (
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox={`0 0 ${containerSize.width} ${containerSize.height}`} preserveAspectRatio="none">
                  {lines.map((line, i) => (
                    <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
                  ))}
                </svg>
              )}

              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" ref={hubRef}>
                <div className="w-40 h-40 rounded-full bg-gradient-forest flex flex-col items-center justify-center text-primary-foreground shadow-elevated">
                  <span className="font-display text-2xl font-bold">Vitalis</span>
                  <span className="text-xs uppercase tracking-wider opacity-80 mt-1">Strategic Hub</span>
                </div>
              </motion.div>

              {ecosystemPartners.map((partner, i) => {
                const angleRad = (partner.angle - 90) * (Math.PI / 180);
                const x = 50 + Math.cos(angleRad) * 36;
                const y = 50 + Math.sin(angleRad) * 36;
                return (
                  <motion.div key={partner.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }} className="absolute z-10" style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }} ref={(el) => { nodeRefs.current[i] = el; }}>
                    <div className="bg-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-300 border border-border/40 text-center min-w-[150px]">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                        <partner.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-foreground leading-tight block">{partner.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile */}
            <div className="lg:hidden">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-forest rounded-2xl p-8 text-primary-foreground text-center mb-8 shadow-elevated">
                <span className="font-display text-2xl font-bold">Vitalis</span>
                <span className="block text-xs uppercase tracking-wider opacity-80 mt-1 mb-3">Strategic Hub</span>
                <p className="text-sm leading-relaxed opacity-85">Coordinating trusted partners for your healthcare venture</p>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                {ecosystemPartners.map((partner, i) => (
                  <motion.div key={partner.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-xl p-4 shadow-soft border border-border/40 text-center">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
                      <partner.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{partner.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — Featured Partners */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Trusted professionals in the Vitalis ecosystem.</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">These are established relationships — not referrals. Vitalis has worked alongside each of these organizations on healthcare advisory engagements.</p>
          </div>

          {/* ATB Financial */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden mb-6">
            <div className="grid lg:grid-cols-12 gap-0">
              <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">FINANCIAL PARTNER</p>
                <div id="atb-logo-container" className="w-40 h-16 bg-background rounded-lg p-3 border border-border/30 flex items-center justify-center mb-4">
                  <img id="atb-logo" src="" alt="ATB Financial" className="max-w-full max-h-full object-contain" />
                  <span className="text-xs text-muted-foreground/50">Logo to be uploaded</span>
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">ATB Financial</h3>
                <p className="text-sm text-muted-foreground mt-2">Healthcare & Private Wealth</p>
              </div>
              <div className="lg:col-span-8 p-8 lg:p-10">
                <p className="text-muted-foreground leading-relaxed mb-6">ATB's Healthcare and Private Wealth teams support physicians and healthcare organizations with financing, capital planning, and financial strategy. They understand the unique financial needs of healthcare ventures — from clinic development financing to practice acquisition and long-term wealth planning.</p>
                <div className="bg-secondary/30 rounded-xl p-5">
                  <h4 className="font-semibold text-foreground mb-3">Vitalis collaborates with ATB to support:</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Clinic development financing", "Facility builds and expansion", "Financial restructuring", "Growth and acquisition planning"].map((item) => (
                      <div key={item} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /><span className="text-sm text-muted-foreground">{item}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Holland Design */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden mb-6">
            <div className="grid lg:grid-cols-12 gap-0">
              <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">ARCHITECTURE & DESIGN</p>
                <div id="holland-logo-container" className="w-40 h-16 bg-background rounded-lg p-3 border border-border/30 flex items-center justify-center mb-4">
                  <img id="holland-logo" src="" alt="Holland Design" className="max-w-full max-h-full object-contain" />
                  <span className="text-xs text-muted-foreground/50">Logo to be uploaded</span>
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Holland Design</h3>
                <p className="text-sm text-muted-foreground mt-2">Healthcare Environments</p>
              </div>
              <div className="lg:col-span-8 p-8 lg:p-10">
                <p className="text-muted-foreground leading-relaxed mb-6">Holland Design specializes in healthcare facility planning and design. They create clinical environments that balance patient experience, operational efficiency, regulatory compliance, and long-term flexibility for growth.</p>
                <div className="bg-secondary/30 rounded-xl p-5">
                  <h4 className="font-semibold text-foreground mb-3">Vitalis works with Holland Design to ensure practice layouts support:</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Patient flow and experience", "Operational workflows", "Staffing models and efficiency", "Long-term practice growth"].map((item) => (
                      <div key={item} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /><span className="text-sm text-muted-foreground">{item}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Field Law */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-0">
              <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">LEGAL PARTNER</p>
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
                  <Scale className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Field Law</h3>
                <p className="text-sm text-muted-foreground mt-2">Legal Advisory Services</p>
              </div>
              <div className="lg:col-span-8 p-8 lg:p-10">
                <p className="text-muted-foreground leading-relaxed mb-6">Field Law provides legal advisory services relevant to healthcare ventures and organizations. Their expertise spans corporate structuring, regulatory guidance, partnership agreements, and transaction support for healthcare businesses.</p>
                <div className="bg-secondary/30 rounded-xl p-5">
                  <h4 className="font-semibold text-foreground mb-3">Vitalis works with legal partners to ensure alignment in:</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {["Business structure and governance", "Regulatory and compliance considerations", "Partnership and shareholder agreements", "Transaction and acquisition support"].map((item) => (
                      <div key={item} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-accent flex-shrink-0" /><span className="text-sm text-muted-foreground">{item}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — Additional Categories */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Additional specialists in the ecosystem.</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">Beyond featured partners, Vitalis coordinates with trusted professionals across additional categories based on project needs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Real Estate Advisors", description: "Site selection, lease negotiation, property acquisition, and location strategy for healthcare facilities." },
              { icon: Laptop2, title: "Technology Providers", description: "EMR systems, practice management software, IT infrastructure, cybersecurity, and digital health solutions." },
              { icon: Settings, title: "Operational Consultants", description: "Workflow optimization, process improvement, staffing design, and operational excellence specialists." },
            ].map((category, i) => (
              <motion.div key={category.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5"><category.icon className="h-6 w-6 text-primary" /></div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{category.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Why This Model Works */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">The difference between coordination and referral.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Referral Column */}
            <div className="bg-muted/50 rounded-2xl p-8 border border-border/40">
              <h3 className="font-display text-xl font-bold text-muted-foreground mb-6">A referral</h3>
              <ul className="space-y-4">
                {referralPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ecosystem Column */}
            <div className="bg-accent/10 rounded-2xl p-8 border border-accent/30">
              <h3 className="font-display text-xl font-bold text-accent mb-6">The Vitalis ecosystem</h3>
              <ul className="space-y-4">
                {ecosystemPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Final CTA */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">The right specialists, coordinated from the start.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">Whether you are planning a new practice or navigating a major transition, Vitalis connects you with the right expertise — and makes sure everyone is working toward the same outcome.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="hero" size="xl" asChild>
                <Link to="/strategic-assessment">Start Your Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
