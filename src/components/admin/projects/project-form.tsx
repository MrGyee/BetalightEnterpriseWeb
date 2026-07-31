"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ProjectAdminValues } from "@/lib/validation/admin";
import { createProjectAction, updateProjectAction } from "@/app/actions/admin/projects";
import type { ProjectRecord } from "@/lib/store/catalog.store";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageField } from "@/components/admin/image-field";

export function ProjectForm({ project }: { project?: ProjectRecord }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<ProjectAdminValues>({
    defaultValues: project
      ? {
          slug: project.slug,
          title: project.title,
          category: project.category,
          description: project.description,
          location: project.location,
          imagePath: project.imagePath,
          completedDate: project.completedDate ?? "",
        }
      : { slug: "", title: "", category: "", description: "", location: "", imagePath: "", completedDate: "" },
  });

  const imagePath = watch("imagePath");

  async function onSubmit(values: ProjectAdminValues) {
    setIsSubmitting(true);
    const result = project ? await updateProjectAction(project.slug, values) : await createProjectAction(values);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(project ? "Project updated." : "Project created.");
      router.push("/admin/projects");
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
        <FormField label="Location" htmlFor="location">
          <Input id="location" {...register("location")} />
        </FormField>
      </div>
      <FormField label="Description" htmlFor="description">
        <Textarea id="description" rows={4} {...register("description")} />
      </FormField>
      <ImageField label="Image" htmlFor="imagePath" value={imagePath} onChange={(v) => setValue("imagePath", v)} />
      <FormField label="Completed Date (optional)" htmlFor="completedDate">
        <Input id="completedDate" type="date" {...register("completedDate")} />
      </FormField>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit rounded-full">
        {isSubmitting ? "Saving..." : project ? "Save Changes" : "Create Project"}
      </Button>
    </form>
  );
}
