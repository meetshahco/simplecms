import { getProject, getProjectContent, listCaseStudies, getCaseStudyContent, listProjects } from "@/lib/cms/storage";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { ProjectDetails } from "@/components/ProjectDetails";
import { Suspense } from "react";

export default async function OldCaseStudyPage(props: {
    params: Promise<{ id: string; caseStudySlug: string }>;
}) {
    const { id, caseStudySlug } = await props.params;

    const [project, content, allCaseStudies, allProjects] = await Promise.all([
        getProject(id),
        getProjectContent(id),
        listCaseStudies(id),
        listProjects()
    ]);

    if (!project) {
        notFound();
    }

    // Filter only published case studies
    const publishedStudies = allCaseStudies.filter(s => s.status === 'published');

    // Fetch content for each case study
    const caseStudiesWithContent = await Promise.all(
        publishedStudies.map(async (study) => ({
            ...study,
            content: await getCaseStudyContent(study.slug)
        }))
    );

    // Identify next project
    const currentIndex = allProjects.findIndex(p => p.id === id);
    const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
    const nextProjectToDisplay = allProjects.length > 1 ? nextProject : null;

    return (
        <Suspense fallback={null}>
            <ProjectDetails 
                project={project} 
                content={content} 
                caseStudies={caseStudiesWithContent} 
                nextProject={nextProjectToDisplay}
                initialCaseStudySlug={caseStudySlug}
            />
        </Suspense>
    );
}
