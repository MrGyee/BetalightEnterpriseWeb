"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button type="button" variant="ghost" size="sm" disabled={isPending} onClick={() => startTransition(() => logout())}>
      <LogOut className="size-3.5" />
      Sign Out
    </Button>
  );
}
