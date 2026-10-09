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

export function SolarCalculatorSettingsForm({ defaultValues }: { defaultValues: SolarCalculatorAdminValues }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<SolarCalculatorAdminValues>({ defaultValues });

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

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
