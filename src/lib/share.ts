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

// The calculator's total is a rough estimate off placeholder/admin-set unit
// rates, not a quote — the message asks for confirmation rather than
// asserting the number as final, same posture as buildWhatsAppQuoteMessage.
export function buildSolarEstimateWhatsAppMessage(params: {
  dailyEnergyWh: number;
  panelArrayWp: number;
  batteryKwh: number;
  batteryChemistry: "lithium" | "gel";
  inverterKva: number;
  autonomyDays: number;
  estimatedTotal: string;
}): string {
  const batteryLabel = params.batteryChemistry === "lithium" ? "Lithium (LiFePO4)" : "Gel";
  return [
    `Hello ${siteConfig.name},`,
    "",
    "I used your solar cost estimate tool and got this result:",
    "",
    `• Daily energy need: ${Math.round(params.dailyEnergyWh)} Wh`,
    `• Solar panel array: ${Math.round(params.panelArrayWp)} Wp`,
    `• Battery bank: ${params.batteryKwh.toFixed(2)} kWh (${batteryLabel}), ${params.autonomyDays} day(s) autonomy`,
    `• Hybrid inverter: ${params.inverterKva} kVA`,
    `• Estimated materials cost: ${params.estimatedTotal}`,
    "",
    "Could you confirm this sizing and give me an accurate quote, including installation?",
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
