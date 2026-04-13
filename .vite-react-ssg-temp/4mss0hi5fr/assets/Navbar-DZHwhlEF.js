import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { L as Link } from "./index-CalXArNJ.js";
import { ChevronDown, Stethoscope, Smile, PawPrint, Building2, TrendingUp, ArrowRight, X, Menu } from "lucide-react";
import { B as Button } from "./button-DnzOxZqg.js";
import { c as cn } from "./utils-H80jjgLf.js";
import { useLocation } from "react-router";
const vitalisLogo = "/vitalis-logo.webp";
const practiceTypes = [
  {
    icon: Stethoscope,
    label: "Medical Practices",
    description: "Clinics, surgical centres, and specialty practices",
    href: "/solutions/medical"
  },
  {
    icon: Smile,
    label: "Dental Practices",
    description: "General, specialty, and multi-location dental",
    href: "/solutions/dental"
  },
  {
    icon: PawPrint,
    label: "Veterinary Practices",
    description: "Small animal, mixed, and specialty vet clinics",
    href: "/solutions/veterinary"
  }
];
const nhsfItem = {
  icon: Building2,
  label: "Non-Hospital Surgical Facilities",
  description: "Build, accredit, and operate surgical facilities across Canada",
  href: "/solutions/nhsf"
};
const planningItem = {
  icon: Building2,
  label: "Planning & Building",
  description: "Full practice development — feasibility, facility design, compliance, people, and technology",
  href: "/solutions/new-clinics"
};
const operatingItem = {
  icon: TrendingUp,
  label: "Operating, Growing & Advising",
  description: "Operations, revenue, people, growth strategy, and ownership transitions",
  href: "/solutions/existing-clinics"
};
const simpleNavLinks = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Overview", href: "/about" },
      { label: "Mission & Vision", href: "/about/mission-vision" }
    ]
  },
  {
    label: "How We Work",
    href: "/how-we-work",
    children: [
      { label: "How We Work", href: "/how-we-work" },
      { label: "Engagement", href: "/engagement" }
    ]
  },
  { label: "Healthcare IT", href: "/healthcare-it" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Insights", href: "/insights" },
  { label: "Ecosystem", href: "/partners" },
  { label: "Contact", href: "/contact" }
];
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const renderDesktopLink = (link) => {
    if (link.children) {
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative group",
          onMouseEnter: () => setOpenDropdown(link.href),
          onMouseLeave: () => setOpenDropdown(null),
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: cn(
                  "text-[13px] font-medium tracking-wide transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap py-2 px-1",
                  location.pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                ),
                children: [
                  link.label,
                  /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" })
                ]
              }
            ),
            openDropdown === link.href && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 pt-2", children: /* @__PURE__ */ jsx("div", { className: "bg-card rounded-lg shadow-elevated border border-border/40 py-2 min-w-[180px]", children: link.children.map((child) => /* @__PURE__ */ jsx(
              Link,
              {
                to: child.href,
                className: cn(
                  "block px-4 py-2 text-sm transition-colors hover:bg-secondary/50",
                  location.pathname === child.href ? "text-primary font-medium" : "text-muted-foreground"
                ),
                children: child.label
              },
              child.href
            )) }) })
          ]
        },
        link.href
      );
    }
    return /* @__PURE__ */ jsx(
      Link,
      {
        to: link.href,
        className: cn(
          "text-[13px] font-medium tracking-wide transition-colors hover:text-primary whitespace-nowrap py-2 px-1",
          location.pathname === link.href ? "text-primary" : "text-muted-foreground"
        ),
        children: link.label
      },
      link.href
    );
  };
  return /* @__PURE__ */ jsxs("nav", { className: "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex items-center justify-between h-14 lg:h-16 px-4 lg:px-6 xl:px-8 max-w-[1440px]", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex flex-col items-center gap-0.5 flex-shrink-0", children: [
        /* @__PURE__ */ jsx("img", { src: vitalisLogo, alt: "Vitalis Health Strategies", className: "h-10 lg:h-12 w-auto", width: "120", height: "48" }),
        /* @__PURE__ */ jsxs("span", { className: "hidden lg:flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "text-accent text-[10px]", children: "🍁" }),
          "Proudly Canadian"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden xl:flex items-center gap-3 2xl:gap-5", children: [
        simpleNavLinks.slice(0, 3).map(renderDesktopLink),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative group",
            onMouseEnter: () => setOpenDropdown("solutions"),
            onMouseLeave: () => setOpenDropdown(null),
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: cn(
                    "text-[13px] font-medium tracking-wide transition-colors hover:text-primary flex items-center gap-1 whitespace-nowrap py-2 px-1",
                    location.pathname.startsWith("/solutions") ? "text-primary" : "text-muted-foreground"
                  ),
                  children: [
                    "Solutions",
                    /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" })
                  ]
                }
              ),
              openDropdown === "solutions" && /* @__PURE__ */ jsx("div", { className: "absolute top-full right-0 xl:-right-20 pt-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl shadow-elevated border border-border/40 overflow-hidden", style: { width: "720px" }, children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 divide-x divide-border/40 p-6 gap-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "pr-6", children: [
                    /* @__PURE__ */ jsx("p", { className: "px-1 pb-3 text-xs font-semibold uppercase tracking-wider text-accent", children: "By Practice Type" }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-1", children: practiceTypes.map((item) => /* @__PURE__ */ jsxs(
                      Link,
                      {
                        to: item.href,
                        className: "flex items-start gap-3 px-2 py-2.5 rounded-lg transition-colors hover:bg-secondary/50 group/item",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary transition-colors", children: /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4 text-primary group-hover/item:text-primary-foreground transition-colors" }) }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: item.label }),
                            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-snug", children: item.description })
                          ] })
                        ]
                      },
                      item.href
                    )) }),
                    /* @__PURE__ */ jsxs("div", { className: "border-t border-border/30 mt-3 pt-3", children: [
                      /* @__PURE__ */ jsx("p", { className: "px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-accent", children: "Surgical Facilities" }),
                      /* @__PURE__ */ jsxs(
                        Link,
                        {
                          to: nhsfItem.href,
                          className: "flex items-start gap-3 px-2 py-2.5 rounded-lg transition-colors hover:bg-secondary/50 group/item",
                          children: [
                            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary transition-colors", children: /* @__PURE__ */ jsx(nhsfItem.icon, { className: "h-4 w-4 text-primary group-hover/item:text-primary-foreground transition-colors" }) }),
                            /* @__PURE__ */ jsxs("div", { children: [
                              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: nhsfItem.label }),
                              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-snug", children: nhsfItem.description })
                            ] })
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "px-6", children: [
                    /* @__PURE__ */ jsx("p", { className: "px-1 pb-3 text-xs font-semibold uppercase tracking-wider text-accent", children: "Planning & Building" }),
                    /* @__PURE__ */ jsxs(
                      Link,
                      {
                        to: planningItem.href,
                        className: "flex items-start gap-3 px-2 py-2.5 rounded-lg transition-colors hover:bg-secondary/50 group/item",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary transition-colors", children: /* @__PURE__ */ jsx(planningItem.icon, { className: "h-4 w-4 text-primary group-hover/item:text-primary-foreground transition-colors" }) }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: planningItem.label }),
                            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-snug", children: planningItem.description })
                          ] })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "pl-6", children: [
                    /* @__PURE__ */ jsx("p", { className: "px-1 pb-3 text-xs font-semibold uppercase tracking-wider text-accent", children: "Operating, Growing & Advising" }),
                    /* @__PURE__ */ jsxs(
                      Link,
                      {
                        to: operatingItem.href,
                        className: "flex items-start gap-3 px-2 py-2.5 rounded-lg transition-colors hover:bg-secondary/50 group/item",
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary transition-colors", children: /* @__PURE__ */ jsx(operatingItem.icon, { className: "h-4 w-4 text-primary group-hover/item:text-primary-foreground transition-colors" }) }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: operatingItem.label }),
                            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground leading-snug", children: operatingItem.description })
                          ] })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "border-t border-border/40 bg-secondary/30 px-6 py-3 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Not sure where to start?" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", className: "text-sm font-medium text-primary hover:underline flex items-center gap-1", children: [
                      "Take the Strategic Assessment ",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
                    ] }),
                    /* @__PURE__ */ jsxs(Link, { to: "/contact", className: "text-sm font-medium text-primary hover:underline flex items-center gap-1", children: [
                      "Speak With Our Team ",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
                    ] })
                  ] })
                ] })
              ] }) })
            ]
          }
        ),
        simpleNavLinks.slice(3).map(renderDesktopLink),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 ml-1 2xl:gap-2 2xl:ml-2 shrink-0", children: [
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "sm", asChild: true, className: "whitespace-nowrap text-[10px] h-8 px-2 xl:max-w-[128px] 2xl:text-[13px] 2xl:h-9 2xl:px-3 2xl:max-w-none", children: /* @__PURE__ */ jsxs(Link, { to: "/strategic-assessment", children: [
            /* @__PURE__ */ jsx("span", { className: "2xl:hidden", children: "Assessment" }),
            /* @__PURE__ */ jsx("span", { className: "hidden 2xl:inline", children: "Strategic Assessment" })
          ] }) }),
          /* @__PURE__ */ jsx(Button, { variant: "hero", size: "sm", asChild: true, className: "whitespace-nowrap text-[10px] h-8 px-2 xl:max-w-[128px] 2xl:text-[13px] 2xl:h-9 2xl:px-3 2xl:max-w-none", children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
            /* @__PURE__ */ jsx("span", { className: "2xl:hidden", children: "Speak With Team" }),
            /* @__PURE__ */ jsx("span", { className: "hidden 2xl:inline", children: "Speak With Our Team" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "xl:hidden p-2 text-foreground",
          onClick: () => setMobileOpen(!mobileOpen),
          "aria-label": "Toggle menu",
          children: mobileOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
        }
      )
    ] }),
    mobileOpen && /* @__PURE__ */ jsx("div", { className: "xl:hidden bg-background border-b border-border max-h-[80vh] overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-6 flex flex-col gap-4", children: [
      simpleNavLinks.slice(0, 3).map(
        (link) => link.children ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-foreground", children: link.label }),
          link.children.map((child) => /* @__PURE__ */ jsx(
            Link,
            {
              to: child.href,
              onClick: () => setMobileOpen(false),
              className: cn(
                "text-sm font-medium pl-4 py-1 transition-colors",
                location.pathname === child.href ? "text-primary" : "text-muted-foreground"
              ),
              children: child.label
            },
            child.href
          ))
        ] }, link.href) : /* @__PURE__ */ jsx(
          Link,
          {
            to: link.href,
            onClick: () => setMobileOpen(false),
            className: cn(
              "text-base font-medium py-2 transition-colors",
              location.pathname === link.href ? "text-primary" : "text-muted-foreground"
            ),
            children: link.label
          },
          link.href
        )
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/solutions",
            onClick: () => setMobileOpen(false),
            className: "text-base font-medium text-foreground",
            children: "Solutions"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "pl-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-1", children: "By Practice Type" }),
          practiceTypes.map((item) => /* @__PURE__ */ jsx(
            Link,
            {
              to: item.href,
              onClick: () => setMobileOpen(false),
              className: "block text-sm text-muted-foreground py-1 pl-2",
              children: item.label
            },
            item.href
          )),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-border/30 mt-2 pt-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-1", children: "Surgical Facilities" }),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: nhsfItem.href,
                onClick: () => setMobileOpen(false),
                className: "block text-sm text-muted-foreground py-1 pl-2",
                children: nhsfItem.label
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pl-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-1", children: "Planning & Building" }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: planningItem.href,
              onClick: () => setMobileOpen(false),
              className: "block text-sm text-muted-foreground py-1 pl-2",
              children: planningItem.label
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pl-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-accent mb-1", children: "Operating, Growing & Advising" }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: operatingItem.href,
              onClick: () => setMobileOpen(false),
              className: "block text-sm text-muted-foreground py-1 pl-2",
              children: operatingItem.label
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pl-4 pt-2 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/strategic-assessment",
              onClick: () => setMobileOpen(false),
              className: "text-sm font-medium text-primary flex items-center gap-1",
              children: [
                "Take the Strategic Assessment ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/contact",
              onClick: () => setMobileOpen(false),
              className: "text-sm font-medium text-primary flex items-center gap-1",
              children: [
                "Speak With Our Team ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
              ]
            }
          )
        ] })
      ] }),
      simpleNavLinks.slice(3).map((link) => /* @__PURE__ */ jsx(
        Link,
        {
          to: link.href,
          onClick: () => setMobileOpen(false),
          className: cn(
            "text-base font-medium py-2 transition-colors",
            location.pathname === link.href ? "text-primary" : "text-muted-foreground"
          ),
          children: link.label
        },
        link.href
      )),
      /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, className: "mt-2", children: /* @__PURE__ */ jsx(Link, { to: "/strategic-assessment", onClick: () => setMobileOpen(false), children: "Strategic Assessment" }) }),
      /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/contact", onClick: () => setMobileOpen(false), children: "Speak With Our Team" }) })
    ] }) })
  ] });
}
export {
  Navbar as N
};
