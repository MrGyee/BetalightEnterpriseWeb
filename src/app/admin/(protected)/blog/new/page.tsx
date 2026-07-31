import { AdminListHeader } from "@/components/admin/admin-list-header";
import { BlogForm } from "@/components/admin/blog/blog-form";

export const dynamic = "force-dynamic";

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminListHeader title="Add Blog Post" description="Write a new article." />
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
