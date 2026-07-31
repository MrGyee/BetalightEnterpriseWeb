import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCatalog } from "@/components/products/product-catalog";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getProducts } from "@/lib/data/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Electrical & Solar Products",
  description:
    "Browse genuine electrical products, solar energy systems, power control equipment, lighting and backup power solutions available in Kenya.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Products", url: "/products" }]} />
      <div className="mt-4 max-w-2xl">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Products</h1>
        <p className="mt-3 text-muted-foreground">
          Genuine electrical products, solar equipment and power control gear, in stock and ready to install.
        </p>
      </div>
      <div className="mt-8">
        <Suspense>
          <ProductCatalog products={products} />
        </Suspense>
      </div>
    </div>
  );
}
