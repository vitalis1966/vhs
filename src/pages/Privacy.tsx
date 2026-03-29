import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePageMeta } from "@/lib/seo";

const Privacy = () => {
  usePageMeta("Privacy Policy | Vitalis Health Strategies", "Privacy policy for Vitalis Health Strategies.");
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-foreground tracking-tight">Privacy Policy</h1>
          <p className="mt-8 text-lg text-muted-foreground">This page is coming soon. Please check back shortly.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Privacy;
