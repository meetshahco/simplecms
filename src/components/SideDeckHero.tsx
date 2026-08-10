"use client";
import { motion } from "framer-motion";
import { Play, ArrowRight, Layers } from "lucide-react";
import { useRef, useState, MouseEvent } from "react";
import { useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export function SideDeckHero() {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 3D Tilt Effect
    const xPos = useMotionValue(0);
    const yPos = useMotionValue(0);
    const xSpring = useSpring(xPos, { stiffness: 300, damping: 40 });
    const ySpring = useSpring(yPos, { stiffness: 300, damping: 40 });
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["2deg", "-2deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
        xPos.set((clientX - left) / width - 0.5);
        yPos.set((clientY - top) / height - 0.5);
    }

    function handleMouseLeave() {
        xPos.set(0);
        yPos.set(0);
    }

    return (
        <section className="w-full mb-20 md:mb-32">
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformPerspective: 1200,
                }}
                className="group relative w-full rounded-[2.5rem] bg-[#111111] overflow-hidden border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] transition-all duration-700 hover:border-white/20"
            >
                {/* Spotlight Ambient Glow */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                800px circle at ${mouseX}px ${mouseY}px,
                                rgba(255, 255, 255, 0.05),
                                transparent 80%
                            )
                        `,
                    }}
                />

                <div className="flex flex-col lg:grid lg:grid-cols-12 min-h-[500px]">
                    {/* Left: Cinematic Embed Area (7 Cols) */}
                    <div className="relative lg:col-span-7 h-[350px] lg:h-full w-full bg-neutral-900 border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
                        {/* 
                            PLACEHOLDER FOR DECK EMBED 
                            You can replace this <div> with an <iframe> for Pitch/Google Slides
                        */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 z-0" />
                            <div className="relative z-10 flex flex-col items-center gap-4 text-white/20 group-hover:text-white/40 transition-colors duration-700">
                                <Layers className="w-16 h-16 stroke-[1px]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Slide Deck Preview</span>
                            </div>
                        </div>

                        {/* Interactive Overlay to maintain Netflix "Trailer" feel */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700 z-10" />
                        
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                            >
                                <Play className="w-8 h-8 fill-current ml-1" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Right: Pitch & Metadata (5 Cols) */}
                    <div className="relative lg:col-span-5 flex flex-col justify-center p-8 md:p-12 lg:p-16 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.5em]">Executive Summary</span>
                                <div className="h-[1px] w-12 bg-blue-500/30" />
                            </div>
                            <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.05]">
                                TL;DR? <br />
                                <span className="text-neutral-500 italic font-light">Here&apos;s the deck.</span>
                            </h2>
                            <p className="text-neutral-400 font-light leading-relaxed max-w-sm">
                                A curated overview of my design philosophy, case studies, and core metrics for those on a tight schedule.
                            </p>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <button className="flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95">
                                <Play className="w-4 h-4 fill-current" />
                                Play Deck
                            </button>
                            <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-white/10">
                                Download PDF
                            </button>
                        </div>

                        {/* Subtle Badge */}
                        <div className="absolute bottom-8 right-8 opacity-20">
                            <span className="text-[10px] font-bold uppercase tracking-widest">© 2024 Meet Shah</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
