"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { productAdminSchema, type ProductAdminValues } from "@/lib/validation/admin";
import { createProduct, updateProduct, deleteProduct, getProductBySlug } from "@/lib/data/catalog";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateProductPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);
}

export async function createProductAction(values: ProductAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (await getProductBySlug(parsed.data.slug)) {
    return { success: false, error: "A product with this slug already exists." };
  }
  await createProduct({
    slug: parsed.data.slug,
    name: parsed.data.name,
    category: parsed.data.category,
    brand: parsed.data.brand || null,
    shortDescription: parsed.data.shortDescription,
    description: parsed.data.description,
    imagePath: parsed.data.imagePath,
    specs: JSON.parse(parsed.data.specsJson || "{}"),
    featured: parsed.data.featured,
  });
  revalidateProductPaths(parsed.data.slug);
  return { success: true };
}

export async function updateProductAction(slug: string, values: ProductAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await getProductBySlug(slug))) {
    return { success: false, error: "Product not found." };
  }
  await updateProduct(slug, {
    slug: parsed.data.slug,
    name: parsed.data.name,
    category: parsed.data.category,
    brand: parsed.data.brand || null,
    shortDescription: parsed.data.shortDescription,
    description: parsed.data.description,
    imagePath: parsed.data.imagePath,
    specs: JSON.parse(parsed.data.specsJson || "{}"),
    featured: parsed.data.featured,
  });
  revalidateProductPaths(slug);
  revalidateProductPaths(parsed.data.slug);
  return { success: true };
}

export async function deleteProductAction(slug: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await getProductBySlug(slug))) {
    return { success: false, error: "Product not found." };
  }
  await deleteProduct(slug);
  revalidateProductPaths(slug);
  return { success: true };
}
