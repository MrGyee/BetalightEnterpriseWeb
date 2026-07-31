import { Hero } from "@/components/home/hero";
import { SolutionsGrid } from "@/components/home/solutions-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Industries } from "@/components/home/industries";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { ProjectsGallery } from "@/components/home/projects-gallery";
import { Testimonials } from "@/components/home/testimonials";
import { FaqPreview } from "@/components/home/faq-preview";
import { CtaSection } from "@/components/home/cta-section";
import { getProducts, getProjects, getTestimonials, getFaqs } from "@/lib/data/catalog";

export const revalidate = 300;

export default async function Home() {
  const [products, projects, testimonials, faqs] = await Promise.all([
    getProducts().catch(() => []),
    getProjects().catch(() => []),
    getTestimonials().catch(() => []),
    getFaqs().catch(() => []),
  ]);

  const featuredProducts = products.filter((p) => p.featured);

  return (
    <>
      <Hero />
      <SolutionsGrid />
      <FeaturedProducts products={featuredProducts} />
      <Industries />
      <WhyChooseUs />
      <ProjectsGallery projects={projects.slice(0, 6)} />
      <Testimonials testimonials={testimonials} />
      <FaqPreview faqs={faqs} />
      <CtaSection />
    </>
  );
}
