"use client";

import Image from "next/image";
import Link from "next/link";
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

export function ProductCard({ product }: { product: ProductRecord }) {
  const settings = useSiteSettings();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={product.imagePath}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground shadow" variant="secondary">
          {product.category}
        </Badge>
      </Link>

      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <QuickViewDialog product={product} />
        <ProductShareButton product={product} />
      </div>

      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col p-4 pb-0">
        {product.brand && <p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.brand}</p>}
        <h3 className="mt-1 font-heading text-base font-bold leading-snug text-foreground">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
      </Link>

      <div className="flex flex-col gap-2 p-4">
        <Link
          href={`/quote?product=${product.slug}`}
          className={cn(buttonVariants({ size: "sm" }), "w-full rounded-full")}
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
            "w-full rounded-full border-[#25D366]/40 text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
          )}
        >
          <MessageCircle className="size-3.5" fill="currentColor" strokeWidth={0} />
          {/* Cards drop to ~162px wide in the 2-col mobile grid, which can't
              fit the full label without clipping. */}
          <span className="md:hidden">WhatsApp</span>
          <span className="hidden md:inline">Order on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
