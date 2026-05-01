"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, ChevronDown, ChevronRight, X, PanelRightClose, PanelRightOpen } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import type { Project, CaseStudy } from "@/lib/cms/storage";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RichText } from "./RichText";

interface CaseStudyWithContent extends CaseStudy {
    content: string;
}

interface ProjectDetailsProps {
    project: Project;
    content: string;
    caseStudies: CaseStudyWithContent[];
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

    const [isScrolled, setIsScrolled] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const [activeCaseStudySlug, setActiveCaseStudySlug] = useState<string | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const activeCaseStudy = caseStudies?.find(s => s.slug === activeCaseStudySlug);

    // Logic to switch between window scroll and pane scroll
    const activeScrollY = (hasCaseStudies && !isSidebarCollapsed) ? paneScrollY : windowScrollY;
    const scrollProgress = useMotionValue(0);

    // Sync scrollProgress with the correct source based on sidebar state
    useEffect(() => {
        const source = (hasCaseStudies && !isSidebarCollapsed) ? paneScrollYProgress : windowScrollYProgress;
        
        // Initialize immediately
        scrollProgress.set(source.get());
        
        // Track changes
        return source.on("change", (latest) => {
            scrollProgress.set(latest);
        });
    }, [hasCaseStudies, isSidebarCollapsed, paneScrollYProgress, windowScrollYProgress, scrollProgress]);

    // Navbar transition threshold - linked to active scroll state
    const titleOpacity = useTransform(activeScrollY, [100, 200], [0, 1]);
    const titleY = useTransform(activeScrollY, [100, 200], [10, 0]);

    const scaleX = useSpring(scrollProgress, {
        stiffness: 200,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        return activeScrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
    }, [activeScrollY]);

