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
 * agree with, and the first photo stays in the layout flow so the masonry
 * column keeps its natural height.
 */
export function ProjectCardPhotos({ project }: { project: ProjectRecord }) {
  const photos = [project.imagePath, ...project.gallery];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2 || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 3500);
    return () => clearInterval(id);
  }, [photos.length, inView]);

  return (
    <div ref={ref} className="group relative w-full">
      <Image
        src={photos[0]}
        alt={project.title}
        width={800}
        height={1000}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={cn(
          "h-auto w-full object-cover transition-opacity duration-700",
          index === 0 ? "opacity-100" : "opacity-0"
        )}
      />

      {photos.slice(1).map((src, i) => (
        <Image
          key={`${src}-${i}`}
          src={src}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "absolute inset-0 object-cover transition-opacity duration-700",
            index === i + 1 ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
    </div>
  );
}
