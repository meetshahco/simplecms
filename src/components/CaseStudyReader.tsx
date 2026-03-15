"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

interface CaseStudyReaderProps {
    projectId: string;
    projectName: string;
    title: string;
    description?: string;
    coverImage?: string;
    publishedAt?: string;
    content: string;
}

function estimateReadingTime(html: string): number {
    const text = html.replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 238));
}

export function CaseStudyReader({
    projectId,
    projectName,
    title,
    description,
    coverImage,
    publishedAt,
    content,
}: CaseStudyReaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const articleRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 40,
        restDelta: 0.001,
    });

    useEffect(() => {
        const unsub = scrollYProgress.on("change", (v) => setIsScrolled(v > 0.02));
        return unsub;
    }, [scrollYProgress]);

    const readingTime = estimateReadingTime(content);

    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* ── Reading progress bar ── */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-white/80 origin-left z-[60]"
                style={{ scaleX }}
            />

            {/* ── Sticky minimal nav ── */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-10 h-14 transition-all duration-500"
                style={{
                    backgroundColor: isScrolled ? "rgba(5,5,5,0.85)" : "transparent",
                    backdropFilter: isScrolled ? "blur(16px)" : "none",
                    borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
            >
                <Link
                    href={`/work/${projectId}`}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium tracking-wide">{projectName}</span>
                </Link>
            </motion.nav>

            {/* ── Cover image ── */}
            {coverImage && (
                <div className="max-w-5xl mx-auto px-6 mt-28">
                    <div className="relative aspect-video w-full overflow-hidden rounded-[32px] md:rounded-[48px] bg-white/5 border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* ── Header ── */}
            <header className={`max-w-5xl mx-auto px-6 ${coverImage ? "pt-16" : "pt-28"} pb-16`}>
                {/* Back link (above fold, visible before scrolling) */}
                {!coverImage && (
                    <Link
                        href={`/work/${projectId}`}
                        className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm mb-10 group"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                        {projectName}
                    </Link>
                )}

                <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15] text-white mb-6">
                    {title}
                </h1>

                {description && (
                    <p className="text-xl text-neutral-400 leading-relaxed mb-8">
                        {description}
                    </p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-4 flex-wrap">
                    {formattedDate && (
                        <span className="text-sm text-neutral-500 font-medium">{formattedDate}</span>
                    )}
                    {formattedDate && (
                        <span className="w-1 h-1 rounded-full bg-neutral-700" />
                    )}
                    <span className="text-sm text-neutral-500 font-medium">{readingTime} min read</span>
                </div>

                {/* Divider */}
                <div className="mt-10 h-px bg-white/6" />
            </header>

            {/* ── Article body ── */}
            <article
                ref={articleRef}
                className="max-w-5xl mx-auto px-6 pb-32 prose prose-invert prose-lg md:prose-xl max-w-none prose-reading prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-a:text-white prose-a:underline prose-img:rounded-3xl"
                dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* ── Bottom CTA ── */}
            <div className="max-w-5xl mx-auto px-6 pb-24">
                <div className="h-px bg-white/6 mb-16" />
                <Link
                    href={`/work/${projectId}`}
                    className="inline-flex items-center gap-3 text-neutral-400 hover:text-white transition-colors group"
                >
                    <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-sm font-medium">Back to {projectName}</span>
                </Link>
            </div>
        </div>
    );
}
