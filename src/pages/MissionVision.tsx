import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";
import { usePageMeta } from "@/lib/seo";

const values = [
  { title: "Strategic Depth", description: "We bring full-lifecycle perspective to every engagement. Advice grounded in an understanding of how early decisions shape long-term outcomes." },
  { title: "Coordinated Advisory", description: "Healthcare projects succeed when decisions are aligned. We help coordinate the advisors, partners, and specialists involved in complex healthcare ventures." },
  { title: "Practitioner-Centered", description: "Practitioners carry the clinical, operational, and financial responsibilities of practice ownership. Our work is designed to reduce that burden, not add to it." },
  { title: "Operational Integrity", description: "Strategy without execution is incomplete. We focus on recommendations that are realistic, actionable, and built around the specific context of each organization." },
  { title: "Long-Term Relationships", description: "We build lasting partnerships with our clients — not transactional engagements. The goal is to become a trusted advisor that organizations turn to as they grow and evolve." },
  { title: "Honest Counsel", description: "Healthcare leaders need candid advice, not confirmation of prior decisions. We provide honest strategic guidance even when it involves difficult conversations." },
];

const MissionVision = () => {
  usePageMeta(
    "Mission & Vision | Vitalis Health Strategies | Calgary Healthcare Consulting",
    "Why Vitalis exists — our mission to help healthcare organizations build, operate, and grow successful practices across Alberta and Canada."
  );
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Mission & Vision</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">Why Vitalis exists.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">Healthcare organizations deserve strategic partners who understand the entire picture — not specialists who see only their corner of it. That belief shapes everything we do.</motion.p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-10 shadow-card border border-border/40">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6"><Target className="h-6 w-6 text-primary" /></div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">Our Mission</p>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-6 leading-snug">To help healthcare organizations build, operate, and grow successful practices.</h2>
              <p className="text-muted-foreground leading-relaxed">Through thoughtful strategy, operational excellence, and coordinated advisory support — we help practitioners and healthcare organizations turn complex challenges into lasting achievements.</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">Based in Calgary, Vitalis Health Strategies works with practitioners and healthcare organizations across Alberta to design, launch, and optimize successful practices.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-gradient-forest rounded-2xl p-10 shadow-elevated text-primary-foreground">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-6"><Eye className="h-6 w-6 text-primary-foreground" /></div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70 mb-3">Our Vision</p>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground mb-6 leading-snug">To be the definitive strategic partner for healthcare organizations across Alberta.</h2>
              <p className="text-primary-foreground/85 leading-relaxed">We envision a healthcare landscape where practitioners and practice leaders have access to coordinated, high-quality strategic guidance at every stage of their journey — reducing the friction of building and growing healthcare organizations.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <div className="flex justify-center mb-6"><div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center"><Heart className="h-6 w-6 text-primary" /></div></div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">How we approach our work</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">These principles guide every engagement — from initial conversations to long-term advisory relationships.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bg-card rounded-2xl p-7 shadow-soft border border-border/40">
                <h3 className="font-display text-lg font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">Ready to begin a conversation?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">Every long-term advisory relationship begins with an initial conversation. No commitment required.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="hero" size="xl" asChild><Link to="/contact">Speak With Our Team <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
              <Button variant="hero-outline" size="xl" asChild><Link to="/about">Learn About Vitalis</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MissionVision;
