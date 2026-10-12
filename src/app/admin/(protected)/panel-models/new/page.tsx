import { AdminListHeader } from "@/components/admin/admin-list-header";
import { PanelModelForm } from "@/components/admin/panel-models/panel-model-form";

export const dynamic = "force-dynamic";

export default function NewPanelModelPage() {
  return (
    <div>
      <AdminListHeader title="Add Panel Model" description="Add a solar panel model with its real wattage and price." />
      <div className="mt-6">
        <PanelModelForm />
      </div>
    </div>
  );
}
