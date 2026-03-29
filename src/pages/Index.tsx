import { lazy, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { SEOHead } from "@/components/SEOHead";
import { useLazySection } from "@/hooks/useLazySection";

const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const PracticePathFinder = lazy(() => import("@/components/home/PracticePathFinder").then(m => ({ default: m.PracticePathFinder })));
const ImpactStatsSection = lazy(() => import("@/components/home/ImpactStatsSection").then(m => ({ default: m.ImpactStatsSection })));
const WhatWeDoSection = lazy(() => import("@/components/home/WhatWeDoSection").then(m => ({ default: m.WhatWeDoSection })));
const CredibilitySection = lazy(() => import("@/components/home/CredibilitySection").then(m => ({ default: m.CredibilitySection })));
const FinalCtaSection = lazy(() => import("@/components/home/FinalCtaSection").then(m => ({ default: m.FinalCtaSection })));

const Index = () => {
  const [belowFoldRef, showBelowFold] = useLazySection("400px");

  return (
    <div className="min-h-screen">
      <SEOHead
        fallbackTitle="Healthcare Consulting for Medical, Dental & Veterinary Practices | Vitalis Health Strategies | Calgary, Alberta"
        fallbackDescription="Vitalis Health Strategies helps medical, dental, and veterinary practices plan, build, grow, and optimize. Clinician-led consulting across Canada."
      />
      <Navbar />
      <main>
        <HeroSection />
        <div ref={belowFoldRef} className="min-h-[200px]">
          {showBelowFold && (
            <Suspense fallback={<div className="min-h-[200px]" />}>
              <PracticePathFinder />
              <ImpactStatsSection />
              <WhatWeDoSection />
              <CredibilitySection variant="homepage" />
              <FinalCtaSection />
            </Suspense>
          )}
        </div>
      </main>
      <Suspense fallback={<div className="h-64" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
