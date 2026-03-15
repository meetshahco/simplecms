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
                <section className="px-6 md:px-12 mt-32">
                    <div className="max-w-5xl mx-auto">
                        <div className="relative aspect-video w-full overflow-hidden rounded-[32px] md:rounded-[48px] bg-neutral-900 border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                            <img
                                src={coverImage}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* ── Header ── */}
            <section className={`px-6 md:px-12 ${coverImage ? "pt-16" : "pt-28"} pb-16`}>
                <div className="max-w-5xl mx-auto">
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

                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-8">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed max-w-3xl mb-10">
                            {description}
                        </p>
                    )}



                    {/* Divider */}
                    <div className="mt-12 h-px bg-white/10" />
                </div>
            </section>

            {/* ── Article body ── */}
            <section className="px-6 md:px-12 pb-32">
                <div className="max-w-5xl mx-auto">
                    <article
                        ref={articleRef}
                        className="prose prose-invert prose-lg md:prose-xl max-w-none prose-reading prose-headings:font-heading prose-headings:font-bold prose-headings:text-white prose-a:text-white prose-a:underline prose-img:rounded-3xl"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section className="px-6 md:px-12 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="h-px bg-white/10 mb-16" />
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
            </section>

        </div>
    );
}
