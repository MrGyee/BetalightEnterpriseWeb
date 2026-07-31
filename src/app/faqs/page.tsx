import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getFaqs } from "@/lib/data/catalog";
import { faqSchema } from "@/lib/seo/schema";
import type { FaqRecord } from "@/lib/store/catalog.store";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about solar installation, electrical work, warranties, maintenance and safety standards.",
  alternates: { canonical: "/faqs" },
};

export default async function FaqsPage() {
  const faqs = await getFaqs().catch(() => []);
  const grouped: Record<string, FaqRecord[]> = {};
  for (const faq of faqs) {
    (grouped[faq.category] ??= []).push(faq);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs)} />}
      <Breadcrumbs items={[{ name: "FAQs", url: "/faqs" }]} />

      <div className="mt-6">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-muted-foreground">Answers to what customers ask us most about solar and electrical work.</p>
      </div>

      {faqs.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">FAQs are being added. Contact us directly with any questions.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mt-10">
            <h2 className="font-heading text-lg font-bold text-foreground">{category}</h2>
            <Accordion className="mt-3">
              {items.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="text-left font-heading text-base font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))
      )}
    </div>
  );
}
