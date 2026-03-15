import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { LifecycleSection } from "@/components/home/LifecycleSection";
import { CredibilitySection } from "@/components/home/CredibilitySection";
import { ThreePsSection } from "@/components/home/ThreePsSection";
import { StrategicEcosystemSection } from "@/components/home/StrategicEcosystemSection";
import { HealthcarePathwaysSection } from "@/components/home/HealthcarePathwaysSection";
import { AuditCtaSection } from "@/components/home/AuditCtaSection";
import { MnASection } from "@/components/home/MnASection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { usePageMeta } from "@/lib/seo";

// Homepage layout
const Index = () => {
  usePageMeta(
    "Healthcare Consulting for Medical, Dental & Veterinary Practices | Vitalis Health Strategies | Calgary, Alberta",
    "Vitalis Health Strategies helps medical, dental, and veterinary practices plan, build, grow, and optimize. Clinician-led consulting across Canada."
  );
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <LifecycleSection />
      <CredibilitySection />
      <ThreePsSection />
      <StrategicEcosystemSection />
      <HealthcarePathwaysSection />
      
      <AuditCtaSection />
      <MnASection />
      <ProcessSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
};

export default Index;
