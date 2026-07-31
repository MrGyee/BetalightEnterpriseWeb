import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Image
            src="/images/brand/betalight-logo.jpeg"
            alt={siteConfig.name}
            width={48}
            height={48}
            className="mx-auto size-12 rounded-full"
            priority
          />
          <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">Betalight Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your website content.</p>
        </div>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
