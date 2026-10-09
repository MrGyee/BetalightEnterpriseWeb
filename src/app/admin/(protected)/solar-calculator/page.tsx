import { AdminListHeader } from "@/components/admin/admin-list-header";
import { SolarCalculatorSettingsForm } from "@/components/admin/solar-calculator/solar-calculator-settings-form";
import { getSolarCalculatorFormValues } from "@/app/actions/admin/solar-calculator";

export const dynamic = "force-dynamic";

export default async function AdminSolarCalculatorPage() {
  const values = await getSolarCalculatorFormValues();

  return (
    <div>
      <AdminListHeader
        title="Solar Calculator"
        description="Unit prices behind the public solar cost estimate at /solar-cost-estimate."
      />
      <div className="mt-6">
        <SolarCalculatorSettingsForm defaultValues={values} />
      </div>
    </div>
  );
}
