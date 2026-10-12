"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { PanelModelAdminValues } from "@/lib/validation/admin";
import { createPanelModelAction, updatePanelModelAction } from "@/app/actions/admin/panel-models";
import type { PanelModelRecord } from "@/lib/store/catalog.store";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PanelModelForm({ panelModel }: { panelModel?: PanelModelRecord }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<PanelModelAdminValues>({
    defaultValues: panelModel
      ? { label: panelModel.label, watts: panelModel.watts, priceKsh: panelModel.priceKsh, sortOrder: panelModel.sortOrder }
      : { label: "", watts: 450, priceKsh: 0, sortOrder: 0 },
  });

  async function onSubmit(values: PanelModelAdminValues) {
    setIsSubmitting(true);
    const result = panelModel
      ? await updatePanelModelAction(panelModel.id, values)
      : await createPanelModelAction(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(panelModel ? "Panel model updated." : "Panel model added.");
      router.push("/admin/panel-models");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <FormField label="Label" htmlFor="label">
        <Input id="label" placeholder="e.g. JINKO 450W Bifacial" {...register("label")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Watts" htmlFor="watts">
          <Input id="watts" type="number" min={1} {...register("watts", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Price (KSh)" htmlFor="priceKsh">
          <Input id="priceKsh" type="number" min={0} step={50} {...register("priceKsh", { valueAsNumber: true })} />
        </FormField>
        <FormField label="Sort Order" htmlFor="sortOrder">
          <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
        </FormField>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : panelModel ? "Save Changes" : "Add Panel Model"}
      </Button>
    </form>
  );
}
