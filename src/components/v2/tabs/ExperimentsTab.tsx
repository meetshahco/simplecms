"use client";

type Status = "live" | "wip" | "archived";

interface Experiment {
  title: string;
  description: string;
  stack: string[];
  status: Status;
  href?: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    title: "PromptOS",
    description:
      "A lightweight prompt management layer that versions, tests, and diffs LLM prompts the way Git manages code. Built for teams tired of prompt sprawl.",
    stack: ["Next.js", "Vercel AI SDK", "SQLite", "TypeScript"],
    status: "wip",
  },
  {
    title: "Figma → Code Bridge",
    description:
      "An experimental Figma plugin that extracts semantic design tokens and generates typed CSS custom properties and React component scaffolds automatically.",
    stack: ["Figma Plugin API", "React", "PostCSS"],
    status: "wip",
  },
  {
    title: "Mirror",
    description:
      "Daily reflection tool powered by a fine-tuned model trained on journaling frameworks. Asks better questions instead of better answers.",
    stack: ["Next.js", "OpenAI", "SQLite", "Tailwind"],
    status: "live",
  },
  {
    title: "Density Calculator",
    description:
      "A small interactive tool that measures information density in UI designs — inspired by Edward Tufte's data-ink ratio applied to digital interfaces.",
    stack: ["Vanilla JS", "Canvas API", "Python"],
    status: "archived",
  },
  {
    title: "Agent Handoff Protocol",
    description:
      "A research prototype exploring how AI agents should communicate uncertainty and request human intervention at the right moments in agentic workflows.",
    stack: ["LangGraph", "FastAPI", "React"],
    status: "wip",
  },
  {
    title: "Portfolio CMS",
    description:
      "This very site's headless CMS — built from scratch on Vercel KV with a custom admin UI. No Contentful, no Sanity, no dependencies I don't control.",
    stack: ["Next.js", "Vercel KV", "NextAuth", "TypeScript"],
    status: "live",
    href: "/admin",
  },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  live:     { label: "Live",     color: "#22C55E", dot: "#22C55E" },
  wip:      { label: "In Progress", color: "#F59E0B", dot: "#F59E0B" },
  archived: { label: "Archived", color: "#5A6472", dot: "#5A6472" },
};

export function ExperimentsTab() {
  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "2.5rem 2rem 4rem",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      {/* ── Terminal-style header ────────────────────────── */}
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--v2-accent)",
            fontFamily: "inherit",
            opacity: 0.7,
          }}
        >
          ~/experiments
        </span>
        <span style={{ color: "var(--v2-fg-muted)", fontSize: "0.7rem" }}>$</span>
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--v2-fg-muted)",
          }}
        >
          ls -la
        </span>
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 14,
            background: "var(--v2-accent)",
            opacity: 0.7,
            animation: "v2-blink 1.1s step-end infinite",
          }}
        />
      </div>

      {/* ── Grid ────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {EXPERIMENTS.map((exp) => (
          <ExperimentCard key={exp.title} exp={exp} />
        ))}
      </div>

      {/* Blink keyframe injected inline */}
      <style>{`
        @keyframes v2-blink {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ExperimentCard({ exp }: { exp: Experiment }) {
  const status = STATUS_CONFIG[exp.status];

  const inner = (
    <div
      className="v2-glow-card"
      style={{
        borderRadius: 8,
        border: "1px solid var(--v2-card-border)",
        background: "var(--v2-card-bg)",
        padding: "1.25rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        cursor: exp.href ? "pointer" : "default",
        transition: "background 300ms ease, border-color 300ms ease",
      }}
    >
      {/* Top row: title + status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--v2-fg)",
            letterSpacing: "-0.01em",
            fontFamily: "var(--font-outfit, system-ui, sans-serif)",
            lineHeight: 1.3,
            transition: "color 300ms ease",
          }}
        >
          {exp.title}
        </h3>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: status.color,
            padding: "0.2rem 0.55rem",
            borderRadius: 4,
            border: `1px solid ${status.color}33`,
            background: `${status.color}10`,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: status.dot,
              display: "inline-block",
            }}
          />
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: "0.78rem",
          lineHeight: 1.6,
          color: "var(--v2-fg-muted)",
          flex: 1,
          transition: "color 300ms ease",
          fontFamily: "var(--font-inter, system-ui, sans-serif)",
        }}
      >
        {exp.description}
      </p>

      {/* Stack pills */}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {exp.stack.map((s) => (
          <span
            key={s}
            style={{
              fontSize: "0.62rem",
              fontFamily: "inherit",
              padding: "0.18rem 0.5rem",
              borderRadius: 4,
              background: "var(--v2-accent-muted)",
              color: "var(--v2-accent)",
              border: "1px solid var(--v2-card-border)",
              transition: "all 300ms ease",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );

  if (exp.href) {
    return (
      <a href={exp.href} style={{ textDecoration: "none", display: "block" }}>
        {inner}
      </a>
    );
  }
  return inner;
}