    // Lock body scroll when dual-pane is active to prevent jank
    useEffect(() => {
        if (hasCaseStudies && !isSidebarCollapsed && window.innerWidth >= 1024) {
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
    }, [hasCaseStudies, isSidebarCollapsed]);

    const isLoom = project.video?.includes("loom.com/share");
    const embedUrl = isLoom ? project.video.replace("loom.com/share/", "loom.com/embed/") + "?autoplay=1&muted=1&preload=1&hide_owner=true&hide_share=true&hide_title=true&hide_embed_code=true" : null;

    return (
        <div className="min-h-screen w-full bg-black text-white">
            {/* ── Reading progress bar (Persistent Global) ── */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-white/80 origin-left z-[130]"
                style={{ scaleX }}
            />
            {/* Adaptive Navigation Bar (Persistent) */}
            <motion.nav 
                className="fixed top-0 left-0 right-0 z-[120] flex items-center justify-between px-6 sm:px-10 md:px-[53px] py-5 bg-black/40 backdrop-blur-3xl border-b border-white/5"
            >
                <div className="flex items-center gap-8">
                    {/* Global Back Link (Desktop Always, Mobile only when in Overview) */}
                    <Link 
                        href={backHref} 
                        className={`items-center gap-2 text-neutral-400 hover:text-white transition-colors group ${
                            activeCaseStudy ? 'hidden lg:flex' : 'flex'
                        }`}
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium tracking-wide">{backLabel}</span>
                    </Link>

                    {/* Mobile-only Contextual Back (When in Case Study) */}
                    {activeCaseStudy && (
                        <button
                            onClick={() => {
                                setActiveCaseStudySlug(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex lg:hidden items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium tracking-wide">Back to Project</span>
                        </button>
                    )}
                    
                    <motion.div 
                        style={{ 
                            opacity: activeCaseStudy ? 1 : titleOpacity, 
                            y: activeCaseStudy ? 0 : titleY 
                        }}
                        className="hidden md:flex items-center gap-3 border-l border-white/10 pl-8"
                    >
                        <AnimatePresence mode="wait">
                            <motion.span 
                                key={activeCaseStudy ? activeCaseStudy.slug : 'project-title'}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-sm font-bold tracking-tight text-white/90"
                            >
                                {activeCaseStudy ? activeCaseStudy.title : project.title}
                            </motion.span>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.nav>

            {/* ── Main Layout Container ── */}
            <div className={`flex flex-col lg:flex-row w-full bg-black overscroll-none ${hasCaseStudies && !isSidebarCollapsed ? 'lg:h-screen lg:overflow-hidden' : 'min-h-screen'}`}>
                
                {/* ── Left Column (Main Story / Case Study Reader) ── */}
                <motion.div 
                    layout
                    ref={leftPaneRef}
                    className={`relative flex flex-col hide-scrollbar transition-all duration-500 ease-in-out ${
                        hasCaseStudies && !isSidebarCollapsed ? 'w-full lg:w-[70%] lg:h-screen lg:overflow-y-auto border-r border-white/5' : 'w-full min-h-screen'
                    }`}
                >
                    <AnimatePresence mode="wait">
                        {!activeCaseStudy ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Cinematic Hero Section */}
                                <section className="relative w-full flex flex-col items-center justify-start pt-32 pb-8">
                                    <div className="absolute inset-0 z-0 overflow-hidden">
                                        {project.image && (
                                            <div className="absolute inset-0 animate-slow-zoom">
                                                <img src={project.image} alt="" className="w-full h-full object-cover opacity-70 scale-105" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_90%)] opacity-60" />
                                    </div>

                                    <div className="relative z-10 w-full flex flex-col items-start gap-6 md:gap-8 px-6 sm:px-10 md:px-[53px]">
                                        <div className="w-full text-left">
                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col items-start gap-4 md:gap-6">
                                                <div className="flex items-center flex-wrap text-[10px] sm:text-xs font-medium text-white/80 tracking-[0.2em] leading-none uppercase">
                                                    {project.category && project.category.split(',').map((cat, idx, arr) => (
                                                        <span key={cat.trim()} className="flex items-center">
                                                            {cat.trim()}
                                                            {idx < arr.length - 1 && <span className="text-white/30 text-[8px] flex items-center mx-3">•</span>}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.1] py-2">{project.title}</h1>
                                            </motion.div>
                                        </div>

                                        <motion.div initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="relative w-full aspect-video rounded-[32px] md:rounded-[48px] overflow-hidden bg-white/5 border border-white/10 shadow-2xl transform-gpu">
                                            {project.video ? (
                                                isLoom ? <iframe src={embedUrl!} className="w-full h-full object-cover scale-[1.01]" allow="autoplay; fullscreen" /> : 
                                                <video src={project.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                            ) : <img src={project.image} alt={project.title} className="w-full h-full object-cover" />}
                                        </motion.div>
                                    </div>
                                </section>

                                {/* Main Content Area */}
                                <section className="px-6 sm:px-10 md:px-[53px] pt-4 pb-0">
                                    {project.description && (
                                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-24 relative pl-8 border-l-2 border-white/10">
                                            <p className="text-lg md:text-xl lg:text-2xl text-neutral-400 leading-relaxed italic">{project.description}</p>
                                        </motion.div>
                                    )}

                                    {project.metrics && project.metrics.length > 0 && (
                                        <div className="mb-24 grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            {project.metrics.map((metric, i) => (
                                                <div key={metric.label} className="group relative rounded-3xl border border-white/5 bg-white/[0.03] p-8 hover:border-white/20 transition-all">
                                                    <p className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight"><AnimatedNumber value={metric.value} /></p>
                                                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">{metric.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {content && <RichText content={content} />}

                                    {/* Mobile-only Deep Dive Section */}
                                    {hasCaseStudies && (
                                        <div className="mt-32 lg:hidden">
                                            <div className="flex items-center justify-between mb-8">
                                                <h2 className="font-heading text-sm font-bold text-neutral-500 uppercase tracking-[0.3em]">Deep Dives</h2>
                                                <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/40">{caseStudies.length}</div>
                                            </div>
                                            <div className="space-y-6">
                                                {caseStudies.map((study, i) => (
                                                    <button 
                                                        key={study.slug} 
                                                        onClick={() => {
                                                            setActiveCaseStudySlug(study.slug);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className="w-full block text-left group"
                                                    >
                                                        <div className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] transition-all active:scale-[0.98]">
                                                            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-4 relative">
                                                                {study.coverImage ? (
                                                                    <img src={study.coverImage} alt={study.title} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="absolute inset-0 bg-neutral-900" />
                                                                )}
                                                            </div>
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="text-sm font-bold text-white leading-snug pr-4">{study.title}</h3>
                                                                <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform text-white" />
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {nextProject && (
                                        <section className="mt-32 -mx-6 sm:-mx-10 md:-mx-[53px] relative overflow-hidden group h-[400px] md:h-[500px]">
                                            <Link href={`/work/${nextProject.id}`} className="absolute inset-0 block">
                                                {/* Background Image with Motion */}
                                                <img 
                                                    src={nextProject.image} 
                                                    alt={nextProject.title} 
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" 
                                                />
                                                
                                                {/* 75% Black Overlay */}
                                                <div className="absolute inset-0 bg-black/75 transition-opacity duration-700 group-hover:bg-black/60" />
                                                
                                                {/* Content Layer */}
                                                <div className="relative h-full px-6 sm:px-10 md:px-[53px] flex flex-col justify-center items-start">
                                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mb-6 block">Up Next</span>
                                                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 tracking-tight transition-all leading-tight max-w-4xl">{nextProject.title}</h2>
                                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </section>
                                    )}
                                </section>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={activeCaseStudy.slug}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="w-full flex flex-col"
                            >
                                <section className="px-6 sm:px-10 md:px-[53px] pt-32 pb-8">

                                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-8">{activeCaseStudy.title}</h1>
                                    {activeCaseStudy.description && (
                                        <div className="mb-12 relative pl-8 border-l-2 border-white/10">
                                            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed italic">{activeCaseStudy.description}</p>
                                        </div>
                                    )}
                                </section>
                                {activeCaseStudy.coverImage && (
                                    <section className="px-6 sm:px-10 md:px-[53px] py-12">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-[32px] md:rounded-[48px] bg-white/5 border border-white/10 shadow-2xl">
                                            <img src={activeCaseStudy.coverImage} alt={activeCaseStudy.title} className="w-full h-full object-cover" />
                                        </div>
                                    </section>
                                )}
                                <section className="px-6 sm:px-10 md:px-[53px] pb-32">
                                    <RichText content={activeCaseStudy.content} as="article" />
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── Sidebar Toggle Button (Desktop Only) ── */}
                {hasCaseStudies && (
                    <motion.button
                        layout
                        initial={false}
                        animate={{ 
                            right: isSidebarCollapsed ? "20px" : "calc(30% - 20px)",
                        }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="hidden lg:flex fixed bottom-10 z-[100] w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all active:scale-95 group"
                        title={isSidebarCollapsed ? "Expand Deep Dives" : "Collapse Deep Dives"}
                    >
                        <AnimatePresence mode="wait">
                            {isSidebarCollapsed ? (
                                <motion.div key="open" initial={{ opacity: 0, x: 2 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -2 }}>
                                    <ChevronLeft className="w-4 h-4" />
                                </motion.div>
                            ) : (
                                <motion.div key="close" initial={{ opacity: 0, x: -2 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 2 }}>
                                    <ChevronRight className="w-4 h-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                )}

                {/* Sidebar (Desktop Only) */}
                {hasCaseStudies && !isSidebarCollapsed && (
                    <motion.aside 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "30%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden lg:flex w-[30%] h-screen overflow-y-auto flex-col hide-scrollbar border-l border-white/10 bg-[#111111] shadow-2xl overflow-hidden"
                    >
                        <div className="h-full flex flex-col pl-12 pr-6 sm:pr-10 md:pr-[53px]">
                            {/* Sticky Glass Header (Homescreen-Style Haze) */}
                            <div className="sticky top-0 z-20 pt-32 pb-12 bg-gradient-to-b from-[#111111] via-[#111111]/90 to-transparent backdrop-blur-3xl -mx-12 px-12">
                                {activeCaseStudySlug && (
                                    <div className="mb-8">
                                        <button 
                                            onClick={() => {
                                                setActiveCaseStudySlug(null);
                                                leftPaneRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group"
                                        >
                                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Back to Project Overview</span>
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between shrink-0">
                                    <h2 className="font-heading text-sm font-bold text-neutral-500 uppercase tracking-[0.3em]">Deep Dives</h2>
                                    <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/40">{caseStudies.length}</div>
                                </div>
                            </div>

                            <div className="flex-1 px-4 py-12 -mx-4 hide-scrollbar space-y-8">
                                {caseStudies.map((study, i) => {
                                    const isActive = activeCaseStudySlug === study.slug;
                                    return (
                                        <button 
                                            key={study.slug} 
                                            onClick={() => {
                                                setActiveCaseStudySlug(study.slug);
                                                leftPaneRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-full block text-left group ${isActive ? 'ring-2 ring-white/10 rounded-2xl' : ''}`}
                                        >
                                            <motion.div 
                                                initial={{ opacity: 0, x: 20 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                transition={{ delay: i * 0.1 }} 
                                                className={`relative p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
                                                    isActive 
                                                        ? 'border-white/20 bg-white/[0.05]' 
                                                        : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                                                }`}
                                            >
                                                <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-4 relative">
                                                    {study.coverImage ? (
                                                        <img 
                                                            src={study.coverImage} 
                                                            alt={study.title} 
                                                            className={`w-full h-full object-cover transition-all duration-700 ${
                                                                isActive 
                                                                    ? 'grayscale-0 opacity-100 scale-105' 
                                                                    : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'
                                                            }`} 
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-neutral-900" />
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className={`text-sm font-bold transition-colors leading-snug pr-4 ${
                                                        isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'
                                                    }`}>
                                                        {study.title}
                                                    </h3>
                                                    <ChevronRight className={`h-4 w-4 transition-all shrink-0 ${
                                                        isActive ? 'text-white translate-x-0' : 'text-neutral-600 group-hover:text-white group-hover:translate-x-1'
                                                    }`} />
                                                </div>
                                            </motion.div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.aside>
                )}
            </div>
        </div>
    );
}
