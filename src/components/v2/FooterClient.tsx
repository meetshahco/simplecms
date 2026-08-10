"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Settings } from "@/lib/cms/storage";

const QUOTES = [
    "Crafting visual stories, one detail at a time.",
    "Beautiful interfaces begin with meaningful logic.",
    "Designing with empathy, developing with precision.",
    "Form follows function, but delights the soul.",
];

function LinkedinIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function GithubIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function GoogleAntigravityLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMinYMid meet">
            <text x="0" y="28" fill="currentColor" className="font-sans font-bold text-lg tracking-tighter">
                Google <tspan className="font-normal opacity-70 italic">Antigravity</tspan>
            </text>
        </svg>
    );
}

export function FooterClient({ settings, variant = "main" }: { settings: Settings, variant?: "main" | "minimal" }) {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [displayQuote, setDisplayQuote] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (variant === "minimal") return;

        let timeout: NodeJS.Timeout;
        const currentFullQuote = QUOTES[currentQuoteIndex];

        if (isTyping) {
            if (displayQuote.length < currentFullQuote.length) {
                timeout = setTimeout(() => {
                    setDisplayQuote(currentFullQuote.slice(0, displayQuote.length + 1));
                }, 40);
            } else {
                timeout = setTimeout(() => setIsTyping(false), 3500);
            }
        } else {
            if (displayQuote.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayQuote(displayQuote.slice(0, -1));
                }, 20);
            } else {
                const timer = setTimeout(() => {
                    setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES.length);
                    setIsTyping(true);
                }, 0);
                return () => clearTimeout(timer);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayQuote, isTyping, currentQuoteIndex, variant]);

    return (
        <footer className={`w-full bg-neutral-950/20 border-t border-white/5 pb-12 px-6 sm:px-12 flex flex-col items-center justify-center relative overflow-hidden ${variant === 'main' ? 'pt-24 mt-24' : 'pt-12'}`}>
            
            {/* Ambient Background glow */}
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

            {variant === "main" && (
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 z-10 min-h-[140px] mb-8">
                    <div className="text-base sm:text-lg md:text-xl font-mono text-neutral-400 font-medium tracking-tight flex items-center justify-center min-h-[3rem]">
                        <span className="opacity-40 mr-3 text-blue-500 shrink-0">~_</span>
                        <span className="relative text-neutral-300">
                            {displayQuote}
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                className="inline-block w-2 h-4 bg-blue-500 align-middle ml-1"
                            />
                        </span>
                    </div>

                    <div className="font-mono text-[9px] sm:text-xs flex items-center gap-2">
                        <span className="text-neutral-800">—</span>
                        <span className="uppercase text-neutral-500 tracking-[0.2em] bg-white/[0.02] border border-white/5 px-3 py-1 rounded-full">
                            [REFRESH.SYSTEM: V2]
                        </span>
                        <span className="text-neutral-800">—</span>
                    </div>
                </div>
            )}

            {variant === "main" && (
                <div className="w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-white/5 to-transparent my-8" />
            )}

            {/* Middle Section */}
            <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                {/* Brand */}
                <div className="flex items-center justify-start">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-all duration-300"
                    >
                        {settings.siteTitle || "Meet Shah"} &copy; {new Date().getFullYear()}
                    </button>
                </div>

                {/* Socials */}
                <div className="flex items-center gap-6">
                    {settings.socialLinks?.linkedin && (
                        <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white hover:scale-105 transition-all duration-300" aria-label="LinkedIn">
                            <LinkedinIcon className="w-4.5 h-4.5" />
                        </a>
                    )}
                    {settings.socialLinks?.github && (
                        <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white hover:scale-105 transition-all duration-300" aria-label="GitHub">
                            <GithubIcon className="w-4.5 h-4.5" />
                        </a>
                    )}
                    {settings.socialLinks?.twitter && (
                        <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white hover:scale-105 transition-all duration-300" aria-label="X (Twitter)">
                            <XIcon className="w-4.5 h-4.5" />
                        </a>
                    )}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-end">
                    <Link
                        href="/contact"
                        className="group inline-flex items-center gap-2 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-widest px-6 py-3 transition-all duration-300 hover:bg-neutral-200 hover:scale-105"
                    >
                        Let&apos;s collaborate
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

            {/* Google Antigravity Credit */}
            <div className="w-full max-w-7xl mt-12 text-center z-10 flex flex-col items-center justify-center border-t border-white/5 pt-8">
                <div className="text-[10px] text-neutral-500 flex flex-col sm:flex-row items-center gap-2">
                    <span className="opacity-60">Redesigned alongside</span>
                    <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center transition-all duration-300 translate-y-[1px]">
                        <GoogleAntigravityLogo className="h-4 w-auto opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                </div>
            </div>

        </footer>
    );
}
