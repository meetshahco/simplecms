"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { VolumeX, Volume2, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/cms/storage";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

    useEffect(() => {
        if (isActive && isHovered) {
            timeoutRef.current = setTimeout(() => {
                setIsFocused(true);
            }, 200);
        } else {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const timer = setTimeout(() => setIsFocused(false), 0);
            return () => clearTimeout(timer);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isActive, isHovered]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (isFocused && project.video && videoElement) {
            videoElement.currentTime = 0;
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (e.name !== "AbortError") {
                        console.log("Video play failed", e);
                    }
                });
            }
        }
        return () => {
            if (videoElement) {
                videoElement.pause();
                videoElement.currentTime = 0;
            }
        };
    }, [isFocused, project.video]);

    const handleClick = () => {
        if (!isActive) {
            onActivate();
        }
    };

    return (
        <div 
            onClick={handleClick}
            className={cn(
                "relative flex-shrink-0 rounded-[2rem] overflow-hidden transition-all duration-700 select-none bg-neutral-900 border border-white/5",
                isActive 
                    ? "w-[var(--card-h)] h-[var(--card-h)] sm:w-[calc(var(--card-h)*1.4)] sm:h-[var(--card-h)] border-white/20 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)]" 
                    : "w-[calc(var(--card-h)*0.85)] h-[calc(var(--card-h)*0.85)] opacity-40 hover:opacity-75"
            )}
            onMouseEnter={() => {
                setIsHovered(true);
                onHoverChange?.(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                onHoverChange?.(false);
            }}
        >
            {/* Background Image / Media */}
            {project.image && (
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-1000",
                        isHovered && isActive ? "scale-105" : "scale-100",
                        isFocused && project.video ? "opacity-0" : "opacity-100"
                    )}
                />
            )}

            {/* Video Preview */}
            {isActive && project.video && (
                <video
                    ref={videoRef}
                    src={project.video}
                    muted={isMuted}
                    loop
                    playsInline
                    className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10",
                        isFocused ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                />
            )}

            {/* Cinematic Gradient overlay */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none transition-opacity duration-500",
                isActive ? "opacity-100" : "opacity-30"
            )} />

            {/* Title / Description info when active */}
            <AnimatePresence>
                {isActive && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4 }}
                        className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30 flex flex-col justify-end text-left pointer-events-auto"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em]">{project.category?.split(',')[0]}</span>
                        </div>
                        <h4 className="text-lg md:text-xl font-heading font-black text-white leading-tight">
                            {project.title}
                        </h4>
                        
                        <p className="hidden md:block text-xs text-neutral-400 font-light mt-2 line-clamp-2 max-w-md">
                            {project.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                            {projectHref ? (
                                <Link 
                                    href={projectHref}
                                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white hover:text-neutral-300 transition-colors"
                                >
                                    View Case Study <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            ) : null}

                            {project.video && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMuted(!isMuted);
                                    }}
                                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors"
                                    aria-label={isMuted ? "Unmute preview" : "Mute preview"}
                                >
                                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
