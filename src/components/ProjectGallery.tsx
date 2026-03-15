"use client";
import { ArrowRight, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProjectCard_Work } from "./ProjectCard_Work";
import type { Project } from "@/lib/cms/storage";

export function ProjectGallery({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
        return (
            <section className="py-24 px-4 md:px-6">
                <div className="mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="w-full relative group rounded-3xl border border-white/5 bg-neutral-900/20 backdrop-blur-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8 text-center"
                    >
                        {/* Subtle ambient glow in the background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/[0.03] rounded-full blur-[80px] group-hover:bg-white/[0.05] transition-colors duration-700 pointer-events-none" />

                        {/* Animated Sparkles Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                            className="bg-neutral-900 border border-white/10 p-4 rounded-full mb-6 relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                        >
                            <Sparkles className="w-8 h-8 text-neutral-400" />
                        </motion.div>

                        <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight mb-3 relative z-10">
                            Curating new stories...
                        </h3>
                        <p className="text-neutral-500 max-w-md mx-auto text-sm md:text-base leading-relaxed relative z-10">
                            The portfolio is currently being updated. Check back soon or reach out directly to see recent case studies and work samples.
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
                <div className="grid grid-cols-1 gap-8 md:gap-12">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <ProjectCard_Work project={project} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
