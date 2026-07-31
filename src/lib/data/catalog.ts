import "server-only";
import { catalogStore } from "@/lib/store/catalog.store";

export const getProducts = () => catalogStore.listProducts();
export const getProductBySlug = (slug: string) => catalogStore.getProductBySlug(slug);
export const getProjects = () => catalogStore.listProjects();
export const getProjectBySlug = (slug: string) => catalogStore.getProjectBySlug(slug);
export const getBlogPosts = () => catalogStore.listBlogPosts();
export const getBlogPostBySlug = (slug: string) => catalogStore.getBlogPostBySlug(slug);
export const getTestimonials = () => catalogStore.listTestimonials();
export const getFaqs = () => catalogStore.listFaqs();
