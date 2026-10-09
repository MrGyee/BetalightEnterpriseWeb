"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buildSolarEstimateWhatsAppMessage } from "@/lib/share";
import { useSiteSettings } from "@/components/shared/site-settings-provider";
import {
  APPLIANCES,
  calculateSolarEstimate,
  formatKsh,
  type AutonomyDays,
  type BatteryChemistry,
} from "@/lib/solar-calculator";
import type { SolarCalculatorSettingsRecord } from "@/lib/store/solar-calculator.store";
import { cn } from "@/lib/utils";

const selectClassName =
  "flex h-9 w-full max-w-xs rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type ItemState = Record<string, { enabled: boolean; watts: number; hoursPerDay: number }>;

function initialItemState(): ItemState {
  return Object.fromEntries(APPLIANCES.map((a) => [a.id, { enabled: false, watts: a.watts, hoursPerDay: a.defaultHours }]));
}

export function SolarCalculator({ pricing }: { pricing: SolarCalculatorSettingsRecord }) {
  const settings = useSiteSettings();
  const [items, setItems] = useState<ItemState>(initialItemState);
  const [autonomyDays, setAutonomyDays] = useState<AutonomyDays>(1);
  const [batteryChemistry, setBatteryChemistry] = useState<BatteryChemistry>("lithium");

  const estimate = useMemo(() => {
    const activeItems = APPLIANCES.filter((a) => items[a.id]?.enabled).map((a) => ({
      label: a.label,
      watts: items[a.id].watts,
      hoursPerDay: items[a.id].hoursPerDay,
    }));
    return calculateSolarEstimate({ items: activeItems, autonomyDays, batteryChemistry }, pricing);
  }, [items, autonomyDays, batteryChemistry, pricing]);

  function toggleItem(id: string, enabled: boolean) {
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], enabled } }));
  }

  function updateItem(id: string, field: "watts" | "hoursPerDay", value: number) {
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], [field]: Math.max(0, value) } }));
  }

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
        })
      )
    : null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-heading text-lg font-bold text-foreground">What do you want to power?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tick what you want backed up, and adjust the wattage or hours per day if your appliance differs.
        </p>

        <div className="mt-5 divide-y divide-border">
          {APPLIANCES.map((appliance) => {
            const state = items[appliance.id];
            return (
              <div key={appliance.id} className="flex flex-wrap items-center gap-3 py-3">
                <label className="flex min-w-[220px] flex-1 items-center gap-2.5 text-sm font-medium text-foreground">
                  <Checkbox checked={state.enabled} onCheckedChange={(v) => toggleItem(appliance.id, !!v)} />
                  {appliance.label}
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
                    step={0.5}
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
              <option value={1}>1 day</option>
              <option value={2}>2 days</option>
              <option value={3}>3 days</option>
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

      <div className="sticky top-28 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-heading text-lg font-bold text-foreground">Your estimate</h2>

        {!estimate ? (
          <p className="mt-4 text-sm text-muted-foreground">Tick at least one appliance to see a sizing estimate.</p>
        ) : (
          <>
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
    </div>
  );
}
