"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { BatteryModelAdminValues } from "@/lib/validation/admin";
import { createBatteryModelAction, updateBatteryModelAction } from "@/app/actions/admin/battery-models";
import type { BatteryModelRecord } from "@/lib/store/catalog.store";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function BatteryModelForm({ batteryModel }: { batteryModel?: BatteryModelRecord }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<BatteryModelAdminValues>({
    defaultValues: batteryModel
      ? {
          label: batteryModel.label,
          capacityKwh: batteryModel.capacityKwh,
          chemistry: batteryModel.chemistry,
          priceKsh: batteryModel.priceKsh,
          sortOrder: batteryModel.sortOrder,
        }
      : { label: "", capacityKwh: 2.56, chemistry: "lithium", priceKsh: 0, sortOrder: 0 },
  });

  async function onSubmit(values: BatteryModelAdminValues) {
    setIsSubmitting(true);
    const result = batteryModel
      ? await updateBatteryModelAction(batteryModel.id, values)
      : await createBatteryModelAction(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(batteryModel ? "Battery model updated." : "Battery model added.");
      router.push("/admin/battery-models");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <FormField label="Label" htmlFor="label">
        <Input id="label" placeholder="e.g. Vestwoods 200Ah LiFePO4" {...register("label")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Capacity (kWh)" htmlFor="capacityKwh">
          <Input id="capacityKwh" type="number" min={0.01} step={0.01} {...register("capacityKwh", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Chemistry" htmlFor="chemistry">
          <select id="chemistry" className={selectClassName} {...register("chemistry")}>
            <option value="lithium">Lithium (LiFePO4)</option>
            <option value="gel">Gel</option>
          </select>
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Price (KSh)" htmlFor="priceKsh">
          <Input id="priceKsh" type="number" min={0} step={50} {...register("priceKsh", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Sort Order" htmlFor="sortOrder">
          <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
        </FormField>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : batteryModel ? "Save Changes" : "Add Battery Model"}
      </Button>
    </form>
  );
}
