import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePageMeta } from "@/lib/seo";

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

const Disclaimer = () => {
  usePageMeta(
    "Disclaimer | Vitalis Health Strategies",
    "Disclaimer for Vitalis Health Strategies Inc. governing the use of our website content, results, and third-party links."
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F2EC' }}>
      <Navbar />
      <main className="pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="mx-auto px-6 lg:px-12" style={{ maxWidth: '780px' }}>
          {/* Page Header */}
          <h1 className="font-display font-extrabold text-[36px] lg:text-[40px] leading-tight" style={{ color: '#1C3D2E' }}>
            Disclaimer
          </h1>
          <p className="mt-2 text-sm italic" style={{ color: '#666666' }}>
            Effective Date: January 1, 2026 | Last Updated: March 2026
          </p>
          <GoldRule />

          {/* Preamble */}
          <P>
            This Disclaimer governs your use of the website located at www.vitalisstrategies.com (the "Site") operated by Vitalis Health Strategies Inc. ("Vitalis", "we", "us", or "our"), a corporation registered in the Province of Alberta, Canada. By accessing or using the Site, you acknowledge that you have read, understood, and agree to this Disclaimer in full.
          </P>
          <P>
            This Disclaimer should be read alongside our Terms and Conditions, Privacy Policy, and Cookie Policy, all of which are incorporated by reference.
          </P>

          <GoldRule />

          {/* Section 1 */}
          <SectionHeading number={1} title="General Information Only" />
          <P>
            All content published on this Site — including service descriptions, articles, insights, frameworks, assessments, case references, and any other written, visual, or interactive materials — is provided for general informational and marketing purposes only.
          </P>
          <P>
            Nothing on this Site constitutes, or is intended to constitute, professional advice of any kind, including but not limited to:
          </P>
          <BulletList items={[
            "Medical, clinical, or healthcare advice",
            "Legal advice",
            "Financial, accounting, or tax advice",
            "Regulatory or compliance advice",
            "Business, investment, or strategic advice",
          ]} />
          <P>
            The information on this Site is general in nature. It has not been prepared with your specific circumstances, practice type, financial situation, regulatory environment, or objectives in mind. You should not act or refrain from acting on the basis of any content on this Site without first seeking independent, qualified professional advice appropriate to your situation.
          </P>

          <GoldRule />

          {/* Section 2 */}
          <SectionHeading number={2} title="No Client or Advisory Relationship" />
          <P>
            Your use of this Site, your review of any content on it, your completion of the Strategic Assessment tool, your submission of any contact or inquiry form, or any communication you initiate through the Site does not establish — and is not intended to establish — a consulting, advisory, fiduciary, professional, or client-service relationship between you and Vitalis Health Strategies Inc.
          </P>
          <P>
            A formal engagement relationship with Vitalis is only created upon the execution of a written engagement agreement signed by authorized representatives of both parties. Until such an agreement is in place, Vitalis has no obligation to provide services, advice, deliverables, or follow-up of any kind.
          </P>

          <GoldRule />

          {/* Section 3 */}
          <SectionHeading number={3} title="Results, Statistics, and Performance Figures" />

          <SubHeading number="3.1" title="Illustrative Purposes Only" />
          <P>
            All results, statistics, performance metrics, case outcomes, and financial figures referenced on this Site — including but not limited to those displayed in the "Proven Results" section and any figures referenced in service descriptions or case summaries — are provided for illustrative purposes only.
          </P>
          <P>These figures may reflect:</P>
          <BulletList items={[
            "Outcomes from a single client engagement",
            "Averages calculated across multiple engagements",
            "Figures derived from client-reported data",
            "Estimates based on observed patterns across the Vitalis client portfolio",
          ]} />

          <SubHeading number="3.2" title="No Guarantee of Results" />
          <P>
            Past results do not constitute a guarantee, promise, representation, or warranty of future performance. Results vary significantly based on a wide range of factors that are unique to each practice or healthcare organization, including but not limited to:
          </P>
          <BulletList items={[
            "Practice type, size, and clinical specialty",
            "Geographic market and competitive environment",
            "Regulatory and billing framework applicable to the practice",
            "Starting operational and financial baseline at time of engagement",
            "Quality and consistency of implementation",
            "External market conditions beyond the control of either party",
          ]} />
          <P>
            No specific financial, operational, clinical, or transactional outcome is guaranteed or implied by any figure, statistic, or result displayed on this Site.
          </P>

          <SubHeading number="3.3" title="No Reliance" />
          <P>
            You acknowledge and agree that you will not rely on any figure, statistic, outcome reference, or result displayed on this Site as a projection, forecast, or guarantee of what Vitalis will deliver in your engagement.
          </P>

          <GoldRule />

          {/* Section 4 */}
          <SectionHeading number={4} title="External Links and Third-Party Content" />
          <P>
            This Site may contain links to third-party websites, resources, ecosystem partners, professional associations, regulatory bodies, and other external content. These links are provided for your convenience only.
          </P>
          <P>
            Vitalis does not endorse, recommend, sponsor, or take responsibility for the accuracy, reliability, completeness, or suitability of any content, products, services, or opinions expressed on third-party sites. The inclusion of any link does not imply an affiliation, partnership, or endorsement between Vitalis and the linked site or organization.
          </P>
          <P>
            Your use of any third-party site is entirely at your own risk. We encourage you to review the terms, conditions, and privacy policies of any external site you visit.
          </P>

          <GoldRule />

          {/* Section 5 */}
          <SectionHeading number={5} title="Accuracy and Currency of Information" />
          <P>
            Vitalis makes reasonable efforts to ensure that the content on this Site is accurate and current at the time of publication. However:
          </P>
          <BulletList items={[
            "The healthcare consulting, regulatory, and business environment changes frequently. Content may not reflect the most recent developments in law, regulation, clinical practice, or industry standards.",
            "Vitalis does not warrant that any content on the Site is complete, accurate, reliable, or up to date at the time you access it.",
            "Vitalis reserves the right to update, modify, or remove any content on the Site at any time without notice.",
          ]} />
          <P>
            You should independently verify any information on this Site before relying on it for any purpose.
          </P>

          <GoldRule />

          {/* Section 6 */}
          <SectionHeading number={6} title="Technology and Site Availability" />
          <P>Vitalis does not warrant that:</P>
          <BulletList items={[
            "The Site will be available at all times or without interruption",
            "The Site will be free from errors, bugs, or technical failures",
            "The Site or any content delivered through it will be free of viruses or other harmful code",
            "Defects will be corrected",
          ]} />
          <P>
            Access to the Site may be suspended, restricted, or terminated at any time and for any reason without notice.
          </P>

          <GoldRule />

          {/* Section 7 */}
          <SectionHeading number={7} title="Healthcare and Regulatory Context" />
          <P>
            Vitalis provides strategic, operational, and business consulting services to healthcare practices. We are not a regulated healthcare provider, law firm, accounting firm, or financial advisory firm. Nothing on this Site should be interpreted as:
          </P>
          <BulletList items={[
            "Clinical or medical guidance of any kind",
            "Legal advice regarding regulatory compliance, licensing, accreditation, or liability",
            "Accounting, tax, or financial planning advice",
            "Advice regarding any specific transaction, investment, or financial decision",
          ]} />
          <P>
            All regulatory, legal, clinical, and financial decisions should be made in consultation with appropriately qualified and licensed professionals. References to regulatory bodies, legislation, accreditation standards, or compliance frameworks on this Site are for general informational context only and do not constitute legal or regulatory advice.
          </P>

          <GoldRule />

          {/* Section 8 - ALL CAPS BLOCK */}
          <SectionHeading number={8} title="Limitation of Liability" />
          <CapsBlock>
            <p className="mb-3">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, VITALIS HEALTH STRATEGIES INC., ITS DIRECTORS, OFFICERS, EMPLOYEES, ADVISORS, CONTRACTORS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY LOSS OR DAMAGE — WHETHER DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE — ARISING FROM:
            </p>
            <ul className="space-y-2 pl-4 mb-3">
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>YOUR USE OF OR RELIANCE ON ANY CONTENT, INFORMATION, OR MATERIALS ON THIS SITE</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>YOUR INABILITY TO ACCESS OR USE THE SITE</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>ANY ERRORS, OMISSIONS, OR INACCURACIES IN THE CONTENT OF THIS SITE</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>ANY DECISION MADE OR ACTION TAKEN IN RELIANCE ON THIS SITE OR ITS CONTENT</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[8px] shrink-0 block w-[6px] h-[6px] rounded-sm bg-accent" />
                <span>THE CONDUCT OR CONTENT OF ANY THIRD-PARTY SITE LINKED FROM THIS SITE</span>
              </li>
            </ul>
            <p>
              THIS LIMITATION APPLIES REGARDLESS OF THE FORM OF ACTION OR THE LEGAL THEORY UPON WHICH IT IS BASED, EVEN IF VITALIS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
            </p>
          </CapsBlock>

          <GoldRule />

          {/* Section 9 */}
          <SectionHeading number={9} title="Indemnification" />
          <P>
            By using this Site, you agree to indemnify, defend, and hold harmless Vitalis Health Strategies Inc. and its affiliates, directors, officers, employees, and contractors from and against any claims, damages, losses, costs, and expenses (including reasonable legal fees) arising from your use of the Site, your violation of this Disclaimer, or your violation of any applicable law or third-party right.
          </P>

          <GoldRule />

          {/* Section 10 */}
          <SectionHeading number={10} title="Governing Law" />
          <P>
            This Disclaimer is governed by the laws of the Province of Alberta and the federal laws of Canada applicable therein. Any disputes arising from this Disclaimer shall be subject to the exclusive jurisdiction of the courts of Alberta, Canada.
          </P>

          <GoldRule />

          {/* Section 11 */}
          <SectionHeading number={11} title="Changes to This Disclaimer" />
          <P>
            Vitalis reserves the right to update or modify this Disclaimer at any time. Changes will be posted on this page with a revised effective date. Your continued use of the Site following any update constitutes your acceptance of the revised Disclaimer.
          </P>

          <GoldRule />

          {/* Section 12 */}
          <SectionHeading number={12} title="Contact" />
          <P>For questions regarding this Disclaimer, please contact:</P>
          <div className="my-3 text-base leading-[1.7]" style={{ color: '#333333' }}>
            <p className="font-semibold">Vitalis Health Strategies Inc.</p>
            <p>Calgary, Alberta, Canada</p>
            <p>Email: info@vitalisstrategies.com</p>
            <p>Website: www.vitalisstrategies.com</p>
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

export default Disclaimer;
