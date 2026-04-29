import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
    url: string;
    filename: string;
    uploadedAt: string;
}

interface MediaSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export function MediaSelectorModal({ isOpen, onClose, onSelect }: MediaSelectorModalProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
        }
    }, [isOpen]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/cms/media");
            if (res.ok) {
                const data = await res.json();
                setMedia(data.media || []);
            }
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/cms/upload", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                // Instead of just refreshing, we can immediately select it
                onSelect(data.url);
                onClose();
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-neutral-400" />
                            <h2 className="text-lg font-semibold text-white">Media Gallery</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="px-6 py-4 flex justify-between items-center bg-white/[0.02] border-b border-white/5">
                        <p className="text-sm text-neutral-400">Select an asset from your library</p>
                        <label className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg cursor-pointer hover:bg-neutral-200 transition-colors">
                            {uploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4" />
                            )}
                            {uploading ? "Uploading..." : "Upload New"}
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>

                    {/* Content Grid */}
                    <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-3 pt-12">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <p>Loading media...</p>
                            </div>
                        ) : media.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-3 pt-12">
                                <ImageIcon className="w-12 h-12 opacity-20" />
                                <p>No media found. Upload something!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {media.map((item) => (
                                    <div
                                        key={item.filename}
                                        onClick={() => {
                                            onSelect(item.url);
                                            onClose();
                                        }}
                                        className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-white/40 transition-colors"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                            <img
                                                src={item.url}
                                                alt={item.filename}
                                                className="max-h-full max-w-full object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] text-white truncate text-center">
                                                {item.filename}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
