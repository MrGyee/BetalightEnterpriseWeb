"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Copy, Check, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FacebookIcon, XIcon, LinkedInIcon, MessengerIcon, WhatsAppIcon } from "@/components/shared/social-icons";
import { buildShareUrls } from "@/lib/share";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { ProductRecord } from "@/lib/store/catalog.store";

const buttonBase =
  "flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-3 text-xs font-medium text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-card";

const linkOptions = [
  { key: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon, iconClass: "bg-[#25D366]/10 text-[#25D366]" },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon, iconClass: "bg-[#1877F2]/10 text-[#1877F2]" },
  { key: "messenger", label: "Messenger", Icon: MessengerIcon, iconClass: "bg-[#0084FF]/10 text-[#0084FF]" },
  { key: "x", label: "X", Icon: XIcon, iconClass: "bg-foreground/10 text-foreground" },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon, iconClass: "bg-[#0A66C2]/10 text-[#0A66C2]" },
  { key: "email", label: "Email", Icon: Mail, iconClass: "bg-muted text-muted-foreground" },
] as const;

export function ShareModal({
  open,
  onOpenChange,
  product,
  url,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductRecord;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    setIsDesktop(query.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  const shareUrls = buildShareUrls(url, product.name);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("✓ Product link copied");
      trackEvent("copy_link", { product_slug: product.slug });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link. Please copy it manually.");
    }
  }

  async function handleDownloadPoster() {
    setDownloading(true);
    try {
      const res = await fetch(`/products/${product.slug}/poster`);
      if (!res.ok) throw new Error("Poster generation failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${product.slug}-betalight-poster.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
      trackEvent("poster_downloaded", { product_slug: product.slug });
    } catch {
      toast.error("Couldn't generate the poster. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  function handleShareClick(key: string, href: string) {
    trackEvent("product_shared", { product_slug: product.slug, share_platform: key });
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          isDesktop
            ? "!fixed !left-1/2 !top-1/2 !z-50 !w-full !max-w-sm !-translate-x-1/2 !-translate-y-1/2 !rounded-2xl !p-5"
            : "!fixed !inset-x-0 !bottom-0 !top-auto !left-0 !z-50 !w-full !max-w-full !translate-x-0 !translate-y-0 !rounded-t-2xl !rounded-b-none !p-5"
        }
      >
        <DialogTitle className="font-heading text-lg font-bold text-foreground">Share Product</DialogTitle>
        <DialogDescription className="sr-only">Share {product.name} to social platforms or copy its link</DialogDescription>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={product.imagePath} alt={product.name} fill sizes="56px" className="object-cover" />
          </div>
          <div className="min-w-0">
            {product.brand && <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{product.brand}</p>}
            <p className="truncate font-heading text-sm font-bold text-foreground">{product.name}</p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          className="mt-1 grid grid-cols-3 gap-2.5"
        >
          {linkOptions.map(({ key, label, Icon, iconClass }) => (
            <motion.button
              key={key}
              type="button"
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShareClick(key, shareUrls[key as keyof typeof shareUrls])}
              className={buttonBase}
              aria-label={`Share via ${label}`}
            >
              <span className={cn("flex size-9 items-center justify-center rounded-full", iconClass)}>
                <Icon className="size-4" />
              </span>
              {label}
            </motion.button>
          ))}

          <motion.button
            type="button"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className={buttonBase}
            aria-label="Copy product link"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {copied ? <Check className="size-4 text-green" /> : <Copy className="size-4" />}
            </span>
            {copied ? "Copied!" : "Copy Link"}
          </motion.button>

          <motion.button
            type="button"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPoster}
            disabled={downloading}
            className={cn(buttonBase, "disabled:opacity-60")}
            aria-label="Download marketing poster"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            </span>
            {downloading ? "Generating…" : "Download Poster"}
          </motion.button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
