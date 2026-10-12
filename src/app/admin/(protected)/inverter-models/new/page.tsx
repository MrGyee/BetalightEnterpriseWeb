import { AdminListHeader } from "@/components/admin/admin-list-header";
import { InverterModelForm } from "@/components/admin/inverter-models/inverter-model-form";

export const dynamic = "force-dynamic";

export default function NewInverterModelPage() {
  return (
    <div>
      <AdminListHeader title="Add Inverter Model" description="Add a hybrid inverter model with its real kVA rating and price." />
      <div className="mt-6">
        <InverterModelForm />
      </div>
    </div>
  );
}
