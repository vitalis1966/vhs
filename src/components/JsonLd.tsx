import { useEffect } from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  return null;
}

const SITE_URL = "https://www.vitalisstrategies.com";
const LOGO_URL = `${SITE_URL}/assets/holland-logo.svg`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Vitalis Health Strategies",
  url: SITE_URL,
  logo: LOGO_URL,
  description:
    "Clinician-led healthcare consulting firm helping medical, dental, and veterinary practices plan, build, grow, and optimize across Canada.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calgary",
    addressRegion: "AB",
    addressCountry: "CA",
  },
  areaServed: {
    "@type": "Country",
    name: "Canada",
  },
  sameAs: [],
  serviceType: [
    "Healthcare Consulting",
    "Practice Development",
    "Operational Consulting",
    "Financial Advisory",
    "Strategic Planning",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vitalis Health Strategies",
  url: SITE_URL,
};

export function buildServiceSchema(
  name: string,
  description: string,
  path: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: {
      "@type": "ProfessionalService",
      name: "Vitalis Health Strategies",
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
