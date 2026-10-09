import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { SolarCalculator } from "@/components/solar-calculator/solar-calculator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSolarCalculatorSettings } from "@/lib/data/solar-calculator";
import { faqSchema } from "@/lib/seo/schema";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Solar Cost Estimate Calculator",
  description:
    "Work out the cost of a solar backup system in Kenya before you buy. Tick what you want to power and get a panel, battery and inverter sizing with an estimated cost.",
  alternates: { canonical: "/solar-cost-estimate" },
};

const faqs = [
  {
    question: "Is this a final price?",
    answer:
      "No. It's a materials estimate built from typical unit rates, not a quote — installation, delivery and site-specific extras aren't included. Send your result to us on WhatsApp and we'll confirm the sizing and give you an accurate, installed price.",
  },
  {
    question: "How is the system sized?",
    answer:
      "From the appliances you tick and their hours per day, we work out your daily energy need in watt-hours. The battery is sized to cover that need for your chosen number of backup days, the panel array is sized to recharge it within Kenya's average sun hours, and the inverter is sized to handle everything running at once, with headroom for motor starting surges.",
  },
  {
    question: "Lithium or gel battery — what's the difference?",
    answer:
      "Lithium (LiFePO4) batteries last far more charge cycles and let you use about 90% of their rated capacity, so they take up less space for the same usable power. Gel batteries cost less upfront but only around 50% of their capacity is usable, so you need a bigger bank for the same backup.",
  },
  {
    question: "What if my appliance isn't listed, or uses different power?",
    answer:
      "Tick the closest match and edit its wattage and hours per day — the estimate updates as you type.",
  },
  {
    question: "Do you deliver and install?",
    answer: "Yes. Send us your estimate on WhatsApp and we'll arrange sizing confirmation, delivery and installation.",
  },
];

export default async function SolarCostEstimatePage() {
  const pricing = await getSolarCalculatorSettings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={faqSchema(faqs)} />
      <Breadcrumbs items={[{ name: "Solar Cost Estimate", url: "/solar-cost-estimate" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Solar Cost Estimate Calculator</h1>
        <p className="mt-4 text-muted-foreground">
          Tick what you want to power and for how long, and get a panel, battery and inverter sizing with an estimated
          cost — then send it to us on WhatsApp for an accurate, installed quote.
        </p>
      </div>

      <div className="mt-10">
        <SolarCalculator pricing={pricing} />
      </div>

      <div className="mt-20 max-w-3xl">
        <h2 className="font-heading text-2xl font-extrabold text-foreground">Solar cost estimate questions</h2>
        <Accordion className="mt-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left font-heading text-base font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
