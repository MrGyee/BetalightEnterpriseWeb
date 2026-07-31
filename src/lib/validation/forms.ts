import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  subject: z.string().min(3, "Please enter a subject."),
  message: z.string().min(10, "Please enter a message of at least 10 characters."),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const quoteFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  company: z.string().optional().or(z.literal("")),
  serviceCategory: z.string().min(2, "Please select what you need a quote for."),
  productInterest: z.string().optional().or(z.literal("")),
  county: z.string().min(2, "Please select your county."),
  message: z.string().optional().or(z.literal("")),
});
export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
export type NewsletterValues = z.infer<typeof newsletterSchema>;
