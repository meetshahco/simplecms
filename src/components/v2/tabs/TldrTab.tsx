"use client";

const STATS = [
  { value: "8+", label: "Years of craft" },
  { value: "40+", label: "Products shipped" },
  { value: "3", label: "Continents served" },
  { value: "~0", label: "Bugs tolerated" },
];

const BULLETS: { heading: string; items: string[] }[] = [
  {
    heading: "Who I am",
    items: [
      "Product designer and engineer based in India — I build things end-to-end, from strategy to code.",
      "Equally comfortable running discovery workshops and opening pull requests.",
      "Obsessively curious about how AI is changing the way humans create, decide, and connect.",
    ],
  },
  {
    heading: "What I do best",
    items: [
      "Turn ambiguous problems into clear, elegant interfaces — fast.",
      "Design systems that are actually used: built in Figma, implemented in React.",
      "Bridge the gap between product thinking and engineering reality.",
      "Make AI-powered products feel trustworthy, not uncanny.",
    ],
  },
  {
    heading: "Current focus",
    items: [
      "Exploring AI-native product patterns — where the interface is the intelligence.",
      "Consulting with early-stage startups on 0→1 product and design.",
      "Open to senior IC and fractional CPO/head-of-design roles.",
    ],
  },
];

export function TldrTab() {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "2.5rem 2rem 4rem",
        fontFamily: "var(--font-inter, system-ui, sans-serif)",
      }}
    >
      {/* ── Stats Row ──────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.75rem",
          marginBottom: "3rem",
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              padding: "1rem 1.25rem",
              borderRadius: 10,
              background: "var(--v2-card-bg)",
              border: "1px solid var(--v2-card-border)",
              transition: "background 300ms ease, border-color 300ms ease",
            }}
          >
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--v2-fg)",
                fontFamily: "var(--font-outfit, system-ui, sans-serif)",
                lineHeight: 1,
                marginBottom: "0.3rem",
                transition: "color 300ms ease",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--v2-fg-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 500,
                transition: "color 300ms ease",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bullet Sections ─────────────────────────────────── */}
      {BULLETS.map((section, si) => (
        <div
          key={section.heading}
          style={{ marginBottom: si < BULLETS.length - 1 ? "2.5rem" : 0 }}
        >
          {/* Golden rule + heading */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <hr
              className="v2-rule"
              style={{
                flex: 1,
                border: "none",
                borderTop: "1px solid var(--v2-rule-color)",
                margin: 0,
              }}
            />
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--v2-fg-muted)",
                whiteSpace: "nowrap",
                transition: "color 300ms ease",
              }}
            >
              {section.heading}
            </span>
            <hr
              className="v2-rule"
              style={{
                flex: 1,
                border: "none",
                borderTop: "1px solid var(--v2-rule-color)",
                margin: 0,
              }}
            />
          </div>

          {/* Bullets */}
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
            }}
          >
            {section.items.map((item) => (
              <li
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                  lineHeight: 1.65,
                  color: "var(--v2-fg)",
                  transition: "color 300ms ease",
                }}
              >
                <span
                  style={{
                    marginTop: "0.55rem",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--v2-accent)",
                    flexShrink: 0,
                    opacity: 0.5,
                    transition: "background 300ms ease",
                  }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
