import Link from "next/link";
import { Images } from "lucide-react";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { HeroContentForm } from "@/components/admin/hero/hero-content-form";
import { getHeroContentFormValues } from "@/app/actions/admin/hero";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const values = await getHeroContentFormValues();

  return (
    <div>
      <AdminListHeader
        title="Homepage Hero"
        description="Badge, headline, subheadline, trust points and stats shown in the homepage hero."
      />
      <Link
        href="/admin/hero/slides"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Images className="size-4" />
        Manage hero photos &amp; slideshow
      </Link>
      <div className="mt-6">
        <HeroContentForm defaultValues={values} />
      </div>
    </div>
  );
}
