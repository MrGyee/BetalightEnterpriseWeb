import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/shared/social-icons";
import { siteConfig } from "@/lib/site-config";

export function TopUtilityBar() {
  const hasSocial = siteConfig.social.linkedin || siteConfig.social.facebook || siteConfig.social.instagram;

  return (
    <div className="hidden h-10 items-center justify-between bg-[#1F2937] px-12 text-xs text-white/80 md:flex lg:px-16">
      <div className="flex items-center gap-3">
        <a href={`tel:${siteConfig.phones.primary}`} className="flex items-center gap-1.5 transition-colors hover:text-primary">
          <Phone className="size-3.5" />
          {siteConfig.phones.primary}
        </a>
        <span className="text-white/20">|</span>
        <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 transition-colors hover:text-primary">
          <Mail className="size-3.5" />
          {siteConfig.email}
        </a>
        <span className="text-white/20">|</span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {siteConfig.address.city}, {siteConfig.address.country}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden items-center gap-1.5 lg:flex">
          <span className="text-primary">&#10003;</span>
          Serving Residential, Commercial &amp; Industrial Clients Across Kenya
        </span>
        {hasSocial && (
          <div className="flex items-center gap-3">
            {siteConfig.social.linkedin && (
              <a href={siteConfig.social.linkedin} aria-label="LinkedIn" className="transition-all hover:scale-110 hover:text-primary">
                <LinkedInIcon className="size-3.5" />
              </a>
            )}
            {siteConfig.social.facebook && (
              <a href={siteConfig.social.facebook} aria-label="Facebook" className="transition-all hover:scale-110 hover:text-primary">
                <FacebookIcon className="size-3.5" />
              </a>
            )}
            {siteConfig.social.instagram && (
              <a href={siteConfig.social.instagram} aria-label="Instagram" className="transition-all hover:scale-110 hover:text-primary">
                <InstagramIcon className="size-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
