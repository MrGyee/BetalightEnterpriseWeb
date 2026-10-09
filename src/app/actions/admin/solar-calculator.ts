"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { solarCalculatorAdminSchema, type SolarCalculatorAdminValues } from "@/lib/validation/admin";
import { getSolarCalculatorSettings, updateSolarCalculatorSettings } from "@/lib/data/solar-calculator";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function getSolarCalculatorFormValues(): Promise<SolarCalculatorAdminValues> {
  const settings = await getSolarCalculatorSettings();
  return {
    panelPricePerWatt: settings.panelPricePerWatt,
    lithiumPricePerKwh: settings.lithiumPricePerKwh,
    gelPricePerKwh: settings.gelPricePerKwh,
    inverterPricePerKva: settings.inverterPricePerKva,
    bosPercent: settings.bosPercent,
    vatPercent: settings.vatPercent,
    gridTariffPerKwh: settings.gridTariffPerKwh,
  };
}

export async function updateSolarCalculatorAction(values: SolarCalculatorAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = solarCalculatorAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await updateSolarCalculatorSettings(parsed.data);
  revalidatePath("/solar-cost-estimate");
  return { success: true };
}
