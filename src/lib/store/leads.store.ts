import { insertOne } from "@/lib/supabase/db-helpers";
import type { ContactFormValues, QuoteFormValues } from "@/lib/validation/forms";

interface WithMeta {
  id: string;
  createdAt: string;
}

export type ContactMessageRecord = ContactFormValues & WithMeta;
export type QuoteRequestRecord = QuoteFormValues & WithMeta;
export type NewsletterSubscriberRecord = { email: string } & WithMeta;

interface ContactMessageRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface QuoteRequestRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service_category: string;
  product_interest: string | null;
  county: string;
  message: string | null;
}

interface NewsletterSubscriberRow {
  id: string;
  created_at: string;
  email: string;
}

const mapContactMessage = (row: ContactMessageRow): ContactMessageRecord => ({
  id: row.id,
  createdAt: row.created_at,
  name: row.name,
  email: row.email,
  phone: row.phone,
  subject: row.subject,
  message: row.message,
});

const mapQuoteRequest = (row: QuoteRequestRow): QuoteRequestRecord => ({
  id: row.id,
  createdAt: row.created_at,
  name: row.name,
  email: row.email,
  phone: row.phone,
  company: row.company ?? "",
  serviceCategory: row.service_category,
  productInterest: row.product_interest ?? "",
  county: row.county,
  message: row.message ?? "",
});

const mapNewsletterSubscriber = (row: NewsletterSubscriberRow): NewsletterSubscriberRecord => ({
  id: row.id,
  createdAt: row.created_at,
  email: row.email,
});

export const leadsStore = {
  addContactMessage(values: ContactFormValues) {
    return insertOne("contact_messages", values, mapContactMessage);
  },
  addQuoteRequest(values: QuoteFormValues) {
    return insertOne(
      "quote_requests",
      {
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company,
        service_category: values.serviceCategory,
        product_interest: values.productInterest,
        county: values.county,
        message: values.message,
      },
      mapQuoteRequest
    );
  },
  addNewsletterSubscriber(email: string) {
    return insertOne("newsletter_subscribers", { email }, mapNewsletterSubscriber);
  },
};
