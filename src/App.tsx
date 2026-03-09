import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import HowWeWork from "./pages/HowWeWork";
import Solutions from "./pages/Solutions";
import SolutionsNewClinics from "./pages/SolutionsNewClinics";
import SolutionsExistingClinics from "./pages/SolutionsExistingClinics";
import Contact from "./pages/Contact";
import ClinicAudit from "./pages/ClinicAudit";
import StrategicAssessment from "./pages/StrategicAssessment";
import StrategicAssessmentIntake from "./pages/StrategicAssessmentIntake";
import StrategicAssessmentConfirmation from "./pages/StrategicAssessmentConfirmation";
import AssessmentClient from "./pages/assessment/AssessmentClient";
import AssessmentList from "./pages/admin/AssessmentList";
import AssessmentEditor from "./pages/admin/AssessmentEditor";
import Portfolio from "./pages/Portfolio";
import Partners from "./pages/Partners";
import Engagement from "./pages/Engagement";
import MissionVision from "./pages/MissionVision";
import HealthcareIT from "./pages/HealthcareIT";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/mission-vision" element={<MissionVision />} />
          <Route path="/how-we-work" element={<HowWeWork />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/new-clinics" element={<SolutionsNewClinics />} />
          <Route path="/solutions/existing-clinics" element={<SolutionsExistingClinics />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/clinic-audit" element={<ClinicAudit />} />
          <Route path="/strategic-assessment" element={<StrategicAssessment />} />
          <Route path="/strategic-assessment/intake" element={<StrategicAssessmentIntake />} />
          <Route path="/strategic-assessment/confirmation" element={<StrategicAssessmentConfirmation />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/engagement" element={<Engagement />} />
          <Route path="/healthcare-it" element={<HealthcareIT />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
