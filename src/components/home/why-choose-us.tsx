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

export function WhyChooseUs() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Why Choose Betalight</h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-11">
                <reason.icon className="size-5" />
              </div>
              <h3 className="mt-3 font-heading text-sm font-bold leading-snug text-foreground sm:mt-4 sm:text-base">
                {reason.title}
              </h3>
              <p className="mt-1.5 hidden text-sm text-muted-foreground sm:block">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
