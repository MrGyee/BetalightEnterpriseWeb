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

const industries = [
  { icon: Home, name: "Residential" },
  { icon: Building2, name: "Commercial" },
  { icon: Factory, name: "Industrial" },
  { icon: School, name: "Schools" },
  { icon: HeartPulse, name: "Hospitals" },
  { icon: Hotel, name: "Hotels" },
  { icon: Landmark, name: "Government" },
  { icon: Building, name: "Real Estate Developers" },
  { icon: Sprout, name: "Agriculture" },
  { icon: Cog, name: "Manufacturing" },
];

export function Industries() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Industries We Serve</h2>
          <p className="mt-3 text-muted-foreground">
            From single-family homes to industrial plants, we tailor every installation to the site.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-green/10 text-green">
                <industry.icon className="size-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">{industry.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
