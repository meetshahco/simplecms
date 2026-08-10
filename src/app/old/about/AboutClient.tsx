"use client";
import { motion } from "framer-motion";

export function AboutClient() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/30 pt-32 pb-24 px-6 md:px-12 relative overflow-hidden flex justify-center">

            {/* Main Content Container */}
            <div className="w-full max-w-screen-2xl relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start mt-12 md:mt-24">
                {/* Coming Soon Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-16"
                >
                    <div className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-neutral-300 backdrop-blur-md mb-6 border border-white/5">
                        Coming Soon
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4">
                        About Me.
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-md mx-auto">
                        I&apos;m curating the story behind my journey as a Product Designer. Stay tuned for a deeper look into who I am and what drives my work.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
