import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { JsonLd } from "@/components/shared/json-ld";
import { buttonVariants } from "@/components/ui/button";
import { getProductBySlug, getProducts } from "@/lib/data/catalog";
import { productSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.imagePath }],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const allProducts = await getProducts().catch(() => []);
  const related = allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={productSchema(product)} />
      <Breadcrumbs items={[{ name: "Products", url: "/products" }, { name: product.name, url: `/products/${product.slug}` }]} />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <Image src={product.imagePath} alt={product.name} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" priority />
        </div>

        <div>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {product.category}
          </span>
          {product.brand && <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{product.brand}</p>}
          <h1 className="mt-1 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-base text-muted-foreground">{product.description}</p>

          {Object.keys(product.specs).length > 0 && (
            <dl className="mt-6 divide-y divide-border rounded-xl border border-border">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="text-right font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/quote?product=${product.slug}`} className={cn(buttonVariants({ size: "lg" }), "flex-1 rounded-full")}>
              Request a Quote
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "flex-1 rounded-full")}>
              Ask a Question
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-extrabold text-foreground">Related Products</h2>
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
