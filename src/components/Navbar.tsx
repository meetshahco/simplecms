"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContactAnimation } from "@/context/ContactAnimationContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

function NavItem({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={href}
            className="relative px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-center overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Invisible structural element to lock the layout width permanently */}
            <span className="invisible text-[13px] sm:text-sm font-medium whitespace-nowrap">{label}</span>

            <motion.div
                initial={false}
                animate={{
                    color: isActive ? "#ffffff" : (isHovered ? "#ffffff" : "#a3a3a3")
                }}
                className="absolute inset-0 flex items-center justify-center transition-colors duration-300 pointer-events-none"
            >
                <motion.span
                    initial={false}
                    animate={{ y: isHovered ? "-150%" : "0%", opacity: isHovered ? 0 : 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute text-[13px] sm:text-sm font-medium whitespace-nowrap"
                >
                    {label}
                </motion.span>
                <motion.span
                    initial={false}
                    animate={{ y: isHovered ? "0%" : "150%", opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute text-[13px] sm:text-sm font-medium whitespace-nowrap"
                >
                    {label}
                </motion.span>
            </motion.div>
        </Link>
    );
}

export function Navbar({ siteTitle = "Meet Shah" }: { siteTitle?: string }) {
    const { isContactCta, setIsContactCta, contactRef } = useContactAnimation();
    const pathname = usePathname();
    const [isContactHovered, setIsContactHovered] = useState(false);

    // Auto-enable the Contact CTA if the splash was skipped or already played
    useEffect(() => {
        if (sessionStorage.getItem("splashPlayed") === "true") {
            setIsContactCta(true);
        }
    }, [setIsContactCta]);

    return (
        <>
        <nav className="fixed top-0 left-0 right-0 z-50 py-4 md:py-6 backdrop-blur-sm px-6 sm:px-10 md:px-[53px]">
            <div className="grid grid-cols-2 md:grid-cols-3 items-center w-full">
                {/* Left - Site Title */}
                <div className="flex justify-start">
                    {pathname !== "/" ? (
                        <Link href="/" className="flex items-center justify-center p-2 -ml-2 text-neutral-400 hover:text-white transition-colors group">
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        </Link>
                    ) : (
                        <Link href="/" className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight drop-shadow-md">
                            {siteTitle}
                        </Link>
                    )}
                </div>

                {/* Center - Navigation Items (Desktop only) */}
                <div className="hidden md:flex justify-center items-center gap-6">
                    <NavItem href="/work" label="Work" isActive={pathname === "/work"} />
                    <NavItem href="/about" label="About" isActive={pathname === "/about"} />
                </div>

                {/* Right - Contact CTA */}
                <div className="flex justify-end items-center">
                    <Link
                        href="/contact"
                        ref={contactRef}
                        className="ml-2 relative flex items-center justify-center"
                        onMouseEnter={() => setIsContactHovered(true)}
                        onMouseLeave={() => setIsContactHovered(false)}
                    >
                        {/* Structural invisible layer defining width/height based on states */}
                        <span
                            className="invisible whitespace-nowrap text-[13px] sm:text-sm font-medium transition-all duration-300 pointer-events-none"
                            style={{
                                paddingLeft: isContactCta ? "1.5rem" : "0.5rem",
                                paddingRight: isContactCta ? "1.5rem" : "0.5rem",
                                paddingTop: isContactCta ? "0.4rem" : "0.4rem",
                                paddingBottom: isContactCta ? "0.4rem" : "0.4rem",
                            }}
                        >
                            {isContactCta ? "Let's Talk!" : "Contact"}
                        </span>

                        <motion.div
                            layout
                            initial={false}
                            animate={{
                                backgroundColor: isContactCta ? "#ffffff" : "rgba(255, 255, 255, 0)",
                                color: isContactCta ? "#000000" : (pathname === "/contact" ? "#ffffff" : isContactHovered ? "#ffffff" : "#a3a3a3"),
                                borderRadius: "9999px",
                            }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                            className={cn(
                                "absolute inset-0 flex items-center justify-center overflow-hidden transition-colors duration-300 pointer-events-none",
                                isContactCta && "hover:scale-105 hover:bg-neutral-200 pointer-events-auto"
                            )}
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                {isContactCta ? (
                                    <motion.span
                                        key="cta"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="text-[13px] sm:text-sm font-medium whitespace-nowrap absolute"
                                    >
                                        Let&apos;s Talk!
                                    </motion.span>
                                ) : (
                                    <>
                                        <motion.span
                                            key="contact-idle"
                                            initial={false}
                                            animate={{ y: isContactHovered ? "-150%" : "0%", opacity: isContactHovered ? 0 : 1 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute text-[13px] sm:text-sm font-medium whitespace-nowrap"
                                        >
                                            Contact
                                        </motion.span>
                                        <motion.span
                                            key="contact-hovered"
                                            initial={false}
                                            animate={{ y: isContactHovered ? "0%" : "150%", opacity: isContactHovered ? 1 : 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute text-[13px] sm:text-sm font-medium whitespace-nowrap"
                                        >
                                            Contact
                                        </motion.span>
                                    </>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </nav>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center justify-center gap-2 bg-neutral-900/90 backdrop-blur-lg border border-white/10 rounded-full px-4 py-2 shadow-2xl">
                <NavItem href="/work" label="Work" isActive={pathname === "/work"} />
                <NavItem href="/about" label="About" isActive={pathname === "/about"} />
                {/* Logic for hamburger if > 3 items can be added here later */}
            </div>
        </div>
        </>
    );
}
