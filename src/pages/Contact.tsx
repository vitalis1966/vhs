import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "", interest: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Connect to Supabase
    setTimeout(() => {
      toast.success("Thank you! We'll be in touch shortly.");
      setFormData({ name: "", email: "", phone: "", company: "", interest: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
            Get In Touch
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Let's start a conversation.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Whether you're exploring a new venture, optimizing operations, or planning a transition — we're here to help you think it through.
          </motion.p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-card"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="bg-card"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="bg-card"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Organization</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company or clinic name"
                    className="bg-card"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Area of Interest</label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select an option...</option>
                  <option value="new-clinic">New Clinic Build</option>
                  <option value="operations">Operational Excellence</option>
                  <option value="revenue">Revenue & Finance</option>
                  <option value="growth">Growth Strategy</option>
                  <option value="recruitment">Physician Recruitment</option>
                  <option value="ma">M&A / Exit</option>
                  <option value="audit">Clinic Audit</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Message *</label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your goals, challenges, or questions..."
                  rows={5}
                  className="bg-card"
                />
              </div>
              <Button variant="hero" size="lg" type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Reach Us Directly</h3>
                <div className="space-y-4 text-muted-foreground text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Calgary, Alberta, Canada</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>info@vitalisstrategies.com</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="font-display text-base font-semibold text-foreground mb-2">Prefer an audit first?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our clinic audit gives you a clear picture before committing to consulting.
                </p>
                <Button variant="hero-outline" size="default" asChild>
                  <Link to="/clinic-audit">Start a Clinic Audit</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
