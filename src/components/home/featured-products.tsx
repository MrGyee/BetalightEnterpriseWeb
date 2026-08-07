"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedProductCard } from "@/components/home/featured-product-card";
import { cn } from "@/lib/utils";
import type { ProductRecord } from "@/lib/store/catalog.store";

export function FeaturedProducts({ products }: { products: ProductRecord[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category.trim()))).sort();
    return ["All", ...unique];
  }, [products]);

  const filtered = useMemo(
    () => (activeCategory === "All" ? products : products.filter((p) => p.category.trim() === activeCategory)),
    [products, activeCategory]
  );

  if (products.length === 0) return null;

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

        <div
          key={activeCategory}
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        >
          {filtered.map((product, i) => (
            <FeaturedProductCard key={product.slug} product={product} delay={(i % 4) * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
