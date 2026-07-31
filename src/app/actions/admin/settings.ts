"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { siteSettingsAdminSchema, type SiteSettingsAdminValues } from "@/lib/validation/admin";
import { getSiteSettings, updateSiteSettings } from "@/lib/data/settings";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function parseHoursText(text: string): { days: string; time: string }[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [days, time] = line.split("|").map((part) => part.trim());
      return { days: days ?? line, time: time ?? "" };
    });
}

function formatHoursText(hours: { days: string; time: string }[]): string {
  return hours.map((h) => `${h.days} | ${h.time}`).join("\n");
}

function parseServiceAreasText(text: string): string[] {
  return text
    .split(",")
    .map((area) => area.trim())
    .filter(Boolean);
}

export async function getSiteSettingsFormValues() {
  const settings = await getSiteSettings();
  return {
    phonePrimary: settings.phonePrimary,
    phoneShop1: settings.phoneShop1,
    phoneShop2: settings.phoneShop2,
    whatsappNumber: settings.whatsappNumber,
    email: settings.email,
    addressLine1: settings.addressLine1,
    addressLine2: settings.addressLine2,
    addressCity: settings.addressCity,
    addressCountry: settings.addressCountry,
    hoursText: formatHoursText(settings.hours),
    serviceAreasText: settings.serviceAreas.join(", "),
    socialFacebook: settings.socialFacebook,
    socialInstagram: settings.socialInstagram,
    socialTiktok: settings.socialTiktok,
    socialTwitter: settings.socialTwitter,
    socialLinkedin: settings.socialLinkedin,
  };
}

export async function updateSiteSettingsAction(values: SiteSettingsAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = siteSettingsAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await updateSiteSettings({
    phonePrimary: parsed.data.phonePrimary,
    phoneShop1: parsed.data.phoneShop1 || "",
    phoneShop2: parsed.data.phoneShop2 || "",
    whatsappNumber: parsed.data.whatsappNumber,
    email: parsed.data.email,
    addressLine1: parsed.data.addressLine1,
    addressLine2: parsed.data.addressLine2 || "",
    addressCity: parsed.data.addressCity,
    addressCountry: parsed.data.addressCountry,
    hours: parseHoursText(parsed.data.hoursText || ""),
    serviceAreas: parseServiceAreasText(parsed.data.serviceAreasText),
    socialFacebook: parsed.data.socialFacebook || "",
    socialInstagram: parsed.data.socialInstagram || "",
    socialTiktok: parsed.data.socialTiktok || "",
    socialTwitter: parsed.data.socialTwitter || "",
    socialLinkedin: parsed.data.socialLinkedin || "",
  });
  revalidatePath("/", "layout");
  return { success: true };
}
