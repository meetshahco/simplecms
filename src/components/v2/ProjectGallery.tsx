"use client";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/cms/storage";

export function ProjectGallery({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-neutral-500 font-light">No projects found.</p>
            </div>
        );
    }

    return (
        <section className="pt-0 pb-32 w-full max-w-7xl mx-auto px-4 md:px-12">
            <div className="grid grid-cols-1 gap-16 md:gap-32 w-full">
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>
        </section>
    );
}
