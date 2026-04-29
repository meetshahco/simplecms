"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContactAnimation } from "@/context/ContactAnimationContext";

export function PlaneOverlay() {
    const { planePathStart, contactRef, setIsContactCta, setIsViewDeckCta, resetAnimation } = useContactAnimation();
    const [pathD, setPathD] = useState<string | null>(null);
    const [phase, setPhase] = useState<"idle" | "drawing" | "fading">("idle");

    useEffect(() => {
        if (planePathStart) {
            const startX = planePathStart.x;
            const startY = planePathStart.y;

            if (contactRef.current) {
                const contactRect = contactRef.current.getBoundingClientRect();
                const endX = contactRect.left + contactRect.width / 2;
                const endY = contactRect.top + contactRect.height / 2;

                const totalDx = endX - startX;
                const totalDy = endY - startY;

                const loop1X = startX + totalDx * 0.35;
                const loop1Y = startY + totalDy * 0.4 - 50;
                const r1 = 60;

                const loop2X = startX + totalDx * 0.7;
                const loop2Y = startY + totalDy * 0.7 + 50;
                const r2 = 50;

                const rawPath = `
                    M ${startX} ${startY}
                    C ${startX + 50} ${startY - 20}, ${loop1X + r1} ${loop1Y + r1}, ${loop1X + r1} ${loop1Y}
                    C ${loop1X + r1} ${loop1Y - r1 * 1.5}, ${loop1X - r1 * 1.2} ${loop1Y - r1 * 1.5}, ${loop1X - r1 * 1.2} ${loop1Y}
                    C ${loop1X - r1 * 1.2} ${loop1Y + r1 * 1.5}, ${loop2X + r2} ${loop2Y + r2}, ${loop2X + r2} ${loop2Y}
                    C ${loop2X + r2} ${loop2Y - r2 * 1.5}, ${loop2X - r2 * 1.2} ${loop2Y - r2 * 1.5}, ${loop2X - r2 * 1.2} ${loop2Y}
                    C ${loop2X - r2 * 1.2} ${loop2Y + r2 * 1.5}, ${endX - 50} ${endY + 50}, ${endX} ${endY}
                `;
                setPathD(rawPath.replace(/\s+/g, ' ').trim());
                setPhase("drawing");
            }
        }
    }, [planePathStart, contactRef]);

    const handlePlaneReached = () => {
        setIsContactCta(true);
        setIsViewDeckCta(true);
        setTimeout(() => setPhase("fading"), 1000);
        setTimeout(() => {
            setPhase("idle");
            resetAnimation();
        }, 2000);
    };

    if (phase === "idle" || !pathD) return null;

    const colors = {
        trail: "#38bdf8", // Sky-400 (Clean, bright blue)
        planeBorder: "#0284c7" // Sky-600 dark blue for the outline to pop
    };

    const isDrawing = phase === "drawing";
    const animDuration = 2.2;
    const flightEase = [0.25, 1, 0.5, 1] as [number, number, number, number];

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
            <AnimatePresence>
                {isDrawing && (
                    <motion.svg
                        className="w-full h-full absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                        <defs>
                            <mask id="dash-mask-1">
                                <motion.path
                                    d={pathD}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="10"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: animDuration, ease: flightEase }}
                                />
                            </mask>
                        </defs>

                        {/* Single Plane (Contact) */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke={colors.trail}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="8 12"
                            opacity="0.8"
                            mask="url(#dash-mask-1)"
                        />
                        <motion.g
                            initial={{ offsetDistance: "0%", opacity: 0, scale: 0.5 }}
                            animate={{ offsetDistance: "100%", opacity: 1, scale: 1.5 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{ offsetPath: `path('${pathD}')`, offsetRotate: "auto" }}
                            transition={{ duration: animDuration, ease: flightEase }}
                            onAnimationComplete={handlePlaneReached}
                        >
                            <g transform="translate(0, 0) rotate(15) scale(0.8)">
                                <path d="M -15 15 L 20 0 L -15 -15 Z" fill={colors.trail} stroke={colors.planeBorder} strokeWidth="2" strokeLinejoin="round" />
                                <path d="M -15 15 L -5 0 L 20 0 Z" fill={colors.planeBorder} stroke={colors.planeBorder} strokeWidth="2" strokeLinejoin="round" />
                            </g>
                        </motion.g>
                    </motion.svg>
                )}
            </AnimatePresence>
        </div>
    );
}
