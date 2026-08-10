"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Star, Briefcase, Award } from "lucide-react";
import Link from "next/link";

const EXPERIENCE = [
    {
        role: "Senior Product Designer",
        company: "Innovate Tech",
        period: "2023 - Present",
        description: "Leading design systems and user experience strategy for flagship web and mobile applications."
    },
    {
        role: "Product & UX Generalist",
        company: "Craft Studio",
        period: "2020 - 2023",
        description: "Designed and prototyped data-dense client dashboards and e-commerce platforms."
    },
    {
        role: "UX/UI Designer & Engineer",
        company: "Pixel Labs",
        period: "2017 - 2020",
        description: "Built semantic HTML/CSS components and structured interfaces alongside senior engineering teams."
    }
];

const EXPERTISE = [
    "Product Design & Strategy",
    "UI/UX Prototyping",
    "Design Systems (Figma/Code)",
    "Frontend Engineering (Next.js/React)",
    "Interaction Design",
    "User Research & Testing"
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 relative overflow-hidden flex flex-col items-center">
            
            {/* Ambient background lights */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-7xl relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                
                {/* Left Column: Portrait & Details */}
                <div className="w-full lg:w-2/5 flex flex-col gap-8 lg:sticky lg:top-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-neutral-900"
                    >
                        <Image
                            src="/assets/meet-portrait.jpg"
                            alt="Meet Shah"
                            fill
                            className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </motion.div>

                    {/* Quick Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
                            <p className="text-3xl font-black text-white">9+</p>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Years Experience</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
                            <p className="text-3xl font-black text-white">40+</p>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">Projects Delivered</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Bio & Timeline */}
                <div className="w-full lg:w-3/5 space-y-12">
                    {/* Header */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]"
                        >
                            <Star className="w-3.5 h-3.5" />
                            My Story
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-none text-white"
                        >
                            Designer. <br />
                            Developer. Generalist.
                        </motion.h1>
                    </div>

                    {/* Bio */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6 text-neutral-400 font-light leading-relaxed text-base sm:text-lg"
                    >
                        <p>
                            I&apos;m Meet Shah, a product designer and developer with over nine years of experience crafting interactive software. I specialise in the middle space between code and aesthetics—believing that design is not just how something looks, but how smoothly it solves real problems.
                        </p>
                        <p>
                            Throughout my career, I&apos;ve had the opportunity to build products from initial sketches to production code, establishing unified design systems and driving strategic product decisions. I find my flow in balancing technical logic with user-focused visual clarity.
                        </p>
                    </motion.div>

                    {/* Timeline: Experience */}
                    <div className="space-y-8 pt-4">
                        <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-blue-500" />
                            Experience
                        </h2>

                        <div className="relative border-l border-white/10 pl-6 space-y-10 ml-2">
                            {EXPERIENCE.map((exp, i) => (
                                <motion.div
                                    key={exp.role}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="relative space-y-2"
                                >
                                    {/* Timeline point */}
                                    <div className="absolute -left-[31px] top-1.5 w-2 h-2 rounded-full bg-blue-500 border border-black shadow" />

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <h3 className="text-base font-bold text-white leading-tight">{exp.role}</h3>
                                        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">{exp.period}</span>
                                    </div>
                                    <p className="text-xs text-neutral-400 font-medium">{exp.company}</p>
                                    <p className="text-sm text-neutral-500 font-light leading-relaxed">{exp.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline: Expertise */}
                    <div className="space-y-6 pt-4">
                        <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Award className="w-4 h-4 text-purple-500" />
                            Expertise & Capabilities
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {EXPERTISE.map((skill, i) => (
                                <motion.div
                                    key={skill}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.01]"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    <span className="text-sm font-medium text-neutral-300">{skill}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Callout */}
                    <div className="pt-6">
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest px-8 py-4 transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            Let&apos;s Talk
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                </div>

            </div>
        </main>
    );
}
