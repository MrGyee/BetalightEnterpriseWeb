import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getProjects } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProjectAction } from "@/app/actions/admin/projects";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects", robots: { index: false, follow: false } };

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <AdminListHeader title="Projects" description={`${projects.length} projects.`} newHref="/admin/projects/new" newLabel="Add Project" />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.slug}>
                <TableCell>
                  <div className="relative size-9 overflow-hidden rounded-lg bg-muted">
                    <Image src={p.imagePath} alt={p.title} fill sizes="36px" className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                <TableCell className="text-muted-foreground">{p.category}</TableCell>
                <TableCell className="text-muted-foreground">{p.location}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/projects/${p.slug}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteProjectAction.bind(null, p.slug)} />
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
