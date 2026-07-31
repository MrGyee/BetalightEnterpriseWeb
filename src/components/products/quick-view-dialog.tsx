"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { Eye } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductRecord } from "@/lib/store/catalog.store";

export function QuickViewDialog({ product }: { product: ProductRecord }) {
  return (
    <Dialog>
      <DialogTrigger
        onClick={(e: MouseEvent) => e.stopPropagation()}
        render={
          <button
            type="button"
            aria-label={`Quick view ${product.name}`}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition-transform hover:scale-105"
          />
        }
      >
        <Eye className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <Image src={product.imagePath} alt={product.name} fill sizes="400px" className="object-cover" />
          </div>
          <div className="flex flex-col">
            {product.brand && <p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.brand}</p>}
            <h3 className="mt-1 font-heading text-xl font-bold text-foreground">{product.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{product.shortDescription}</p>
            <dl className="mt-4 space-y-1.5">
              {Object.entries(product.specs)
                .slice(0, 4)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-3 text-xs">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="text-right font-medium text-foreground">{value}</dd>
                  </div>
                ))}
            </dl>
            <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
              <Link href={`/quote?product=${product.slug}`} className={cn(buttonVariants(), "flex-1")}>
                Request Quote
              </Link>
              <Link href={`/products/${product.slug}`} className={cn(buttonVariants({ variant: "outline" }), "flex-1")}>
                View Details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
