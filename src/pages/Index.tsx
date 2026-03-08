import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { LifecycleSection } from "@/components/home/LifecycleSection";
import { ThreePsSection } from "@/components/home/ThreePsSection";
import { SolutionsPreview } from "@/components/home/SolutionsPreview";
import { AuditCtaSection } from "@/components/home/AuditCtaSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <LifecycleSection />
      <ThreePsSection />
      <SolutionsPreview />
      <AuditCtaSection />
      <ProcessSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
};

export default Index;
