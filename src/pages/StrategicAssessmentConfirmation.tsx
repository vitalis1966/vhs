import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Building2, TrendingUp, Compass } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const trackContent = {
  new_clinic_build: {
    icon: Building2,
    color: "bg-primary/15",
    iconColor: "text-primary",
    title: "Clinic Build Readiness Assessment",
    description:
      "Based on your answers, we've identified the New Clinic Strategic Assessment as the most relevant path for you. This assessment is designed for physicians and healthcare organizations planning a new clinic, healthcare space, or practice launch.",
    next: "Click below to begin your assessment. Your progress will be saved automatically — you can complete it at your own pace.",
  },
  existing_clinic: {
    icon: TrendingUp,
    color: "bg-accent/15",
    iconColor: "text-accent",
    title: "Practice Performance Assessment",
    description:
      "Based on your answers, we've identified the Existing Clinic Strategic Assessment as the most relevant path for you. This assessment is designed for clinic owners looking to evaluate performance, optimize operations, or plan strategic growth.",
    next: "Click below to begin your assessment. Your progress will be saved automatically — you can complete it at your own pace.",
  },
  needs_review: {
    icon: Compass,
    color: "bg-accent/15",
    iconColor: "text-accent",
    title: "Your Strategic Assessment Is Being Prepared",
    description:
      "We're finalizing the most relevant assessment path for your situation and will provide secure access shortly.",
    next: "A member of the Vitalis team will follow up with you to discuss your needs and guide you to the right assessment.",
  },
};

const StrategicAssessmentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const track = (searchParams.get("track") || "unknown") as keyof typeof trackContent;
  const token = searchParams.get("token");
  const content = trackContent[track] || trackContent.unknown;
  const Icon = content.icon;

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Thank You
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Your Strategic Assessment intake has been submitted successfully.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <motion.div {...fadeUp} className="bg-card rounded-2xl p-8 lg:p-10 shadow-card border border-border/40">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl ${content.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-7 w-7 ${content.iconColor}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-accent uppercase tracking-wider mb-1">Your Assessment Path</p>
                <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground">{content.title}</h2>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{content.description}</p>

            <div className="bg-secondary/50 rounded-xl p-5 mb-8">
              <h3 className="font-display text-sm font-bold text-foreground mb-2 uppercase tracking-wider">What Happens Next</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{content.next}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {token ? (
                <Button variant="hero" size="lg" asChild className="flex-1">
                  <Link to={`/assessment/${token}`}>
                    Continue to Your Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button variant="hero" size="lg" disabled className="flex-1 opacity-70">
                  Continue to Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button variant="outline" size="lg" asChild className="flex-1">
                <Link to="/">Return to Website</Link>
              </Button>
            </div>

            {!token && (
              <p className="text-xs text-muted-foreground text-center mt-6 italic">
                Our team will provide access to your assessment shortly.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StrategicAssessmentConfirmation;
