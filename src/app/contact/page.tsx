import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Betalight Enterprises Ltd for electrical products, solar solutions and installation services in Nairobi and across Kenya.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const fullAddress = `${settings.addressLine1}, ${settings.addressLine2}, ${settings.addressCity}, ${settings.addressCountry}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Contact Us", url: "/contact" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Contact Us</h1>
        <p className="mt-4 text-muted-foreground">
          Have a question about a product, a service, or an ongoing project? Reach out, we&apos;re happy to help.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-heading text-xl font-bold text-foreground">Send Us a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <Phone className="size-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">Call Us</p>
              <a href={`tel:${settings.phonePrimary}`} className="text-sm text-muted-foreground hover:text-primary">
                {settings.phonePrimary}
              </a>
              <br />
              <a href={`tel:${settings.phoneShop1}`} className="text-sm text-muted-foreground hover:text-primary">
                {settings.phoneShop1}
              </a>
              <br />
              <a href={`tel:${settings.phoneShop2}`} className="text-sm text-muted-foreground hover:text-primary">
                {settings.phoneShop2}
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <Mail className="size-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">Email Us</p>
              <a href={`mailto:${settings.email}`} className="text-sm text-muted-foreground hover:text-primary">
                {settings.email}
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <MapPin className="size-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">Visit Our Store</p>
              <p className="text-sm text-muted-foreground">
                {settings.addressLine1}, {settings.addressLine2}, {settings.addressCity}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <Clock className="size-5 text-primary" />
              <p className="mt-2 text-sm font-semibold text-foreground">Business Hours</p>
              {settings.hours.map((h) => (
                <p key={h.days} className="text-sm text-muted-foreground">
                  {h.days}: {h.time}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-secondary/30 p-5">
            <p className="text-sm font-semibold text-foreground">Areas We Serve</p>
            <p className="mt-2 text-sm text-muted-foreground">{settings.serviceAreas.join(", ")}, and nationwide delivery.</p>
          </div>
        </div>

        <div className="h-[420px] overflow-hidden rounded-2xl border border-border lg:h-auto lg:min-h-full">
          <iframe
            src={mapSrc}
            title="Betalight Enterprises Ltd location"
            className="h-full w-full min-h-[420px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
