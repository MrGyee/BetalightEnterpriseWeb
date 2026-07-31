import { AdminListHeader } from "@/components/admin/admin-list-header";
import { ProductForm } from "@/components/admin/products/product-form";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <AdminListHeader title="Add Product" description="Add a new product to the catalogue." />
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
