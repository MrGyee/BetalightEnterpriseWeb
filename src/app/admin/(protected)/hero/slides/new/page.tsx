import { AdminListHeader } from "@/components/admin/admin-list-header";
import { HeroSlideForm } from "@/components/admin/hero/hero-slide-form";

export const dynamic = "force-dynamic";

export default function NewHeroSlidePage() {
  return (
    <div>
      <AdminListHeader title="Add Hero Slide" description="Add a new photo to the homepage hero slideshow." />
      <div className="mt-6">
        <HeroSlideForm />
      </div>
    </div>
  );
}
