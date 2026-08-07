"use client";

import { useState, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import { Share2 } from "lucide-react";
import { absoluteProductUrl } from "@/lib/share";
import { trackEvent } from "@/lib/analytics";
import type { ProductRecord } from "@/lib/store/catalog.store";

const ShareModal = dynamic(() => import("@/components/products/share-modal").then((m) => m.ShareModal), {
  ssr: false,
});

export function ProductShareButton({ product, className }: { product: ProductRecord; className?: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  async function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = absoluteProductUrl(product.slug);

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name}\n${product.shortDescription}\n\nRequest your quote from Betalight.`,
          url,
        });
        trackEvent("product_shared", { product_slug: product.slug, share_platform: "native" });
      } catch {
        // user cancelled the native share sheet — no-op
      }
      return;
    }

    setModalOpen(true);
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Share ${product.name}`}
        onClick={handleClick}
        className={className ?? "flex size-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow transition-transform hover:scale-105"}
      >
        <Share2 className="size-4" />
      </button>
      {modalOpen && (
        <ShareModal open={modalOpen} onOpenChange={setModalOpen} product={product} url={absoluteProductUrl(product.slug)} />
      )}
    </>
  );
}
