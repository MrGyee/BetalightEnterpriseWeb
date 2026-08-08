"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { FeaturedProductCard } from "@/components/home/featured-product-card";
import { cn } from "@/lib/utils";
import type { ProductRecord } from "@/lib/store/catalog.store";

export function FeaturedProducts({ products }: { products: ProductRecord[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category.trim()))).sort();
    return ["All", ...unique];
  }, [products]);

  const filtered = useMemo(
    () => (activeCategory === "All" ? products : products.filter((p) => p.category.trim() === activeCategory)),
    [products, activeCategory]
  );

  // Scroll fires far more often than once a frame during a momentum swipe, and
  // each run reads layout (scrollLeft/offsetLeft), so coalesce to one read per
  // frame and hoist the reads out of the loop.
  const frameRef = useRef<number | null>(null);
  const syncScrollState = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const el = scrollRef.current;
      if (!el) return;

      // Above the lg breakpoint the track is a grid, not a scroller — nothing to sync.
      const scrollLeft = el.scrollLeft;
      const scrollable = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollable > 8 && scrollLeft < scrollable - 8);

      let nearest = 0;
      let shortestDistance = Infinity;
      const cards = el.children;
      for (let index = 0; index < cards.length; index++) {
        const distance = Math.abs((cards[index] as HTMLElement).offsetLeft - scrollLeft);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearest = index;
        }
      }
      setActiveIndex(nearest);
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIndex(0);
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);

    // The first sync runs before card images have loaded, when the track is
    // still narrower than its final width — without this the arrows and edge
    // fades stay hidden until the user happens to scroll or resize.
    const observer = new ResizeObserver(syncScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
      observer.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [syncScrollState, activeCategory, filtered.length]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    const target = el?.children[index] as HTMLElement | undefined;
    if (!el || !target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, []);

  if (products.length === 0) return null;

  const showCarouselControls = filtered.length > 1;

  return (
    <section className="bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Featured Products</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Browse our most popular electrical, solar and plumbing products from trusted global brands.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View All Products <ArrowRight className="size-4" />
          </Link>
        </div>

        {categories.length > 2 && (
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  activeCategory === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="relative mt-8">
          {/* Edge fades hinting at more content — carousel only, and only on the side that can still scroll */}
          {showCarouselControls && canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-secondary/80 to-transparent lg:hidden" />
          )}
          {showCarouselControls && canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-secondary/80 to-transparent lg:hidden" />
          )}

          {showCarouselControls && canScrollLeft && (
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
              className="absolute left-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg transition-transform hover:scale-105 lg:hidden"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          {showCarouselControls && canScrollRight && (
            <button
              type="button"
              aria-label="Next products"
              onClick={() => scrollToIndex(Math.min(activeIndex + 1, filtered.length - 1))}
              className="absolute right-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg transition-transform hover:scale-105 lg:hidden"
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            key={activeCategory}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {filtered.map((product, i) => (
              <FeaturedProductCard key={product.slug} product={product} delay={(i % 4) * 0.08} />
            ))}
          </div>
        </div>

        {showCarouselControls && (
          <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
            {filtered.map((product, i) => (
              <button
                key={product.slug}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to product ${i + 1} of ${filtered.length}`}
                aria-current={i === activeIndex ? "true" : undefined}
                className="flex h-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <motion.span
                  animate={{ width: i === activeIndex ? 24 : 8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={cn(
                    "block h-2 rounded-full",
                    i === activeIndex ? "bg-primary" : "bg-[#D1D5DB] dark:bg-muted-foreground/40"
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
