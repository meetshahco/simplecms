"use client";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/cms/storage";
import { cn } from "@/lib/utils";

export function ProjectCard_Work({ project }: { project: Project }) {
    // Spotlight position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 3D tilt tracking (-0.5 to 0.5)
    const xPos = useMotionValue(0);
    const yPos = useMotionValue(0);

    const xSpring = useSpring(xPos, { stiffness: 300, damping: 40 });
    const ySpring = useSpring(yPos, { stiffness: 300, damping: 40 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();

        // Spotlight
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);

        // 3D Tilt
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;

        xPos.set(xPct);
        yPos.set(yPct);
    }

    function handleMouseLeave() {
        xPos.set(0);
        yPos.set(0);
    }

    return (
        <Link href={`/work/${project.id}`}>
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformPerspective: 1200,
                }}
                className={cn(
                    "group relative w-full cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 transition-colors hover:border-white/20",
                    "flex flex-col md:grid md:grid-cols-2" // Responsive layout
                )}
            >
                {/* Ambient Glow */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 80%
            )
          `,
                    }}
                />

                {/* Left: GIF/Video Preview */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 md:border-b-0 md:border-r bg-neutral-800">
                    {/* Video that plays on hover - Z-index higher to sit on top of image when active */}
                    {project.video ? (
                        <div className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            <video
                                src={project.video}
                                muted
                                loop
                                playsInline
                                autoPlay={true}
                                className="h-full w-full object-cover scale-110 transition-transform duration-700"
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center bg-blue-500/10">
                            <span className="text-blue-400 text-xs font-medium uppercase tracking-widest">No Preview Video</span>
                        </div>
                    )}

                    {/* Fallback Image */}
                    {project.image ? (
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                            <ArrowRight className="w-8 h-8 text-neutral-700" />
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="relative flex flex-col justify-between p-6 md:p-8">
                    <div>
                        <h3 className="font-heading text-3xl font-bold text-white">{project.title}</h3>
                        <p className="mt-3 text-neutral-400 leading-relaxed">{project.description}</p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-neutral-300">
                                    {tag}
                                </span>
                            ))}
                            {project.caseStudyCount !== undefined && (
                                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-400 font-medium">
                                    {project.caseStudyCount} Case Studies
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex items-end justify-between md:justify-end">
                        <span className="md:hidden text-sm text-neutral-500">View Project</span>
                        <div className="rounded-full bg-white p-3 text-black transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
