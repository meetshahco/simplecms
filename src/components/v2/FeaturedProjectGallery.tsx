"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ProjectCard_Home } from "./ProjectCard_Home";
import type { Project } from "@/lib/cms/storage";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function FeaturedProjectGallery({ projects }: { projects: Project[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (projects.length === 0) return null;

    const goLeft = () => setActiveIndex(Math.max(0, activeIndex - 1));
    const goRight = () => setActiveIndex(Math.min(projects.length - 1, activeIndex + 1));

    // Touch swipe support
    const touchStartX = useRef<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const threshold = 50;
        if (deltaX < -threshold) goRight();
        else if (deltaX > threshold) goLeft();
        touchStartX.current = null;
    };

    return (
        <section 
            className="relative py-24 w-full overflow-hidden max-w-7xl mx-auto px-4 md:px-12"
            style={{
                '--gap': '24px',
                '--card-h': '380px',
            } as React.CSSProperties}
        >
            <style>{`
                :root {
                    --card-h: 320px;
                }
                @media (min-width: 640px) {
                    :root {
                        --card-h: 360px;
                    }
                }
                @media (min-width: 1024px) {
                    :root {
                        --card-h: 420px;
                    }
                }
            `}</style>

            <div className="flex items-center justify-between mb-12">
                <div className="space-y-2">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Curated Folio</span>
                    <h3 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                        Selected Works
                    </h3>
                </div>

                {/* Arrows */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={goLeft}
                        disabled={activeIndex === 0}
                        className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all hover:bg-white/5"
                        aria-label="Previous Project"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={goRight}
                        disabled={activeIndex === projects.length - 1}
                        className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all hover:bg-white/5"
                        aria-label="Next Project"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Slider track */}
            <div 
                className="relative w-full touch-pan-y overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <motion.div 
                    className="flex flex-row items-center"
                    style={{ gap: 'var(--gap)' }}
                    animate={{ x: `calc(-${activeIndex} * (var(--card-h) * 0.85 + var(--gap)))` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {projects.map((project, idx) => (
                        <ProjectCard_Home
                            key={project.id}
                            project={project}
                            isActive={idx === activeIndex}
                            onActivate={() => setActiveIndex(idx)}
                            projectHref={`/work/${project.id}`}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
