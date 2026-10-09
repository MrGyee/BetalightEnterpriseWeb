import type { SolarCalculatorSettingsRecord } from "@/lib/store/solar-calculator.store";

export type BatteryChemistry = "lithium" | "gel";
export type AutonomyDays = 1 | 2 | 3;

export interface ApplianceDefinition {
  id: string;
  label: string;
  watts: number;
  defaultHours: number;
}

// Common Kenyan household/commercial loads, matched to what Betalight's own
// catalog targets (residential backup, light-commercial, boreholes) rather
// than an exhaustive appliance database. "Other" rows cover anything missing.
export const APPLIANCES: ApplianceDefinition[] = [
  { id: "led-bulbs", label: "LED Bulbs (x10)", watts: 100, defaultHours: 6 },
  { id: "phone-laptop", label: "Phone & Laptop Charging", watts: 60, defaultHours: 8 },
  { id: "router", label: "Wi-Fi Router", watts: 15, defaultHours: 24 },
  { id: "tv", label: "TV", watts: 120, defaultHours: 5 },
  { id: "fridge", label: "Fridge / Freezer", watts: 150, defaultHours: 24 },
  { id: "washing-machine", label: "Washing Machine", watts: 500, defaultHours: 1 },
  { id: "iron", label: "Pressing Iron", watts: 1000, defaultHours: 0.5 },
  { id: "microwave", label: "Microwave", watts: 1200, defaultHours: 0.5 },
  { id: "desktop", label: "Desktop Computer", watts: 200, defaultHours: 6 },
  { id: "cctv", label: "CCTV System", watts: 40, defaultHours: 24 },
  { id: "water-pump", label: "Water Pump", watts: 750, defaultHours: 1 },
  { id: "borehole-pump", label: "Borehole Pump", watts: 1100, defaultHours: 2 },
];

export type SolarCalculatorInput = (
  | { mode: "appliances"; items: { label: string; watts: number; hoursPerDay: number }[] }
  // For visitors who know their usage but not their appliance wattages —
  // only daily energy is known, not what's running at once, so the inverter
  // line this produces is a rougher, clearly-labelled estimate (see
  // peakLoadIsEstimated below), not sized off a real simultaneous load.
  | { mode: "usage"; dailyEnergyWh: number }
) & {
  autonomyDays: AutonomyDays;
  batteryChemistry: BatteryChemistry;
};

export interface SolarEstimateLineItem {
  label: string;
  quantity: string;
  unitPrice: number;
  total: number;
}

export interface SolarEstimate {
  dailyEnergyWh: number;
  peakLoadWatts: number;
  /** True in "usage" mode — the inverter line is a rough estimate, not sized off a real appliance list. */
  peakLoadIsEstimated: boolean;
  panelArrayWp: number;
  batteryKwh: number;
  inverterKva: number;
  lineItems: SolarEstimateLineItem[];
  subtotal: number;
  bosCost: number;
  vatAmount: number;
  total: number;
}

// City-level PV yield data for Nairobi, Mombasa, Kisumu, Eldoret and Nakuru
// (NASA POWER-derived) clusters around 5.3-6.9 kWh/kW/day across seasons —
// tightly enough that per-city numbers would be false precision given we
// aren't modelling season at all. 5 matches the Kenya-wide planning default
// used by AfroTools' own Kenya solar ROI calculator.
const PEAK_SUN_HOURS = 5;
// Combined wiring/temperature/inverter-conversion derate applied when sizing
// the panel array from daily energy need — standard off-grid sizing practice.
const SYSTEM_DERATE = 0.8;
// Headroom above continuous load for appliance starting surge (compressors,
// motors) when sizing the inverter.
const INVERTER_SURGE_HEADROOM = 1.25;
const INVERTER_STEP_KVA = 0.5;
const MIN_INVERTER_KVA = 1;
// "Usage" mode only knows daily energy, not what runs at once — this treats
// that energy as if drawn over a typical mixed-household active window, to
// get a peak load worth sizing an inverter around. Deliberately conservative
// (shorter window -> higher implied peak) since undersizing an inverter is
// the worse failure mode.
const ASSUMED_USAGE_WINDOW_HOURS = 6;

const DEPTH_OF_DISCHARGE: Record<BatteryChemistry, number> = {
  lithium: 0.9,
  gel: 0.5,
};

