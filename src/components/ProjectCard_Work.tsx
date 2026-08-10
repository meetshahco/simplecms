"use client";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef, MouseEvent } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/cms/storage";
import { cn } from "@/lib/utils";

export function ProjectCard_Work({ project, index }: { project: Project, index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Scroll progress specifically for this card
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });

    const xPos = useMotionValue(0);
    const yPos = useMotionValue(0);

    const xSpring = useSpring(xPos, { stiffness: 300, damping: 40 });
    const ySpring = useSpring(yPos, { stiffness: 300, damping: 40 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["2deg", "-2deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        xPos.set(xPct);
        yPos.set(yPct);
    }

    function handleMouseLeave() {
        xPos.set(0);
        yPos.set(0);
    }

    const scrollScale = useTransform(scrollYProgress, [0, 0.2, 0.4, 1], [0.95, 1, 1, 1]);
    const scrollOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3, 1], [0.4, 1, 1, 1]);
    
    // Exempt first card from scroll-in effects
    const isFirst = index === 0;
    const scale = isFirst ? 1 : scrollScale;
    const opacity = isFirst ? 1 : scrollOpacity;

    return (
        <Link href={`/work/${project.id}`}>
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    scale,
                    opacity,
                    transformPerspective: 1200,
                }}
                className={cn(
                    "group relative w-full cursor-pointer overflow-hidden rounded-[2rem] bg-[#111111] transition-all duration-700 hover:shadow-[0_0_80px_rgba(0,0,0,0.5)]",
                    "flex flex-col md:grid md:grid-cols-12 md:aspect-[21/9]"
                )}
            >
                {/* Left: Media Column (7 Cols) */}
                <div className="relative md:col-span-7 h-[300px] md:h-full w-full overflow-hidden bg-neutral-900">
                    {/* Cinematic Video/Image Wrapper */}
                    <div className="absolute inset-0 z-0">
                        {project.video ? (
                            <video
                                src={project.video}
                                muted
                                loop
                                playsInline
                                autoPlay
                                className="h-full w-full object-cover scale-105 transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                            />
                        ) : project.image && (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover scale-105 transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                            />
                        )}
                    </div>

                    {/* Gradient Overlays for Cinematic Feel */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/40 z-10" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                    
                    {/* Category Label (Glass) */}
                    <div className="absolute top-6 left-6 z-20">
                        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                            {project.category?.split(',')[0]}
                        </div>
                    </div>
                </div>

                {/* Right: Info Column (5 Cols) */}
                <div className="relative md:col-span-5 flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-[#111111] border-l border-white/5">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Project {String(index + 1).padStart(2, '0')}</span>
                            <div className="h-[1px] w-8 bg-white/10" />
                        </div>
                        
                        <h3 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.1] transition-colors group-hover:text-white">
                            {project.title}
                        </h3>
                        
                        <p className="text-sm md:text-base text-neutral-500 leading-relaxed font-light line-clamp-3">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {project.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                            View Case Study <ArrowRight className="h-3 w-3" />
                        </div>
                        
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl">
                            <ArrowRight className="h-5 w-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                    </div>
                </div>

                {/* Bottom Border Accent (Animated on Hover) */}
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
            </motion.div>
        </Link>
    );
}
