import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { ProductForm } from "@/components/admin/products/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${product.name}`} description="Update this product." />
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
