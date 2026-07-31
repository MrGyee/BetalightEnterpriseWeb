import type { Metadata } from "next";
import Link from "next/link";
import { Package, Briefcase, Newspaper, Quote, HelpCircle, Inbox } from "lucide-react";
import { verifySession } from "@/lib/auth/dal";
import { getProducts, getProjects, getBlogPosts, getTestimonials, getFaqs } from "@/lib/data/catalog";
import { leadsStore } from "@/lib/store/leads.store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await verifySession();
  const [products, projects, blogPosts, testimonials, faqs, quoteRequests, contactMessages] = await Promise.all([
    getProducts(),
    getProjects(),
    getBlogPosts(),
    getTestimonials(),
    getFaqs(),
    leadsStore.listQuoteRequests(),
    leadsStore.listContactMessages(),
  ]);

  const stats = [
    { label: "Products", value: products.length, href: "/admin/products", icon: Package },
    { label: "Projects", value: projects.length, href: "/admin/projects", icon: Briefcase },
    { label: "Blog Posts", value: blogPosts.length, href: "/admin/blog", icon: Newspaper },
    { label: "Testimonials", value: testimonials.length, href: "/admin/testimonials", icon: Quote },
    { label: "FAQs", value: faqs.length, href: "/admin/faqs", icon: HelpCircle },
    { label: "Leads", value: quoteRequests.length + contactMessages.length, href: "/admin/leads", icon: Inbox },
  ];

  const recentQuoteRequests = quoteRequests.slice(0, 5);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Signed in as {session.email}.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
            <Icon className="size-5 text-primary" />
            <p className="mt-2 font-heading text-2xl font-semibold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent Quote Requests</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-primary hover:underline">
            View all leads
          </Link>
        </div>
        {recentQuoteRequests.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No quote requests yet.</p>
        ) : (
          <div className="mt-3 grid gap-2">
            {recentQuoteRequests.map((lead) => (
              <div key={lead.id} className="rounded-xl border border-border bg-card p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-foreground">{lead.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{lead.serviceCategory}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
