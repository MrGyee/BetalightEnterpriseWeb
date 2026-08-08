import { BadgeCheck, Gem, Wallet, Timer, MapPinned, HeadphonesIcon, Leaf, ShieldCheck } from "lucide-react";

const reasons = [
  { icon: BadgeCheck, title: "Certified Professionals", description: "Trained electricians and technicians on every job." },
  { icon: Gem, title: "Premium Quality Products", description: "Genuine stock from trusted, reputable brands." },
  { icon: Wallet, title: "Affordable Pricing", description: "Competitive rates without cutting corners on safety." },
  { icon: Timer, title: "Fast Installation", description: "Efficient site work that respects your schedule." },
  { icon: MapPinned, title: "Nationwide Service", description: "Serving Nairobi and counties across Kenya." },
  { icon: HeadphonesIcon, title: "Excellent After-Sales Support", description: "We're a call or WhatsApp message away, after the sale too." },
  { icon: Leaf, title: "Energy Efficient Solutions", description: "Solar and LED options that cut long-term running costs." },
  { icon: ShieldCheck, title: "Reliable Warranty", description: "Manufacturer-backed warranty on every product we sell." },
];

function ReasonCard({ reason }: { reason: (typeof reasons)[number] }) {
  return (
    <div className="mr-5 flex w-[280px] shrink-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <reason.icon className="size-5" />
      </div>
      <h3 className="mt-4 font-heading text-base font-bold text-foreground">{reason.title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{reason.description}</p>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Why Choose Betalight</h2>
        </div>
      </div>

      <div className="group relative mt-10 overflow-hidden sm:mt-12">
        {/* Each card carries its own trailing margin rather than the track using
            `gap`, so one copy is exactly 50% of the track and the -50% loop is
            seamless. 48s keeps this at the same px/s as the Solutions row. */}
        <div
          className="marquee-track flex w-max items-stretch"
          style={{ "--marquee-duration": "48s" } as React.CSSProperties}
        >
          {reasons.map((reason) => (
            <ReasonCard key={reason.title} reason={reason} />
          ))}
          <div className="flex items-stretch" aria-hidden>
            {reasons.map((reason) => (
              <ReasonCard key={reason.title} reason={reason} />
            ))}
          </div>
        </div>

        {/* Two stacked layers so the fade matches this section's tinted
            background (opaque base + the same 30% secondary wash). */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-20">
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-transparent" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-20">
          <div className="absolute inset-0 bg-gradient-to-l from-background to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-secondary/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
