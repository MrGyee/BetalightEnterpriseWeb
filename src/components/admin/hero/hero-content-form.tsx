"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { HeroContentAdminValues } from "@/lib/validation/admin";
import { updateHeroContentAction } from "@/app/actions/admin/hero";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function HeroContentForm({ defaultValues }: { defaultValues: HeroContentAdminValues }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<HeroContentAdminValues>({ defaultValues });

  async function onSubmit(values: HeroContentAdminValues) {
    setIsSubmitting(true);
    try {
      const result = await updateHeroContentAction(values);
      if (result.success) {
        toast.success("Hero content updated.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. The hero_content table may not exist yet — see setup instructions.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <FormField label="Badge Text (small pill above the headline)" htmlFor="badgeText">
        <Input id="badgeText" {...register("badgeText")} />
      </FormField>
      <FormField label="Headline" htmlFor="headline">
        <Textarea id="headline" rows={2} {...register("headline")} />
      </FormField>
      <FormField label="Subheadline" htmlFor="subheadline">
        <Textarea id="subheadline" rows={3} {...register("subheadline")} />
      </FormField>
      <FormField label="Trust Points (comma-separated)" htmlFor="trustPointsText">
        <Textarea id="trustPointsText" rows={2} {...register("trustPointsText")} />
      </FormField>
      <FormField label="Stats (one per line, as: Label | Value | Suffix)" htmlFor="statsText">
        <Textarea id="statsText" rows={4} placeholder="Projects Completed | 150 | +" {...register("statsText")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
