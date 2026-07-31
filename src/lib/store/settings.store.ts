import "server-only";
import { getSupabaseClient } from "@/lib/supabase/server-client";

export type SiteSettingsRecord = {
  phonePrimary: string;
  phoneShop1: string;
  phoneShop2: string;
  whatsappNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressCountry: string;
  hours: { days: string; time: string }[];
  serviceAreas: string[];
  brands: string[];
  socialFacebook: string;
  socialInstagram: string;
  socialTiktok: string;
  socialTwitter: string;
  socialLinkedin: string;
};

type SiteSettingsRow = {
  phone_primary: string;
  phone_shop1: string;
  phone_shop2: string;
  whatsapp_number: string;
  email: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  address_country: string;
  hours: { days: string; time: string }[] | null;
  service_areas: string[] | null;
  brands: string[] | null;
  social_facebook: string;
  social_instagram: string;
  social_tiktok: string;
  social_twitter: string;
  social_linkedin: string;
};

function mapRow(row: SiteSettingsRow): SiteSettingsRecord {
  return {
    phonePrimary: row.phone_primary,
    phoneShop1: row.phone_shop1,
    phoneShop2: row.phone_shop2,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    addressCity: row.address_city,
    addressCountry: row.address_country,
    hours: row.hours ?? [],
    serviceAreas: row.service_areas ?? [],
    brands: row.brands ?? [],
    socialFacebook: row.social_facebook,
    socialInstagram: row.social_instagram,
    socialTiktok: row.social_tiktok,
    socialTwitter: row.social_twitter,
    socialLinkedin: row.social_linkedin,
  };
}

function toRow(values: SiteSettingsRecord) {
  return {
    id: 1,
    phone_primary: values.phonePrimary,
    phone_shop1: values.phoneShop1,
    phone_shop2: values.phoneShop2,
    whatsapp_number: values.whatsappNumber,
    email: values.email,
    address_line1: values.addressLine1,
    address_line2: values.addressLine2,
    address_city: values.addressCity,
    address_country: values.addressCountry,
    hours: values.hours,
    service_areas: values.serviceAreas,
    brands: values.brands,
    social_facebook: values.socialFacebook,
    social_instagram: values.socialInstagram,
    social_tiktok: values.socialTiktok,
    social_twitter: values.socialTwitter,
    social_linkedin: values.socialLinkedin,
    updated_at: new Date().toISOString(),
  };
}

export const settingsStore = {
  async get(): Promise<SiteSettingsRecord | null> {
    const { data, error } = await getSupabaseClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(`[site_settings] select: ${error.message}`);
    return data ? mapRow(data as SiteSettingsRow) : null;
  },
  async update(values: SiteSettingsRecord): Promise<SiteSettingsRecord> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseClient().from("site_settings") as any)
      .upsert(toRow(values), { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(`[site_settings] update: ${error.message}`);
    return mapRow(data as SiteSettingsRow);
  },
};
