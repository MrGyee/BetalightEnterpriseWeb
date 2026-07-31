import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon } from "@/components/shared/social-icons";
import type { SiteSettingsRecord } from "@/lib/store/settings.store";

export function TopUtilityBar({ settings }: { settings: SiteSettingsRecord }) {
  const hasSocial = settings.socialLinkedin || settings.socialFacebook || settings.socialInstagram || settings.socialTiktok;

  return (
    <div className="hidden h-10 items-center justify-between bg-[#1F2937] px-12 text-xs text-white/80 md:flex lg:px-16">
      <div className="flex items-center gap-3">
        <a href={`tel:${settings.phonePrimary}`} className="flex items-center gap-1.5 transition-colors hover:text-primary">
          <Phone className="size-3.5" />
          {settings.phonePrimary}
        </a>
        <span className="text-white/20">|</span>
        <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 transition-colors hover:text-primary">
          <Mail className="size-3.5" />
          {settings.email}
        </a>
        <span className="text-white/20">|</span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {settings.addressCity}, {settings.addressCountry}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden items-center gap-1.5 lg:flex">
          <span className="text-primary">&#10003;</span>
          Serving Residential, Commercial &amp; Industrial Clients Across Kenya
        </span>
        {hasSocial && (
          <div className="flex items-center gap-3">
            {settings.socialLinkedin && (
              <a href={settings.socialLinkedin} aria-label="LinkedIn" className="transition-all hover:scale-110 hover:text-primary">
                <LinkedInIcon className="size-3.5" />
              </a>
            )}
            {settings.socialFacebook && (
              <a href={settings.socialFacebook} aria-label="Facebook" className="transition-all hover:scale-110 hover:text-primary">
                <FacebookIcon className="size-3.5" />
              </a>
            )}
            {settings.socialInstagram && (
              <a href={settings.socialInstagram} aria-label="Instagram" className="transition-all hover:scale-110 hover:text-primary">
                <InstagramIcon className="size-3.5" />
              </a>
            )}
            {settings.socialTiktok && (
              <a href={settings.socialTiktok} aria-label="TikTok" className="transition-all hover:scale-110 hover:text-primary">
                <TikTokIcon className="size-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
