import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}, covering how we collect and use information submitted through this website.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Privacy Policy", url: "/privacy-policy" }]} />
      <h1 className="mt-6 font-heading text-3xl font-extrabold text-foreground">Privacy Policy</h1>
      <div className="mt-6 space-y-5 text-sm text-muted-foreground">
        <p>
          {siteConfig.name} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This page explains what information
          we collect through this website and how we use it.
        </p>
        <p>
          <strong className="text-foreground">Information we collect:</strong> When you submit our contact form,
          quote request form, or newsletter signup, we collect the details you provide, such as your name, phone
          number, email address and message content.
        </p>
        <p>
          <strong className="text-foreground">How we use it:</strong> We use this information only to respond to
          your enquiry, prepare quotations, and, if you subscribe, send occasional maintenance tips and offers. We do
          not sell or share your information with third parties for marketing purposes.
        </p>
        <p>
          <strong className="text-foreground">Cookies:</strong> With your consent, we use cookies to support basic
          site analytics. You can decline non-essential cookies from the banner shown on your first visit.
        </p>
        <p>
          <strong className="text-foreground">Contact us:</strong> If you have questions about this policy or want
          your information removed from our records, email us at {siteConfig.email}.
        </p>
      </div>
    </div>
  );
}
