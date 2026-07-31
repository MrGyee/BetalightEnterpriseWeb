import Link from "next/link";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary to-orange-600 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1100" cy="80" r="180" stroke="white" strokeWidth="1" />
          <circle cx="80" cy="340" r="140" stroke="white" strokeWidth="1" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">Ready to Power Your Next Project?</h2>
        <p className="mt-4 text-base text-orange-50 sm:text-lg">
          Speak with our electrical and solar specialists today for expert advice and competitive pricing.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/quote" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "rounded-full px-7 text-base")}>
            Get a Free Quote
          </Link>
          <a
            href={`tel:${siteConfig.phones.primary}`}
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "rounded-full border-white/40 bg-white/10 px-7 text-base text-white hover:bg-white/20 hover:text-white"
            )}
          >
            <Phone className="size-4" />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
