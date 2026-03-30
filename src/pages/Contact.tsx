import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, MapPin, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { usePageMeta } from "@/lib/seo";
import { JsonLd, buildBreadcrumbSchema } from "@/components/JsonLd";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  usePageMeta(
    "Contact Vitalis Health Strategies | Healthcare Consulting Calgary",
    "Connect with Vitalis Health Strategies to discuss your practice goals, challenges, or opportunities. Calgary-based healthcare consulting.",
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    interest: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState({ name: "", email: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: fnError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          area_of_interest: formData.interest,
          message: formData.message,
        },
      });
      if (fnError) throw fnError;
      setSubmittedInfo({ name: formData.name, email: formData.email });
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", organization: "", interest: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again or email us directly at info@vitalisstrategies.com");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <JsonLd data={buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-6">
            <span className="h-px w-12 bg-accent" />
            <span className="text-accent font-semibold tracking-widest uppercase text-sm">Get In Touch</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            Let's start a conversation.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Whether you're exploring a new venture, looking for an objective view of operations, or planning a transition — we're here to help you think it through.
          </motion.p>
        </div>
      </section>

      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <BookingWidget />
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl" style={{ backgroundColor: "#F5F2EC" }}>
                <div className="h-16 w-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#1C3D2E" }}>
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-3" style={{ color: "#1C3D2E" }}>Message sent.</h2>
                <p className="text-muted-foreground leading-relaxed max-w-md mb-2">
                  Thank you, {submittedInfo.name}. We have received your message and will be in touch within one business day.
                </p>
                <p className="text-sm text-muted-foreground">A confirmation has been sent to {submittedInfo.email}.</p>
              </motion.div>
            ) : (
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
                    <Input required disabled={submitting} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className="bg-card" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                    <Input required type="email" disabled={submitting} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="bg-card" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                    <Input disabled={submitting} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(555) 000-0000" className="bg-card" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Organization</label>
                    <Input disabled={submitting} value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} placeholder="Practice or organization name" className="bg-card" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Area of Interest</label>
                  <select
                    disabled={submitting}
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    <option value="">Select an option...</option>
                    <option value="new-practice">New Practice Build</option>
                    <option value="operations">Operational Excellence</option>
                    <option value="revenue">Revenue & Finance</option>
                    <option value="growth">Growth Strategy</option>
                    <option value="recruitment">Practitioner Recruitment</option>
                    <option value="ma">M&A / Transition</option>
                    <option value="healthcare-it">Healthcare IT & Technology</option>
                    <option value="people">People Management</option>
                    <option value="assessment">Strategic Assessment</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message *</label>
                  <Textarea required disabled={submitting} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about your goals, challenges, or questions..." rows={5} className="bg-card" />
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button variant="hero" size="lg" type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.form>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-8">
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
                <h3 className="font-display text-base font-semibold text-foreground mb-2">Prefer an assessment first?</h3>
                <p className="text-sm text-muted-foreground mb-4">Our strategic assessment gives you a clear picture before committing to consulting.</p>
                <Button variant="hero-outline" size="default" asChild>
                  <Link to="/strategic-assessment">Start Your Strategic Assessment</Link>
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