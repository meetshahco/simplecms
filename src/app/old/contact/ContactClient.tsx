"use client";
import { Mail, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import type { Settings } from "@/lib/cms/storage";

export function ContactClient({ settings }: { settings: Settings }) {
    return (
        <div className="w-full max-w-screen-2xl relative z-10 flex flex-col items-center text-center">
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
                    Let&apos;s build something.
                </h1>
                <p className="text-lg text-neutral-400 max-w-md mx-auto">
                    A full contact experience is in the works. For now, you can reach me directly through any of the channels below.
                </p>
            </motion.div>

            {/* Contact Links Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
            >
                {/* LinkedIn */}
                <a
                    href={settings.socialLinks.linkedin || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="w-12 h-12 rounded-full bg-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2] group-hover:scale-110 transition-transform duration-300">
                        <Linkedin className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-white">LinkedIn</h3>
                        <p className="text-sm text-neutral-400 text-center truncate max-w-[120px]">
                            {settings.socialLinks.linkedin?.split('/').pop() || "LinkedIn"}
                        </p>
                    </div>
                </a>

                {/* Email */}
                <a
                    href={`mailto:${settings.adminEmail}`}
                    className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-300">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-white">Email</h3>
                        <p className="text-sm text-neutral-400 truncate max-w-[150px]">{settings.adminEmail}</p>
                    </div>
                </a>

                {/* GitHub (Replacing placeholder WhatsApp/Phone with GitHub from Settings) */}
                <a
                    href={settings.socialLinks.github || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="w-12 h-12 rounded-full bg-neutral-500/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-white">GitHub</h3>
                        <p className="text-sm text-neutral-400">@{settings.socialLinks.github?.split('/').pop() || "GitHub"}</p>
                    </div>
                </a>
            </motion.div>
        </div>
    );
}
