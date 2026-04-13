import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-MYiJaKjb.js";
import { Footer } from "./Footer-DArsv4kV.js";
import { u as usePageMeta } from "./seo-sReVioJD.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-B7zeG0fx.js";
import "react";
import "react-router-dom";
import "lucide-react";
import "./button-DnzOxZqg.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "./PageSEOContext-DZ23I7UH.js";
const GoldRule = () => /* @__PURE__ */ jsx("div", { className: "my-8", children: /* @__PURE__ */ jsx("div", { className: "h-px w-full bg-accent" }) });
const SectionHeading = ({ number, title }) => /* @__PURE__ */ jsxs("h2", { className: "text-[22px] font-bold mt-8 mb-3 font-display", style: { color: "#1C3D2E" }, children: [
  number,
  ". ",
  title
] });
const SubHeading = ({ number, title }) => /* @__PURE__ */ jsxs("h3", { className: "text-[18px] font-semibold mt-6 mb-3 font-display", style: { color: "#1C3D2E" }, children: [
  number,
  " ",
  title
] });
const BulletList = ({ items }) => /* @__PURE__ */ jsx("ul", { className: "my-3 space-y-2 pl-4", children: items.map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-base leading-[1.7]", style: { color: "#333333" }, children: [
  /* @__PURE__ */ jsx("span", { className: "mt-[10px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" }),
  /* @__PURE__ */ jsx("span", { children: item })
] }, i)) });
const P = ({ children }) => /* @__PURE__ */ jsx("p", { className: "text-base leading-[1.7] my-3", style: { color: "#333333" }, children });
const Cookies = () => {
  usePageMeta(
    "Cookie Policy | Vitalis Health Strategies",
    "Cookie policy for Vitalis Health Strategies Inc. explaining how we use cookies and tracking technologies on our website.",
    "/og-cookies.jpg"
  );
  const cookieTableData = [
    {
      category: "Strictly Necessary",
      purpose: "Required for the Site to function. Enable core features such as page navigation, security, and access to protected areas.",
      examples: "Session cookies, security tokens, load balancing cookies",
      canDisable: "No — these are essential to Site operation"
    },
    {
      category: "Analytics & Performance",
      purpose: "Help us understand how visitors use the Site — which pages are most visited, how long visitors stay, and where they come from. Data is aggregated and does not identify individuals.",
      examples: "Google Analytics, similar analytics platforms",
      canDisable: "Yes — via cookie preferences or browser settings"
    },
    {
      category: "Functional",
      purpose: "Remember your preferences and choices to improve your experience, such as your practice type selection or previously completed form steps.",
      examples: "Preference cookies, form state cookies",
      canDisable: "Yes — but disabling may affect Site functionality"
    },
    {
      category: "Marketing & Targeting",
      purpose: "Used to track visits across websites and deliver relevant advertising or content. Only placed with your explicit consent.",
      examples: "Retargeting pixels, campaign tracking cookies",
      canDisable: "Yes — consent required before placement"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", style: { backgroundColor: "#F5F2EC" }, children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto px-6 lg:px-12", style: { maxWidth: "780px" }, children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display font-extrabold text-[36px] lg:text-[40px] leading-tight", style: { color: "#1C3D2E" }, children: "Cookie Policy" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm italic", style: { color: "#666666" }, children: "Effective Date: January 1, 2026 | Last Updated: March 2026" }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(P, { children: 'This Cookie Policy explains how Vitalis Health Strategies Inc. ("Vitalis", "we", "us", or "our") uses cookies and similar tracking technologies on our website at www.vitalisstrategies.com (the "Site").' }),
      /* @__PURE__ */ jsx(P, { children: "By continuing to use the Site, you consent to our use of cookies as described in this Policy. You can manage your cookie preferences at any time using the methods described in Section 5." }),
      /* @__PURE__ */ jsx(P, { children: "This Cookie Policy should be read alongside our Privacy Policy and Terms and Conditions, both available at www.vitalisstrategies.com." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 1, title: "What Are Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide information to the website's owners about how the site is being used." }),
      /* @__PURE__ */ jsx(P, { children: "Cookies are not programs and cannot carry viruses or install malware on your device. They contain only small amounts of data — typically an anonymous identifier, the site name, and some digits and numbers." }),
      /* @__PURE__ */ jsx(P, { children: "Similar technologies that work like cookies include:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Web beacons (also called tracking pixels or clear GIFs): tiny invisible images embedded in web pages or emails that signal when a page or email has been opened",
        "Local storage: data stored directly in your browser, similar to cookies but with greater capacity and no automatic expiry",
        "Session storage: similar to local storage but cleared when you close your browser tab",
        "Pixel tags: used to track user behavior and conversions across pages and campaigns"
      ] }),
      /* @__PURE__ */ jsx(P, { children: 'When we refer to "cookies" in this Policy, we include all of these similar technologies unless stated otherwise.' }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 2, title: "Who Sets Cookies on This Site" }),
      /* @__PURE__ */ jsx(P, { children: "Cookies on this Site are set by:" }),
      /* @__PURE__ */ jsxs(P, { children: [
        /* @__PURE__ */ jsx("strong", { children: "First-party cookies:" }),
        " cookies set directly by Vitalis Health Strategies Inc. for the purposes of operating and improving the Site."
      ] }),
      /* @__PURE__ */ jsxs(P, { children: [
        /* @__PURE__ */ jsx("strong", { children: "Third-party cookies:" }),
        " cookies set by third-party services that we use to operate the Site, including analytics providers, scheduling tools, form platforms, and marketing tools. These third parties have their own privacy and cookie policies that govern how they use the data they collect."
      ] }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 3, title: "Categories of Cookies We Use" }),
      /* @__PURE__ */ jsx("div", { className: "my-6 overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "border-b", style: { borderColor: "#DDDDDD" }, children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-sm font-semibold text-left", style: { color: "#1C3D2E", backgroundColor: "#F0EDE6" }, children: "Category" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-sm font-semibold text-left", style: { color: "#1C3D2E", backgroundColor: "#F0EDE6" }, children: "Purpose" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-sm font-semibold text-left", style: { color: "#1C3D2E", backgroundColor: "#F0EDE6" }, children: "Examples" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-sm font-semibold text-left", style: { color: "#1C3D2E", backgroundColor: "#F0EDE6" }, children: "Can Be Disabled?" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: cookieTableData.map((row, i) => /* @__PURE__ */ jsxs(
          TableRow,
          {
            className: "border-b",
            style: {
              borderColor: "#DDDDDD",
              backgroundColor: i % 2 === 1 ? "#F0EDE6" : "transparent"
            },
            children: [
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm font-medium", style: { color: "#333333" }, children: row.category }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm", style: { color: "#333333" }, children: row.purpose }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm", style: { color: "#333333" }, children: row.examples }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm", style: { color: "#333333" }, children: row.canDisable })
            ]
          },
          i
        )) })
      ] }) }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 4, title: "Specific Cookies in Use" }),
      /* @__PURE__ */ jsx(P, { children: "The following describes the main categories of cookies active on this Site. Specific cookie names and durations may change as we update our tools and platform." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "4.1", title: "Strictly Necessary Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "These cookies are essential to the operation of the Site and cannot be disabled through our cookie settings. They do not store any personally identifiable information." }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Session management: maintain your session as you move between pages so you do not need to re-enter information",
        "Security: protect the Site and its users from fraudulent activity and unauthorized access",
        "Load balancing: distribute traffic across servers to ensure consistent Site performance"
      ] }),
      /* @__PURE__ */ jsx(SubHeading, { number: "4.2", title: "Analytics and Performance Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "We use analytics tools (such as Google Analytics) to collect information about how visitors use the Site. This data helps us improve content, fix technical issues, and understand which parts of the Site are most valuable to visitors." }),
      /* @__PURE__ */ jsx(P, { children: "Google Analytics cookies collect information such as:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Pages visited and time spent on each page",
        "The source of your visit (direct, search engine, referral link)",
        "Device type and browser used",
        "Geographic location at country or city level (derived from IP address — your precise location is never collected)"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "This data is aggregated and anonymous. It does not identify you personally. You can opt out of Google Analytics across all websites by installing the Google Analytics Opt-out Browser Add-on, available at tools.google.com/dlpage/gaoptout." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "4.3", title: "Functional Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "Functional cookies allow the Site to remember choices you make and provide a more personalized experience. For example:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Remembering your practice type selection (medical, dental, veterinary, surgical) so the Site can show you relevant content",
        "Preserving your progress through a multi-step assessment or form so you do not lose your responses if you navigate away"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "Disabling these cookies may mean that certain features of the Site work less smoothly or that preferences are not remembered between visits." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "4.4", title: "Marketing and Targeting Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "Marketing cookies may be used to track your activity across websites and to serve you relevant advertising or content about Vitalis services. These cookies are only placed with your explicit consent and are not active by default." }),
      /* @__PURE__ */ jsx(P, { children: "If you have consented to marketing cookies, you can withdraw that consent at any time by updating your preferences (see Section 5)." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 5, title: "Managing Your Cookie Preferences" }),
      /* @__PURE__ */ jsx(P, { children: "You have several options for controlling how cookies are used on this Site and across the web." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "5.1", title: "Browser Settings" }),
      /* @__PURE__ */ jsx(P, { children: "Most browsers allow you to control cookies through their settings. You can typically:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "View which cookies are stored on your device",
        "Delete all or specific cookies",
        "Block cookies from all sites or from specific sites",
        "Set your browser to notify you before a cookie is placed"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "Instructions for managing cookies in common browsers:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Google Chrome: Settings > Privacy and Security > Cookies and other site data",
        "Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data",
        "Safari: Preferences > Privacy > Manage Website Data",
        "Microsoft Edge: Settings > Cookies and Site Permissions > Cookies and Stored Data"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "Please note that blocking or deleting cookies may affect your ability to use certain features of the Site." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "5.2", title: "Opting Out of Analytics" }),
      /* @__PURE__ */ jsx(P, { children: "To opt out of being tracked by Google Analytics on this and other websites, visit: tools.google.com/dlpage/gaoptout" }),
      /* @__PURE__ */ jsx(SubHeading, { number: "5.3", title: "Withdrawing Consent for Marketing Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "If you previously consented to marketing or targeting cookies, you can withdraw that consent at any time by:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Updating your cookie preferences on this Site",
        "Contacting us at info@vitalisstrategies.com to request removal from any retargeting audiences"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "Withdrawing consent does not affect the lawfulness of any cookie use that occurred prior to withdrawal." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 6, title: "Cookies and Personal Information" }),
      /* @__PURE__ */ jsx(P, { children: "Most cookies used on this Site do not collect personally identifiable information. However, in some cases, cookies may be used alongside other data we hold about you — for example, if you have submitted a form or booked a consultation — to provide a more relevant experience." }),
      /* @__PURE__ */ jsx(P, { children: "Where cookies are used in connection with personal information, that use is governed by our Privacy Policy, available at www.vitalisstrategies.com/privacy." }),
      /* @__PURE__ */ jsx(P, { children: "We do not use cookies to:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Collect sensitive personal information such as health data, financial account numbers, or government identification",
        "Sell or share your personal information with third parties for their own marketing purposes",
        "Track your precise physical location"
      ] }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 7, title: "Third-Party Services and Their Cookie Policies" }),
      /* @__PURE__ */ jsx(P, { children: "We use a number of third-party services that may place their own cookies on your device. These services operate under their own privacy and cookie policies, which we encourage you to review:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Google Analytics: policies.google.com/privacy",
        "Any scheduling or booking tool used on the Site",
        "Any CRM or email marketing platform used to manage communications"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "Vitalis is not responsible for the cookie practices of third-party services. If you have concerns about a specific third-party cookie, please refer to that party's policy directly." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 8, title: "Cookie Duration" }),
      /* @__PURE__ */ jsx(P, { children: "Cookies can be either session cookies or persistent cookies:" }),
      /* @__PURE__ */ jsxs(P, { children: [
        /* @__PURE__ */ jsx("strong", { children: "Session cookies" }),
        " are temporary. They are stored in your browser's memory only for the duration of your visit and are automatically deleted when you close your browser. We use session cookies for essential Site functions such as maintaining your session as you move between pages."
      ] }),
      /* @__PURE__ */ jsxs(P, { children: [
        /* @__PURE__ */ jsx("strong", { children: "Persistent cookies" }),
        " remain on your device after your browser is closed, for a set period of time or until you delete them manually. We use persistent cookies for analytics and functional purposes. Most persistent cookies on this Site expire within 12 to 26 months."
      ] }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 9, title: "Updates to This Cookie Policy" }),
      /* @__PURE__ */ jsx(P, { children: "We may update this Cookie Policy from time to time to reflect changes in the cookies we use, changes in applicable law, or updates to our third-party service providers. Updated versions will be posted at www.vitalisstrategies.com/cookies with a revised effective date." }),
      /* @__PURE__ */ jsx(P, { children: "We encourage you to review this Policy periodically. Continued use of the Site after any update constitutes your acceptance of the revised Policy." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 10, title: "Contact Us" }),
      /* @__PURE__ */ jsx(P, { children: "If you have questions or concerns about our use of cookies or this Cookie Policy, please contact:" }),
      /* @__PURE__ */ jsxs("div", { className: "my-3 text-base leading-[1.7]", style: { color: "#333333" }, children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Vitalis Health Strategies Inc." }),
        /* @__PURE__ */ jsx("p", { children: "Calgary, Alberta, Canada" }),
        /* @__PURE__ */ jsx("p", { children: "Email: info@vitalisstrategies.com" }),
        /* @__PURE__ */ jsx("p", { children: "Website: www.vitalisstrategies.com" })
      ] }),
      /* @__PURE__ */ jsx(P, { children: "We will make reasonable efforts to respond within five (5) business days." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12", children: [
        /* @__PURE__ */ jsx("div", { className: "h-px w-full bg-accent" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-center text-sm", style: { color: "#666666" }, children: "© 2026 Vitalis Health Strategies Inc. All rights reserved." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Cookies as default
};
