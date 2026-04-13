import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePageMeta } from "@/lib/seo";
import { Separator } from "@/components/ui/separator";

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

const CapsBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6 p-4 rounded border-l-4 border-accent" style={{ backgroundColor: '#F0EDE6' }}>
    <div className="text-sm" style={{ color: '#555555' }}>
      {children}
    </div>
  </div>
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

const Terms = () => {
  usePageMeta(
    "Terms & Conditions | Vitalis Health Strategies",
    "Terms and conditions governing the use of the Vitalis Health Strategies website and services. Effective January 1, 2026.",
    "/og-terms.jpg"
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F2EC' }}>
      <Navbar />
      <main className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: '780px' }}>
          {/* Page Header */}
          <h1 className="font-display font-extrabold text-[36px] lg:text-[40px] leading-tight" style={{ color: '#1C3D2E' }}>
            Terms and Conditions of Use
          </h1>
          <p className="mt-2 text-sm italic" style={{ color: '#666666' }}>
            Effective Date: January 1, 2026 | Last Updated: March 2026
          </p>
          <GoldRule />

          {/* Preamble */}
          <P>
            By accessing, browsing, or using the Vitalis Health Strategies website located at www.vitalisstrategies.com (the "Site") and any content, features, tools, assessments, or materials made available through it, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions ("Terms"). These Terms constitute a legally binding agreement between you ("User", "you", or "your") and Vitalis Health Strategies Inc. ("Vitalis", "we", "us", or "our"), a corporation registered in the Province of Alberta, Canada.
          </P>
          <P>
            If you do not agree with any part of these Terms, you must immediately cease all use of this Site. These Terms apply to all visitors, prospective clients, referral partners, and any other persons who access or use the Site in any capacity.
          </P>

          <GoldRule />

          {/* Section 1 */}
          <SectionHeading number={1} title="About Vitalis Health Strategies Inc." />
          <P>
            Vitalis Health Strategies Inc. is a full-cycle healthcare strategy consulting firm headquartered in Calgary, Alberta, Canada. We work with private medical clinics, dental practices, veterinary facilities, surgical centres, and healthcare organizations across Canada at every stage of their development. Our services include but are not limited to:
          </P>
          <BulletList items={[
            "New practice planning, facility development, and build advisory",
            "Operational assessments, workflow redesign, and performance improvement",
            "Revenue cycle reviews, billing optimization, and financial modeling",
            "Practice growth strategy, service line expansion, and multi-site planning",
            "Mergers, acquisitions, transitions, and exit planning advisory",
            "Physician, dentist, and veterinarian recruitment and people strategy",
            "Healthcare technology evaluation, EMR selection, and digital transformation",
            "Regulatory and compliance planning for Canadian healthcare facilities",
            "Long-term strategic advisory and ongoing partnership engagements",
          ]} />
          <P>
            Use of this Site does not establish a consulting, advisory, or client-service relationship between you and Vitalis. A formal engagement is only created through a separate written agreement signed by authorized representatives of both parties.
          </P>

          <GoldRule />

          {/* Section 2 */}
          <SectionHeading number={2} title="Acceptance of Terms" />
          <P>By accessing or using this Site, you represent and warrant that:</P>
          <BulletList items={[
            "You are at least 18 years of age or the age of majority in your jurisdiction",
            "You have the legal capacity and authority to agree to these Terms",
            "You will use the Site only for lawful purposes in compliance with these Terms",
            "All information you submit through the Site is accurate, current, and complete",
            "You understand that submitting an inquiry, completing a strategic assessment form, or booking a call does not create a formal engagement or advisory relationship with Vitalis",
          ]} />
          <P>
            Vitalis reserves the right to modify these Terms at any time and without prior notice. Updated Terms will be posted on this page with a revised effective date. Your continued use of the Site following any update constitutes your acceptance of the revised Terms. We encourage you to review these Terms each time you visit.
          </P>

          <GoldRule />

          {/* Section 3 */}
          <SectionHeading number={3} title="Permitted Use of the Site" />

          <SubHeading number="3.1" title="General Use" />
          <P>
            You are granted a limited, non-exclusive, non-transferable, revocable licence to access and use the Site for your personal, non-commercial informational purposes, or for the purpose of evaluating Vitalis's services for a potential engagement.
          </P>

          <SubHeading number="3.2" title="Strategic Assessment and Inquiry Tools" />
          <P>
            The Site may offer tools, forms, and guided assessments (including the "Strategic Assessment" and related intake tools) to help prospective clients understand their practice needs. Completion of any such tool or form:
          </P>
          <BulletList items={[
            "Does not create a client, advisory, or consulting relationship",
            "Does not constitute professional advice of any kind",
            "Does not obligate Vitalis to provide any services or deliverable",
            "Is provided solely as an informational resource to support your decision-making",
          ]} />
          <P>Any information submitted through Site tools is subject to our Privacy Policy.</P>

          <SubHeading number="3.3" title="Prohibited Conduct" />
          <P>You agree that you will not, under any circumstances:</P>
          <BulletList items={[
            "Use the Site for any unlawful, fraudulent, deceptive, or malicious purpose",
            "Attempt to gain unauthorized access to any portion of the Site, its back-end systems, administrative login, servers, or related infrastructure",
            "Use any automated means, including bots, scrapers, spiders, or data harvesting tools to access, extract, or compile any content from the Site",
            "Transmit viruses, malware, spyware, ransomware, or any other harmful code or content through the Site",
            "Interfere with or disrupt the operation, performance, or security of the Site",
            "Reproduce, copy, resell, or commercially exploit any portion of the Site or its content without express written consent from Vitalis",
            "Impersonate any person or entity, or misrepresent your identity, affiliation, or credentials",
            "Collect, harvest, or compile personally identifiable information from the Site without authorization",
            "Submit false, misleading, or fraudulent information through any Site form or tool",
            "Circumvent, disable, or interfere with any security or access-control feature of the Site",
          ]} />

          <GoldRule />

          {/* Section 4 */}
          <SectionHeading number={4} title="Intellectual Property Rights" />

          <SubHeading number="4.1" title="Ownership" />
          <P>
            All content, materials, and intellectual property on this Site — including but not limited to the Vitalis name, logo, taglines, written copy, frameworks (including the "4Ps Framework"), assessments, service descriptions, page layouts, graphics, icons, images, and the overall design and structure of the Site — are the exclusive property of Vitalis Health Strategies Inc. or its licensors and are protected by applicable Canadian and international copyright, trademark, trade secret, and intellectual property laws.
          </P>

          <SubHeading number="4.2" title="Trademarks" />
          <P>
            "Vitalis Health Strategies," the Vitalis logo, "Full-Cycle Healthcare Strategy," the "4Ps Framework," and all related marks, slogans, and branding are trademarks or trade names of Vitalis Health Strategies Inc. You may not use any Vitalis trademark, name, or branding element in any manner that is likely to cause confusion, that misrepresents affiliation with Vitalis, or that has not been expressly authorized in writing by Vitalis.
          </P>

          <SubHeading number="4.3" title="Limited Licence" />
          <P>
            You may view, download, and print content from this Site solely for personal, non-commercial informational use, provided you do not modify the content, retain all copyright and proprietary notices, and do not use the content in any way that implies an association with or endorsement by Vitalis without our prior written consent.
          </P>

          <SubHeading number="4.4" title="Feedback and Submissions" />
          <P>
            Any feedback, suggestions, ideas, assessment responses, or other materials you submit to Vitalis through the Site ("Submissions") may be used by Vitalis for any purpose, including improving our services, without compensation, acknowledgment, or obligation to you. You represent that you have the right to make such Submissions and that they do not infringe any third-party rights.
          </P>

          <GoldRule />

          {/* Section 5 */}
          <SectionHeading number={5} title="No Professional Advice or Client Relationship" />

          <SubHeading number="5.1" title="Informational Purpose Only" />
          <P>
            All content on this Site — including service descriptions, frameworks, articles, insights, case summaries, and results data — is provided for general informational and marketing purposes only. Nothing on this Site constitutes professional healthcare, medical, legal, financial, tax, regulatory, or business advice. Content is general in nature and does not account for your specific circumstances.
          </P>

          <SubHeading number="5.2" title="No Client Relationship Created" />
          <P>
            Your use of this Site, completion of the Strategic Assessment, submission of a contact or inquiry form, booking of a consultation call, or any communication initiated through the Site does not establish a consulting, advisory, fiduciary, or client-service relationship between you and Vitalis. Such a relationship is only created upon execution of a formal, written engagement agreement signed by authorized representatives of both parties.
          </P>

          <SubHeading number="5.3" title="Consult Qualified Professionals" />
          <P>
            All decisions regarding your healthcare practice, facility, finances, regulatory compliance, employment practices, or corporate structure should be made in consultation with qualified, licensed professionals in the relevant fields — including lawyers, accountants, physicians, and regulatory specialists. Vitalis expressly disclaims liability for any decision made in reliance on information published on this Site.
          </P>

          <GoldRule />

          {/* Section 6 */}
          <SectionHeading number={6} title="Disclaimer Regarding Results, Statistics, and Outcomes" />

          <SubHeading number="6.1" title="Illustrative Nature of Figures" />
          <P>
            All performance figures, statistics, and outcome metrics referenced on this Site — including but not limited to "$70M+ Revenue Added," "31% Average Revenue Increase," "34% Average EBITDA Improvement," "28% Average Overhead Reduction," "41% Reduction in Liabilities," "$410K Average Annual Billing Recovered," "100+ Physicians & Practitioners Partnered," "25+ New Facilities Built," "$680K Avg. Additional M&A Value Negotiated," and any other figures displayed in the "Proven Results" section or elsewhere on the Site — reflect outcomes from individual client engagements or are derived from client-reported data across the Vitalis client portfolio.
          </P>
          <P>
            These figures are provided for illustrative purposes only. They may represent a single engagement, an average across multiple engagements, or a combination of financial and operational outcomes.
          </P>

          <SubHeading number="6.2" title="No Guarantee of Future Results" />
          <P>
            Past results do not guarantee, represent, or warrant future outcomes. Results vary significantly based on factors unique to each practice or healthcare facility, including but not limited to practice type, size, clinical specialty, geographic market, billing model, regulatory environment, starting operational baseline, and quality of implementation. No specific financial, operational, clinical, or transactional results are promised, projected, or guaranteed by Vitalis.
          </P>

          <SubHeading number="6.3" title="No Reliance" />
          <P>
            You acknowledge that you will not rely on any results, figures, or outcome data on this Site as a representation of what Vitalis will deliver in your specific engagement.
          </P>

          <GoldRule />

          {/* Section 7 */}
          <SectionHeading number={7} title="Privacy and Data Protection" />
          <P>
            Vitalis is committed to protecting your personal information. Our collection, use, and disclosure of personal information is governed by our Privacy Policy, which is incorporated into and forms part of these Terms by reference.
          </P>
          <P>
            Vitalis complies with applicable Canadian privacy legislation, including the Personal Information Protection and Electronic Documents Act (PIPEDA) and the Personal Information Protection Act (PIPA) of Alberta, as well as any other applicable provincial or federal privacy legislation.
          </P>
          <P>
            This Site may use cookies, tracking pixels, analytics tools, and similar technologies to collect information about how you use the Site. By continuing to use the Site, you consent to such use as described in our Privacy Policy and Cookie Policy.
          </P>

          <GoldRule />

          {/* Section 8 */}
          <SectionHeading number={8} title="Third-Party Links and Partners" />
          <P>
            This Site contains links to third-party websites, resources, partner organizations, and ecosystem members. These links are provided for convenience only. They do not constitute an endorsement, referral, guarantee, or representation by Vitalis regarding the quality, accuracy, or suitability of those third parties or their services.
          </P>
          <P>
            Vitalis has no control over and assumes no responsibility for the content, privacy practices, availability, or conduct of any third party. Your use of any third-party site or service is entirely at your own risk, and you should review the applicable terms and privacy policies independently.
          </P>

          <GoldRule />

          {/* Section 9 - ALL CAPS BLOCK */}
          <SectionHeading number={9} title="Disclaimer of Warranties" />
          <CapsBlock>
            <p className="mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE CANADIAN LAW, THIS SITE AND ALL CONTENT, TOOLS, ASSESSMENTS, AND MATERIALS MADE AVAILABLE THROUGH IT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
            </p>
            <p className="mb-3">
              VITALIS HEALTH STRATEGIES INC. EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="space-y-2 pl-4 mb-3">
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>WARRANTIES THAT THE SITE WILL BE AVAILABLE, UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR HARMFUL COMPONENTS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>WARRANTIES AS TO THE ACCURACY, COMPLETENESS, RELIABILITY, TIMELINESS, OR APPLICABILITY OF ANY CONTENT, ASSESSMENT OUTPUT, OR INFORMATION ON THE SITE</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>WARRANTIES THAT ANY INFORMATION SUBMITTED THROUGH THE SITE WILL BE RECEIVED, PROCESSED, OR RESPONDED TO WITHIN ANY PARTICULAR TIMEFRAME</span>
              </li>
            </ul>
          </CapsBlock>

          <GoldRule />

          {/* Section 10 - ALL CAPS BLOCK */}
          <SectionHeading number={10} title="Limitation of Liability" />
          <CapsBlock>
            <p className="mb-3">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, VITALIS HEALTH STRATEGIES INC., ITS DIRECTORS, OFFICERS, EMPLOYEES, ADVISORS, CONTRACTORS, AND AFFILIATES SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="space-y-2 pl-4 mb-3">
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>LOSS OF REVENUE, PROFIT, BUSINESS OPPORTUNITY, DATA, GOODWILL, OR ANTICIPATED SAVINGS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>REPUTATIONAL HARM, BUSINESS INTERRUPTION, OR CLINICAL DISRUPTION</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>COSTS OF PROCUREMENT OF SUBSTITUTE SERVICES OR PROFESSIONAL ADVICE</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>DECISIONS MADE IN RELIANCE ON CONTENT, TOOLS, OR ASSESSMENT OUTPUTS AVAILABLE THROUGH THIS SITE</span>
              </li>
            </ul>
            <p className="mb-3">
              ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THIS SITE, REGARDLESS OF THE LEGAL THEORY UPON WHICH SUCH CLAIM IS BASED, EVEN IF VITALIS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              IN ALL CASES, VITALIS'S TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM YOUR USE OF THIS SITE SHALL NOT EXCEED ONE HUNDRED CANADIAN DOLLARS (CAD $100.00).
            </p>
          </CapsBlock>

          <GoldRule />

          {/* Section 11 */}
          <SectionHeading number={11} title="Indemnification" />
          <P>
            You agree to defend, indemnify, and hold harmless Vitalis Health Strategies Inc. and its affiliates, directors, officers, employees, advisors, and contractors from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or relating to:
          </P>
          <BulletList items={[
            "Your violation of any provision of these Terms",
            "Your use of the Site or any content, tool, or output accessed through it",
            "Any information or content you submit through the Site",
            "Your violation of any applicable law, regulation, or third-party right",
            "Any misrepresentation you make in connection with your use of the Site",
          ]} />

          <GoldRule />

          {/* Section 12 */}
          <SectionHeading number={12} title="Confidentiality" />
          <P>
            Vitalis maintains strict confidentiality with respect to client information shared within the context of a formal engagement, governed by the confidentiality provisions of the applicable engagement agreement.
          </P>
          <P>
            If you contact Vitalis through this Site and voluntarily share sensitive business, clinical, or financial information prior to a signed engagement agreement, Vitalis will treat such information with reasonable discretion. However, submission of information through a general contact form, assessment tool, or inquiry form does not create a formal confidentiality obligation. Do not submit information you wish to keep strictly confidential prior to entering a formal engagement agreement with Vitalis.
          </P>

          <GoldRule />

          {/* Section 13 */}
          <SectionHeading number={13} title="Electronic Communications" />
          <P>
            By using this Site or submitting any form or inquiry, you consent to receive electronic communications from Vitalis, including operational responses to your inquiry and information about our services. You may opt out of marketing communications at any time by following the unsubscribe link in those communications or by contacting us directly.
          </P>
          <P>
            You agree that electronic communications from Vitalis satisfy any applicable legal requirement that communications be provided in writing.
          </P>

          <GoldRule />

          {/* Section 14 */}
          <SectionHeading number={14} title="Governing Law and Jurisdiction" />
          <P>
            These Terms are governed by and construed in accordance with the laws of the Province of Alberta and the federal laws of Canada applicable therein, without regard to conflict of law principles.
          </P>
          <P>
            Any dispute arising out of or relating to these Terms or your use of this Site shall be subject to the exclusive jurisdiction of the courts of the Province of Alberta, Canada. You irrevocably submit to the personal jurisdiction of such courts and waive any objection to venue.
          </P>
          <P>
            If you access this Site from outside Canada, you do so at your own initiative and are solely responsible for compliance with all applicable local laws.
          </P>

          <GoldRule />

          {/* Section 15 */}
          <SectionHeading number={15} title="Dispute Resolution" />

          <SubHeading number="15.1" title="Good Faith Negotiation" />
          <P>
            Before initiating formal proceedings, the parties agree to attempt to resolve any dispute through good faith written negotiation. The party initiating the dispute shall provide written notice describing the nature of the issue and the resolution sought. The parties shall have thirty (30) days from receipt to resolve the matter informally.
          </P>

          <SubHeading number="15.2" title="Mediation" />
          <P>
            If negotiation fails, the parties agree to attempt non-binding mediation in Calgary, Alberta, with costs shared equally, before pursuing litigation.
          </P>

          <SubHeading number="15.3" title="Litigation" />
          <P>
            If mediation is unsuccessful, either party may pursue claims in the courts of the Province of Alberta.
          </P>

          <GoldRule />

          {/* Section 16 */}
          <SectionHeading number={16} title="Termination and Access Restriction" />
          <P>
            Vitalis reserves the right, in its sole discretion and without prior notice, to suspend or terminate your access to the Site, disable any content, or take any other action available at law or in equity — for any reason, including breach of these Terms, fraudulent or harmful activity, or conduct Vitalis deems detrimental to the Site, its users, or its business.
          </P>
          <P>
            Upon termination, all licences granted under these Terms immediately cease. All provisions that by their nature should survive termination shall do so, including intellectual property rights, disclaimers, limitations of liability, indemnification, results disclaimers, and governing law.
          </P>

          <GoldRule />

          {/* Section 17 */}
          <SectionHeading number={17} title="Force Majeure" />
          <P>
            Vitalis shall not be liable for any failure or delay resulting from causes beyond our reasonable control, including acts of God, pandemics, natural disasters, war, terrorism, civil unrest, labour disputes, government orders, internet or telecommunications disruptions, or power failures.
          </P>

          <GoldRule />

          {/* Section 18 */}
          <SectionHeading number={18} title="Severability and Entire Agreement" />
          <P>
            If any provision of these Terms is found to be invalid or unenforceable, it shall be modified to the minimum extent necessary to make it enforceable, or severed if modification is not possible, without affecting the remaining provisions.
          </P>
          <P>
            These Terms, together with our Privacy Policy, Cookie Policy, and Disclaimer, constitute the entire agreement between you and Vitalis with respect to your use of this Site and supersede all prior understandings, whether written or oral.
          </P>

          <GoldRule />

          {/* Section 19 */}
          <SectionHeading number={19} title="Waiver" />
          <P>
            No failure or delay by Vitalis in exercising any right under these Terms shall constitute a waiver of that right. A waiver in one instance does not operate as a waiver in any future instance.
          </P>

          <GoldRule />

          {/* Section 20 */}
          <SectionHeading number={20} title="Contact Information" />
          <P>
            For questions, concerns, or complaints regarding these Terms, please contact:
          </P>
          <div className="my-3 text-base leading-[1.7]" style={{ color: '#333333' }}>
            <p className="font-semibold">Vitalis Health Strategies Inc.</p>
            <p>Calgary, Alberta, Canada</p>
            <p>Email: info@vitalisstrategies.com</p>
            <p>Website: www.vitalisstrategies.com</p>
          </div>
          <P>We will make reasonable efforts to respond within five (5) business days.</P>

          {/* Final acknowledgment */}
          <GoldRule />

          <CapsBlock>
            <p>
              BY ACCESSING OR USING THIS SITE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS IN FULL, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE, PLEASE DISCONTINUE USE OF THIS SITE IMMEDIATELY.
            </p>
          </CapsBlock>

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

export default Terms;
