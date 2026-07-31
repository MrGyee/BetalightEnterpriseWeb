"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { BlogPostAdminValues } from "@/lib/validation/admin";
import { createBlogPostAction, updateBlogPostAction } from "@/app/actions/admin/blog";
import type { BlogPostRecord } from "@/lib/store/catalog.store";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageField } from "@/components/admin/image-field";

function toDatetimeLocal(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function BlogForm({ post }: { post?: BlogPostRecord }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<BlogPostAdminValues>({
    defaultValues: post
      ? {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImagePath: post.coverImagePath ?? "",
          category: post.category,
          seoDescription: post.seoDescription,
          publishedAt: toDatetimeLocal(post.publishedAt),
        }
      : {
          slug: "",
          title: "",
          excerpt: "",
          content: "",
          coverImagePath: "",
          category: "",
          seoDescription: "",
          publishedAt: toDatetimeLocal(new Date().toISOString()),
        },
  });

  const coverImagePath = watch("coverImagePath");

  async function onSubmit(values: BlogPostAdminValues) {
    setIsSubmitting(true);
    const result = post ? await updateBlogPostAction(post.slug, values) : await createBlogPostAction(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(post ? "Blog post updated." : "Blog post created.");
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pb-16 lg:max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title">
          <Input id="title" {...register("title")} />
        </FormField>
        <FormField label="Slug" htmlFor="slug">
          <Input id="slug" {...register("slug")} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category">
          <Input id="category" {...register("category")} />
        </FormField>
        <FormField label="Publish Date & Time" htmlFor="publishedAt">
          <Input id="publishedAt" type="datetime-local" {...register("publishedAt")} />
        </FormField>
      </div>
      <FormField label="Excerpt" htmlFor="excerpt">
        <Textarea id="excerpt" rows={2} {...register("excerpt")} />
      </FormField>
      <FormField label="Content" htmlFor="content">
        <Textarea id="content" rows={12} {...register("content")} />
      </FormField>
      <p className="-mt-4 text-xs text-muted-foreground">Separate paragraphs with a blank line.</p>
      <ImageField label="Cover Image (optional)" htmlFor="coverImagePath" value={coverImagePath ?? ""} onChange={(v) => setValue("coverImagePath", v)} />
      <FormField label="SEO Description" htmlFor="seoDescription">
        <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : post ? "Save Changes" : "Create Post"}
      </Button>
    </form>
  );
}
