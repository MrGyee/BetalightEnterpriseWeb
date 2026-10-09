"use client";

import { useMemo, useState } from "react";
import { MessageCircle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buildSolarEstimateWhatsAppMessage } from "@/lib/share";
import { useSiteSettings } from "@/components/shared/site-settings-provider";
import {
  APPLIANCE_CATEGORIES,
  PROPERTY_TYPES,
  GOALS,
  calculateSolarEstimate,
  formatKsh,
  type AutonomyDays,
  type BatteryChemistry,
  type PropertyType,
  type Goal,
} from "@/lib/solar-calculator";
import type { SolarCalculatorSettingsRecord } from "@/lib/store/solar-calculator.store";
import { cn } from "@/lib/utils";

const selectClassName =
  "flex h-9 w-full max-w-xs rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type ItemState = Record<string, { enabled: boolean; watts: number; hoursPerDay: number; surgeMultiplier?: number }>;
type InputMode = "appliances" | "usage";
type UsageMode = "bill" | "kwh";
type Step = 0 | 1 | 2 | 3;

const STEP_LABELS = ["Property", "Usage", "Preferences", "Your Estimate"];

function initialItemState(): ItemState {
  const state: ItemState = {};
  for (const category of APPLIANCE_CATEGORIES) {
    for (const a of category.appliances) {
      state[a.id] = { enabled: false, watts: a.watts, hoursPerDay: a.defaultHours, surgeMultiplier: a.surgeMultiplier };
    }
  }
  return state;
}

function SelectableCard({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-input"
        )}
      >
        {selected && <Check className="size-3" />}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
    </button>
  );
}

function StepProgress({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            )}
          >
            {i + 1}
          </div>
          <span className={cn("hidden text-xs font-medium sm:inline", i === step ? "text-foreground" : "text-muted-foreground")}>
            {label}
          </span>
          {i < STEP_LABELS.length - 1 && <div className="h-px w-4 bg-border sm:w-8" />}
        </div>
      ))}
    </div>
  );
}

