import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

import { getSettings } from "@/lib/cms/storage";
import { cookies } from "next/headers";

import { Providers } from "@/components/auth/Providers";
import { ContactAnimationProvider } from "@/context/ContactAnimationContext";
import ClarityAnalytics from "@/components/analytics/ClarityAnalytics";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => null);

  return {
    title: settings?.siteTitle || "Meet Shah",
    description: settings?.metaDescription || "Product Designer and Developer",
    icons: {
      icon: settings?.favicon || "/favicon.ico",
    }
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings().catch(() => null);

  const cookieStore = await cookies();
  const splashPlayed = cookieStore.get("splashPlayed")?.value === "true";

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${caveat.variable} antialiased bg-[#0a0a0a] text-foreground overflow-x-hidden`}
      >
        <Providers>
          <ContactAnimationProvider initialContactCta={splashPlayed}>
            {children}
            <Analytics />
            <SpeedInsights />
            <ClarityAnalytics />
          </ContactAnimationProvider>
        </Providers>
      </body>
    </html>
  );
}
