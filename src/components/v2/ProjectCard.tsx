"use client";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef, MouseEvent } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Project } from "@/lib/cms/storage";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, index }: { project: Project, index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Scroll progress for parallax / scale transitions
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const xPos = useMotionValue(0);
    const yPos = useMotionValue(0);

    const xSpring = useSpring(xPos, { stiffness: 200, damping: 30 });
    const ySpring = useSpring(yPos, { stiffness: 200, damping: 30 });

    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["4deg", "-4deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);

        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        xPos.set(xPct);
        yPos.set(yPct);
    }

    function handleMouseLeave() {
        xPos.set(0);
        yPos.set(0);
    }

    const scrollScale = useTransform(scrollYProgress, [0, 0.25], [0.96, 1]);
    const scrollOpacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 1]);
    const scrollYParallax = useTransform(scrollYProgress, [0, 1], [30, -30]);

    // Keep first card fully focused initially
    const scale = index === 0 ? 1 : scrollScale;
    const opacity = index === 0 ? 1 : scrollOpacity;
    const yParallax = index === 0 ? 0 : scrollYParallax;

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
                    y: yParallax,
                    transformPerspective: 1200,
                }}
                className={cn(
                    "group relative w-full cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-neutral-900/40 backdrop-blur-md transition-all duration-700 hover:border-white/20 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]",
                    "flex flex-col md:grid md:grid-cols-12 md:aspect-[21/9]"
                )}
            >
                {/* Radial Hover Spotlight */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                600px circle at ${mouseX}px ${mouseY}px,
                                rgba(255, 255, 255, 0.04),
                                transparent 80%
                            )
                        `,
                    }}
                />

                {/* Left Column: Media (7 cols) */}
                <div className="relative md:col-span-7 h-[280px] md:h-full w-full overflow-hidden bg-neutral-950">
                    <div className="absolute inset-0 z-0">
                        {project.video ? (
                            <video
                                src={project.video}
                                muted
                                loop
                                playsInline
                                autoPlay
                                className="h-full w-full object-cover scale-[1.03] transition-transform duration-[1500ms] ease-out group-hover:scale-108"
                            />
                        ) : project.image && (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover scale-[1.03] transition-transform duration-[1500ms] ease-out group-hover:scale-108"
                            />
                        )}
                    </div>

                    {/* Gradient Overlay for Cinematic Atmosphere */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60 z-10" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-10" />
                    
                    {/* Category Glass Pill */}
                    <div className="absolute top-6 left-6 z-20">
                        <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white/70 uppercase tracking-widest leading-none">
                            {project.category?.split(',')[0]}
                        </div>
                    </div>
                </div>

                {/* Right Column: Info (5 cols) */}
                <div className="relative md:col-span-5 flex flex-col justify-between p-8 sm:p-12 bg-neutral-950/90 border-t md:border-t-0 md:border-l border-white/5">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.4em]">
                                Project {String(index + 1).padStart(2, '0')}
                            </span>
                            <div className="h-[1px] w-6 bg-white/10" />
                        </div>
                        
                        <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                            {project.title}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light line-clamp-3">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                            {project.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[9px] font-bold text-white/40 uppercase tracking-widest px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-white uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-3 group-hover:translate-x-0">
                            Explore Case Study <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                        
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl">
                            <ArrowRight className="h-5 w-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                    </div>
                </div>

                {/* Animated Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
            </motion.div>
        </Link>
    );
}
