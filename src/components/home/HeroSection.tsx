import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    //<section className="relative min-h-[95vh] flex items-center bg-gradient-hero overflow-hidden">
    <section className="relative min-h-[95vh] flex items-center bg-gradient-hero overflow-hidden" style={{contain: "layout"}}>
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24 pb-16">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-8 animate-fade-in">
            <span className="h-px w-12 bg-accent" />
            <span className="text-[#7a5500] font-semibold tracking-widest uppercase text-sm">
              Full-Cycle Healthcare Strategy
            </span>
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.08] tracking-tight animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Practice Strategy for Medical,{" "}
            <br />
            Dental &amp; Veterinary
            {" "}
            <span className="text-gradient-primary italic">— at Every Stage.</span>
          </h1>

          <p
            className="mt-8 text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Vitalis Health Strategies works with private medical, dental, and veterinary practices across Canada. Whether you are planning a new facility, running an established practice, or figuring out what is holding your current one back — our team has the operational and strategic experience to help you move forward with clarity.
          </p>

          <div
            className="mt-10 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="xl" asChild className="whitespace-normal h-auto py-3 text-center leading-snug">
              <Link to="/strategic-assessment">
                Start Your Strategic Assessment
                <ArrowRight className="ml-2 h-5 w-5 shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
