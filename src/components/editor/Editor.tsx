"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Figure } from "./extensions/Figure";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import Gapcursor from "@tiptap/extension-gapcursor";
import Dropcursor from "@tiptap/extension-dropcursor";
import { MetricsBlock } from "./extensions/Metrics";
import { MockupsBlock } from "./extensions/Mockups";
import { Iframe } from "./extensions/Iframe";
import { Slides } from "./extensions/Slides";
import { useState, useCallback, useRef } from "react";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    ImageIcon,
    Link as LinkIcon,
    Youtube as YoutubeIcon,
    Highlighter,
    Minus,
    Type,
    MessageSquareQuote,
    Video,
    FileCode,
    Figma,
    Upload,
    Activity,
    X,
    MonitorCheck,
    Presentation,
} from "lucide-react";

interface EditorProps {
    content?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
}

const slashItems = [
    { label: "Text", description: "Plain text block", icon: Type, command: "paragraph" },
    { label: "Heading 1", description: "Large section heading", icon: Heading1, command: "h1" },
    { label: "Heading 2", description: "Medium section heading", icon: Heading2, command: "h2" },
    { label: "Heading 3", description: "Small section heading", icon: Heading3, command: "h3" },
    { label: "Bullet List", description: "Unordered list", icon: List, command: "bulletList" },
    { label: "Numbered List", description: "Ordered list", icon: ListOrdered, command: "orderedList" },
    { label: "Quote", description: "Blockquote", icon: MessageSquareQuote, command: "blockquote" },
    { label: "Divider", description: "Horizontal rule", icon: Minus, command: "hr" },
    { label: "Code Block", description: "Code snippet", icon: FileCode, command: "codeBlock" },
    { label: "Metrics Grid", description: "Add key stats", icon: Activity, command: "metricsBlock" },
    { label: "Mockups", description: "Device frames & carousels", icon: MonitorCheck, command: "mockupsBlock" },
    { label: "Image / GIF", description: "Upload or drag an image", icon: ImageIcon, command: "image" },
    { label: "Video", description: "Upload a video file", icon: Upload, command: "videoUpload" },
    { label: "YouTube", description: "Embed a YouTube video", icon: YoutubeIcon, command: "youtube" },
    { label: "Loom", description: "Embed a Loom video", icon: Video, command: "loom" },
    { label: "Figma", description: "Embed a Figma file", icon: Figma, command: "figma" },
    { label: "Slides", description: "Attach PDF or PPT presentation", icon: Presentation, command: "slides" },
];

// ─── Upload helper ──────────────────────────────────────────
async function uploadFile(file: File): Promise<{ url: string; type: string; filename?: string; size?: number } | null> {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("/api/cms/upload", { method: "POST", body: formData });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Upload failed");
        }
        return await res.json();
    } catch (e: any) {
        throw new Error(e.message || "Upload failed");
    }
}

