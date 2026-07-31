import { siteConfig } from "@/lib/site-config";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ElectricalContractor",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: "Betalight Enterprises",
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phones.primary,
    email: siteConfig.email,
    slogan: siteConfig.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
      addressLocality: siteConfig.address.city,
      addressCountry: "KE",
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({ "@type": "City", name: area })),
    openingHoursSpecification: siteConfig.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.time.split(" – ")[0],
      closes: h.time.split(" – ")[1],
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function productSchema(product: {
  name: string;
  description: string;
  imagePath: string;
  brand: string | null;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${siteConfig.url}${product.imagePath}`,
    category: product.category,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "KES",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function articleSchema(post: {
  title: string;
  seoDescription: string;
  coverImagePath: string | null;
  publishedAt: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription,
    image: post.coverImagePath ? `${siteConfig.url}${post.coverImagePath}` : undefined,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };
}
