import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThreePsSection } from "@/components/home/ThreePsSection";
import { CredibilitySection } from "@/components/home/CredibilitySection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePageMeta } from "@/lib/seo";
import { JsonLd, organizationSchema, buildBreadcrumbSchema } from "@/components/JsonLd";

const team = [
  {
    name: "Dr. Sarah Chen",
    title: "Founder & Principal Advisor",
    bio: "Healthcare strategist with deep experience in practice development, operational planning, and long-term advisory across Calgary and Canada.",
    expertise: ["Practice Development", "Strategic Advisory", "Operational Excellence"],
    image: "/placeholder.svg",
    fallback: "SC",
  },
  {
    name: "Michael Hart",
    title: "Senior Advisory Lead",
    bio: "Supports practitioner-led organizations with growth strategy, service expansion, and performance planning for multi-stage healthcare ventures.",
    expertise: ["Growth Strategy", "Practice Performance", "Roadmap Development"],
    image: "/placeholder.svg",
    fallback: "MH",
  },
  {
    name: "Priya Nand",
    title: "Operations & Implementation Advisor",
    bio: "Focuses on workflow redesign, staffing models, and implementation support to ensure strategic plans translate into measurable outcomes.",
    expertise: ["Workflow Design", "Staffing Models", "Implementation Support"],
    image: "/placeholder.svg",
    fallback: "PN",
  },
];

const contentBlocks = [
  {
    heading: "How We Work",
    body: "We begin every engagement with a structured assessment — a clear-eyed look at where a practice stands across revenue, operations, staffing, growth capacity, and compliance. From there, we build a prioritized plan and work alongside the practice owner to implement it. We do not hand over a document and disappear.",
  },
  {
    heading: "Who We Work With",
    body: "We work with private medical clinics, dental practices, and veterinary facilities across Canada — at every stage of their development. Whether a practitioner is opening their first facility, optimizing an established practice, or navigating a significant operational change, Vitalis brings the same structured, accountable approach.",
  },
  {
    heading: "What Makes Us Different",
    body: "Most consulting firms advise from the outside. Vitalis was built from the inside. Our team has managed clinic operations, handled physician recruitment, worked through compliance audits, and made the same decisions our clients face. That operational experience is not a credential we list — it is how we think.",
  },
];

const About = () => {
  usePageMeta(
    "About Vitalis Health Strategies | Clinician-Led Practice Consulting | Calgary, Alberta",
    "Founded by clinicians and healthcare executives. Vitalis brings operational experience — not just advice — to every practice engagement.",
    "/og-about.jpg"
  );

  return (
    <div className="min-h-screen">
      <JsonLd data={organizationSchema} />
      <JsonLd data={buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">About Vitalis</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Built by Clinicians. Focused on Practice Performance.
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-8 space-y-6 text-lg text-muted-foreground leading-relaxed max-w-3xl">
            <p>Vitalis Health Strategies was founded by clinicians and healthcare executives who spent years watching skilled practitioners struggle with the operational and financial side of running a practice.</p>
            <p>The advice available to clinic, dental office, and veterinary practice owners was generic, expensive, and disconnected from day-to-day clinical reality. Vitalis was built to be different.</p>
            <p>Every recommendation we make comes from a team that has operated practices, hired practitioners, navigated regulatory compliance, designed facilities, and built teams from the ground up. We do not produce reports that sit on shelves. Every engagement ends with an actionable plan and a team that stays accountable to outcomes.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {contentBlocks.map((block, i) => (
              <motion.div key={block.heading} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">{block.heading}</h2>
                <p className="text-muted-foreground leading-relaxed">{block.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4Ps Framework — moved from homepage */}
      <ThreePsSection />

      {/* Full credibility / differentiators — moved from homepage */}
      <CredibilitySection variant="full" />

      {/* Our Team section hidden */}

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Work With a Team That Has Been There</h2>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Connect With Our Team <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
