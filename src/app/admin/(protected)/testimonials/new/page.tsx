import { AdminListHeader } from "@/components/admin/admin-list-header";
import { TestimonialForm } from "@/components/admin/testimonials/testimonial-form";

export const dynamic = "force-dynamic";

export default function NewTestimonialPage() {
  return (
    <div>
      <AdminListHeader title="Add Testimonial" description="Add a new client testimonial." />
      <div className="mt-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
