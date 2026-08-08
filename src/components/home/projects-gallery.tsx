"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { CarouselOverlays, CarouselDots } from "@/components/shared/carousel-controls";
import { useCarousel } from "@/components/shared/use-carousel";
import type { ProjectRecord } from "@/lib/store/catalog.store";

export function ProjectsGallery({ projects }: { projects: ProjectRecord[] }) {
  const { scrollRef, activeIndex, canScrollLeft, canScrollRight, scrollToIndex } = useCarousel(projects.length);

  if (projects.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Recent Projects</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">A look at real installations we&apos;ve completed for our customers.</p>
          </div>
          <Link href="/projects" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-primary">
            View all projects <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="relative mt-10">
          {projects.length > 1 && (
            <CarouselOverlays
              canScrollLeft={canScrollLeft}
              canScrollRight={canScrollRight}
              onPrev={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
              onNext={() => scrollToIndex(Math.min(activeIndex + 1, projects.length - 1))}
              label="projects"
            />
          )}

          {/* Swipe carousel below lg with uniform cards; masonry on desktop. */}
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] lg:block lg:columns-3 lg:gap-5 lg:overflow-visible lg:pb-0 lg:[&>*]:mb-5 lg:[&>*]:break-inside-avoid [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects#${project.slug}`}
                className="group relative block w-[78vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:w-[44vw] lg:w-auto lg:shrink"
              >
                <div className="relative aspect-[4/5] w-full lg:aspect-auto">
                  <Image
                    src={project.imagePath}
                    alt={project.title}
                    width={800}
                    height={1000}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 44vw, 78vw"
                    className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105 lg:relative lg:h-auto"
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

        <CarouselDots count={projects.length} activeIndex={activeIndex} onSelect={scrollToIndex} label="project" />
      </div>
    </section>
  );
}
