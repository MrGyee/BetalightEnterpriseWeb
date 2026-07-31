"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { FaqAdminValues } from "@/lib/validation/admin";
import { createFaqAction, updateFaqAction } from "@/app/actions/admin/faqs";
import type { FaqRecord } from "@/lib/store/catalog.store";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function FaqForm({ faq }: { faq?: FaqRecord }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<FaqAdminValues>({
    defaultValues: faq
      ? { question: faq.question, answer: faq.answer, category: faq.category, sortOrder: faq.sortOrder }
      : { question: "", answer: "", category: "", sortOrder: 0 },
  });

  async function onSubmit(values: FaqAdminValues) {
    setIsSubmitting(true);
    const result = faq ? await updateFaqAction(faq.id, values) : await createFaqAction(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(faq ? "FAQ updated." : "FAQ created.");
      router.push("/admin/faqs");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <FormField label="Question" htmlFor="question">
        <Input id="question" {...register("question")} />
      </FormField>
      <FormField label="Answer" htmlFor="answer">
        <Textarea id="answer" rows={4} {...register("answer")} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category">
          <Input id="category" {...register("category")} />
        </FormField>
        <FormField label="Sort Order" htmlFor="sortOrder">
          <Input id="sortOrder" type="number" {...register("sortOrder", { valueAsNumber: true })} />
        </FormField>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : faq ? "Save Changes" : "Create FAQ"}
      </Button>
    </form>
  );
}
