"use client";

import { useEffect, type ReactNode } from "react";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CarouselDots } from "@/components/shared/carousel-controls";
import { useCarousel } from "@/components/shared/use-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectRecord } from "@/lib/store/catalog.store";

function Gallery({ project, photos }: { project: ProjectRecord; photos: string[] }) {
  const { scrollRef, activeIndex, canScrollLeft, canScrollRight, scrollToIndex } = useCarousel(photos.length);

  // A lightbox is a focused view, so it never advances on its own — but the
  // keys people reach for in one still need to work.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") scrollToIndex(Math.max(activeIndex - 1, 0));
      if (event.key === "ArrowRight") scrollToIndex(Math.min(activeIndex + 1, photos.length - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, photos.length, scrollToIndex]);

  return (
    <>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((src, i) => (
            <div key={`${src}-${i}`} className="relative aspect-[4/3] w-full shrink-0 snap-center bg-muted">
              <Image
                src={src}
                alt={`${project.title} — photo ${i + 1} of ${photos.length}`}
                fill
                sizes="(min-width: 640px) 640px, 100vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {canScrollLeft && (
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
            className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => scrollToIndex(Math.min(activeIndex + 1, photos.length - 1))}
            className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          Photo {activeIndex + 1} of {photos.length}
        </p>
        {/* CarouselDots hides itself at lg, where the arrows above still work. */}
        <CarouselDots count={photos.length} activeIndex={activeIndex} onSelect={scrollToIndex} label="photo" />
      </div>
    </>
  );
}

export function ProjectLightbox({ project, children }: { project: ProjectRecord; children: ReactNode }) {
  const photos = [project.imagePath, ...project.gallery];

  return (
    <Dialog>
      <DialogTrigger
        render={<button type="button" aria-label={`View photos of ${project.title}`} className="block w-full text-left" />}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogTitle className="font-heading text-base font-bold">{project.title}</DialogTitle>
        <Gallery project={project} photos={photos} />
      </DialogContent>
    </Dialog>
  );
}
