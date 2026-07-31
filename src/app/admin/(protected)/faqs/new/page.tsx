import { AdminListHeader } from "@/components/admin/admin-list-header";
import { FaqForm } from "@/components/admin/faqs/faq-form";

export const dynamic = "force-dynamic";

export default function NewFaqPage() {
  return (
    <div>
      <AdminListHeader title="Add FAQ" description="Add a new frequently asked question." />
      <div className="mt-6">
        <FaqForm />
      </div>
    </div>
  );
}
