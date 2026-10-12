"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { panelModelAdminSchema, type PanelModelAdminValues } from "@/lib/validation/admin";
import { createPanelModel, updatePanelModel, deletePanelModel, getPanelModelById } from "@/lib/data/catalog";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidatePanelModelPaths() {
  revalidatePath("/solar-cost-estimate");
  revalidatePath("/admin/panel-models");
}

export async function createPanelModelAction(values: PanelModelAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = panelModelAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await createPanelModel(parsed.data);
  revalidatePanelModelPaths();
  return { success: true };
}

export async function updatePanelModelAction(id: string, values: PanelModelAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = panelModelAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await getPanelModelById(id))) {
    return { success: false, error: "Panel model not found." };
  }
  await updatePanelModel(id, parsed.data);
  revalidatePanelModelPaths();
  return { success: true };
}

export async function deletePanelModelAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await getPanelModelById(id))) {
    return { success: false, error: "Panel model not found." };
  }
  await deletePanelModel(id);
  revalidatePanelModelPaths();
  return { success: true };
}
