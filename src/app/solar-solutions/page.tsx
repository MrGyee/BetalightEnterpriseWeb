import type { Metadata } from "next";
import Link from "next/link";
import { Sun, Battery, Droplets, Home as HomeIcon, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Solar Energy Solutions",
  description:
    "Solar panels, hybrid inverters, batteries, solar water heaters and solar borehole pumps supplied and installed across Kenya.",
  alternates: { canonical: "/solar-solutions" },
};

const offerings = [
  {
    icon: Sun,
    title: "Solar Panels & Hybrid Inverters",
    description:
      "Grid-tied and hybrid solar power systems sized to your household or business load, with genuine panels and inverters from trusted brands.",
  },
  {
    icon: Battery,
    title: "Solar Batteries & Backup Power",
    description:
      "LiFePO4 and gel battery storage that keeps your essential circuits running through outages, plus portable power stations for smaller needs.",
  },
  {
    icon: Droplets,
    title: "Solar Water Heaters",
    description: "Vacuum-tube solar water heaters that cut one of the biggest line items on a Kenyan power bill.",
  },
  {
    icon: HomeIcon,
    title: "Solar Borehole Pumps",
    description: "DC solar submersible pumps for boreholes, wells and irrigation, ideal for farms and off-grid sites.",
  },
];

const process = [
  "Site assessment and load or water demand calculation",
  "System design and product recommendation with transparent pricing",
  "Professional installation with proper earthing and safety checks",
  "Handover, training on your new system, and after-sales support",
];

export default function SolarSolutionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Solar Solutions", url: "/solar-solutions" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Solar Energy Solutions</h1>
        <p className="mt-4 text-muted-foreground">
          From a single solar water heater to a full hybrid power system, we design and install solar solutions sized
          to your property and budget, using genuine equipment backed by manufacturer warranty.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {offerings.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex size-12 items-center justify-center rounded-xl bg-green/10 text-green">
              <item.icon className="size-6" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-border bg-secondary/30 p-8 sm:p-10">
        <h2 className="font-heading text-2xl font-extrabold text-foreground">How a Solar Installation Works With Us</h2>
        <ul className="mt-6 space-y-3">
          {process.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green" />
              <span className="text-sm text-foreground/90">
                <strong className="mr-1">Step {i + 1}.</strong>
                {step}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-primary to-orange-600 p-10 text-center">
        <h2 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">Ready to Go Solar?</h2>
        <p className="max-w-xl text-orange-50">Tell us about your property and we&apos;ll recommend the right system and a competitive quote.</p>
        <Link href="/quote" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "rounded-full")}>
          Request a Free Quote
        </Link>
      </div>
    </div>
  );
}
