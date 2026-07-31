import type { MetadataRoute } from "next";
import { getProducts, getProjects, getBlogPosts } from "@/lib/data/catalog";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/solar-solutions`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/electrical-services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/projects`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/industries`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/faqs`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/quote`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/careers`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const [products, projects, blogPosts] = await Promise.all([
    getProducts().catch(() => []),
    getProjects().catch(() => []),
    getBlogPosts().catch(() => []),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects#${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...projectRoutes, ...blogRoutes];
}
