"use client";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/cms/storage";

interface Props {
  projects: Project[];
}

export function WorkTab({ projects }: Props) {
  const published = projects.filter((p) => p.status === "published");

  return (
    <div
      style={{
        maxWidth: 1060,
        margin: "0 auto",
        padding: "2.5rem 2rem 4rem",
      }}
    >
      {/* ── Header row ──────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "2rem",
          borderBottom: "1px solid var(--v2-border)",
          paddingBottom: "1rem",
          transition: "border-color 300ms ease",
        }}
      >
        <h2
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--v2-fg-muted)",
            margin: 0,
            fontFamily: "var(--font-inter, system-ui, sans-serif)",
            transition: "color 300ms ease",
          }}
        >
          Selected Work
        </h2>
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--v2-fg-muted)",
            transition: "color 300ms ease",
          }}
        >
          {published.length} projects
        </span>
      </div>

      {/* ── Project Grid ────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {published.map((project) => (
          <WorkCard key={project.id} project={project} />
        ))}
      </div>

      {published.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "var(--v2-fg-muted)",
            fontSize: "0.9rem",
          }}
        >
          No published projects yet.
        </div>
      )}
    </div>
  );
}

function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <article
        style={{
          borderRadius: 12,
          border: "1px solid var(--v2-card-border)",
          background: "var(--v2-card-bg)",
          overflow: "hidden",
          cursor: "pointer",
          transition:
            "background 300ms ease, border-color 300ms ease, transform 200ms ease, box-shadow 200ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 12px 40px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
            background: "var(--v2-bg-secondary)",
            position: "relative",
          }}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 340px"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, var(--v2-card-border), var(--v2-bg-secondary))",
              }}
            />
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              flexWrap: "wrap",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.67rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--v2-fg-muted)",
                transition: "color 300ms ease",
              }}
            >
              {project.category}
            </span>
          </div>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--v2-fg)",
              margin: "0 0 0.4rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.35,
              fontFamily: "var(--font-outfit, system-ui, sans-serif)",
              transition: "color 300ms ease",
            }}
          >
            {project.title}
          </h3>
          {project.description && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--v2-fg-muted)",
                margin: "0 0 0.75rem",
                lineHeight: 1.55,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                transition: "color 300ms ease",
              }}
            >
              {project.description}
            </p>
          )}
          {project.tags?.length > 0 && (
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    padding: "0.2rem 0.55rem",
                    borderRadius: 999,
                    background: "var(--v2-accent-muted)",
                    color: "var(--v2-fg-muted)",
                    transition: "background 300ms ease, color 300ms ease",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
