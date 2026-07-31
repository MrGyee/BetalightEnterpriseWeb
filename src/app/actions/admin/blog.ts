"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { blogPostAdminSchema, type BlogPostAdminValues } from "@/lib/validation/admin";
import { createBlogPost, updateBlogPost, deleteBlogPost, getBlogPostBySlug } from "@/lib/data/catalog";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function toIso(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function revalidateBlogPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${slug}`);
}

export async function createBlogPostAction(values: BlogPostAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = blogPostAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (await getBlogPostBySlug(parsed.data.slug)) {
    return { success: false, error: "A blog post with this slug already exists." };
  }
  await createBlogPost({
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    coverImagePath: parsed.data.coverImagePath || null,
    category: parsed.data.category,
    seoDescription: parsed.data.seoDescription,
    publishedAt: toIso(parsed.data.publishedAt),
  });
  revalidateBlogPaths(parsed.data.slug);
  return { success: true };
}

export async function updateBlogPostAction(slug: string, values: BlogPostAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = blogPostAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await getBlogPostBySlug(slug))) {
    return { success: false, error: "Blog post not found." };
  }
  await updateBlogPost(slug, {
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    coverImagePath: parsed.data.coverImagePath || null,
    category: parsed.data.category,
    seoDescription: parsed.data.seoDescription,
    publishedAt: toIso(parsed.data.publishedAt),
  });
  revalidateBlogPaths(slug);
  revalidateBlogPaths(parsed.data.slug);
  return { success: true };
}

export async function deleteBlogPostAction(slug: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await getBlogPostBySlug(slug))) {
    return { success: false, error: "Blog post not found." };
  }
  await deleteBlogPost(slug);
  revalidateBlogPaths(slug);
  return { success: true };
}
