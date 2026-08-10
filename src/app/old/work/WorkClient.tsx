"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ProjectGallery } from "@/components/ProjectGallery";
import type { Project } from "@/lib/cms/storage";

export function WorkClient({ projects }: { projects: Project[] }) {
    return (
        <>
            <main className="min-h-screen bg-black text-white flex flex-col items-center pt-24 px-6 pb-6 sm:px-12 sm:pb-12 relative overflow-hidden">
                <Navbar />

                {/* Background ambient glow */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-screen-2xl relative z-10 flex flex-col items-center mt-0">
                    {/* Projects Grid directly starts here */}
                    <div className="w-full mt-4">
                        <ProjectGallery projects={projects} />
                    </div>
                </div>
            </main>
        </>
    );
}