function roundUpToStep(value: number, step: number): number {
  return Math.ceil(value / step) * step;
}

export function calculateSolarEstimate(
  input: SolarCalculatorInput,
  pricing: SolarCalculatorSettingsRecord
): SolarEstimate | null {
  let dailyEnergyWh: number;
  let peakLoadWatts: number;
  let peakLoadIsEstimated: boolean;

  if (input.mode === "appliances") {
    const activeItems = input.items.filter((item) => item.watts > 0 && item.hoursPerDay > 0);
    if (activeItems.length === 0) return null;
    dailyEnergyWh = activeItems.reduce((sum, item) => sum + item.watts * item.hoursPerDay, 0);
    peakLoadWatts = activeItems.reduce((sum, item) => sum + item.watts, 0);
    peakLoadIsEstimated = false;
  } else {
    if (input.dailyEnergyWh <= 0) return null;
    dailyEnergyWh = input.dailyEnergyWh;
    peakLoadWatts = dailyEnergyWh / ASSUMED_USAGE_WINDOW_HOURS;
    peakLoadIsEstimated = true;
  }

  // Battery: sized directly off the real daily energy need and how many days
  // of autonomy are wanted, inflated for how much of the chemistry's capacity
  // is actually usable.
  const dod = DEPTH_OF_DISCHARGE[input.batteryChemistry];
  const batteryWhNeeded = (dailyEnergyWh * input.autonomyDays) / dod;
  const batteryKwh = batteryWhNeeded / 1000;

  // Panels: sized to generate enough raw energy, after system losses, to meet
  // the same daily need within the available sun hours — decoupled from
  // battery sizing so system losses aren't counted twice.
  const panelArrayWp = dailyEnergyWh / (PEAK_SUN_HOURS * SYSTEM_DERATE);

  // Inverter: sized off worst-case simultaneous load (every selected
  // appliance running at once), not daily energy.
  const inverterKva = Math.max(
    MIN_INVERTER_KVA,
    roundUpToStep((peakLoadWatts * INVERTER_SURGE_HEADROOM) / 1000, INVERTER_STEP_KVA)
  );

  const panelCost = panelArrayWp * pricing.panelPricePerWatt;
  const batteryRate = input.batteryChemistry === "lithium" ? pricing.lithiumPricePerKwh : pricing.gelPricePerKwh;
  const batteryCost = batteryKwh * batteryRate;
  const inverterCost = inverterKva * pricing.inverterPricePerKva;
  const subtotal = panelCost + batteryCost + inverterCost;
  const bosCost = subtotal * (pricing.bosPercent / 100);
  const vatAmount = (subtotal + bosCost) * (pricing.vatPercent / 100);
  const total = subtotal + bosCost + vatAmount;

  const batteryLabel = input.batteryChemistry === "lithium" ? "LiFePO4 Lithium" : "Gel";

  const lineItems: SolarEstimateLineItem[] = [
    { label: "Solar panel array", quantity: `${Math.round(panelArrayWp)} Wp`, unitPrice: pricing.panelPricePerWatt, total: panelCost },
    {
      label: `Battery bank (${batteryLabel})`,
      quantity: `${batteryKwh.toFixed(2)} kWh`,
      unitPrice: batteryRate,
      total: batteryCost,
    },
    {
      label: peakLoadIsEstimated ? "Hybrid inverter (estimated from usage)" : "Hybrid inverter",
      quantity: `${inverterKva} kVA`,
      unitPrice: pricing.inverterPricePerKva,
      total: inverterCost,
    },
    { label: `Balance of system (mounting, cabling, breakers, earthing — ${pricing.bosPercent}%)`, quantity: "1", unitPrice: bosCost, total: bosCost },
    { label: `VAT (${pricing.vatPercent}%)`, quantity: "1", unitPrice: vatAmount, total: vatAmount },
  ];

  return {
    dailyEnergyWh,
    peakLoadWatts,
    peakLoadIsEstimated,
    panelArrayWp,
    batteryKwh,
    inverterKva,
    lineItems,
    subtotal,
    bosCost,
    vatAmount,
    total,
  };
}

export function formatKsh(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}

