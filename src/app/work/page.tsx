import { listProjects } from "@/lib/cms/storage";
import { WorkClient } from "./WorkClient";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
    const projects = await listProjects();

    // Filter only published projects
    const publishedProjects = projects.filter(p => p.status === 'published');

    return <WorkClient projects={publishedProjects} />;
}
