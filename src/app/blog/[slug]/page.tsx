import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { getBlogPostBySlug } from "@/lib/data/catalog";
import { articleSchema } from "@/lib/seo/schema";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) return {};

  return {
    title: post.title,
    description: post.seoDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: post.coverImagePath
      ? { title: post.title, description: post.seoDescription, images: [{ url: post.coverImagePath }] }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n");

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <JsonLd data={articleSchema(post)} />
      <Breadcrumbs items={[{ name: "Blog", url: "/blog" }, { name: post.title, url: `/blog/${post.slug}` }]} />

      <span className="mt-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {post.category}
      </span>
      <h1 className="mt-3 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">{post.title}</h1>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <CalendarDays className="size-4" />
        {new Date(post.publishedAt).toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      {post.coverImagePath && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          <Image src={post.coverImagePath} alt={post.title} fill sizes="(min-width: 768px) 700px, 100vw" className="object-cover" priority />
        </div>
      )}

      <div className="mt-8">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="mt-4 text-base leading-relaxed text-foreground/90 first:mt-0">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
