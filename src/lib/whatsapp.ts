import { siteConfig } from "@/lib/site-config";

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

export const defaultWhatsAppMessage = `Hello ${siteConfig.name}, I'd like to enquire about your products and services.`;
