import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { QuickViewDialog } from "@/components/products/quick-view-dialog";
import type { ProductRecord } from "@/lib/store/catalog.store";

export function ProductCard({ product }: { product: ProductRecord }) {
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
      <QuickViewDialog product={product} />
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col p-4">
        {product.brand && <p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.brand}</p>}
        <h3 className="mt-1 font-heading text-base font-bold leading-snug text-foreground">{product.name}</h3>
        <p className="mt-1.5 flex-1 text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
        <span className="mt-3 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          Request Quote
        </span>
      </Link>
    </div>
  );
}
