"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { inverterModelAdminSchema, type InverterModelAdminValues } from "@/lib/validation/admin";
import { createInverterModel, updateInverterModel, deleteInverterModel, getInverterModelById } from "@/lib/data/catalog";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateInverterModelPaths() {
  revalidatePath("/solar-cost-estimate");
  revalidatePath("/admin/inverter-models");
}

export async function createInverterModelAction(values: InverterModelAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = inverterModelAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createInverterModel(parsed.data);
  revalidateInverterModelPaths();
  return { success: true };
}

export async function updateInverterModelAction(id: string, values: InverterModelAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = inverterModelAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await getInverterModelById(id))) {
    return { success: false, error: "Inverter model not found." };
  }
  await updateInverterModel(id, parsed.data);
  revalidateInverterModelPaths();
  return { success: true };
}

export async function deleteInverterModelAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await getInverterModelById(id))) {
    return { success: false, error: "Inverter model not found." };
  }
  await deleteInverterModel(id);
  revalidateInverterModelPaths();
  return { success: true };
}
