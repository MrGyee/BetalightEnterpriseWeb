"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { faqAdminSchema, type FaqAdminValues } from "@/lib/validation/admin";
import { createFaq, updateFaq, deleteFaq, getFaqById } from "@/lib/data/catalog";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateFaqPaths() {
  revalidatePath("/");
  revalidatePath("/faqs");
  revalidatePath("/admin/faqs");
}

export async function createFaqAction(values: FaqAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createFaq(parsed.data);
  revalidateFaqPaths();
  return { success: true };
}

export async function updateFaqAction(id: string, values: FaqAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await getFaqById(id))) {
    return { success: false, error: "FAQ not found." };
  }
  await updateFaq(id, parsed.data);
  revalidateFaqPaths();
  return { success: true };
}

export async function deleteFaqAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await getFaqById(id))) {
    return { success: false, error: "FAQ not found." };
  }
  await deleteFaq(id);
  revalidateFaqPaths();
  return { success: true };
}
