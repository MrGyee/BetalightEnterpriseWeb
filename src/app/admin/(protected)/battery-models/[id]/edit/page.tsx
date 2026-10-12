import { notFound } from "next/navigation";
import { getBatteryModelById } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BatteryModelForm } from "@/components/admin/battery-models/battery-model-form";

export const dynamic = "force-dynamic";

export default async function EditBatteryModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const batteryModel = await getBatteryModelById(id);
  if (!batteryModel) notFound();

  return (
    <div>
      <AdminListHeader title="Edit Battery Model" description="Update this battery's capacity, chemistry or price." />
      <div className="mt-6">
        <BatteryModelForm batteryModel={batteryModel} />
      </div>
    </div>
  );
}
