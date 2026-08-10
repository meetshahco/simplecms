import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Caveat, Jost, Geologica } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
});

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

  const title = settings?.siteTitle || "Meet Shah";
  const description = settings?.metaDescription || "Product Designer and Developer";

  return {
    title,
    description,
    icons: {
      icon: settings?.favicon || "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
    openGraph: {
      title,
      description,
      url: "https://www.meetshah.co",
      siteName: "Meet Shah",
      images: [
        {
          url: "/assets/icons/portfolio_OG.png",
          width: 1200,
          height: 630,
          alt: "Meet Shah Portfolio",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/icons/portfolio_OG.png"],
    },
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Edu+NSW+ACT+Cursive:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${jost.variable} ${geologica.variable} ${caveat.variable} ${inter.variable} ${outfit.variable} antialiased bg-[#0a0a0a] text-foreground overflow-x-hidden`}
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
