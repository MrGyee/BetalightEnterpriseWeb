import { selectAll, selectBySlug } from "@/lib/supabase/db-helpers";

export interface ProductRecord {
  slug: string;
  name: string;
  category: string;
  brand: string | null;
  shortDescription: string;
  description: string;
  imagePath: string;
  specs: Record<string, string>;
  featured: boolean;
}

export interface ProjectRecord {
  slug: string;
  title: string;
  category: string;
  description: string;
  location: string;
  imagePath: string;
  completedDate: string | null;
}

export interface BlogPostRecord {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImagePath: string | null;
  category: string;
  seoDescription: string;
  publishedAt: string;
}

export interface TestimonialRecord {
  authorName: string;
  roleOrCompany: string;
  quote: string;
  rating: number;
  photoPath: string | null;
}

export interface FaqRecord {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

interface ProductRow {
  slug: string;
  name: string;
  category: string;
  brand: string | null;
  short_description: string;
  description: string;
  image_path: string;
  specs: Record<string, string>;
  featured: boolean;
}

interface ProjectRow {
  slug: string;
  title: string;
  category: string;
  description: string;
  location: string;
  image_path: string;
  completed_date: string | null;
}

interface BlogPostRow {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_path: string | null;
  category: string;
  seo_description: string;
  published_at: string;
}

interface TestimonialRow {
  author_name: string;
  role_or_company: string;
  quote: string;
  rating: number;
  photo_path: string | null;
}

interface FaqRow {
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

const mapProduct = (row: ProductRow): ProductRecord => ({
  slug: row.slug,
  name: row.name,
  category: row.category,
  brand: row.brand,
  shortDescription: row.short_description,
  description: row.description,
  imagePath: row.image_path,
  specs: row.specs ?? {},
  featured: row.featured,
});

const mapProject = (row: ProjectRow): ProjectRecord => ({
  slug: row.slug,
  title: row.title,
  category: row.category,
  description: row.description,
  location: row.location,
  imagePath: row.image_path,
  completedDate: row.completed_date,
});

const mapBlogPost = (row: BlogPostRow): BlogPostRecord => ({
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  coverImagePath: row.cover_image_path,
  category: row.category,
  seoDescription: row.seo_description,
  publishedAt: row.published_at,
});

const mapTestimonial = (row: TestimonialRow): TestimonialRecord => ({
  authorName: row.author_name,
  roleOrCompany: row.role_or_company,
  quote: row.quote,
  rating: row.rating,
  photoPath: row.photo_path,
});

const mapFaq = (row: FaqRow): FaqRecord => ({
  question: row.question,
  answer: row.answer,
  category: row.category,
  sortOrder: row.sort_order,
});

export const catalogStore = {
  listProducts: () => selectAll("products", mapProduct, "name", true),
  getProductBySlug: (slug: string) => selectBySlug("products", slug, mapProduct),
  listProjects: () => selectAll("projects", mapProject, "completed_date", false),
  getProjectBySlug: (slug: string) => selectBySlug("projects", slug, mapProject),
  listBlogPosts: () => selectAll("blog_posts", mapBlogPost, "published_at", false),
  getBlogPostBySlug: (slug: string) => selectBySlug("blog_posts", slug, mapBlogPost),
  listTestimonials: () => selectAll("testimonials", mapTestimonial, "created_at", false),
  listFaqs: () => selectAll("faqs", mapFaq, "sort_order", true),
};
