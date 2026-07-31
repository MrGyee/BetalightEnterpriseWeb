import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { siteConfig } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Betalight Enterprises Ltd team. We're always interested in hearing from skilled electricians, technicians and sales staff.",
  alternates: { canonical: "/careers" },
};

const roles = [
  "Licensed electricians and electrical technicians",
  "Solar installation technicians",
  "Sales and customer service staff",
  "Warehouse and logistics support",
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Careers", url: "/careers" }]} />

      <div className="mt-6">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Careers at Betalight</h1>
        <p className="mt-4 text-muted-foreground">
          We&apos;re always interested in hearing from skilled, reliable people who want to build a career in
          electrical and solar work. We don&apos;t currently have specific vacancies listed, but we keep every
          application on file for when a role opens up.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-bold text-foreground">Roles we typically hire for</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {roles.map((role) => (
            <li key={role} className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              {role}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-secondary/30 p-6">
        <h2 className="font-heading text-lg font-bold text-foreground">How to Apply</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Send us your CV with a short note about your experience, and we&apos;ll reach out if a suitable role comes up.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a href={`mailto:${siteConfig.email}?subject=Job Application`} className={cn(buttonVariants(), "rounded-full")}>
            <Mail className="size-4" />
            Email Your CV
          </a>
          <a
            href={buildWhatsAppLink("Hello, I'd like to enquire about job opportunities at Betalight Enterprises Ltd.")}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
          >
            <MessageCircle className="size-4" />
            Message Us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
