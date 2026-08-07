import { siteConfig } from "@/lib/site-config";

export function absoluteProductUrl(slug: string): string {
  return `${siteConfig.url}/products/${slug}`;
}

export function absoluteImageUrl(imagePath: string): string {
  return imagePath.startsWith("http") ? imagePath : `${siteConfig.url}${imagePath}`;
}

// No price field exists in the product data model — Betalight is a
// quote-based B2B distributor with supplier prices that change, so this
// asks for current pricing instead of asserting a number that doesn't exist.
export function buildWhatsAppQuoteMessage(product: { name: string }, url: string): string {
  return [
    `Hello ${siteConfig.name},`,
    "",
    "I'm interested in the following product:",
    "",
    `Product: ${product.name}`,
    "",
    "Could you please provide:",
    "• Current price",
    "• Availability",
    "• Installation details",
    "• Warranty information",
    "",
    `Product link: ${url}`,
    "",
    "Thank you.",
  ].join("\n");
}

export interface ShareUrls {
  whatsapp: string;
  facebook: string;
  messenger: string;
  x: string;
  linkedin: string;
  email: string;
}

// Generic "share this link" URLs (no fixed recipient) — distinct from
// buildWhatsAppLink() in lib/whatsapp.ts, which sends an inquiry straight to
// Betalight's own WhatsApp number.
export function buildShareUrls(url: string, title: string): ShareUrls {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareText = encodeURIComponent(`${title} — ${url}`);

  return {
    whatsapp: `https://wa.me/?text=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    messenger: `fb-messenger://share?link=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${shareText}`,
  };
}
