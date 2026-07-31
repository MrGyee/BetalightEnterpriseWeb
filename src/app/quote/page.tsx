import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { QuoteForm } from "@/components/quote/quote-form";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Request a free, no-obligation quote for electrical products, solar systems or installation services from Betalight Enterprises Ltd.",
  alternates: { canonical: "/quote" },
};

const perks = [
  "Free, no-obligation quotation",
  "Genuine products with manufacturer warranty",
  "Response within one business day",
];

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Request a Quote", url: "/quote" }]} />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Request a Free Quote</h1>
          <p className="mt-4 text-muted-foreground">
            Tell us what you need and our team will get back to you with a tailored, competitive quotation.
          </p>
          <ul className="mt-6 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <Suspense>
            <QuoteForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
