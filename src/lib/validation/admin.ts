import { z } from "zod";

export const productAdminSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  name: z.string().min(2, "Name is required."),
  category: z.string().min(2, "Category is required."),
  brand: z.string().optional().or(z.literal("")),
  shortDescription: z.string().min(5, "Short description is required."),
  description: z.string().min(5, "Description is required."),
  imagePath: z.string().min(1, "Image is required."),
  specsJson: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val || "{}");
      return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
    } catch {
      return false;
    }
  }, "Specs must be valid JSON, e.g. {\"Voltage\": \"12V\"}"),
  featured: z.boolean(),
});
export type ProductAdminValues = z.infer<typeof productAdminSchema>;

export const projectAdminSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  title: z.string().min(2, "Title is required."),
  category: z.string().min(2, "Category is required."),
  description: z.string().min(5, "Description is required."),
  location: z.string().min(2, "Location is required."),
  imagePath: z.string().min(1, "Image is required."),
  completedDate: z.string().optional().or(z.literal("")),
});
export type ProjectAdminValues = z.infer<typeof projectAdminSchema>;

export const blogPostAdminSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  title: z.string().min(2, "Title is required."),
  excerpt: z.string().min(5, "Excerpt is required."),
  content: z.string().min(20, "Content is required."),
  coverImagePath: z.string().optional().or(z.literal("")),
  category: z.string().min(2, "Category is required."),
  seoDescription: z.string().min(5, "SEO description is required."),
  publishedAt: z.string().min(1, "Publish date is required."),
});
export type BlogPostAdminValues = z.infer<typeof blogPostAdminSchema>;

export const testimonialAdminSchema = z.object({
  authorName: z.string().min(2, "Name is required."),
  roleOrCompany: z.string().min(2, "Role or company is required."),
  quote: z.string().min(5, "Quote is required."),
  rating: z.number().min(1).max(5),
  photoPath: z.string().optional().or(z.literal("")),
});
export type TestimonialAdminValues = z.infer<typeof testimonialAdminSchema>;

export const faqAdminSchema = z.object({
  question: z.string().min(5, "Question is required."),
  answer: z.string().min(5, "Answer is required."),
  category: z.string().min(2, "Category is required."),
  sortOrder: z.number(),
});
export type FaqAdminValues = z.infer<typeof faqAdminSchema>;

export const siteSettingsAdminSchema = z.object({
  phonePrimary: z.string().min(7, "Primary phone number is required."),
  phoneShop1: z.string().optional().or(z.literal("")),
  phoneShop2: z.string().optional().or(z.literal("")),
  whatsappNumber: z.string().min(7, "WhatsApp number is required."),
  email: z.string().email("Enter a valid email address."),
  addressLine1: z.string().min(2, "Address is required."),
  addressLine2: z.string().optional().or(z.literal("")),
  addressCity: z.string().min(2, "City is required."),
  addressCountry: z.string().min(2, "Country is required."),
  hoursText: z.string().optional().or(z.literal("")),
  serviceAreasText: z.string().min(2, "Enter at least one service area."),
  brandsText: z.string().optional().or(z.literal("")),
  socialFacebook: z.string().optional().or(z.literal("")),
  socialInstagram: z.string().optional().or(z.literal("")),
  socialTiktok: z.string().optional().or(z.literal("")),
  socialTwitter: z.string().optional().or(z.literal("")),
  socialLinkedin: z.string().optional().or(z.literal("")),
});
export type SiteSettingsAdminValues = z.infer<typeof siteSettingsAdminSchema>;

export const heroContentAdminSchema = z.object({
  badgeText: z.string().min(2, "Badge text is required."),
  headline: z.string().min(5, "Headline is required."),
  subheadline: z.string().min(5, "Subheadline is required."),
  trustPointsText: z.string().min(2, "Enter at least one trust point."),
  statsText: z.string().min(2, "Enter at least one stat."),
});
export type HeroContentAdminValues = z.infer<typeof heroContentAdminSchema>;

export const heroSlideAdminSchema = z.object({
  imagePath: z.string().min(1, "Image is required."),
  title: z.string().min(2, "Title is required."),
  location: z.string().min(2, "Location is required."),
  category: z.string().optional().or(z.literal("")),
  alt: z.string().optional().or(z.literal("")),
  sortOrder: z.number(),
});
export type HeroSlideAdminValues = z.infer<typeof heroSlideAdminSchema>;
