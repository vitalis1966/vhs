import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import { RedirectHandler } from "@/components/RedirectHandler";
import { GlobalScripts } from "@/components/GlobalScripts";
import { SEOLayout } from "@/components/SEOLayout";

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
const ClientReportView = lazy(() => import("./pages/ClientReportView"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const EmployeeLogin = lazy(() => import("./pages/EmployeeLogin"));
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
const SEOAdmin = lazy(() => import("./pages/admin/SEOAdmin"));
const PortfolioAdmin = lazy(() => import("./pages/admin/PortfolioAdmin"));
const PortfolioEditor = lazy(() => import("./pages/admin/PortfolioEditor"));
const ContactSubmissions = lazy(() => import("./pages/admin/ContactSubmissions"));
const PortfolioDetail = lazy(() => import("./pages/PortfolioDetail"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdministratorsAdmin = lazy(() => import("./pages/admin/AdministratorsAdmin"));
const LoggingAdmin = lazy(() => import("./pages/admin/LoggingAdmin"));
const ClientManagement = lazy(() => import("./pages/admin/ClientManagement"));
const ClientUsersAdmin = lazy(() => import("./pages/admin/ClientUsersAdmin"));
const ClientDocumentsAdmin = lazy(() => import("./pages/admin/ClientDocumentsAdmin"));
const ClientDocumentsPortal = lazy(() => import("./pages/portal/ClientDocuments"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AppGuard = lazy(() => import("@/components/app/AppGuard").then(m => ({ default: m.AppGuard })));
const AppLayout = lazy(() => import("@/components/app/AppLayout").then(m => ({ default: m.AppLayout })));
const AppIndex = lazy(() => import("./pages/app/AppIndex"));
const SetupWorkspace = lazy(() => import("./pages/app/SetupWorkspace"));
const AppHome = lazy(() => import("./pages/app/ShellPages").then(m => ({ default: m.AppHome })));
const AppMyTasks = lazy(() => import("./pages/app/ShellPages").then(m => ({ default: m.AppMyTasks })));
const AppClients = lazy(() => import("./pages/app/Clients"));
const AppClientDetail = lazy(() => import("./pages/app/ClientDetail"));
const AppProjects = lazy(() => import("./pages/app/Projects"));
const AppProjectDetail = lazy(() => import("./pages/app/ProjectDetail"));
const AppTasks = lazy(() => import("./pages/app/Tasks"));
const AppDashboards = lazy(() => import("./pages/app/LeadershipDashboard"));
const AppNotificationSettings = lazy(() => import("./pages/app/NotificationSettings"));
const AppSettings = lazy(() => import("./pages/app/Settings"));

import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// Prefetch SEO data in parallel at app init so meta tags are ready before render.
Promise.all([
  queryClient.prefetchQuery({
    queryKey: ["seo-global"],
    queryFn: async () => {
      const { data } = await (supabase as any).rpc("get_public_seo_global");
      return Array.isArray(data) ? data[0] ?? null : data;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  }),
  queryClient.prefetchQuery({
    queryKey: ["seo-schema-global"],
    queryFn: async () => (await supabase.from("seo_schema_global").select("*").eq("is_active", true)).data || [],
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  }),
  queryClient.prefetchQuery({
    queryKey: ["seo-redirects"],
    queryFn: async () => (await supabase.from("seo_redirects").select("from_path, to_path, redirect_type").eq("is_active", true)).data || [],
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  }),
  queryClient.prefetchQuery({
    queryKey: ["seo-global-scripts"],
    queryFn: async () => {
      const { data } = await (supabase as any).rpc("get_public_seo_global");
      return Array.isArray(data) ? data[0] ?? null : data;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  }),
]);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlobalScripts />
          <RedirectHandler />
          <SEOLayout>
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
              <Route path="/report/:token" element={<ClientReportView />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/employee-login" element={<EmployeeLogin />} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/assessments" element={<AdminGuard><AssessmentList /></AdminGuard>} />
              <Route path="/admin/assessments/:id" element={<AdminGuard><AssessmentEditor /></AdminGuard>} />
              <Route path="/admin/assessments/:id/import" element={<AdminGuard><AssessmentImport /></AdminGuard>} />
              <Route path="/admin/submissions" element={<AdminGuard><SubmissionsDashboard /></AdminGuard>} />
              <Route path="/admin/submissions/:sessionId" element={<AdminGuard><InternalReport /></AdminGuard>} />
              <Route path="/admin/submissions/:sessionId/client-report" element={<AdminGuard><ClientReport /></AdminGuard>} />
              <Route path="/admin/seo" element={<AdminGuard><SEOAdmin /></AdminGuard>} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/engagement" element={<Engagement />} />
              <Route path="/healthcare-it" element={<HealthcareIT />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/:slug" element={<InsightArticle />} />
              <Route path="/admin/insights" element={<AdminGuard><InsightsAdmin /></AdminGuard>} />
              <Route path="/admin/insights/:id" element={<AdminGuard><InsightsEditor /></AdminGuard>} />
              <Route path="/admin/portfolio" element={<AdminGuard><PortfolioAdmin /></AdminGuard>} />
              <Route path="/admin/portfolio/:id" element={<AdminGuard><PortfolioEditor /></AdminGuard>} />
              <Route path="/admin/contacts" element={<AdminGuard><ContactSubmissions /></AdminGuard>} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin/administrators" element={<AdminGuard><AdministratorsAdmin /></AdminGuard>} />
              <Route path="/admin/logging" element={<AdminGuard><LoggingAdmin /></AdminGuard>} />
              <Route path="/admin/client-management" element={<AdminGuard><ClientManagement /></AdminGuard>} />
              <Route path="/admin/client-management/users" element={<AdminGuard><ClientUsersAdmin /></AdminGuard>} />
              <Route path="/admin/client-management/documents" element={<AdminGuard><ClientDocumentsAdmin /></AdminGuard>} />
              <Route path="/portal/documents" element={<ClientDocumentsPortal />} />
              <Route path="/app/setup" element={<Navigate to="/app" replace />} />
              <Route path="/app" element={<AppGuard><AppLayout /></AppGuard>}>
                <Route index element={<AppIndex />} />
                <Route path="home" element={<AppHome />} />
                <Route path="my-tasks" element={<AppMyTasks />} />
                <Route path="clients" element={<AppClients />} />
                <Route path="clients/:clientId" element={<AppClientDetail />} />
                <Route path="clients/:clientId/projects/:projectId" element={<AppProjectDetail />} />
                <Route path="projects" element={<AppProjects />} />
                <Route path="tasks" element={<AppTasks />} />
                <Route path="dashboards" element={<AppDashboards />} />
                <Route path="settings/notifications" element={<AppNotificationSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </SEOLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
