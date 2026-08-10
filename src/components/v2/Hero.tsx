"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/cms/storage";

const ROLES = [
    "make decisions",
    "preserve craft",
    "understand users",
    "take responsibility",
    "own the vision",
];

export function Hero({ featuredProject }: { featuredProject?: Project }) {
    const [roleIndex, setRoleIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
    };

    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center pt-32 pb-16 px-4 md:px-12 max-w-7xl mx-auto overflow-hidden">
            {/* Ambient Background Lights */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10 w-full">
                
                {/* Left: Bio & Focus (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-8 text-left">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] w-fit"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Open to New Opportunities
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.05] text-white"
                        >
                            Design <br className="hidden sm:inline" />
                            with intent.
                        </motion.h1>

                        {/* Interactive Role cycle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-base sm:text-lg md:text-xl font-light text-neutral-500 flex items-center gap-2 h-8"
                        >
                            <span>I&apos;m here to</span>
                            <div className="relative inline-flex h-full overflow-hidden items-center justify-start min-w-[150px]">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                        key={ROLES[roleIndex]}
                                        initial={{ y: "110%", opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: "-110%", opacity: 0 }}
                                        transition={{ y: { duration: 0.4, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.2 } }}
                                        className="font-mono font-medium text-neutral-300 block whitespace-nowrap text-blue-400/90"
                                    >
                                        {ROLES[roleIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-md"
                    >
                        Holistic Product & UX generalist with 9+ years of design and technology craft. Creating high-performance interactive experiences that merge technical capability with elegant form.
                    </motion.p>

                    {/* Quick navigation bento items or CTA */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap gap-4 pt-2"
                    >
                        <Link 
                            href="/work"
                            className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95 shadow-xl"
                        >
                            Explore Work
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        
                        <Link 
                            href="/about"
                            className="group flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
                        >
                            My Story
                        </Link>
                    </motion.div>
                </div>

                {/* Right: Immersive Spotlight (7 cols) */}
                <div className="lg:col-span-7 flex justify-center w-full">
                    {featuredProject && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-2xl relative group"
                        >
                            {/* Glowing light tracking cursor hover */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] opacity-30 blur-xl group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                            
                            {/* Tilt Wrapper */}
                            <div 
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
                                style={{
                                    transform: `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * -10}deg)`,
                                    transition: "transform 0.2s ease-out"
                                }}
                                className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl flex flex-col justify-end p-8 grainy-filter"
                            >
                                {/* Background Image */}
                                {featuredProject.image && (
                                    <Image
                                        src={featuredProject.image}
                                        alt={featuredProject.title}
                                        fill
                                        className="object-cover object-center scale-[1.02] group-hover:scale-105 transition-transform duration-700 pointer-events-none mix-blend-overlay opacity-60 group-hover:opacity-80"
                                    />
                                )}

                                {/* Card Cinematic Gradients */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                                {/* Project Card Content */}
                                <div className="relative z-20 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em]">Featured Spotlight</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                            {featuredProject.category?.split(',')[0]}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-heading font-black text-white leading-tight tracking-tight">
                                        {featuredProject.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed line-clamp-2 max-w-xl">
                                        {featuredProject.description}
                                    </p>

                                    <div className="pt-2 flex items-center justify-between">
                                        <Link 
                                            href={`/work/${featuredProject.id}`}
                                            className="group/btn flex items-center gap-3 bg-white text-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95"
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                            Case Study
                                        </Link>

                                        {featuredProject.caseStudyCount && featuredProject.caseStudyCount > 0 ? (
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider border border-white/10 bg-white/[0.02] px-3 py-1.5 rounded-full">
                                                {featuredProject.caseStudyCount} Chapters
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>
        </section>
    );
}
