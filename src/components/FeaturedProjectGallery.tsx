"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard_Home } from "./ProjectCard_Home";
import type { Project } from "@/lib/cms/storage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function FeaturedProjectGallery({ projects }: { projects: Project[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isActiveZoneHovered, setIsActiveZoneHovered] = useState(false);

    if (projects.length === 0) return null;

    const changeIndex = (idx: number) => {
        setIsActiveZoneHovered(false);
        setActiveIndex(idx);
    };

    const goLeft = () => changeIndex(Math.max(0, activeIndex - 1));
    const goRight = () => changeIndex(Math.min(projects.length - 1, activeIndex + 1));

    const activeProject = projects[activeIndex];



    return (
        <section 
            className="relative py-10 md:py-24 w-full overflow-x-clip"
            style={{
                // Mobile: show 1 active card + peek of next
                // cardH = (100vw - 2*24px - 1*12px) * 1 / 1.333  →  active fills most of width
                // SM: show 1 active card + 1 base + peek
                // MD+: show 1 active (4:3) + 2 base (1:1) + gaps = full width
                '--gap': 'clamp(12px, 2vw, 20px)',
            } as React.CSSProperties}
        >
            {/* Responsive --card-h injected via style tag for proper media query support */}
            <style>{`
                :root {
                    --card-h: calc((100vw - 2 * 24px - 12px) / 1.333);
                }
                @media (min-width: 640px) {
                    :root {
                        --card-h: calc((100vw - 2 * 40px - 2 * 16px) / 2.333);
                    }
                }
                @media (min-width: 768px) {
                    :root {
                        --card-h: calc((100vw - 2 * 53px - 3 * 20px) * 3 / 10);
                    }
                }
            `}</style>

            <div className="w-full px-6 sm:px-10 md:px-[53px]">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white/90 mb-4 md:mb-8 font-heading tracking-tight drop-shadow-md">
                    Coming Up Next
                </h3>
            </div>
            
            {/* Carousel Container */}
            <div className="relative w-full group">
                {/* Pagination Controls */}
                <button 
                    onClick={goLeft}
                    disabled={activeIndex === 0}
                    className="absolute left-4 top-[calc(var(--card-h)/2)] -translate-y-1/2 z-40 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-black/80 disabled:opacity-0 disabled:cursor-not-allowed backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={goRight}
                    disabled={activeIndex >= projects.length - 1}
                    className="absolute right-4 top-[calc(var(--card-h)/2)] -translate-y-1/2 z-40 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-black/80 disabled:opacity-0 disabled:cursor-not-allowed backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* The Track */}
                <motion.div 
                    className="flex flex-row items-start pl-6 sm:pl-10 md:pl-[53px]"
                    style={{ gap: 'var(--gap)' }}
                    animate={{ x: `calc(-${activeIndex} * (var(--card-h) + var(--gap)))` }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 120, 
                        damping: 22,
                        mass: 0.9,
                    }}
                >
                    {projects.map((project, index) => {
                        const isActive = index === activeIndex;
                        const isPrevious = index < activeIndex;

                        return (
                            <motion.div 
                                key={project.id} 
                                className="relative shrink-0"
                                animate={{
                                    width: isActive ? 'calc(var(--card-h) * 1.333)' : 'var(--card-h)',
                                    opacity: isPrevious ? 0.3 : 1,
                                }}
                                style={{ height: 'var(--card-h)' }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 120, 
                                    damping: 22,
                                    mass: 0.9,
                                }}
                            >
                                <ProjectCard_Home
                                    project={project}
                                    onActivate={() => changeIndex(index)}
                                    isActive={isActive}
                                    onHoverChange={isActive ? setIsActiveZoneHovered : undefined}
                                    projectHref={isActive ? `/work/${project.id}?from=home` : undefined}
                                />
                            </motion.div>
                        )
                    })}

                    {/* View All Work */}
                    <motion.div 
                        className="shrink-0 flex items-center justify-center bg-neutral-900 rounded-2xl border border-white/10" 
                        animate={{ opacity: 0.6 }}
                        style={{ height: 'var(--card-h)', width: 'var(--card-h)' }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link href="/work" className="text-white/60 hover:text-white transition-colors flex flex-col items-center gap-4 group">
                            <div className="w-14 h-14 rounded-full border border-white/20 group-hover:border-white/50 flex items-center justify-center transition-colors">
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <span className="text-sm font-heading font-semibold tracking-tight">View all work</span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decoupled Metadata Section (Below the Row) — shared hover zone */}
            <div 
                className="w-full px-6 sm:px-10 md:px-[53px] mt-4 md:mt-8 min-h-[80px] md:min-h-[120px]"
                onMouseEnter={() => setIsActiveZoneHovered(true)}
                onMouseLeave={() => setIsActiveZoneHovered(false)}
            >
                <AnimatePresence mode="wait">
                    {activeProject && (
                        <motion.div
                            key={activeProject.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex flex-col"
                            style={{ maxWidth: 'calc(var(--card-h) * 1.333)' }}
                        >
                            {/* Categories */}
                            <div className="flex flex-wrap items-center text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-widest leading-tight mb-2 md:mb-3">
                                {activeProject.category && activeProject.category.split(',').map((cat, idx, arr) => (
                                    <span key={cat.trim()} className="flex items-center">
                                        {cat.trim()}
                                        {idx < arr.length - 1 && (
                                            <span className="text-white/20 mx-2 flex items-center">•</span>
                                        )}
                                    </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h3 className="font-heading font-medium text-white/80 leading-[1.3] text-base sm:text-lg md:text-xl lg:text-2xl tracking-tight text-balance mb-4 md:mb-6 max-w-2xl">
                                {activeProject.title}
                            </h3>

                            {/* Play Project CTA — always visible on mobile, hover-only on desktop */}
                            <div className="md:hidden">
                                <Link 
                                    href={`/work/${activeProject.id}?from=home`} 
                                    className="self-start inline-flex px-5 py-2 bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm rounded transition-colors items-center gap-2"
                                >
                                    Play Project
                                </Link>
                            </div>
                            <AnimatePresence>
                                {isActiveZoneHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="hidden md:block"
                                    >
                                        <Link 
                                            href={`/work/${activeProject.id}?from=home`} 
                                            className="self-start inline-flex px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold text-sm rounded transition-colors items-center gap-2"
                                        >
                                            Play Project
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
