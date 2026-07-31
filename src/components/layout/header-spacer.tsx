"use client";

import { usePathname } from "next/navigation";

export function HeaderSpacer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) return null;
  return <div className="h-20 md:h-[136px]" aria-hidden />;
}