export function FullEstimateWizard({ pricing }: { pricing: SolarCalculatorSettingsRecord }) {
  const settings = useSiteSettings();
  const [step, setStep] = useState<Step>(0);

  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);

  const [inputMode, setInputMode] = useState<InputMode>("appliances");
  const [items, setItems] = useState<ItemState>(initialItemState);
  const [usageMode, setUsageMode] = useState<UsageMode>("bill");
  const [monthlyBillKsh, setMonthlyBillKsh] = useState<number>(8000);
  const [dailyKwh, setDailyKwh] = useState<number>(0);

  const [goal, setGoal] = useState<Goal | null>(null);
  const [autonomyDays, setAutonomyDays] = useState<AutonomyDays>(1);
  const [batteryChemistry, setBatteryChemistry] = useState<BatteryChemistry>("lithium");

  function selectGoal(g: Goal) {
    setGoal(g);
    setAutonomyDays(GOALS.find((x) => x.id === g)!.defaultAutonomyDays);
  }

  const estimate = useMemo(() => {
    if (inputMode === "appliances") {
      const activeItems = Object.entries(items)
        .filter(([, v]) => v.enabled)
        .map(([id, v]) => {
          const definition = APPLIANCE_CATEGORIES.flatMap((c) => c.appliances).find((a) => a.id === id);
          return { label: definition?.label ?? id, watts: v.watts, hoursPerDay: v.hoursPerDay, surgeMultiplier: v.surgeMultiplier };
        });
      return calculateSolarEstimate({ mode: "appliances", items: activeItems, autonomyDays, batteryChemistry }, pricing);
    }
    const resolvedDailyKwh = usageMode === "bill" ? monthlyBillKsh / pricing.gridTariffPerKwh / 30 : dailyKwh;
    return calculateSolarEstimate(
      { mode: "usage", dailyEnergyWh: resolvedDailyKwh * 1000, autonomyDays, batteryChemistry },
      pricing
    );
  }, [inputMode, items, usageMode, monthlyBillKsh, dailyKwh, autonomyDays, batteryChemistry, pricing]);

  function toggleItem(id: string, enabled: boolean) {
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], enabled } }));
  }

  function updateItem(id: string, field: "watts" | "hoursPerDay", value: number) {
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], [field]: Math.max(0, value) } }));
  }

  const propertyLabel = propertyType ? PROPERTY_TYPES.find((p) => p.id === propertyType)?.label : undefined;
  const goalLabel = goal ? GOALS.find((g) => g.id === goal)?.label : undefined;

  const whatsappHref = estimate
    ? buildWhatsAppLink(
        settings.whatsappNumber,
        buildSolarEstimateWhatsAppMessage({
          dailyEnergyWh: estimate.dailyEnergyWh,
          panelArrayWp: estimate.panelArrayWp,
          batteryKwh: estimate.batteryKwh,
          batteryChemistry,
          inverterKva: estimate.inverterKva,
          autonomyDays,
          estimatedTotal: formatKsh(estimate.total),
          peakLoadIsEstimated: estimate.peakLoadIsEstimated,
          propertyTypeLabel: propertyLabel,
          goalLabel,
        })
      )
    : null;

  const canContinueFromUsage = inputMode === "appliances" ? Object.values(items).some((i) => i.enabled) : !!estimate;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="overflow-x-auto pb-2">
        <StepProgress step={step} />
      </div>

      {step === 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-lg font-bold text-foreground">What kind of property is this for?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Helps us route your enquiry to the right team — doesn&apos;t change the sizing.</p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PROPERTY_TYPES.map((p) => (
              <SelectableCard key={p.id} selected={propertyType === p.id} title={p.label} onClick={() => setPropertyType(p.id)} />
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInputMode("appliances")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                inputMode === "appliances" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              Pick Appliances
            </button>
            <button
              type="button"
              onClick={() => setInputMode("usage")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                inputMode === "usage" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              I Know My Usage
            </button>
          </div>

          {inputMode === "appliances" ? (
            <div className="mt-5 space-y-6">
              {APPLIANCE_CATEGORIES.map((category) => (
                <div key={category.id}>
                  <h3 className="font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">{category.label}</h3>
                  <div className="mt-2 divide-y divide-border">
                    {category.appliances.map((appliance) => {
                      const state = items[appliance.id];
                      return (
                        <div key={appliance.id} className="flex flex-wrap items-center gap-3 py-2.5">
                          <label className="flex min-w-[200px] flex-1 items-center gap-2.5 text-sm font-medium text-foreground">
                            <Checkbox checked={state.enabled} onCheckedChange={(v) => toggleItem(appliance.id, !!v)} />
                            {appliance.label}
                            {appliance.surgeMultiplier && (
                              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                starts at {appliance.surgeMultiplier}x
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              min={0}
                              value={state.watts}
                              onChange={(e) => updateItem(appliance.id, "watts", Number(e.target.value))}
                              disabled={!state.enabled}
                              className="h-8 w-20 text-sm"
                              aria-label={`${appliance.label} wattage`}
                            />
                            <span className="text-xs text-muted-foreground">W ×</span>
                            <Input
                              type="number"
                              min={0}
                              step={0.25}
                              value={state.hoursPerDay}
                              onChange={(e) => updateItem(appliance.id, "hoursPerDay", Number(e.target.value))}
                              disabled={!state.enabled}
                              className="h-8 w-16 text-sm"
                              aria-label={`${appliance.label} hours per day`}
                            />
                            <span className="text-xs text-muted-foreground">hrs/day</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <p className="text-sm text-muted-foreground">
                Don&apos;t know your appliance wattages? Enter your usage instead — we&apos;ll still size a battery and
                panel array for you, though the inverter size becomes a rougher estimate without knowing what runs at
                once.
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setUsageMode("bill")}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    usageMode === "bill" ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  Monthly bill
                </button>
                <button
                  type="button"
                  onClick={() => setUsageMode("kwh")}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    usageMode === "kwh" ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  I know my kWh/day
                </button>
              </div>

              {usageMode === "bill" ? (
                <div className="mt-4 max-w-sm">
                  <div className="flex items-center justify-between">
                    <label htmlFor="monthly-bill-slider" className="text-sm font-medium text-foreground">
                      Average monthly electricity bill
                    </label>
                    <span className="font-heading text-sm font-bold text-primary">{formatKsh(monthlyBillKsh)}</span>
                  </div>
                  <input
                    id="monthly-bill-slider"
                    type="range"
                    min={1000}
                    max={50000}
                    step={500}
                    value={monthlyBillKsh}
                    onChange={(e) => setMonthlyBillKsh(Number(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>KSh 1,000</span>
                    <span>KSh 50,000+</span>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    value={monthlyBillKsh || ""}
                    onChange={(e) => setMonthlyBillKsh(Math.max(0, Number(e.target.value)))}
                    className="mt-3"
                  />
                </div>
              ) : (
                <div className="mt-4 max-w-xs">
                  <label htmlFor="daily-kwh" className="text-sm font-medium text-foreground">
                    Daily usage (kWh)
                  </label>
                  <Input
                    id="daily-kwh"
                    type="number"
                    min={0}
                    step={0.1}
                    value={dailyKwh || ""}
                    onChange={(e) => setDailyKwh(Math.max(0, Number(e.target.value)))}
                    placeholder="e.g. 5.2"
                    className="mt-1.5"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <h2 className="font-heading text-lg font-bold text-foreground">What&apos;s the goal?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sets a sensible starting number of backup days — adjust it below if you want.</p>
          <div className="mt-5 grid grid-cols-1 gap-3">
            {GOALS.map((g) => (
              <SelectableCard
                key={g.id}
                selected={goal === g.id}
                title={g.label}
                description={g.description}
                onClick={() => selectGoal(g.id)}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
            <div>
              <label htmlFor="autonomy-days" className="text-sm font-medium text-foreground">
                Days of backup (no sun)
              </label>
              <select
                id="autonomy-days"
                className={cn(selectClassName, "mt-1.5")}
                value={autonomyDays}
                onChange={(e) => setAutonomyDays(Number(e.target.value) as AutonomyDays)}
              >
                {[1, 2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>
                    {d} day{d > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="battery-chemistry" className="text-sm font-medium text-foreground">
                Battery type
              </label>
              <select
                id="battery-chemistry"
                className={cn(selectClassName, "mt-1.5")}
                value={batteryChemistry}
                onChange={(e) => setBatteryChemistry(e.target.value as BatteryChemistry)}
              >
                <option value="lithium">Lithium (LiFePO4) — longer life, less space</option>
                <option value="gel">Gel — lower upfront cost</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6">
          <h2 className="font-heading text-lg font-bold text-foreground">Your estimate</h2>

          {!estimate ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {inputMode === "appliances"
                ? "Go back and tick at least one appliance to see a sizing estimate."
                : "Go back and enter your bill or daily usage to see a sizing estimate."}
            </p>
          ) : (
            <>
              {(propertyLabel || goalLabel) && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {[propertyLabel, goalLabel].filter(Boolean).join(" · ")}
                </p>
              )}

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estimate.lineItems.map((line) => (
                    <TableRow key={line.label}>
                      <TableCell className="text-xs sm:text-sm">{line.label}</TableCell>
                      <TableCell className="text-xs text-muted-foreground sm:text-sm">{line.quantity}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground sm:text-sm">{formatKsh(line.unitPrice)}</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm">{formatKsh(line.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-heading text-base font-bold text-foreground">Estimated total</span>
                <span className="font-heading text-xl font-extrabold text-primary">{formatKsh(estimate.total)}</span>
              </div>

              {estimate.peakLoadIsEstimated && (
                <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
                  The inverter size above is estimated from your usage, not a real appliance list — go back to Pick
                  Appliances, or confirm on WhatsApp, for an exact inverter size.
                </p>
              )}

              <p className="mt-3 text-xs text-muted-foreground">
                This is a materials estimate only, based on typical unit rates — it excludes installation, delivery and
                site-specific extras, and is not a fixed quote. Send it to us on WhatsApp for an accurate, installed price.
              </p>

              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("solar_estimate_whatsapp", { total_ksh: Math.round(estimate.total) })}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-5 w-full rounded-full border-[#25D366] bg-[#25D366] text-white hover:bg-[#1ebe5a]"
                  )}
                >
                  <MessageCircle className="size-4" fill="currentColor" strokeWidth={0} />
                  Send Estimate on WhatsApp
                </a>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
          disabled={step === 0}
          className={cn(buttonVariants({ variant: "outline" }), "gap-1.5 rounded-full", step === 0 && "invisible")}
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        {step < 3 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(3, s + 1) as Step)}
            disabled={step === 1 ? !canContinueFromUsage : false}
            className={cn(buttonVariants(), "gap-1.5 rounded-full")}
          >
            {step === 2 ? "See My Estimate" : "Continue"} <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
