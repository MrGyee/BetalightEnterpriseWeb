import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Fuel, Factory, Hammer, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Electrical Installation & Services",
  description:
    "Residential, commercial and industrial electrical installation, generator changeover switching, maintenance and energy audits across Kenya.",
  alternates: { canonical: "/electrical-services" },
};

const services = [
  {
    id: "installation",
    icon: Wrench,
    title: "Electrical Installation",
    description:
      "Complete wiring for new builds and renovations, from first-fix cabling and distribution boards to final fittings, switches and sockets, carried out to Kenyan electrical safety standards.",
  },
  {
    id: "generator-installation",
    icon: Fuel,
    title: "Generator Installation",
    description:
      "Generator supply and installation with correctly rated manual or automatic changeover switching, so your standby power never back-feeds onto the grid.",
  },
  {
    id: "industrial",
    icon: Factory,
    title: "Industrial Electrical Services",
    description:
      "Control panels, motor protection circuit breakers and three-phase installations for factories, workshops and industrial sites.",
  },
  {
    id: "maintenance",
    icon: Hammer,
    title: "Electrical Maintenance",
    description:
      "Scheduled maintenance visits and emergency callout support to catch faults before they become costly breakdowns or safety hazards.",
  },
  {
    id: "energy-audits",
    icon: ClipboardCheck,
    title: "Energy Audits",
    description:
      "An on-site assessment of your property's wiring, distribution board and usage patterns to identify where power, and money, is being wasted.",
  },
];

export default function ElectricalServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Electrical Services", url: "/electrical-services" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Electrical Installation &amp; Services</h1>
        <p className="mt-4 text-muted-foreground">
          Certified electrical work for homes, businesses and industrial sites, from a single socket repair to a full
          building fit-out.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {services.map((service) => (
          <div key={service.id} id={service.id} className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <service.icon className="size-6" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground">{service.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-border bg-secondary/30 p-8 sm:p-10">
        <h2 className="font-heading text-2xl font-extrabold text-foreground">Emergency Electrical Support</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Tripped mains, exposed wiring, or total power loss can&apos;t wait. Call us directly or message us on WhatsApp
          and we&apos;ll advise on the fastest response available for your area.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CheckCircle2 className="size-5 text-green" />
          <span className="text-sm text-foreground/90">Fast response for urgent electrical faults</span>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-primary to-orange-600 p-10 text-center">
        <h2 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">Need Electrical Work Done Right?</h2>
        <p className="max-w-xl text-orange-50">Get a free, no-obligation quote from our electrical team.</p>
        <Link href="/quote" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "rounded-full")}>
          Request a Free Quote
        </Link>
      </div>
    </div>
  );
}
