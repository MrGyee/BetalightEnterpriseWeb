"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { batteryModelAdminSchema, type BatteryModelAdminValues } from "@/lib/validation/admin";
import { createBatteryModel, updateBatteryModel, deleteBatteryModel, getBatteryModelById } from "@/lib/data/catalog";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateBatteryModelPaths() {
  revalidatePath("/solar-cost-estimate");
  revalidatePath("/admin/battery-models");
}

export async function createBatteryModelAction(values: BatteryModelAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = batteryModelAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createBatteryModel(parsed.data);
  revalidateBatteryModelPaths();
  return { success: true };
}

export async function updateBatteryModelAction(id: string, values: BatteryModelAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = batteryModelAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await getBatteryModelById(id))) {
    return { success: false, error: "Battery model not found." };
  }
  await updateBatteryModel(id, parsed.data);
  revalidateBatteryModelPaths();
  return { success: true };
}

export async function deleteBatteryModelAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await getBatteryModelById(id))) {
    return { success: false, error: "Battery model not found." };
  }
  await deleteBatteryModel(id);
  revalidateBatteryModelPaths();
  return { success: true };
}
