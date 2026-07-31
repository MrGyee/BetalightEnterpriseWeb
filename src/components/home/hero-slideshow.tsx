"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, ShieldCheck, Sun, MapPinned } from "lucide-react";

const slides = [
  {
    src: "/images/projects/solar-water-heater-installation.jpeg",
    alt: "Rooftop solar water heater installation in Nairobi",
    title: "Rooftop Solar Water Heater Installation",
    location: "Nairobi",
  },
  {
    src: "/images/projects/srne-solar-inverter-installation.jpeg",
    alt: "Residential hybrid solar inverter and battery installation",
    title: "Hybrid Solar Inverter & Battery Installation",
    location: "Nairobi",
  },
  {
    src: "/images/projects/eae-hybrid-inverter-installation.jpeg",
    alt: "Home backup power system with hybrid solar inverter",
    title: "Home Backup Power System",
    location: "Nairobi",
  },
  {
    src: "/images/projects/automatic-transfer-switch-installation.jpeg",
    alt: "Automatic transfer switch control panel installation",
    title: "Automatic Transfer Switch Control Panel",
    location: "Nairobi",
  },
  {
    src: "/images/products/vestwoods-power-station-lifestyle.jpeg",
    alt: "Portable solar power station for home and outdoor backup power",
    title: "Smart Portable Power Solutions",
    location: "Kenya",
  },
];

const SLIDE_DURATION = 6000;

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const current = slides[index];

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
                src={current.src}
                alt={current.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Readability overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

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
              <p className="text-sm font-semibold text-white">{current.title}</p>
              <p className="text-xs text-white/70">{current.location}</p>
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
