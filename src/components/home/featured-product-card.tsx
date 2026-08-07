"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { QuickViewDialog } from "@/components/products/quick-view-dialog";
import { ProductShareButton } from "@/components/products/product-share-button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useSiteSettings } from "@/components/shared/site-settings-provider";
import { trackEvent } from "@/lib/analytics";
import { absoluteProductUrl, buildWhatsAppQuoteMessage } from "@/lib/share";
import { cn } from "@/lib/utils";
import type { ProductRecord } from "@/lib/store/catalog.store";

export function FeaturedProductCard({ product, delay = 0 }: { product: ProductRecord; delay?: number }) {
  const settings = useSiteSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="group relative flex w-[78vw] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:bg-card sm:w-auto sm:shrink"
    >
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={product.imagePath}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 78vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <Badge className="absolute left-3 top-3 bg-white/95 text-foreground shadow" variant="secondary">
          {product.category}
        </Badge>
      </Link>

      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <QuickViewDialog product={product} />
        <ProductShareButton product={product} />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && <p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.brand}</p>}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 font-heading text-base font-bold leading-snug text-foreground">{product.name}</h3>
        </Link>
        <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">{product.shortDescription}</p>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/quote?product=${product.slug}`}
            className={cn(buttonVariants({ size: "sm" }), "flex-1 rounded-full")}
          >
            Request Quote
          </Link>
          <a
            href={buildWhatsAppLink(settings.whatsappNumber, buildWhatsAppQuoteMessage(product, absoluteProductUrl(product.slug)))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_quote_started", { product_slug: product.slug })}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex-1 rounded-full border-[#25D366]/40 text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
            )}
          >
            <MessageCircle className="size-3.5" fill="currentColor" strokeWidth={0} />
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}
