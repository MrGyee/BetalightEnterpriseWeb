"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, CheckCircle2, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { cn } from "@/lib/utils";

const trustPoints = ["Licensed & Certified", "Genuine Products", "Fast Response Times", "Nationwide Delivery"];

const stats = [
  { label: "Projects Completed", value: 150, suffix: "+" },
  { label: "Years of Experience", value: 5, suffix: "+" },
  { label: "Electrical Products", value: 500, suffix: "+" },
  { label: "Counties Served", value: 8, suffix: "" },
];

const brandNames = ["Tronic", "Vestwoods", "SRNE", "Seven Stars", "ALLTOP Electronics", "ATTA", "Lutan Pump", "EAE", "Eastman", "MODI"];

export function Hero() {
  const doubledBrands = [...brandNames, ...brandNames];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1F2937] via-[#20293a] to-[#14532d] pb-16 pt-32 sm:pb-20 sm:pt-44">
      {/* Blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Hexagonal pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexPattern" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(1.1)">
              <path
                d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z"
                fill="none"
                stroke="#F57C00"
                strokeWidth="0.75"
              />
              <path
                d="M28 32 L56 48 L56 80 L28 96 L0 80 L0 48 Z"
                fill="none"
                stroke="#2E7D32"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexPattern)" />
        </svg>
      </div>

      {/* Circuit trace lines + energy flow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.4]">
        <svg className="h-full w-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 650 Q300 550 600 620 T1200 580" stroke="#F57C00" strokeWidth="1.5" opacity="0.5" />
          <path d="M0 500 Q350 420 700 480 T1200 420" stroke="#2E7D32" strokeWidth="1.5" opacity="0.5" />
          <path d="M0 300 Q300 250 600 300 T1200 260" stroke="#F57C00" strokeWidth="1" opacity="0.3" />
          <path d="M100 0 L100 180 L220 260" stroke="#F57C00" strokeWidth="1" opacity="0.4" />
          <circle cx="100" cy="180" r="3" fill="#F57C00" opacity="0.6" />
          <circle cx="220" cy="260" r="3" fill="#2E7D32" opacity="0.6" />
          <path d="M1100 0 L1100 140 L980 220" stroke="#2E7D32" strokeWidth="1" opacity="0.4" />
          <circle cx="1100" cy="140" r="3" fill="#2E7D32" opacity="0.6" />
        </svg>
      </div>

      {/* Glowing accent blobs */}
      <div className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-primary/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-24 size-80 rounded-full bg-green/25 blur-[110px]" />

      {/* Soft particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute hidden size-1 rounded-full bg-white/50 sm:block"
          style={{ left: `${(i * 8.3) % 100}%`, top: `${(i * 17) % 100}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[45%_55%] lg:items-center lg:gap-10 lg:px-8">
        {/* Left column: content */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-200 backdrop-blur"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Trusted Electrical &amp; Solar Partner
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-[3.25rem]"
          >
            Powering Kenya with Reliable Electrical &amp; Solar Solutions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-base text-slate-200 sm:text-lg lg:mx-0"
          >
            Betalight Enterprises Ltd delivers premium electrical products, solar energy systems, power control
            equipment and professional installation services designed for reliability, safety, and long-term
            performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/quote" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-7 text-base")}>
              Request a Free Quote
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full border-white/30 bg-white/5 px-7 text-base text-white hover:bg-white/15 hover:text-white"
              )}
            >
              Explore Our Products
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-primary text-primary" />
              ))}
              <span className="ml-1.5 text-sm font-medium text-slate-200">Rated by our clients</span>
            </div>
            <div className="hidden h-4 w-px bg-white/20 sm:block" />
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start">
              {trustPoints.map((point) => (
                <span key={point} className="flex items-center gap-1.5 text-xs font-medium text-slate-300 sm:text-sm">
                  <CheckCircle2 className="size-3.5 text-green" />
                  {point}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Animated stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4 lg:border-t-0 lg:pt-0"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-3xl text-white sm:text-4xl" />
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column: slideshow */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto w-full max-w-md lg:max-w-none"
        >
          <HeroSlideshow />
        </motion.div>
      </div>

      {/* Trusted brands strip */}
      <div className="relative mt-16 sm:mt-20">
        <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Trusted Brands We Sell &amp; Install
        </p>
        <div className="group relative mt-4 overflow-hidden">
          <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-14 group-hover:[animation-play-state:paused]">
            {doubledBrands.map((brand, i) => (
              <span key={`${brand}-${i}`} className="shrink-0 font-heading text-lg font-bold text-slate-400/70 sm:text-xl">
                {brand}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#1F2937] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#14532d]/0 to-transparent" />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-x-0 bottom-3 hidden flex-col items-center gap-1 text-xs font-medium text-slate-300/80 sm:flex"
      >
        <span>Discover Our Solutions</span>
        <ChevronDown className="size-4" />
      </motion.div>
    </section>
  );
}
