import "server-only";
import { cache } from "react";
import { solarCalculatorStore, type SolarCalculatorSettingsRecord } from "@/lib/store/solar-calculator.store";

// Placeholder figures — not researched Kenyan market prices. Real public
// pricing for solar components varies too widely (panels alone spanned
// roughly KSh 55-150/W across sources checked) to hardcode with confidence,
// and the business's real supplier costs and margins are what should drive
// this, not a generic estimate. Edit these at /admin/solar-calculator.
const FALLBACK_SOLAR_CALCULATOR_SETTINGS: SolarCalculatorSettingsRecord = {
  panelPricePerWatt: 60,
  lithiumPricePerKwh: 18000,
  gelPricePerKwh: 9000,
  inverterPricePerKva: 20000,
  bosPercent: 12,
  vatPercent: 16,
};

// Falls back to the placeholders above if the `solar_calculator_settings`
// table is missing (migration not yet applied) or the row hasn't been
// created yet, so the calculator keeps working before/without an admin edit.
export const getSolarCalculatorSettings = cache(async (): Promise<SolarCalculatorSettingsRecord> => {
  try {
    const row = await solarCalculatorStore.get();
    return row ?? FALLBACK_SOLAR_CALCULATOR_SETTINGS;
  } catch {
    return FALLBACK_SOLAR_CALCULATOR_SETTINGS;
  }
});

export async function updateSolarCalculatorSettings(
  values: SolarCalculatorSettingsRecord
): Promise<SolarCalculatorSettingsRecord> {
  return solarCalculatorStore.update(values);
}

export type { SolarCalculatorSettingsRecord };
