import type { Metadata } from "next";
import {
  Home,
  Building2,
  Factory,
  School,
  HeartPulse,
  Hotel,
  Landmark,
  Building,
  Sprout,
  Cog,
} from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: "Electrical and solar solutions tailored for residential, commercial, industrial and institutional clients across Kenya.",
  alternates: { canonical: "/industries" },
};

const industries = [
  { icon: Home, name: "Residential", description: "Home wiring, solar water heaters and backup power for homeowners." },
  { icon: Building2, name: "Commercial", description: "Office and retail electrical fit-outs, lighting and power backup." },
  { icon: Factory, name: "Industrial", description: "Control panels, motor protection and three-phase power for plants." },
  { icon: School, name: "Schools", description: "Safe, budget-conscious electrical upgrades and lighting for campuses." },
  { icon: HeartPulse, name: "Hospitals", description: "Reliable backup power and clean electrical installations for critical facilities." },
  { icon: Hotel, name: "Hotels", description: "Decorative lighting, solar water heating and standby power for guest comfort." },
  { icon: Landmark, name: "Government", description: "Compliant electrical installations for public sector buildings and facilities." },
  { icon: Building, name: "Real Estate Developers", description: "Full electrical and solar packages for new residential and commercial developments." },
  { icon: Sprout, name: "Agriculture", description: "Solar borehole pumps and irrigation power for farms." },
  { icon: Cog, name: "Manufacturing", description: "Industrial-grade power control and protection equipment for production lines." },
];

export default function IndustriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Industries", url: "/industries" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Industries We Serve</h1>
        <p className="mt-4 text-muted-foreground">
          From single-family homes to industrial plants, we tailor every installation to the site and its power needs.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry) => (
          <div key={industry.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex size-12 items-center justify-center rounded-full bg-green/10 text-green">
              <industry.icon className="size-6" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{industry.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{industry.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
