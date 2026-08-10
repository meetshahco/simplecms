"use client";

import { motion } from "framer-motion";
import { ProjectGallery } from "@/components/v2/ProjectGallery";
import type { Project } from "@/lib/cms/storage";

export function WorkClient({ projects }: { projects: Project[] }) {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center pt-32 pb-16 relative overflow-hidden">
            
            {/* Ambient Background glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-7xl px-4 md:px-12 relative z-10 flex flex-col items-start mb-16 space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] w-fit"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Case Studies
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-none text-white"
                >
                    Selected Craft.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-sm sm:text-base text-neutral-400 font-light max-w-xl leading-relaxed"
                >
                    A deep dive into selected product designs and engineering prototypes. Exploring interfaces that feel natural, digital products that solve complex tasks, and meticulous details.
                </motion.p>
            </div>

            <div className="w-full relative z-10">
                <ProjectGallery projects={projects} />
            </div>
        </main>
    );
}
