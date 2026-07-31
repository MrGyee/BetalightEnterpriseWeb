import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for using the ${siteConfig.name} website and requesting quotes or products.`,
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Terms of Service", url: "/terms" }]} />
      <h1 className="mt-6 font-heading text-3xl font-extrabold text-foreground">Terms of Service</h1>
      <div className="mt-6 space-y-5 text-sm text-muted-foreground">
        <p>
          These terms govern your use of the {siteConfig.name} website. By using this site, you agree to the
          following.
        </p>
        <p>
          <strong className="text-foreground">Product & pricing information:</strong> Product descriptions and
          specifications on this site are provided for general guidance. Final pricing and availability are
          confirmed at the time of quotation, since supplier prices and stock can change.
        </p>
        <p>
          <strong className="text-foreground">Quotations:</strong> A quote request submitted through this site is
          not a confirmed order. Orders are confirmed once both parties agree on pricing, scope and timelines.
        </p>
        <p>
          <strong className="text-foreground">Installation work:</strong> All installation work is carried out
          according to standard Kenyan electrical safety practice. Warranty terms vary by product and are specified
          at the point of sale.
        </p>
        <p>
          <strong className="text-foreground">Website content:</strong> Content on this site, including text and
          images, belongs to {siteConfig.name} unless otherwise noted, and may not be reproduced without permission.
        </p>
        <p>
          <strong className="text-foreground">Contact:</strong> Questions about these terms can be sent to{" "}
          {settings.email}.
        </p>
      </div>
    </div>
  );
}
