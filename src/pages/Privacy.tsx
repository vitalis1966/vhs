import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePageMeta } from "@/lib/seo";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const GoldRule = () => (
  <div className="my-8">
    <div className="h-px w-full bg-accent" />
  </div>
);

const SectionHeading = ({ number, title }: { number: number; title: string }) => (
  <h2 className="text-[22px] font-bold mt-8 mb-3 font-display" style={{ color: '#1C3D2E' }}>
    {number}. {title}
  </h2>
);

const SubHeading = ({ number, title }: { number: string; title: string }) => (
  <h3 className="text-[18px] font-semibold mt-6 mb-3 font-display" style={{ color: '#1C3D2E' }}>
    {number} {title}
  </h3>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="my-3 space-y-2 pl-4">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-base leading-[1.7]" style={{ color: '#333333' }}>
        <span className="mt-[10px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base leading-[1.7] my-3" style={{ color: '#333333' }}>{children}</p>
);

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
    { type: "Legal and compliance records", period: "As required by applicable law" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F2EC' }}>
      <Navbar />
      <main className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: '780px' }}>
          {/* Page Header */}
          <h1 className="font-display font-extrabold text-[36px] lg:text-[40px] leading-tight" style={{ color: '#1C3D2E' }}>
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm italic" style={{ color: '#666666' }}>
            Effective Date: January 1, 2026 | Last Updated: March 2026
          </p>
          <GoldRule />

          {/* Preamble */}
          <P>
            Vitalis Health Strategies Inc. ("Vitalis", "we", "us", or "our") is committed to protecting the privacy and personal information of everyone who visits, interacts with, or submits information through our website at www.vitalisstrategies.com (the "Site"). This Privacy Policy explains what personal information we collect, how we use it, who we share it with, and what rights you have in relation to it.
          </P>
          <P>
            By using this Site — including completing the Strategic Assessment, submitting a contact form, booking a consultation, or browsing any page — you consent to the practices described in this Privacy Policy. If you do not agree with this Policy, please discontinue use of the Site.
          </P>

          <GoldRule />

          {/* Section 1 */}
          <SectionHeading number={1} title="Who We Are" />
          <div className="my-3 text-base leading-[1.7]" style={{ color: '#333333' }}>
            <p className="font-semibold">Vitalis Health Strategies Inc.</p>
            <p>Calgary, Alberta, Canada</p>
            <p>Website: www.vitalisstrategies.com</p>
            <p>Email: info@vitalisstrategies.com</p>
          </div>
          <P>
            Vitalis is the "organization" responsible for the personal information collected through this Site, as defined under applicable Canadian privacy legislation. For questions about this Policy or our privacy practices, contact us at the information above.
          </P>

          <GoldRule />

          {/* Section 2 */}
          <SectionHeading number={2} title="Applicable Law" />
          <P>
            Vitalis operates in Canada and complies with the following privacy legislation, as applicable:
          </P>
          <BulletList items={[
            "Personal Information Protection and Electronic Documents Act (PIPEDA) — federal law governing private-sector organizations",
            "Personal Information Protection Act (PIPA) of Alberta — provincial law governing collection, use, and disclosure of personal information in Alberta",
            "Any other applicable provincial privacy legislation",
          ]} />
          <P>
            If you are located outside Canada, please be aware that your information will be processed in Canada under Canadian law.
          </P>

          <GoldRule />

          {/* Section 3 */}
          <SectionHeading number={3} title="What Personal Information We Collect" />
          <P>
            We collect personal information only to the extent necessary to respond to your inquiries, provide our services, and operate the Site.
          </P>

          <SubHeading number="3.1" title="Information You Provide Directly" />
          <P>
            When you interact with the Site — including completing the Strategic Assessment, submitting a contact or inquiry form, booking a consultation call, or communicating with us by email — you may provide:
          </P>
          <BulletList items={[
            "Identity information: your name, professional title, and practice or organization name",
            "Contact information: email address, phone number, and mailing address",
            "Practice information: practice type (medical, dental, veterinary, surgical), location, size, stage of development, and service needs",
            "Assessment responses: answers to guided questions in the Strategic Assessment tool related to your practice's operations, revenue, staffing, and goals",
            "Communication content: the content of messages, questions, or notes you submit through forms or email",
            "Scheduling information: preferred dates and times if you book a consultation",
          ]} />
          <P>
            We do not collect sensitive personal information such as health records, financial account numbers, government-issued identification numbers, or payment card information through this Site.
          </P>

          <SubHeading number="3.2" title="Information Collected Automatically" />
          <P>
            When you visit the Site, certain technical information is collected automatically through cookies, analytics tools, and server logs, including:
          </P>
          <BulletList items={[
            "Device and browser information: browser type and version, operating system, device type, and screen resolution",
            "Usage data: pages visited, time spent on pages, links clicked, referral source, and navigation paths",
            "Network information: IP address, approximate geographic location (derived from IP), and internet service provider",
            "Session data: session duration, entry and exit pages, and interaction patterns",
          ]} />
          <P>
            This information is used in aggregate to understand how the Site is used and to improve its performance and content.
          </P>

          <SubHeading number="3.3" title="Information from Cookies and Tracking Technologies" />
          <P>
            The Site uses cookies and similar technologies. See Section 9 (Cookies) for a full explanation of what cookies we use and how to manage them.
          </P>

          <GoldRule />

          {/* Section 4 */}
          <SectionHeading number={4} title="Why We Collect Personal Information and How We Use It" />
          <P>
            Vitalis collects and uses personal information only for legitimate purposes directly related to the services we provide and the operation of the Site. We use your information to:
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Respond to your inquiries and requests</h4>
          <P>
            When you submit a contact form, complete the Strategic Assessment, or book a consultation, we use the information you provide to respond to you, answer your questions, and assess whether and how Vitalis can assist your practice.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Provide consulting services</h4>
          <P>
            Where a formal engagement agreement is established, your information is used to deliver advisory, operational, and strategic consulting services under the terms of that agreement.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Send operational communications</h4>
          <P>
            We may contact you to follow up on an inquiry, confirm a meeting, share information relevant to your expressed needs, or send administrative notices related to an engagement.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Send marketing and service communications (with consent)</h4>
          <P>
            With your consent, we may send information about Vitalis services, insights, and resources. You may withdraw this consent at any time by using the unsubscribe link in any email or by contacting us directly.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Operate, maintain, and improve the Site</h4>
          <P>
            Automatically collected usage data helps us understand how the Site is performing, which content is most useful, and how to improve the experience for all visitors.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Comply with legal obligations</h4>
          <P>
            We may use or retain personal information as required to comply with applicable laws, regulations, court orders, or regulatory requirements.
          </P>

          <P>
            We do not use personal information for purposes incompatible with the purposes for which it was collected without first obtaining your consent or as otherwise permitted by law.
          </P>

          <GoldRule />

          {/* Section 5 */}
          <SectionHeading number={5} title="Legal Basis for Processing" />
          <P>
            Under PIPEDA and PIPA (Alberta), Vitalis collects, uses, and discloses personal information based on:
          </P>
          <BulletList items={[
            "Consent — your express or implied consent provided when you interact with the Site or engage with Vitalis",
            "Contractual necessity — where processing is necessary to deliver consulting services under a signed engagement agreement",
            "Legitimate interests — operating and improving the Site, responding to inquiries, and marketing our services where proportionate and not overridden by your interests",
            "Legal obligation — where we are required to process information to comply with applicable law",
          ]} />

          <GoldRule />

          {/* Section 6 */}
          <SectionHeading number={6} title="Who We Share Your Information With" />
          <P>
            Vitalis does not sell, rent, or trade your personal information to third parties for their own marketing purposes under any circumstances.
          </P>
          <P>
            We may share your information with the following categories of recipients, only to the extent necessary:
          </P>

          <SubHeading number="6.1" title="Service Providers and Technology Partners" />
          <P>
            We use third-party service providers who process personal information on our behalf to support the operation of the Site and our business, including:
          </P>
          <BulletList items={[
            "Website hosting and infrastructure providers",
            "Email communication and CRM platforms used to manage inquiries and client communications",
            "Analytics providers (such as Google Analytics or similar) used to understand Site usage",
            "Scheduling and booking tools used to facilitate consultation bookings",
            "Form and assessment tools used to collect and route inquiry submissions",
          ]} />
          <P>
            All service providers are required to process personal information only on our instructions, maintain appropriate security measures, and not use your information for their own purposes.
          </P>

          <SubHeading number="6.2" title="Strategic Ecosystem Partners" />
          <P>
            The Site features information about Vitalis's ecosystem of strategic partners, including financial institutions, architects, legal advisors, real estate advisors, and technology providers. If you express interest in being connected with a specific partner, we will only share your contact information with that partner with your explicit consent at the time of referral.
          </P>

          <SubHeading number="6.3" title="Legal and Regulatory Requirements" />
          <P>
            We may disclose personal information if required to do so by law, court order, or regulatory authority, or where we believe disclosure is necessary to protect the rights, property, or safety of Vitalis, our clients, or others.
          </P>

          <SubHeading number="6.4" title="Business Transfers" />
          <P>
            If Vitalis undergoes a merger, acquisition, corporate reorganization, or sale of assets, personal information held by Vitalis may be transferred to the acquiring entity as part of that transaction. We will notify affected individuals if such a transfer results in a material change to how their information is handled.
          </P>

          <GoldRule />

          {/* Section 7 */}
          <SectionHeading number={7} title="Data Retention" />
          <P>
            We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law.
          </P>

          <div className="my-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b" style={{ borderColor: '#DDDDDD' }}>
                  <TableHead className="text-sm font-semibold text-left" style={{ color: '#1C3D2E', backgroundColor: '#F0EDE6' }}>Type of Information</TableHead>
                  <TableHead className="text-sm font-semibold text-left" style={{ color: '#1C3D2E', backgroundColor: '#F0EDE6' }}>Retention Period</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {retentionData.map((row, i) => (
                  <TableRow
                    key={i}
                    className="border-b"
                    style={{
                      borderColor: '#DDDDDD',
                      backgroundColor: i % 2 === 1 ? '#F0EDE6' : 'transparent',
                    }}
                  >
                    <TableCell className="text-sm" style={{ color: '#333333' }}>{row.type}</TableCell>
                    <TableCell className="text-sm" style={{ color: '#333333' }}>{row.period}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <P>When personal information is no longer required, we securely delete or anonymize it.</P>

          <GoldRule />

          {/* Section 8 */}
          <SectionHeading number={8} title="Your Privacy Rights" />
          <P>
            Under PIPEDA and PIPA (Alberta), you have the following rights with respect to your personal information:
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Right of Access</h4>
          <P>
            You have the right to request access to the personal information Vitalis holds about you, the purposes for which it is being used, and the third parties to whom it has been disclosed.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Right to Correction</h4>
          <P>
            If you believe that personal information we hold about you is inaccurate or incomplete, you have the right to request that it be corrected.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Right to Withdraw Consent</h4>
          <P>
            Where our use of your information is based on consent, you may withdraw that consent at any time. Withdrawal of consent does not affect the lawfulness of any processing that occurred prior to withdrawal.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Right to Request Deletion</h4>
          <P>
            In certain circumstances, you may request that we delete personal information we hold about you, subject to any legal or contractual obligations that require us to retain it.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Right to Complain</h4>
          <P>
            If you believe your privacy rights have been violated, you have the right to file a complaint with the Office of the Privacy Commissioner of Canada (www.priv.gc.ca) or the Office of the Information and Privacy Commissioner of Alberta (www.oipc.ab.ca).
          </P>

          <P>
            To exercise any of these rights, contact us at: info@vitalisstrategies.com
          </P>
          <P>
            We will respond to all verified requests within 30 days, or notify you if additional time is required.
          </P>

          <GoldRule />

          {/* Section 9 */}
          <SectionHeading number={9} title="Cookies and Tracking Technologies" />

          <SubHeading number="9.1" title="What Are Cookies" />
          <P>
            Cookies are small text files placed on your device when you visit a website. They allow the website to recognize your browser and store certain information about your preferences or actions.
          </P>

          <SubHeading number="9.2" title="Types of Cookies We Use" />

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Strictly Necessary Cookies</h4>
          <P>
            Required for the Site to function. These cannot be disabled. They include session management and security cookies.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Analytics and Performance Cookies</h4>
          <P>
            Used to understand how visitors interact with the Site — which pages are visited most, where visitors come from, and how they navigate. This data is used in aggregate and does not personally identify individuals. Examples include Google Analytics.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Functional Cookies</h4>
          <P>
            Used to remember your preferences and improve your experience on the Site, such as pre-filling forms or remembering your practice type selection.
          </P>

          <h4 className="font-semibold mt-4 mb-1 text-base" style={{ color: '#1C3D2E' }}>Marketing and Targeting Cookies</h4>
          <P>
            Used to deliver relevant content and track the effectiveness of marketing campaigns. These are only placed with your consent.
          </P>

          <SubHeading number="9.3" title="Managing Cookies" />
          <P>
            You may control cookie settings through your browser. Most browsers allow you to refuse or delete cookies. Note that disabling certain cookies may affect the functionality of the Site. For full details on cookie management, see our Cookie Policy at www.vitalisstrategies.com/cookies.
          </P>

          <GoldRule />

          {/* Section 10 */}
          <SectionHeading number={10} title="Security" />
          <P>
            Vitalis takes the security of your personal information seriously. We implement reasonable administrative, technical, and physical safeguards to protect personal information from unauthorized access, use, disclosure, alteration, or destruction. These measures include:
          </P>
          <BulletList items={[
            "Encrypted data transmission (HTTPS/TLS) across the Site",
            "Access controls limiting who within Vitalis can access personal information",
            "Vendor due diligence requirements for third-party service providers",
            "Regular review of security practices",
          ]} />
          <P>
            No method of transmission over the internet or electronic storage is completely secure. While we take all reasonable precautions, we cannot guarantee absolute security. In the event of a privacy breach that poses a real risk of significant harm to affected individuals, we will notify affected parties and relevant authorities as required by applicable law.
          </P>

          <GoldRule />

          {/* Section 11 */}
          <SectionHeading number={11} title="Children's Privacy" />
          <P>
            This Site is not directed to individuals under the age of 18, and we do not knowingly collect personal information from minors. If you believe a minor has submitted personal information through this Site, please contact us at info@vitalisstrategies.com and we will promptly delete it.
          </P>

          <GoldRule />

          {/* Section 12 */}
          <SectionHeading number={12} title="Links to Third-Party Sites" />
          <P>
            This Site contains links to third-party websites, including ecosystem partners, technology providers, and professional associations. This Privacy Policy applies only to information collected through the Vitalis Site. We are not responsible for the privacy practices of any third-party site. We encourage you to review the privacy policies of any site you visit.
          </P>

          <GoldRule />

          {/* Section 13 */}
          <SectionHeading number={13} title="Cross-Border Data Transfers" />
          <P>
            Vitalis is based in Alberta, Canada. Some of our service providers (such as analytics, hosting, or email platforms) may process your data outside of Canada, including in the United States. When personal information is transferred outside Canada, we take steps to ensure it is protected by contractual obligations consistent with Canadian privacy law standards. By using this Site, you consent to such transfers where necessary for the operation of the Site.
          </P>

          <GoldRule />

          {/* Section 14 */}
          <SectionHeading number={14} title="Changes to This Policy" />
          <P>
            We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or the features of the Site. Updated versions will be posted at www.vitalisstrategies.com/privacy with a revised effective date. We encourage you to review this Policy periodically. Continued use of the Site after any update constitutes your acceptance of the revised Policy.
          </P>
          <P>
            For material changes, we will take reasonable steps to notify you — such as posting a prominent notice on the Site or sending an email to contacts in our database where appropriate.
          </P>

          <GoldRule />

          {/* Section 15 */}
          <SectionHeading number={15} title="Contact Us" />
          <P>
            If you have any questions, concerns, or requests regarding this Privacy Policy or the personal information Vitalis holds about you, please contact:
          </P>
          <div className="my-3 text-base leading-[1.7]" style={{ color: '#333333' }}>
            <p className="font-semibold">Vitalis Health Strategies Inc.</p>
            <p>Calgary, Alberta, Canada</p>
            <p>Email: info@vitalisstrategies.com</p>
            <p>Website: www.vitalisstrategies.com</p>
          </div>
          <P>
            We will acknowledge receipt of your request promptly and respond within 30 days.
          </P>
          <P>
            If you are not satisfied with our response, you have the right to contact:
          </P>
          <div className="my-3 text-base leading-[1.7]" style={{ color: '#333333' }}>
            <p className="font-semibold">Office of the Privacy Commissioner of Canada</p>
            <p>www.priv.gc.ca | 1-800-282-1376</p>
          </div>
          <div className="my-3 text-base leading-[1.7]" style={{ color: '#333333' }}>
            <p className="font-semibold">Office of the Information and Privacy Commissioner of Alberta</p>
            <p>www.oipc.ab.ca | 1-888-878-4044</p>
          </div>

          {/* Page footer */}
          <div className="mt-12">
            <div className="h-px w-full bg-accent" />
            <p className="mt-4 text-center text-sm" style={{ color: '#666666' }}>
              © 2026 Vitalis Health Strategies Inc. All rights reserved.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
