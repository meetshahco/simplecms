"use client";

const SECTIONS = [
  {
    eyebrow: "My belief",
    heading: "AI is a collaborator, not a replacement.",
    body: `I have spent years watching technology promise to replace human creativity, only to discover it amplifies it instead. The same is happening with AI — and more profoundly. When I use a language model to think through a design problem, I am not outsourcing the thinking. I am finding a faster path to the question that actually matters.`,
  },
  {
    eyebrow: "Where I draw the line",
    heading: "The model should know its place.",
    body: `AI that pretends to be infallible is a trust liability. AI that surfaces uncertainty, defers to context, and makes the human feel more capable — that is something worth building. I am obsessed with the interface layer between human intent and machine action. The gap between a good prompt and a good product is still enormous, and that gap is pure design territory.`,
  },
  {
    eyebrow: "How I work with it",
    heading: "Human intuition × machine speed.",
    body: `My process is not prompt-and-paste. I use AI to prototype at 10× speed, stress-test assumptions in minutes, and surface edge cases I would have missed. But the taste, the restraint, the decision to say "this isn't good enough yet" — that stays human. The best AI-assisted work I have done is invisible: the user never knows, and they don't need to.`,
  },
  {
    eyebrow: "What comes next",
    heading: "Agents that earn trust.",
    body: `The next frontier is not smarter models. It is trustworthy agents — systems that can take action in the world while remaining legible, correctable, and honest. Designing for agentic systems is the hardest UX problem I have encountered. It demands a new vocabulary for transparency, a new grammar for handoff, and a deep respect for the moments when a human needs to stay in the loop.`,
  },
];

export function AiPhilosophyTab() {
  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "2.5rem 2rem 4rem",
        fontFamily: "var(--font-inter, system-ui, sans-serif)",
      }}
    >
      {/* Intro lede */}
      <p
        style={{
          fontSize: "1.05rem",
          lineHeight: 1.75,
          color: "var(--v2-fg)",
          marginBottom: "3rem",
          fontWeight: 400,
          opacity: 0.85,
          fontStyle: "italic",
          borderLeft: "3px solid var(--v2-accent)",
          paddingLeft: "1.25rem",
          transition: "color 300ms ease, border-color 300ms ease",
        }}
      >
        &ldquo;Good AI design is not about making the machine seem human. It is about making the human feel more capable.&rdquo;
      </p>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            {/* Eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "0.65rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 20,
                  height: 2,
                  background: "var(--v2-accent)",
                  borderRadius: 1,
                  opacity: 0.6,
                  flexShrink: 0,
                  transition: "background 300ms ease",
                }}
              />
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--v2-accent)",
                  transition: "color 300ms ease",
                }}
              >
                {section.eyebrow}
              </span>
            </div>

            {/* Heading */}
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--v2-fg)",
                margin: "0 0 0.75rem",
                fontFamily: "var(--font-outfit, system-ui, sans-serif)",
                lineHeight: 1.3,
                transition: "color 300ms ease",
              }}
            >
              {section.heading}
            </h2>

            {/* Body */}
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: 1.75,
                color: "var(--v2-fg-muted)",
                margin: 0,
                transition: "color 300ms ease",
              }}
            >
              {section.body}
            </p>
          </div>
        ))}
      </div>

      {/* Footer quote */}
      <div
        style={{
          marginTop: "3.5rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--v2-border)",
          textAlign: "center",
          transition: "border-color 300ms ease",
        }}
      >
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--v2-fg-muted)",
            fontStyle: "italic",
            margin: 0,
            transition: "color 300ms ease",
          }}
        >
          These are evolving thoughts — updated as I learn.
        </p>
      </div>
    </div>
  );
}
