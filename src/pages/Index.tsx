import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ImpactStatsSection } from "@/components/home/ImpactStatsSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { PracticePathFinder } from "@/components/home/PracticePathFinder";
import { CredibilitySection } from "@/components/home/CredibilitySection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { usePageMeta } from "@/lib/seo";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/JsonLd";

const Index = () => {
  usePageMeta(
    "Healthcare Consulting for Medical, Dental & Veterinary Practices | Vitalis Health Strategies | Calgary, Alberta",
    "Vitalis Health Strategies helps medical, dental, and veterinary practices plan, build, grow, and optimize. Clinician-led consulting across Canada."
  );
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <PracticePathFinder />
      <ImpactStatsSection />
      <WhatWeDoSection />
      <CredibilitySection variant="homepage" />
      <FinalCtaSection />
      <Footer />
    </div>
  );
};

export default Index;
