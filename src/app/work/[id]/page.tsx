import { getProject, getProjectContent, listCaseStudies, listProjects } from "@/lib/cms/storage";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { ProjectDetails } from "@/components/ProjectDetails";
import { FooterMinimal } from "@/components/Footer";
import { Suspense } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
    const { id } = await params;

    const [project, content, allCaseStudies, allProjects] = await Promise.all([
        getProject(id),
        getProjectContent(id),
        listCaseStudies(id),
        listProjects()
    ]);

    if (!project) {
        notFound();
    }

    // Identify next project
    const currentIndex = allProjects.findIndex(p => p.id === id);
    const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
    // Don't show next project if it's the same one (only one project exists)
    const nextProjectToDisplay = allProjects.length > 1 ? nextProject : null;

    // Filter only published case studies for front-end
    const publishedCaseStudies = allCaseStudies.filter(s => s.status === 'published');

    return (
        <>
            <Suspense fallback={null}>
                <ProjectDetails 
                    project={project} 
                    content={content} 
                    caseStudies={publishedCaseStudies} 
                    nextProject={nextProjectToDisplay}
                />
            </Suspense>
            <FooterMinimal />
        </>
    );
}
