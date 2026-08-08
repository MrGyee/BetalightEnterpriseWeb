"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Edge fades + prev/next arrows, absolutely positioned over a carousel track.
 * Render inside the track's `relative` wrapper. Hidden at lg, where the tracks
 * on this site switch from a scroller to a grid.
 */
export function CarouselOverlays({
  canScrollLeft,
  canScrollRight,
  onPrev,
  onNext,
  fadeFrom = "from-background",
  label,
}: {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** Gradient start colour, matched to the section background. */
  fadeFrom?: string;
  label: string;
}) {
  return (
    <>
      {canScrollLeft && (
        <div
          className={cn("pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r to-transparent lg:hidden", fadeFrom)}
        />
      )}
      {canScrollRight && (
        <div
          className={cn("pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l to-transparent lg:hidden", fadeFrom)}
        />
      )}

      {canScrollLeft && (
        <button
          type="button"
          aria-label={`Previous ${label}`}
          onClick={onPrev}
          className="absolute left-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg transition-transform hover:scale-105 lg:hidden"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          aria-label={`Next ${label}`}
          onClick={onNext}
          className="absolute right-1 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg transition-transform hover:scale-105 lg:hidden"
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </>
  );
}

/** Animated pagination dots — active dot widens into an orange pill. */
export function CarouselDots({
  count,
  activeIndex,
  onSelect,
  label,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  label: string;
}) {
  if (count <= 1) return null;

  return (
    <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to ${label} ${i + 1} of ${count}`}
          aria-current={i === activeIndex ? "true" : undefined}
          className="flex h-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <motion.span
            animate={{ width: i === activeIndex ? 24 : 8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "block h-2 rounded-full",
              i === activeIndex ? "bg-primary" : "bg-[#D1D5DB] dark:bg-muted-foreground/40"
            )}
          />
        </button>
      ))}
    </div>
  );
}
