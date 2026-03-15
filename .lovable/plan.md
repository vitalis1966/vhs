Scope: Four targeted structural and design improvements to the homepage only.

Do not modify any pages other than the homepage in this prompt.

Do not apply the People pillar to any pages other than ThreePsSection.tsx — that consistency work is handled in a later phase.

---

CHANGE 1 — LifecycleSection.tsx: Make the full-cycle schematic larger

The full-cycle lifecycle schematic on the homepage is currently too small to read comfortably. Make the following changes:

Increase the overall width of the lifecycle schematic container to use the full available content width (100% of the content column, not a constrained inner width). Remove any max-width constraint that is currently limiting the schematic width.

Increase the size of each stage node/circle/icon by at least 40%. If nodes are using Tailwind classes such as w-12 h-12, increase to at least w-20 h-20. If nodes are using w-8 h-8 or smaller, increase to w-16 h-16 minimum.

If the schematic is built using SVG or canvas rather than Tailwind div elements, increase the viewBox width and scale all elements proportionally. Do not clip or crop the SVG — allow it to expand to fill its container.

Increase the font size of each stage label to at least text-base (16px). If labels are currently text-xs or text-sm, step them up two sizes.

Increase the spacing between nodes — use gap-8 or gap-10 between items if it is currently gap-4 or smaller.

If the schematic is displayed in a horizontal row on desktop, ensure it remains horizontal and does not collapse to vertical when enlarged. If it must wrap, wrap at tablet breakpoint only, not desktop.

If the schematic uses connecting lines or arrows between stages, scale those proportionally with the node size increase. Do not leave thin lines connecting large nodes.

On mobile, the schematic may stack vertically — ensure the increased node size and label size apply to the mobile layout as well.

The goal is that a visitor can read all stage labels without squinting or zooming. The schematic should feel like a featured diagram, not a decorative element.

---

CHANGE 2 — ThreePsSection.tsx: Add a 4th P (People)

The current section has three pillars. Do not rename or alter the existing three pillars in any way — find them in the component and leave them exactly as they are. Add a fourth pillar as the final item in the pillars array with the following properties:

Label: "People"

Number/sequence: if the existing pillars use 01, 02, 03 — add 04. If they use letters or icons only, match that pattern.

Icon: lucide-react Users or UserCheck icon — whichever visually matches the icon style used by the existing three pillars most closely.

Heading: "People"

Description: "The right practitioners, staff, and leadership structure are as important as any operational system. We help practices build the human infrastructure — recruitment, role design, and team alignment — that supports long-term performance."

Apply the People card's visual treatment (card background color, border style, border radius, shadow, icon container style, typography, spacing) by copying the exact Tailwind classes from one of the existing three pillar cards. The People card must be visually indistinguishable in style from the existing cards — it should look like it was always part of the design.

Update the section heading or subheading to reflect four pillars:

- If it currently says "Built on Three Principles" → change to "Built on Four Principles"

- If it currently says "The Three Ps" or "Three Pillars" → change to "The Four Ps" or "Four Pillars"

- If it uses different wording, update the number from three to four while keeping all other words the same

Update the grid layout:

- Desktop (lg and above): grid-cols-4

- Tablet (md): grid-cols-2

- Mobile (sm and below): grid-cols-1

Reduce individual card padding by one step (e.g. p-6 → p-5 or p-8 → p-6) to prevent the four-column layout from feeling cramped on desktop. Apply this reduction to all four cards equally so they remain uniform.

IMPORTANT: Do not apply the People pillar to any other pages, components, or sections in this prompt. That is handled in a separate phase.

---

CHANGE 3 — StrategicEcosystemSection.tsx: Redesign for clarity and connection

The current ecosystem section feels disconnected — items appear as separate floating elements without clear visual relationships. Replace the entire layout with the following hub-and-spoke connected diagram design.

CENTRAL HUB:

Label: "Vitalis Health Strategies"

