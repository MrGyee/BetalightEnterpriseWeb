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
import { getHeroContent, getHeroSlides } from "@/lib/data/hero";

export const revalidate = 300;

export default async function Home() {
  const [products, projects, testimonials, faqs, heroContent, heroSlides] = await Promise.all([
    getProducts().catch(() => []),
    getProjects().catch(() => []),
    getTestimonials().catch(() => []),
    getFaqs().catch(() => []),
    getHeroContent(),
    getHeroSlides(),
  ]);

  const featuredProducts = products.filter((p) => p.featured);

  return (
    <>
      <Hero content={heroContent} slides={heroSlides} />
      <FeaturedProducts products={featuredProducts} />
      <SolutionsGrid />
      <WhyChooseUs />
      <ProjectsGallery projects={projects.slice(0, 6)} />
      <Industries />
      <Testimonials testimonials={testimonials} />
      <FaqPreview faqs={faqs} />
      <CtaSection />
    </>
  );
}
