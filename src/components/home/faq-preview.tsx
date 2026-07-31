import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqRecord } from "@/lib/store/catalog.store";

export function FaqPreview({ faqs }: { faqs: FaqRecord[] }) {
  if (faqs.length === 0) return null;
  const preview = faqs.slice(0, 6);

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-muted-foreground">Answers to what customers ask us most about solar and electrical work.</p>
        </div>

        <Accordion className="mt-10">
          {preview.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left font-heading text-base font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-center">
          <Link href="/faqs" className="inline-flex items-center gap-1.5 font-semibold text-primary">
            View all FAQs <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
