import { kv } from "@vercel/kv";

// ─── Guest Mode Logic ─────────────────────────────────────
const getIsGuestMode = async () => {
    // 1. Browser check
    if (typeof window !== "undefined") {
        return window.location.hostname.includes("simplecms.");
    }

    // 2. Server check with extreme safety
    try {
        const { headers } = await import("next/headers");
        const h = await headers(); // FIX: added await
        if (h.get("x-guest-mode") === "true") return true;

        const host = h.get("host") || h.get("x-forwarded-host") || "";
        if (host.includes("simplecms.")) return true;

        // 3. Check Session: If the logged in user is the guest demo user, force guest mode.
        // This prevents the demo login form on localhost from leaking the private portfolio data.
        const { auth } = await import("@/lib/auth");
        const session = await auth();
        if (session?.user?.email === "guest@meetshah.co") {
            return true;
        }
    } catch (e) {
        // Fallback or static generation
    }

    return process.env.NEXT_PUBLIC_GUEST_MODE === "true";
};


// In-memory store for guest mode (resets on server restart/cold start)
// For a true "reset on refresh" we would need client-side state,
// but for a demo, server-side in-memory is a good middle ground.
class VolatileStorage {
    private projects: Record<string, any> = {};
    private content: Record<string, string> = {};
    private caseStudies: Record<string, any> = {};
    private settings: any = null;

    constructor() {
        this.reset();
    }

    reset() {
        this.projects = {};
        this.content = {};
        this.caseStudies = {};
        this.settings = null;
    }

    getProjects() { return Object.values(this.projects); }
    getProject(id: string) { return this.projects[id]; }
    setProject(id: string, data: any) { this.projects[id] = data; }
    deleteProject(id: string) { delete this.projects[id]; }

    getContent(id: string) { return this.content[id] || ""; }
    setContent(id: string, data: string) { this.content[id] = data; }

    getCaseStudies() { return Object.values(this.caseStudies); }
    getCaseStudy(slug: string) { return this.caseStudies[slug]; }
    setCaseStudy(slug: string, data: any) { this.caseStudies[slug] = data; }
    deleteCaseStudy(slug: string) { delete this.caseStudies[slug]; }

    getSettings() { return this.settings; }
    setSettings(data: any) { this.settings = data; }
}

const guestStore = new VolatileStorage();

// ─── KV Logic ─────────────────────────────────────────────
const isKVEnabled = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// KV Keys
const KV_KEYS = {
    PROJECTS: "cms:projects",
    CASE_STUDIES: "cms:case_studies",
    SETTINGS: "cms:settings",
    PAGES: "cms:pages",
    // Content keys follow pattern: cms:content:[id]
    content: (id: string) => `cms:content:${id}`,
};

// ─── Project Types ────────────────────────────────────────
export interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    tags: string[];
    image: string;
    video: string;
    clientLogo?: string; // Optional SVG or image for Hero overlay
    metrics: { label: string; value: string }[];
    starred: boolean;
    status: "draft" | "published";
    archived?: boolean;
    order: number;
    caseStudyCount?: number; // Optional count for display
    createdAt: string;
    updatedAt: string;
}

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt" | "order">;

// ─── Case Study Types ─────────────────────────────────────
export interface CaseStudy {
    slug: string;
    title: string;
    parentProject: string;
    description: string;
    coverImage: string;
    publishedAt: string;
    status: "draft" | "published";
    archived?: boolean;
    order: number;
}

export type CaseStudyInput = Omit<CaseStudy, "slug" | "order">;

// ─── Settings Types ──────────────────────────────────────
export interface Settings {
    siteTitle: string;
    siteUrl: string;
    metaDescription: string;
    favicon?: string; // URL or base64 data for custom favicon
    socialLinks: {
        twitter: string;
        github: string;
        linkedin: string;
        medium?: string;
    };
    adminName: string;
    adminEmail: string;
}

export type SettingsInput = Partial<Settings>;

// ─── Helpers ─────────────────────────────────────────────
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/** Generate a unique slug by appending a short timestamp suffix if needed */
async function uniqueSlug(base: string, kvKey: string): Promise<string> {
    const slug = slugify(base) || "untitled";
    if (await getIsGuestMode()) return slug; // No unique check needed in demo
    if (!isKVEnabled) return slug;
    const existing = await kv.hget(kvKey, slug);
    if (!existing) return slug;

    // Append short unique suffix
    const suffix = Date.now().toString(36).slice(-5);
    return `${slug}-${suffix}`;
}

// ─── Project CRUD ─────────────────────────────────────────
export async function listProjects(): Promise<Project[]> {
    if (await getIsGuestMode()) {
        return guestStore.getProjects().filter((p) => !p.archived).sort((a, b) => a.order - b.order);
    }
    if (!isKVEnabled) return [];
    try {
        const projectsMap = await kv.hgetall(KV_KEYS.PROJECTS);
        if (!projectsMap) return [];
        const projects = Object.values(projectsMap) as Project[];
        return projects.filter((p) => !p.archived).sort((a, b) => a.order - b.order);
    } catch (e) {
        console.error("Error listing projects from KV:", e);
        return [];
    }
}

