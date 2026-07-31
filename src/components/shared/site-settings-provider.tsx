"use client";

import { createContext, useContext } from "react";
import type { SiteSettingsRecord } from "@/lib/store/settings.store";

const SiteSettingsContext = createContext<SiteSettingsRecord | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettingsRecord;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings(): SiteSettingsRecord {
  const settings = useContext(SiteSettingsContext);
  if (!settings) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return settings;
}
