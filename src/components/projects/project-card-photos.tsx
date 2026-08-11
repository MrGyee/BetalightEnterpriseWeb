"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProjectRecord } from "@/lib/store/catalog.store";

/**
 * Cycles a project's photos on the card itself, so the extra shots are visible
 * without anyone having to open the lightbox first.
 *
 * Crossfades rather than slides: there's no gesture here for a direction to
 * agree with. The first photo stays in layout flow and the rest are stacked on
 * top of it, which is what lets the masonry column keep its natural height —
 * so callers that size the card themselves must say so via `firstClassName`.
 */
export function ProjectCardPhotos({
  project,
  sizes,
  className,
  firstClassName,
}: {
  project: ProjectRecord;
  sizes: string;
  /** Wrapper classes. Must establish a positioning context for the stack. */
  className?: string;
  /** Classes for the first photo, the only one in layout flow. */
  firstClassName?: string;
}) {
  const photos = [project.imagePath, ...project.gallery];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2 || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Slow on purpose: this is ambient, playing unprompted behind whatever the
    // visitor is actually reading, so it should register as barely moving.
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 7000);
    return () => clearInterval(id);
  }, [photos.length, inView]);

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <Image
        src={photos[0]}
        alt={project.title}
        width={800}
        height={1000}
        sizes={sizes}
        className={cn(
          "object-cover transition-opacity duration-1000",
          firstClassName ?? "h-auto w-full",
          index === 0 ? "opacity-100" : "opacity-0"
        )}
      />

      {photos.slice(1).map((src, i) => (
        <Image
          key={`${src}-${i}`}
          src={src}
          alt=""
          fill
          sizes={sizes}
          className={cn(
            "absolute inset-0 object-cover transition-opacity duration-1000",
            index === i + 1 ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
    </div>
  );
}
