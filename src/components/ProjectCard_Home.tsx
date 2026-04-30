"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, VolumeX, Volume2 } from "lucide-react";
import type { Project } from "@/lib/cms/storage";
import { cn } from "@/lib/utils";

interface ProjectCard_HomeProps {
    project: Project;
    onHoverStart: () => void;
    onHoverEnd: () => void;
    isHovered: boolean;
}

export function ProjectCard_Home({ project, onHoverStart, onHoverEnd, isHovered }: ProjectCard_HomeProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [loopKey, setLoopKey] = useState(0);
    const [dominantColors, setDominantColors] = useState<[string, string, string]>(["rgba(255,255,255,0.1)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.1)"]);

    // Extract dominant colors from thumbnail on mount
    useEffect(() => {
        if (!project.image) return;
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = project.image;
        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = 80;
                canvas.height = 80;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                ctx.drawImage(img, 0, 0, 80, 80);
                const sample = (x: number, y: number): string => {
                    const d = ctx.getImageData(x, y, 1, 1).data;
                    return `rgb(${d[0]},${d[1]},${d[2]})`;
                };
                setDominantColors([
                    sample(10, 10),
                    sample(40, 40),
                    sample(70, 70),
                ]);
            } catch (_) { /* tainted canvas, use defaults */ }
        };
    }, [project.image]);

    // Hover delay logic (150ms)
    useEffect(() => {
        if (isHovered) {
            timeoutRef.current = setTimeout(() => {
                setIsFocused(true);
            }, 150);
        } else {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsFocused(false);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isHovered]);

    // Video Loop Engine (7 seconds or Loom)
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isFocused && project.video) {
            if (project.video.includes("loom.com/share")) {
                const duration = 30000;
                interval = setInterval(() => {
                    setLoopKey(prev => prev + 1);
                }, duration);
            } else if (videoRef.current) {
                videoRef.current.currentTime = 0;
                const playPromise = videoRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        if (e.name !== "AbortError") {
                            console.log("Video play failed", e);
                        }
                    });
                }
            }
        }
        return () => {
            if (interval) clearInterval(interval);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        };
    }, [isFocused, project.video]);

    const glowColor = dominantColors[0];

    return (
        <Link href={`/work/${project.id}?from=home`} className="block w-full h-auto relative group z-0 hover:z-50">
            {/* Main Card Container - 1:1 Aspect Ratio */}
            <div 
                className={cn(
                    "relative w-full aspect-square rounded-[24px] md:rounded-[32px] overflow-hidden bg-neutral-900 flex flex-col transition-all duration-500 transform-gpu",
                )}
                onMouseEnter={onHoverStart}
                onMouseLeave={onHoverEnd}
                style={{
                    border: isHovered ? `1px solid ${glowColor}` : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: isHovered ? `0 0 60px -15px ${glowColor}` : '0 20px 40px -10px rgba(0,0,0,0.5)',
                }}
            >
                {/* === TOP 66.6% : THUMBNAIL / VIDEO === */}
                <div className="relative h-[66.666%] w-full overflow-hidden bg-black shrink-0">
                    
                    {/* Default Image Thumbnail */}
                    <div className={cn(
                        "absolute inset-0 z-0 transition-opacity duration-700 ease-out",
                        isFocused && project.video ? "opacity-0" : "opacity-100"
                    )}>
                        {project.image && (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                unoptimized={project.image.toLowerCase().endsWith('.gif')}
                                className="object-cover object-center"
                                priority
                            />
                        )}
                    </div>

                    {/* Video Player (Fades in on focus) */}
                    <AnimatePresence>
                        {isFocused && project.video && (
                            <motion.div
                                key={loopKey}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="absolute inset-0 z-10 bg-black"
                                onClick={e => e.preventDefault()}
                            >
                                {project.video.includes("loom.com/share") ? (
                                    <div className="relative w-full h-full">
                                        <iframe
                                            key={`loom-${isMuted}`}
                                            src={project.video.replace("loom.com/share/", "loom.com/embed/") + `?autoplay=1&muted=${isMuted ? 1 : 0}&preload=1&hide_owner=true&hide_share=true&hide_title=true&hide_embed_code=true&hide_speed=true&hideEmbedTopBar=true`}
                                            frameBorder="0"
                                            allowFullScreen
                                            allow="autoplay"
                                            className="h-full w-full object-cover pointer-events-none"
                                        />
                                        <div className="absolute inset-x-0 top-0 bottom-16 z-10" />
                                    </div>
                                ) : (
                                    <video
                                        ref={videoRef}
                                        src={project.video}
                                        muted={isMuted}
                                        playsInline
                                        loop
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Mute Button Overlay */}
                    <AnimatePresence>
                        {isFocused && project.video && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute z-40 pointer-events-none inset-0"
                            >
                                <button
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (videoRef.current) videoRef.current.muted = !isMuted;
                                        setIsMuted(prev => !prev);
                                    }}
                                    className="absolute top-4 right-4 sm:top-5 sm:right-5 pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80 text-[10px] uppercase tracking-widest font-semibold hover:bg-black/70 transition-colors"
                                >
                                    {isMuted
                                        ? <><VolumeX className="w-3 h-3" /> Unmute</>
                                        : <><Volume2 className="w-3 h-3" /> Mute</>
                                    }
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Case Studies Chip (Top Right) */}
                    {project.caseStudyCount && project.caseStudyCount > 0 && !(isFocused && project.video) ? (
                        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider shadow-xl z-20 pointer-events-none transition-opacity duration-300">
                            {project.caseStudyCount} Case Studies
                        </div>
                    ) : null}
                </div>

                {/* === BOTTOM 33.3% : CONTENT === */}
                {/* We use inline-size container to make inner text and spacing scale perfectly with the card's exact pixel width */}
                <div 
                    className="relative h-[33.333%] w-full bg-neutral-900 flex flex-col justify-between p-4 sm:p-5 md:p-6 z-30 overflow-hidden"
                    style={{ containerType: 'inline-size' }}
                >
                    
                    {/* Logo & Title */}
                    <div className="flex flex-col gap-2 sm:gap-3 shrink-0">
                        {project.clientLogo ? (
                            <div className="h-4 sm:h-5 md:h-6 w-auto flex-shrink-0 origin-left">
                                <img src={project.clientLogo} alt={`${project.title} Logo`} className="h-full w-auto object-contain brightness-0 invert" />
                            </div>
                        ) : (
                            <div className="h-1" /> // Spacer if no logo
                        )}
                        
                        {/* Title: Size uses cqw (Container Query Width) so it scales linearly with the card size without wrapping limits */}
                        <h3 className="font-heading font-bold text-white leading-[1.15] text-[6cqw] tracking-tight">
                            {project.title}
                        </h3>
                    </div>

                    {/* Categories & Action Button */}
                    <div className="flex items-end justify-between gap-4 mt-auto pt-2 shrink-0">
                        {/* Categories */}
                        <div className="flex flex-wrap items-center text-[2.5cqw] font-medium text-white/60 uppercase tracking-widest leading-tight">
                            {project.category && project.category.split(',').map((cat, idx, arr) => (
                                <span key={cat.trim()} className="flex items-center">
                                    {cat.trim()}
                                    {idx < arr.length - 1 && (
                                        <span className="text-white/30 mx-1.5 sm:mx-2 flex items-center">•</span>
                                    )}
                                </span>
                            ))}
                        </div>

                        {/* Action Arrow */}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45 transition-transform group-hover:rotate-0" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
