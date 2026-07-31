/**
 * One-time seed: loads data/*.json content into a fresh Supabase database
 * (see supabase/schema.sql). Run once after creating the schema, against an
 * empty database — slug-keyed tables (products, projects, blog_posts) fail
 * on a unique violation if run twice.
 *
 * Usage (from betalight-web/):
 *   npx tsx --env-file=.env.local scripts/seed-supabase.ts
 *
 * Does not import src/lib/supabase/server-client.ts because that file pulls
 * in `server-only`, which throws when required outside a Next.js server
 * bundle (this runs as a plain Node script via tsx).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Run with:\n" +
      "  npx tsx --env-file=.env.local scripts/seed-supabase.ts"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const dataDir = path.join(__dirname, "..", "data");

function loadJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(dataDir, file), "utf8")) as T;
}

async function insertRows(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no generated Database type for a dynamic table name.
  const { error } = await (supabase.from(table) as any).insert(rows);
  if (error) throw new Error(`[${table}] insert failed: ${error.message}`);
  console.log(`  ${table}: inserted ${rows.length} row(s)`);
}

interface ProductJson {
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

interface ProjectJson {
  slug: string;
  title: string;
  category: string;
  location: string;
  completedDate: string;
  imagePath: string;
  description: string;
}

interface BlogPostJson {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  coverImagePath: string;
  seoDescription: string;
  excerpt: string;
  content: string;
}

interface TestimonialJson {
  authorName: string;
  roleOrCompany: string;
  quote: string;
  rating: number;
  photoPath: string | null;
}

interface FaqJson {
  category: string;
  sortOrder: number;
  question: string;
  answer: string;
}

async function seedProducts() {
  const products = loadJson<ProductJson[]>("products.json");
  await insertRows(
    "products",
    products.map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      brand: p.brand,
      short_description: p.shortDescription,
      description: p.description,
      image_path: p.imagePath,
      specs: p.specs,
      featured: p.featured,
    }))
  );
}

async function seedProjects() {
  const projects = loadJson<ProjectJson[]>("projects.json");
  await insertRows(
    "projects",
    projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      location: p.location,
      completed_date: p.completedDate,
      image_path: p.imagePath,
      description: p.description,
    }))
  );
}

async function seedBlogPosts() {
  const posts = loadJson<BlogPostJson[]>("blog-posts.json");
  await insertRows(
    "blog_posts",
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      published_at: p.publishedAt,
      cover_image_path: p.coverImagePath,
      seo_description: p.seoDescription,
      excerpt: p.excerpt,
      content: p.content,
    }))
  );
}

async function seedTestimonials() {
  const testimonials = loadJson<TestimonialJson[]>("testimonials.json");
  await insertRows(
    "testimonials",
    testimonials.map((t) => ({
      author_name: t.authorName,
      role_or_company: t.roleOrCompany,
      quote: t.quote,
      rating: t.rating,
      photo_path: t.photoPath,
    }))
  );
}

async function seedFaqs() {
  const faqs = loadJson<FaqJson[]>("faqs.json");
  await insertRows(
    "faqs",
    faqs.map((f) => ({
      category: f.category,
      sort_order: f.sortOrder,
      question: f.question,
      answer: f.answer,
    }))
  );
}

async function main() {
  console.log(`Seeding ${url} from data/*.json ...\n`);
  await seedProducts();
  await seedProjects();
  await seedBlogPosts();
  await seedTestimonials();
  await seedFaqs();
  console.log("\nDone.");
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
