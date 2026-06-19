import { siteConfig } from "../../config/site";

export function organizationJsonLd(overrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: overrides.name || siteConfig.name,
    url: overrides.url || siteConfig.url,
    logo: overrides.logo || siteConfig.logo,
    contactPoint: overrides.contactPoint || [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"]
      }
    ],
  };
}

export function websiteJsonLd(overrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: overrides.url || siteConfig.url,
    name: overrides.name || siteConfig.name,
    description: overrides.description || siteConfig.description,
  };
}

export function breadcrumbList(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.title,
      item: item.url,
    })),
  };
}

export function serviceJsonLd(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function articleJsonLd(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: article.author || siteConfig.name,
    datePublished: article.datePublished,
  };
}
