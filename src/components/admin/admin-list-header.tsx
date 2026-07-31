import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminListHeader({
  title,
  description,
  newHref,
  newLabel = "Add New",
}: {
  title: string;
  description?: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {newHref && (
        <Link href={newHref} className={cn(buttonVariants(), "rounded-full")}>
          <Plus className="size-4" />
          {newLabel}
        </Link>
      )}
    </div>
  );
}
