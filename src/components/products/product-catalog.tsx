"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/product-card";
import { categoryToSlug } from "@/lib/category-slug";
import type { ProductRecord } from "@/lib/store/catalog.store";

export function ProductCatalog({ products }: { products: ProductRecord[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return unique;
  }, [products]);

  const brands = useMemo(() => {
    // Trimmed so a stray leading/trailing space typed in admin can't split one
    // brand into two chips — brand has no dropdown, so it's free text.
    const unique = Array.from(new Set(products.map((p) => p.brand?.trim()).filter((b): b is string => !!b)));
    return unique.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory ? (categories.find((c) => categoryToSlug(c) === initialCategory) ?? null) : null
  );
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchesCategory = !activeCategory || p.category === activeCategory;
    const matchesBrand = !activeBrand || p.brand?.trim() === activeBrand;
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
      (p.brand ?? "").toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesBrand && matchesQuery;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} products</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge
          onClick={() => setActiveCategory(null)}
          variant={activeCategory === null ? "default" : "secondary"}
          className="cursor-pointer select-none px-3 py-1.5 text-sm"
        >
          All Categories
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat}
            onClick={() => setActiveCategory(cat)}
            variant={activeCategory === cat ? "default" : "secondary"}
            className="cursor-pointer select-none px-3 py-1.5 text-sm"
          >
            {cat}
          </Badge>
        ))}
      </div>

      {brands.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Brand:</span>
          <Badge
            onClick={() => setActiveBrand(null)}
            variant={activeBrand === null ? "default" : "outline"}
            className="cursor-pointer select-none px-3 py-1 text-xs"
          >
            All Brands
          </Badge>
          {brands.map((brand) => (
            <Badge
              key={brand}
              onClick={() => setActiveBrand(brand)}
              variant={activeBrand === brand ? "default" : "outline"}
              className="cursor-pointer select-none px-3 py-1 text-xs"
            >
              {brand}
            </Badge>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No products match your search. Try a different keyword.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
