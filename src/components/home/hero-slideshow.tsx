"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, ShieldCheck, Sun, MapPinned } from "lucide-react";
import type { HeroSlideRecord } from "@/lib/store/hero.store";
import { cn } from "@/lib/utils";

const SLIDE_DURATION = 6000;

export function HeroSlideshow({ slides }: { slides: HeroSlideRecord[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[index % slides.length];

  if (!current) return null;

  return (
    <div className="relative">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/40 sm:aspect-[3/4]"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: SLIDE_DURATION / 1000 + 1.2, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={current.imagePath}
                alt={current.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Readability overlay: only darkens toward the bottom, keeping the photo vivid elsewhere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 via-45% to-transparent to-70%" />

        {/* Editorial slide index */}
        <div className="absolute right-5 top-5 font-heading text-xs font-semibold tracking-wide text-white/80">
          {String(index + 1).padStart(2, "0")} <span className="text-white/40">— {String(slides.length).padStart(2, "0")}</span>
        </div>

        {/* Current project caption */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {current.category && (
                <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                  {current.category}
                </span>
              )}
              <p className="text-sm font-semibold text-white">{current.title}</p>
              <p className="text-xs text-white/70">{current.location}</p>

              {slides.length > 1 && (
                <div className="mt-3 flex items-center gap-1.5">
                  {slides.map((s, i) => (
                    <span
                      key={s.id}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        i === index ? "w-5 bg-primary" : "w-1.5 bg-white/40"
                      )}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating glass card: top-left */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-5 -top-5 hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-md sm:flex"
        >
          <Zap className="size-4 text-primary" fill="currentColor" />
          <span className="text-xs font-semibold text-white">Certified Engineers</span>
        </motion.div>

        {/* Floating glass card: bottom-right */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-5 -right-5 hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-lg backdrop-blur-md sm:flex"
        >
          <ShieldCheck className="size-4 text-green" />
          <span className="text-xs font-semibold text-white">Warranty Support</span>
        </motion.div>
      </motion.div>

      {/* Secondary badge row */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 lg:justify-start">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md">
          <Sun className="size-4 text-primary" />
          <span className="text-xs font-semibold text-white/90">Solar Specialists</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-md">
          <MapPinned className="size-4 text-green" />
          <span className="text-xs font-semibold text-white/90">Nationwide Installation</span>
        </div>
      </div>
    </div>
  );
}
