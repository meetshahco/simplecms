"use client";

import type { Settings } from "@/lib/cms/storage";

const TIMELINE = [
  {
    period: "2023 – Now",
    role: "Independent — Design & Engineering",
    description:
      "Consulting with early-stage startups on product design, AI-native interfaces, and engineering. Focused on 0→1 work where taste and speed both matter.",
  },
  {
    period: "2021 – 2023",
    role: "Senior Product Designer",
    description:
      "Led design across a fintech platform serving 2M+ users. Owned the design system, growth experiments, and the mobile app redesign that increased activation by 34%.",
  },
  {
    period: "2019 – 2021",
    role: "Product & UX Generalist",
    description:
      "Wore every hat. Researched, prototyped, tested, shipped. Learned that constraints are the best creative collaborators.",
  },
  {
    period: "2017 – 2019",
    role: "UX/UI Designer & Engineer",
    description:
      "Built components, documented patterns, and first discovered that the best designers learn to code and the best engineers develop taste.",
  },
];

const VALUES = [
  {
    icon: "◎",
    title: "Craft is intentional",
    body: "The difference between good and great is usually one more revision you almost didn't make.",
  },
  {
    icon: "◈",
    title: "Transparency builds trust",
    body: "In design, in code, and in conversation — showing your reasoning matters as much as the conclusion.",
  },
  {
    icon: "◇",
    title: "Simplicity is earned",
    body: "A simple interface is the output of enormous complexity, not the absence of it.",
  },
  {
    icon: "◉",
    title: "Ownership over blame",
    body: "I prefer teams where everyone acts like it is their company. Pride is contagious.",
  },
];

interface Props {
  settings: Settings;
}

export function AboutTab({ settings }: Props) {
  return (
    <div
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "2.5rem 2rem 4rem",
        fontFamily: "var(--font-inter, system-ui, sans-serif)",
      }}
    >
      {/* ── Opening paragraph ─────────────────────────────── */}
      <p
        style={{
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "var(--v2-fg)",
          marginBottom: "2.5rem",
          fontWeight: 400,
          maxWidth: 600,
          transition: "color 300ms ease",
        }}
      >
        I am{" "}
        <strong style={{ fontWeight: 700 }}>
          {settings?.adminName || "Meet Shah"}
        </strong>
        . I make products that feel inevitable — like they could not have been
        designed any other way. I have been at this for eight years across fintech,
        health tech, and consumer. These days I am mostly thinking about how AI
        changes the craft of building software.
      </p>

      {/* ── Values grid ──────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "3.5rem",
        }}
      >
        {VALUES.map((v) => (
          <div
            key={v.title}
            style={{
              padding: "1.25rem",
              borderRadius: 10,
              border: "1px solid var(--v2-card-border)",
              background: "var(--v2-card-bg)",
              transition: "background 300ms ease, border-color 300ms ease",
            }}
          >
            <div
              style={{
                fontSize: "1rem",
                color: "var(--v2-accent)",
                marginBottom: "0.5rem",
                fontWeight: 400,
                transition: "color 300ms ease",
              }}
            >
              {v.icon}
            </div>
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--v2-fg)",
                margin: "0 0 0.35rem",
                letterSpacing: "-0.01em",
                fontFamily: "var(--font-outfit, system-ui, sans-serif)",
                transition: "color 300ms ease",
              }}
            >
              {v.title}
            </h3>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--v2-fg-muted)",
                margin: 0,
                lineHeight: 1.6,
                transition: "color 300ms ease",
              }}
            >
              {v.body}
            </p>
          </div>
        ))}
      </div>

      {/* ── Divider ──────────────────────────────────────── */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--v2-border)",
          margin: "0 0 2.5rem",
          transition: "border-color 300ms ease",
        }}
      />

      {/* ── Timeline heading ──────────────────────────────── */}
      <p
        style={{
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--v2-fg-muted)",
          margin: "0 0 1.5rem",
          transition: "color 300ms ease",
        }}
      >
        Career path
      </p>

      {/* ── Timeline ─────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {TIMELINE.map((item, i) => (
          <div
            key={item.period}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "1rem",
              paddingBottom: i < TIMELINE.length - 1 ? "2rem" : 0,
              position: "relative",
            }}
          >
            {/* Vertical line */}
            {i < TIMELINE.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 109,
                  top: 8,
                  bottom: 0,
                  width: 1,
                  background: "var(--v2-border)",
                  transition: "background 300ms ease",
                }}
              />
            )}

            {/* Period */}
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--v2-fg-muted)",
                fontWeight: 500,
                paddingTop: "0.15rem",
                transition: "color 300ms ease",
              }}
            >
              {item.period}
            </span>

            {/* Content */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.35rem",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: "2px solid var(--v2-accent)",
                    background: "var(--v2-bg)",
                    flexShrink: 0,
                    transition: "border-color 300ms ease, background 300ms ease",
                  }}
                />
                <h3
                  style={{
                    margin: 0,
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "var(--v2-fg)",
                    fontFamily: "var(--font-outfit, system-ui, sans-serif)",
                    letterSpacing: "-0.01em",
                    transition: "color 300ms ease",
                  }}
                >
                  {item.role}
                </h3>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  lineHeight: 1.65,
                  color: "var(--v2-fg-muted)",
                  transition: "color 300ms ease",
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--v2-border)",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          transition: "border-color 300ms ease",
        }}
      >
        {settings?.socialLinks?.linkedin && (
          <a
            href={settings.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--v2-accent)",
              textDecoration: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: 999,
              border: "1px solid var(--v2-accent)",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--v2-accent)";
              el.style.color = "var(--v2-bg)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.color = "var(--v2-accent)";
            }}
          >
            LinkedIn →
          </a>
        )}
        {settings?.adminEmail && (
          <a
            href={`mailto:${settings.adminEmail}`}
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--v2-fg-muted)",
              textDecoration: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: 999,
              border: "1px solid var(--v2-border)",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--v2-fg)";
              el.style.borderColor = "var(--v2-fg)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "var(--v2-fg-muted)";
              el.style.borderColor = "var(--v2-border)";
            }}
          >
            Email me
          </a>
        )}
      </div>
    </div>
  );
}
