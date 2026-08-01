"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { HeroSlideAdminValues } from "@/lib/validation/admin";
import { createHeroSlideAction, updateHeroSlideAction } from "@/app/actions/admin/hero";
import type { HeroSlideRecord } from "@/lib/store/hero.store";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function HeroSlideForm({ slide }: { slide?: HeroSlideRecord }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<HeroSlideAdminValues>({
    defaultValues: slide
      ? { imagePath: slide.imagePath, title: slide.title, location: slide.location, alt: slide.alt, sortOrder: slide.sortOrder }
      : { imagePath: "", title: "", location: "", alt: "", sortOrder: 0 },
  });

  const imagePath = watch("imagePath");

  async function onSubmit(values: HeroSlideAdminValues) {
    setIsSubmitting(true);
    try {
      const result = slide ? await updateHeroSlideAction(slide.id, values) : await createHeroSlideAction(values);
      if (result.success) {
        toast.success(slide ? "Slide updated." : "Slide created.");
        router.push("/admin/hero/slides");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. The hero_slides table may not exist yet — see setup instructions.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <ImageUploadField label="Photo" value={imagePath ?? ""} onChange={(v) => setValue("imagePath", v)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Title (shown as the caption)" htmlFor="title">
          <Input id="title" {...register("title")} />
        </FormField>
        <FormField label="Location" htmlFor="location">
          <Input id="location" {...register("location")} />
        </FormField>
      </div>
      <FormField label="Alt Text (optional, defaults to title)" htmlFor="alt">
        <Input id="alt" {...register("alt")} />
      </FormField>
      <FormField label="Sort Order (lower shows first)" htmlFor="sortOrder">
        <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : slide ? "Save Changes" : "Add Slide"}
      </Button>
    </form>
  );
}
