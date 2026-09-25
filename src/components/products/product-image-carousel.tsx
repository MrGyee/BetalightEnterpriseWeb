"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarouselDots } from "@/components/shared/carousel-controls";
import { useCarousel } from "@/components/shared/use-carousel";
import { cn } from "@/lib/utils";

/**
 * The cover photo plus any gallery photos, swipeable/scrollable at every
 * breakpoint (unlike the CarouselOverlays tracks elsewhere, which switch to a
 * grid at lg — a single product has nothing to grid into).
 */
export function ProductImageCarousel({
  photos,
  alt,
  sizes,
  priority,
  overlay,
  className,
}: {
  photos: string[];
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Rendered inside the image box, e.g. a share button pinned to a corner. */
  overlay?: ReactNode;
  className?: string;
}) {
  const { scrollRef, activeIndex, canScrollLeft, canScrollRight, scrollToIndex } = useCarousel(photos.length);

  const goTo = useCallback((index: number) => scrollToIndex(index), [scrollToIndex]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") goTo(Math.max(activeIndex - 1, 0));
      if (event.key === "ArrowRight") goTo(Math.min(activeIndex + 1, photos.length - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, photos.length, goTo]);

  return (
    <div>
      <div className={cn("relative aspect-square overflow-hidden rounded-2xl bg-muted", className)}>
        <div
          ref={scrollRef}
          className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((src, i) => (
            <div key={`${src}-${i}`} className="relative h-full w-full shrink-0 snap-center">
              <Image
                src={src}
                alt={photos.length > 1 ? `${alt} — photo ${i + 1} of ${photos.length}` : alt}
                fill
                sizes={sizes}
                className="object-cover"
                priority={priority && i === 0}
              />
            </div>
          ))}
        </div>

        {canScrollLeft && (
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => goTo(Math.max(activeIndex - 1, 0))}
            className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg transition-transform hover:scale-105"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => goTo(Math.min(activeIndex + 1, photos.length - 1))}
            className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg transition-transform hover:scale-105"
          >
            <ChevronRight className="size-5" />
          </button>
        )}

        {overlay}
      </div>

      {photos.length > 1 && (
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Photo {activeIndex + 1} of {photos.length}
          </p>
          <CarouselDots count={photos.length} activeIndex={activeIndex} onSelect={goTo} label="photo" />
        </div>
      )}
    </div>
  );
}
