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
import { TopUtilityBar } from "@/components/layout/top-utility-bar";
import { primaryNav, productCategories, servicesMenu } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkColor = transparent ? "text-white/90 hover:text-primary" : "text-foreground hover:text-primary";
  const navLinkActiveColor = "text-primary";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <TopUtilityBar />
      <div
        className={cn(
          "transition-all duration-300",
          transparent ? "bg-transparent" : "border-b border-border bg-background/95 shadow-sm backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 md:h-24 lg:px-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <Image
                src="/images/brand/betalight-logo.jpeg"
                alt={`${siteConfig.name} logo`}
                width={56}
                height={56}
                className="rounded-full"
                priority
              />
              <span className="hidden leading-tight sm:block">
                <span className={cn("block font-heading text-lg font-bold transition-colors", transparent ? "text-white" : "text-foreground")}>
                  {siteConfig.name}
                </span>
                <span className={cn("block text-[11px] font-medium transition-colors", transparent ? "text-white/70" : "text-muted-foreground")}>
                  {siteConfig.tagline}
                </span>
              </span>
            </Link>
          </motion.div>

          <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
            {primaryNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const colorClass = active ? navLinkActiveColor : navLinkColor;

              if (item.dropdown) {
                const isOpen = openDropdown === item.dropdown;
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.dropdown!)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link href={item.href} className={cn("group relative flex items-center gap-1 py-2 text-[15px] font-semibold transition-colors", colorClass)}>
                      {item.label}
                      <ChevronDown className="size-3.5" />
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                          active ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    </Link>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-1/2 top-full w-72 -translate-x-1/2 rounded-2xl border border-border bg-popover p-2 shadow-xl"
                        >
                          {item.dropdown === "products"
                            ? productCategories.map((cat) => (
                                <Link
                                  key={cat.slug}
                                  href={`/products?category=${cat.slug}`}
                                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary"
                                >
                                  {cat.name}
                                </Link>
                              ))
                            : servicesMenu.map((service) => (
                                <Link
                                  key={service.href}
                                  href={service.href}
                                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary"
                                >
                                  {service.name}
                                </Link>
                              ))}
                          <Link
                            href={item.href}
                            className="mt-1 block rounded-lg bg-primary/10 px-3 py-2 text-center text-sm font-semibold text-primary hover:bg-primary/15"
                          >
                            View all {item.label.toLowerCase()}
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href} className={cn("group relative py-2 text-[15px] font-semibold transition-colors", colorClass)}>
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle className={transparent ? "text-white hover:bg-white/10 hover:text-white" : ""} />
            <a
              href={`tel:${siteConfig.phones.primary}`}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all hover:border-primary hover:bg-primary hover:text-white",
                transparent ? "border-white/30 bg-white/10 text-white" : "border-border bg-white text-foreground"
              )}
            >
              <Phone className="size-4" />
              Call Now
            </a>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link href="/quote" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/30">
                Request a Quote
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle className={transparent ? "text-white hover:bg-white/10 hover:text-white" : ""} />
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                    className={transparent ? "text-white hover:bg-white/10 hover:text-white" : ""}
                  />
                }
              >
                <Menu className="size-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] bg-background sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle className="text-left font-heading">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex h-full flex-col px-4 pb-6">
                  <div className="flex-1 space-y-1 overflow-y-auto">
                    {primaryNav.map((item) => {
                      if (item.dropdown === "products") {
                        return (
                          <div key={item.href}>
                            <button
                              type="button"
                              onClick={() => setMobileProductsOpen((v) => !v)}
                              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium hover:bg-muted"
                            >
                              Products
                              <ChevronDown className={cn("size-4 transition-transform", mobileProductsOpen && "rotate-180")} />
                            </button>
                            {mobileProductsOpen && (
                              <div className="ml-3 space-y-0.5 border-l border-border pl-3">
                                {productCategories.map((cat) => (
                                  <SheetClose
                                    key={cat.slug}
                                    nativeButton={false}
                                    render={
                                      <Link href={`/products?category=${cat.slug}`} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted" />
                                    }
                                  >
                                    {cat.name}
                                  </SheetClose>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                      if (item.dropdown === "services") {
                        return (
                          <div key={item.href}>
                            <button
                              type="button"
                              onClick={() => setMobileServicesOpen((v) => !v)}
                              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium hover:bg-muted"
                            >
                              Services
                              <ChevronDown className={cn("size-4 transition-transform", mobileServicesOpen && "rotate-180")} />
                            </button>
                            {mobileServicesOpen && (
                              <div className="ml-3 space-y-0.5 border-l border-border pl-3">
                                {servicesMenu.map((service) => (
                                  <SheetClose
                                    key={service.href}
                                    nativeButton={false}
                                    render={<Link href={service.href} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted" />}
                                  >
                                    {service.name}
                                  </SheetClose>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return (
                        <SheetClose
                          key={item.href}
                          nativeButton={false}
                          render={<Link href={item.href} className="block rounded-lg px-3 py-3 text-base font-medium hover:bg-muted" />}
                        >
                          {item.label}
                        </SheetClose>
                      );
                    })}
                  </div>

                  <div className="space-y-2 border-t border-border pt-4">
                    <SheetClose nativeButton={false} render={<Link href="/quote" className={cn(buttonVariants(), "w-full rounded-full")} />}>
                      Request a Quote
                    </SheetClose>
                    <a
                      href={`tel:${siteConfig.phones.primary}`}
                      className="flex items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2.5 text-sm font-medium"
                    >
                      <Phone className="size-4" />
                      Call {siteConfig.phones.primary}
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
