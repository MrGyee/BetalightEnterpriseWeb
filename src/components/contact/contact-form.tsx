"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/forms";
import { submitContactMessage } from "@/app/actions/leads";
import { FormField } from "@/components/shared/form-field";
import { FormSuccess } from "@/components/shared/form-success";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(values: ContactFormValues) {
    const result = await submitContactMessage(values);
    if (result.success) {
      setSuccess(true);
    } else {
      toast.error(result.error);
    }
  }

  if (success) {
    return (
      <FormSuccess whatsappMessage="Hello Betalight Enterprises Ltd, I just sent a message through your website contact form and would like to follow up." />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" htmlFor="contact-name" error={errors.name?.message}>
          <Input id="contact-name" {...register("name")} />
        </FormField>
        <FormField label="Phone Number" htmlFor="contact-phone" error={errors.phone?.message}>
          <Input id="contact-phone" {...register("phone")} />
        </FormField>
      </div>
      <FormField label="Email Address" htmlFor="contact-email" error={errors.email?.message}>
        <Input id="contact-email" type="email" {...register("email")} />
      </FormField>
      <FormField label="Subject" htmlFor="contact-subject" error={errors.subject?.message}>
        <Input id="contact-subject" {...register("subject")} />
      </FormField>
      <FormField label="Message" htmlFor="contact-message" error={errors.message?.message}>
        <Textarea id="contact-message" rows={5} {...register("message")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 rounded-full">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
