"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema, type NewsletterValues } from "@/lib/validation/forms";
import { submitNewsletterSignup } from "@/app/actions/leads";

export function NewsletterForm() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(values: NewsletterValues) {
    const result = await submitNewsletterSignup(values);
    if (result.success) {
      setSuccess(true);
      reset();
    } else {
      toast.error(result.error);
    }
  }

  if (success) {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-sm text-green">
        <Check className="size-4" /> You&apos;re subscribed. Thank you!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex gap-2">
      <Input type="email" placeholder="you@example.com" aria-label="Email address" {...register("email")} />
      <Button type="submit" disabled={isSubmitting} className="shrink-0">
        {isSubmitting ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}
