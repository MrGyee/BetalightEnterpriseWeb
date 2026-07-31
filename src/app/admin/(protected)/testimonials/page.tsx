import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { getTestimonials } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTestimonialAction } from "@/app/actions/admin/testimonials";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Testimonials", robots: { index: false, follow: false } };

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <AdminListHeader
        title="Testimonials"
        description={`${testimonials.length} client testimonials.`}
        newHref="/admin/testimonials/new"
        newLabel="Add Testimonial"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium text-foreground">{t.authorName}</TableCell>
                <TableCell className="text-muted-foreground">{t.roleOrCompany}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-primary">
                    <Star className="size-3.5" fill="currentColor" strokeWidth={0} />
                    {t.rating}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/testimonials/${t.id}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteTestimonialAction.bind(null, t.id)} />
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
