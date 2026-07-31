"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/validation/forms";
import { submitQuoteRequest } from "@/app/actions/leads";
import { FormField } from "@/components/shared/form-field";
import { FormSuccess } from "@/components/shared/form-success";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { productCategories } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { useSiteSettings } from "@/components/shared/site-settings-provider";

const selectClassName =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function QuoteForm() {
  const settings = useSiteSettings();
  const searchParams = useSearchParams();
  const productPrefill = searchParams.get("product") ?? "";
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({ resolver: zodResolver(quoteFormSchema) });

  useEffect(() => {
    if (productPrefill) setValue("productInterest", productPrefill);
  }, [productPrefill, setValue]);

  async function onSubmit(values: QuoteFormValues) {
    const result = await submitQuoteRequest(values);
    if (result.success) {
      setSuccess(true);
    } else {
      toast.error(result.error);
    }
  }

  if (success) {
    return (
      <FormSuccess
        heading="Quote request received!"
        whatsappMessage={`Hello ${siteConfig.name}, I just submitted a quote request through your website and would like to follow up.`}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" htmlFor="quote-name" error={errors.name?.message}>
          <Input id="quote-name" {...register("name")} />
        </FormField>
        <FormField label="Phone Number" htmlFor="quote-phone" error={errors.phone?.message}>
          <Input id="quote-phone" {...register("phone")} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Email Address" htmlFor="quote-email" error={errors.email?.message}>
          <Input id="quote-email" type="email" {...register("email")} />
        </FormField>
        <FormField label="Company (optional)" htmlFor="quote-company" error={errors.company?.message}>
          <Input id="quote-company" {...register("company")} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="What do you need a quote for?" htmlFor="quote-category" error={errors.serviceCategory?.message}>
          <select id="quote-category" className={selectClassName} defaultValue="" {...register("serviceCategory")}>
            <option value="" disabled>
              Select a category
            </option>
            {productCategories.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.name}
              </option>
            ))}
            <option value="Electrical Installation">Electrical Installation</option>
            <option value="Other">Other</option>
          </select>
        </FormField>
        <FormField label="County" htmlFor="quote-county" error={errors.county?.message}>
          <select id="quote-county" className={selectClassName} defaultValue="" {...register("county")}>
            <option value="" disabled>
              Select your county
            </option>
            {settings.serviceAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </FormField>
      </div>
      <FormField label="Specific Product (optional)" htmlFor="quote-product" error={errors.productInterest?.message}>
        <Input id="quote-product" placeholder="e.g. Vestwoods Power Station" {...register("productInterest")} />
      </FormField>
      <FormField label="Additional Details (optional)" htmlFor="quote-message" error={errors.message?.message}>
        <Textarea id="quote-message" rows={4} {...register("message")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 rounded-full">
        {isSubmitting ? "Submitting..." : "Request Quotation"}
      </Button>
    </form>
  );
}
