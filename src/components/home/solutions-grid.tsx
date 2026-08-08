import Link from "next/link";
import {
  Cable,
  Sun,
  SlidersHorizontal,
  Wrench,
  Lightbulb,
  BatteryCharging,
  Fuel,
  Factory,
  Hammer,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

const solutions = [
  {
    icon: Cable,
    title: "Electrical Products",
    description: "Genuine circuit breakers, cables, switches, sockets and distribution boards from trusted brands.",
    href: "/products",
  },
  {
    icon: Sun,
    title: "Solar Energy Systems",
    description: "Solar panels, inverters, batteries, water heaters and pumps sized to your property.",
    href: "/solar-solutions",
  },
  {
    icon: SlidersHorizontal,
    title: "Power Control Equipment",
    description: "Voltage switchers, timer switches, changeover switches and motor protection breakers.",
    href: "/products?category=power-control-equipment",
  },
  {
    icon: Wrench,
    title: "Electrical Installation",
    description: "Full residential, commercial and industrial wiring carried out to Kenyan safety standards.",
    href: "/electrical-services",
  },
  {
    icon: Lightbulb,
    title: "Lighting Solutions",
    description: "LED fittings, solar street lights, floodlights and decorative chandeliers for every space.",
    href: "/products?category=lighting-solutions",
  },
  {
    icon: BatteryCharging,
    title: "Power Backup Systems",
    description: "Portable power stations and deep cycle batteries that keep the lights on during outages.",
    href: "/products?category=power-backup-systems",
  },
  {
    icon: Fuel,
    title: "Generator Installation",
    description: "Generator supply and installation with safe manual or automatic changeover switching.",
    href: "/electrical-services#generator-installation",
  },
  {
    icon: Factory,
    title: "Industrial Electrical Services",
    description: "Control panels, motor protection and three-phase installations for industrial sites.",
    href: "/electrical-services#industrial",
  },
  {
    icon: Hammer,
    title: "Electrical Maintenance",
    description: "Scheduled maintenance and emergency callout support to keep your systems running safely.",
    href: "/electrical-services#maintenance",
  },
  {
    icon: ClipboardCheck,
    title: "Energy Audits",
    description: "On-site assessments that identify where your property is losing power, and money.",
    href: "/electrical-services#energy-audits",
  },
];

function SolutionCard({ item }: { item: (typeof solutions)[number] }) {
  return (
    <Link
      href={item.href}
      className="group mr-5 flex w-[280px] shrink-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <item.icon className="size-6" />
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:gap-2">
        Learn More <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}

export function SolutionsGrid() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Our Solutions</h2>
          <p className="mt-3 text-muted-foreground">
            End-to-end electrical and solar solutions, from the products on the shelf to the crew on site.
          </p>
        </div>
      </div>

      <div className="group relative mt-10 overflow-hidden sm:mt-12">
        {/* Each card carries its own trailing margin rather than the track using
            `gap`, so one copy's width is exactly 50% of the track and the
            -50% loop is seamless. */}
        <div className="flex w-max animate-[marquee_60s_linear_infinite] items-stretch group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {solutions.map((item) => (
            <SolutionCard key={item.title} item={item} />
          ))}
          <div className="flex items-stretch" aria-hidden>
            {solutions.map((item) => (
              <SolutionCard key={item.title} item={item} />
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-20" />
      </div>
    </section>
  );
}
