import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getBlogPosts } from "@/lib/data/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides on solar energy, electrical safety and power protection for Kenyan homes and businesses.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Blog", url: "/blog" }]} />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Blog</h1>
        <p className="mt-4 text-muted-foreground">Practical, no-nonsense guides on solar energy and electrical safety in Kenya.</p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">New articles are on the way. Check back soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {post.coverImagePath && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={post.coverImagePath}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <span className="w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {post.category}
                </span>
                <h2 className="mt-3 font-heading text-lg font-bold leading-snug text-foreground">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
