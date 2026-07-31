import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import type { ProductRecord } from "@/lib/store/catalog.store";

export function FeaturedProducts({ products }: { products: ProductRecord[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Featured Products</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              A selection of the genuine, in-stock products our customers ask for most.
            </p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-1.5 font-semibold text-primary">
            View all products <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
