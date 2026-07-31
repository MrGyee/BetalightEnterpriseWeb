"use client";

import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useSiteSettings } from "@/components/shared/site-settings-provider";
import { cn } from "@/lib/utils";

export function FormSuccess({ whatsappMessage, heading }: { whatsappMessage: string; heading?: string }) {
  const settings = useSiteSettings();
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-green/30 bg-green/5 p-8 text-center">
      <CheckCircle2 className="size-10 text-green" />
      <h3 className="font-heading text-lg font-bold text-foreground">{heading ?? "Message sent successfully"}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Thank you for reaching out. Our team will get back to you shortly. For a faster response, chat with us directly on
        WhatsApp.
      </p>
      <a
        href={buildWhatsAppLink(settings.whatsappNumber, whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline" }), "mt-1")}
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}
