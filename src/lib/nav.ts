export const productCategories = [
  { name: "Solar Energy Systems", slug: "solar-energy-systems" },
  { name: "Power Backup Systems", slug: "power-backup-systems" },
  { name: "Power Control Equipment", slug: "power-control-equipment" },
  { name: "Electrical Products", slug: "electrical-products" },
  { name: "Lighting Solutions", slug: "lighting-solutions" },
  { name: "Safety & Protection", slug: "safety-protection" },
] as const;

export const servicesMenu = [
  { name: "Solar Installation", href: "/solar-solutions" },
  { name: "Electrical Installation", href: "/electrical-services#installation" },
  { name: "Industrial Services", href: "/electrical-services#industrial" },
  { name: "Electrical Maintenance", href: "/electrical-services#maintenance" },
  { name: "Energy Audits", href: "/electrical-services#energy-audits" },
] as const;

export const primaryNav = [
  { label: "Home", href: "/", dropdown: undefined },
  { label: "About", href: "/about", dropdown: undefined },
  { label: "Products", href: "/products", dropdown: "products" },
  { label: "Services", href: "/electrical-services", dropdown: "services" },
  { label: "Projects", href: "/projects", dropdown: undefined },
  { label: "Blog", href: "/blog", dropdown: undefined },
  { label: "Contact", href: "/contact", dropdown: undefined },
] as const;