export default function Editor({
    content = "",
    onChange,
    placeholder = "Start writing... Type '/' for commands",
}: EditorProps) {
    const [showSlash, setShowSlash] = useState(false);
    const [slashFilter, setSlashFilter] = useState("");
    const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
    const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const slashRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadTypeRef = useRef<"image" | "video" | "document">("image");
    const editorWrapperRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Placeholder.configure({ placeholder }),
            Figure,
            Link.configure({ openOnClick: false, autolink: true }),
            Youtube.configure({ width: 640, height: 360 }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Highlight.configure({ multicolor: true }),
            Gapcursor,
            Dropcursor.configure({ color: "#60a5fa", width: 2 }),
            MetricsBlock,
            MockupsBlock,
            Iframe,
            Slides,
        ],
        content,
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] px-0",
            },
            handleKeyDown: (_view, event) => {
                if (showSlash) {
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setSelectedSlashIndex((prev) =>
                            Math.min(prev + 1, filteredSlashItems.length - 1)
                        );
                        return true;
                    }
                    if (event.key === "ArrowUp") {
                        event.preventDefault();
                        setSelectedSlashIndex((prev) => Math.max(prev - 1, 0));
                        return true;
                    }
                    if (event.key === "Enter") {
                        event.preventDefault();
                        executeSlashCommand(filteredSlashItems[selectedSlashIndex]?.command);
                        return true;
                    }
                    if (event.key === "Escape") {
                        event.preventDefault();
                        setShowSlash(false);
                        return true;
                    }
                }
                return false;
            },
            // Handle paste of images
            handlePaste: (_view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;

                for (const item of Array.from(items)) {
                    if (item.type.startsWith("image/")) {
                        event.preventDefault();
                        const file = item.getAsFile();
                        if (file) handleFileUpload(file);
                        return true;
                    }
                }
                return false;
            },
            // Handle drop of files
            handleDrop: (_view, event) => {
                const files = event.dataTransfer?.files;
                if (!files || files.length === 0) return false;

                const file = files[0];
                if (
                    file.type.startsWith("image/") ||
                    file.type.startsWith("video/") ||
                    file.type.includes("pdf") ||
                    file.type.includes("presentation") ||
                    file.type.includes("powerpoint") ||
                    file.name.endsWith(".pdf") || 
                    file.name.endsWith(".ppt") || 
                    file.name.endsWith(".pptx")
                ) {
                    event.preventDefault();
                    handleFileUpload(file);
                    return true;
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());

            const { from } = editor.state.selection;
            const textBefore = editor.state.doc.textBetween(
                Math.max(0, from - 20),
                from,
                "\n"
            );
            const slashMatch = textBefore.match(/\/([a-zA-Z0-9]*)$/);

            if (slashMatch) {
                setSlashFilter(slashMatch[1]);
                setSelectedSlashIndex(0);
                setShowSlash(true);
                const coords = editor.view.coordsAtPos(from);
                const editorRect = editor.view.dom.getBoundingClientRect();
                setSlashPos({
                    top: coords.bottom - editorRect.top + 8,
                    left: coords.left - editorRect.left,
                });
            } else {
                setShowSlash(false);
            }
        },
    });

    // ─── File upload handler ────────────────────────────────
    const handleFileUpload = useCallback(
        async (file: File) => {
            if (!editor) return;
            setUploading(true);
            setUploadError(null);

            try {
                const result = await uploadFile(file);
                if (result) {
                    if (result.type === "video") {
                        editor
                            .chain()
                            .focus()
                            .insertContent(
                                `<div data-type="video-embed" class="video-embed"><video src="${result.url}" controls style="width:100%;border-radius:12px;"></video></div>`
                            )
                            .run();
                    } else if (result.type === "document") {
                        editor
                            .chain()
                            .focus()
                            .insertContent({
                                type: "slidesBlock",
                                attrs: {
                                    url: result.url,
                                    filename: result.filename,
                                    type: result.url.toLowerCase().endsWith(".pdf") ? "pdf" : "ppt",
                                    layout: "full",
                                },
                            })
                            .run();
                    } else {
                        editor.chain().focus().insertContent({
                            type: 'figure',
                            attrs: { src: result.url }
                        }).run();
                    }
                }
            } catch (err: any) {
                setUploadError(err.message || "Upload failed");
            } finally {
                setUploading(false);
            }
        },
        [editor]
    );

    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
            e.target.value = "";
        },
        [handleFileUpload]
    );

    const openFilePicker = useCallback(
        (type: "image" | "video" | "document") => {
            uploadTypeRef.current = type;
            if (fileInputRef.current) {
                if (type === "image") {
                    fileInputRef.current.accept = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";
                } else if (type === "video") {
                    fileInputRef.current.accept = "video/mp4,video/webm,video/quicktime";
                } else {
                    fileInputRef.current.accept = ".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
                }
                fileInputRef.current.click();
            }
        },
        []
    );

    const filteredSlashItems = slashItems.filter(
        (item) =>
            item.label.toLowerCase().includes(slashFilter.toLowerCase()) ||
            item.command.toLowerCase().includes(slashFilter.toLowerCase())
    );

    const executeSlashCommand = useCallback(
        (command: string) => {
            if (!editor) return;

            // Delete the slash and filter text
            const { from } = editor.state.selection;
            const textBefore = editor.state.doc.textBetween(
                Math.max(0, from - 20),
                from,
                "\n"
            );
            const slashMatch = textBefore.match(/\/([a-zA-Z0-9]*)$/);
            if (slashMatch) {
                editor
                    .chain()
                    .focus()
                    .deleteRange({ from: from - slashMatch[0].length, to: from })
                    .run();
            }

            switch (command) {
                case "paragraph":
                    editor.chain().focus().setParagraph().run();
                    break;
                case "h1":
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                    break;
                case "h2":
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                    break;
                case "h3":
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                    break;
                case "bulletList":
                    editor.chain().focus().toggleBulletList().run();
                    break;
                case "orderedList":
                    editor.chain().focus().toggleOrderedList().run();
                    break;
                case "blockquote":
                    editor.chain().focus().toggleBlockquote().run();
                    break;
                case "hr":
                    editor.chain().focus().setHorizontalRule().run();
                    break;
                case "codeBlock":
                    editor.chain().focus().toggleCodeBlock().run();
                    break;
                case "metricsBlock":
                    editor.chain().focus().insertContent('<div data-type="metrics-block"></div>').run();
                    break;
                case "mockupsBlock":
                    editor.chain().focus().insertContent('<div data-type="mockups-block"></div>').run();
                    break;
                case "image":
                    openFilePicker("image");
                    break;
                case "videoUpload":
                    openFilePicker("video");
                    break;
                case "slides":
                    openFilePicker("document");
                    break;
                case "youtube": {
                    const youtubeUrl = prompt("Enter YouTube URL:");
                    if (youtubeUrl)
                        editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
                    break;
                }
                case "loom": {
                    const loomUrl = prompt("Enter Loom video URL:");
                    if (loomUrl) {
                        const embedUrl = loomUrl.replace("loom.com/share/", "loom.com/embed/");
                        editor
                            .chain()
                            .focus()
                            .insertContent(
                                `<div data-type="loom-embed" class="loom-embed"><iframe src="${embedUrl}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:12px;"></iframe></div>`
                            )
                            .run();
                    }
                    break;
                }
                case "figma": {
                    const figmaUrl = prompt("Enter Figma file URL:");
                    if (figmaUrl) {
                        const embedUrl = `https://www.figma.com/embed?embed_host=portfolio&url=${encodeURIComponent(figmaUrl)}`;
                        editor
                            .chain()
                            .focus()
                            .insertContent(
                                `<div data-type="figma-embed" class="figma-embed"><iframe src="${embedUrl}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:12px;"></iframe></div>`
                            )
                            .run();
                    }
                    break;
                }
            }
            setShowSlash(false);
        },
        [editor, openFilePicker]
    );

    // ─── Drag & Drop zone handlers ────────────────────────────
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Only set false if leaving the wrapper entirely
        const rect = editorWrapperRef.current?.getBoundingClientRect();
        if (rect) {
            const { clientX, clientY } = e;
            if (
                clientX < rect.left ||
                clientX > rect.right ||
                clientY < rect.top ||
                clientY > rect.bottom
            ) {
                setIsDragging(false);
            }
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = e.dataTransfer?.files;
            if (!files || files.length === 0) return;

            const file = files[0];
            if (
                file.type.startsWith("image/") ||
                file.type.startsWith("video/") ||
                file.type.includes("pdf") ||
                file.type.includes("presentation") ||
                file.type.includes("powerpoint") ||
                file.name.endsWith(".pdf") || 
                file.name.endsWith(".ppt") || 
                file.name.endsWith(".pptx")
            ) {
                handleFileUpload(file);
            } else {
                alert("Unsupported file type. Please drop an image, GIF, video, PDF, or PowerPoint presentation.");
            }
        },
        [handleFileUpload]
    );

    if (!editor) return null;

    return (
        <div
            ref={editorWrapperRef}
            className="relative w-full"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
            />

            {/* Upload progress overlay (Isolated from Tiptap DOM) */}
            {uploading && (
                <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="text-sm text-white font-medium">Uploading...</span>
                    </div>
                </div>
            )}

            {/* Upload error overlay (Isolated from Tiptap DOM) */}
            {uploadError && (
                <div className="absolute bottom-4 right-4 z-50 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200">
                    <span className="text-sm font-medium">{uploadError}</span>
                    <button onClick={() => setUploadError(null)} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Drag overlay (Isolated from Tiptap DOM) */}
            {isDragging && (
                <div className="absolute inset-0 z-40 rounded-xl border-2 border-dashed border-blue-400/50 bg-blue-500/5 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-blue-400" />
                        <span className="text-sm text-blue-400 font-medium">
                            Drop image, GIF, or document to upload
                        </span>
                    </div>
                </div>
            )}

            {/* Tiptap Editor Content rendered in strict isolation */}
            <div 
                className="prose-wrapper min-h-[400px] cursor-text"
                onClick={() => {
                    // If clicking the empty space in the wrapper, focus the editor
                    if (editor && !editor.isFocused) {
                        editor.chain().focus().run();
                    }
                }}
            >
                <EditorContent editor={editor} />
            </div>

            {/* Bubble menu */}
            {editor && (
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 150 }}
                    className="flex items-center gap-0.5 rounded-xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 p-1.5 shadow-2xl"
                >
                    <ToolbarButton
                        active={editor.isActive("bold")}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        title="Bold"
                    >
                        <Bold className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton
                        active={editor.isActive("italic")}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        title="Italic"
                    >
                        <Italic className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton
                        active={editor.isActive("underline")}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        title="Underline"
                    >
                        <UnderlineIcon className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton
                        active={editor.isActive("strike")}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        title="Strikethrough"
                    >
                        <Strikethrough className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton
                        active={editor.isActive("code")}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        title="Inline Code"
                    >
                        <Code className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <ToolbarButton
                        active={editor.isActive("highlight")}
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        title="Highlight"
                    >
                        <Highlighter className="w-3.5 h-3.5" />
                    </ToolbarButton>
                    <div className="w-px h-5 bg-white/10 mx-0.5" />
                    <ToolbarButton
                        active={editor.isActive("link")}
                        onClick={() => {
                            const url = prompt("Enter URL:");
                            if (url) editor.chain().focus().setLink({ href: url }).run();
                        }}
                        title="Link"
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                    </ToolbarButton>
                </BubbleMenu>
            )}

            {/* Slash command menu */}
            {showSlash && filteredSlashItems.length > 0 && (
                <div
                    ref={slashRef}
                    className="absolute z-50 w-72 max-h-80 overflow-y-auto rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 shadow-2xl py-2 scrollbar-thin scrollbar-thumb-white/10"
                    style={{ top: slashPos.top, left: slashPos.left }}
                >
                    <div className="px-4 pb-2 mb-2 border-b border-white/5 text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                        Basic Blocks
                    </div>
                    {filteredSlashItems.map((item, i) => (
                        <button
                            key={item.command}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === selectedSlashIndex
                                ? "bg-white/10 text-white"
                                : "text-neutral-400 hover:bg-white/5 hover:text-white"
                                }`}
                            onClick={() => executeSlashCommand(item.command)}
                            onMouseEnter={() => setSelectedSlashIndex(i)}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${i === selectedSlashIndex ? "bg-white/10 text-white" : "bg-white/5 text-neutral-400"}`}>
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div>
                                <div className={`font-medium text-sm ${i === selectedSlashIndex ? "text-white" : "text-neutral-200"}`}>{item.label}</div>
                                <div className={`text-[11px] ${i === selectedSlashIndex ? "text-neutral-300" : "text-neutral-500"}`}>
                                    {item.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Editor styles */}
            <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #525252;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror { caret-color: white; }
        .ProseMirror:focus { outline: none; }
        .ProseMirror h1 { font-size: 2rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.5rem; line-height: 1.2; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; line-height: 1.3; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; line-height: 1.4; }
        .ProseMirror p { margin-bottom: 0.75rem; line-height: 1.7; color: #d4d4d4; }
        .ProseMirror ul { padding-left: 1.5rem; margin-bottom: 0.75rem; list-style-type: disc; }
        .ProseMirror ol { padding-left: 1.5rem; margin-bottom: 0.75rem; list-style-type: decimal; }
        .ProseMirror li { margin-bottom: 0.25rem; color: #d4d4d4; }
        .ProseMirror ul ul, .ProseMirror ol ul { list-style-type: circle; margin-bottom: 0; }
        .ProseMirror ol ol, .ProseMirror ul ol { list-style-type: lower-alpha; margin-bottom: 0; }
        .ProseMirror blockquote { border-left: 3px solid #404040; padding-left: 1rem; margin: 1rem 0; color: #a3a3a3; font-style: italic; }
        .ProseMirror code { background: rgba(255,255,255,0.1); border-radius: 4px; padding: 2px 6px; font-size: 0.875em; color: #f0abfc; }
        .ProseMirror pre { background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1rem; margin: 1rem 0; overflow-x: auto; }
        .ProseMirror pre code { background: none; padding: 0; color: #d4d4d4; font-size: 0.875rem; }
        .ProseMirror figure { display: flex; flex-direction: column; align-items: center; margin: 2rem 0; }
        .ProseMirror figure img { max-width: 100%; border-radius: 12px; margin: 0; }
        .ProseMirror figcaption { margin-top: 0.75rem; text-align: center; color: #737373; font-size: 0.875rem; font-style: italic; width: 100%; outline: none; }
        .ProseMirror figcaption.is-empty::before { content: "Type caption for image (optional)"; color: #525252; float: left; width: 100%; pointer-events: none; text-align: center; }
        .ProseMirror hr { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 2rem 0; }
        .ProseMirror a { color: #60a5fa; text-decoration: underline; text-underline-offset: 2px; }
        .ProseMirror mark { background: rgba(250,204,21,0.3); color: inherit; border-radius: 2px; padding: 1px 2px; }
        .ProseMirror iframe { width: 100%; aspect-ratio: 16/9; border-radius: 12px; margin: 1rem 0; border: 1px solid rgba(255,255,255,0.06); }
        .ProseMirror video { width: 100%; border-radius: 12px; margin: 1rem 0; }
        .loom-embed, .figma-embed, .video-embed { margin: 1rem 0; }
        
        /* Gapcursor Styles: Makes it easy to click between blocks */
        .ProseMirror-gapcursor {
          display: none;
          pointer-events: none;
          position: absolute;
          border-left: 2px solid #60a5fa;
          margin-top: 0.5rem;
          height: 1.5rem;
          animation: gapcursor-blink 1.1s steps(2, start) infinite;
        }
        .ProseMirror-focused .ProseMirror-gapcursor {
          display: block;
        }
        @keyframes gapcursor-blink {
          to { visibility: hidden; }
        }
        
        /* Ensure the editor always has a clickable head and tail */
        .ProseMirror {
          padding-top: 40px;
          padding-bottom: 200px;
        }

        /* Responsive padding for mobile */
        @media (max-width: 768px) {
          .ProseMirror {
            padding-top: 20px;
            padding-bottom: 100px;
          }
        }
      `}</style>
        </div>
    );
}

function ToolbarButton({
    active,
    onClick,
    title,
    children,
}: {
    active: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-lg transition-colors ${active
                ? "bg-blue-500/20 text-blue-400"
                : "text-neutral-400 hover:bg-white/10 hover:text-white"
                }`}
        >
            {children}
        </button>
    );
}
