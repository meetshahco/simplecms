import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { list } from "@vercel/blob";
import { readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        let media: { url: string; filename: string; uploadedAt: string }[] = [];

        // 1. Fetch from Vercel Blob if token is present
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                const { blobs } = await list();
                const blobMedia = blobs.map(blob => ({
                    url: blob.url,
                    filename: blob.pathname,
                    uploadedAt: blob.uploadedAt.toISOString(),
                }));
                media = [...media, ...blobMedia];
            } catch (err) {
                console.error("Vercel Blob list error:", err);
            }
        }

        // 2. Fetch from Local fallback
        if (existsSync(UPLOAD_DIR)) {
            try {
                const files = await readdir(UPLOAD_DIR);
                const validFiles = files.filter(f => !f.startsWith('.'));
                
                const fileStats = await Promise.all(
                    validFiles.map(async (filename) => {
                        const filePath = path.join(UPLOAD_DIR, filename);
                        const fileStat = await stat(filePath);
                        return {
                            url: `/uploads/${filename}`,
                            filename,
                            uploadedAt: fileStat.mtime.toISOString(),
                        };
                    })
                );
                
                media = [...media, ...fileStats];
            } catch (err) {
                console.error("Local filesystem list error:", err);
            }
        }

        // Sort by uploadedAt descending
        media.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

        return NextResponse.json({ media });
    } catch (error) {
        console.error("Fetch media error:", error);
        return NextResponse.json(
            { error: "Failed to fetch media" },
            { status: 500 }
        );
    }
}
