import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meet Shah — Product Designer & Engineer",
  description:
    "Portfolio of Meet Shah — product designer, engineer, and AI enthusiast building interfaces at the frontier of human and machine.",
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
