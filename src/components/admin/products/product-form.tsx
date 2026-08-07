"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ProductAdminValues } from "@/lib/validation/admin";
import { createProductAction, updateProductAction } from "@/app/actions/admin/products";
import type { ProductRecord } from "@/lib/store/catalog.store";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { productCategories } from "@/lib/nav";

export function ProductForm({ product }: { product?: ProductRecord }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<ProductAdminValues>({
    defaultValues: product
      ? {
          slug: product.slug,
          name: product.name,
          category: product.category,
          brand: product.brand ?? "",
          shortDescription: product.shortDescription,
          description: product.description,
          imagePath: product.imagePath,
          specsJson: JSON.stringify(product.specs, null, 2),
          featured: product.featured,
        }
      : {
          slug: "",
          name: "",
          category: "",
          brand: "",
          shortDescription: "",
          description: "",
          imagePath: "",
          specsJson: "{}",
          featured: false,
        },
  });

  const imagePath = watch("imagePath");
  const featured = watch("featured");
  const category = watch("category");

  async function onSubmit(values: ProductAdminValues) {
    setIsSubmitting(true);
    const result = product ? await updateProductAction(product.slug, values) : await createProductAction(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(product ? "Product updated." : "Product created.");
      router.push("/admin/products");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name">
          <Input id="name" {...register("name")} />
        </FormField>
        <FormField label="Slug" htmlFor="slug">
          <Input id="slug" {...register("slug")} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category">
          <Select value={category || undefined} onValueChange={(v) => setValue("category", v as string)}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Brand (optional)" htmlFor="brand">
          <Input id="brand" {...register("brand")} />
        </FormField>
      </div>
      <FormField label="Short Description" htmlFor="shortDescription">
        <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
      </FormField>
      <FormField label="Full Description" htmlFor="description">
        <Textarea id="description" rows={5} {...register("description")} />
      </FormField>
      <ImageUploadField label="Image" value={imagePath} onChange={(v) => setValue("imagePath", v)} />
      <FormField label="Specs (JSON key/value pairs)" htmlFor="specsJson">
        <Textarea id="specsJson" rows={6} className="font-mono text-xs" {...register("specsJson")} />
      </FormField>
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Checkbox checked={featured} onCheckedChange={(v) => setValue("featured", !!v)} />
        Featured on homepage
      </label>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : product ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
