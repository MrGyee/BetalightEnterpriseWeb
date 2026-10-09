"use client";

import { useState } from "react";
import { SolarCalculator } from "@/components/solar-calculator/solar-calculator";
import { QuickToolsGrid } from "@/components/solar-calculator/quick-tools";
import type { SolarCalculatorSettingsRecord } from "@/lib/store/solar-calculator.store";
import { cn } from "@/lib/utils";

type Section = "estimate" | "tools";

export function SolarToolsSection({ pricing }: { pricing: SolarCalculatorSettingsRecord }) {
  const [section, setSection] = useState<Section>("estimate");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSection("estimate")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
            section === "estimate" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          Full Estimate
        </button>
        <button
          type="button"
          onClick={() => setSection("tools")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
            section === "tools" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          Quick Tools
        </button>
      </div>

      <div className="mt-8">{section === "estimate" ? <SolarCalculator pricing={pricing} /> : <QuickToolsGrid />}</div>
    </div>
  );
}
