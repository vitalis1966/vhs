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
const Privacy = () => {
  usePageMeta(
    "Privacy Policy | Vitalis Health Strategies",
    "Privacy policy for Vitalis Health Strategies Inc. detailing how we collect, use, and protect your personal information.",
    "/og-privacy.jpg"
  );
  const retentionData = [
    { type: "Inquiry and contact form submissions (no engagement)", period: "Up to 2 years from last contact" },
    { type: "Strategic Assessment responses (no engagement)", period: "Up to 2 years from submission" },
    { type: "Active client engagement records", period: "Duration of engagement plus 7 years" },
    { type: "Marketing email contact lists", period: "Until consent withdrawn or 3 years of inactivity" },
    { type: "Site analytics data (aggregated)", period: "Up to 26 months" },
    { type: "Legal and compliance records", period: "As required by applicable law" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", style: { backgroundColor: "#F5F2EC" }, children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "pt-32 pb-20 lg:pt-40 lg:pb-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto px-6 lg:px-12", style: { maxWidth: "780px" }, children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display font-extrabold text-[36px] lg:text-[40px] leading-tight", style: { color: "#1C3D2E" }, children: "Privacy Policy" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm italic", style: { color: "#666666" }, children: "Effective Date: January 1, 2026 | Last Updated: March 2026" }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(P, { children: 'Vitalis Health Strategies Inc. ("Vitalis", "we", "us", or "our") is committed to protecting the privacy and personal information of everyone who visits, interacts with, or submits information through our website at www.vitalisstrategies.com (the "Site"). This Privacy Policy explains what personal information we collect, how we use it, who we share it with, and what rights you have in relation to it.' }),
      /* @__PURE__ */ jsx(P, { children: "By using this Site — including completing the Strategic Assessment, submitting a contact form, booking a consultation, or browsing any page — you consent to the practices described in this Privacy Policy. If you do not agree with this Policy, please discontinue use of the Site." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 1, title: "Who We Are" }),
      /* @__PURE__ */ jsxs("div", { className: "my-3 text-base leading-[1.7]", style: { color: "#333333" }, children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Vitalis Health Strategies Inc." }),
        /* @__PURE__ */ jsx("p", { children: "Calgary, Alberta, Canada" }),
        /* @__PURE__ */ jsx("p", { children: "Website: www.vitalisstrategies.com" }),
        /* @__PURE__ */ jsx("p", { children: "Email: info@vitalisstrategies.com" })
      ] }),
      /* @__PURE__ */ jsx(P, { children: 'Vitalis is the "organization" responsible for the personal information collected through this Site, as defined under applicable Canadian privacy legislation. For questions about this Policy or our privacy practices, contact us at the information above.' }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 2, title: "Applicable Law" }),
      /* @__PURE__ */ jsx(P, { children: "Vitalis operates in Canada and complies with the following privacy legislation, as applicable:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Personal Information Protection and Electronic Documents Act (PIPEDA) — federal law governing private-sector organizations",
        "Personal Information Protection Act (PIPA) of Alberta — provincial law governing collection, use, and disclosure of personal information in Alberta",
        "Any other applicable provincial privacy legislation"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "If you are located outside Canada, please be aware that your information will be processed in Canada under Canadian law." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 3, title: "What Personal Information We Collect" }),
      /* @__PURE__ */ jsx(P, { children: "We collect personal information only to the extent necessary to respond to your inquiries, provide our services, and operate the Site." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "3.1", title: "Information You Provide Directly" }),
      /* @__PURE__ */ jsx(P, { children: "When you interact with the Site — including completing the Strategic Assessment, submitting a contact or inquiry form, booking a consultation call, or communicating with us by email — you may provide:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Identity information: your name, professional title, and practice or organization name",
        "Contact information: email address, phone number, and mailing address",
        "Practice information: practice type (medical, dental, veterinary, surgical), location, size, stage of development, and service needs",
        "Assessment responses: answers to guided questions in the Strategic Assessment tool related to your practice's operations, revenue, staffing, and goals",
        "Communication content: the content of messages, questions, or notes you submit through forms or email",
        "Scheduling information: preferred dates and times if you book a consultation"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "We do not collect sensitive personal information such as health records, financial account numbers, government-issued identification numbers, or payment card information through this Site." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "3.2", title: "Information Collected Automatically" }),
      /* @__PURE__ */ jsx(P, { children: "When you visit the Site, certain technical information is collected automatically through cookies, analytics tools, and server logs, including:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Device and browser information: browser type and version, operating system, device type, and screen resolution",
        "Usage data: pages visited, time spent on pages, links clicked, referral source, and navigation paths",
        "Network information: IP address, approximate geographic location (derived from IP), and internet service provider",
        "Session data: session duration, entry and exit pages, and interaction patterns"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "This information is used in aggregate to understand how the Site is used and to improve its performance and content." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "3.3", title: "Information from Cookies and Tracking Technologies" }),
      /* @__PURE__ */ jsx(P, { children: "The Site uses cookies and similar technologies. See Section 9 (Cookies) for a full explanation of what cookies we use and how to manage them." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 4, title: "Why We Collect Personal Information and How We Use It" }),
      /* @__PURE__ */ jsx(P, { children: "Vitalis collects and uses personal information only for legitimate purposes directly related to the services we provide and the operation of the Site. We use your information to:" }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Respond to your inquiries and requests" }),
      /* @__PURE__ */ jsx(P, { children: "When you submit a contact form, complete the Strategic Assessment, or book a consultation, we use the information you provide to respond to you, answer your questions, and assess whether and how Vitalis can assist your practice." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Provide consulting services" }),
      /* @__PURE__ */ jsx(P, { children: "Where a formal engagement agreement is established, your information is used to deliver advisory, operational, and strategic consulting services under the terms of that agreement." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Send operational communications" }),
      /* @__PURE__ */ jsx(P, { children: "We may contact you to follow up on an inquiry, confirm a meeting, share information relevant to your expressed needs, or send administrative notices related to an engagement." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Send marketing and service communications (with consent)" }),
      /* @__PURE__ */ jsx(P, { children: "With your consent, we may send information about Vitalis services, insights, and resources. You may withdraw this consent at any time by using the unsubscribe link in any email or by contacting us directly." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Operate, maintain, and improve the Site" }),
      /* @__PURE__ */ jsx(P, { children: "Automatically collected usage data helps us understand how the Site is performing, which content is most useful, and how to improve the experience for all visitors." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Comply with legal obligations" }),
      /* @__PURE__ */ jsx(P, { children: "We may use or retain personal information as required to comply with applicable laws, regulations, court orders, or regulatory requirements." }),
      /* @__PURE__ */ jsx(P, { children: "We do not use personal information for purposes incompatible with the purposes for which it was collected without first obtaining your consent or as otherwise permitted by law." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 5, title: "Legal Basis for Processing" }),
      /* @__PURE__ */ jsx(P, { children: "Under PIPEDA and PIPA (Alberta), Vitalis collects, uses, and discloses personal information based on:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Consent — your express or implied consent provided when you interact with the Site or engage with Vitalis",
        "Contractual necessity — where processing is necessary to deliver consulting services under a signed engagement agreement",
        "Legitimate interests — operating and improving the Site, responding to inquiries, and marketing our services where proportionate and not overridden by your interests",
        "Legal obligation — where we are required to process information to comply with applicable law"
      ] }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 6, title: "Who We Share Your Information With" }),
      /* @__PURE__ */ jsx(P, { children: "Vitalis does not sell, rent, or trade your personal information to third parties for their own marketing purposes under any circumstances." }),
      /* @__PURE__ */ jsx(P, { children: "We may share your information with the following categories of recipients, only to the extent necessary:" }),
      /* @__PURE__ */ jsx(SubHeading, { number: "6.1", title: "Service Providers and Technology Partners" }),
      /* @__PURE__ */ jsx(P, { children: "We use third-party service providers who process personal information on our behalf to support the operation of the Site and our business, including:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Website hosting and infrastructure providers",
        "Email communication and CRM platforms used to manage inquiries and client communications",
        "Analytics providers (such as Google Analytics or similar) used to understand Site usage",
        "Scheduling and booking tools used to facilitate consultation bookings",
        "Form and assessment tools used to collect and route inquiry submissions"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "All service providers are required to process personal information only on our instructions, maintain appropriate security measures, and not use your information for their own purposes." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "6.2", title: "Strategic Ecosystem Partners" }),
      /* @__PURE__ */ jsx(P, { children: "The Site features information about Vitalis's ecosystem of strategic partners, including financial institutions, architects, legal advisors, real estate advisors, and technology providers. If you express interest in being connected with a specific partner, we will only share your contact information with that partner with your explicit consent at the time of referral." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "6.3", title: "Legal and Regulatory Requirements" }),
      /* @__PURE__ */ jsx(P, { children: "We may disclose personal information if required to do so by law, court order, or regulatory authority, or where we believe disclosure is necessary to protect the rights, property, or safety of Vitalis, our clients, or others." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "6.4", title: "Business Transfers" }),
      /* @__PURE__ */ jsx(P, { children: "If Vitalis undergoes a merger, acquisition, corporate reorganization, or sale of assets, personal information held by Vitalis may be transferred to the acquiring entity as part of that transaction. We will notify affected individuals if such a transfer results in a material change to how their information is handled." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 7, title: "Data Retention" }),
      /* @__PURE__ */ jsx(P, { children: "We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law." }),
      /* @__PURE__ */ jsx("div", { className: "my-6 overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "border-b", style: { borderColor: "#DDDDDD" }, children: [
          /* @__PURE__ */ jsx(TableHead, { className: "text-sm font-semibold text-left", style: { color: "#1C3D2E", backgroundColor: "#F0EDE6" }, children: "Type of Information" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-sm font-semibold text-left", style: { color: "#1C3D2E", backgroundColor: "#F0EDE6" }, children: "Retention Period" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: retentionData.map((row, i) => /* @__PURE__ */ jsxs(
          TableRow,
          {
            className: "border-b",
            style: {
              borderColor: "#DDDDDD",
              backgroundColor: i % 2 === 1 ? "#F0EDE6" : "transparent"
            },
            children: [
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm", style: { color: "#333333" }, children: row.type }),
              /* @__PURE__ */ jsx(TableCell, { className: "text-sm", style: { color: "#333333" }, children: row.period })
            ]
          },
          i
        )) })
      ] }) }),
      /* @__PURE__ */ jsx(P, { children: "When personal information is no longer required, we securely delete or anonymize it." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 8, title: "Your Privacy Rights" }),
      /* @__PURE__ */ jsx(P, { children: "Under PIPEDA and PIPA (Alberta), you have the following rights with respect to your personal information:" }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Right of Access" }),
      /* @__PURE__ */ jsx(P, { children: "You have the right to request access to the personal information Vitalis holds about you, the purposes for which it is being used, and the third parties to whom it has been disclosed." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Right to Correction" }),
      /* @__PURE__ */ jsx(P, { children: "If you believe that personal information we hold about you is inaccurate or incomplete, you have the right to request that it be corrected." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Right to Withdraw Consent" }),
      /* @__PURE__ */ jsx(P, { children: "Where our use of your information is based on consent, you may withdraw that consent at any time. Withdrawal of consent does not affect the lawfulness of any processing that occurred prior to withdrawal." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Right to Request Deletion" }),
      /* @__PURE__ */ jsx(P, { children: "In certain circumstances, you may request that we delete personal information we hold about you, subject to any legal or contractual obligations that require us to retain it." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Right to Complain" }),
      /* @__PURE__ */ jsx(P, { children: "If you believe your privacy rights have been violated, you have the right to file a complaint with the Office of the Privacy Commissioner of Canada (www.priv.gc.ca) or the Office of the Information and Privacy Commissioner of Alberta (www.oipc.ab.ca)." }),
      /* @__PURE__ */ jsx(P, { children: "To exercise any of these rights, contact us at: info@vitalisstrategies.com" }),
      /* @__PURE__ */ jsx(P, { children: "We will respond to all verified requests within 30 days, or notify you if additional time is required." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 9, title: "Cookies and Tracking Technologies" }),
      /* @__PURE__ */ jsx(SubHeading, { number: "9.1", title: "What Are Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "Cookies are small text files placed on your device when you visit a website. They allow the website to recognize your browser and store certain information about your preferences or actions." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "9.2", title: "Types of Cookies We Use" }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Strictly Necessary Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "Required for the Site to function. These cannot be disabled. They include session management and security cookies." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Analytics and Performance Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "Used to understand how visitors interact with the Site — which pages are visited most, where visitors come from, and how they navigate. This data is used in aggregate and does not personally identify individuals. Examples include Google Analytics." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Functional Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "Used to remember your preferences and improve your experience on the Site, such as pre-filling forms or remembering your practice type selection." }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mt-4 mb-1 text-base", style: { color: "#1C3D2E" }, children: "Marketing and Targeting Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "Used to deliver relevant content and track the effectiveness of marketing campaigns. These are only placed with your consent." }),
      /* @__PURE__ */ jsx(SubHeading, { number: "9.3", title: "Managing Cookies" }),
      /* @__PURE__ */ jsx(P, { children: "You may control cookie settings through your browser. Most browsers allow you to refuse or delete cookies. Note that disabling certain cookies may affect the functionality of the Site. For full details on cookie management, see our Cookie Policy at www.vitalisstrategies.com/cookies." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 10, title: "Security" }),
      /* @__PURE__ */ jsx(P, { children: "Vitalis takes the security of your personal information seriously. We implement reasonable administrative, technical, and physical safeguards to protect personal information from unauthorized access, use, disclosure, alteration, or destruction. These measures include:" }),
      /* @__PURE__ */ jsx(BulletList, { items: [
        "Encrypted data transmission (HTTPS/TLS) across the Site",
        "Access controls limiting who within Vitalis can access personal information",
        "Vendor due diligence requirements for third-party service providers",
        "Regular review of security practices"
      ] }),
      /* @__PURE__ */ jsx(P, { children: "No method of transmission over the internet or electronic storage is completely secure. While we take all reasonable precautions, we cannot guarantee absolute security. In the event of a privacy breach that poses a real risk of significant harm to affected individuals, we will notify affected parties and relevant authorities as required by applicable law." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 11, title: "Children's Privacy" }),
      /* @__PURE__ */ jsx(P, { children: "This Site is not directed to individuals under the age of 18, and we do not knowingly collect personal information from minors. If you believe a minor has submitted personal information through this Site, please contact us at info@vitalisstrategies.com and we will promptly delete it." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 12, title: "Links to Third-Party Sites" }),
      /* @__PURE__ */ jsx(P, { children: "This Site contains links to third-party websites, including ecosystem partners, technology providers, and professional associations. This Privacy Policy applies only to information collected through the Vitalis Site. We are not responsible for the privacy practices of any third-party site. We encourage you to review the privacy policies of any site you visit." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 13, title: "Cross-Border Data Transfers" }),
      /* @__PURE__ */ jsx(P, { children: "Vitalis is based in Alberta, Canada. Some of our service providers (such as analytics, hosting, or email platforms) may process your data outside of Canada, including in the United States. When personal information is transferred outside Canada, we take steps to ensure it is protected by contractual obligations consistent with Canadian privacy law standards. By using this Site, you consent to such transfers where necessary for the operation of the Site." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 14, title: "Changes to This Policy" }),
      /* @__PURE__ */ jsx(P, { children: "We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or the features of the Site. Updated versions will be posted at www.vitalisstrategies.com/privacy with a revised effective date. We encourage you to review this Policy periodically. Continued use of the Site after any update constitutes your acceptance of the revised Policy." }),
      /* @__PURE__ */ jsx(P, { children: "For material changes, we will take reasonable steps to notify you — such as posting a prominent notice on the Site or sending an email to contacts in our database where appropriate." }),
      /* @__PURE__ */ jsx(GoldRule, {}),
      /* @__PURE__ */ jsx(SectionHeading, { number: 15, title: "Contact Us" }),
      /* @__PURE__ */ jsx(P, { children: "If you have any questions, concerns, or requests regarding this Privacy Policy or the personal information Vitalis holds about you, please contact:" }),
      /* @__PURE__ */ jsxs("div", { className: "my-3 text-base leading-[1.7]", style: { color: "#333333" }, children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Vitalis Health Strategies Inc." }),
        /* @__PURE__ */ jsx("p", { children: "Calgary, Alberta, Canada" }),
        /* @__PURE__ */ jsx("p", { children: "Email: info@vitalisstrategies.com" }),
        /* @__PURE__ */ jsx("p", { children: "Website: www.vitalisstrategies.com" })
      ] }),
      /* @__PURE__ */ jsx(P, { children: "We will acknowledge receipt of your request promptly and respond within 30 days." }),
      /* @__PURE__ */ jsx(P, { children: "If you are not satisfied with our response, you have the right to contact:" }),
      /* @__PURE__ */ jsxs("div", { className: "my-3 text-base leading-[1.7]", style: { color: "#333333" }, children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Office of the Privacy Commissioner of Canada" }),
        /* @__PURE__ */ jsx("p", { children: "www.priv.gc.ca | 1-800-282-1376" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "my-3 text-base leading-[1.7]", style: { color: "#333333" }, children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Office of the Information and Privacy Commissioner of Alberta" }),
        /* @__PURE__ */ jsx("p", { children: "www.oipc.ab.ca | 1-888-878-4044" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12", children: [
        /* @__PURE__ */ jsx("div", { className: "h-px w-full bg-accent" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-center text-sm", style: { color: "#666666" }, children: "© 2026 Vitalis Health Strategies Inc. All rights reserved." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
export {
  Privacy as default
};
