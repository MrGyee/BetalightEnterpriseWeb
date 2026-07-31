"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { TestimonialAdminValues } from "@/lib/validation/admin";
import { createTestimonialAction, updateTestimonialAction } from "@/app/actions/admin/testimonials";
import type { TestimonialRecord } from "@/lib/store/catalog.store";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function TestimonialForm({ testimonial }: { testimonial?: TestimonialRecord }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<TestimonialAdminValues>({
    defaultValues: testimonial
      ? {
          authorName: testimonial.authorName,
          roleOrCompany: testimonial.roleOrCompany,
          quote: testimonial.quote,
          rating: testimonial.rating,
          photoPath: testimonial.photoPath ?? "",
        }
      : { authorName: "", roleOrCompany: "", quote: "", rating: 5, photoPath: "" },
  });

  const photoPath = watch("photoPath");

  async function onSubmit(values: TestimonialAdminValues) {
    setIsSubmitting(true);
    const result = testimonial ? await updateTestimonialAction(testimonial.id, values) : await createTestimonialAction(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(testimonial ? "Testimonial updated." : "Testimonial created.");
      router.push("/admin/testimonials");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="authorName">
          <Input id="authorName" {...register("authorName")} />
        </FormField>
        <FormField label="Role / Company" htmlFor="roleOrCompany">
          <Input id="roleOrCompany" {...register("roleOrCompany")} />
        </FormField>
      </div>
      <FormField label="Quote" htmlFor="quote">
        <Textarea id="quote" rows={4} {...register("quote")} />
      </FormField>
      <FormField label="Rating (1-5)" htmlFor="rating">
        <Input id="rating" type="number" min={1} max={5} {...register("rating", { valueAsNumber: true })} />
      </FormField>
      <ImageUploadField label="Photo (optional)" value={photoPath ?? ""} onChange={(v) => setValue("photoPath", v)} />
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : testimonial ? "Save Changes" : "Create Testimonial"}
      </Button>
    </form>
  );
}
