import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BatteryModelForm } from "@/components/admin/battery-models/battery-model-form";

export const dynamic = "force-dynamic";

export default function NewBatteryModelPage() {
  return (
    <div>
      <AdminListHeader title="Add Battery Model" description="Add a battery model with its real capacity, chemistry and price." />
      <div className="mt-6">
        <BatteryModelForm />
      </div>
    </div>
  );
}
