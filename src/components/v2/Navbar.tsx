"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

function NavItem({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={href}
            className="relative px-4 py-2 flex items-center justify-center overflow-hidden rounded-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="invisible text-xs font-bold uppercase tracking-widest whitespace-nowrap">{label}</span>

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
                    className="absolute text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                >
                    {label}
                </motion.span>
                <motion.span
                    initial={false}
                    animate={{ y: isHovered ? "0%" : "150%", opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute text-xs font-bold uppercase tracking-widest whitespace-nowrap"
                >
                    {label}
                </motion.span>
            </motion.div>

            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
            )}
        </Link>
    );
}

export function Navbar({ siteTitle = "Meet Shah" }: { siteTitle?: string }) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/" || pathname === "/v2" || pathname === "/v2/";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 md:py-6 transition-all duration-300">
            <motion.nav 
                animate={{
                    backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.6)" : "rgba(10, 10, 10, 0)",
                    borderColor: isScrolled ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0)",
                    boxShadow: isScrolled ? "0 10px 30px -10px rgba(0,0,0,0.5)" : "none",
                    paddingTop: isScrolled ? "8px" : "12px",
                    paddingBottom: isScrolled ? "8px" : "12px",
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                    "w-full max-w-7xl px-6 md:px-12 flex items-center justify-between border backdrop-blur-md rounded-full transition-all"
                )}
            >
                {/* Left - Back Button or Brand Logo */}
                <div className="flex justify-start items-center">
                    {!isHome ? (
                        <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group text-xs font-bold uppercase tracking-widest py-2">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back to Home
                        </Link>
                    ) : (
                        <Link href="/" className="text-sm font-bold text-white font-heading tracking-[0.2em] uppercase transition-colors hover:text-neutral-300">
                            {siteTitle}
                        </Link>
                    )}
                </div>

                {/* Center - Navigation Items */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <NavItem href="/work" label="Work" isActive={pathname === "/work" || pathname.startsWith("/work/") || pathname.startsWith("/v2/work")} />
                    <NavItem href="/about" label="About" isActive={pathname === "/about" || pathname === "/v2/about"} />
                </div>

                {/* Right - Contact Link */}
                <div className="flex justify-end items-center">
                    <Link
                        href="/contact"
                        className={cn(
                            "relative group flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full overflow-hidden transition-all duration-300",
                            pathname === "/contact" || pathname === "/v2/contact"
                                ? "bg-white text-black" 
                                : "bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black hover:border-white"
                        )}
                    >
                        <span>Let&apos;s Talk</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </motion.nav>
        </header>
    );
}
