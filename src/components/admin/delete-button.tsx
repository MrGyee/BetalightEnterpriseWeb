"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  confirmMessage = "Are you sure you want to delete this item? This cannot be undone.",
}: {
  action: () => Promise<{ success: boolean; error?: string }>;
  confirmMessage?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast.success("Deleted successfully.");
        router.refresh();
      } else {
        toast.error(result.error ?? "Failed to delete.");
      }
    });
  }

  return (
    <Button type="button" variant="destructive" size="icon-sm" onClick={handleClick} disabled={isPending} aria-label="Delete">
      <Trash2 className="size-3.5" />
    </Button>
  );
}
