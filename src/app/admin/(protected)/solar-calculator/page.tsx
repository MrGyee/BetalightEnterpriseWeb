import Link from "next/link";
import { Sun, Zap, BatteryCharging, ArrowRight } from "lucide-react";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { SolarCalculatorSettingsForm } from "@/components/admin/solar-calculator/solar-calculator-settings-form";
import { getSolarCalculatorFormValues } from "@/app/actions/admin/solar-calculator";
import { getPanelModels, getInverterModels, getBatteryModels } from "@/lib/data/catalog";

export const dynamic = "force-dynamic";

const modelLinks = [
  { href: "/admin/panel-models", label: "Panel Models", icon: Sun },
  { href: "/admin/inverter-models", label: "Inverter Models", icon: Zap },
  { href: "/admin/battery-models", label: "Battery Models", icon: BatteryCharging },
] as const;

export default async function AdminSolarCalculatorPage() {
  const [values, panelModels, inverterModels, batteryModels] = await Promise.all([
    getSolarCalculatorFormValues(),
    getPanelModels().catch(() => []),
    getInverterModels().catch(() => []),
    getBatteryModels().catch(() => []),
  ]);
  const counts = { "/admin/panel-models": panelModels.length, "/admin/inverter-models": inverterModels.length, "/admin/battery-models": batteryModels.length };

  return (
    <div>
      <AdminListHeader
        title="Solar Calculator"
        description="Pricing, and the named panel/inverter/battery models, behind the public solar cost estimate at /solar-cost-estimate."
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {modelLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <link.icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground">{counts[link.href]} model{counts[link.href] === 1 ? "" : "s"}</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">Pricing &amp; Settings</h2>
        <div className="mt-4">
          <SolarCalculatorSettingsForm defaultValues={values} />
        </div>
      </div>
    </div>
  );
}
