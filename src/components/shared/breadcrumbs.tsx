import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";

export function Breadcrumbs({ items }: { items: { name: string; url: string }[] }) {
  const allItems = [{ name: "Home", url: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      <JsonLd data={breadcrumbSchema(allItems)} />
      <Link href="/" className="flex items-center hover:text-primary">
        <Home className="size-3.5" />
      </Link>
      {items.map((item, index) => (
        <span key={item.url} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5" />
          {index === items.length - 1 ? (
            <span className="font-medium text-foreground">{item.name}</span>
          ) : (
            <Link href={item.url} className="hover:text-primary">
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
