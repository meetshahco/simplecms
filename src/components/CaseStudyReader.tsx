"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { RichText } from "./RichText";

interface CaseStudyReaderProps {
    projectId: string;
    projectName: string;
    title: string;
    description?: string;
    coverImage?: string;
    publishedAt?: string;
    content: string;
    prevCaseStudy?: { slug: string; title: string };
    nextCaseStudy?: { slug: string; title: string };
}



export function CaseStudyReader({
    projectId,
    projectName,
    title,
    description,
    coverImage,
    publishedAt,
    content,
    prevCaseStudy,
    nextCaseStudy,
}: CaseStudyReaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const articleRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const { scrollYProgress } = useScroll();
    
    // Smooth navigation transforms
    const navBgOpacity = useTransform(scrollY, [0, 50], [0, 0.85]);
    const navBlur = useTransform(scrollY, [0, 50], [0, 16]);
    const navBorderOpacity = useTransform(scrollY, [0, 50], [0, 0.06]);

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 40,
        restDelta: 0.001,
    });

    useEffect(() => {
        const unsub = scrollY.on("change", (latest) => setIsScrolled(latest > 50));
        return unsub;
    }, [scrollY]);



    return (
        <div className="min-h-screen bg-black text-white">
            {/* ── Reading progress bar ── */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-white/80 origin-left z-[60]"
                style={{ scaleX }}
            />

            {/* ── Sticky minimal nav ── */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-10 h-14"
                style={{
                    backgroundColor: useTransform(navBgOpacity, (o) => `rgba(0,0,0,${o})`),
                    backdropFilter: useTransform(navBlur, (b) => `blur(${b}px)`),
                    borderBottom: useTransform(navBorderOpacity, (o) => `1px solid rgba(255,255,255,${o})`),
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

            {/* ── Header (Title & Description) ── */}
            <section className="px-6 md:px-12 pt-24 pb-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-normal leading-[1.15] text-white mb-8">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-4xl">
                            {description}
                        </p>
                    )}
                </div>
            </section>

            {/* ── Cover Image (Theater) ── */}
            {coverImage && (
                <section className="px-6 md:px-12 pt-4 pb-12 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative aspect-video w-full overflow-hidden rounded-[32px] md:rounded-[48px] bg-black border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                            <img
                                src={coverImage}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* ── Horizontal Divider ── */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="h-px bg-white/10" />
            </div>

            {/* ── Article body ── */}
            <section className="px-6 md:px-12 pb-32 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div ref={articleRef}>
                        <RichText content={content} as="article" />
                    </div>
                </div>
            </section>

            {/* ── Pagination Bar ── */}
            <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex items-center justify-between px-6 md:px-10 py-16 md:py-24">
                    {/* Previous */}
                    <div className="flex-1 flex justify-start">
                        {prevCaseStudy ? (
                            <Link
                                href={`/work/${projectId}/${prevCaseStudy.slug}`}
                                className="group flex flex-col items-start gap-4 max-w-[200px] md:max-w-md transition-all"
                            >
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 group-hover:text-neutral-400 transition-colors">
                                    Previous Case Study
                                </span>
                                <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all group-hover:-translate-x-1 shrink-0">
                                        <ArrowLeft className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-lg md:text-2xl font-medium text-white group-hover:text-white/80 transition-colors line-clamp-1">
                                        {prevCaseStudy.title}
                                    </span>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                href={`/work/${projectId}`}
                                className="group flex flex-col items-start gap-4 transition-all"
                            >
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 group-hover:text-neutral-400 transition-colors">
                                    Project
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all group-hover:-translate-x-1">
                                        <ArrowLeft className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-lg md:text-xl font-medium text-white/60 group-hover:text-white transition-colors">Back to Overview</span>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Next */}
                    <div className="flex-1 flex justify-end text-right">
                        {nextCaseStudy ? (
                            <Link
                                href={`/work/${projectId}/${nextCaseStudy.slug}`}
                                className="group flex flex-col items-end gap-4 max-w-[200px] md:max-w-md transition-all"
                            >
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 group-hover:text-neutral-400 transition-colors">
                                    Next Case Study
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg md:text-2xl font-medium text-white group-hover:text-white/80 transition-colors line-clamp-1">
                                        {nextCaseStudy.title}
                                    </span>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all group-hover:translate-x-1 shrink-0 rotate-180">
                                        <ArrowLeft className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                href="/work"
                                className="group flex flex-col items-end gap-4 transition-all"
                            >
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 group-hover:text-neutral-400 transition-colors">
                                    Explore More
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg md:text-xl font-medium text-white/60 group-hover:text-white transition-colors">Return to Work</span>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all group-hover:translate-x-1 rotate-180">
                                        <ArrowLeft className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </footer>

        </div>
    );
}
