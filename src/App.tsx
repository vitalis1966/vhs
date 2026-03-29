import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import { SEORedirectHandler } from "@/components/SEORedirectHandler";
import { SEOScripts } from "@/components/SEOScripts";

const AdminGuard = lazy(() => import("@/components/AdminGuard").then(m => ({ default: m.AdminGuard })));
const About = lazy(() => import("./pages/About"));
const HowWeWork = lazy(() => import("./pages/HowWeWork"));
const Solutions = lazy(() => import("./pages/Solutions"));
const SolutionsNewClinics = lazy(() => import("./pages/SolutionsNewClinics"));
const SolutionsExistingClinics = lazy(() => import("./pages/SolutionsExistingClinics"));
const Contact = lazy(() => import("./pages/Contact"));
const ClinicAudit = lazy(() => import("./pages/ClinicAudit"));
const StrategicAssessment = lazy(() => import("./pages/StrategicAssessment"));
const StrategicAssessmentIntake = lazy(() => import("./pages/StrategicAssessmentIntake"));
const StrategicAssessmentConfirmation = lazy(() => import("./pages/StrategicAssessmentConfirmation"));
const AssessmentClient = lazy(() => import("./pages/assessment/AssessmentClient"));
const AssessmentReport = lazy(() => import("./pages/assessment/AssessmentReport"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AssessmentList = lazy(() => import("./pages/admin/AssessmentList"));
const AssessmentEditor = lazy(() => import("./pages/admin/AssessmentEditor"));
const SubmissionsDashboard = lazy(() => import("./pages/admin/SubmissionsDashboard"));
const InternalReport = lazy(() => import("./pages/admin/InternalReport"));
const ClientReport = lazy(() => import("./pages/admin/ClientReport"));
const AssessmentImport = lazy(() => import("./pages/admin/AssessmentImport"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Partners = lazy(() => import("./pages/Partners"));
const Engagement = lazy(() => import("./pages/Engagement"));
const MissionVision = lazy(() => import("./pages/MissionVision"));
const HealthcareIT = lazy(() => import("./pages/HealthcareIT"));
const Medical = lazy(() => import("./pages/solutions/Medical"));
const Dental = lazy(() => import("./pages/solutions/Dental"));
const Veterinary = lazy(() => import("./pages/solutions/Veterinary"));
const NHSF = lazy(() => import("./pages/solutions/NHSF"));
const Insights = lazy(() => import("./pages/Insights"));
const InsightArticle = lazy(() => import("./pages/InsightArticle"));
const InsightsAdmin = lazy(() => import("./pages/admin/InsightsAdmin"));
const InsightsEditor = lazy(() => import("./pages/admin/InsightsEditor"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/mission-vision" element={<MissionVision />} />
            <Route path="/how-we-work" element={<HowWeWork />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/new-clinics" element={<SolutionsNewClinics />} />
            <Route path="/solutions/existing-clinics" element={<SolutionsExistingClinics />} />
            <Route path="/solutions/medical" element={<Medical />} />
            <Route path="/solutions/dental" element={<Dental />} />
            <Route path="/solutions/veterinary" element={<Veterinary />} />
            <Route path="/solutions/nhsf" element={<NHSF />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/clinic-audit" element={<ClinicAudit />} />
            <Route path="/strategic-assessment" element={<StrategicAssessment />} />
            <Route path="/strategic-assessment/intake" element={<StrategicAssessmentIntake />} />
            <Route path="/strategic-assessment/confirmation" element={<StrategicAssessmentConfirmation />} />
            <Route path="/assessment/:token" element={<AssessmentClient />} />
            <Route path="/assessment/:token/report" element={<AssessmentReport />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/assessments" element={<AdminGuard><AssessmentList /></AdminGuard>} />
            <Route path="/admin/assessments/:id" element={<AdminGuard><AssessmentEditor /></AdminGuard>} />
            <Route path="/admin/assessments/:id/import" element={<AdminGuard><AssessmentImport /></AdminGuard>} />
            <Route path="/admin/submissions" element={<AdminGuard><SubmissionsDashboard /></AdminGuard>} />
            <Route path="/admin/submissions/:sessionId" element={<AdminGuard><InternalReport /></AdminGuard>} />
            <Route path="/admin/submissions/:sessionId/client-report" element={<AdminGuard><ClientReport /></AdminGuard>} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/engagement" element={<Engagement />} />
            <Route path="/healthcare-it" element={<HealthcareIT />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<InsightArticle />} />
            <Route path="/admin/insights" element={<AdminGuard><InsightsAdmin /></AdminGuard>} />
            <Route path="/admin/insights/:id" element={<AdminGuard><InsightsEditor /></AdminGuard>} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
