import "server-only";
import { leadsStore } from "@/lib/store/leads.store";
import type { ContactFormValues, QuoteFormValues } from "@/lib/validation/forms";

export function saveContactMessage(values: ContactFormValues) {
  return leadsStore.addContactMessage(values);
}

export function saveQuoteRequest(values: QuoteFormValues) {
  return leadsStore.addQuoteRequest(values);
}

export function saveNewsletterSubscriber(email: string) {
  return leadsStore.addNewsletterSubscriber(email);
}
