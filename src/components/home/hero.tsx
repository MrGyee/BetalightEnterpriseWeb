"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sun, Zap, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, defaultWhatsAppMessage } from "@/lib/whatsapp";

const floatingIcons = [
  { Icon: Sun, className: "left-[8%] top-[20%]", delay: 0 },
  { Icon: Zap, className: "left-[85%] top-[15%]", delay: 0.6 },
  { Icon: ShieldCheck, className: "left-[80%] top-[70%]", delay: 1.2 },
  { Icon: Sun, className: "left-[12%] top-[75%]", delay: 1.8 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1F2937] via-[#20293a] to-[#14532d] pb-24 pt-32 sm:pb-32 sm:pt-44">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <svg className="h-full w-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 650 Q300 550 600 620 T1200 580" stroke="#F57C00" strokeWidth="1.5" opacity="0.5" />
          <path d="M0 500 Q350 420 700 480 T1200 420" stroke="#2E7D32" strokeWidth="1.5" opacity="0.5" />
          <path d="M0 300 Q300 250 600 300 T1200 260" stroke="#F57C00" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>

      {floatingIcons.map(({ Icon, className, delay }, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none absolute hidden text-primary/40 sm:block ${className}`}
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
        >
          <Icon className="size-8" />
        </motion.div>
      ))}

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
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
          className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          Powering Homes, Businesses &amp; Industries Across Kenya
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-slate-200 sm:text-lg"
        >
          Betalight Enterprises Ltd delivers premium electrical products, solar energy systems, power control equipment
          and professional installation services designed for reliability, safety, and long-term performance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
          <a
            href={buildWhatsAppLink(defaultWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full bg-[#25D366] px-7 text-base text-white hover:bg-[#1ebe5a]")}
          >
            <MessageCircle className="size-4" fill="currentColor" strokeWidth={0} />
            WhatsApp Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
