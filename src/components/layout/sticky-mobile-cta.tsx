"use client";

import Link from "next/link";
import { Phone, MessageCircle, FileText } from "lucide-react";
import { buildWhatsAppLink, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { useSiteSettings } from "@/components/shared/site-settings-provider";

export function StickyMobileCta() {
  const settings = useSiteSettings();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-background/95 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] backdrop-blur-sm md:hidden">
      <a
        href={`tel:${settings.phonePrimary}`}
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-medium text-foreground active:bg-muted"
      >
        <Phone className="size-4" />
        Call Now
      </a>
      <a
        href={buildWhatsAppLink(settings.whatsappNumber, defaultWhatsAppMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-0.5 border-x border-border bg-[#25D366] py-2.5 text-xs font-medium text-white"
      >
        <MessageCircle className="size-4" fill="currentColor" strokeWidth={0} />
        WhatsApp
      </a>
      <Link
        href="/quote"
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-medium text-primary active:bg-muted"
      >
        <FileText className="size-4" />
        Get Quote
      </Link>
    </div>
  );
}
