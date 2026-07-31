const brands = ["Tronic", "Vestwoods", "SRNE", "Seven Stars", "ALLTOP Electronics", "ATTA", "Lutan Pump", "EAE", "Eastman", "MODI"];

export function BrandsCarousel() {
  const doubled = [...brands, ...brands];

  return (
    <section className="border-y border-border bg-card py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Brands We Sell &amp; Install
        </p>
        <div className="group relative mt-6 overflow-hidden">
          <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-14 group-hover:[animation-play-state:paused]">
            {doubled.map((brand, i) => (
              <span key={`${brand}-${i}`} className="shrink-0 font-heading text-xl font-bold text-muted-foreground/70">
                {brand}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent" />
        </div>
      </div>
    </section>
  );
}
