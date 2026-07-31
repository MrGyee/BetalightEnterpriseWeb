import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Betalight Enterprises Ltd is a Kenyan electrical products, solar energy and power control company based in Nairobi, serving customers nationwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "About Us", url: "/about" }]} />

        <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
              Kenya&apos;s Partner for Electrical, Solar &amp; Power Control Solutions
            </h1>
            <p className="mt-5 text-muted-foreground">
              Betalight Enterprises Ltd is a Nairobi-based supplier and installer of electrical products, solar energy
              systems and power control equipment. From our store in Nyamakima to job sites across Kenya, we stock
              genuine products from trusted brands and back them up with professional installation and after-sales
              support.
            </p>
            <p className="mt-4 text-muted-foreground">
              Whether you need a single circuit breaker, a full solar power system, or an electrician on site, our
              team combines hands-on product knowledge with real installation experience, so the advice you get
              matches what actually works in Kenyan homes, businesses and industrial sites.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>
                Request a Free Quote
              </Link>
              <Link href="/products" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full")}>
                Browse Products
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            <Image
              src="/images/projects/electrical-showroom-cables.jpeg"
              alt="Inside the Betalight Enterprises electrical products store"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-lg font-bold text-foreground">Our Mission</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              To make reliable, safe electrical power and clean solar energy accessible to every Kenyan home and
              business, backed by genuine products and honest advice.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-lg font-bold text-foreground">Our Approach</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We size every system to the property, not the other way around, and we stand behind the products we
              sell with manufacturer-backed warranty support.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-lg font-bold text-foreground">Where We Work</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Based in Nyamakima, Nairobi, with installation work carried out across Nairobi, Kiambu, Nakuru, Mombasa,
              Kisumu, Eldoret, Thika and Machakos.
            </p>
          </div>
        </div>
      </div>

      <WhyChooseUs />
    </div>
  );
}
