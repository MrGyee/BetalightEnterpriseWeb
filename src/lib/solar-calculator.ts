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

export interface SolarCalculatorInput {
  items: { label: string; watts: number; hoursPerDay: number }[];
  autonomyDays: AutonomyDays;
  batteryChemistry: BatteryChemistry;
}

export interface SolarEstimateLineItem {
  label: string;
  quantity: string;
  unitPrice: number;
  total: number;
}

export interface SolarEstimate {
  dailyEnergyWh: number;
  peakLoadWatts: number;
  panelArrayWp: number;
  batteryKwh: number;
  inverterKva: number;
  lineItems: SolarEstimateLineItem[];
  subtotal: number;
  bosCost: number;
  vatAmount: number;
  total: number;
}

// Nairobi-area average; the national range runs roughly 4-6 depending on
// region, 4.5 is a reasonably conservative middle figure.
const PEAK_SUN_HOURS = 4.5;
// Combined wiring/temperature/inverter-conversion derate applied when sizing
// the panel array from daily energy need — standard off-grid sizing practice.
const SYSTEM_DERATE = 0.8;
// Headroom above continuous load for appliance starting surge (compressors,
// motors) when sizing the inverter.
const INVERTER_SURGE_HEADROOM = 1.25;
const INVERTER_STEP_KVA = 0.5;
const MIN_INVERTER_KVA = 1;

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
  const activeItems = input.items.filter((item) => item.watts > 0 && item.hoursPerDay > 0);
  if (activeItems.length === 0) return null;

  const dailyEnergyWh = activeItems.reduce((sum, item) => sum + item.watts * item.hoursPerDay, 0);
  const peakLoadWatts = activeItems.reduce((sum, item) => sum + item.watts, 0);

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
    { label: "Hybrid inverter", quantity: `${inverterKva} kVA`, unitPrice: pricing.inverterPricePerKva, total: inverterCost },
    { label: `Balance of system (mounting, cabling, breakers, earthing — ${pricing.bosPercent}%)`, quantity: "1", unitPrice: bosCost, total: bosCost },
    { label: `VAT (${pricing.vatPercent}%)`, quantity: "1", unitPrice: vatAmount, total: vatAmount },
  ];

  return { dailyEnergyWh, peakLoadWatts, panelArrayWp, batteryKwh, inverterKva, lineItems, subtotal, bosCost, vatAmount, total };
}

export function formatKsh(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}
