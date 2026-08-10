"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutMe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

    return (
        <section
            ref={containerRef}
            className="relative flex items-center justify-center py-32 w-full mx-auto px-4 md:px-12 max-w-7xl overflow-hidden"
        >
            {/* Ambient Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-full blur-[160px] pointer-events-none" />

            {/* Glowing Card that fades in on scroll */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ y }}
                className="relative z-10 w-full rounded-[3rem] bg-neutral-900/30 border border-white/5 backdrop-blur-2xl p-8 sm:p-12 md:p-20 shadow-3xl hover:border-white/10 transition-all duration-700 group/card overflow-hidden"
            >
                {/* Subtle Hover Gradient Accent */}
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-16">

                    {/* Text Column */}
                    <div className="flex-1 space-y-8 text-center lg:text-left">
                        <div className="space-y-3">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Designer & Craftsman</span>
                            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight leading-none">
                                Bridging two worlds.
                            </h2>
                        </div>

                        <p className="text-xl sm:text-2xl text-neutral-400 font-light leading-relaxed">
                            A business-focused <span className="text-white font-medium">Product & UX Generalist</span> who designs high-fidelity interfaces and builds scalable frontend software. Combining visual clarity with engineered precision.
                        </p>

                        <div className="pt-4 flex justify-center lg:justify-start">
                            <Link
                                href="/about"
                                className="group inline-flex items-center gap-3 rounded-full bg-white/5 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 border border-white/10 transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 active:scale-95"
                            >
                                Read My Story
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Portrait Image Column */}
                    <div className="flex-shrink-0 flex justify-center lg:justify-end w-full lg:w-auto">
                        <motion.div
                            initial={{ opacity: 0, rotate: -6, scale: 0.92 }}
                            whileInView={{ opacity: 1, rotate: -2, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
                            className="relative w-52 h-60 sm:w-64 sm:h-76 md:w-72 md:h-84 group perspective-[1000px]"
                        >
                            <motion.div
                                whileHover={{ rotateY: -8, rotateX: 4, scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="relative w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-900"
                            >
                                <Image
                                    src="/assets/meet-portrait.jpg"
                                    alt="Meet Shah Portrait"
                                    fill
                                    className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}