export async function listArchivedProjects(): Promise<Project[]> {
    if (await getIsGuestMode()) {
        return guestStore.getProjects().filter((p) => p.archived).sort((a, b) => a.order - b.order);
    }
    const projectsMap = await kv.hgetall(KV_KEYS.PROJECTS);
    if (!projectsMap) return [];
    const projects = Object.values(projectsMap) as Project[];
    return projects.filter((p) => p.archived).sort((a, b) => a.order - b.order);
}

export async function getProject(id: string): Promise<Project | null> {
    if (await getIsGuestMode()) {
        return guestStore.getProject(id) || null;
    }
    if (!isKVEnabled) return null;
    try {
        return await kv.hget<Project>(KV_KEYS.PROJECTS, id);
    } catch (e) {
        console.error(`Error getting project ${id} from KV:`, e);
        return null;
    }
}

export async function getProjectContent(id: string): Promise<string> {
    if (await getIsGuestMode()) {
        return guestStore.getContent(id);
    }
    if (!isKVEnabled) return "";
    try {
        return (await kv.get(KV_KEYS.content(id))) as string || "";
    } catch (e) {
        console.error(`Error getting project content ${id} from KV:`, e);
        return "";
    }
}

export async function createProject(input: ProjectInput, content?: string): Promise<Project> {
    const id = await uniqueSlug(input.title, KV_KEYS.PROJECTS);
    const existing = await listProjects();
    const now = new Date().toISOString();

    const project: Project = {
        ...input,
        id,
        order: existing.length,
        createdAt: now,
        updatedAt: now,
    };

    if (await getIsGuestMode()) {
        guestStore.setProject(id, project);
        if (content !== undefined) guestStore.setContent(id, content);
        return project;
    }

    await kv.hset(KV_KEYS.PROJECTS, { [id]: project });
    if (content !== undefined) {
        await kv.set(KV_KEYS.content(id), content);
    }
    return project;
}

export async function updateProject(id: string, updates: Partial<ProjectInput>, content?: string): Promise<Project | null> {
    const project = await getProject(id);
    if (!project) return null;

    const updated: Project = {
        ...project,
        ...updates,
        id, // don't allow id change
        updatedAt: new Date().toISOString(),
    };

    if (await getIsGuestMode()) {
        guestStore.setProject(id, updated);
        if (content !== undefined) guestStore.setContent(id, content);
        return updated;
    }

    await kv.hset(KV_KEYS.PROJECTS, { [id]: updated });
    if (content !== undefined) {
        await kv.set(KV_KEYS.content(id), content);
    }
    return updated;
}

export async function archiveProject(id: string): Promise<Project | null> {
    return updateProject(id, { archived: true } as Partial<ProjectInput>);
}

export async function restoreProject(id: string): Promise<Project | null> {
    return updateProject(id, { archived: false } as Partial<ProjectInput>);
}

export async function deleteProject(id: string): Promise<boolean> {
    const result = await archiveProject(id);
    return result !== null;
}

export async function permanentlyDeleteProject(id: string): Promise<boolean> {
    if (await getIsGuestMode()) {
        guestStore.deleteProject(id);
        return true;
    }
    await kv.hdel(KV_KEYS.PROJECTS, id);
    await kv.del(KV_KEYS.content(id));
    return true;
}

export async function toggleProjectStar(id: string): Promise<Project | null> {
    const project = await getProject(id);
    if (!project) return null;
    return updateProject(id, { starred: !project.starred } as Partial<ProjectInput>);
}

export async function reorderProjects(ids: string[]): Promise<void> {
    if (await getIsGuestMode()) {
        // Reordering in guest mode is currently UI-only or handled by memory store if needed
        // For now, prevent KV access
        return;
    }
    const now = new Date().toISOString();
    const projectsMap = await kv.hgetall(KV_KEYS.PROJECTS);
    if (!projectsMap) return;

    for (const [index, id] of ids.entries()) {
        const project = projectsMap[id] as Project;
        if (project) {
            project.order = index;
            project.updatedAt = now;
            await kv.hset(KV_KEYS.PROJECTS, { [id]: project });
        }
    }
}

// ─── Case Study CRUD ──────────────────────────────────────
export async function listCaseStudies(parentProject?: string): Promise<CaseStudy[]> {
    if (await getIsGuestMode()) {
        let studies = guestStore.getCaseStudies().filter((s) => !s.archived);
        if (parentProject) {
            studies = studies.filter((s) => s.parentProject === parentProject);
        }
        return studies.sort((a, b) => a.order - b.order);
    }
    if (!isKVEnabled) return [];
    try {
        const studiesMap = await kv.hgetall(KV_KEYS.CASE_STUDIES);
        if (!studiesMap) return [];
        let studies = Object.values(studiesMap) as CaseStudy[];
        studies = studies.filter((s) => !s.archived);
        if (parentProject) {
            studies = studies.filter((s) => s.parentProject === parentProject);
        }
        return studies.sort((a, b) => a.order - b.order);
    } catch (e) {
        console.error("Error listing case studies from KV:", e);
        return [];
    }
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
    if (await getIsGuestMode()) {
        return guestStore.getCaseStudy(slug) || null;
    }
    if (!isKVEnabled) return null;
    try {
        return await kv.hget<CaseStudy>(KV_KEYS.CASE_STUDIES, slug);
    } catch (e) {
        console.error(`Error getting case study ${slug} from KV:`, e);
        return null;
    }
}

