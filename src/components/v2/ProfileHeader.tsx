"use client";

import Image from "next/image";
import type { TabId } from "./PortfolioShell";
import type { Settings } from "@/lib/cms/storage";

const TABS: { id: TabId; label: string }[] = [
  { id: "tldr",        label: "TL;DR" },
  { id: "work",        label: "Work" },
  { id: "ai",          label: "AI Philosophy" },
  { id: "experiments", label: "Experiments" },
  { id: "about",       label: "About" },
];

interface Props {
  settings: Settings;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function ProfileHeader({ settings, activeTab, onTabChange }: Props) {
  return (
    <header
      className="v2-profile-header"
      style={{
        flexShrink: 0,
        padding: "1.75rem 2rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.25rem",
      }}
    >
      {/* ── Identity Block ──────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          textAlign: "center",
        }}
      >
        {/* Portrait */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: "2px solid var(--v2-border)",
            transition: "border-color 300ms ease",
            background: "var(--v2-card-bg)",
          }}
        >
          <Image
            src="/meet-portrait.jpg"
            alt="Meet Shah"
            width={64}
            height={64}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            priority
          />
        </div>

        {/* Name */}
        <h1
          style={{
            fontSize: "1.15rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--v2-fg)",
            lineHeight: 1.2,
            margin: 0,
            fontFamily: "var(--font-outfit, system-ui, sans-serif)",
            transition: "color 300ms ease",
          }}
        >
          {settings?.adminName || "Meet Shah"}
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--v2-fg-muted)",
            margin: 0,
            fontWeight: 400,
            letterSpacing: "0.01em",
            transition: "color 300ms ease",
          }}
        >
          Product Designer &amp; Engineer · Building at the frontier of human &amp; AI
        </p>

        {/* Availability badge */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.68rem",
            fontWeight: 500,
            color: "var(--v2-fg-muted)",
            padding: "0.28rem 0.8rem",
            borderRadius: 999,
            border: "1px solid var(--v2-border)",
            background: "var(--v2-card-bg)",
            transition: "all 300ms ease",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ADE80",
              boxShadow: "0 0 0 2px rgba(74,222,128,0.3)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          Open to opportunities
        </span>
      </div>

      {/* ── Tab Pills ───────────────────────────────────────────── */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.35rem",
          flexWrap: "wrap",
        }}
        role="tablist"
        aria-label="Portfolio sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`v2-tab-pill${activeTab === tab.id ? " active" : ""}`}
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: 999,
              fontSize: "0.82rem",
              fontWeight: 500,
              background: "transparent",
              fontFamily: "inherit",
              letterSpacing: "0.01em",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Bottom border rule ──────────────────────────────────── */}
      <div
        style={{
          width: "calc(100% + 4rem)",
          height: 1,
          background: "var(--v2-border)",
          transition: "background 300ms ease",
          alignSelf: "center",
        }}
      />
    </header>
  );
}
