"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { VolumeX, Volume2 } from "lucide-react";
import type { Project } from "@/lib/cms/storage";
import { cn } from "@/lib/utils";

interface ProjectCard_HomeProps {
    project: Project;
    onActivate: () => void;
    isActive: boolean;
    onHoverChange?: (hovered: boolean) => void;
    projectHref?: string;
}

export function ProjectCard_Home({ project, onActivate, isActive, onHoverChange, projectHref }: ProjectCard_HomeProps) {
    const [isHovered, setIsHovered] = useState(false);
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

    // Hover delay logic (150ms) - Only play video if ACTIVE and HOVERED
    useEffect(() => {
        if (isActive && isHovered) {
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
    }, [isActive, isHovered]);

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

    // Detect if the thumbnail background is light or dark
    const isLightBackground = (() => {
        const match = glowColor.match(/rgb\((\d+),(\d+),(\d+)\)/);
        if (!match) return false;
        const [, r, g, b] = match.map(Number);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
    })();

    const handleClick = () => {
        if (isActive && projectHref) {
            window.location.href = projectHref;
        } else {
            onActivate();
        }
    };

    return (
        <div 
            className="w-full h-full relative z-0 hover:z-50 cursor-pointer overflow-hidden transition-all duration-500 transform-gpu bg-black"
            onMouseEnter={() => { setIsHovered(true); onHoverChange?.(true); }}
            onMouseLeave={() => { setIsHovered(false); onHoverChange?.(false); }}
            onClick={handleClick}
            style={{
                borderRadius: isActive ? '24px' : '16px',
                border: isHovered ? `1px solid ${glowColor}` : '1px solid rgba(255,255,255,0.05)',
            }}
        >
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
                <div 
                    className={cn(
                        "absolute top-4 right-4 sm:top-5 sm:right-5 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider z-20 pointer-events-none transition-all duration-300",
                        isLightBackground 
                            ? "bg-black/40 text-white border border-white/20" 
                            : "bg-white/10 text-white border border-white/20"
                    )}
                >
                    {project.caseStudyCount} Case Studies
                </div>
            ) : null}
        </div>
    );
}
