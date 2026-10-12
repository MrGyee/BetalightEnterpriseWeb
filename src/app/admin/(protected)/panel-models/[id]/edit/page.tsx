import { notFound } from "next/navigation";
import { getPanelModelById } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { PanelModelForm } from "@/components/admin/panel-models/panel-model-form";

export const dynamic = "force-dynamic";

export default async function EditPanelModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const panelModel = await getPanelModelById(id);
  if (!panelModel) notFound();

  return (
    <div>
      <AdminListHeader title="Edit Panel Model" description="Update this panel's wattage or price." />
      <div className="mt-6">
        <PanelModelForm panelModel={panelModel} />
      </div>
    </div>
  );
}
