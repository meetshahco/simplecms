"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { CMSBackgroundAnimation } from "@/components/auth/CMSBackgroundAnimation";
import { motion } from "framer-motion";
import {
    Github,
    Layout,
    Star,
    Globe,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FEATURE_CARDS } from "./cms-config";
import { adminPath } from "@/lib/admin-utils";

// Reusable Framer Motion Variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const }
};

const staggerContainer = {
    visible: { transition: { staggerChildren: 0.05 } },
    hidden: {}
};

export default function SimpleCMSLanding() {
    const [stars, setStars] = useState<number | null>(null);

    useEffect(() => {
        fetch("https://api.github.com/repos/meetshahco/simplecms")
            .then(res => res.json())
            .then(data => {
                if (data.stargazers_count !== undefined) {
                    setStars(data.stargazers_count);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white/20">
            <div className="flex flex-col md:flex-row flex-1">
                {/* Left Side: Marketing & Showcase */}
                <div className="w-full md:w-3/5 p-6 sm:p-8 md:pt-12 md:pb-16 md:px-16 lg:pt-16 lg:pb-24 lg:px-24 flex flex-col relative z-10">

                    {/* Background Decor (Subtle Greyscale) */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03]">
                        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-white rounded-full blur-[150px]" />
                    </div>

                    <div className="relative z-10 space-y-12">
                        {/* Header / Branding / Intro Section */}
                        <motion.div
                            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-12"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: 2 }}
                                        className="w-11 h-11 flex items-center justify-center transition-all overflow-hidden group relative bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-sm shadow-xl hover:bg-white/[0.05] hover:border-white/20"
                                    >
                                        {/* Subtle Glow Effect */}
                                        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <Image
                                            src="/assets/images/simple-cms-logo-v2.png"
                                            alt="Simple CMS Logo"
                                            width={56}
                                            height={56}
                                            className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform relative z-10"
                                        />
                                    </motion.div>
                                    <h2 className="text-xl font-medium tracking-tight text-neutral-300">Simple CMS</h2>
                                </div>

                                <Link
                                    href="https://github.com/meetshahco/simplecms"
                                    target="_blank"
                                    data-track="View Code Click"
                                    data-track-props='{"location": "Simple CMS Header"}'
                                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-2">
                                        <Github className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                                        <span className="text-[13px] font-medium text-neutral-300 group-hover:text-white">Github</span>
                                    </div>
                                    <div className="h-3 w-[1px] bg-white/10" />
                                    <div className="flex items-center gap-1.5 min-w-[32px]">
                                        <Star className="w-3.5 h-3.5 text-neutral-500 group-hover:text-yellow-500 transition-colors fill-current" />
                                        <span className="text-[13px] font-mono text-neutral-400 group-hover:text-neutral-200">
                                            {stars !== null ? (stars / 1000 >= 1 ? `${(stars / 1000).toFixed(1)}k` : stars) : 0}
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            <div className="flex flex-col gap-4 w-full">
                                <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-neutral-100 leading-tight md:!leading-[50px]">
                                    Your Portfolio's New Best{" "}
                                    <span className="whitespace-nowrap">
                                        Friend.{" "}
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
                                            animate={{ scale: 1, opacity: 1, rotate: -5 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                                            className="inline-block align-middle -mt-2 md:-mt-3"
                                        >
                                            <img
                                                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExazFybnd5bWQ3bmxzOTl0MDVmbGd4cnBmMHo1anpsbTc2bjZyMXZhbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hRCFBt3ta0DJeGto2R/giphy.gif"
                                                alt="Sparkle"
                                                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-xl opacity-90 mix-blend-screen mix-blend-lighten"
                                            />
                                        </motion.span>
                                    </span>
                                </h1>
                                <p className="mt-2 text-base text-neutral-400 max-w-lg leading-relaxed font-light">
                                    Built with Next.js, Vercel KV, and Tiptap. Designed for Designers, PMs, and Makers who build high-end product portfolios.
                                </p>
                            </div>
                        </motion.div>

                        {/* Features List */}
                        <div className="space-y-4">
                            {FEATURE_CARDS.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    {...fadeInUp}
                                    transition={{ ...fadeInUp.transition, delay: 0.2 + i * 0.1 }}
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    className="relative p-5 md:p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-300 group flex flex-col md:flex-row gap-5 md:gap-6 overflow-hidden hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] min-w-0"
                                >
                                    {/* Glow Effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.04] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out" />

                                    <div className="hidden sm:flex shrink-0 self-start md:mt-1">
                                        <div className="p-3.5 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/5 shadow-xl shadow-black border border-white/10 group-hover:border-white/20 transition-colors flex items-center justify-center">
                                            {/* Inner Animated Icon */}
                                            <motion.div
                                                whileHover={{ scale: 1.15, rotate: 15 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                {feature.icon}
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col relative z-10 break-words overflow-visible min-w-0">
                                        <h3 className="text-base font-semibold mb-2 text-neutral-100 group-hover:text-white transition-colors">{feature.title}</h3>
                                        <p className="text-[13px] text-neutral-400 leading-relaxed font-light group-hover:text-neutral-300 transition-colors">{feature.description}</p>

                                        {/* Horizontal Animated Chips / Marquee */}
                                        {feature.tags && feature.tags.length > 0 && (
                                            <div className="flex overflow-hidden relative w-full mt-5 mask-edges-horizontal-wide">
                                                <motion.div
                                                    animate={{ x: ["0%", "-50%"] }}
                                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                                    className="flex shrink-0 gap-2 w-max"
                                                >
                                                    {[...feature.tags, ...feature.tags].map((tag, j) => (
                                                        <div key={j} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/5 bg-black/20 text-neutral-400 shadow-sm group-hover:border-white/10 group-hover:text-neutral-300 transition-colors whitespace-nowrap">
                                                            {tag.icon}
                                                            <span>{tag.label}</span>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* GitHub Card */}
                        <motion.div
                            {...fadeInUp}
                            transition={{ ...fadeInUp.transition, delay: 0.6 }}
                            className="mt-8 relative w-full rounded-2xl overflow-hidden group border border-transparent hover:border-white/5 transition-colors bg-white/[0.03]"
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

                            <div className="p-6 md:p-8 flex flex-col h-full min-h-[160px] relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full">
                                    <div className="max-w-sm">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/10">
                                            <Github className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                                            Constantly updating CMS with features focused on you.
                                        </h3>
                                        <p className="text-neutral-400 text-sm font-light">
                                            Fork it, own it, update it.
                                        </p>
                                    </div>

                                    <div className="mt-auto md:h-full md:mt-0 flex items-end justify-end">
                                        <Link
                                            href="https://github.com/meetshahco/simplecms"
                                            target="_blank"
                                            data-track="View Code Click"
                                            data-track-props='{"location": "Simple CMS Landing"}'
                                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-medium hover:bg-neutral-200 text-sm transition-all active:scale-95 shadow-lg shadow-white/5 hover:shadow-white/10"
                                        >
                                            <span>Fork on GitHub</span>
                                            <Star className="w-3.5 h-3.5 fill-current group-hover:animate-bounce" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: Login Panel */}
                <div className="w-full md:w-2/5 min-h-[500px] md:h-screen md:sticky md:top-0 bg-[#020202] border-t md:border-t-0 md:border-l border-white/5 flex flex-col justify-center items-center p-8 relative z-20 shadow-2xl overflow-hidden">

                    {/* Animated CMS Background */}
                    <CMSBackgroundAnimation />

                    {/* Subtle Right Side Decor */}
                    <div className="absolute top-1/4 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none z-0" />

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full max-w-sm space-y-8 relative z-10"
                    >
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold mb-2 text-neutral-100 tracking-tight flex items-center justify-center md:justify-start gap-3">
                                Experience the Demo
                                <motion.span
                                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                                    className="origin-bottom-right inline-block text-2xl"
                                >
                                    👋
                                </motion.span>
                            </h2>
                            <p className="text-neutral-500 text-sm font-light">
                                Login below to try the editor interface.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-transparent shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.03)] transition-shadow">
                            <LoginForm prefill={true} />

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="flex items-start gap-3 bg-white/[0.04] p-4 rounded-xl border border-transparent shadow-inner">
                                    <Layout className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0 drop-shadow" />
                                    <p className="text-[13px] text-neutral-400 leading-relaxed font-light">
                                        <span className="font-semibold text-neutral-300">Guest Pass:</span> Form is pre-filled with <span className="font-mono text-neutral-200">admin / admin</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

            {/* Global Full-Width Footer */}
            <footer className="w-full bg-[#020202] border-t border-white/10 relative overflow-hidden z-30">
                <div className="w-full px-8 md:px-16 lg:px-24 py-8 md:py-12">
                    <div className="flex flex-col gap-6 relative z-10 w-full group">
                        {/* Line 1: Philosophy with typing animation */}
                        <div className="text-center md:text-left h-20 sm:h-auto flex items-center justify-center md:justify-start">
                            <motion.blockquote
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="font-['var(--font-caveat)'] text-xl sm:text-2xl md:text-3xl text-neutral-500/70 tracking-wide flex items-center flex-wrap"
                            >
                                {"Designed to solve my problems. Open-sourced to solve yours.".split("").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        variants={{
                                            hidden: { display: "none", opacity: 0 },
                                            visible: { display: "inline", opacity: 1 }
                                        }}
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                ))}
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="ml-1 w-2 h-6 bg-neutral-500/50 inline-block align-middle"
                                />
                            </motion.blockquote>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-4">
                            {/* Left: Built By */}
                            <p className="text-xs md:text-sm text-neutral-500 font-light text-center md:text-left order-2 sm:order-1">
                                Built by <Link href="https://meetshah.co" className="font-bold text-neutral-200 hover:text-white transition-all underline decoration-white/20 underline-offset-4 decoration-1">Meet Shah</Link>
                            </p>

                            {/* Right: Global Links & CTA */}
                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 order-1 sm:order-2">
                                <FooterIconLink href="https://meetshah.co" title="Portfolio"><Globe className="w-4 h-4 md:w-5 md:h-5" /></FooterIconLink>
                                <FooterIconLink href="https://linkedin.com/in/meetshahco" title="LinkedIn" isLinkedIn><LinkedInIcon /></FooterIconLink>
                                <FooterIconLink href="https://github.com/meetshahco" title="GitHub"><Github className="w-4 h-4 md:w-5 md:h-5" /></FooterIconLink>

                                <Link
                                    href="https://www.meetshah.co/contact"
                                    className="ml-2 flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-medium hover:bg-neutral-200 text-[13px] transition-all active:scale-95 shadow-lg tracking-wide"
                                >
                                    Let's talk
                                </Link>
                            </div>
                        </div>

                        {/* Retro ambient background element that subtly reacts to hover on the whole footer area */}
                        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 overflow-hidden">
                            <div className="absolute left-1/4 bottom-0 w-[500px] h-32 bg-blue-500/10 blur-[80px] rounded-full translate-y-10 group-hover:translate-y-0 transition-transform duration-1000" />
                            <div className="absolute right-1/4 bottom-0 w-[300px] h-32 bg-purple-500/10 blur-[80px] rounded-full translate-y-10 group-hover:translate-y-0 transition-transform duration-1000 delay-100" />
                        </div>
                    </div>
                </div>
                {/* Global CSS for fade out mask edges */}
                <style jsx global>{`
                .mask-edges-horizontal-wide {
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }
                `}</style>
            </footer>
        </div>
    );
}

function FooterIconLink({ href, title, children, isLinkedIn = false }: { href: string; title: string; children: React.ReactNode; isLinkedIn?: boolean }) {
    return (
        <Link
            href={href}
            target="_blank"
            className={`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 transition-all text-neutral-400 hover:text-white shadow-lg focus:outline-none focus:ring-2 ${isLinkedIn ? 'hover:bg-[#0077b5]/20 hover:border-[#0077b5]/50 focus:ring-[#0077b5]/50 hover:text-[#0077b5]' : 'hover:bg-white/10 hover:border-white/20 focus:ring-white/20'}`}
            title={title}
        >
            {children}
        </Link>
    );
}

function LinkedInIcon() {
    return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
    );
}
