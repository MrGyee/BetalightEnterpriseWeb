import "server-only";
import { getSupabaseClient } from "@/lib/supabase/server-client";
import { selectAll, selectById, insertOne, updateByKey, deleteByKey } from "@/lib/supabase/db-helpers";

export interface HeroStat {
  label: string;
  value: number;
  suffix: string;
}

export interface HeroContentRecord {
  badgeText: string;
  headline: string;
  subheadline: string;
  trustPoints: string[];
  stats: HeroStat[];
}

interface HeroContentRow {
  badge_text: string;
  headline: string;
  subheadline: string;
  trust_points: string[] | null;
  stats: HeroStat[] | null;
}

function mapHeroContent(row: HeroContentRow): HeroContentRecord {
  return {
    badgeText: row.badge_text,
    headline: row.headline,
    subheadline: row.subheadline,
    trustPoints: row.trust_points ?? [],
    stats: row.stats ?? [],
  };
}

function heroContentToRow(values: HeroContentRecord) {
  return {
    id: 1,
    badge_text: values.badgeText,
    headline: values.headline,
    subheadline: values.subheadline,
    trust_points: values.trustPoints,
    stats: values.stats,
    updated_at: new Date().toISOString(),
  };
}

export interface HeroSlideRecord {
  id: string;
  imagePath: string;
  alt: string;
  title: string;
  location: string;
  category: string;
  sortOrder: number;
}

interface HeroSlideRow {
  id: string;
  image_path: string;
  alt: string;
  title: string;
  location: string;
  category: string;
  sort_order: number;
}

const mapHeroSlide = (row: HeroSlideRow): HeroSlideRecord => ({
  id: row.id,
  imagePath: row.image_path,
  alt: row.alt,
  title: row.title,
  location: row.location,
  category: row.category,
  sortOrder: row.sort_order,
});

function heroSlideToRow(values: Omit<HeroSlideRecord, "id">) {
  return {
    image_path: values.imagePath,
    alt: values.alt,
    title: values.title,
    location: values.location,
    category: values.category,
    sort_order: values.sortOrder,
  };
}

export const heroStore = {
  async getContent(): Promise<HeroContentRecord | null> {
    const { data, error } = await getSupabaseClient().from("hero_content").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(`[hero_content] select: ${error.message}`);
    return data ? mapHeroContent(data as HeroContentRow) : null;
  },
  async updateContent(values: HeroContentRecord): Promise<HeroContentRecord> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseClient().from("hero_content") as any)
      .upsert(heroContentToRow(values), { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(`[hero_content] update: ${error.message}`);
    return mapHeroContent(data as HeroContentRow);
  },

  listSlides: () => selectAll<HeroSlideRow, HeroSlideRecord>("hero_slides", mapHeroSlide, "sort_order", true),
  getSlideById: (id: string) => selectById<HeroSlideRow, HeroSlideRecord>("hero_slides", id, mapHeroSlide),
  createSlide: (values: Omit<HeroSlideRecord, "id">) =>
    insertOne<HeroSlideRow, HeroSlideRecord>("hero_slides", heroSlideToRow(values), mapHeroSlide),
  updateSlide: (id: string, values: Omit<HeroSlideRecord, "id">) =>
    updateByKey<HeroSlideRow, HeroSlideRecord>("hero_slides", "id", id, heroSlideToRow(values), mapHeroSlide),
  deleteSlide: (id: string) => deleteByKey("hero_slides", "id", id),
};
