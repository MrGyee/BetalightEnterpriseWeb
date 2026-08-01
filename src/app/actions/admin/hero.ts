"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  heroContentAdminSchema,
  heroSlideAdminSchema,
  type HeroContentAdminValues,
  type HeroSlideAdminValues,
} from "@/lib/validation/admin";
import {
  getHeroContent,
  updateHeroContent,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "@/lib/data/hero";
import type { HeroStat } from "@/lib/store/hero.store";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateHeroPaths() {
  revalidatePath("/");
  revalidatePath("/admin/hero");
  revalidatePath("/admin/hero/slides");
}

function parseTrustPointsText(text: string): string[] {
  return text
    .split(",")
    .map((point) => point.trim())
    .filter(Boolean);
}

function formatTrustPointsText(points: string[]): string {
  return points.join(", ");
}

function parseStatsText(text: string): HeroStat[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, value, suffix] = line.split("|").map((part) => part.trim());
      return { label: label ?? line, value: Number(value) || 0, suffix: suffix ?? "" };
    });
}

function formatStatsText(stats: HeroStat[]): string {
  return stats.map((s) => `${s.label} | ${s.value} | ${s.suffix}`).join("\n");
}

export async function getHeroContentFormValues() {
  const content = await getHeroContent();
  return {
    badgeText: content.badgeText,
    headline: content.headline,
    subheadline: content.subheadline,
    trustPointsText: formatTrustPointsText(content.trustPoints),
    statsText: formatStatsText(content.stats),
  };
}

export async function updateHeroContentAction(values: HeroContentAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = heroContentAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await updateHeroContent({
    badgeText: parsed.data.badgeText,
    headline: parsed.data.headline,
    subheadline: parsed.data.subheadline,
    trustPoints: parseTrustPointsText(parsed.data.trustPointsText),
    stats: parseStatsText(parsed.data.statsText),
  });
  revalidateHeroPaths();
  return { success: true };
}

export async function createHeroSlideAction(values: HeroSlideAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = heroSlideAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createHeroSlide({
    imagePath: parsed.data.imagePath,
    title: parsed.data.title,
    location: parsed.data.location,
    alt: parsed.data.alt || parsed.data.title,
    sortOrder: parsed.data.sortOrder,
  });
  revalidateHeroPaths();
  return { success: true };
}

export async function updateHeroSlideAction(id: string, values: HeroSlideAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = heroSlideAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await getHeroSlideById(id))) {
    return { success: false, error: "Slide not found." };
  }
  await updateHeroSlide(id, {
    imagePath: parsed.data.imagePath,
    title: parsed.data.title,
    location: parsed.data.location,
    alt: parsed.data.alt || parsed.data.title,
    sortOrder: parsed.data.sortOrder,
  });
  revalidateHeroPaths();
  return { success: true };
}

export async function deleteHeroSlideAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await getHeroSlideById(id))) {
    return { success: false, error: "Slide not found." };
  }
  await deleteHeroSlide(id);
  revalidateHeroPaths();
  return { success: true };
}
