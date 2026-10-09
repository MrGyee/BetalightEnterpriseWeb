import Link from "next/link";
import { Calculator, Zap, Wallet, MessageCircle, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const highlights = [
  { icon: Zap, label: "Instant sizing" },
  { icon: Wallet, label: "Estimated cost in KSh" },
  { icon: MessageCircle, label: "Send it to us on WhatsApp" },
];

// Static, not another marquee — the homepage already has three moving rows
// further down, and a confident static block reads as the deliberate "do
// this next" action rather than one more thing sliding past.
export function SolarEstimateBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1F2937] via-[#20293a] to-[#14532d] py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <svg className="h-full w-full" viewBox="0 0 1200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1120" cy="40" r="160" stroke="white" strokeWidth="1" />
          <circle cx="60" cy="260" r="120" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Calculator className="size-7" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wide text-primary">Free Tool</span>
            <h2 className="mt-1 font-heading text-2xl font-extrabold text-white sm:text-3xl">
              How Much Does Solar Cost for Your Home?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
              Tick the appliances you want to power and get a panel, battery and inverter sizing with an estimated
              cost — no sign-up, no waiting.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {highlights.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-xs font-medium text-slate-300 sm:text-sm">
                  <item.icon className="size-4 text-primary" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="/solar-cost-estimate"
          className={cn(buttonVariants({ size: "lg" }), "w-full shrink-0 gap-1.5 rounded-full px-7 text-base sm:w-auto")}
        >
          Get My Free Estimate <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
