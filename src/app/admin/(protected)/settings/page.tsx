import { AdminListHeader } from "@/components/admin/admin-list-header";
import { SiteSettingsForm } from "@/components/admin/settings/site-settings-form";
import { getSiteSettingsFormValues } from "@/app/actions/admin/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const values = await getSiteSettingsFormValues();

  return (
    <div>
      <AdminListHeader
        title="Contacts & Socials"
        description="Phone numbers, email, address, business hours and social links shown across the website."
      />
      <div className="mt-6">
        <SiteSettingsForm defaultValues={values} />
      </div>
    </div>
  );
}
