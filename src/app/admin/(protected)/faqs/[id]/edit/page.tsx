import { notFound } from "next/navigation";
import { getFaqById } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { FaqForm } from "@/components/admin/faqs/faq-form";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await getFaqById(id);
  if (!faq) notFound();

  return (
    <div>
      <AdminListHeader title="Edit FAQ" description="Update this question." />
      <div className="mt-6">
        <FaqForm faq={faq} />
      </div>
    </div>
  );
}
