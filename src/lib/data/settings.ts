import "server-only";
import { cache } from "react";
import { settingsStore, type SiteSettingsRecord } from "@/lib/store/settings.store";
import { siteConfig } from "@/lib/site-config";

const FALLBACK_SETTINGS: SiteSettingsRecord = {
  phonePrimary: siteConfig.phones.primary,
  phoneShop1: siteConfig.phones.shop1,
  phoneShop2: siteConfig.phones.shop2,
  whatsappNumber: siteConfig.whatsappNumber,
  email: siteConfig.email,
  addressLine1: siteConfig.address.line1,
  addressLine2: siteConfig.address.line2,
  addressCity: siteConfig.address.city,
  addressCountry: siteConfig.address.country,
  hours: [...siteConfig.hours],
  serviceAreas: [...siteConfig.serviceAreas],
  brands: ["Tronic", "Vestwoods", "SRNE", "Seven Stars", "ALLTOP Electronics", "ATTA", "Lutan Pump", "EAE", "Eastman", "MODI"],
  socialFacebook: siteConfig.social.facebook,
  socialInstagram: siteConfig.social.instagram,
  socialTiktok: siteConfig.social.tiktok,
  socialTwitter: siteConfig.social.twitter,
  socialLinkedin: siteConfig.social.linkedin,
};

// Falls back to the static defaults above if the `site_settings` table is
// missing (migration not yet applied) or the row hasn't been created yet,
// so the site keeps working before/without an admin edit.
export const getSiteSettings = cache(async (): Promise<SiteSettingsRecord> => {
  try {
    const row = await settingsStore.get();
    return row ?? FALLBACK_SETTINGS;
  } catch {
    return FALLBACK_SETTINGS;
  }
});

export async function updateSiteSettings(values: SiteSettingsRecord): Promise<SiteSettingsRecord> {
  return settingsStore.update(values);
}

export type { SiteSettingsRecord };
