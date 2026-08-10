import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meet Shah — Product Designer & Engineer",
  description:
    "Portfolio of Meet Shah — product designer, engineer, and AI enthusiast building interfaces at the frontier of human and machine.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "64x64" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Meet Shah — Product Designer & Engineer",
    description:
      "Portfolio of Meet Shah — product designer, engineer, and AI enthusiast building interfaces at the frontier of human and machine.",
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
    title: "Meet Shah — Product Designer & Engineer",
    description:
      "Portfolio of Meet Shah — product designer, engineer, and AI enthusiast building interfaces at the frontier of human and machine.",
    images: ["/assets/icons/portfolio_OG.png"],
  },
};

export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The v2 home page manages its own full-viewport shell.
  // Sub-pages (/v2/work/[id], /v2/about, etc.) render standalone with
  // their own layout; they are served directly without the shell wrapper.
  return <>{children}</>;
}
