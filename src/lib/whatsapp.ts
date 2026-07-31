import { siteConfig } from "@/lib/site-config";

export function buildWhatsAppLink(whatsappNumber: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}

export const defaultWhatsAppMessage = `Hello ${siteConfig.name}, I'd like to enquire about your products and services.`;
