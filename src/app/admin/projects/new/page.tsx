"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { adminPath } from "@/lib/admin-utils";
import { MediaSelectorModal } from "@/components/admin/MediaSelectorModal";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
    ssr: false,
    loading: () => (
        <div className="h-64 rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
    ),
});

// Helper for Cover Image Uploads
async function uploadFile(file: File): Promise<{ url: string; type: string } | null> {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const res = await fetch("/api/cms/upload", { method: "POST", body: formData });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export default function NewProjectPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("");
    const [content, setContent] = useState("");
    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        tags: [] as string[],
        categoryList: [] as string[],
        image: "",
        video: "",
        clientLogo: "",
        metrics: [] as { label: string; value: string }[],
        starred: false,
        status: "draft" as "draft" | "published",
    });

    const [isDraggingCover, setIsDraggingCover] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [isDraggingLogo, setIsDraggingLogo] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [activeMediaTarget, setActiveMediaTarget] = useState<"image" | "clientLogo" | null>(null);

    const handleSubmit = async () => {
        if (!form.title.trim()) return;
        setSaving(true);

        const res = await fetch("/api/cms/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, content }),
        });

        if (res.ok) {
            router.push(adminPath("/projects"));
        } else {
            setSaving(false);
            alert("Failed to create project");
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
            setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
    };

    const handleCoverDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingCover(false);

        const file = e.dataTransfer?.files?.[0];
        if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
            setUploadingCover(true);
            const res = await uploadFile(file);
            if (res) {
                setForm({ ...form, image: res.url });
            }
            setUploadingCover(false);
        }
    };

    const inputClass =
        "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all";

    return (
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8">
            <MediaSelectorModal 
                isOpen={isMediaModalOpen} 
                onClose={() => setIsMediaModalOpen(false)} 
                onSelect={(url) => {
                    if (activeMediaTarget) {
                        setForm({ ...form, [activeMediaTarget]: url });
                    }
                }} 
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 md:gap-0">
                <div className="flex flex-col items-start gap-1 md:gap-0">
                    <Link
                        href={adminPath("/projects")}
                        className="inline-flex items-center gap-1.5 text-xs md:text-sm text-neutral-500 hover:text-white transition-colors md:mb-4"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Projects
                    </Link>
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        New Project
                    </h1>
                </div>
                <div className="flex items-center justify-start md:justify-end gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.starred}
                                onChange={(e) =>
                                    setForm({ ...form, starred: e.target.checked })
                                }
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500/60" />
                        </label>
                        <span className="text-xs text-neutral-400">Starred</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !form.title.trim()}
                        className="px-5 border border-white/10 py-2 bg-white text-black text-xs md:text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                        {saving ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </div>

            {/* Cover Image Dropzone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingCover(true); }}
                onDragLeave={() => setIsDraggingCover(false)}
                onDrop={handleCoverDrop}
                className={`relative w-full aspect-[4/3] md:aspect-video md:h-auto md:max-h-[500px] rounded-3xl mb-8 overflow-hidden transition-all flex flex-col items-center justify-center cursor-pointer border-2 ${isDraggingCover ? "border-blue-500 bg-blue-500/10" : form.image ? "border-transparent" : "border-dashed border-white/20 hover:border-white/40 hover:bg-white/5"
                    }`}
            >
                {form.image ? (
                    <>
                        <img src={form.image} alt="Cover" className="absolute inset-0 w-full h-full object-cover z-0" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-20 gap-3">
                            <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md pointer-events-none">Change Cover Image</span>
                            <div className="flex gap-2">
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMediaTarget("image"); setIsMediaModalOpen(true); }} className="px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs rounded-lg transition-colors backdrop-blur-md border border-white/10">Media Library</button>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setForm({ ...form, image: "" }); }} className="px-3 py-1.5 bg-red-500/50 hover:bg-red-500/70 text-white text-xs rounded-lg transition-colors backdrop-blur-md border border-white/10">Remove</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-6 z-20 relative pointer-events-none">
                        <Plus className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
                        <p className="text-sm font-medium text-neutral-300">Add Cover Image</p>
                        <p className="text-xs text-neutral-500 mt-1 mb-4">Drag & drop or click to attach from computer</p>
                        <div className="flex items-center justify-center gap-2 pointer-events-auto">
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMediaTarget("image"); setIsMediaModalOpen(true); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors border border-white/10">Media Library</button>
                        </div>
                    </div>
                )}

                {/* Fallback hidden input for click-to-upload */}
                <input
                    type="file"
                    accept="image/*,video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setUploadingCover(true);
                            const res = await uploadFile(file);
                            if (res) setForm({ ...form, image: res.url });
                            setUploadingCover(false);
                        }
                    }}
                />

                {uploadingCover && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Title */}
            <textarea
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Project title..."
                className="w-full text-3xl md:text-4xl font-bold text-white bg-transparent border-none outline-none placeholder-neutral-700 mb-2 resize-none overflow-hidden min-h-[48px] md:min-h-[56px] break-words whitespace-pre-wrap flex-shrink-0"
                style={{ height: "auto" }}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                }}
            />
            {/* Description */}
            <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
                className="w-full text-base md:text-lg text-neutral-400 bg-transparent border-none outline-none placeholder-neutral-700 mb-6 resize-none overflow-hidden min-h-[48px] break-words whitespace-pre-wrap flex-shrink-0"
                style={{ height: "auto" }}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                }}
            />

            {/* Meta fields - collapsible */}
            <details className="mb-8 group">
                <summary className="text-xs text-neutral-500 uppercase tracking-wider font-medium cursor-pointer hover:text-neutral-400 transition-colors select-none">
                    Project Settings ▸
                </summary>
                <div className="mt-4 space-y-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                            Category (Separated by comma)
                        </label>
                        <div className="flex gap-2 mb-2 flex-wrap min-h-[32px]">
                            {form.categoryList.map((cat, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white text-xs border border-white/10"
                                >
                                    {cat}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newList = form.categoryList.filter((_, idx) => idx !== i);
                                            setForm({ ...form, categoryList: newList, category: newList.join(', ') });
                                        }}
                                        className="text-neutral-500 hover:text-red-400"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={categoryInput}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.endsWith(',')) {
                                    const newCat = val.slice(0, -1).trim();
                                    if (newCat && !form.categoryList.includes(newCat)) {
                                        const newList = [...form.categoryList, newCat];
                                        setForm({ ...form, categoryList: newList, category: newList.join(', ') });
                                        setCategoryInput("");
                                    }
                                } else {
                                    setCategoryInput(val);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    const newCat = categoryInput.trim();
                                    if (newCat && !form.categoryList.includes(newCat)) {
                                        const newList = [...form.categoryList, newCat];
                                        setForm({ ...form, categoryList: newList, category: newList.join(', ') });
                                        setCategoryInput("");
                                    }
                                }
                            }}
                            className={inputClass}
                            placeholder="e.g. Branding, Press Enter or Comma"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                            Client Logo (Hero Overlay)
                        </label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
                            onDragLeave={() => setIsDraggingLogo(false)}
                            onDrop={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDraggingLogo(false);
                                const file = e.dataTransfer?.files?.[0];
                                if (file && (file.type.startsWith("image/"))) {
                                    setUploadingLogo(true);
                                    const res = await uploadFile(file);
                                    if (res) setForm({ ...form, clientLogo: res.url });
                                    setUploadingLogo(false);
                                }
                            }}
                            className={`relative w-full h-24 rounded-xl mb-3 overflow-hidden transition-all flex flex-col items-center justify-center cursor-pointer border-2 ${isDraggingLogo ? "border-blue-500 bg-blue-500/10" : form.clientLogo ? "border-transparent bg-white/5" : "border-dashed border-white/20 hover:border-white/40 hover:bg-white/5"}`}
                        >
                            {form.clientLogo ? (
                                <>
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <img src={form.clientLogo} alt="Logo" className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-20 gap-2">
                                        <div className="flex gap-2">
                                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMediaTarget("clientLogo"); setIsMediaModalOpen(true); }} className="px-3 py-1 bg-black/50 hover:bg-black/70 text-white text-[10px] rounded transition-colors backdrop-blur-md border border-white/10">Media Library</button>
                                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setForm({ ...form, clientLogo: "" }); }} className="px-3 py-1 bg-red-500/50 hover:bg-red-500/70 text-white text-[10px] rounded transition-colors backdrop-blur-md border border-white/10">Remove</button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-2 z-20 relative pointer-events-none">
                                    <p className="text-xs font-medium text-neutral-300">Add Logo (SVG/PNG)</p>
                                    <p className="text-[10px] text-neutral-500 mt-0.5 mb-2">Drag & drop from computer</p>
                                    <div className="flex items-center justify-center gap-2 pointer-events-auto">
                                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMediaTarget("clientLogo"); setIsMediaModalOpen(true); }} className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] rounded transition-colors border border-white/10">Media Library</button>
                                    </div>
                                </div>
                            )}

                            {/* Fallback hidden input */}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setUploadingLogo(true);
                                        const res = await uploadFile(file);
                                        if (res) setForm({ ...form, clientLogo: res.url });
                                        setUploadingLogo(false);
                                    }
                                }}
                            />
                            {uploadingLogo && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                            Preview Video URL
                        </label>
                        <input
                            type="text"
                            value={form.video}
                            onChange={(e) => setForm({ ...form, video: e.target.value })}
                            className={inputClass}
                            placeholder="Video for hover preview"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                            Internal SEO Tags (Hidden on Frontend)
                        </label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                            {form.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white text-xs"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="text-neutral-500 hover:text-red-400"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            className={inputClass}
                            placeholder="Add strategic SEO tag, press Enter"
                        />
                    </div>
                </div>
            </details>

            {/* Divider */}
            <div className="border-t border-white/[0.06] mb-8" />

            {/* Editor */}
            <Editor content="" onChange={setContent} placeholder="Write your project story... Type '/' for commands" />
        </div>
    );
}
