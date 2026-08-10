"use client";
import { useState } from "react";
import { Mail, Linkedin, Send, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactClient({ settings }: { settings: any }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        // Simulate API message post (since this is frontend only for now)
        setTimeout(() => {
            setStatus("sent");
            setName("");
            setEmail("");
            setMessage("");
        }, 1500);
    };

    return (
        <div className="w-full max-w-5xl relative z-10 flex flex-col lg:flex-row gap-16 items-stretch mt-12 md:mt-24">
            
            {/* Left: Contact Info */}
            <div className="flex-1 flex flex-col justify-between space-y-12">
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] w-fit"
                    >
                        <Star className="w-3.5 h-3.5" />
                        Get in Touch
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.1] text-white"
                    >
                        Let's design <br className="hidden sm:inline" />
                        the next big thing.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-md"
                    >
                        Have a project in mind, want to collaborate, or just want to chat about design & technology? Drop a message here or connect via socials.
                    </motion.p>
                </div>

                {/* Direct Channels */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {/* Email Card */}
                    <a
                        href={`mailto:${settings?.adminEmail || "hey@meetshah.co"}`}
                        className="group p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 flex items-center gap-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Email Me</p>
                            <p className="text-xs text-white font-medium mt-0.5 truncate max-w-[150px]">{settings?.adminEmail || "hey@meetshah.co"}</p>
                        </div>
                    </a>

                    {/* LinkedIn Card */}
                    {settings?.socialLinks?.linkedin && (
                        <a
                            href={settings.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300 flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] group-hover:scale-110 transition-transform">
                                <Linkedin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">LinkedIn</p>
                                <p className="text-xs text-white font-medium mt-0.5 truncate max-w-[150px]">Connect on LinkedIn</p>
                            </div>
                        </a>
                    )}
                </motion.div>
            </div>

            {/* Right: Message Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 rounded-[2rem] border border-white/5 bg-white/[0.01] p-8 sm:p-10 flex flex-col justify-center relative overflow-hidden"
            >
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest" htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                            placeholder="Alex Mercer"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest" htmlFor="email">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                            placeholder="alex@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest" htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                            placeholder="Tell me about your idea..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "sending" || status === "sent"}
                        className="w-full group flex items-center justify-center gap-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest py-4 transition-all duration-300 hover:bg-neutral-200 hover:scale-102 disabled:bg-neutral-800 disabled:text-neutral-500"
                    >
                        {status === "idle" && (
                            <>
                                Send Message
                                <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </>
                        )}
                        {status === "sending" && "Sending Message..."}
                        {status === "sent" && "Message Sent!"}
                    </button>

                    <AnimatePresence>
                        {status === "sent" && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center text-xs text-green-400 font-medium"
                            >
                                Thank you! I will get back to you shortly.
                            </motion.p>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>

        </div>
    );
}
