"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { primaryNav, productCategories } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors",
        scrolled
          ? "border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
          : "border-transparent bg-background"
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/images/brand/betalight-logo.jpeg"
            alt={`${siteConfig.name} logo`}
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <span className="hidden font-heading text-lg font-bold leading-tight text-foreground sm:block">
            Betalight
            <span className="block text-xs font-medium text-muted-foreground">Enterprises Ltd</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            if (item.megaMenu) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                      active ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-3.5" />
                  </Link>
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 top-full w-80 -translate-x-1/2 rounded-2xl border border-border bg-card p-3 shadow-xl"
                      >
                        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Shop by category
                        </p>
                        <div className="grid grid-cols-1 gap-1">
                          {productCategories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/products"
                          className="mt-2 block rounded-lg bg-primary/10 px-3 py-2 text-center text-sm font-semibold text-primary hover:bg-primary/15"
                        >
                          View all products
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  active ? "text-primary" : "text-foreground/80"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <a
            href={`tel:${siteConfig.phones.primary}`}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
          >
            <Phone className="size-4" />
            Call Now
          </a>
          <Link href="/quote" className={cn(buttonVariants(), "rounded-full")}>
            Request a Quote
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open menu" />}>
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left font-heading">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pb-6">
                {primaryNav.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={<Link href={item.href} className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-muted" />}
                  >
                    {item.label}
                  </SheetClose>
                ))}
                <div className="my-2 border-t border-border" />
                {productCategories.map((cat) => (
                  <SheetClose
                    key={cat.slug}
                    render={
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                      />
                    }
                  >
                    {cat.name}
                  </SheetClose>
                ))}
                <div className="my-2 border-t border-border" />
                <SheetClose render={<Link href="/quote" className={cn(buttonVariants(), "mt-2 rounded-full")} />}>
                  Request a Quote
                </SheetClose>
                <a
                  href={`tel:${siteConfig.phones.primary}`}
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2.5 text-sm font-medium"
                >
                  <Phone className="size-4" />
                  Call {siteConfig.phones.primary}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
