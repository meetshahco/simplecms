import { listProjects } from "@/lib/cms/storage";
export const dynamic = "force-dynamic";
import { WorkClient } from "./WorkClient";
import { FooterMain } from "@/components/Footer";
export default async function WorkPage() {
    // Fetch all projects from the CMS
    const projects = await listProjects();

    // Filter only published projects for the front-end
    const publishedProjects = projects.filter(p => p.status === 'published');

    return (
        <>
            <WorkClient projects={publishedProjects} />
            <FooterMain />
        </>
    );
}
