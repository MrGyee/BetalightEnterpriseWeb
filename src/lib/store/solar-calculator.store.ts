import "server-only";
import { getSupabaseClient } from "@/lib/supabase/server-client";

export type LabourMode = "fixed" | "percent";

export type SolarCalculatorSettingsRecord = {
  panelPricePerWatt: number;
  lithiumPricePerKwh: number;
  gelPricePerKwh: number;
  inverterPricePerKva: number;
  bosPercent: number;
  vatPercent: number;
  gridTariffPerKwh: number;
  /** Off by default — the Full Estimate disclaimer says "materials only" until this is turned on. */
  labourEnabled: boolean;
  labourMode: LabourMode;
  labourFixedKsh: number;
  /** Applied to materials + balance of system, before VAT. */
  labourPercent: number;
};

type SolarCalculatorSettingsRow = {
  panel_price_per_watt: number;
  lithium_price_per_kwh: number;
  gel_price_per_kwh: number;
  inverter_price_per_kva: number;
  bos_percent: number;
  vat_percent: number;
  grid_tariff_per_kwh: number;
  labour_enabled: boolean;
  labour_mode: LabourMode;
  labour_fixed_ksh: number;
  labour_percent: number;
};

function mapRow(row: SolarCalculatorSettingsRow): SolarCalculatorSettingsRecord {
  return {
    panelPricePerWatt: row.panel_price_per_watt,
    lithiumPricePerKwh: row.lithium_price_per_kwh,
    gelPricePerKwh: row.gel_price_per_kwh,
    inverterPricePerKva: row.inverter_price_per_kva,
    bosPercent: row.bos_percent,
    vatPercent: row.vat_percent,
    gridTariffPerKwh: row.grid_tariff_per_kwh,
    labourEnabled: row.labour_enabled,
    labourMode: row.labour_mode,
    labourFixedKsh: row.labour_fixed_ksh,
    labourPercent: row.labour_percent,
  };
}

function toRow(values: SolarCalculatorSettingsRecord) {
  return {
    id: 1,
    panel_price_per_watt: values.panelPricePerWatt,
    lithium_price_per_kwh: values.lithiumPricePerKwh,
    gel_price_per_kwh: values.gelPricePerKwh,
    inverter_price_per_kva: values.inverterPricePerKva,
    bos_percent: values.bosPercent,
    vat_percent: values.vatPercent,
    grid_tariff_per_kwh: values.gridTariffPerKwh,
    labour_enabled: values.labourEnabled,
    labour_mode: values.labourMode,
    labour_fixed_ksh: values.labourFixedKsh,
    labour_percent: values.labourPercent,
    updated_at: new Date().toISOString(),
  };
}

export const solarCalculatorStore = {
  async get(): Promise<SolarCalculatorSettingsRecord | null> {
    const { data, error } = await getSupabaseClient()
      .from("solar_calculator_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw new Error(`[solar_calculator_settings] select: ${error.message}`);
    return data ? mapRow(data as SolarCalculatorSettingsRow) : null;
  },
  async update(values: SolarCalculatorSettingsRecord): Promise<SolarCalculatorSettingsRecord> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseClient().from("solar_calculator_settings") as any)
      .upsert(toRow(values), { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(`[solar_calculator_settings] update: ${error.message}`);
    return mapRow(data as SolarCalculatorSettingsRow);
  },
};
