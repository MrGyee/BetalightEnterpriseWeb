import { notFound } from "next/navigation";
import { getInverterModelById } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { InverterModelForm } from "@/components/admin/inverter-models/inverter-model-form";

export const dynamic = "force-dynamic";

export default async function EditInverterModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inverterModel = await getInverterModelById(id);
  if (!inverterModel) notFound();

  return (
    <div>
      <AdminListHeader title="Edit Inverter Model" description="Update this inverter's kVA rating or price." />
      <div className="mt-6">
        <InverterModelForm inverterModel={inverterModel} />
      </div>
    </div>
  );
}
