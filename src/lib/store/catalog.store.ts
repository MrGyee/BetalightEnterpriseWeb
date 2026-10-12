import { selectAll, selectBySlug, selectById, insertOne, updateByKey, deleteByKey } from "@/lib/supabase/db-helpers";

export interface ProductRecord {
  slug: string;
  name: string;
  category: string;
  brand: string | null;
  shortDescription: string;
  description: string;
  imagePath: string;
  /** Extra photos beyond the cover, in display order. */
  gallery: string[];
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
  /** Extra photos beyond the cover, in display order. */
  gallery: string[];
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
  id: string;
  authorName: string;
  roleOrCompany: string;
  quote: string;
  rating: number;
  photoPath: string | null;
}

export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface PanelModelRecord {
  id: string;
  label: string;
  watts: number;
  priceKsh: number;
  sortOrder: number;
}

export interface InverterModelRecord {
  id: string;
  label: string;
  kva: number;
  priceKsh: number;
  sortOrder: number;
}

export type BatteryModelChemistry = "lithium" | "gel";

export interface BatteryModelRecord {
  id: string;
  label: string;
  capacityKwh: number;
  chemistry: BatteryModelChemistry;
  priceKsh: number;
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
  gallery: string[] | null;
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
  gallery: string[] | null;
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
  id: string;
  author_name: string;
  role_or_company: string;
  quote: string;
  rating: number;
  photo_path: string | null;
}

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

interface PanelModelRow {
  id: string;
  label: string;
  watts: number;
  price_ksh: number;
  sort_order: number;
}

interface InverterModelRow {
  id: string;
  label: string;
  kva: number;
  price_ksh: number;
  sort_order: number;
}

interface BatteryModelRow {
  id: string;
  label: string;
  capacity_kwh: number;
  chemistry: BatteryModelChemistry;
  price_ksh: number;
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
  gallery: row.gallery ?? [],
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
  gallery: row.gallery ?? [],
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
  id: row.id,
  authorName: row.author_name,
  roleOrCompany: row.role_or_company,
  quote: row.quote,
  rating: row.rating,
  photoPath: row.photo_path,
});

const mapFaq = (row: FaqRow): FaqRecord => ({
  id: row.id,
  question: row.question,
  answer: row.answer,
  category: row.category,
  sortOrder: row.sort_order,
});

const mapPanelModel = (row: PanelModelRow): PanelModelRecord => ({
  id: row.id,
  label: row.label,
  watts: row.watts,
  priceKsh: row.price_ksh,
  sortOrder: row.sort_order,
});

const mapInverterModel = (row: InverterModelRow): InverterModelRecord => ({
  id: row.id,
  label: row.label,
  kva: row.kva,
  priceKsh: row.price_ksh,
  sortOrder: row.sort_order,
});

const mapBatteryModel = (row: BatteryModelRow): BatteryModelRecord => ({
  id: row.id,
  label: row.label,
  capacityKwh: row.capacity_kwh,
  chemistry: row.chemistry,
  priceKsh: row.price_ksh,
  sortOrder: row.sort_order,
});

function productToRow(p: Omit<ProductRecord, "slug"> & { slug: string }) {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    brand: p.brand,
    short_description: p.shortDescription,
    description: p.description,
    image_path: p.imagePath,
    gallery: p.gallery,
    specs: p.specs,
    featured: p.featured,
  };
}

function projectToRow(p: ProjectRecord) {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    description: p.description,
    location: p.location,
    image_path: p.imagePath,
    gallery: p.gallery,
    completed_date: p.completedDate,
  };
}

function blogPostToRow(p: BlogPostRecord) {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    cover_image_path: p.coverImagePath,
    category: p.category,
    seo_description: p.seoDescription,
    published_at: p.publishedAt,
  };
}

function testimonialToRow(t: Omit<TestimonialRecord, "id">) {
  return {
    author_name: t.authorName,
    role_or_company: t.roleOrCompany,
    quote: t.quote,
    rating: t.rating,
    photo_path: t.photoPath,
  };
}

function faqToRow(f: Omit<FaqRecord, "id">) {
  return {
    question: f.question,
    answer: f.answer,
    category: f.category,
    sort_order: f.sortOrder,
  };
}

function panelModelToRow(p: Omit<PanelModelRecord, "id">) {
  return {
    label: p.label,
    watts: p.watts,
    price_ksh: p.priceKsh,
    sort_order: p.sortOrder,
  };
}

function inverterModelToRow(m: Omit<InverterModelRecord, "id">) {
  return {
    label: m.label,
    kva: m.kva,
    price_ksh: m.priceKsh,
    sort_order: m.sortOrder,
  };
}

