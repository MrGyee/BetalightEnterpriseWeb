"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { testimonialAdminSchema, type TestimonialAdminValues } from "@/lib/validation/admin";
import { createTestimonial, updateTestimonial, deleteTestimonial, getTestimonialById } from "@/lib/data/catalog";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateTestimonialPaths() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonialAction(values: TestimonialAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = testimonialAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createTestimonial({
    authorName: parsed.data.authorName,
    roleOrCompany: parsed.data.roleOrCompany,
    quote: parsed.data.quote,
    rating: parsed.data.rating,
    photoPath: parsed.data.photoPath || null,
  });
  revalidateTestimonialPaths();
  return { success: true };
}

export async function updateTestimonialAction(id: string, values: TestimonialAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = testimonialAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await getTestimonialById(id))) {
    return { success: false, error: "Testimonial not found." };
  }
  await updateTestimonial(id, {
    authorName: parsed.data.authorName,
    roleOrCompany: parsed.data.roleOrCompany,
    quote: parsed.data.quote,
    rating: parsed.data.rating,
    photoPath: parsed.data.photoPath || null,
  });
  revalidateTestimonialPaths();
  return { success: true };
}

export async function deleteTestimonialAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await getTestimonialById(id))) {
    return { success: false, error: "Testimonial not found." };
  }
  await deleteTestimonial(id);
  revalidateTestimonialPaths();
  return { success: true };
}
