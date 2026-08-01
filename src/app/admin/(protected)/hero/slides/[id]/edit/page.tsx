import { notFound } from "next/navigation";
import { getHeroSlideById } from "@/lib/data/hero";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { HeroSlideForm } from "@/components/admin/hero/hero-slide-form";

export const dynamic = "force-dynamic";

export default async function EditHeroSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slide = await getHeroSlideById(id);
  if (!slide) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${slide.title}`} description="Update this hero slideshow photo." />
      <div className="mt-6">
        <HeroSlideForm slide={slide} />
      </div>
    </div>
  );
}
