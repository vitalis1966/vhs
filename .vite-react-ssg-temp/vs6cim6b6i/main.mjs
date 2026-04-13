import { ViteReactSSG } from "vite-react-ssg";
import { jsx } from "react/jsx-runtime";
import React__default from "react";
import { Navigate } from "react-router-dom";
async function defaultToComponent(routePromise) {
  const routeModule = await routePromise;
  return { ...routeModule, Component: routeModule.default };
}
const RootLayout = React__default.lazy(() => import("./assets/RootLayout-Dwuh6Lwi.js"));
const routes = [
  {
    path: "/",
    Component: RootLayout,
    HydrateFallback: RootLayout,
    children: [
      // ── Static pages (pre-rendered) ──────────────────────────
      { index: true, lazy: () => defaultToComponent(import("./assets/Index-Bh4UuT71.js")) },
      { path: "about", lazy: () => defaultToComponent(import("./assets/About-Cp3VFSAG.js")) },
      { path: "team", lazy: () => defaultToComponent(import("./assets/About-Cp3VFSAG.js")) },
      { path: "about/mission-vision", lazy: () => defaultToComponent(import("./assets/MissionVision-wcGxkYa5.js")) },
      { path: "how-we-work", lazy: () => defaultToComponent(import("./assets/HowWeWork-DxDkM8qd.js")) },
      { path: "solutions", lazy: () => defaultToComponent(import("./assets/Solutions-dZ78SQmd.js")) },
      { path: "solutions/new-clinics", lazy: () => defaultToComponent(import("./assets/SolutionsNewClinics-Cs-YYQdv.js")) },
      { path: "solutions/existing-clinics", lazy: () => defaultToComponent(import("./assets/SolutionsExistingClinics-5tivIZ5f.js")) },
      { path: "solutions/medical", lazy: () => defaultToComponent(import("./assets/Medical-ToKhsf1w.js")) },
      { path: "solutions/dental", lazy: () => defaultToComponent(import("./assets/Dental-9p2Qbr3A.js")) },
      { path: "solutions/veterinary", lazy: () => defaultToComponent(import("./assets/Veterinary-DuMqsPbd.js")) },
      { path: "solutions/nhsf", lazy: () => defaultToComponent(import("./assets/NHSF-DAQRdLMq.js")) },
      { path: "contact", lazy: () => defaultToComponent(import("./assets/Contact-KYkDNzPQ.js")) },
      { path: "clinic-audit", lazy: () => defaultToComponent(import("./assets/ClinicAudit-lzxNdqGG.js")) },
      { path: "strategic-assessment", lazy: () => defaultToComponent(import("./assets/StrategicAssessment-CjgOdWiG.js")) },
      { path: "strategic-assessment/intake", lazy: () => defaultToComponent(import("./assets/StrategicAssessmentIntake-BkgQAhd5.js")) },
      { path: "strategic-assessment/confirmation", lazy: () => defaultToComponent(import("./assets/StrategicAssessmentConfirmation-Bum-1U_5.js")) },
      { path: "portfolio", lazy: () => defaultToComponent(import("./assets/Portfolio-nLXV1wBQ.js")) },
      { path: "partners", lazy: () => defaultToComponent(import("./assets/Partners-B69ESS4_.js")) },
      { path: "engagement", lazy: () => defaultToComponent(import("./assets/Engagement-CCD_8VPa.js")) },
      { path: "healthcare-it", lazy: () => defaultToComponent(import("./assets/HealthcareIT-pCUGo-cq.js")) },
      { path: "insights", lazy: () => defaultToComponent(import("./assets/Insights-Ctg6C4kB.js")) },
      { path: "terms", lazy: () => defaultToComponent(import("./assets/Terms-lPfZgbML.js")) },
      { path: "privacy", lazy: () => defaultToComponent(import("./assets/Privacy-VimW0Cma.js")) },
      { path: "disclaimer", lazy: () => defaultToComponent(import("./assets/Disclaimer-BmgGq7Ez.js")) },
      { path: "cookies", lazy: () => defaultToComponent(import("./assets/Cookies-kafAysKn.js")) },
      { path: "unsubscribe", lazy: () => defaultToComponent(import("./assets/Unsubscribe-CuP8Ej5L.js")) },
      // ── Dynamic routes (client-side only, not pre-rendered) ──
      { path: "portfolio/:slug", lazy: () => defaultToComponent(import("./assets/PortfolioDetail-Bf-822pX.js")) },
      { path: "insights/:slug", lazy: () => defaultToComponent(import("./assets/InsightArticle-BKqSjFhq.js")) },
      { path: "assessment/:token", lazy: () => defaultToComponent(import("./assets/AssessmentClient-BBJ9pqyX.js")) },
      { path: "assessment/:token/report", lazy: () => defaultToComponent(import("./assets/AssessmentReport-C7wtX1v1.js")) },
      { path: "report/:token", lazy: () => defaultToComponent(import("./assets/ClientReportView-Bu3vx9gG.js")) },
      // ── Admin routes (client-side only) ──────────────────────
      { path: "admin/login", lazy: () => defaultToComponent(import("./assets/AdminLogin-BkSYjUZY.js")) },
      {
        path: "admin",
        lazy: async () => {
          const [{ AdminGuard }, { default: AdminDashboard }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/AdminDashboard-MZVbZuVF.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(AdminDashboard, {}) }) };
        }
      },
      {
        path: "admin/assessments",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/AssessmentList-Dxqs2sMJ.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/assessments/:id",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/AssessmentEditor-DiN7kexZ.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/assessments/:id/import",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/AssessmentImport-CO8K6Uu2.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/submissions",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/SubmissionsDashboard-BOkDQ2vi.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/submissions/:sessionId",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/InternalReport-BkKvHqa8.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/submissions/:sessionId/client-report",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/ClientReport-DftZHPrj.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/seo",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/SEOAdmin-6d8WRNii.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/insights",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/InsightsAdmin-Bhheedhr.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/insights/:id",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/InsightsEditor-CkiJ6OS_.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/portfolio",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/PortfolioAdmin-1AyVkoqi.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/portfolio/:id",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/PortfolioEditor-CgIkToBK.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/contacts",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-B-IdrJ4D.js"),
            import("./assets/ContactSubmissions-DRACfZuS.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      // ── Redirects ────────────────────────────────────────────
      { path: "builds", element: /* @__PURE__ */ jsx(Navigate, { replace: true, to: "/solutions/new-clinics" }) },
      { path: "areas-of-expertise", element: /* @__PURE__ */ jsx(Navigate, { replace: true, to: "/how-we-work" }) },
      { path: "fractional-and-advisory-consulting", element: /* @__PURE__ */ jsx(Navigate, { replace: true, to: "/solutions/existing-clinics" }) },
      { path: "strategic-analysis", element: /* @__PURE__ */ jsx(Navigate, { replace: true, to: "/solutions/existing-clinics" }) },
      // ── 404 ──────────────────────────────────────────────────
      { path: "*", lazy: () => defaultToComponent(import("./assets/NotFound-B8NgJ_7D.js")) }
    ]
  }
];
const createRoot = ViteReactSSG(
  { routes, basename: "/" }
);
export {
  createRoot
};
