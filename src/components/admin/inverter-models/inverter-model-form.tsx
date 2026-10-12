"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { InverterModelAdminValues } from "@/lib/validation/admin";
import { createInverterModelAction, updateInverterModelAction } from "@/app/actions/admin/inverter-models";
import type { InverterModelRecord } from "@/lib/store/catalog.store";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function InverterModelForm({ inverterModel }: { inverterModel?: InverterModelRecord }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<InverterModelAdminValues>({
    defaultValues: inverterModel
      ? { label: inverterModel.label, kva: inverterModel.kva, priceKsh: inverterModel.priceKsh, sortOrder: inverterModel.sortOrder }
      : { label: "", kva: 5, priceKsh: 0, sortOrder: 0 },
  });

  async function onSubmit(values: InverterModelAdminValues) {
    setIsSubmitting(true);
    const result = inverterModel
      ? await updateInverterModelAction(inverterModel.id, values)
      : await createInverterModelAction(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(inverterModel ? "Inverter model updated." : "Inverter model added.");
      router.push("/admin/inverter-models");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <FormField label="Label" htmlFor="label">
        <Input id="label" placeholder="e.g. Deye 5kVA Hybrid Inverter" {...register("label")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Capacity (kVA)" htmlFor="kva">
          <Input id="kva" type="number" min={0.1} step={0.5} {...register("kva", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Price (KSh)" htmlFor="priceKsh">
          <Input id="priceKsh" type="number" min={0} step={50} {...register("priceKsh", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Sort Order" htmlFor="sortOrder">
          <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
        </FormField>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : inverterModel ? "Save Changes" : "Add Inverter Model"}
      </Button>
    </form>
  );
}
