import { Star, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { TestimonialRecord } from "@/lib/store/catalog.store";

export function Testimonials({ testimonials }: { testimonials: TestimonialRecord[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Customer Testimonials</h2>
          <p className="mt-3 text-muted-foreground">What homeowners, contractors and businesses say about working with us.</p>
        </div>

        <Carousel className="mt-12" opts={{ loop: true }}>
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.authorName} className="sm:basis-1/2 lg:basis-1/3">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <Quote className="size-6 text-primary/40" />
                  <div className="mt-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-4 ${i < t.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                      {t.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.authorName}</p>
                      <p className="text-xs text-muted-foreground">{t.roleOrCompany}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="static ml-0 mr-3 mt-6 translate-y-0" />
          <CarouselNext className="static ml-3 mt-6 translate-y-0" />
        </Carousel>
      </div>
    </section>
  );
}
