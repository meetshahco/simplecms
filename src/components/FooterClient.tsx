"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Settings } from "@/lib/cms/storage";

// Filled SVG for LinkedIn
function LinkedinIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

// Filled SVG for Medium
function MediumFilledIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
    );
}

// Official X (Twitter) Logo SVG
function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
// GitHub SVG
function GithubIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

// Google Antigravity Wordmark Logo
function GoogleAntigravityLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMinYMid meet">
            <text x="0" y="28" fill="currentColor" className="font-sans font-bold text-2xl tracking-tighter">
                Google <tspan className="font-normal opacity-70 italic">Antigravity</tspan>
            </text>
        </svg>
    );
}

export function FooterClient({ settings, variant = "main" }: { settings: Settings, variant?: "main" | "minimal" }) {
    const quotes = [
        "Code is the logic; Story is the craft.",
        "Human Intelligence > Artificial Outputs",
        "A decade of pixels; a lifetime of perspective.",
        "Algorithms provide the data; Humans provide the \"Why.\"",
        "Simplicity is the hardest complexity to master."
    ];

    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [displayQuote, setDisplayQuote] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (variant === "minimal") return;

        let timeout: NodeJS.Timeout;
        const currentFullQuote = quotes[currentQuoteIndex];

        if (isTyping) {
            if (displayQuote.length < currentFullQuote.length) {
                timeout = setTimeout(() => {
                    setDisplayQuote(currentFullQuote.slice(0, displayQuote.length + 1));
                }, 50);
            } else {
                timeout = setTimeout(() => setIsTyping(false), 3000);
            }
        } else {
            if (displayQuote.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayQuote(displayQuote.slice(0, -1));
                }, 30);
            } else {
                setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayQuote, isTyping, currentQuoteIndex, quotes, variant]);

    return (
        <footer className={`w-full bg-neutral-950/50 border-t border-white/5 pb-8 px-6 sm:px-12 flex flex-col items-center justify-center relative overflow-hidden ${variant === 'main' ? 'pt-16 mt-12' : 'pt-12'}`}>
            {/* Top quote section */}
            {variant === "main" && (
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 z-10 min-h-[120px] sm:min-h-[100px]">
                    <div className="text-lg sm:text-xl md:text-2xl font-mono text-neutral-400 font-medium tracking-tight flex items-center flex-wrap justify-center min-h-[3rem]">
                        <span className="opacity-50 mr-2 sm:mr-4 text-green-500/70 shrink-0">{">_"}</span>
                        <span className="relative">
                            {displayQuote}
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                className="inline-block w-2 sm:w-2.5 h-5 sm:h-6 md:h-7 bg-green-500/70 align-middle ml-1"
                            />
                        </span>
                    </div>

                    {/* Digital Signature */}
                    <div className="font-mono text-[10px] sm:text-xs md:text-sm flex items-center gap-2 sm:gap-3">
                        <span className="text-neutral-700">---</span>
                        <span className="uppercase text-neutral-500 tracking-widest bg-neutral-900 px-2 sm:px-3 py-1 rounded border border-white/5">
                            [SYS.AUTH: 0xMEET]
                        </span>
                        <span className="text-neutral-700">---</span>
                    </div>
                </div>
            )}

            {/* Divider */}
            {variant === "main" && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />
            )}

            {/* Middle Section: Logo (Desktop), Socials, CTA */}
            <div className="w-full flex flex-col md:grid md:grid-cols-3 items-center gap-8 md:gap-0 z-10">

                {/* Left: Logo - Hidden on Mobile, Left on Desktop */}
                <div className="hidden md:flex items-center justify-start h-10">
                    {settings.favicon ? (
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="group relative flex items-center justify-center w-10 h-10 transition-all duration-500 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            aria-label="Back to top"
                        >
                            <div className="relative w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                <Image
                                    src={settings.favicon}
                                    alt="Logo"
                                    fill
                                    className="object-contain invert brightness-0"
                                />
                            </div>
                        </button>
                    ) : (
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center h-10 text-xl font-bold text-white opacity-50 hover:opacity-100 transition-all duration-500 hover:scale-110"
                        >
                            {settings.siteTitle ? settings.siteTitle.split(' ').map(n => n[0]).join('') : "MS"}
                        </button>
                    )}
                </div>

                {/* Center: Social Icons - Center on Mobile, Center on Desktop */}
                <div className="flex flex-col items-center justify-center w-full h-10">
                    <div className="flex items-center gap-6">
                        {settings.socialLinks?.linkedin && (
                            <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center w-10 h-10 text-neutral-500 transition-all duration-500 hover:text-white hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" aria-label="LinkedIn">
                                <LinkedinIcon className="w-5 h-5 relative z-10" />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-neutral-300 text-[10px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1 whitespace-nowrap pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                    LinkedIn
                                </span>
                            </a>
                        )}
                        {settings.socialLinks?.github && (
                            <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center w-10 h-10 text-neutral-500 transition-all duration-500 hover:text-white hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" aria-label="GitHub">
                                <GithubIcon className="w-5 h-5 relative z-10" />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-neutral-300 text-[10px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1 whitespace-nowrap pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                    GitHub
                                </span>
                            </a>
                        )}
                        {settings.socialLinks?.medium && (
                            <a href={settings.socialLinks.medium} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center w-10 h-10 text-neutral-500 transition-all duration-500 hover:text-white hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" aria-label="Medium">
                                <MediumFilledIcon className="w-5 h-5 relative z-10" />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-neutral-300 text-[10px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1 whitespace-nowrap pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                    Medium
                                </span>
                            </a>
                        )}
                        {settings.socialLinks?.twitter && (
                            <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center w-10 h-10 text-neutral-500 transition-all duration-500 hover:text-white hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" aria-label="X (Twitter)">
                                <XIcon className="w-5 h-5 m-0.5 relative z-10" />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-neutral-300 text-[10px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1 whitespace-nowrap pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                    X (Twitter)
                                </span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Right: CTA - Center on Mobile, Right on Desktop */}
                <div className="flex flex-col items-center justify-center md:items-end h-10">
                    <Link
                        href="https://www.meetshah.co/contact"
                        className="group inline-flex h-10 items-center gap-2 rounded-full transition-all duration-700 overflow-hidden bg-transparent text-neutral-400 font-medium text-sm px-6 ring-1 ring-inset ring-white/20 hover:ring-white/0 hover:bg-white hover:text-black hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105"
                    >
                        Let's talk
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

            {/* Footer Bottom copyright */}
            <div className="w-full mt-12 text-center z-10 flex flex-col md:flex-row md:justify-between items-center gap-6 md:gap-0">
                <p className="text-[10px] sm:text-xs sm:text-sm text-neutral-500 leading-relaxed text-center md:text-left order-2 md:order-1 select-none whitespace-nowrap">
                    Copyright &copy; {new Date().getFullYear()} {settings.siteTitle || "Meet Shah"}
                </p>
                <div className="text-[10px] sm:text-xs sm:text-sm text-neutral-500 leading-relaxed text-center md:text-right flex flex-col sm:flex-row items-center justify-center md:justify-end gap-2 md:gap-3 order-1 md:order-2">
                    <span className="whitespace-normal sm:whitespace-nowrap text-neutral-600 font-sans tracking-tight opacity-70">Refined over midnight coffee and deep talks with</span>
                    <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center transition-all duration-300 translate-y-[1px]">
                        <GoogleAntigravityLogo className="h-4 sm:h-5 w-auto opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                </div>
            </div>

            {/* Ambient Background glow */}
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.02] rounded-[100%] blur-[100px] pointer-events-none" />
        </footer>
    );
}
