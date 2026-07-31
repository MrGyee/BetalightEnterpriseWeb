import Link from "next/link";
import { Pencil } from "lucide-react";
import { getBlogPosts } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteBlogPostAction } from "@/app/actions/admin/blog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog", robots: { index: false, follow: false } };

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <AdminListHeader title="Blog" description={`${posts.length} posts.`} newHref="/admin/blog/new" newLabel="Add Post" />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.slug}>
                <TableCell className="font-medium text-foreground">{post.title}</TableCell>
                <TableCell className="text-muted-foreground">{post.category}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/blog/${post.slug}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteBlogPostAction.bind(null, post.slug)} />
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
