"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard_Home } from "./ProjectCard_Home";
import type { Project } from "@/lib/cms/storage";

export function FeaturedProjectGallery({ projects }: { projects: Project[] }) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    if (projects.length === 0) return null;

    return (
        <section className="relative overflow-visible px-6 sm:px-10 md:px-[53px] py-16 md:py-24 w-full">
            {/* Cinematic Backdrop Overlay */}
            <AnimatePresence>
                {hoveredId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-xl pointer-events-none"
                        transition={{
                            duration: 0.5,
                        }}
                    />
                )}
            </AnimatePresence>

            <div className="w-full">
                <h3 className="text-xl sm:text-2xl font-bold text-white/90 mb-6 md:mb-8 font-heading tracking-tight drop-shadow-md">
                    Coming Up Next
                </h3>
                <div className={projects.length < 3 ? "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"}>
                    {projects.slice(0, 3).map((project, index) => (
                        <div key={project.id} className="relative z-0 hover:z-[100]">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                animate={{
                                    opacity: hoveredId && hoveredId !== project.id ? 0.3 : 1,
                                    scale: hoveredId && hoveredId !== project.id ? 0.95 : 1
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: index * 0.05
                                }}
                            >
                                <ProjectCard_Home
                                    project={project}
                                    onHoverStart={() => setHoveredId(project.id)}
                                    onHoverEnd={() => setHoveredId(null)}
                                    isHovered={hoveredId === project.id}
                                />
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