Style: A larger circle or rounded card at the center, using the site's primary teal as background color, white text, slightly larger than the surrounding nodes. Add a subtle drop shadow.

SURROUNDING NODES — use exactly the following 7 nodes, positioned evenly around the central hub:

Node 1:

Icon: lucide-react Building2

Label: "Facility Development"

Node 2:

Icon: lucide-react TrendingUp

Label: "Growth Strategy"

Node 3:

Icon: lucide-react DollarSign

Label: "Billing & Revenue"

Node 4:

Icon: lucide-react Users

Label: "People & Recruitment"

Node 5:

Icon: lucide-react Settings

Label: "Operations & Workflow"

Node 6:

Icon: lucide-react Laptop

Label: "Digital & Technology"

Node 7:

Icon: lucide-react Handshake (or GitMerge if Handshake is unavailable)

Label: "Transitions & Advisory"

NODE STYLE: Each surrounding node uses a white or light teal background, a teal border (border-teal-600 or equivalent), rounded corners (rounded-xl), a small icon above the label, and a subtle box shadow. Labels are 2–4 words, font-medium, text-sm minimum.

VISUAL CONNECTIONS: Draw visible lines between the central hub and each surrounding node. Use the site's primary teal color for lines. Lines should be 2px wide. If the site uses any scroll-triggered animations elsewhere, add a subtle draw-on animation to these lines (stroke-dashoffset animation from 0 to full length). If the site does not use animations, use static lines — but they must be clearly visible, not faint.

LAYOUT IMPLEMENTATION: Use an SVG overlay for the connecting lines, positioned absolutely over a CSS grid or flex layout for the nodes. The central hub should be rendered in the center of the layout. On desktop, arrange nodes in a circular or two-column pattern around the hub with the SVG lines connecting them. Do not use a plain grid with no visible connections — the connections are the point of this section.

SECTION HEADING: Keep the existing heading text. Below the heading, add this subheading on a new line:

"Every component of your practice is connected. Our approach treats them that way."

SECTION SPACING: py-20 on desktop, py-16 on mobile.

RESPONSIVE — MOBILE: On screens below md breakpoint, replace the hub-and-spoke layout with a vertical stacked list. Show the central hub label ("Vitalis Health Strategies") at the top as a styled badge. Below it, show each of the 7 nodes as full-width cards stacked vertically, connected by a simple vertical teal line running down the left side of the cards (a left border or an absolute-positioned line element). Do not attempt to render the SVG spoke layout on mobile.

COLOR: Use only the site's existing teal palette. Do not introduce new colors.

---

CHANGE 4 — Remove the redundant homepage pathway section

There are currently two sections on the homepage that present practice pathway cards. One was updated in Phase 1 (HealthcarePathwaysSection). The other is a duplicate and must be removed from the homepage.

IDENTIFY the duplicate: Look in the homepage render file (index.tsx, App.tsx, or HomePage.tsx) for a second component that renders journey steps or solution pathway cards. It may be named any of the following — HealthcareJourneySection, SolutionPathwaysSection, YourJourneySection, PathwaysSection, or similar. It is the component that was NOT updated in Phase 1.

KEEP: HealthcarePathwaysSection — this is the component with the three cards (Planning & Building / Operating & Growing / Scaling or Transitioning) that was rewritten in Phase 1. Do not touch this component.

REMOVE: The duplicate component from the homepage render only. Delete its import statement and its JSX element from the homepage render file. Do not delete the component file itself.

AFTER REMOVING: Check the page flow. The HealthcarePathwaysSection should sit naturally between the hero/metrics area and the authority/credibility block. If removing the duplicate creates an abrupt visual jump between two sections that previously had the duplicate between them, insert a section spacer element with py-8 or py-12 between the now-adjacent sections.

If you cannot identify which component is the duplicate with confidence, leave both in place and add a comment in the code: // TODO: Identify and remove duplicate pathway section — see Phase 1 Addendum instructions. Do not guess.

&nbsp;