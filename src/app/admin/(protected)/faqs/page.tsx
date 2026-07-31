import Link from "next/link";
import { Pencil } from "lucide-react";
import { getFaqs } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteFaqAction } from "@/app/actions/admin/faqs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "FAQs", robots: { index: false, follow: false } };

export default async function AdminFaqsPage() {
  const faqs = await getFaqs();

  return (
    <div>
      <AdminListHeader title="FAQs" description={`${faqs.length} questions.`} newHref="/admin/faqs/new" newLabel="Add FAQ" />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="max-w-md whitespace-normal font-medium text-foreground">{faq.question}</TableCell>
                <TableCell className="text-muted-foreground">{faq.category}</TableCell>
                <TableCell className="text-muted-foreground">{faq.sortOrder}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/faqs/${faq.id}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteFaqAction.bind(null, faq.id)} />
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