function batteryModelToRow(b: Omit<BatteryModelRecord, "id">) {
  return {
    label: b.label,
    capacity_kwh: b.capacityKwh,
    chemistry: b.chemistry,
    price_ksh: b.priceKsh,
    sort_order: b.sortOrder,
  };
}

export const catalogStore = {
  listProducts: () => selectAll("products", mapProduct, "name", true),
  getProductBySlug: (slug: string) => selectBySlug("products", slug, mapProduct),
  createProduct: (values: ProductRecord) => insertOne("products", productToRow(values), mapProduct),
  updateProduct: (slug: string, values: ProductRecord) => updateByKey("products", "slug", slug, productToRow(values), mapProduct),
  deleteProduct: (slug: string) => deleteByKey("products", "slug", slug),

  listProjects: () => selectAll("projects", mapProject, "completed_date", false),
  getProjectBySlug: (slug: string) => selectBySlug("projects", slug, mapProject),
  createProject: (values: ProjectRecord) => insertOne("projects", projectToRow(values), mapProject),
  updateProject: (slug: string, values: ProjectRecord) => updateByKey("projects", "slug", slug, projectToRow(values), mapProject),
  deleteProject: (slug: string) => deleteByKey("projects", "slug", slug),

  listBlogPosts: () => selectAll("blog_posts", mapBlogPost, "published_at", false),
  getBlogPostBySlug: (slug: string) => selectBySlug("blog_posts", slug, mapBlogPost),
  createBlogPost: (values: BlogPostRecord) => insertOne("blog_posts", blogPostToRow(values), mapBlogPost),
  updateBlogPost: (slug: string, values: BlogPostRecord) => updateByKey("blog_posts", "slug", slug, blogPostToRow(values), mapBlogPost),
  deleteBlogPost: (slug: string) => deleteByKey("blog_posts", "slug", slug),

  listTestimonials: () => selectAll("testimonials", mapTestimonial, "created_at", false),
  getTestimonialById: (id: string) => selectById("testimonials", id, mapTestimonial),
  createTestimonial: (values: Omit<TestimonialRecord, "id">) => insertOne("testimonials", testimonialToRow(values), mapTestimonial),
  updateTestimonial: (id: string, values: Omit<TestimonialRecord, "id">) =>
    updateByKey("testimonials", "id", id, testimonialToRow(values), mapTestimonial),
  deleteTestimonial: (id: string) => deleteByKey("testimonials", "id", id),

  listFaqs: () => selectAll("faqs", mapFaq, "sort_order", true),
  getFaqById: (id: string) => selectById("faqs", id, mapFaq),
  createFaq: (values: Omit<FaqRecord, "id">) => insertOne("faqs", faqToRow(values), mapFaq),
  updateFaq: (id: string, values: Omit<FaqRecord, "id">) => updateByKey("faqs", "id", id, faqToRow(values), mapFaq),

  listPanelModels: () => selectAll("solar_panel_models", mapPanelModel, "sort_order", true),
  getPanelModelById: (id: string) => selectById("solar_panel_models", id, mapPanelModel),
  createPanelModel: (values: Omit<PanelModelRecord, "id">) =>
    insertOne("solar_panel_models", panelModelToRow(values), mapPanelModel),
  updatePanelModel: (id: string, values: Omit<PanelModelRecord, "id">) =>
    updateByKey("solar_panel_models", "id", id, panelModelToRow(values), mapPanelModel),
  deletePanelModel: (id: string) => deleteByKey("solar_panel_models", "id", id),

  listInverterModels: () => selectAll("solar_inverter_models", mapInverterModel, "sort_order", true),
  getInverterModelById: (id: string) => selectById("solar_inverter_models", id, mapInverterModel),
  createInverterModel: (values: Omit<InverterModelRecord, "id">) =>
    insertOne("solar_inverter_models", inverterModelToRow(values), mapInverterModel),
  updateInverterModel: (id: string, values: Omit<InverterModelRecord, "id">) =>
    updateByKey("solar_inverter_models", "id", id, inverterModelToRow(values), mapInverterModel),
  deleteInverterModel: (id: string) => deleteByKey("solar_inverter_models", "id", id),

  listBatteryModels: () => selectAll("solar_battery_models", mapBatteryModel, "sort_order", true),
  getBatteryModelById: (id: string) => selectById("solar_battery_models", id, mapBatteryModel),
  createBatteryModel: (values: Omit<BatteryModelRecord, "id">) =>
    insertOne("solar_battery_models", batteryModelToRow(values), mapBatteryModel),
  updateBatteryModel: (id: string, values: Omit<BatteryModelRecord, "id">) =>
    updateByKey("solar_battery_models", "id", id, batteryModelToRow(values), mapBatteryModel),
  deleteBatteryModel: (id: string) => deleteByKey("solar_battery_models", "id", id),
  deleteFaq: (id: string) => deleteByKey("faqs", "id", id),
};
