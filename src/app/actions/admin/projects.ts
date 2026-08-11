"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { projectAdminSchema, type ProjectAdminValues } from "@/lib/validation/admin";
import { createProject, updateProject, deleteProject, getProjectBySlug } from "@/lib/data/catalog";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateProjectPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function createProjectAction(values: ProjectAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (await getProjectBySlug(parsed.data.slug)) {
    return { success: false, error: "A project with this slug already exists." };
  }
  await createProject({
    slug: parsed.data.slug,
    title: parsed.data.title,
    category: parsed.data.category,
    description: parsed.data.description,
    location: parsed.data.location,
    imagePath: parsed.data.imagePath,
    gallery: parsed.data.gallery.filter(Boolean),
    completedDate: parsed.data.completedDate || null,
  });
  revalidateProjectPaths(parsed.data.slug);
  return { success: true };
}

export async function updateProjectAction(slug: string, values: ProjectAdminValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectAdminSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (!(await getProjectBySlug(slug))) {
    return { success: false, error: "Project not found." };
  }
  await updateProject(slug, {
    slug: parsed.data.slug,
    title: parsed.data.title,
    category: parsed.data.category,
    description: parsed.data.description,
    location: parsed.data.location,
    imagePath: parsed.data.imagePath,
    gallery: parsed.data.gallery.filter(Boolean),
    completedDate: parsed.data.completedDate || null,
  });
  revalidateProjectPaths(slug);
  revalidateProjectPaths(parsed.data.slug);
  return { success: true };
}

export async function deleteProjectAction(slug: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(await getProjectBySlug(slug))) {
    return { success: false, error: "Project not found." };
  }
  await deleteProject(slug);
  revalidateProjectPaths(slug);
  return { success: true };
}
