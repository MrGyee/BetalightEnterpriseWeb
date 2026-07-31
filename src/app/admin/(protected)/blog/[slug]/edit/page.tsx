import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/data/catalog";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BlogForm } from "@/components/admin/blog/blog-form";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${post.title}`} description="Update this article." />
      <div className="mt-6">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
