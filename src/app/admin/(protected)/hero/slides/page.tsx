import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { getHeroSlides } from "@/lib/data/hero";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteHeroSlideAction } from "@/app/actions/admin/hero";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Hero Slides", robots: { index: false, follow: false } };

export default async function AdminHeroSlidesPage() {
  const slides = await getHeroSlides();

  return (
    <div>
      <AdminListHeader
        title="Hero Slideshow Photos"
        description={`${slides.length} slides shown in the homepage hero, in order.`}
        newHref="/admin/hero/slides/new"
        newLabel="Add Slide"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.map((slide) => (
              <TableRow key={slide.id}>
                <TableCell>
                  <div className="relative size-12 overflow-hidden rounded-md border border-border">
                    <Image src={slide.imagePath} alt={slide.alt} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="max-w-xs whitespace-normal font-medium text-foreground">{slide.title}</TableCell>
                <TableCell className="text-muted-foreground">{slide.location}</TableCell>
                <TableCell className="text-muted-foreground">{slide.category || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{slide.sortOrder}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/hero/slides/${slide.id}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteHeroSlideAction.bind(null, slide.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
