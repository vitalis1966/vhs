import type { RouteRecord } from 'vite-react-ssg'
import React from 'react'
import { Navigate } from 'react-router-dom'

// Helper: convert default export to Component for lazy routes
async function defaultToComponent(routePromise: Promise<{ default: React.ComponentType<any> } & Record<string, any>>) {
  const routeModule = await routePromise
  return { ...routeModule, Component: routeModule.default }
}

const RootLayout = React.lazy(() => import('./components/RootLayout'))

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: RootLayout,
    HydrateFallback: RootLayout,
    children: [
      // ── Static pages (pre-rendered) ──────────────────────────
      { index: true, lazy: () => defaultToComponent(import('./pages/Index')) },
      { path: 'about', lazy: () => defaultToComponent(import('./pages/About')) },
      { path: 'team', lazy: () => defaultToComponent(import('./pages/About')) },
      { path: 'about/mission-vision', lazy: () => defaultToComponent(import('./pages/MissionVision')) },
      { path: 'how-we-work', lazy: () => defaultToComponent(import('./pages/HowWeWork')) },
      { path: 'solutions', lazy: () => defaultToComponent(import('./pages/Solutions')) },
      { path: 'solutions/new-clinics', lazy: () => defaultToComponent(import('./pages/SolutionsNewClinics')) },
      { path: 'solutions/existing-clinics', lazy: () => defaultToComponent(import('./pages/SolutionsExistingClinics')) },
      { path: 'solutions/medical', lazy: () => defaultToComponent(import('./pages/solutions/Medical')) },
      { path: 'solutions/dental', lazy: () => defaultToComponent(import('./pages/solutions/Dental')) },
      { path: 'solutions/veterinary', lazy: () => defaultToComponent(import('./pages/solutions/Veterinary')) },
      { path: 'solutions/nhsf', lazy: () => defaultToComponent(import('./pages/solutions/NHSF')) },
      { path: 'contact', lazy: () => defaultToComponent(import('./pages/Contact')) },
      { path: 'clinic-audit', lazy: () => defaultToComponent(import('./pages/ClinicAudit')) },
      { path: 'strategic-assessment', lazy: () => defaultToComponent(import('./pages/StrategicAssessment')) },
      { path: 'strategic-assessment/intake', lazy: () => defaultToComponent(import('./pages/StrategicAssessmentIntake')) },
      { path: 'strategic-assessment/confirmation', lazy: () => defaultToComponent(import('./pages/StrategicAssessmentConfirmation')) },
      { path: 'portfolio', lazy: () => defaultToComponent(import('./pages/Portfolio')) },
      { path: 'partners', lazy: () => defaultToComponent(import('./pages/Partners')) },
      { path: 'engagement', lazy: () => defaultToComponent(import('./pages/Engagement')) },
      { path: 'healthcare-it', lazy: () => defaultToComponent(import('./pages/HealthcareIT')) },
      { path: 'insights', lazy: () => defaultToComponent(import('./pages/Insights')) },
      { path: 'terms', lazy: () => defaultToComponent(import('./pages/Terms')) },
      { path: 'privacy', lazy: () => defaultToComponent(import('./pages/Privacy')) },
      { path: 'disclaimer', lazy: () => defaultToComponent(import('./pages/Disclaimer')) },
      { path: 'cookies', lazy: () => defaultToComponent(import('./pages/Cookies')) },
      { path: 'unsubscribe', lazy: () => defaultToComponent(import('./pages/Unsubscribe')) },

      // ── Dynamic routes (client-side only, not pre-rendered) ──
      { path: 'portfolio/:slug', lazy: () => defaultToComponent(import('./pages/PortfolioDetail')) },
      { path: 'insights/:slug', lazy: () => defaultToComponent(import('./pages/InsightArticle')) },
      { path: 'assessment/:token', lazy: () => defaultToComponent(import('./pages/assessment/AssessmentClient')) },
      { path: 'assessment/:token/report', lazy: () => defaultToComponent(import('./pages/assessment/AssessmentReport')) },
      { path: 'report/:token', lazy: () => defaultToComponent(import('./pages/ClientReportView')) },

      // ── Admin routes (client-side only) ──────────────────────
      { path: 'admin/login', lazy: () => defaultToComponent(import('./pages/admin/AdminLogin')) },
      {
        path: 'admin',
        lazy: async () => {
          const [{ AdminGuard }, { default: AdminDashboard }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/AdminDashboard'),
          ])
          return { Component: () => <AdminGuard><AdminDashboard /></AdminGuard> }
        },
      },
      {
        path: 'admin/assessments',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/AssessmentList'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/assessments/:id',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/AssessmentEditor'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/assessments/:id/import',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/AssessmentImport'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/submissions',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/SubmissionsDashboard'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/submissions/:sessionId',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/InternalReport'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/submissions/:sessionId/client-report',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/ClientReport'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/seo',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/SEOAdmin'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/insights',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/InsightsAdmin'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/insights/:id',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/InsightsEditor'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/portfolio',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/PortfolioAdmin'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/portfolio/:id',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/PortfolioEditor'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },
      {
        path: 'admin/contacts',
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import('./components/AdminGuard'),
            import('./pages/admin/ContactSubmissions'),
          ])
          return { Component: () => <AdminGuard><Page /></AdminGuard> }
        },
      },

      // ── Redirects ────────────────────────────────────────────
      { path: 'builds', element: <Navigate replace to="/solutions/new-clinics" /> },
      { path: 'areas-of-expertise', element: <Navigate replace to="/how-we-work" /> },
      { path: 'fractional-and-advisory-consulting', element: <Navigate replace to="/solutions/existing-clinics" /> },
      { path: 'strategic-analysis', element: <Navigate replace to="/solutions/existing-clinics" /> },

      // ── 404 ──────────────────────────────────────────────────
      { path: '*', lazy: () => defaultToComponent(import('./pages/NotFound')) },
    ],
  },
]
