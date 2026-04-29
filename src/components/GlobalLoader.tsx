"use client";
import { useState, useEffect, useMemo, useRef, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import { Volume2, VolumeX, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContactAnimation } from "@/context/ContactAnimationContext";

type HighlightConfig = {
    media: string;
    decorationClass: string;
    walkerClass?: string;
    textClass?: string;
    appendIcon?: React.ReactNode;
    customDecoration?: (isPassed: boolean) => React.ReactNode;
    duration?: number;
};

const HIGHLIGHT_CONFIG: Record<string, HighlightConfig> = {
    "Meet Shah": {
        media: "/assets/meet_shah_v2.jpg",
        decorationClass: "bg-blue-500 h-[3px]",
        textClass: "font-medium text-blue-200 drop-shadow-[0_0_6px_rgba(147,197,253,0.6)]",
        walkerClass: "!w-32 !h-24 sm:!w-48 sm:!h-36 rounded-2xl rotate-2 shadow-2xl object-cover border-2 border-white/10",
    },
    "Product Designer": {
        media: "/assets/product_designer.gif",
        decorationClass: "bg-transparent border-b-4 border-dotted border-purple-500 h-1",
        textClass: "font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]",
        walkerClass: "!w-40 !h-24 sm:!w-64 sm:!h-36 rounded-xl rotate-1 grainy-filter",
    },
    "India": {
        media: "/assets/india_temple.jpg",
        decorationClass: "bg-gradient-to-r from-orange-400 via-white to-green-400 h-[3px]",
        textClass: "font-medium text-amber-400 drop-shadow-[0_0_8px_rgba(217,119,6,0.9)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",
        walkerClass: "!w-24 !h-24 sm:!w-40 sm:!h-40 rounded-3xl object-cover shadow-2xl border border-white/20 -rotate-2 brightness-[0.70] contrast-[0.85]",
    },
    "cooking": {
        media: "/assets/cooking.gif",
        decorationClass: "bg-[url('/assets/wave.svg')] h-[12px] bg-bottom bg-repeat-x w-full",
        textClass: "font-medium text-amber-200 drop-shadow-[0_0_6px_rgba(252,211,77,0.6)]",
        walkerClass: "!w-32 !h-24 sm:!w-48 sm:!h-36 rounded-xl rotate-3 shadow-xl object-cover border border-white/20",
    },
    "travelling": {
        media: "/assets/travelling.gif",
        decorationClass: "",
        textClass: "font-medium text-emerald-300 drop-shadow-[0_0_6px_rgba(110,231,183,0.5)]",
        walkerClass: "!w-40 !h-24 sm:!w-64 sm:!h-36 rounded-2xl -rotate-1 shadow-2xl object-cover",
        duration: 5500,
        customDecoration: (isPassed) => <TravellingDecoration isVisible={isPassed} colorTheme="green" iconType="motorcycle" />
    },
    "Cinema": {
        media: "/assets/cinema.gif",
        decorationClass: "bg-red-500 h-[2px]",
        textClass: "font-bold text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]",
        walkerClass: "rounded-md rotate-3",
    },
    "knowledge": {
        media: "/assets/knowledge_star.gif",
        decorationClass: "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 h-[2px]",
        textClass: "font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 animate-gradient bg-[length:200%_auto]",
        walkerClass: "!w-40 !h-20 sm:!w-64 sm:!h-32 !left-full !-translate-x-[40%] rounded-lg -rotate-6 grainy-filter",
    },
    "I'm really here!": {
        media: "",
        decorationClass: "",
        walkerClass: "",
        textClass: "font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 animate-gradient bg-[length:200%_auto]",
    }
};

const HERO_TEXT = "Hey there, I'm Meet Shah, a Product Designer from India who loves cooking, travelling and watching Cinema - to gain knowledge, haha!";

const ROLES = [
    "make decisions",
    "preserve craft",
    "understand users",
    "take responsibility",
    "own the vision",
];

export function GlobalLoader() {
    const [isLoading, setIsLoading] = useState(() => {
        if (typeof window !== "undefined") {
            return sessionStorage.getItem("splashPlayed") !== "true";
        }
        return true;
    });
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [roleIndex, setRoleIndex] = useState(0);
    const [rects, setRects] = useState<Record<string, DOMRect>>({});
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [subheaderPhase, setSubheaderPhase] = useState<"idle" | "text" | "end">("idle");
    const [hasLooped, setHasLooped] = useState(false);
    const [wasSkipped, setWasSkipped] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const refs = useRef<Record<string, HTMLSpanElement | null>>({});

    const { triggerPlaneAnimation, setIsContactCta } = useContactAnimation();

    const headerKeys = useMemo(() => {
        return Object.keys(HIGHLIGHT_CONFIG).filter(key => HERO_TEXT.includes(key));
    }, []);

    const subheaderKeys = useMemo(() => ["I'm really here!", "end-marker"], []);
    const allKeys = useMemo(() => [...headerKeys, ...subheaderKeys], [headerKeys, subheaderKeys]);

    const textSegments = useMemo(() => {
        const regex = new RegExp(`(${headerKeys.join("|")})`, "g");
        return HERO_TEXT.split(regex);
    }, [headerKeys]);

    const updateRects = useCallback(() => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newRects: Record<string, DOMRect> = {};
        allKeys.forEach((key) => {
            const el = refs.current[key];
            if (el) {
                const rect = el.getBoundingClientRect();
                newRects[key] = {
                    ...rect,
                    left: rect.left - containerRect.left,
                    top: rect.top - containerRect.top,
                    width: rect.width,
                    height: rect.height,
                    x: rect.x, y: rect.y, bottom: rect.bottom, right: rect.right, toJSON: () => { }
                } as DOMRect;
            }
        });
        setRects(newRects);
    }, [allKeys]);

    useLayoutEffect(() => {
        if (!isLoading) return;
        updateRects();
        window.addEventListener("resize", updateRects);
        const timer = setTimeout(updateRects, 100);
        return () => { window.removeEventListener("resize", updateRects); clearTimeout(timer); };
    }, [updateRects, isLoading]);

    // Mouse movement for Netflix-style control fade
    useEffect(() => {
        if (!isLoading) return;
        let hideTimer: NodeJS.Timeout;

        const handleMouseMove = () => {
            setShowControls(true);
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => setShowControls(false), 2000);
        };

        const handleMouseLeave = () => {
            clearTimeout(hideTimer);
            setShowControls(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        
        hideTimer = setTimeout(() => setShowControls(false), 2000);
        
        return () => { 
            window.removeEventListener("mousemove", handleMouseMove); 
            document.removeEventListener("mouseleave", handleMouseLeave);
            clearTimeout(hideTimer); 
        };
    }, [isLoading]);

    // Cycle Roles
    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => setRoleIndex((prev) => (prev + 1) % ROLES.length), 2500);
        return () => clearInterval(interval);
    }, [isLoading]);

    // Cycle Header Highlights - exactly like old Hero
    useEffect(() => {
        if (!isLoading) return;
        const cycle = () => {
            setHighlightIndex((prev) => {
                const next = (prev + 1) % headerKeys.length;
                if (next === 0 && !hasLooped) {
                    setHasLooped(true);
                }
                return next;
            });
        };
        const currentKey = headerKeys[highlightIndex];
        const delay = HIGHLIGHT_CONFIG[currentKey]?.duration || 3000;
        const timeout = setTimeout(cycle, delay);
        return () => clearTimeout(timeout);
    }, [headerKeys, hasLooped, highlightIndex, isLoading]);

    // Subheader Sequence -> triggers plane -> fades splash
    useEffect(() => {
        if (!isLoading) return;
        if (hasLooped && subheaderPhase === "idle") {
            setSubheaderPhase("text");

            // Launch the plane from "I'm really here!" text position
            setTimeout(() => {
                const domNode = refs.current["I'm really here!"];
                if (domNode) {
                    const rect = domNode.getBoundingClientRect();
                    triggerPlaneAnimation({
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    });
                }
                // Start fading the splash AFTER the plane launches, creating overlap
                setTimeout(() => {
                    setSubheaderPhase("end");
                    setIsLoading(false);
                    sessionStorage.setItem("splashPlayed", "true");
                }, 800);
            }, 800);
        }
    }, [hasLooped, subheaderPhase, triggerPlaneAnimation, isLoading]);

    const handleSkip = useCallback(() => {
        setWasSkipped(true);
        setIsLoading(false);
        sessionStorage.setItem("splashSkipped", "true");
        sessionStorage.setItem("splashPlayed", "true");
        setIsContactCta(true);
    }, [setIsContactCta]);

    // Calculate total duration for progress bar
    const totalDuration = useMemo(() => {
        return headerKeys.reduce((sum, key) => sum + (HIGHLIGHT_CONFIG[key]?.duration || 3000), 0) + 3500;
    }, [headerKeys]);

    // Shared progress value for both loaders so they stay perfectly in sync
    const progressValue = useMotionValue(0);
    useEffect(() => {
        if (!isLoading) return;
        const animation = animate(progressValue, 1, {
            duration: totalDuration / 1000,
            ease: "linear",
        });
        return () => animation.stop();
    }, [isLoading, totalDuration, progressValue]);

    const activeKey = headerKeys[highlightIndex];
    const activeConfig = HIGHLIGHT_CONFIG[activeKey];
    const activeRect = rects[activeKey];

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: wasSkipped ? 0.15 : 1.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-black overflow-hidden cursor-default"
                >
                    {/* Netflix Content Warning */}
                    <AnimatePresence>
                        {showControls && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ opacity: { duration: 0.6, ease: "easeInOut" } }}
                                className="absolute top-8 left-8 md:top-12 md:left-12 border-l-4 border-[#E50914] pl-4 z-50 pointer-events-none"
                            >
                                <h2 className="text-white font-bold text-lg sm:text-xl font-heading tracking-tight drop-shadow-lg">Meet Shah</h2>
                                <p className="text-neutral-300 text-xs md:text-sm mt-1 drop-shadow-md max-w-sm">
                                    9+ years across Fintech, Enterprise, SaaS, AdTech, HRTech
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main content - vertically and horizontally centered block */}
                    <section className="relative flex min-h-screen flex-col justify-center px-6 md:px-12 overflow-hidden">
                    <div className="mx-auto max-w-5xl relative z-10 w-full" ref={containerRef}>
                        <LayoutGroup>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="font-heading text-4xl font-medium leading-tight text-white md:text-6xl md:leading-snug relative isolate"
                            >
                                <AnimatePresence mode="wait">
                                    {activeRect && activeConfig && (
                                        <motion.div
                                            key={activeKey === "I'm really here!" ? "subheader-walker" : "header-walker"}
                                            className="absolute z-0 pointer-events-none"
                                            initial={{ opacity: 0, scale: 0.8, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                                            animate={{ opacity: 1, scale: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                                            transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
                                        >
                                            {activeConfig.media && (
                                                <motion.div
                                                    className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] w-20 h-20 sm:w-24 sm:h-24 overflow-hidden border-2 border-white/20 shadow-2xl bg-black", activeConfig.walkerClass)}
                                                    initial={{ opacity: 0.4, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1.1 }}
                                                    transition={{ duration: 0.4, ease: "circOut" }}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        <motion.div key={activeKey} className="w-full h-full relative"
                                                            initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                                                            <Image src={activeConfig.media} alt={activeKey} fill className="object-cover" unoptimized={activeConfig.media.endsWith('.gif')} />
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </motion.div>
                                            )}
                                            <motion.div className="absolute -top-4 -left-2 -right-2 -bottom-4 sm:-top-6 sm:-left-4 sm:-right-4 sm:-bottom-6 -z-10 bg-neutral-800/50 block rounded-xl"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {textSegments.map((segment, i) => {
                                    const config = HIGHLIGHT_CONFIG[segment];
                                    if (config) {
                                        const currentIndex = headerKeys.indexOf(segment);
                                        return <HighlightTarget key={i} text={segment} config={config} isActive={highlightIndex === currentIndex} isPassed={highlightIndex > currentIndex} setRef={(el) => { refs.current[segment] = el; }} />;
                                    }
                                    return <span key={i} className="text-white/60 transition-colors duration-500 relative z-10">{segment}</span>;
                                })}
                            </motion.h1>
                        </LayoutGroup>

                        {/* Subheader - exactly like old Hero */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-16 sm:mt-24 text-xl font-light text-neutral-400 sm:text-2xl md:text-3xl flex flex-wrap items-center gap-x-2 sm:gap-x-3 relative z-10"
                        >
                            <span className="whitespace-nowrap opacity-50 px-1">I'm here to</span>
                            <div className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
                                <motion.div layout className="relative flex flex-col justify-center w-auto min-w-[max-content]">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.span
                                            key={ROLES[roleIndex]}
                                            initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
                                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                            exit={{ y: "-110%", opacity: 0, filter: "blur(8px)" }}
                                            transition={{ y: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }, opacity: { duration: 0.3 }, filter: { duration: 0.3 } }}
                                            className="whitespace-nowrap font-medium text-white block leading-none px-1"
                                        >
                                            {ROLES[roleIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                            <span className="opacity-50 whitespace-nowrap px-1">which AI shouldn't,</span>

                            <div className="flex items-center flex-nowrap gap-x-2">
                                <a href="/contact" className="inline-block relative z-20 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-110 hover:-rotate-2 hover:drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
                                    <HighlightTarget
                                        text="I'm really here!"
                                        config={HIGHLIGHT_CONFIG["I'm really here!"] || { media: "", decorationClass: "", textClass: "text-white font-medium" }}
                                        isActive={subheaderPhase === "text"}
                                        isPassed={false}
                                        setRef={(el) => { refs.current["I'm really here!"] = el; }}
                                        inactiveClass="text-neutral-400 opacity-50 transition-all duration-1000"
                                    />
                                    <div className="absolute top-1/2 left-[90%] -translate-y-1/2 w-16 h-14 sm:w-28 sm:h-24 pointer-events-none z-0">
                                        <AnimatePresence>
                                            {(subheaderPhase === "text" || subheaderPhase === "end") && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8, rotate: -15, filter: "blur(4px)" }}
                                                    animate={{ opacity: 1, scale: 1, rotate: 3, filter: "blur(0px)" }}
                                                    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                    className="absolute inset-0 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black origin-bottom-left"
                                                >
                                                    <Image src="/assets/dwight_phone.gif" alt="dwight typing" fill className="object-cover" unoptimized />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                    </section>

                    {/* Bottom Controls */}
                    <AnimatePresence>
                        {showControls && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.6, ease: "easeInOut" } }}
                                className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-50 flex items-center gap-4">
                                <button onClick={() => setIsMuted(!isMuted)}
                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full transition-all duration-300 ease-out flex items-center justify-center hover:scale-105">
                                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                </button>
                                <button onClick={handleSkip}
                                    className="relative overflow-hidden group flex items-center justify-center h-[42px] px-6 border border-white/50 bg-transparent text-white rounded-full font-medium transition-all duration-300 ease-out hover:bg-white hover:text-black hover:border-white hover:scale-105 uppercase tracking-wider text-[12px]">
                                    <motion.div className="absolute inset-0 bg-white/15 origin-left rounded-full" style={{ scaleX: progressValue }} />
                                    <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm">
                                        Skip Intro <SkipForward className="w-3.5 h-3.5 fill-current" />
                                    </span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Netflix Progress Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
                        <motion.div className="h-full bg-[#E50914] origin-left" style={{ scaleX: progressValue }} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function HighlightTarget({ text, config, isActive, isPassed, setRef, inactiveClass = "text-white/60" }: {
    text: string, config: HighlightConfig, isActive: boolean, isPassed: boolean,
    setRef: (el: HTMLSpanElement | null) => void, inactiveClass?: string
}) {
    return (
        <span ref={setRef} className="relative inline-block whitespace-nowrap px-1 z-10">
            <span className={cn("relative z-10 transition-colors duration-500", (isActive || isPassed) ? (config.textClass || "text-white") : inactiveClass)}>
                {text}{config.appendIcon}
            </span>
            {isPassed && config.customDecoration ? config.customDecoration(isPassed) : isPassed && (
                <motion.span initial={{ width: 0 }} animate={{ width: "100%" }} className={cn("absolute bottom-0 left-0", config.decorationClass)} />
            )}
        </span>
    );
}

function TravellingDecoration({ isVisible, colorTheme = "green", iconType = "plane" }: { isVisible: boolean, colorTheme?: "green" | "orange", iconType?: "plane" | "motorcycle" }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(100);
    useLayoutEffect(() => {
        if (!containerRef.current) return;
        setWidth(containerRef.current.offsetWidth);
        const observer = new ResizeObserver((entries) => { for (const entry of entries) { if (entry.contentBoxSize) setWidth(entry.contentRect.width); } });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);
    const colors = { green: { primary: "#22c55e", secondary: "#14532d", light: "#86efac" }, orange: { primary: "#f97316", secondary: "#7c2d12", light: "#fdba74" } }[colorTheme];
    const pathD = `M0 20 Q ${width * 0.25} 25 ${width * 0.5} 15 T ${width} 20`;
    return (
        <div ref={containerRef} className="absolute top-full left-0 w-full h-12 overflow-visible pointer-events-none -mt-4">
            {isVisible && width > 0 && (
                <svg width="100%" height="100%" viewBox={`0 0 ${width} 40`} className="overflow-visible">
                    <defs><filter id="cloud-glow-splash" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs>
                    {[0.2, 0.4, 0.6, 0.8].map((offset, i) => (
                        <motion.circle key={i} r="1.5" fill={colors.light} initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], offsetDistance: [`${offset * 100 - 10}%`, `${offset * 100}%`] }}
                            style={{ offsetPath: `path('${pathD}')` }}
                            transition={{ duration: 1.0, delay: i * 0.2, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }} />
                    ))}
                    <motion.path d={pathD} fill="none" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" strokeDasharray="0 8" filter="url(#cloud-glow-splash)" opacity="0.5"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 0.9 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
                    <motion.path d={pathD} fill="none" stroke={colors.primary} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 0.85 }} transition={{ duration: 1.2, ease: "easeInOut" }} />
                    <motion.g initial={{ offsetDistance: "0%", opacity: 0 }} animate={{ offsetDistance: "100%", opacity: 1 }}
                        style={{ offsetPath: `path('${pathD}')`, offsetRotate: iconType === "motorcycle" ? "0deg" : "auto" }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}>
                        {iconType === "plane" ? (
                            <g transform="translate(14, -12) rotate(-45)">
                                <path d="M22 2L11 21L2 2L22 2Z" fill={colors.primary} stroke={colors.primary} strokeWidth="2" strokeLinejoin="round" transform="rotate(270) scale(0.6) translate(-12, -12)" />
                                <path d="M12 2L12 22" stroke={colors.secondary} strokeWidth="1" transform="rotate(270) scale(0.6) translate(-12, -12)" />
                            </g>
                        ) : (
                            <g transform="translate(12, -22) scale(0.8)">
                                <path d="M5 16 L10 16 L14 12 L11 12 Z" fill={colors.secondary} />
                                <path d="M10 11 Q 13 8 18 11 L 18 12 L 10 12 Z" fill={colors.primary} stroke={colors.secondary} strokeWidth="1" />
                                <path d="M5 11 L10 11 L10 13 L6 13 Z" fill="#171717" />
                                <circle cx="5" cy="18" r="4.5" stroke={colors.primary} strokeWidth="1.5" fill="none" />
                                <circle cx="21" cy="18" r="4.5" stroke={colors.primary} strokeWidth="1.5" fill="none" />
                                <rect x="11" y="13" width="4" height="4" rx="1" fill={colors.secondary} />
                                <path d="M16 11 L16 9 L14 8" stroke={colors.primary} strokeWidth="1.5" fill="none" />
                                <circle cx="19" cy="9" r="1.5" fill={colors.light} />
                                <path d="M12 18 L24 18" stroke={colors.secondary} strokeWidth="1.5" strokeLinecap="round" />
                            </g>
                        )}
                    </motion.g>
                </svg>
            )}
        </div>
    );
}
