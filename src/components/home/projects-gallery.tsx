import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { ProjectRecord } from "@/lib/store/catalog.store";

export function ProjectsGallery({ projects }: { projects: ProjectRecord[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Recent Projects</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">A look at real installations we&apos;ve completed for our customers.</p>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-1.5 font-semibold text-primary">
            View all projects <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects#${project.slug}`}
              className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative w-full">
                <Image
                  src={project.imagePath}
                  alt={project.title}
                  width={800}
                  height={1000}
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
                <span className="inline-block rounded-full bg-primary/90 px-2.5 py-1 text-xs font-semibold text-white">
                  {project.category}
                </span>
                <h3 className="mt-2 font-heading text-base font-bold text-white">{project.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                  <MapPin className="size-3.5" /> {project.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
