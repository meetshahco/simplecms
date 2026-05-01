"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import type { Project, CaseStudy } from "@/lib/cms/storage";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RichText } from "./RichText";

interface ProjectDetailsProps {
    project: Project;
    content: string;
    caseStudies: CaseStudy[];
    nextProject?: Project | null;
}

function AnimatedNumber({ value }: { value: string }) {
    const numericValue = parseInt(value) || 0;
    const suffix = value.replace(/[0-9]/g, '');
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        spring.set(numericValue);
    }, [spring, numericValue]);

    useEffect(() => {
        return spring.on("change", (latest) => {
            setDisplay(Math.floor(latest));
        });
    }, [spring]);

    return <span>{display}{suffix}</span>;
}

export function ProjectDetails({ project, content, caseStudies, nextProject }: ProjectDetailsProps) {
    const searchParams = useSearchParams();
    const from = searchParams.get("from");
    const backHref = from === "home" ? "/" : "/work";
    const backLabel = from === "home" ? "Home" : "Work";

    const leftPaneRef = useRef<HTMLDivElement>(null);
    const hasCaseStudies = caseStudies.length > 0;
    
    // Separate scroll trackers for dual-pane vs single-pane modes
    const { scrollY: windowScrollY, scrollYProgress: windowScrollYProgress } = useScroll();
    const { scrollY: paneScrollY, scrollYProgress: paneScrollYProgress } = useScroll({
        container: leftPaneRef
    });

    const activeScrollY = hasCaseStudies ? paneScrollY : windowScrollY;
    const activeScrollYProgress = hasCaseStudies ? paneScrollYProgress : windowScrollYProgress;

    const [isScrolled, setIsScrolled] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Navbar transition threshold - linked to active scroll state
    const navbarOpacity = useTransform(activeScrollY, [0, 50], [0, 1]);
    const navbarBlur = useTransform(activeScrollY, [0, 50], [0, 16]);
    const titleOpacity = useTransform(activeScrollY, [300, 400], [0, 1]);
    const titleY = useTransform(activeScrollY, [300, 400], [10, 0]);

    const scaleX = useSpring(activeScrollYProgress, {
        stiffness: 200,
        damping: 40,
        restDelta: 0.001,
    });

    useEffect(() => {
        return activeScrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
    }, [activeScrollY]);

    // Lock body scroll when dual-pane is active to prevent jank
    useEffect(() => {
        if (hasCaseStudies && window.innerWidth >= 1024) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [hasCaseStudies]);


    const isLoom = project.video?.includes("loom.com/share");
    const embedUrl = isLoom ? project.video.replace("loom.com/share/", "loom.com/embed/") + "?autoplay=1&muted=1&preload=1&hide_owner=true&hide_share=true&hide_title=true&hide_embed_code=true" : null;

    return (
        <div className="min-h-screen w-full bg-black text-white">
            {/* ── Reading progress bar ── */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-white/80 origin-left z-[60]"
                style={{ scaleX }}
            />

            {/* Adaptive Navigation Bar */}
            <motion.nav
                style={{
                    backgroundColor: useTransform(navbarOpacity, (o) => `rgba(0, 0, 0, ${o * 0.85})`),
                    backdropFilter: useTransform(navbarBlur, (b) => `blur(${b}px)`),
                    borderBottom: useTransform(navbarOpacity, (o) => `1px solid rgba(255,255,255,${o * 0.06})`),
                }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 md:px-[53px] py-5 border-b border-white/0"
            >
                <div className="flex items-center gap-8">
                    <Link href={backHref} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium tracking-wide">{backLabel}</span>
                    </Link>
                    
                    <motion.div 
                        style={{ opacity: titleOpacity, y: titleY }}
                        className="hidden md:flex items-center gap-3 border-l border-white/10 pl-8"
                    >
                        <span className="text-sm font-bold tracking-tight text-white/90">{project.title}</span>
                    </motion.div>
                </div>
            </motion.nav>

            {/* ── Main Layout Container ── */}
            <div className={`flex flex-col lg:flex-row w-full bg-black overscroll-none ${hasCaseStudies ? 'lg:h-screen lg:overflow-hidden' : 'min-h-screen'}`}>
                
                {/* ── Left Column (Main Story) ── */}
                <div 
                    ref={leftPaneRef}
                    className={`w-full flex flex-col hide-scrollbar ${hasCaseStudies ? 'lg:w-[70%] lg:h-screen lg:overflow-y-auto border-r border-white/5' : 'w-full min-h-screen'}`}
                >
                    
                    {/* Cinematic Hero Section - Contained in 70% column */}
                    <section className="relative w-full flex flex-col items-center justify-start pt-32 pb-32 border-b border-white/5">
                {/* Immersive Background Treatment */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {project.image && (
                        <div className="absolute inset-0 animate-slow-zoom">
                            <img 
                                src={project.image} 
                                alt="" 
                                className="w-full h-full object-cover opacity-70 scale-105" 
                            />
                        </div>
                    )}
                    {/* Multi-layered Cinematic Scrims for Depth & Vibrancy */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_90%)] opacity-60" />
                </div>

                <div className="relative z-10 w-full flex flex-col items-start gap-6 md:gap-8 px-6 sm:px-10 md:px-[53px]">
                    {/* Meta Section - Moved above Theater for better vertical flow and description visibility */}
                    <div className="w-full text-left order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col items-start gap-4 md:gap-6"
                        >
                            <div className="flex items-center flex-wrap text-[10px] sm:text-xs font-medium text-white/80 tracking-[0.2em] leading-none shrink-0 uppercase">
                                {project.category && project.category.split(',').map((cat, idx, arr) => (
                                    <span key={cat.trim()} className="flex items-center">
                                        {cat.trim()}
                                        {idx < arr.length - 1 && (
                                            <span className="text-white/30 text-[8px] flex items-center mx-3">•</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                            
                            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.1] py-2">
                                {project.title}
                            </h1>
                        </motion.div>
                    </div>

                    {/* The Theater Slot - Optimized positioning and width */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full aspect-video rounded-[32px] md:rounded-[48px] overflow-hidden bg-white/5 border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),0_0_100px_rgba(255,255,255,0.05)] order-2 transform-gpu"
                    >
                        {project.video ? (
                            isLoom ? (
                                <iframe 
                                    src={embedUrl!} 
                                    className="w-full h-full object-cover scale-[1.01]"
                                    allow="autoplay; fullscreen"
                                />
                            ) : (
                                <video
                                    src={project.video}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            )
                        ) : (
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        )}
                        
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </section>


                    {/* Main Content Area */}
                    <section className="px-6 sm:px-10 md:px-[53px] pt-12 pb-32">
                        <div className="w-full relative">

                {/* Project Description - Editorial Lead Treatment */}
                {project.description && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="mb-24 relative pl-8 border-l-2 border-white/10"
                    >
                        <p className="text-lg md:text-xl lg:text-2xl text-neutral-400 leading-relaxed w-full font-medium italic italic-quote">
                            {project.description}
                        </p>
                        
                        {/* Page break after description */}
                        <div className="h-px w-32 bg-white/10 mt-16" />
                    </motion.div>
                )}

                {/* Metrics Grid */}
                {project.metrics && project.metrics.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="mb-24 grid grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {project.metrics.map((metric, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                key={metric.label}
                                className="group relative rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-2xl p-8 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
                                
                                <p className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
                                    <AnimatedNumber value={metric.value} />
                                </p>
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">{metric.label}</p>
                            </motion.div>
                        ))}
                    </motion.section>
                )}

                {/* Rich Text Content — wide reading column with Tailwind prose base */}
                {content && (
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="mb-32"
                    >
                        <div className="max-w-7xl mx-auto">
                            <RichText content={content} />
                        </div>
                    </motion.section>
                )}

                        {/* Case Studies - Mobile Only (Hidden on Desktop as it's in sidebar) */}
                        {caseStudies.length > 0 && (
                            <div className="lg:hidden mt-24">
                                <div className="flex items-center justify-between mb-12">
                                    <h2 className="font-heading text-3xl font-bold text-white">Deep Dives</h2>
                                    <div className="h-px flex-1 bg-white/5 mx-8" />
                                </div>
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {caseStudies.map((study, i) => (
                                        <Link key={study.slug} href={`/work/${project.id}/${study.slug}`}>
                                            <div className="group cursor-pointer rounded-3xl border border-white/5 bg-white/[0.03] p-4 transition-all duration-500 hover:border-white/10">
                                                <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 relative">
                                                    {study.coverImage ? (
                                                        <img src={study.coverImage} alt={study.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-neutral-900" />
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-1">{study.title}</h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Continue to Next Project */}
                        {nextProject && (
                            <motion.section
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="mt-32 border-t border-white/5 pt-24"
                            >
                                <div className="text-left">
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.4em] mb-6 block">Up Next</span>
                                    <Link href={`/work/${nextProject.id}`} className="group inline-block">
                                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight transition-all duration-700 hover:scale-[1.01] group-hover:text-white/70 leading-[1.1]">
                                            {nextProject.title}
                                        </h2>
                                        <div className="flex items-center text-white group">
                                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-500">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </motion.section>
                        )}
                        </div>
                    </section>
                </div>

                {/* ── Right Column (Sidebar - Deep Dives) ── */}
                {hasCaseStudies && (
                    <aside className="w-full lg:w-[30%] lg:h-screen lg:overflow-y-auto flex flex-col hide-scrollbar border-l border-white/10 bg-neutral-900/40 backdrop-blur-2xl shadow-2xl">
                        <div className="h-full flex flex-col pt-32 pb-12 pl-12 pr-6 sm:pr-10 md:pr-[53px]">
                        <div className="flex items-center justify-between mb-8 shrink-0">
                            <h2 className="font-heading text-sm font-bold text-neutral-500 uppercase tracking-[0.3em]">Deep Dives</h2>
                            <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/40">
                                {caseStudies.length}
                            </div>
                        </div>

                        {/* Sidebar Scroll Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 -mx-4 hide-scrollbar space-y-8">
                            {caseStudies.map((study, i) => (
                                <Link key={study.slug} href={`/work/${project.id}/${study.slug}`} className="block group">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative p-4 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.05] group-hover:scale-[1.02]"
                                    >
                                        <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-4 relative">
                                            {study.coverImage ? (
                                                <img src={study.coverImage} alt={study.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                            ) : (
                                                <div className="absolute inset-0 bg-neutral-900" />
                                            )}
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors leading-snug pr-4">{study.title}</h3>
                                            <ArrowRight className="h-3 w-3 -rotate-45 group-hover:rotate-0 transition-transform text-neutral-600 group-hover:text-white shrink-0" />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                            
                            {caseStudies.length === 0 && (
                                <div className="text-neutral-600 text-xs italic py-4">No deep dives available for this project.</div>
                            )}
                        </div>
                    </div>
                </aside>
                )}
            </div>
        </div>
    );
}
