import "server-only";
import { catalogStore } from "@/lib/store/catalog.store";
import type { ProductRecord, ProjectRecord, BlogPostRecord, TestimonialRecord, FaqRecord } from "@/lib/store/catalog.store";

export const getProducts = () => catalogStore.listProducts();
export const getProductBySlug = (slug: string) => catalogStore.getProductBySlug(slug);
export const createProduct = (values: ProductRecord) => catalogStore.createProduct(values);
export const updateProduct = (slug: string, values: ProductRecord) => catalogStore.updateProduct(slug, values);
export const deleteProduct = (slug: string) => catalogStore.deleteProduct(slug);

export const getProjects = () => catalogStore.listProjects();
export const getProjectBySlug = (slug: string) => catalogStore.getProjectBySlug(slug);
export const createProject = (values: ProjectRecord) => catalogStore.createProject(values);
export const updateProject = (slug: string, values: ProjectRecord) => catalogStore.updateProject(slug, values);
export const deleteProject = (slug: string) => catalogStore.deleteProject(slug);

export const getBlogPosts = () => catalogStore.listBlogPosts();
export const getBlogPostBySlug = (slug: string) => catalogStore.getBlogPostBySlug(slug);
export const createBlogPost = (values: BlogPostRecord) => catalogStore.createBlogPost(values);
export const updateBlogPost = (slug: string, values: BlogPostRecord) => catalogStore.updateBlogPost(slug, values);
export const deleteBlogPost = (slug: string) => catalogStore.deleteBlogPost(slug);

export const getTestimonials = () => catalogStore.listTestimonials();
export const getTestimonialById = (id: string) => catalogStore.getTestimonialById(id);
export const createTestimonial = (values: Omit<TestimonialRecord, "id">) => catalogStore.createTestimonial(values);
export const updateTestimonial = (id: string, values: Omit<TestimonialRecord, "id">) => catalogStore.updateTestimonial(id, values);
export const deleteTestimonial = (id: string) => catalogStore.deleteTestimonial(id);

export const getFaqs = () => catalogStore.listFaqs();
export const getFaqById = (id: string) => catalogStore.getFaqById(id);
export const createFaq = (values: Omit<FaqRecord, "id">) => catalogStore.createFaq(values);
export const updateFaq = (id: string, values: Omit<FaqRecord, "id">) => catalogStore.updateFaq(id, values);
export const deleteFaq = (id: string) => catalogStore.deleteFaq(id);
