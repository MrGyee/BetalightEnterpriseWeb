import { AdminListHeader } from "@/components/admin/admin-list-header";
import { ProjectForm } from "@/components/admin/projects/project-form";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div>
      <AdminListHeader title="Add Project" description="Add a new project to the gallery." />
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
