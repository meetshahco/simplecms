"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileHeader } from "./ProfileHeader";
import { TldrTab } from "./tabs/TldrTab";
import { WorkTab } from "./tabs/WorkTab";
import { AiPhilosophyTab } from "./tabs/AiPhilosophyTab";
import { ExperimentsTab } from "./tabs/ExperimentsTab";
import { AboutTab } from "./tabs/AboutTab";
import type { Project, Settings } from "@/lib/cms/storage";

export type TabId = "tldr" | "work" | "ai" | "experiments" | "about";

const THEME_MAP: Record<TabId, string> = {
  tldr:        "executive",
  work:        "premium",
  ai:          "warmth",
  experiments: "techy",
  about:       "raw",
};

interface Props {
  projects: Project[];
  settings: Settings;
}

export function PortfolioShell({ projects, settings }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("tldr");

  const theme = THEME_MAP[activeTab];

  return (
    /* ── Outer page: always white, fills the viewport ─────────── */
    <div
      style={{
        minHeight: "100dvh",
        height: "100dvh",
        background: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Centred column: max 1280px, theme-aware ─────────────── */}
      <div
        className="v2-theme-shell"
        data-theme={theme}
        style={{
          width: "100%",
          maxWidth: 1280,
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          overflow: "hidden",
          fontFamily: "var(--font-inter, system-ui, sans-serif)",
          /* Soft shadow to lift column from page background */
          boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 2px 40px rgba(0,0,0,0.03)",
        }}
      >
        {/* ── Profile Header Zone ──────────────────────────────── */}
        <ProfileHeader
          settings={settings}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* ── Scrollable Content Zone ──────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "var(--v2-bg)",
            transition: "background-color 300ms ease",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{ minHeight: "100%" }}
            >
              {activeTab === "tldr"        && <TldrTab />}
              {activeTab === "work"        && <WorkTab projects={projects} />}
              {activeTab === "ai"          && <AiPhilosophyTab />}
              {activeTab === "experiments" && <ExperimentsTab />}
              {activeTab === "about"       && <AboutTab settings={settings} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
