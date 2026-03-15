"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import type { Project, CaseStudy } from "@/lib/cms/storage";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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

    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Navbar transition threshold
    const navbarOpacity = useTransform(scrollY, [0, 100], [0, 1]);
    const navbarBlur = useTransform(scrollY, [0, 100], [0, 10]);
    const titleOpacity = useTransform(scrollY, [300, 400], [0, 1]);
    const titleY = useTransform(scrollY, [300, 400], [10, 0]);

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    const isLoom = project.video?.includes("loom.com/share");
    const embedUrl = isLoom ? project.video.replace("loom.com/share/", "loom.com/embed/") + "?autoplay=1&muted=1&preload=1&hide_owner=true&hide_share=true&hide_title=true&hide_embed_code=true" : null;

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white">
            {/* Adaptive Navigation Bar */}
            <motion.nav
                style={{
                    backgroundColor: `rgba(0, 0, 0, ${isScrolled ? 0.5 : 0})`,
                    backdropFilter: `blur(${isScrolled ? 12 : 0}px)`,
                }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 border-b border-white/0 transition-all duration-500"
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

            {/* Cinematic Hero Section */}
            <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
                {/* Immersive Background Treatment */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {project.image && (
                        <div className="absolute inset-0 animate-slow-zoom">
                            <img 
                                src={project.image} 
                                alt="" 
                                className="w-full h-full object-cover opacity-50 saturate-150 scale-110" 
                            />
                        </div>
                    )}
                    {/* Multi-layered Cinematic Scrims for Depth & Vibrancy */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/80" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_90%)] opacity-60" />
                </div>

                <div className="relative z-10 w-full max-w-5xl px-6 md:px-12 flex flex-col items-center gap-8 md:gap-16">
                    {/* Meta Section - Moved above Theater for better vertical flow and description visibility */}
                    <div className="w-full text-center max-w-4xl order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.25em] text-white/70 font-bold backdrop-blur-xl">
                                {project.category}
                            </span>
                            
                            <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] py-2">
                                {project.title}
                            </h1>
                            
                            {project.description && (
                                <p className="text-lg md:text-2xl text-neutral-300 leading-relaxed max-w-3xl mx-auto opacity-90 font-medium">
                                    {project.description}
                                </p>
                            )}
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
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-24 pb-48">
                {/* Metrics Grid */}
                {project.metrics && project.metrics.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="mb-32 grid grid-cols-2 lg:grid-cols-4 gap-6"
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

                {/* Case Study Content Wrapper */}
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="flex-1">
                        {/* Rich Text Content */}
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="prose prose-invert prose-lg md:prose-xl max-w-none mb-32 prose-headings:font-heading prose-headings:font-bold prose-headings:text-white text-neutral-300/90 prose-p:leading-[1.8] prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-img:rounded-3xl prose-img:shadow-2xl prose-h2:mt-20"
                        >
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        </motion.section>

                        {/* Case Studies */}
                        {caseStudies.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex items-center justify-between mb-16">
                                    <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Deep Dives</h2>
                                    <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
                                </div>
                                
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {caseStudies.map((study, i) => (
                                        <Link key={study.slug} href={`/work/${project.id}/${study.slug}`}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                                className="group cursor-pointer rounded-[32px] border border-white/5 bg-white/[0.03] p-5 transition-all duration-700 hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-2"
                                            >
                                                <div className="aspect-[16/10] w-full rounded-2xl bg-neutral-900 mb-8 overflow-hidden relative shadow-2xl">
                                                    {study.coverImage ? (
                                                        <img 
                                                            src={study.coverImage} 
                                                            alt={study.title} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                                                </div>
                                                
                                                <div className="px-3 pb-3">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors leading-tight">{study.title}</h3>
                                                        <div className="rounded-full bg-white/5 p-2.5 border border-white/5 group-hover:bg-white group-hover:text-black transition-all duration-500">
                                                            <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0" />
                                                        </div>
                                                    </div>
                                                    <p className="text-neutral-400 text-base line-clamp-2 leading-relaxed">{study.description}</p>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>
                </div>

                {/* Continue to Next Project */}
                {nextProject && (
                    <motion.section
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="mt-60 border-t border-white/5 pt-32 max-w-5xl mx-auto"
                    >
                        <div className="text-center">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-[0.4em] mb-8 block">Up Next</span>
                            <Link href={`/work/${nextProject.id}`} className="group inline-block">
                                <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-12 tracking-tight transition-all duration-700 hover:scale-[1.02] group-hover:text-white/70 leading-[1.1]">
                                    {nextProject.title}
                                </h1>
                                <div className="flex items-center justify-center gap-4 text-white font-bold group">
                                    <span className="text-lg tracking-wider group-hover:translate-x-2 transition-transform duration-500">Read Project Case Study</span>
                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-500">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </motion.section>
                )}
            </div>
        </div>

    );
}
