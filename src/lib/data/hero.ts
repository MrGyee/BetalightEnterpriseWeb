import "server-only";
import { cache } from "react";
import { heroStore, type HeroContentRecord, type HeroSlideRecord } from "@/lib/store/hero.store";

const FALLBACK_HERO_CONTENT: HeroContentRecord = {
  badgeText: "Trusted Electrical & Solar Partner",
  headline: "Powering Kenya with Reliable Electrical & Solar Solutions",
  subheadline:
    "Betalight Enterprises Ltd delivers premium electrical products, solar energy systems, power control equipment and professional installation services designed for reliability, safety, and long-term performance.",
  trustPoints: ["Licensed & Certified", "Genuine Products", "Fast Response Times", "Nationwide Delivery"],
  stats: [
    { label: "Projects Completed", value: 150, suffix: "+" },
    { label: "Years of Experience", value: 5, suffix: "+" },
    { label: "Electrical Products", value: 500, suffix: "+" },
    { label: "Counties Served", value: 8, suffix: "" },
  ],
};

const FALLBACK_HERO_SLIDES: HeroSlideRecord[] = [
  {
    id: "fallback-1",
    imagePath: "/images/projects/solar-water-heater-installation.jpeg",
    alt: "Rooftop solar water heater installation in Nairobi",
    title: "Rooftop Solar Water Heater Installation",
    location: "Nairobi",
    sortOrder: 0,
  },
  {
    id: "fallback-2",
    imagePath: "/images/projects/srne-solar-inverter-installation.jpeg",
    alt: "Residential hybrid solar inverter and battery installation",
    title: "Hybrid Solar Inverter & Battery Installation",
    location: "Nairobi",
    sortOrder: 1,
  },
  {
    id: "fallback-3",
    imagePath: "/images/projects/eae-hybrid-inverter-installation.jpeg",
    alt: "Home backup power system with hybrid solar inverter",
    title: "Home Backup Power System",
    location: "Nairobi",
    sortOrder: 2,
  },
  {
    id: "fallback-4",
    imagePath: "/images/projects/automatic-transfer-switch-installation.jpeg",
    alt: "Automatic transfer switch control panel installation",
    title: "Automatic Transfer Switch Control Panel",
    location: "Nairobi",
    sortOrder: 3,
  },
  {
    id: "fallback-5",
    imagePath: "/images/products/vestwoods-power-station-lifestyle.jpeg",
    alt: "Portable solar power station for home and outdoor backup power",
    title: "Smart Portable Power Solutions",
    location: "Kenya",
    sortOrder: 4,
  },
];

export const getHeroContent = cache(async (): Promise<HeroContentRecord> => {
  try {
    const row = await heroStore.getContent();
    return row ?? FALLBACK_HERO_CONTENT;
  } catch {
    return FALLBACK_HERO_CONTENT;
  }
});

export const getHeroSlides = cache(async (): Promise<HeroSlideRecord[]> => {
  try {
    const rows = await heroStore.listSlides();
    return rows.length > 0 ? rows : FALLBACK_HERO_SLIDES;
  } catch {
    return FALLBACK_HERO_SLIDES;
  }
});

export async function updateHeroContent(values: HeroContentRecord): Promise<HeroContentRecord> {
  return heroStore.updateContent(values);
}

export const getHeroSlideById = (id: string) => heroStore.getSlideById(id);
export const createHeroSlide = (values: Omit<HeroSlideRecord, "id">) => heroStore.createSlide(values);
export const updateHeroSlide = (id: string, values: Omit<HeroSlideRecord, "id">) => heroStore.updateSlide(id, values);
export const deleteHeroSlide = (id: string) => heroStore.deleteSlide(id);

export type { HeroContentRecord, HeroSlideRecord };
