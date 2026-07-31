import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { HeaderSpacer } from "@/components/layout/header-spacer";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { BackToTop } from "@/components/shared/back-to-top";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { JsonLd } from "@/components/shared/json-ld";
import { organizationSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Electrical, Solar & Power Control Solutions in Kenya`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Electrical Products Kenya",
    "Solar Panels Kenya",
    "Solar Installation Nairobi",
    "Electrical Contractors Kenya",
    "Power Control Systems",
    "Electrical Supplies Kenya",
    "LED Lighting Kenya",
    "Switchgear Kenya",
    "Circuit Breakers Kenya",
    "Electrical Installation Services",
    "Renewable Energy Kenya",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Electrical, Solar & Power Control Solutions in Kenya`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Electrical, Solar & Power Control Solutions in Kenya`,
    description: siteConfig.description,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={organizationSchema()} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <Header />
            <HeaderSpacer />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
            <StickyMobileCta />
            <BackToTop />
            <CookieConsent />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
