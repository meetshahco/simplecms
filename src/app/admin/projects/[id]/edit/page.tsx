"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    FileText,
    Plus,
    Settings,
    Trash2,
    MoreHorizontal,
    Check,
    ChevronDown,
    Save,
    Eye,
    Layers,
    X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { adminPath } from "@/lib/admin-utils";

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

// ─── Types ──────────────────────────────────────
interface ProjectData {
    id: string;
    title: string;
    category: string;
    description: string;
    tags: string[];
    image: string;
    video: string;
    metrics: { label: string; value: string }[];
    starred: boolean;
    status: "draft" | "published";
    content?: string;
}

interface CaseStudyData {
    slug: string;
    title: string;
    description: string;
    coverImage: string;
    status: "draft" | "published";
    content?: string;
    parentProject: string;
    publishedAt: string;
}

type ActivePanel = "project" | string; // "project" or case-study slug

export default function ProjectWorkspace() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    // Project state
    const [project, setProject] = useState<ProjectData | null>(null);
    const [projectContent, setProjectContent] = useState("");

    // Case studies state
    const [caseStudies, setCaseStudies] = useState<CaseStudyData[]>([]);

    // Currently active panel
    const [activePanel, setActivePanel] = useState<ActivePanel>("project");

    // Active case study content (loaded on demand)
    const [activeCsContent, setActiveCsContent] = useState("");
    const [activeCsLoading, setActiveCsLoading] = useState(false);

    // ─── Load project + case studies ──────────────────
    useEffect(() => {
        Promise.all([
            fetch(`/api/cms/projects/${projectId}`).then((r) => r.json()),
            fetch(`/api/cms/case-studies?parentProject=${projectId}`).then((r) =>
                r.json()
            ),
        ])
            .then(([projectData, csData]) => {
                setProject(projectData);
                setProjectContent(projectData.content || "");
                setCaseStudies(csData);
                setLoading(false);
            })
            .catch(() => router.push(adminPath("/projects")));
    }, [projectId, router]);

    // ─── Load case study content when switching ──────
    const switchToCs = useCallback(
        async (slug: string) => {
            setActivePanel(slug);
            setActiveCsLoading(true);
            try {
                const res = await fetch(`/api/cms/case-studies?slug=${slug}`);
                const data = await res.json();
                setActiveCsContent(data.content || "");
                // Update local state
                setCaseStudies((prev) =>
                    prev.map((cs) =>
                        cs.slug === slug ? { ...cs, ...data, content: data.content } : cs
                    )
                );
            } catch {
                // fail silently
            }
            setActiveCsLoading(false);
        },
        []
    );

    // ─── Save handler ────────────────────────────────
    const handleSave = useCallback(async () => {
        if (!project) return;
        setSaving(true);

        if (activePanel === "project") {
            await fetch(`/api/cms/projects/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...project, content: projectContent }),
            });
        } else {
            const cs = caseStudies.find((c) => c.slug === activePanel);
            if (cs) {
                await fetch("/api/cms/case-studies", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        slug: cs.slug,
                        title: cs.title,
                        description: cs.description,
                        coverImage: cs.coverImage,
                        parentProject: projectId,
                        status: cs.status,
                        content: activeCsContent,
                    }),
                });
            }
        }

        setSaving(false);
    }, [project, projectId, projectContent, activePanel, caseStudies, activeCsContent]);

    // ─── Status toggle ───────────────────────────────
    const toggleStatus = useCallback(() => {
        if (activePanel === "project" && project) {
            setProject({
                ...project,
                status: project.status === "published" ? "draft" : "published",
            });
        } else {
            setCaseStudies((prev) =>
                prev.map((cs) =>
                    cs.slug === activePanel
                        ? {
                            ...cs,
                            status: cs.status === "published" ? "draft" : "published",
                        }
                        : cs
                )
            );
        }
    }, [activePanel, project]);

    // ─── Create new case study ────────────────────────
    const createCaseStudy = useCallback(async () => {
        const res = await fetch("/api/cms/case-studies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Untitled",
                description: "",
                coverImage: "",
                parentProject: projectId,
                publishedAt: new Date().toISOString(),
                status: "draft",
                content: "",
            }),
        });

        if (res.ok) {
            const newCs = await res.json();
            setCaseStudies((prev) => [...prev, newCs]);
            switchToCs(newCs.slug);
        }
    }, [projectId, switchToCs]);

    // ─── Archive case study ────────────────────────────
    const deleteCaseStudy = useCallback(
        async (slug: string) => {
            await fetch(`/api/cms/case-studies?slug=${slug}`, { method: "DELETE" });
            setCaseStudies((prev) => prev.filter((cs) => cs.slug !== slug));
            if (activePanel === slug) setActivePanel("project");
        },
        [activePanel]
    );

    // ─── Get current status ──────────────────────────
    const currentStatus =
        activePanel === "project"
            ? project?.status || "draft"
            : caseStudies.find((cs) => cs.slug === activePanel)?.status || "draft";

    const currentTitle =
        activePanel === "project"
            ? "Project Details"
            : caseStudies.find((cs) => cs.slug === activePanel)?.title || "";

    if (loading || !project) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* ─── Desktop Left Nav ──────────────────────── */}
            <div className="hidden md:flex w-52 flex-shrink-0 border-r border-white/[0.06] flex-col">
                {/* Back link */}
                <div className="px-3 pt-3 pb-2">
                    <Link
                        href={adminPath("/projects")}
                        className="inline-flex items-center gap-1.5 text-[10px] text-neutral-500 hover:text-white transition-colors uppercase tracking-wider font-medium"
                    >
                        <ArrowLeft className="w-2.5 h-2.5" />
                        Back
                    </Link>
                    <h2 className="text-sm font-semibold text-white mt-1.5 truncate">
                        {project.title || "Untitled Project"}
                    </h2>
                </div>

                {/* Divider */}
                <div className="mx-3 border-t border-white/[0.06]" />

                {/* Navigation items */}
                <nav className="flex-1 overflow-y-auto px-1.5 py-1.5 space-y-0.5">
                    {/* Project details — always first */}
                    <button
                        onClick={() => setActivePanel("project")}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all ${activePanel === "project"
                            ? "bg-white/[0.08] text-white"
                            : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-300"
                            }`}
                    >
                        <Layers className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate flex-1 font-medium">Project Details</span>
                        <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium flex-shrink-0 ${project?.status === "published"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-white/5 text-neutral-500"
                                }`}
                        >
                            {project?.status === "published" ? "Live" : "Draft"}
                        </span>
                    </button>

                    {/* Case studies — inherit draft from parent */}
                    {caseStudies.map((cs) => {
                        const effectiveStatus = project?.status === "draft" ? "draft" : cs.status;
                        return (
                            <div key={cs.slug} className="group relative">
                                <button
                                    onClick={() => switchToCs(cs.slug)}
                                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs transition-all pl-9 ${activePanel === cs.slug
                                        ? "bg-white/[0.08] text-white"
                                        : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-300"
                                        }`}
                                >
                                    <FileText className="w-3 h-3 flex-shrink-0 opacity-50" />
                                    <span className="truncate flex-1">{cs.title}</span>
                                    <span
                                        className={`text-[8px] px-1 py-0.5 rounded-full uppercase tracking-wider font-medium flex-shrink-0 ${effectiveStatus === "published"
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "bg-white/5 text-neutral-500"
                                            }`}
                                    >
                                        {effectiveStatus === "published" ? "Live" : "Draft"}
                                    </span>
                                </button>
                                {/* Delete on hover */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCaseStudy(cs.slug);
                                    }}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })}
                </nav>

                {/* Add case study CTA */}
                <div className="px-2 pb-3">
                    <button
                        onClick={createCaseStudy}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-white/10 text-neutral-500 text-sm hover:border-white/20 hover:text-neutral-300 transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Case Study
                    </button>
                </div>
            </div>

            {/* ─── Main Content ────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* ─── Unified Responsive Top Header ─── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 px-4 md:px-5 py-4 md:py-2.5 border-b border-white/[0.06] flex-shrink-0 bg-[#0a0a0a] md:bg-transparent">
                    {/* Mobile 1st Line: Back Button */}
                    <div className="md:hidden">
                        <Link
                            href={adminPath("/projects")}
                            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            All Projects
                        </Link>
                    </div>

                    {/* Desktop Left / Mobile 2nd Line: Title / Dropdown Nav */}
                    <div className="flex items-center w-full md:w-auto">
                        <span className="hidden md:inline text-sm text-neutral-400">{currentTitle}</span>

                        <div className="md:hidden flex flex-col w-full gap-2">
                            <div className="relative w-full">
                                <select
                                    value={activePanel}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "project") {
                                            setActivePanel("project");
                                        } else {
                                            switchToCs(val);
                                        }
                                    }}
                                    className="w-full appearance-none bg-white/[0.04] border border-white/10 text-white text-sm font-semibold rounded-xl px-4 py-2.5 outline-none focus:border-white/20 transition-colors"
                                >
                                    <option value="project" className="bg-[#111] text-white">Project Details ({project?.status === "published" ? "Live" : "Draft"})</option>
                                    {caseStudies.map((cs) => {
                                        const effectiveStatus = project?.status === "draft" ? "draft" : cs.status;
                                        return (
                                            <option key={cs.slug} value={cs.slug} className="bg-[#111] text-white">
                                                {cs.title} ({effectiveStatus === "published" ? "Live" : "Draft"})
                                            </option>
                                        );
                                    })}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                            </div>
                            <button
                                onClick={createCaseStudy}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-white/20 text-neutral-300 text-sm font-medium hover:border-white/40 hover:text-white transition-all bg-white/[0.02] w-full"
                            >
                                <Plus className="w-4 h-4" />
                                Create Case Study
                            </button>
                        </div>
                    </div>

                    {/* Desktop Right / Mobile 3rd Line: Action Area */}
                    <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto border-t border-white/10 md:border-0 pt-3 md:pt-0 mt-2 md:mt-0">
                        {/* Status toggle */}
                        <button
                            onClick={toggleStatus}
                            className={`flex flex-1 md:flex-none justify-center items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-lg text-xs font-medium transition-all ${currentStatus === "published"
                                ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                                }`}
                        >
                            <div
                                className={`w-1.5 h-1.5 rounded-full ${currentStatus === "published"
                                    ? "bg-emerald-400"
                                    : "bg-amber-400"
                                    }`}
                            />
                            {currentStatus === "published" ? "Published" : "Draft"}
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex flex-1 md:flex-none justify-center items-center gap-1.5 px-4 py-2 md:py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    Saving
                                </>
                            ) : (
                                <>
                                    <Save className="w-3 h-3" />
                                    Save
                                </>
                            )}
                        </button>

                        {/* More menu */}
                        <div className="relative flex-none">
                            <button
                                onClick={() => setShowMoreMenu(!showMoreMenu)}
                                className="flex justify-center items-center p-2 md:p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 w-full md:w-auto h-full"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {showMoreMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowMoreMenu(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl py-1">
                                        <button
                                            onClick={() => {
                                                window.open(`/work/${projectId}`, "_blank");
                                                setShowMoreMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Preview Live
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("Delete this entire project and all its case studies?")) {
                                                    fetch(`/api/cms/projects/${projectId}`, {
                                                        method: "DELETE",
                                                    }).then(() => router.push(adminPath("/projects")));
                                                }
                                                setShowMoreMenu(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete Project
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 md:py-6 w-full">
                    {activePanel === "project" ? (
                        <ProjectEditor
                            project={project}
                            content={projectContent}
                            onProjectChange={setProject}
                            onContentChange={setProjectContent}
                        />
                    ) : activeCsLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        <CaseStudyEditor
                            caseStudy={
                                caseStudies.find((cs) => cs.slug === activePanel) || null
                            }
                            content={activeCsContent}
                            onCaseStudyChange={(updates) => {
                                setCaseStudies((prev) =>
                                    prev.map((cs) =>
                                        cs.slug === activePanel ? { ...cs, ...updates } : cs
                                    )
                                );
                            }}
                            onContentChange={setActiveCsContent}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Project Editor Panel ───────────────────────────
function ProjectEditor({
    project,
    content,
    onProjectChange,
    onContentChange,
}: {
    project: ProjectData;
    content: string;
    onProjectChange: (p: ProjectData) => void;
    onContentChange: (c: string) => void;
}) {
    const [tagInput, setTagInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("");
    const [isDraggingCover, setIsDraggingCover] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [project.title]);

    useEffect(() => {
        if (descRef.current) {
            descRef.current.style.height = 'auto';
            descRef.current.style.height = descRef.current.scrollHeight + 'px';
        }
    }, [project.description]);

    const update = (fields: Partial<ProjectData>) =>
        onProjectChange({ ...project, ...fields });

    const addTag = () => {
        if (tagInput.trim() && !project.tags.includes(tagInput.trim())) {
            update({ tags: [...project.tags, tagInput.trim()] });
            setTagInput("");
        }
    };

    const inputClass =
        "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all";

    return (
        <div>
            {/* Cover Image Dropzone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingCover(true); }}
                onDragLeave={() => setIsDraggingCover(false)}
                onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingCover(false);
                    const file = e.dataTransfer?.files?.[0];
                    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
                        setUploadingCover(true);
                        const res = await uploadFile(file);
                        if (res) update({ image: res.url });
                        setUploadingCover(false);
                    }
                }}
                className={`relative w-full aspect-[4/3] md:aspect-video md:h-auto md:max-h-[500px] rounded-3xl mb-8 overflow-hidden transition-all flex flex-col items-center justify-center cursor-pointer border-2 ${isDraggingCover ? "border-blue-500 bg-blue-500/10" : project.image ? "border-transparent" : "border-dashed border-white/20 hover:border-white/40 hover:bg-white/5"
                    }`}
            >
                {project.image ? (
                    <>
                        <img src={project.image} alt="Cover" className="absolute inset-0 w-full h-full object-cover z-0" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-20 gap-3">
                            <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md pointer-events-none">Change Cover Image</span>
                            <div className="flex gap-2">
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const url = prompt("Paste external image URL:"); if (url) update({ image: url }); }} className="px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs rounded-lg transition-colors backdrop-blur-md border border-white/10">Paste Link</button>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("/admin/media", "_blank"); }} className="px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs rounded-lg transition-colors backdrop-blur-md border border-white/10">Media Library</button>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); update({ image: "" }); }} className="px-3 py-1.5 bg-red-500/50 hover:bg-red-500/70 text-white text-xs rounded-lg transition-colors backdrop-blur-md border border-white/10">Remove</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-6 z-20 relative pointer-events-none">
                        <Plus className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
                        <p className="text-sm font-medium text-neutral-300">Add Cover Image</p>
                        <p className="text-xs text-neutral-500 mt-1 mb-4">Drag & drop or click to attach from computer</p>
                        <div className="flex items-center justify-center gap-2 pointer-events-auto">
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const url = prompt("Paste external image URL:"); if (url) update({ image: url }); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors border border-white/10">Paste Link</button>
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("/admin/media", "_blank"); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors border border-white/10">Media Library</button>
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
                            if (res) update({ image: res.url });
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

            <textarea
                ref={titleRef}
                value={project.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Project title..."
                className="w-full text-3xl md:text-4xl font-bold text-white bg-transparent border-none outline-none placeholder-neutral-700 mb-2 resize-none overflow-hidden min-h-[48px] md:min-h-[56px] break-words whitespace-pre-wrap flex-shrink-0"
                style={{ height: "auto" }}
            />
            <textarea
                ref={descRef}
                value={project.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Brief description..."
                className="w-full text-base md:text-lg text-neutral-400 bg-transparent border-none outline-none placeholder-neutral-700 mb-6 resize-none overflow-hidden min-h-[48px] break-words whitespace-pre-wrap flex-shrink-0"
                style={{ height: "auto" }}
            />

            <details className="mb-8">
                <summary className="text-xs text-neutral-500 uppercase tracking-wider font-medium cursor-pointer hover:text-neutral-400 transition-colors select-none">
                    Project Settings ▸
                </summary>
                <div className="mt-4 space-y-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="w-full">
                        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                            Category (Separated by comma)
                        </label>
                        <div className="flex gap-2 mb-3 flex-wrap min-h-[32px]">
                            {(project.category?.split(',') || []).map(c => c.trim()).filter(Boolean).map((cat, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white text-xs border border-white/10"
                                >
                                    {cat}
                                    <button
                                        onClick={() => {
                                            const cats = (project.category?.split(',') || []).map(c => c.trim()).filter(Boolean);
                                            const newCats = cats.filter((_, idx) => idx !== i);
                                            update({ category: newCats.join(', ') });
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
                                    if (newCat) {
                                        const cats = project.category ? project.category.split(',').map(c => c.trim()).filter(Boolean) : [];
                                        if (!cats.includes(newCat)) {
                                            update({ category: [...cats, newCat].join(', ') });
                                        }
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
                                    if (newCat) {
                                        const cats = project.category ? project.category.split(',').map(c => c.trim()).filter(Boolean) : [];
                                        if (!cats.includes(newCat)) {
                                            update({ category: [...cats, newCat].join(', ') });
                                        }
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
                            Preview Video
                        </label>
                        <input
                            type="text"
                            value={project.video}
                            onChange={(e) => update({ video: e.target.value })}
                            className={inputClass}
                            placeholder="Video for card hover"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                            Internal SEO Tags (Hidden on Frontend)
                        </label>
                        <div className="flex gap-2 flex-wrap mb-2">
                            {(project.tags || []).map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white text-xs border border-white/10"
                                >
                                    {tag}
                                    <button
                                        onClick={() =>
                                            update({ tags: (project.tags || []).filter((t) => t !== tag) })
                                        }
                                        className="text-neutral-500 hover:text-red-400"
                                    >
                                        ×
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
                            placeholder="Add tag, press Enter"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={project.starred}
                                onChange={(e) => update({ starred: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500/60" />
                        </label>
                        <span className="text-xs text-neutral-400">
                            Featured on homepage
                        </span>
                    </div>
                </div>
            </details>

            <div className="border-t border-white/[0.06] mb-8" />

            <Editor
                content={content}
                onChange={onContentChange}
                placeholder="Write your project story... Type '/' for commands"
            />
        </div>
    );
}

// ─── Case Study Editor Panel ────────────────────────
function CaseStudyEditor({
    caseStudy,
    content,
    onCaseStudyChange,
    onContentChange,
}: {
    caseStudy: CaseStudyData | null;
    content: string;
    onCaseStudyChange: (updates: Partial<CaseStudyData>) => void;
    onContentChange: (c: string) => void;
}) {
    const [isDraggingCover, setIsDraggingCover] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    const titleRef = useRef<HTMLTextAreaElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
        }
    }, [caseStudy?.title]);

    useEffect(() => {
        if (descRef.current) {
            descRef.current.style.height = 'auto';
            descRef.current.style.height = descRef.current.scrollHeight + 'px';
        }
    }, [caseStudy?.description]);

    if (!caseStudy) return null;

    const inputClass =
        "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all";

    return (
        <div>
            {/* Cover Image Dropzone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDraggingCover(true); }}
                onDragLeave={() => setIsDraggingCover(false)}
                onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingCover(false);
                    const file = e.dataTransfer?.files?.[0];
                    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
                        setUploadingCover(true);
                        const res = await uploadFile(file);
                        if (res) onCaseStudyChange({ coverImage: res.url });
                        setUploadingCover(false);
                    }
                }}
                className={`relative w-full aspect-[4/3] md:aspect-video md:h-auto md:max-h-[500px] rounded-3xl mb-8 overflow-hidden transition-all flex flex-col items-center justify-center cursor-pointer border-2 ${isDraggingCover ? "border-blue-500 bg-blue-500/10" : caseStudy.coverImage ? "border-transparent" : "border-dashed border-white/20 hover:border-white/40 hover:bg-white/5"
                    }`}
            >
                {caseStudy.coverImage ? (
                    <>
                        <img src={caseStudy.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover z-0" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-20 gap-3">
                            <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-md pointer-events-none">Change Cover Image</span>
                            <div className="flex gap-2">
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const url = prompt("Paste external image URL:"); if (url) onCaseStudyChange({ coverImage: url }); }} className="px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs rounded-lg transition-colors backdrop-blur-md border border-white/10">Paste Link</button>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("/admin/media", "_blank"); }} className="px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs rounded-lg transition-colors backdrop-blur-md border border-white/10">Media Library</button>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCaseStudyChange({ coverImage: "" }); }} className="px-3 py-1.5 bg-red-500/50 hover:bg-red-500/70 text-white text-xs rounded-lg transition-colors backdrop-blur-md border border-white/10">Remove</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-6 z-20 relative pointer-events-none">
                        <Plus className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
                        <p className="text-sm font-medium text-neutral-300">Add Cover Image</p>
                        <p className="text-xs text-neutral-500 mt-1 mb-4">Drag & drop or click to attach from computer</p>
                        <div className="flex items-center justify-center gap-2 pointer-events-auto">
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); const url = prompt("Paste external image URL:"); if (url) onCaseStudyChange({ coverImage: url }); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors border border-white/10">Paste Link</button>
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("/admin/media", "_blank"); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors border border-white/10">Media Library</button>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*,video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setUploadingCover(true);
                            const res = await uploadFile(file);
                            if (res) onCaseStudyChange({ coverImage: res.url });
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

            <textarea
                ref={titleRef}
                value={caseStudy.title}
                onChange={(e) => onCaseStudyChange({ title: e.target.value })}
                placeholder="Case study title..."
                className="w-full text-3xl md:text-4xl font-bold text-white bg-transparent border-none outline-none placeholder-neutral-700 mb-2 resize-none overflow-hidden min-h-[48px] md:min-h-[56px] break-words whitespace-pre-wrap flex-shrink-0"
                style={{ height: "auto" }}
            />
            <textarea
                ref={descRef}
                value={caseStudy.description}
                onChange={(e) => onCaseStudyChange({ description: e.target.value })}
                placeholder="Brief description..."
                className="w-full text-base md:text-lg text-neutral-400 bg-transparent border-none outline-none placeholder-neutral-700 mb-6 resize-none overflow-hidden min-h-[48px] break-words whitespace-pre-wrap flex-shrink-0"
                style={{ height: "auto" }}
            />



            <div className="border-t border-white/[0.06] mb-8" />

            <Editor
                content={content}
                onChange={onContentChange}
                placeholder="Write your case study... Type '/' for commands"
            />
        </div>
    );
}
