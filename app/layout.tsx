import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/lib/cart";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";
import TrackingPixels from "@/components/TrackingPixels";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.name + " — " + site.tagline,
    template: "%s — " + site.name,
  },
  description: site.description,
  applicationName: site.nameEn,
  openGraph: {
    title: site.name + " — " + site.tagline,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-theme="dark" className={cairo.variable + " h-full"}>
      <body className="flex min-h-full flex-col bg-bg text-fg antialiased">
        <TrackingPixels />
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
