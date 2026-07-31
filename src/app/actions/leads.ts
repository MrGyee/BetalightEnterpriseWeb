"use server";

import { contactFormSchema, quoteFormSchema, newsletterSchema } from "@/lib/validation/forms";
import { saveContactMessage, saveQuoteRequest, saveNewsletterSubscriber } from "@/lib/data/leads";

export type ActionResult = { success: true } | { success: false; error: string };

export async function submitContactMessage(raw: Record<string, string>): Promise<ActionResult> {
  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await saveContactMessage(parsed.data);
  return { success: true };
}

export async function submitQuoteRequest(raw: Record<string, string>): Promise<ActionResult> {
  const parsed = quoteFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await saveQuoteRequest(parsed.data);
  return { success: true };
}

export async function submitNewsletterSignup(raw: Record<string, string>): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await saveNewsletterSubscriber(parsed.data.email);
  return { success: true };
}
