import Link from "next/link";
import { Pencil } from "lucide-react";
import { getBatteryModels } from "@/lib/data/catalog";
import { formatKsh } from "@/lib/solar-calculator";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteBatteryModelAction } from "@/app/actions/admin/battery-models";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Solar Battery Models", robots: { index: false, follow: false } };

const chemistryLabel = { lithium: "Lithium (LiFePO4)", gel: "Gel" } as const;

export default async function AdminBatteryModelsPage() {
  const batteryModels = await getBatteryModels().catch(() => []);

  return (
    <div>
      <AdminListHeader
        title="Solar Battery Models"
        description={`${batteryModels.length} models shown in the Battery Size quick tool at /solar-cost-estimate.`}
        newHref="/admin/battery-models/new"
        newLabel="Add Battery Model"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Chemistry</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batteryModels.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No battery models yet — the quick tool falls back to a generic reference battery until you add some.
                </TableCell>
              </TableRow>
            )}
            {batteryModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium text-foreground">{model.label}</TableCell>
                <TableCell className="text-muted-foreground">{model.capacityKwh} kWh</TableCell>
                <TableCell className="text-muted-foreground">{chemistryLabel[model.chemistry]}</TableCell>
                <TableCell className="text-muted-foreground">{formatKsh(model.priceKsh)}</TableCell>
                <TableCell className="text-muted-foreground">{model.sortOrder}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/battery-models/${model.id}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteBatteryModelAction.bind(null, model.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
