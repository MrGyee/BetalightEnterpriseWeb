"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { SolarCalculatorAdminValues } from "@/lib/validation/admin";
import { updateSolarCalculatorAction } from "@/app/actions/admin/solar-calculator";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function SolarCalculatorSettingsForm({ defaultValues }: { defaultValues: SolarCalculatorAdminValues }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<SolarCalculatorAdminValues>({ defaultValues });
  const labourEnabled = watch("labourEnabled");
  const labourMode = watch("labourMode");

  async function onSubmit(values: SolarCalculatorAdminValues) {
    setIsSubmitting(true);
    try {
      const result = await updateSolarCalculatorAction(values);
      if (result.success) {
        toast.success("Solar calculator pricing updated.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. The solar_calculator_settings table may not exist yet — see setup instructions.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 pb-16 lg:max-w-2xl">
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
        These start as placeholder figures, not researched market prices. Update every field below with your real
        supplier costs and margins before sharing the calculator link with customers.
      </div>

      <section className="grid gap-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Component Pricing</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Solar panel — KSh per watt (Wp)" htmlFor="panelPricePerWatt">
            <Input id="panelPricePerWatt" type="number" min={0} step={0.5} {...register("panelPricePerWatt", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Hybrid inverter — KSh per kVA" htmlFor="inverterPricePerKva">
            <Input
              id="inverterPricePerKva"
              type="number"
              min={0}
              step={100}
              {...register("inverterPricePerKva", { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Lithium (LiFePO4) battery — KSh per kWh" htmlFor="lithiumPricePerKwh">
            <Input
              id="lithiumPricePerKwh"
              type="number"
              min={0}
              step={100}
              {...register("lithiumPricePerKwh", { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Gel battery — KSh per kWh" htmlFor="gelPricePerKwh">
            <Input id="gelPricePerKwh" type="number" min={0} step={100} {...register("gelPricePerKwh", { valueAsNumber: true })} />
          </FormField>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Balance of System &amp; Tax</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Balance of system (mounting, cabling, breakers, earthing) — %"
            htmlFor="bosPercent"
          >
            <Input id="bosPercent" type="number" min={0} max={100} step={0.5} {...register("bosPercent", { valueAsNumber: true })} />
          </FormField>
          <FormField label="VAT — %" htmlFor="vatPercent">
            <Input id="vatPercent" type="number" min={0} max={100} step={0.5} {...register("vatPercent", { valueAsNumber: true })} />
          </FormField>
        </div>
        <p className="text-xs text-muted-foreground">
          Both are applied as a percentage of the panel + battery + inverter subtotal, matching how the public
          calculator at /solar-cost-estimate builds its estimate.
        </p>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Usage-Based Estimate</h2>
        <FormField
          label="Blended grid electricity rate — KSh per kWh"
          htmlFor="gridTariffPerKwh"
        >
          <Input
            id="gridTariffPerKwh"
            type="number"
            min={0.01}
            step={0.5}
            {...register("gridTariffPerKwh", { valueAsNumber: true })}
          />
        </FormField>
        <p className="text-xs text-muted-foreground">
          Used only when a visitor enters their monthly KPLC bill instead of ticking appliances — converts the bill
          to daily kWh. KPLC&apos;s real tariff is tiered, so this is a single blended rate, not an exact match to
          any one customer&apos;s bill.
        </p>
      </section>

      <section className="grid gap-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Labour &amp; Installation</h2>
        <label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <Checkbox checked={labourEnabled} onCheckedChange={(v) => setValue("labourEnabled", !!v)} />
          Add labour/installation to the Full Estimate
        </label>
        <p className="text-xs text-muted-foreground">
          Off by default — the public calculator says &quot;materials only, installation excluded&quot; until this is
          turned on. Doesn&apos;t affect the Quick Tools, which price individual components only.
        </p>

        {labourEnabled && (
          <>
            <FormField label="How should it be calculated?" htmlFor="labourMode">
              <select id="labourMode" className={selectClassName} {...register("labourMode")}>
                <option value="percent">Percentage of materials</option>
                <option value="fixed">Fixed amount</option>
              </select>
            </FormField>

            {labourMode === "percent" ? (
              <FormField label="Labour — % of materials + balance of system" htmlFor="labourPercent">
                <Input
                  id="labourPercent"
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  {...register("labourPercent", { valueAsNumber: true })}
                />
              </FormField>
            ) : (
              <FormField label="Labour — fixed amount (KSh)" htmlFor="labourFixedKsh">
                <Input id="labourFixedKsh" type="number" min={0} step={500} {...register("labourFixedKsh", { valueAsNumber: true })} />
              </FormField>
            )}
          </>
        )}
      </section>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