// ── Quick sizing tools ──────────────────────────────────────────────────
// Standalone, single-purpose versions of the sizing steps inside
// calculateSolarEstimate, for a visitor (or technician) who already knows
// one number and wants one answer — not a full appliance-by-appliance
// estimate. Deliberately size-only, no KSh: a breaker or inverter size
// alone isn't worth a priced line item, and these point back to the full
// estimate or WhatsApp for pricing.

// IEC 60898 standard miniature circuit breaker ratings — a calculated
// current gets rounded up to the next one of these, not to an arbitrary step.
const STANDARD_BREAKER_AMPS = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200] as const;

// Anchors "how many batteries/panels" to what Betalight actually stocks,
// rather than an abstract number — Vestwoods VC12200 Plus (12.8V 200Ah) and
// the top of JINKO bifacial's listed wattage range.
export const REFERENCE_BATTERY_KWH = 2.56;
export const REFERENCE_PANEL_WATTS = 450;

function roundUpToNearest(value: number, options: readonly number[]): number {
  return options.find((option) => option >= value) ?? options[options.length - 1];
}

export interface InverterSizeResult {
  minimumKva: number;
  recommendedKva: number;
  surgeWatts: number;
}

/** Peak load -> minimum and recommended (rounded-up) inverter capacity. */
export function sizeInverter(params: { peakLoadWatts: number; headroomPercent?: number }): InverterSizeResult | null {
  if (params.peakLoadWatts <= 0) return null;
  const headroom = 1 + (params.headroomPercent ?? (INVERTER_SURGE_HEADROOM - 1) * 100) / 100;
  const minimumKva = (params.peakLoadWatts * headroom) / 1000;
  return {
    minimumKva,
    recommendedKva: Math.max(MIN_INVERTER_KVA, roundUpToStep(minimumKva, INVERTER_STEP_KVA)),
    surgeWatts: params.peakLoadWatts * headroom,
  };
}

export interface BatterySizeResult {
  batteryKwh: number;
  referenceBatteryCount: number;
}

/** Daily energy + autonomy + chemistry -> usable battery bank size. */
export function sizeBattery(params: {
  dailyEnergyWh: number;
  autonomyDays: number;
  chemistry: BatteryChemistry;
}): BatterySizeResult | null {
  if (params.dailyEnergyWh <= 0 || params.autonomyDays <= 0) return null;
  const dod = DEPTH_OF_DISCHARGE[params.chemistry];
  const batteryKwh = (params.dailyEnergyWh * params.autonomyDays) / dod / 1000;
  return { batteryKwh, referenceBatteryCount: Math.ceil(batteryKwh / REFERENCE_BATTERY_KWH) };
}

export interface PanelArraySizeResult {
  arrayWp: number;
  panelCount: number;
}

/** Daily energy -> panel array size, against Kenya's ~5 peak sun hours. */
export function sizePanelArray(params: { dailyEnergyWh: number; panelWattage?: number }): PanelArraySizeResult | null {
  if (params.dailyEnergyWh <= 0) return null;
  const arrayWp = params.dailyEnergyWh / (PEAK_SUN_HOURS * SYSTEM_DERATE);
  const panelWattage = params.panelWattage ?? REFERENCE_PANEL_WATTS;
  return { arrayWp, panelCount: Math.ceil(arrayWp / panelWattage) };
}

export type ElectricalPhase = "single" | "three";

export interface BreakerSizeResult {
  currentA: number;
  currentWithMarginA: number;
  recommendedBreakerA: number;
}

/**
 * Output watts + voltage/phase -> breaker rating, via P = V x I (single
 * phase) or P = V x I x sqrt(3) (three phase, power factor of 1 assumed —
 * the same simplifying assumption used throughout this calculator).
 */
export function sizeBreaker(params: {
  outputWatts: number;
  voltage: number;
  phase: ElectricalPhase;
  marginPercent?: number;
}): BreakerSizeResult | null {
  if (params.outputWatts <= 0 || params.voltage <= 0) return null;
  const divisor = params.phase === "three" ? params.voltage * Math.sqrt(3) : params.voltage;
  const currentA = params.outputWatts / divisor;
  const margin = 1 + (params.marginPercent ?? (INVERTER_SURGE_HEADROOM - 1) * 100) / 100;
  const currentWithMarginA = currentA * margin;
  return { currentA, currentWithMarginA, recommendedBreakerA: roundUpToNearest(currentWithMarginA, STANDARD_BREAKER_AMPS) };
}
