import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getProjects } from "@/lib/data/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Projects",
  description: "A gallery of real electrical and solar installations completed by Betalight Enterprises Ltd across Kenya.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Projects", url: "/projects" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Recent Projects</h1>
        <p className="mt-4 text-muted-foreground">A look at real installations we&apos;ve completed for our customers.</p>
      </div>

      {projects.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">Project photos are being added. Check back soon.</p>
      ) : (
        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {projects.map((project) => (
            <div key={project.slug} id={project.slug} className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="relative w-full">
                <Image src={project.imagePath} alt={project.title} width={800} height={1000} className="h-auto w-full object-cover" />
              </div>
              <div className="p-5">
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {project.category}
                </span>
                <h3 className="mt-3 font-heading text-base font-bold text-foreground">{project.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" /> {project.location}
                  </span>
                  {project.completedDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {new Date(project.completedDate).toLocaleDateString("en-KE", { month: "long", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
