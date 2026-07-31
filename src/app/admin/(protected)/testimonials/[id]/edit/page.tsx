import { notFound } from "next/navigation";
import { getTestimonialById } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);
  if (!testimonial) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${testimonial.authorName}`} description="Update this testimonial." />
      <div className="mt-6">
        <TestimonialForm testimonial={testimonial} />
      </div>
    </div>
  );
}
