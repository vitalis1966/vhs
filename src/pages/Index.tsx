import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { LifecycleSection } from "@/components/home/LifecycleSection";
import { ThreePsSection } from "@/components/home/ThreePsSection";
import { SolutionsPreview } from "@/components/home/SolutionsPreview";
import { CredibilitySection } from "@/components/home/CredibilitySection";
import { TrustedNetworkSection } from "@/components/home/TrustedNetworkSection";
import { AuditCtaSection } from "@/components/home/AuditCtaSection";
import { MnASection } from "@/components/home/MnASection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { HealthcarePathwaysSection } from "@/components/home/HealthcarePathwaysSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <LifecycleSection />
      <CredibilitySection />
      <TrustedNetworkSection />
      <ThreePsSection />
      <HealthcarePathwaysSection />
      <SolutionsPreview />
      <AuditCtaSection />
      <MnASection />
      <ProcessSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
};

export default Index;
