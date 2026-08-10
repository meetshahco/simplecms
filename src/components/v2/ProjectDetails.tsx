"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import type { Project, CaseStudy } from "@/lib/cms/storage";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { RichText } from "../RichText";
import { cn } from "@/lib/utils";

interface CaseStudyWithContent extends CaseStudy {
    content: string;
}

interface ProjectDetailsProps {
    project: Project;
    content: string;
    caseStudies: CaseStudyWithContent[];
    nextProject?: Project | null;
    initialCaseStudySlug?: string | null;
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

export function ProjectDetails({ project, content, caseStudies, nextProject, initialCaseStudySlug = null }: ProjectDetailsProps) {
    const searchParams = useSearchParams();
    const from = searchParams.get("from");
    const backHref = from === "home" ? "/" : "/work";
    const backLabel = from === "home" ? "Home" : "Work";

    const leftPaneRef = useRef<HTMLDivElement>(null);
    const hasCaseStudies = caseStudies.length > 0;
    
    const { scrollY: windowScrollY, scrollYProgress: windowScrollYProgress } = useScroll();
    const { scrollY: paneScrollY, scrollYProgress: paneScrollYProgress } = useScroll({
        container: leftPaneRef
    });

    const [activeCaseStudySlug, setActiveCaseStudySlug] = useState<string | null>(initialCaseStudySlug);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const activeCaseStudy = caseStudies?.find(s => s.slug === activeCaseStudySlug);
    const activeScrollY = (hasCaseStudies && !isSidebarCollapsed) ? paneScrollY : windowScrollY;
    const scrollProgress = useMotionValue(0);

    const lastScrollPos = useRef(0);
    const prevCollapsed = useRef(isSidebarCollapsed);

    useEffect(() => {
        const handleScroll = () => {
            const isDual = hasCaseStudies && !isSidebarCollapsed && window.innerWidth >= 1024;
            lastScrollPos.current = isDual ? (leftPaneRef.current?.scrollTop || 0) : window.scrollY;
        };

        if (hasCaseStudies && !isSidebarCollapsed) {
            const pane = leftPaneRef.current;
            pane?.addEventListener('scroll', handleScroll);
            return () => pane?.removeEventListener('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [isSidebarCollapsed, hasCaseStudies]);

    useEffect(() => {
        if (prevCollapsed.current !== isSidebarCollapsed) {
            const isDual = hasCaseStudies && !isSidebarCollapsed && window.innerWidth >= 1024;
            if (isDual && leftPaneRef.current) {
                leftPaneRef.current.scrollTop = lastScrollPos.current;
            } else if (!isDual) {
                const targetScroll = lastScrollPos.current;
                setTimeout(() => window.scrollTo(0, targetScroll), 0);
            }
            prevCollapsed.current = isSidebarCollapsed;
        }
    }, [isSidebarCollapsed, hasCaseStudies]);

    useEffect(() => {
        const source = (hasCaseStudies && !isSidebarCollapsed) ? paneScrollYProgress : windowScrollYProgress;
        scrollProgress.set(source.get());
        return source.on("change", (latest) => {
            scrollProgress.set(latest);
        });
    }, [hasCaseStudies, isSidebarCollapsed, paneScrollYProgress, windowScrollYProgress, scrollProgress]);

    const titleOpacity = useTransform(activeScrollY, [100, 200], [0, 1]);
    const titleY = useTransform(activeScrollY, [100, 200], [10, 0]);

    const scaleX = useSpring(scrollProgress, {
        stiffness: 200,
        damping: 30,
        restDelta: 0.001
    });



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
        <div className="min-h-screen w-full bg-black text-white relative">
            {/* Reading progress bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[3px] bg-blue-500 origin-left z-[130]"
                style={{ scaleX }}
            />

            {/* Custom Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                .prose-reading figure, .prose-reading .figure-wrapper {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    margin-top: 3rem !important;
                    margin-bottom: 3rem !important;
                    width: 100% !important;
                }
                .prose-reading figcaption, .prose-reading .image-caption {
                    text-align: center !important;
                    color: #737373 !important;
                    font-size: 0.75rem !important;
                    letter-spacing: 0.025em !important;
                    margin-top: 0.75rem !important;
                }
                .prose-reading p {
                    margin-top: 0.6rem !important;
                    margin-bottom: 0.6rem !important;
                }
                .prose-reading h1, .prose-reading h2, .prose-reading h3 {
                    margin-top: 2.5rem !important;
                    margin-bottom: 1.5rem !important;
                    font-weight: 800 !important;
                }
                .prose-reading blockquote {
                    background: linear-gradient(90deg, #1e1e1e 0%, #171717 60%, transparent 100%) !important;
                    color: #ffffff !important;
                    border-left: 4px solid #3b82f6 !important;
                    padding: 1.5rem 2rem !important;
                    margin: 2.5rem 0 !important;
                }
            `}} />

            {/* Sticky Nav */}
            <motion.nav 
                className="fixed top-0 left-0 right-0 z-[120] flex items-center justify-between px-6 sm:px-12 py-5 bg-black/40 backdrop-blur-3xl border-b border-white/5"
            >
                <div className="flex items-center gap-8">
                    <Link 
                        href={backHref} 
                        className={`items-center gap-2 text-neutral-400 hover:text-white transition-colors group ${
                            activeCaseStudy ? 'hidden lg:flex' : 'flex'
                        }`}
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">{backLabel}</span>
                    </Link>

                    {activeCaseStudy && (
                        <button
                            onClick={() => {
                                setActiveCaseStudySlug(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex lg:hidden items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Back to Project</span>
                        </button>
                    )}
                    
                    <motion.div 
                        style={{ 
                            opacity: titleOpacity, 
                            y: titleY 
                        }}
                        className="hidden md:flex items-center gap-3 border-l border-white/10 pl-8"
                    >
                        <AnimatePresence mode="wait">
                            <motion.span 
                                key={activeCaseStudy ? activeCaseStudy.slug : 'project-title'}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-xs font-bold uppercase tracking-widest text-neutral-400"
                            >
                                {activeCaseStudy ? activeCaseStudy.title : project.title}
                            </motion.span>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.nav>

            <div className={cn(
                "flex flex-col lg:flex-row w-full bg-black overscroll-none",
                hasCaseStudies && !isSidebarCollapsed ? 'lg:h-screen lg:overflow-hidden' : 'min-h-screen'
            )}>
                
                {/* Left Column (Content Reader) */}
                <motion.div 
                    layout
                    ref={leftPaneRef}
                    className={cn(
                        "relative flex flex-col hide-scrollbar transition-all duration-500 ease-in-out w-full",
                        hasCaseStudies && !isSidebarCollapsed ? 'lg:w-[70%] lg:h-screen lg:overflow-y-auto border-r border-white/5' : 'min-h-screen'
                    )}
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
                                <section className="relative w-full flex flex-col items-center justify-start pt-32 pb-8 px-6 sm:px-12">
                                    <div className="absolute inset-0 z-0 overflow-hidden">
                                        {project.image && (
                                            <div className="absolute inset-0 animate-slow-zoom">
                                                <img src={project.image} alt="" className="w-full h-full object-cover opacity-30 scale-105" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black" />
                                    </div>

                                    <div className="relative z-10 w-full flex flex-col items-start gap-8 max-w-5xl mx-auto">
                                        <div className="w-full text-left">
                                            <div className="flex flex-col items-start gap-4">
                                                <div className="text-[10px] font-bold text-blue-400 tracking-[0.3em] uppercase">
                                                    {project.category}
                                                </div>
                                                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">{project.title}</h1>
                                            </div>
                                        </div>

                                        <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/10 shadow-2xl">
                                            {project.video ? (
                                                isLoom ? <iframe src={embedUrl!} className="w-full h-full object-cover" allow="autoplay; fullscreen" /> : 
                                                <video src={project.video} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                            ) : <img src={project.image} alt={project.title} className="w-full h-full object-cover" />}
                                        </div>
                                    </div>
                                </section>

                                <section className="px-6 sm:px-12 pt-4 pb-20 max-w-5xl mx-auto w-full">
                                    {project.description && (
                                        <div className="mb-16 relative pl-6 border-l border-blue-500/50">
                                            <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed">{project.description}</p>
                                        </div>
                                    )}

                                    {project.metrics && project.metrics.length > 0 && (
                                        <div className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {project.metrics.map((metric) => (
                                                <div key={metric.label} className="rounded-2xl border border-white/5 bg-white/[0.01] p-6">
                                                    <p className="text-3xl md:text-4xl font-bold text-white mb-1"><AnimatedNumber value={metric.value} /></p>
                                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{metric.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {content && (
                                        <div className="max-w-4xl mx-auto prose-reading">
                                            <RichText content={content} />
                                        </div>
                                    )}

                                    {/* Mobile Deep Dive view */}
                                    {hasCaseStudies && (
                                        <div className="mt-20 lg:hidden">
                                            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Deep Dives</h2>
                                            <div className="space-y-4">
                                                {caseStudies.map((study) => (
                                                    <button 
                                                        key={study.slug} 
                                                        onClick={() => {
                                                            setActiveCaseStudySlug(study.slug);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className="w-full text-left p-6 rounded-2xl border border-white/5 bg-white/[0.01] flex justify-between items-center group"
                                                    >
                                                        <div>
                                                            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{study.title}</h3>
                                                            {study.description && <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{study.description}</p>}
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {nextProject && (
                                        <section className="mt-32 relative overflow-hidden group rounded-[2.5rem] border border-white/5 h-[320px] sm:h-[400px]">
                                            <Link href={`/work/${nextProject.id}`} className="absolute inset-0 block">
                                                <img 
                                                    src={nextProject.image} 
                                                    alt={nextProject.title} 
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" 
                                                />
                                                <div className="absolute inset-0 bg-black/80 group-hover:bg-black/70 transition-colors" />
                                                <div className="relative h-full px-8 md:px-12 flex flex-col justify-center items-start">
                                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-4">Up Next</span>
                                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight max-w-xl">{nextProject.title}</h2>
                                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
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
                                <section className="px-6 sm:px-12 pt-32 pb-6 max-w-4xl mx-auto w-full">
                                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-6">{activeCaseStudy.title}</h1>
                                    {activeCaseStudy.description && (
                                        <div className="pl-6 border-l border-blue-500/50">
                                            <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">{activeCaseStudy.description}</p>
                                        </div>
                                    )}
                                </section>

                                {activeCaseStudy.coverImage && (
                                    <section className="px-6 sm:px-12 py-6 max-w-4xl mx-auto w-full">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/[0.01] border border-white/5">
                                            <img src={activeCaseStudy.coverImage} alt={activeCaseStudy.title} className="w-full h-full object-cover" />
                                        </div>
                                    </section>
                                )}

                                <section className="px-6 sm:px-12 pb-32 max-w-4xl mx-auto w-full prose-reading">
                                    <RichText content={activeCaseStudy.content} as="article" />
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Sidebar Toggle Button (Desktop Only) */}
                {hasCaseStudies && (
                    <motion.button
                        layout
                        initial={false}
                        animate={{ 
                            right: isSidebarCollapsed ? "20px" : "calc(30% - 20px)",
                        }}
                        transition={{ duration: 0.5 }}
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="hidden lg:flex fixed bottom-10 z-[100] w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all active:scale-95"
                    >
                        {isSidebarCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </motion.button>
                )}

                {/* Sidebar deep dives index */}
                {hasCaseStudies && !isSidebarCollapsed && (
                    <motion.aside 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "30%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden lg:flex w-[30%] h-screen overflow-y-auto flex-col hide-scrollbar border-l border-white/5 bg-neutral-950"
                    >
                        <div className="h-full flex flex-col pl-12 pr-12">
                            <div className="sticky top-0 z-20 pt-32 pb-8 bg-gradient-to-b from-neutral-950 via-neutral-950/90 to-transparent backdrop-blur-3xl -mx-12 px-12">
                                {activeCaseStudySlug && (
                                    <button 
                                        onClick={() => {
                                            setActiveCaseStudySlug(null);
                                            leftPaneRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-6 group"
                                    >
                                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Overview</span>
                                    </button>
                                )}

                                <div className="flex items-center justify-between">
                                    <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">Deep Dives</h2>
                                    <div className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/40">{caseStudies.length}</div>
                                </div>
                            </div>

                            <div className="flex-1 py-4 hide-scrollbar space-y-6">
                                {caseStudies.map((study, i) => {
                                    const isActive = activeCaseStudySlug === study.slug;
                                    return (
                                        <button 
                                            key={study.slug} 
                                            onClick={() => {
                                                setActiveCaseStudySlug(study.slug);
                                                leftPaneRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="w-full text-left group"
                                        >
                                            <motion.div 
                                                initial={{ opacity: 0, x: 20 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                transition={{ delay: i * 0.05 }} 
                                                className={cn(
                                                    "relative p-5 rounded-2xl border transition-all hover:scale-[1.02]",
                                                    isActive 
                                                        ? 'border-white/20 bg-white/[0.04] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]' 
                                                        : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
                                                )}
                                            >
                                                <div className="aspect-[16/9] w-full rounded-lg overflow-hidden mb-4 relative bg-neutral-900 border border-white/5">
                                                    {study.coverImage ? (
                                                        <img 
                                                            src={study.coverImage} 
                                                            alt={study.title} 
                                                            className={cn(
                                                                "w-full h-full object-cover transition-all duration-700",
                                                                isActive ? 'grayscale-0 opacity-100' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'
                                                            )} 
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-neutral-900" />
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className={cn(
                                                        "text-xs font-bold leading-snug",
                                                        isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'
                                                    )}>
                                                        {study.title}
                                                    </h3>
                                                    <ChevronRight className={cn(
                                                        "h-4 w-4 transition-all shrink-0",
                                                        isActive ? 'text-white' : 'text-neutral-600 group-hover:text-white group-hover:translate-x-0.5'
                                                    )} />
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
