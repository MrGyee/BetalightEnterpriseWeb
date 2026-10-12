import Link from "next/link";
import { Pencil } from "lucide-react";
import { getInverterModels } from "@/lib/data/catalog";
import { formatKsh } from "@/lib/solar-calculator";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteInverterModelAction } from "@/app/actions/admin/inverter-models";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Solar Inverter Models", robots: { index: false, follow: false } };

export default async function AdminInverterModelsPage() {
  const inverterModels = await getInverterModels().catch(() => []);

  return (
    <div>
      <AdminListHeader
        title="Solar Inverter Models"
        description={`${inverterModels.length} models shown in the Inverter Size quick tool at /solar-cost-estimate.`}
        newHref="/admin/inverter-models/new"
        newLabel="Add Inverter Model"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>kVA</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inverterModels.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No inverter models yet — the quick tool falls back to a rounded size estimate until you add some.
                </TableCell>
              </TableRow>
            )}
            {inverterModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium text-foreground">{model.label}</TableCell>
                <TableCell className="text-muted-foreground">{model.kva} kVA</TableCell>
                <TableCell className="text-muted-foreground">{formatKsh(model.priceKsh)}</TableCell>
                <TableCell className="text-muted-foreground">{model.sortOrder}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/inverter-models/${model.id}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteInverterModelAction.bind(null, model.id)} />
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
