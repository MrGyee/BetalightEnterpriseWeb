import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { productCategories } from "@/lib/nav";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/shared/social-icons";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Solar Solutions", href: "/solar-solutions" },
  { label: "Electrical Services", href: "/electrical-services" },
  { label: "Projects", href: "/projects" },
  { label: "Industries", href: "/industries" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Request a Quote", href: "/quote" },
];

export function Footer() {
  const hasSocial = siteConfig.social.facebook || siteConfig.social.instagram || siteConfig.social.twitter;

  return (
    <footer className="border-t border-border bg-secondary/40 pb-16 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/brand/betalight-logo.jpeg"
                alt={`${siteConfig.name} logo`}
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="font-heading text-lg font-bold text-foreground">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">{siteConfig.description}</p>
            {hasSocial && (
              <div className="mt-5 flex gap-3">
                {siteConfig.social.facebook && (
                  <a href={siteConfig.social.facebook} aria-label="Facebook" className="rounded-full border border-border p-2 hover:bg-muted">
                    <FacebookIcon className="size-4" />
                  </a>
                )}
                {siteConfig.social.instagram && (
                  <a href={siteConfig.social.instagram} aria-label="Instagram" className="rounded-full border border-border p-2 hover:bg-muted">
                    <InstagramIcon className="size-4" />
                  </a>
                )}
                {siteConfig.social.twitter && (
                  <a href={siteConfig.social.twitter} aria-label="Twitter / X" className="rounded-full border border-border p-2 hover:bg-muted">
                    <XIcon className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Product Categories</h3>
            <ul className="mt-4 space-y-2.5">
              {productCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Get In Touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  {siteConfig.address.line1}, {siteConfig.address.line2}, {siteConfig.address.city}, {siteConfig.address.country}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href={`tel:${siteConfig.phones.primary}`} className="hover:text-primary">
                  {siteConfig.phones.primary}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href={`tel:${siteConfig.phones.shop1}`} className="hover:text-primary">
                  {siteConfig.phones.shop1} / {siteConfig.phones.shop2}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary">
                  {siteConfig.email}
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <h4 className="text-sm font-semibold text-foreground">Get maintenance tips & offers</h4>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
