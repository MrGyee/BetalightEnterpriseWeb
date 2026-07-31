"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LogoutButton } from "@/components/admin/logout-button";
import { siteConfig } from "@/lib/site-config";

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-background lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <Image src="/images/brand/betalight-logo.jpeg" alt={siteConfig.name} width={32} height={32} className="size-8 rounded-full" />
          <span className="font-heading text-sm font-semibold text-foreground">Betalight Admin</span>
        </div>
        <AdminSidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" />} className="lg:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Betalight Admin</SheetTitle>
                </SheetHeader>
                <div onClick={() => setOpen(false)}>
                  <AdminSidebar />
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" target="_blank" className="text-xs font-medium text-muted-foreground hover:text-primary">
              View site &#8599;
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
