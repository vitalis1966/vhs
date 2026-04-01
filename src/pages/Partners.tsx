import { useRef, useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building,
  Scale,
  Monitor,
  MapPin,
  Ruler,
  ShieldCheck,
  Landmark,
  CheckCircle,
} from "lucide-react";
import { usePageMeta } from "@/lib/seo";
import atbLogo from "@/assets/atb-logo.png";
import hollandLogo from "@/assets/holland-logo.svg";

/* ── Ecosystem spoke data ── */
const ecosystemSpokes = [
  { icon: Landmark, label: "Financial Institutions", angle: 0 },
  { icon: MapPin, label: "Real Estate Advisors", angle: 60 },
  { icon: Scale, label: "Legal Advisors", angle: 120 },
  { icon: Ruler, label: "Architecture & Design", angle: 180 },
  { icon: Monitor, label: "Technology Providers", angle: 240 },
  { icon: ShieldCheck, label: "Insurance & Risk", angle: 300 },
];

/* ── Partner category cards ── */
const partnerCategories = [
  {
    icon: Building,
    title: "Financial Institutions",
    hook: "The capital behind every clinic build, acquisition, and growth move.",
    items: [
      "Healthcare lending & development financing",
      "Practice acquisition capital",
      "Financial restructuring & planning",
    ],
  },
  {
    icon: MapPin,
    title: "Real Estate Advisors",
    hook: "The right location changes everything. The wrong lease can cost you years.",
    items: [
      "Site selection & market analysis",
      "Lease negotiation & tenant advisory",
      "Property acquisition strategy",
    ],
  },
  {
    icon: Scale,
    title: "Legal Advisors",
    hook: "Business structure, governance, and transactions done right from the start.",
    items: [
      "Corporate structure & partnership agreements",
      "Regulatory & compliance guidance",
      "M&A and transaction support",
    ],
  },
  {
    icon: Ruler,
    title: "Architecture & Design",
    hook: "Clinical spaces that work for patients, practitioners, and regulators.",
    items: [
      "Healthcare facility planning & design",
      "Regulatory compliance & accreditation layouts",
      "Patient flow & operational efficiency",
    ],
  },
  {
    icon: Monitor,
    title: "Technology Providers",
    hook: "The systems your practice runs on — selected and implemented without the chaos.",
    items: [
      "EMR selection & implementation",
      "IT infrastructure & cybersecurity",
      "Digital health & practice management tools",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Insurance & Risk",
    hook: "Every practice needs it. Few get it right without guidance.",
    items: [
      "Malpractice & professional liability",
      "Business interruption & property coverage",
      "Risk structure tailored to your practice type",
    ],
  },
];

/* ── How it works cards ── */
const coordinationCards = [
  {
    title: "One conversation",
    body: "You speak to Vitalis. We brief every specialist on your goals, your constraints, and what everyone else is doing — so you never repeat yourself.",
  },
  {
    title: "Shared context",
    body: "Your architect, banker, and lawyer all work from the same strategic plan. Decisions compound instead of conflict.",
  },
  {
    title: "Aligned incentives",
    body: "Every specialist in the ecosystem is accountable to your outcome — not just their own deliverable. That changes how they show up.",
  },
  {
    title: "No gaps, no surprises",
    body: "When specialists work in silos, things fall through the cracks. When Vitalis coordinates them, nothing does.",
  },
];

/* ── Featured partners ── */
const featuredPartners = [
  {
    category: "FINANCIAL PARTNER",
    name: "ATB Financial",
    subtitle: "Healthcare & Wealth",
    hook: "The financial institution that understands what it actually costs to build and run a healthcare practice.",
    description:
      "ATB's Healthcare and Wealth teams support physicians and healthcare organizations with financing, capital planning, and financial strategy. They understand the unique financial needs of healthcare ventures — from clinic development financing to practice acquisition and long-term wealth planning.",
    bullets: [
      "Clinic development financing",
      "Facility builds and expansion",
      "Financial restructuring",
      "Growth and acquisition planning",
    ],
    logo: atbLogo as string,
    logoAlt: "ATB Financial",
    externalUrl: "https://www.atb.com/business/borrowing/business-loans/professional-practice-financing/",
  },
  {
    category: "ARCHITECTURE & DESIGN",
    name: "Holland Design",
    subtitle: "Healthcare Environments & Facilities",
    hook: "The design team that knows clinical environments don't just need to look good — they need to work.",
    description:
      "Holland Design specializes in healthcare facility planning and design. They create clinical environments that balance patient experience, operational efficiency, regulatory compliance, and long-term flexibility for growth.",
    bullets: [
      "Patient flow and experience",
      "Operational workflows",
      "Staffing models and efficiency",
      "Long-term practice growth",
    ],
    logo: hollandLogo as string,
    logoAlt: "Holland Design",
    externalUrl: "https://www.hollanddesign.ca/",
  },
  {
    category: "LEGAL PARTNER",
    name: "Field Law",
    subtitle: "Legal Advisory Services",
    hook: "Legal advisors who understand that healthcare transactions are different from every other kind.",
    description:
      "Field Law provides legal advisory services relevant to healthcare ventures and organizations. Their expertise spans corporate structuring, regulatory guidance, partnership agreements, and transaction support for healthcare businesses.",
    bullets: [
      "Business structure and governance",
      "Regulatory and compliance considerations",
      "Partnership and shareholder agreements",
      "Transaction and acquisition support",
    ],
    logo: null,
    logoAlt: "",
    externalUrl: null,
  },
];

const Partners = () => {
  usePageMeta(
    "The Vitalis Ecosystem | Strategic Healthcare Advisory Partners | Vitalis Health Strategies",
    "The Vitalis Ecosystem connects medical, dental, and veterinary practices with trusted financial, legal, design, and technology partners — coordinated through one strategic relationship."
  );

  /* ── Hub-and-spoke line calculation ── */
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

      {/* ═══ SECTION 1 — Hero ═══ */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">THE VITALIS ECOSYSTEM</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
          >
            Building a practice takes more than one expert.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            Vitalis sits at the centre of your advisory team — coordinating the specialists you need so every decision is aligned, every relationship is briefed, and nothing falls through the cracks.
          </motion.p>
        </div>
      </section>

      {/* ═══ SECTION 2 — The Problem ═══ */}
      <section className="py-20 lg:py-28 bg-gradient-forest">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl lg:text-4xl font-bold text-primary-foreground leading-snug"
          >
            "Most practice owners spend more time managing their advisors than running their practice."
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-8 text-base lg:text-lg text-primary-foreground/70 leading-relaxed max-w-3xl mx-auto"
          >
            A new clinic build alone typically requires a banker, an architect, a real estate advisor, a lawyer, a technology vendor, and an operational consultant — each working independently, often at cross-purposes. Vitalis changes that.
          </motion.p>
        </div>
      </section>

      {/* ═══ SECTION 3 — Ecosystem Diagram ═══ */}
      <section className="py-20 lg:py-28 bg-gradient-section overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Desktop hub-and-spoke */}
            <div className="hidden lg:block relative h-[520px]" ref={containerRef}>
              {containerSize.width > 0 && (
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
                  preserveAspectRatio="none"
                >
                  {lines.map((line, i) => (
                    <line
                      key={i}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="hsl(var(--accent))"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      opacity="0.5"
                    />
                  ))}
                </svg>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                ref={hubRef}
              >
                <div className="w-40 h-40 rounded-full bg-gradient-forest flex flex-col items-center justify-center text-primary-foreground shadow-elevated">
                  <span className="font-display text-2xl font-bold">Vitalis</span>
                  <span className="text-xs uppercase tracking-wider opacity-80 mt-1">Strategic Hub</span>
                </div>
              </motion.div>

              {ecosystemSpokes.map((spoke, i) => {
                const angleRad = (spoke.angle - 90) * (Math.PI / 180);
                const x = 50 + Math.cos(angleRad) * 36;
                const y = 50 + Math.sin(angleRad) * 36;
                return (
                  <motion.div
                    key={spoke.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                    className="absolute z-10"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                  >
                    <div className="bg-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-300 border border-border/40 text-center min-w-[150px]">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                        <spoke.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-foreground leading-tight block">{spoke.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile: stacked grid */}
            <div className="lg:hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-forest rounded-2xl p-8 text-primary-foreground text-center mb-8 shadow-elevated"
              >
                <span className="font-display text-2xl font-bold">Vitalis</span>
                <span className="block text-xs uppercase tracking-wider opacity-80 mt-1">Strategic Hub</span>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                {ecosystemSpokes.map((spoke, i) => (
                  <motion.div
                    key={spoke.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card rounded-xl p-4 shadow-soft border border-border/40 text-center"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
                      <spoke.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{spoke.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center text-muted-foreground text-lg"
          >
            One relationship with Vitalis connects you to all of them.
          </motion.p>
        </div>
      </section>

      {/* ═══ SECTION 4 — Partner Category Cards ═══ */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">WHO WE COORDINATE</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Every specialist your practice needs — already in your corner.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-2xl p-7 shadow-soft border border-border/40"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <cat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{cat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cat.hook}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">What they handle for you:</p>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 — Featured Partners ═══ */}
      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">ESTABLISHED RELATIONSHIPS</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Not referrals. Working relationships.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              These organizations have worked alongside Vitalis on real client engagements. When they come to your project, they already know the context.
            </p>
          </div>

          <div className="space-y-6">
            {featuredPartners.filter(p => p.category !== "LEGAL PARTNER").map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl shadow-card border border-border overflow-hidden"
              >
                <div className="grid lg:grid-cols-12 gap-0">
                  {/* Left panel */}
                  <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border/30">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">{partner.category}</p>
                    {partner.logo ? (
                      <div className={cn("w-40 flex items-center justify-center mb-4", partner.name === "ATB Financial" ? "h-20" : "h-14")}>
                        {partner.externalUrl ? (
                          <a href={partner.externalUrl} target="_blank" rel="noopener noreferrer">
                            <img src={partner.logo} alt={partner.logoAlt} className={cn("object-contain bg-transparent", partner.name === "ATB Financial" ? "max-h-16 w-auto h-auto" : "max-w-full max-h-full")} />
                          </a>
                        ) : (
                          <img src={partner.logo} alt={partner.logoAlt} className={cn("object-contain bg-transparent", partner.name === "ATB Financial" ? "max-h-16 w-auto h-auto" : "max-w-full max-h-full")} />
                        )}
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
                        <Scale className="h-8 w-8 text-primary-foreground" />
                      </div>
                    )}
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{partner.subtitle}</p>
                  </div>
                  {/* Right panel */}
                  <div className="lg:col-span-8 p-8 lg:p-10">
                    <p className="font-display text-base font-semibold text-foreground mb-4 italic">{partner.hook}</p>
                    <p className="text-muted-foreground leading-relaxed mb-6">{partner.description}</p>
                    <div className="bg-secondary/30 rounded-xl p-5">
                      <h4 className="font-semibold text-foreground mb-3">Vitalis collaborates with {partner.name} to support:</h4>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {partner.bullets.map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6 — How It Works ═══ */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-12 bg-accent" />
              <span className="text-accent font-semibold tracking-widest uppercase text-sm">ONE ECOSYSTEM</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              You talk to us. We coordinate everyone else.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {coordinationCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 shadow-sm border border-border/40"
              >
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7 — CTA ═══ */}
      <section className="py-20 lg:py-28 bg-gradient-forest">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
              The right specialists. Coordinated from day one.
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Whether you're planning a new practice, navigating a transition, or ready to scale — Vitalis brings in who you need and makes sure everyone is working toward the same outcome.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="xl" asChild>
                <Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="hero-outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground" asChild>
                <Link to="/strategic-assessment">Start Your Practice Assessment <ArrowRight className="ml-2 h-5 w-5" /></Link>
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
