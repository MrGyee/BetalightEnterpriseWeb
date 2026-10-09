"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  sizeInverter,
  sizeBattery,
  sizePanelArray,
  sizeBreaker,
  REFERENCE_BATTERY_KWH,
  REFERENCE_PANEL_WATTS,
  type BatteryChemistry,
  type ElectricalPhase,
} from "@/lib/solar-calculator";
import { cn } from "@/lib/utils";

// A translucent background (the original bg-transparent + dark:bg-input/30)
// looks fine on the closed trigger, but browsers paint the native dropdown
// popup using that same author-set background — so the popup rendered
// near-white while this text color stayed light for contrast against the
// dark card behind it, making options unreadable. bg-background is opaque
// and already theme-correct in both modes, so the popup matches the trigger.
const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function ToolCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Result({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 rounded-xl bg-secondary/40 p-3 text-sm">{children}</div>;
}

function InverterSizeTool() {
  const [peakLoadWatts, setPeakLoadWatts] = useState<number>(0);
  const [headroomPercent, setHeadroomPercent] = useState<number>(25);
  const result = useMemo(() => sizeInverter({ peakLoadWatts, headroomPercent }), [peakLoadWatts, headroomPercent]);

  return (
    <ToolCard title="Inverter Size">
      <Field label="Total load running at once (W)" htmlFor="inv-load">
        <Input
          id="inv-load"
          type="number"
          min={0}
          value={peakLoadWatts || ""}
          onChange={(e) => setPeakLoadWatts(Math.max(0, Number(e.target.value)))}
          placeholder="e.g. 3500"
        />
      </Field>
      <Field label="Safety margin (%)" htmlFor="inv-margin">
        <Input
          id="inv-margin"
          type="number"
          min={0}
          max={100}
          value={headroomPercent}
          onChange={(e) => setHeadroomPercent(Math.max(0, Number(e.target.value)))}
        />
      </Field>
      {result && (
        <Result>
          <p>
            With margin: <strong>{Math.round(result.surgeWatts).toLocaleString("en-KE")} W</strong>
          </p>
          <p className="mt-1">
            Recommended inverter: <strong className="text-primary">{result.recommendedKva} kVA</strong>
          </p>
        </Result>
      )}
    </ToolCard>
  );
}

function BatterySizeTool() {
  const [dailyKwh, setDailyKwh] = useState<number>(0);
  const [autonomyDays, setAutonomyDays] = useState<number>(1);
  const [chemistry, setChemistry] = useState<BatteryChemistry>("lithium");
  const result = useMemo(
    () => sizeBattery({ dailyEnergyWh: dailyKwh * 1000, autonomyDays, chemistry }),
    [dailyKwh, autonomyDays, chemistry]
  );

  return (
    <ToolCard title="Battery Size">
      <Field label="Daily usage (kWh)" htmlFor="bat-kwh">
        <Input
          id="bat-kwh"
          type="number"
          min={0}
          step={0.1}
          value={dailyKwh || ""}
          onChange={(e) => setDailyKwh(Math.max(0, Number(e.target.value)))}
          placeholder="e.g. 5"
        />
      </Field>
      <Field label="Days of autonomy" htmlFor="bat-days">
        <Input
          id="bat-days"
          type="number"
          min={1}
          max={5}
          value={autonomyDays}
          onChange={(e) => setAutonomyDays(Math.max(1, Number(e.target.value)))}
        />
      </Field>
      <Field label="Battery type" htmlFor="bat-chem">
        <select id="bat-chem" className={selectClassName} value={chemistry} onChange={(e) => setChemistry(e.target.value as BatteryChemistry)}>
          <option value="lithium">Lithium (LiFePO4)</option>
          <option value="gel">Gel</option>
        </select>
      </Field>
      {result && (
        <Result>
          <p>
            Battery bank needed: <strong className="text-primary">{result.batteryKwh.toFixed(2)} kWh</strong>
          </p>
          <p className="mt-1 text-muted-foreground">
            ≈ {result.referenceBatteryCount} × our {REFERENCE_BATTERY_KWH} kWh (200Ah) lithium battery
          </p>
        </Result>
      )}
    </ToolCard>
  );
}

function PanelSizeTool() {
  const [dailyKwh, setDailyKwh] = useState<number>(0);
  const [panelWattage, setPanelWattage] = useState<number>(REFERENCE_PANEL_WATTS);
  const result = useMemo(
    () => sizePanelArray({ dailyEnergyWh: dailyKwh * 1000, panelWattage }),
    [dailyKwh, panelWattage]
  );

  return (
    <ToolCard title="Solar Panel Size">
      <Field label="Daily usage (kWh)" htmlFor="pnl-kwh">
        <Input
          id="pnl-kwh"
          type="number"
          min={0}
          step={0.1}
          value={dailyKwh || ""}
          onChange={(e) => setDailyKwh(Math.max(0, Number(e.target.value)))}
          placeholder="e.g. 5"
        />
      </Field>
      <Field label="Panel wattage (W)" htmlFor="pnl-watt">
        <Input
          id="pnl-watt"
          type="number"
          min={1}
          value={panelWattage}
          onChange={(e) => setPanelWattage(Math.max(1, Number(e.target.value)))}
        />
      </Field>
      {result && (
        <Result>
          <p>
            Array size needed: <strong className="text-primary">{Math.round(result.arrayWp).toLocaleString("en-KE")} Wp</strong>
          </p>
          <p className="mt-1 text-muted-foreground">
            ≈ {result.panelCount} × {panelWattage}W panels
          </p>
        </Result>
      )}
    </ToolCard>
  );
}

function BreakerSizeTool() {
  const [outputWatts, setOutputWatts] = useState<number>(0);
  const [voltage, setVoltage] = useState<number>(230);
  const [phase, setPhase] = useState<ElectricalPhase>("single");
  const [marginPercent, setMarginPercent] = useState<number>(25);
  const result = useMemo(
    () => sizeBreaker({ outputWatts, voltage, phase, marginPercent }),
    [outputWatts, voltage, phase, marginPercent]
  );

  return (
    <ToolCard title="Breaker Size">
      <Field label="Output / load (W)" htmlFor="brk-watts">
        <Input
          id="brk-watts"
          type="number"
          min={0}
          value={outputWatts || ""}
          onChange={(e) => setOutputWatts(Math.max(0, Number(e.target.value)))}
          placeholder="e.g. 6000"
        />
      </Field>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Field label="Voltage (V)" htmlFor="brk-volts">
          <Input id="brk-volts" type="number" min={1} value={voltage} onChange={(e) => setVoltage(Math.max(1, Number(e.target.value)))} />
        </Field>
        <Field label="Phase" htmlFor="brk-phase">
          <select id="brk-phase" className={selectClassName} value={phase} onChange={(e) => setPhase(e.target.value as ElectricalPhase)}>
            <option value="single">Single</option>
            <option value="three">Three</option>
          </select>
        </Field>
      </div>
      <Field label="Safety margin (%)" htmlFor="brk-margin">
        <Input
          id="brk-margin"
          type="number"
          min={0}
          max={100}
          value={marginPercent}
          onChange={(e) => setMarginPercent(Math.max(0, Number(e.target.value)))}
        />
      </Field>
      {result && (
        <Result>
          <p>
            Current with margin: <strong>{result.currentWithMarginA.toFixed(1)} A</strong>
          </p>
          <p className="mt-1">
            Recommended breaker: <strong className="text-primary">{result.recommendedBreakerA} A</strong>
          </p>
        </Result>
      )}
    </ToolCard>
  );
}

export function QuickToolsGrid() {
  return (
    <div>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Already know one number? Get a single sizing answer without the full appliance walkthrough. These give a size
        only, not a cost — use the Full Estimate tab for pricing.
      </p>
      <div className={cn("mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2")}>
        <InverterSizeTool />
        <BatterySizeTool />
        <PanelSizeTool />
        <BreakerSizeTool />
      </div>
    </div>
  );
}
