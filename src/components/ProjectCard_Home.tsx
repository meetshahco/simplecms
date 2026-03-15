"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [loopKey, setLoopKey] = useState(0);
    const [dominantColors, setDominantColors] = useState<[string, string, string]>(["#4f46e5", "#7c3aed", "#2563eb"]);

    // Mobile scroll-to-pop logic
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "center center", "end start"]
    });

    const mobileScale = useTransform(scrollYProgress,
        [0, 0.5, 1],
        [0.9, 1.1, 0.9]
    );

    const mobileY = useTransform(scrollYProgress,
        [0, 0.5, 1],
        [20, 0, -20]
    );

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
            setProgress(0);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isHovered]);

    // Video Loop Engine (7 seconds)
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

                const duration = 7000;
                const start = Date.now();

                interval = setInterval(() => {
                    if (!videoRef.current) return;

                    const elapsed = Date.now() - start;
                    const newProgress = (elapsed % duration) / duration;
                    setProgress(newProgress * 100);

                    if (videoRef.current.currentTime >= 30) {
                        videoRef.current.currentTime = 0;
                    }
                }, 16);
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

    const glowColor1 = dominantColors[0];
    const glowColor2 = dominantColors[1];

    const toRgba = (color: string, alpha: number): string => {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r},${g},${b},${alpha})`;
        }
        return color.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
    };

    const animId = `cg${project.id.replace(/[^a-z0-9]/gi, '').slice(0, 10)}`;
    const spinCSS = `
        @keyframes ${animId}-spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;

    const conicGrad = `conic-gradient(
        from 0deg,
        ${toRgba(glowColor1, 0.55)},
        ${toRgba(glowColor2, 0.4)},
        ${toRgba(glowColor1, 0.55)},
        ${toRgba(glowColor2, 0.4)},
        ${toRgba(glowColor1, 0.55)}
    )`;

    return (
        <Link href={`/work/${project.id}?from=home`} className="block w-full h-auto relative">
            <style>{spinCSS}</style>

            {/* === Outer glow halo === */}
            <div
                className="absolute pointer-events-none"
                style={{
                    inset: '-40px',
                    borderRadius: '80px',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.7s ease',
                    zIndex: 1,
                    overflow: 'hidden',
                    filter: 'blur(22px)',
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    width: '200%', height: '200%',
                    background: conicGrad,
                    animation: isHovered ? `${animId}-spin 12s linear infinite` : 'none',
                }} />
            </div>

            {/* === CARD ===
                Height is the ONLY layout-triggering animation.
                Theater + meta are absolute-positioned → opacity-only → GPU composited, no reflow.
            */}
            <motion.div
                ref={cardRef}
                onMouseEnter={onHoverStart}
                onMouseLeave={onHoverEnd}
                className="relative w-full rounded-[40px] overflow-hidden cursor-pointer bg-neutral-900 group transform-gpu"
                animate={{
                    height: isFocused ? 820 : 650,
                    scale: isHovered ? 1.05 : 1,
                    zIndex: isHovered ? 100 : 1,
                    boxShadow: isHovered
                        ? "0 40px 100px -20px rgba(0, 0, 0, 0.9), 0 0 80px rgba(255, 255, 255, 0.05)"
                        : "none"
                }}
                style={{
                    willChange: 'transform',
                    scale: typeof window !== 'undefined' && window.innerWidth < 768 ? mobileScale : undefined,
                    y: typeof window !== 'undefined' && window.innerWidth < 768 ? mobileY : 0,
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Gradient glow overlay on hover */}
                <div className={cn(
                    "absolute -inset-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 transition-opacity duration-700 pointer-events-none z-50",
                    isHovered && "opacity-100"
                )} />

                {/* LAYER 0: Thumbnail — fades out on focus */}
                <div className="absolute inset-0 z-0">
                    {project.image && (
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            unoptimized={project.image.toLowerCase().endsWith('.gif')}
                            className={cn(
                                "object-cover object-center transition-opacity duration-700 ease-out",
                                isFocused ? "opacity-0" : "opacity-100"
                            )}
                            priority
                        />
                    )}
                    <div className={cn(
                        "absolute inset-x-[-1px] bottom-[-1px] h-[85%] bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700 rounded-b-[40px]",
                        isFocused ? "opacity-0" : "opacity-100"
                    )} />
                </div>

                {/* LAYER 1: Video Theater — absolute + opacity only, zero layout impact */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            key={loopKey}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0 z-10 bg-black"
                            onClick={e => e.preventDefault()} // stop Link navigation when clicking the theater
                        >
                            {project.video && project.video.includes("loom.com/share") ? (
                                <div className="relative w-full h-full">
                                    <iframe
                                        key={`loom-${isMuted}`}
                                        src={project.video.replace("loom.com/share/", "loom.com/embed/") + `?autoplay=1&muted=${isMuted ? 1 : 0}&preload=1&hide_owner=true&hide_share=true&hide_title=true&hide_embed_code=true&hide_speed=true&hideEmbedTopBar=true`}
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="autoplay"
                                        className="h-full w-full object-cover"
                                    />
                                    {/* Overlay only covers top so bottom mute button stays clickable */}
                                    <div className="absolute inset-x-0 top-0 bottom-16 z-10" />
                                </div>
                            ) : project.video ? (
                                <video
                                    ref={videoRef}
                                    src={project.video}
                                    muted={isMuted}
                                    playsInline
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Image
                                    src={project.image || ""}
                                    alt={project.title}
                                    fill
                                    unoptimized={(project.image || "").toLowerCase().endsWith('.gif')}
                                    className="object-cover object-center"
                                />
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mute button + progress bar — z-40 so they're above the meta section */}
                <AnimatePresence>
                    {isFocused && project.video && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute z-40 pointer-events-none inset-0"
                        >
                            {/* Mute / Unmute toggle */}
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (videoRef.current) videoRef.current.muted = !isMuted;
                                    setIsMuted(prev => !prev);
                                }}
                                className="absolute top-4 right-4 pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80 text-[10px] uppercase tracking-widest font-semibold hover:bg-black/70 transition-colors"
                            >
                                {isMuted
                                    ? <><VolumeX className="w-3 h-3" /> Unmute</>
                                    : <><Volume2 className="w-3 h-3" /> Mute</>
                                }
                            </button>

                            {/* Progress bar — only for direct video, not Loom */}
                            {!project.video.includes("loom.com/share") && (
                                <div className="absolute bottom-6 left-8 right-8 h-[3px] bg-white/10 rounded-full overflow-hidden backdrop-blur-md pointer-events-none">
                                    <motion.div
                                        className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LAYER 2: Meta — absolute at bottom, zero layout impact */}
                <div className="absolute bottom-0 left-0 right-0 z-30">
                    <div className={cn(
                        "flex flex-col transition-all duration-700 ease-in-out",
                        isFocused
                            ? "bg-black px-4 md:px-6 pt-4 pb-4 md:pb-8"
                            : "bg-transparent px-4 md:px-6 pb-4 md:pb-8"
                    )}>
                        {/* Title */}
                        <div className="min-h-[calc(3*1.25*1rem)] md:min-h-[calc(2*1.3*1.5rem)] flex items-center">
                            <motion.h3
                                className="font-heading font-semibold text-white leading-[1.25] tracking-tight line-clamp-3"
                                style={{ originX: 0, originY: 1 }}
                                animate={{
                                    fontSize: isFocused ? "calc(1.1rem + 0.5vw)" : "calc(2.5rem + 2vw)",
                                }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {project.title}
                            </motion.h3>
                        </div>

                        {/* Fading Metadata */}
                        <AnimatePresence mode="wait">
                            {isFocused && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="mt-1 flex flex-col gap-2"
                                >
                                    <p className="text-xs md:text-sm text-neutral-400 font-medium leading-relaxed w-full line-clamp-3 md:line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="flex items-center justify-between gap-4 pt-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {project.category && project.category.split(',').map((cat: string) => (
                                                <span key={cat.trim()} className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/90 font-bold whitespace-nowrap backdrop-blur-sm shadow-sm transition-colors hover:bg-white/10">
                                                    {cat.trim()}
                                                </span>
                                            ))}
                                            {project.tags.slice(0, 1).map((tag: string) => (
                                                <span key={tag} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/70 font-bold whitespace-nowrap backdrop-blur-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="group/btn w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-110 hover:bg-neutral-100">
                                                <ArrowRight className="w-6 h-6 md:w-7 md:h-7 -rotate-45 transition-transform group-hover/btn:rotate-0" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