export async function getCaseStudyContent(slug: string): Promise<string> {
    if (await getIsGuestMode()) {
        return guestStore.getContent(slug);
    }
    if (!isKVEnabled) return "";
    try {
        return (await kv.get(KV_KEYS.content(slug))) as string || "";
    } catch (e) {
        console.error(`Error getting case study content ${slug} from KV:`, e);
        return "";
    }
}

export async function createCaseStudy(input: CaseStudyInput, content: string): Promise<CaseStudy> {
    const slug = await uniqueSlug(input.title, KV_KEYS.CASE_STUDIES);
    const existing = await listCaseStudies(input.parentProject);

    const caseStudy: CaseStudy = {
        ...input,
        slug,
        order: existing.length,
    };

    if (await getIsGuestMode()) {
        guestStore.setCaseStudy(slug, caseStudy);
        guestStore.setContent(slug, content);
        return caseStudy;
    }

    await kv.hset(KV_KEYS.CASE_STUDIES, { [slug]: caseStudy });
    await kv.set(KV_KEYS.content(slug), content);
    return caseStudy;
}

export async function updateCaseStudy(
    slug: string,
    updates: Partial<CaseStudyInput>,
    content?: string
): Promise<CaseStudy | null> {
    const caseStudy = await getCaseStudy(slug);
    if (!caseStudy) return null;

    const updated: CaseStudy = {
        ...caseStudy,
        ...updates,
        slug, // don't allow slug change
    };

    if (await getIsGuestMode()) {
        guestStore.setCaseStudy(slug, updated);
        if (content !== undefined) guestStore.setContent(slug, content);
        return updated;
    }

    await kv.hset(KV_KEYS.CASE_STUDIES, { [slug]: updated });
    if (content !== undefined) {
        await kv.set(KV_KEYS.content(slug), content);
    }
    return updated;
}

export async function archiveCaseStudy(slug: string): Promise<CaseStudy | null> {
    return updateCaseStudy(slug, { archived: true } as Partial<CaseStudyInput>);
}

export async function restoreCaseStudy(slug: string): Promise<CaseStudy | null> {
    return updateCaseStudy(slug, { archived: false } as Partial<CaseStudyInput>);
}

export async function deleteCaseStudy(slug: string): Promise<boolean> {
    const result = await archiveCaseStudy(slug);
    return result !== null;
}

export async function permanentlyDeleteCaseStudy(slug: string): Promise<boolean> {
    if (await getIsGuestMode()) {
        guestStore.deleteCaseStudy(slug);
        return true;
    }
    await kv.hdel(KV_KEYS.CASE_STUDIES, slug);
    await kv.del(KV_KEYS.content(slug));
    return true;
}

// ─── Stats ────────────────────────────────────────────────
export async function getStats() {
    const projects = await listProjects();
    const caseStudies = await listCaseStudies();
    return {
        totalProjects: projects.length,
        starredProjects: projects.filter((p) => p.starred).length,
        totalCaseStudies: caseStudies.length,
    };
}

// ─── Settings ─────────────────────────────────────────────
const DEFAULT_SETTINGS: Settings = {
    siteTitle: "Meet Shah",
    siteUrl: "https://meetshah.design",
    metaDescription: "Product designer and developer based in India.",
    favicon: "", // Default empty
    socialLinks: {
        twitter: "https://twitter.com/meet",
        github: "https://github.com/meetshahco",
        linkedin: "https://linkedin.com/in/meet",
        medium: "https://medium.com/@meet",
    },
    adminName: "Meet Shah",
    adminEmail: "hey@meetshah.co",
};

export async function getSettings(): Promise<Settings> {
    if (await getIsGuestMode()) {
        return guestStore.getSettings() || DEFAULT_SETTINGS;
    }
    if (!isKVEnabled) return DEFAULT_SETTINGS;
    try {
        const settings = await kv.get<Settings>(KV_KEYS.SETTINGS);
        return settings || DEFAULT_SETTINGS;
    } catch (e) {
        console.error("Error getting settings from KV:", e);
        return DEFAULT_SETTINGS;
    }
}

export async function updateSettings(updates: SettingsInput): Promise<Settings> {
    const current = await getSettings();
    const updated = {
        ...current,
        ...updates,
        socialLinks: {
            ...current.socialLinks,
            ...updates.socialLinks,
        },
    };

    if (await getIsGuestMode()) {
        guestStore.setSettings(updated);
        return updated;
    }

    await kv.set(KV_KEYS.SETTINGS, updated);
    return updated;
}
