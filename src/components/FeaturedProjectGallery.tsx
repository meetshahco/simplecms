"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard_Home } from "./ProjectCard_Home";
import type { Project } from "@/lib/cms/storage";

export function FeaturedProjectGallery({ projects }: { projects: Project[] }) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    if (projects.length === 0) return null;

    return (
        <section className="relative overflow-visible px-6 md:px-12 py-32">
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

            <div className="mx-auto max-w-5xl">
                <div className="grid grid-cols-1 gap-32 lg:gap-40">
                    {projects.map((project, index) => (
                        <div key={project.id} className="relative z-0 hover:z-[100]">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                animate={{
                                    opacity: hoveredId && hoveredId !== project.id ? 0.3 : 1,
                                    scale: hoveredId && hoveredId !== project.id ? 0.9 : 1
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
