"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useContactAnimation } from "@/context/ContactAnimationContext";

const ROLES = [
    "make decisions",
    "preserve craft",
    "understand users",
    "take responsibility",
    "own the vision",
];

const CLIENT_LOGOS = [
    { id: '1', name: 'Brand 1', src: '/uploads/1.svg' },
    { id: '2', name: 'Brand 2', src: '/uploads/2.svg' },
    { id: '3', name: 'Brand 3', src: '/uploads/3.svg' },
    { id: '4', name: 'Brand 4', src: '/uploads/4.svg' },
    { id: '5', name: 'Brand 5', src: '/uploads/5.svg' },
    { id: '6', name: 'Brand 6', src: '/uploads/6.svg' },
    { id: '7', name: 'Brand 7', src: '/uploads/7.svg' },
    { id: '8', name: 'Brand 8', src: '/uploads/8.svg' },
    { id: '9', name: 'Brand 9', src: '/uploads/9.svg' },
    { id: '10', name: 'Brand 10', src: '/uploads/10.svg' },
    { id: '11', name: 'Brand 11', src: '/uploads/11.svg' },
];

import Link from "next/link";
import { Play } from "lucide-react";
import type { Project } from "@/lib/cms/storage";

export function Hero({ featuredProject }: { featuredProject?: Project }) {
    const [roleIndex, setRoleIndex] = useState(0);
    const { isViewDeckCta, viewDeckRef, triggerPlaneAnimation } = useContactAnimation();

    // Cycle Roles
    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative flex flex-col pt-20 md:pt-28 pb-4 overflow-hidden w-full items-center justify-center min-h-[80vh]">
            
            {/* NETFLIX-STYLE HERO CARD */}
            {featuredProject && (
                <div className="w-full px-6 sm:px-10 md:px-[53px] relative z-10 mb-8 sm:mb-12">
                    <div className="group relative w-full min-h-[480px] sm:min-h-[550px] max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh] aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] rounded-[24px] md:rounded-[32px] overflow-hidden bg-neutral-900 border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-white/30 hover:shadow-[0_0_80px_-20px_rgba(255,255,255,0.15)] cursor-pointer">
                        
                        {/* Full Card Click Overlay */}
                        <Link href={`/work/${featuredProject.id}?from=home`} className="absolute inset-0 z-10" aria-label={`View ${featuredProject.title} project`} />
                        
                        {/* Background Cover */}
                        {featuredProject.image && (
                            <motion.img 
                                src={featuredProject.image} 
                                alt={featuredProject.title}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay origin-center"
                            />
                        )}

                        {/* Cinematic Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/80 sm:to-black/20 to-transparent" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col p-6 sm:p-8 md:p-10 lg:p-12 max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] 2xl:max-w-[60%] pointer-events-none z-20">
                            
                            <div className="flex-1 flex flex-col justify-end sm:justify-center items-center sm:items-start text-center sm:text-left min-h-0 overflow-hidden pointer-events-auto pb-4 sm:pb-0">
                                {/* Logo */}
                                {featuredProject.clientLogo && (
                                    <div className="mb-6 sm:mb-6 shrink-0">
                                        <img src={featuredProject.clientLogo} alt={`${featuredProject.title} Logo`} className="h-6 sm:h-8 md:h-10 object-contain" />
                                    </div>
                                )}

                                {/* Title */}
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-heading font-black text-white tracking-tight leading-[1.2] mb-6 sm:mb-4 drop-shadow-lg line-clamp-3 sm:line-clamp-4 shrink-0 px-4 sm:px-0">
                                    {featuredProject.title}
                                </h2>

                                {/* Categories */}
                                <div className="flex items-center justify-center sm:justify-start flex-wrap text-[10px] sm:text-xs md:text-sm font-medium text-white/80 mb-6 sm:mb-5 drop-shadow-md leading-none shrink-0 w-full px-2 sm:px-0">
                                    {featuredProject.category && featuredProject.category.split(',').map((cat, idx, arr) => (
                                        <span key={cat.trim()} className="flex items-center uppercase tracking-widest">
                                            {cat.trim()}
                                            {idx < arr.length - 1 && (
                                                <span className="text-white/50 text-[8px] sm:text-[10px] flex items-center mx-3 sm:mx-4">•</span>
                                            )}
                                        </span>
                                    ))}
                                </div>

                                {/* Description */}
                                {featuredProject.description && (
                                    <p className="hidden sm:block text-xs sm:text-sm md:text-base lg:text-lg text-neutral-300 font-medium leading-relaxed drop-shadow-md line-clamp-3 sm:line-clamp-4 md:line-clamp-5 lg:line-clamp-6">
                                        {featuredProject.description}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-2 sm:mt-auto pt-2 sm:pt-6 flex justify-center sm:justify-start items-center shrink-0 pointer-events-auto w-full sm:w-auto z-30 relative">
                                <Link 
                                    href={`/work/${featuredProject.id}?from=home`}
                                    className="group flex items-center gap-2 sm:gap-3 bg-white text-black px-4 sm:px-6 md:px-7 py-2 sm:py-2.5 md:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95"
                                >
                                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-current" />
                                    Play Project
                                </Link>
                            </div>
                        </div>

                        {/* Case Studies Chip */}
                        {featuredProject.caseStudyCount && featuredProject.caseStudyCount > 0 ? (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bottom-auto sm:top-auto sm:left-auto sm:translate-x-0 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 lg:bottom-12 lg:right-12 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider shadow-xl z-20 pointer-events-none">
                                {featuredProject.caseStudyCount} Case Studies
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* The Notibar - Subdued Text Strip */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full relative z-10"
            >
                <div className="flex items-center justify-center w-full py-2 px-4 sm:px-6">
                    <div className="text-[14px] sm:text-base md:text-lg lg:text-xl font-light text-neutral-500/80 flex flex-nowrap items-center justify-center gap-x-1.5 sm:gap-x-2 italic leading-tight w-full whitespace-nowrap overflow-hidden">
                        <span className="shrink-0">I’m here to</span>
                        <motion.div layout className="relative inline-flex h-[1.2em] overflow-hidden items-center justify-center shrink-0 w-auto min-w-[max-content]">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                    key={ROLES[roleIndex]}
                                    initial={{ y: "110%", opacity: 0, filter: "blur(4px)" }}
                                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                    exit={{ y: "-110%", opacity: 0, filter: "blur(4px)" }}
                                    transition={{ y: { duration: 0.4, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.2 } }}
                                    className="font-medium text-neutral-400 block whitespace-nowrap"
                                >
                                    {ROLES[roleIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>
                        <span className="shrink-0 truncate">which AI shouldn't</span>
                    </div>
                </div>
            </motion.div>

            {/* Marquee reserved space */}
            <div className="w-full relative z-0 mt-6 md:mt-8">
                <BrandStrip isVisible={true} />
            </div>
        </section>
    );
}

function BrandStrip({ isVisible }: { isVisible: boolean }) {
    const marqueeLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

    return (
        <div className="w-full h-10 sm:h-12 relative overflow-hidden">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {/* Fading edges so logos appear to slide out of nothing */}
                        <div className="absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                        <div className="flex w-max items-center h-full">
                            <motion.div
                                className="flex items-center gap-10 sm:gap-16 px-4 h-full"
                                animate={{ x: "-33.333333%" }} // Moves exactly one set of logos
                                transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                            >
                                {marqueeLogos.map((logo, index) => (
                                    <div
                                        key={`${logo.id}-${index}`}
                                        className="relative w-16 h-5 sm:w-24 sm:h-7 md:w-32 md:h-10 flex items-center justify-center group cursor-pointer"
                                    >
                                        <img
                                            src={logo.src}
                                            alt={logo.name}
                                            onError={(e) => {
                                                e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                                            }}
                                            className="w-full h-full object-contain grayscale opacity-30 mix-blend-plus-lighter hover:mix-blend-normal hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
