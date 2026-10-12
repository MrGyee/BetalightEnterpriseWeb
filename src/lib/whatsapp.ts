import { siteConfig } from "@/lib/site-config";

// wa.me requires digits only after the slash — any stray text (a label typed
// into the same admin field, a leading "+", spaces) produces a dead link, not
// an error, so this strips anything non-numeric defensively rather than
// trusting the stored value is already clean.
export function buildWhatsAppLink(whatsappNumber: string, message: string): string {
  const digitsOnly = whatsappNumber.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digitsOnly}?text=${encoded}`;
}

export const defaultWhatsAppMessage = `Hello ${siteConfig.name}, I'd like to enquire about your products and services.`;
