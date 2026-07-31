export const productCategories = [
  { name: "Solar Energy Systems", slug: "solar-energy-systems" },
  { name: "Power Backup Systems", slug: "power-backup-systems" },
  { name: "Power Control Equipment", slug: "power-control-equipment" },
  { name: "Electrical Products", slug: "electrical-products" },
  { name: "Lighting Solutions", slug: "lighting-solutions" },
  { name: "Safety & Protection", slug: "safety-protection" },
] as const;

export const primaryNav = [
  { label: "Home", href: "/", megaMenu: false },
  { label: "About Us", href: "/about", megaMenu: false },
  { label: "Products", href: "/products", megaMenu: true },
  { label: "Solar Solutions", href: "/solar-solutions", megaMenu: false },
  { label: "Electrical Services", href: "/electrical-services", megaMenu: false },
  { label: "Projects", href: "/projects", megaMenu: false },
  { label: "Industries", href: "/industries", megaMenu: false },
  { label: "Blog", href: "/blog", megaMenu: false },
  { label: "FAQs", href: "/faqs", megaMenu: false },
  { label: "Contact Us", href: "/contact", megaMenu: false },
] as const;
