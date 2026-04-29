"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Grid, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";

const categories = [
    "All Media",
    "Photos",
    "Videos",
    "SVGs",
    "GIF",
    "Audio",
];

interface MediaItem {
    url: string;
    filename: string;
    uploadedAt: string;
}

export default function MediaPage() {
    const [activeCategory, setActiveCategory] = useState("All Media");
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

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
                await fetchMedia();
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Very simple filter based on extension just for basic UX
    const filteredMedia = media.filter(item => {
        if (activeCategory === "All Media") return true;
        const ext = item.filename.split('.').pop()?.toLowerCase();
        if (activeCategory === "SVGs") return ext === 'svg';
        if (activeCategory === "GIF") return ext === 'gif';
        if (activeCategory === "Photos") return ['png', 'jpg', 'jpeg', 'webp'].includes(ext || '');
        if (activeCategory === "Videos") return ['mp4', 'webm', 'mov'].includes(ext || '');
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Media</h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage and organize your portfolio assets.</p>
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-neutral-200 transition-colors cursor-pointer">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {uploading ? "Uploading..." : "Upload"}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Horizontal Navigation */}
            <div className="flex items-center justify-between border-b border-white/[0.06]">
                <div className="flex items-center gap-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`pb-4 text-sm font-medium transition-all relative ${activeCategory === category
                                    ? "text-white"
                                    : "text-neutral-500 hover:text-neutral-300"
                                }`}
                        >
                            {category}
                            {activeCategory === category && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 pb-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all w-48"
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center text-neutral-500 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p>Loading media...</p>
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="min-h-[400px] rounded-2xl border border-dashed border-white/[0.06] flex flex-col items-center justify-center text-center p-12">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                        <Grid className="w-8 h-8 text-neutral-600" />
                    </div>
                    <h3 className="text-lg font-medium text-white">No {activeCategory.toLowerCase()} found</h3>
                    <p className="text-sm text-neutral-500 mt-1 max-w-xs">
                        Start by uploading your first asset or use the "Upload" button to add new content.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {filteredMedia.map((item) => (
                        <div key={item.filename} className="group flex flex-col gap-2">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-4">
                                <img 
                                    src={item.url} 
                                    alt={item.filename} 
                                    className="max-w-full max-h-full object-contain"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.origin + item.url);
                                            alert("URL copied to clipboard!");
                                        }}
                                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white text-xs font-medium transition-colors"
                                    >
                                        Copy URL
                                    </button>
                                </div>
                            </div>
                            <div className="px-1">
                                <p className="text-xs text-white truncate font-medium">{item.filename}</p>
                                <p className="text-[10px] text-neutral-500 mt-0.5">
                                    {new Date(item.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
