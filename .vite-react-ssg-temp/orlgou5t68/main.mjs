import { ViteReactSSG } from "vite-react-ssg";
import { jsx } from "react/jsx-runtime";
import React__default from "react";
import { Navigate } from "react-router";
async function defaultToComponent(routePromise) {
  const routeModule = await routePromise;
  return { ...routeModule, Component: routeModule.default };
}
const RootLayout = React__default.lazy(() => import("./assets/RootLayout-BFMUtNNw.js"));
const routes = [
  {
    path: "/",
    Component: RootLayout,
    HydrateFallback: RootLayout,
    children: [
      // ── Static pages (pre-rendered) ──────────────────────────
      { index: true, lazy: () => defaultToComponent(import("./assets/Index-OtlM3lHD.js")) },
      { path: "about", lazy: () => defaultToComponent(import("./assets/About-D8aKfKS3.js")) },
      { path: "team", lazy: () => defaultToComponent(import("./assets/About-D8aKfKS3.js")) },
      { path: "about/mission-vision", lazy: () => defaultToComponent(import("./assets/MissionVision-BjMO0rwM.js")) },
      { path: "how-we-work", lazy: () => defaultToComponent(import("./assets/HowWeWork-BGO0uBm7.js")) },
      { path: "solutions", lazy: () => defaultToComponent(import("./assets/Solutions-C6NcKDGv.js")) },
      { path: "solutions/new-clinics", lazy: () => defaultToComponent(import("./assets/SolutionsNewClinics-BAtH3D0p.js")) },
      { path: "solutions/existing-clinics", lazy: () => defaultToComponent(import("./assets/SolutionsExistingClinics-D1B1JiWR.js")) },
      { path: "solutions/medical", lazy: () => defaultToComponent(import("./assets/Medical-CuyPwcPn.js")) },
      { path: "solutions/dental", lazy: () => defaultToComponent(import("./assets/Dental-C7HAc9PQ.js")) },
      { path: "solutions/veterinary", lazy: () => defaultToComponent(import("./assets/Veterinary-D3egKp1I.js")) },
      { path: "solutions/nhsf", lazy: () => defaultToComponent(import("./assets/NHSF-D9tUAW6U.js")) },
      { path: "contact", lazy: () => defaultToComponent(import("./assets/Contact-C6LTer-b.js")) },
      { path: "clinic-audit", lazy: () => defaultToComponent(import("./assets/ClinicAudit-DFt1hC6k.js")) },
      { path: "strategic-assessment", lazy: () => defaultToComponent(import("./assets/StrategicAssessment-DuFvSNms.js")) },
      { path: "strategic-assessment/intake", lazy: () => defaultToComponent(import("./assets/StrategicAssessmentIntake-C5NYrJys.js")) },
      { path: "strategic-assessment/confirmation", lazy: () => defaultToComponent(import("./assets/StrategicAssessmentConfirmation-Cw2WpdKe.js")) },
      { path: "portfolio", lazy: () => defaultToComponent(import("./assets/Portfolio-Bjjw4_-q.js")) },
      { path: "partners", lazy: () => defaultToComponent(import("./assets/Partners-CFr2wNyi.js")) },
      { path: "engagement", lazy: () => defaultToComponent(import("./assets/Engagement-OABQHQE7.js")) },
      { path: "healthcare-it", lazy: () => defaultToComponent(import("./assets/HealthcareIT-DUL4Vxdi.js")) },
      { path: "insights", lazy: () => defaultToComponent(import("./assets/Insights-CB6X8QO4.js")) },
      { path: "terms", lazy: () => defaultToComponent(import("./assets/Terms-Bt-sb1jI.js")) },
      { path: "privacy", lazy: () => defaultToComponent(import("./assets/Privacy-CuHGPMPV.js")) },
      { path: "disclaimer", lazy: () => defaultToComponent(import("./assets/Disclaimer-B1fJOP4Y.js")) },
      { path: "cookies", lazy: () => defaultToComponent(import("./assets/Cookies-1fHFNoVu.js")) },
      { path: "unsubscribe", lazy: () => defaultToComponent(import("./assets/Unsubscribe-D4vdFqb2.js")) },
      // ── Dynamic routes (client-side only, not pre-rendered) ──
      { path: "portfolio/:slug", lazy: () => defaultToComponent(import("./assets/PortfolioDetail-DUs1S0zZ.js")) },
      { path: "insights/:slug", lazy: () => defaultToComponent(import("./assets/InsightArticle-CPlUhlEW.js")) },
      { path: "assessment/:token", lazy: () => defaultToComponent(import("./assets/AssessmentClient-CQonQvl2.js")) },
      { path: "assessment/:token/report", lazy: () => defaultToComponent(import("./assets/AssessmentReport-Dme0I0Cw.js")) },
      { path: "report/:token", lazy: () => defaultToComponent(import("./assets/ClientReportView-20nkfdep.js")) },
      // ── Admin routes (client-side only) ──────────────────────
      { path: "admin/login", lazy: () => defaultToComponent(import("./assets/AdminLogin-QYkcWSwR.js")) },
      {
        path: "admin",
        lazy: async () => {
          const [{ AdminGuard }, { default: AdminDashboard }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/AdminDashboard-b1Jg4g6I.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(AdminDashboard, {}) }) };
        }
      },
      {
        path: "admin/assessments",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/AssessmentList-DBzNr3-5.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/assessments/:id",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/AssessmentEditor-62H4Kjco.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/assessments/:id/import",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/AssessmentImport-CLKwgEdr.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/submissions",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/SubmissionsDashboard-DiUpD89h.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/submissions/:sessionId",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/InternalReport-C6Du8Vpr.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/submissions/:sessionId/client-report",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/ClientReport-BXQd7CEE.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/seo",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/SEOAdmin-CJ5plfSu.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/insights",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/InsightsAdmin-WaCKRN2u.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/insights/:id",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/InsightsEditor-CAW8FgrY.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/portfolio",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/PortfolioAdmin-NU2y7erO.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/portfolio/:id",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/PortfolioEditor-90o8oMek.js")
          ]);
          return { Component: () => /* @__PURE__ */ jsx(AdminGuard, { children: /* @__PURE__ */ jsx(Page, {}) }) };
        }
      },
      {
        path: "admin/contacts",
        lazy: async () => {
          const [{ AdminGuard }, { default: Page }] = await Promise.all([
            import("./assets/AdminGuard-N3y5OHmw.js"),
            import("./assets/ContactSubmissions-DqPnYiq8.js")
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
      { path: "*", lazy: () => defaultToComponent(import("./assets/NotFound-uWgFOm0Y.js")) }
    ]
  }
];
if (typeof document === "undefined") {
  const noopStorage = {
    length: 0,
    clear() {
    },
    getItem() {
      return null;
    },
    key() {
      return null;
    },
    removeItem() {
    },
    setItem() {
    }
  };
  const location = {
    origin: "https://www.vitalisstrategies.com",
    href: "https://www.vitalisstrategies.com/",
    hostname: "www.vitalisstrategies.com",
    pathname: "/",
    search: "",
    hash: "",
    protocol: "https:",
    host: "www.vitalisstrategies.com",
    port: "",
    assign() {
    },
    reload() {
    },
    replace() {
    },
    toString() {
      return this.href;
    }
  };
  const noop = () => {
  };
  const noopEl = () => ({
    style: {},
    setAttribute: noop,
    appendChild: noop,
    removeChild: noop,
    insertBefore: noop,
    addEventListener: noop,
    removeEventListener: noop,
    querySelector: () => null,
    querySelectorAll: () => [],
    firstChild: null,
    parentNode: null,
    parentElement: null,
    innerHTML: "",
    id: ""
  });
  const rootEl = noopEl();
  rootEl.id = "root";
  globalThis.localStorage = noopStorage;
  globalThis.sessionStorage = noopStorage;
  globalThis.document = {
    querySelector: (sel) => sel === "#root" ? rootEl : null,
    querySelectorAll: () => [],
    createElement: () => noopEl(),
    createTextNode: () => ({}),
    createDocumentFragment: () => noopEl(),
    head: noopEl(),
    body: { ...noopEl(), firstChild: null },
    getElementById: (id) => id === "root" ? rootEl : null,
    getElementsByTagName: () => [],
    addEventListener: noop,
    removeEventListener: noop,
    documentElement: { style: {}, setAttribute: noop }
  };
  const trySet = (obj, key, value) => {
    try {
      obj[key] = value;
    } catch {
      try {
        Object.defineProperty(obj, key, { value, writable: true, configurable: true });
      } catch {
      }
    }
  };
  if (typeof globalThis.window === "undefined") {
    globalThis.window = globalThis;
  }
  trySet(globalThis.window, "location", location);
  trySet(globalThis, "location", location);
  trySet(globalThis.window, "navigator", { userAgent: "" });
  trySet(globalThis.window, "addEventListener", noop);
  trySet(globalThis.window, "removeEventListener", noop);
  trySet(globalThis.window, "requestAnimationFrame", (cb) => setTimeout(cb, 0));
  trySet(globalThis.window, "cancelAnimationFrame", noop);
  trySet(globalThis.window, "matchMedia", () => ({ matches: false, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop }));
  trySet(globalThis.window, "getComputedStyle", () => ({}));
  trySet(globalThis.window, "scrollTo", noop);
  trySet(globalThis.window, "innerWidth", 1280);
  trySet(globalThis.window, "innerHeight", 800);
  trySet(globalThis.window, "history", {
    length: 0,
    scrollRestoration: "auto",
    state: null,
    back: noop,
    forward: noop,
    go: noop,
    pushState: noop,
    replaceState: noop
  });
  trySet(globalThis.window, "dispatchEvent", () => true);
  trySet(globalThis.window, "CustomEvent", class CustomEvent {
    constructor() {
    }
  });
  if (typeof globalThis.HTMLElement === "undefined") {
    globalThis.HTMLElement = class HTMLElement {
    };
  }
  if (typeof globalThis.IntersectionObserver === "undefined") {
    globalThis.IntersectionObserver = class {
      observe() {
      }
      unobserve() {
      }
      disconnect() {
      }
    };
  }
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {
      }
      unobserve() {
      }
      disconnect() {
      }
    };
  }
  if (typeof globalThis.MutationObserver === "undefined") {
    globalThis.MutationObserver = class {
      observe() {
      }
      disconnect() {
      }
      takeRecords() {
        return [];
      }
    };
  }
}
const createRoot = ViteReactSSG(
  { routes, basename: "/" }
);
export {
  createRoot
};
